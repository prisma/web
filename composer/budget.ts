import { readdir, lstat } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

// Leave room for bootstrap files, archive metadata, and runtime writes under
// Compute's 1 GB filesystem limit. Public assets are counted, never bundled
// into a JavaScript string or loaded into memory by the gateway.
export const artifactLimit = 900_000_000;
// Alchemy's upload guard is 256 MiB. Reserve space for the target's bootstrap
// and for small differences between tar encoders, separately from expanded size.
export const uploadLimit = 240_000_000;

export async function checkUploadBudget(directory: string, name: string, limit = uploadLimit) {
  const bytes = await new Promise<number>((resolve, reject) => {
    const archive = spawn("tar", ["-czf", "-", "-C", directory, "."], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let bytes = 0,
      error = "";
    archive.stdout.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
    });
    archive.stderr.on("data", (chunk: Buffer) => {
      error = (error + chunk.toString()).slice(-4000);
    });
    archive.on("error", reject);
    archive.on("close", (code) =>
      code === 0
        ? resolve(bytes)
        : reject(new Error(`Cannot measure ${name} upload archive: ${error}`)),
    );
  });
  console.log(
    `${name}: ${(bytes / 1_000_000).toFixed(1)} MB compressed (limit ${(limit / 1_000_000).toFixed(0)} MB)`,
  );
  if (bytes > limit)
    throw new Error(
      `${name} exceeds the compressed upload budget. Split public media before deploying.`,
    );
  return bytes;
}

export async function artifactSize(directory: string): Promise<number> {
  let bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) bytes += await artifactSize(file);
    else bytes += (await lstat(file)).size;
  }
  return bytes;
}

export async function checkBudget(directory: string, name: string) {
  const bytes = await artifactSize(directory);
  console.log(`${name}: ${(bytes / 1_000_000).toFixed(1)} MB assembled (limit 900 MB)`);
  if (bytes > artifactLimit) {
    throw new Error(
      `${name} exceeds the 900 MB artifact budget. Move public media to object storage before deploying.`,
    );
  }
  await checkUploadBudget(directory, name);
  return bytes;
}
