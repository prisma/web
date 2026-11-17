import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export async function publicImageVersions(directory: string): Promise<Record<string, string>> {
  const versions: Record<string, string> = {};
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile() && /\.(?:svg|png|jpe?g|webp|avif|gif|ico)$/i.test(entry.name)) {
        const hash = createHash("sha256");
        for await (const chunk of createReadStream(file)) hash.update(chunk);
        versions[
          `/blog/${relative(directory, file).split(sep).map(encodeURIComponent).join("/")}`
        ] = hash.digest("hex");
      }
    }
  }
  await walk(directory);
  return Object.fromEntries(Object.entries(versions).sort(([a], [b]) => a.localeCompare(b)));
}

/** Run at Next configuration/test startup; unchanged data does not disturb dev watchers. */
export async function writePublicImageVersions() {
  const file = fileURLToPath(new URL("../.generated/public-image-versions.json", import.meta.url));
  const data = JSON.stringify(
    await publicImageVersions(fileURLToPath(new URL("../public/", import.meta.url))),
  );
  let previous: string | undefined;
  try {
    previous = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (previous === data) return;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await writePublicImageVersions();
