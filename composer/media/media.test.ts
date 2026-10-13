import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { partitionMedia, mediaLimit, mediaPath, type MediaFile } from "./catalog.ts";
import { blogMedia } from "./services.ts";
import { mediaNames } from "./service.ts";

test("media partitions retain every file once, deterministically within the upload budget", () => {
  assert.deepEqual(
    blogMedia.map((service) => service.name),
    [...mediaNames],
  );
  const files: MediaFile[] = Array.from({ length: 24 }, (_, i) => ({
    path: `folder/${i}.gif`,
    bytes: (i + 1) * 1_000_000,
    sha256: String(i),
    modified: 0,
  }));
  const names = ["a", "b", "c", "d"];
  const shards = partitionMedia(files, names);
  assert.deepEqual(shards, partitionMedia([...files].reverse(), names));
  assert.deepEqual(
    shards.flatMap((shard) => shard.files).sort((a, b) => a.path.localeCompare(b.path)),
    [...files].sort((a, b) => a.path.localeCompare(b.path)),
  );
  for (const shard of shards)
    assert.ok(shard.files.reduce((total, file) => total + file.bytes, 0) <= mediaLimit);
  assert.throws(
    () => partitionMedia([{ ...files[0], bytes: mediaLimit + 1 }], names),
    /shard budget/,
  );
  assert.equal(mediaPath("folder/image name.svg"), "/blog/folder/image%20name.svg");
});

test("real Bun media server streams original bytes, ranges, HEAD and cache validation without exposing other files", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "composer-media-"));
  const root = pathToFileURL(`${directory}/`).href;
  const contents = '<svg xmlns="http://www.w3.org/2000/svg">original media</svg>';
  const file: MediaFile = {
    path: "nested/image name.svg",
    bytes: Buffer.byteLength(contents),
    sha256: createHash("sha256").update(contents).digest("hex"),
    modified: Date.parse("2026-01-01T00:00:00Z"),
  };
  await mkdir(path.join(directory, "public/nested"), { recursive: true });
  await writeFile(path.join(directory, "public", file.path), contents);
  await writeFile(path.join(directory, "files.json"), JSON.stringify([file]));
  await writeFile(path.join(directory, "private.txt"), "not public");
  const source = new URL("./server.ts", import.meta.url).href;
  const child = spawn(
    "bun",
    [
      "--eval",
      `import { mediaHandler } from ${JSON.stringify(source)}; const server=Bun.serve({port:0,hostname:'127.0.0.1',fetch:await mediaHandler(new URL(${JSON.stringify(root)}))}); console.log(server.url.href);`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  try {
    const origin = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Media server startup timed out")), 10_000);
      let errors = "";
      child.stderr.on("data", (chunk) => {
        errors += chunk;
      });
      child.once("error", reject);
      child.once("exit", () => {
        clearTimeout(timer);
        reject(new Error(errors));
      });
      child.stdout.once("data", (chunk) => {
        clearTimeout(timer);
        resolve(chunk.toString().trim());
      });
    });
    const url = new URL(`${mediaPath(file.path)}?ref=a&ref=b`, origin);
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /image\/svg/);
    assert.equal(await response.text(), contents);
    const etag = response.headers.get("etag")!;
    assert.equal(etag, `"${file.sha256}"`);
    assert.equal((await fetch(url, { headers: { "if-none-match": `W/${etag}` } })).status, 304);
    assert.equal(
      (
        await fetch(url, {
          headers: { "if-modified-since": new Date(file.modified).toUTCString() },
        })
      ).status,
      304,
    );
    const head = await fetch(url, { method: "HEAD" });
    assert.equal(head.headers.get("content-length"), String(file.bytes));
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    for (const [range, expected] of [
      ["bytes=0-3", contents.slice(0, 4)],
      ["bytes=-4", contents.slice(-4)],
      ["bytes=4-999", contents.slice(4)],
    ] as const) {
      const part = await fetch(url, { headers: { range } });
      assert.equal(part.status, 206);
      assert.equal(await part.text(), expected);
    }
    assert.equal((await fetch(url, { headers: { range: "bytes=999-1000" } })).status, 416);
    assert.equal(
      (await fetch(url, { headers: { range: "bytes=0-3", "if-range": '"old"' } })).status,
      200,
    );
    assert.equal((await fetch(url, { method: "POST" })).status, 405);
    for (const file of ["/blog/private.txt", "/blog/files.json", "/blog/%2e%2e/private.txt"])
      assert.equal((await fetch(new URL(file, origin))).status, 404);
  } finally {
    child.kill();
    await rm(directory, { recursive: true, force: true });
  }
});
