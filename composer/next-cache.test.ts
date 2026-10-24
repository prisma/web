import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import * as fs from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const ComputeCache = createRequire(import.meta.url)("./next-cache.cjs");
const image = (bytes: number) => ({
  kind: "IMAGE",
  buffer: Buffer.alloc(bytes),
  etag: "content-digest",
  upstreamEtag: "source-digest",
  extension: "webp",
  revalidate: 14_400,
});

test("image cache retains Next's binary value and timestamp without filesystem writes", async () => {
  const cache = new ComputeCache({ maxMemoryCacheSize: 0 });
  const value = image(1024);
  await cache.set("image", value, {});
  const hit = await cache.get("image", { kind: "IMAGE" });
  assert.equal(hit.value, value);
  assert.ok(hit.lastModified <= Date.now());
  assert.ok(hit.lastModified > Date.now() - 1000);
  await cache.set("image", null, {});
  assert.equal(await cache.get("image", { kind: "IMAGE" }), null);
});

test("image LRU bounds payload/metadata and evicts least-recently-read entries", async () => {
  const cache = new ComputeCache({ maxMemoryCacheSize: 0 });
  await cache.set("a", image(6 * 1024 * 1024), {});
  await cache.set("b", image(6 * 1024 * 1024), {});
  await cache.get("a", { kind: "IMAGE" });
  await cache.set("c", image(6 * 1024 * 1024), {});
  assert.equal(await cache.get("b", { kind: "IMAGE" }), null);
  assert.ok(await cache.get("a", { kind: "IMAGE" }));
  await cache.set("oversize", image(17 * 1024 * 1024), {});
  assert.equal(await cache.get("oversize", { kind: "IMAGE" }), null);
  assert.ok(await cache.get("a", { kind: "IMAGE" }));
  assert.ok(cache.imageBytes <= 16 * 1024 * 1024);

  for (let i = 0; i < 300; i++) await cache.set(String(i), image(1), {});
  assert.equal(cache.images.size, 256);
});

test("prerendered seed reads and page/fetch memory caching survive on read-only storage", async (t) => {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "composer-readonly-cache-"));
  try {
    await fs.mkdir(path.join(dir, "pages"));
    await fs.writeFile(path.join(dir, "pages/seed.html"), "<h1>Seed</h1>");
    await fs.writeFile(path.join(dir, "pages/seed.json"), '{"seed":true}');
    const cache = new ComputeCache({
      fs: {
        ...fs,
        mkdir() {
          throw new Error("runtime mkdir forbidden");
        },
        writeFile() {
          throw new Error("runtime write forbidden");
        },
      },
      serverDistDir: dir,
      flushToDisk: true,
      maxMemoryCacheSize: 1024 * 1024,
      revalidatedTags: [],
    });
    const seed = await cache.get("seed", { kind: "PAGES" });
    assert.equal(seed.value.html, "<h1>Seed</h1>");
    assert.deepEqual(seed.value.pageData, { seed: true });
    const page = { ...seed.value, html: "<h1>Updated</h1>" };
    await cache.set("seed", page, {});
    assert.equal((await cache.get("seed", { kind: "PAGES" })).value.html, page.html);
    const fetch = {
      kind: "FETCH",
      data: { body: "cached", headers: {}, status: 200 },
      revalidate: 60,
      tags: ["data"],
    };
    // Next invalidates only entries created strictly before the tag timestamp.
    const now = Date.now();
    const clock = t.mock.method(Date, "now", () => now - 1000);
    await cache.set("fetch", fetch, { fetchCache: true });
    clock.mock.restore();
    assert.deepEqual((await cache.get("fetch", { kind: "FETCH", tags: ["data"] })).value, fetch);
    await cache.revalidateTag("data");
    assert.equal(await cache.get("fetch", { kind: "FETCH", tags: ["data"] }), null);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
