import { readdir, lstat } from "node:fs/promises";
import path from "node:path";

// Leave room for bootstrap files, archive metadata, and runtime writes under
// Compute's 1 GB filesystem limit. Public assets are counted, never bundled
// into a JavaScript string or loaded into memory by the gateway.
export const artifactLimit = 900_000_000;

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
  return bytes;
}
