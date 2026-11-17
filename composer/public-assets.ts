import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";

/** Actual public files only: never infer cacheability from an API's suffix. */
export async function publicAssetInventory(root: string, names: readonly string[]) {
  const paths: Record<string, { bytes: number; sha256: string }> = {};
  for (const name of names) {
    const directory = join(root, "apps", name, "public");
    const mount = name === "site" ? "" : `/${name}`;
    async function walk(dir: string) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = join(dir, entry.name);
        if (entry.isDirectory()) await walk(file);
        else if (entry.isFile()) {
          const hash = createHash("sha256");
          let bytes = 0;
          for await (const chunk of createReadStream(file)) {
            hash.update(chunk);
            bytes += chunk.length;
          }
          paths[
            `${mount}/${relative(directory, file).split(sep).map(encodeURIComponent).join("/")}`
          ] = { bytes, sha256: hash.digest("hex") };
        }
      }
    }
    await walk(directory);
  }
  return Object.fromEntries(Object.entries(paths).sort(([a], [b]) => a.localeCompare(b)));
}
