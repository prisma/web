import { readdir, stat, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mediaNames } from "./service.ts";
import { partitionMedia, type MediaFile } from "./catalog.ts";

export async function buildBlogMedia() {
  const source = fileURLToPath(new URL("../../apps/blog/public/", import.meta.url));
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const files: MediaFile[] = [];
  async function collect(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await collect(file);
      else if (entry.isFile()) {
        const info = await stat(file);
        const hash = createHash("sha256");
        for await (const bytes of createReadStream(file)) hash.update(bytes);
        files.push({
          path: path.relative(source, file).split(path.sep).join("/"),
          bytes: info.size,
          sha256: hash.digest("hex"),
          modified: info.mtimeMs,
        });
      } else throw new Error(`Blog public media must be a regular file: ${file}`);
    }
  }
  await collect(source);
  const shards = partitionMedia(files, mediaNames);
  for (const [index, shard] of shards.entries()) {
    const directory = path.join(root, "dist/composer", shard.name);
    await rm(directory, { recursive: true, force: true });
    await mkdir(directory, { recursive: true });
    const entry = path.join(directory, "entry.ts");
    await writeFile(
      entry,
      `import { startMediaServer } from '../../../composer/media/server.ts';\nawait startMediaServer(${index});\n`,
    );
    const result = spawnSync(
      "bun",
      ["build", entry, "--target=bun", `--outfile=${path.join(directory, "server.mjs")}`],
      { cwd: root, stdio: "inherit" },
    );
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Media bundle ${shard.name} failed`);
    await rm(entry);
    for (const file of shard.files) {
      const target = path.join(directory, "public", file.path);
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(path.join(source, file.path), target);
    }
    await writeFile(path.join(directory, "files.json"), JSON.stringify(shard.files));
  }
  return shards;
}
