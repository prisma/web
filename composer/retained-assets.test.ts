import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, readdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { prepareRetainedAssets, type ReadPublicAsset } from "./retained-assets.ts";
import { withRetainedStatic } from "./gateway/retained-static.ts";
import { staticManifestPath, staticRetentionSeconds } from "./static-assets.ts";

async function fixture(t: { after(fn: () => Promise<void>): void }) {
  const root = await mkdtemp(join(tmpdir(), "web-retained-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const name of ["site", "docs", "blog", "handbook", "eclipse"]) {
    const dir = join(root, "apps", name, ".next", "static", "chunks");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "shared.js"), "shared bytes");
  }
  const blog = join(root, "apps", "blog", ".next", "static", "chunks");
  await writeFile(join(blog, "old chunk.js"), "old bundle");
  return { root, blog };
}

test("retention survives a deploy, deduplicates content, and drops only expired historical files", async (t) => {
  const { root, blog } = await fixture(t);
  const firstDir = join(root, "first");
  const first = await prepareRetainedAssets({ root, gateway: firstDir, enabled: true, now: 1000 });
  assert.equal(
    (await readdir(join(firstDir, "static"))).length,
    2,
    "identical files across apps share one stored blob",
  );
  const previous = withRetainedStatic(
    () => new Response(null, { status: 404 }),
    first,
    join(firstDir, "static"),
  );
  const read: ReadPublicAsset = async (input, init) => previous(new Request(input, init));
  await rm(join(blog, "old chunk.js"));
  await writeFile(join(blog, "new.js"), "new bundle");
  const secondDir = join(root, "second");
  const second = await prepareRetainedAssets({
    root,
    gateway: secondDir,
    enabled: true,
    previousOrigin: "https://previous.test",
    fetch: read,
    now: 2000,
  });
  const path = "/blog-static/_next/static/chunks/old%20chunk.js";
  assert.equal(second.assets[path].current, false);
  assert.equal(second.assets[path].expiresAt, 2000 + staticRetentionSeconds * 1000);
  assert.equal(second.blogStaleSeconds, 86_400);
  const next = withRetainedStatic(
    () => new Response("upstream current", { headers: { "content-encoding": "gzip" } }),
    second,
    join(secondDir, "static"),
  );
  assert.equal(await (await next(new Request(`https://next.test${path}`))).text(), "old bundle");
  assert.equal(
    await (
      await next(new Request("https://next.test/blog/_next/static/chunks/old%20chunk.js"))
    ).text(),
    "old bundle",
  );
  const current = await next(
    new Request("https://next.test/blog-static/_next/static/chunks/new.js"),
  );
  assert.equal(
    current.headers.get("content-encoding"),
    "gzip",
    "current files retain Next's response/compression",
  );
  assert.equal(await current.text(), "upstream current");
  const publish = withRetainedStatic(
    () => new Response(null, { status: 404 }),
    second,
    join(secondDir, "static"),
  );
  assert.equal(
    await (
      await publish(new Request("https://next.test/blog-static/_next/static/chunks/new.js"))
    ).text(),
    "new bundle",
    "a current-file 404 during promotion can use the published copy",
  );
  const third = await prepareRetainedAssets({
    root,
    gateway: join(root, "third"),
    enabled: true,
    previousOrigin: "https://previous.test",
    fetch: async (input, init) => publish(new Request(input, init)),
    now: 2001 + staticRetentionSeconds * 1000,
  });
  assert.equal(third.assets[path], undefined);
  assert.ok(third.assets["/blog-static/_next/static/chunks/new.js"]);
});

test("retained files preserve HEAD, ranges and conditional reads before range evaluation", async (t) => {
  const { root } = await fixture(t);
  const gateway = join(root, "gateway");
  const manifest = await prepareRetainedAssets({ root, gateway });
  const path = "/blog-static/_next/static/chunks/old%20chunk.js";
  manifest.assets[path].current = false;
  const handler = withRetainedStatic(
    () => new Response(null, { status: 404 }),
    manifest,
    join(gateway, "static"),
  );
  const request = (headers: Record<string, string> = {}, method = "GET") =>
    handler(new Request(`https://next.test${path}`, { method, headers }));
  const full = await request();
  const etag = full.headers.get("etag")!;
  assert.equal(await full.text(), "old bundle");
  const head = await request({}, "HEAD");
  assert.equal(head.headers.get("content-length"), "10");
  assert.equal(await head.text(), "");
  assert.equal(await (await request({ range: "bytes=0-2" })).text(), "old");
  assert.equal(await (await request({ range: "bytes=-6" })).text(), "bundle");
  const invalid = await request({ range: "bytes=99-100" });
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get("cache-control"), "no-store");
  const cached = await request({ "if-none-match": `W/${etag}`, range: "bytes=99-100" });
  assert.equal(cached.status, 304);
  assert.equal(cached.headers.has("content-length"), false);
  assert.equal((await request({ "if-match": '"different"' })).status, 412);
  assert.equal((await request({ range: "bytes=0-2", "if-range": '"different"' })).status, 200);
  const info = await handler(new Request(`https://next.test${staticManifestPath}`));
  assert.equal(info.headers.get("cache-control"), "no-store");
  assert.equal((await info.json()).version, 1);
  const hash = manifest.assets[path].sha256;
  assert.deepEqual(await readFile(join(gateway, "static", hash)), Buffer.from("old bundle"));
});

test("failed/corrupt history reads and immutable path collisions stop the build; legacy/bootstrap stays supported", async (t) => {
  const { root, blog } = await fixture(t);
  const firstDir = join(root, "first");
  const first = await prepareRetainedAssets({ root, gateway: firstDir });
  const previous = withRetainedStatic(
    () => new Response(null, { status: 404 }),
    first,
    join(firstDir, "static"),
  );
  const base = { root, enabled: true, previousOrigin: "https://previous.test" };
  await assert.rejects(
    prepareRetainedAssets({
      ...base,
      gateway: join(root, "failed"),
      fetch: async () => new Response(null, { status: 500 }),
    }),
    /HTTP 500/,
  );
  const legacy = await prepareRetainedAssets({
    ...base,
    gateway: join(root, "legacy"),
    fetch: async () => new Response(null, { status: 404 }),
  });
  assert.equal(legacy.blogStaleSeconds, 86_400);
  await writeFile(join(blog, "old chunk.js"), "changed bytes at same immutable URL");
  await assert.rejects(
    prepareRetainedAssets({
      ...base,
      gateway: join(root, "collision"),
      fetch: async (input, init) => previous(new Request(input, init)),
    }),
    /changed bytes/,
  );
  await rm(join(blog, "old chunk.js"));
  await assert.rejects(
    prepareRetainedAssets({
      ...base,
      gateway: join(root, "corrupt"),
      fetch: async (input, init) =>
        new URL(String(input)).pathname === staticManifestPath
          ? previous(new Request(input, init))
          : new Response("corrupt"),
    }),
    /digest\/size mismatch|declared size/,
  );
});

test("retention rejects over-budget history before downloading large blobs", async (t) => {
  const { root } = await fixture(t);
  let downloads = 0;
  await assert.rejects(
    prepareRetainedAssets({
      root,
      gateway: join(root, "oversized"),
      enabled: true,
      previousOrigin: "https://previous.test",
      fetch: async (input) => {
        if (new URL(input).pathname !== staticManifestPath) {
          downloads++;
          throw new Error("unexpected blob download");
        }
        return Response.json({
          version: 1,
          assets: {
            "/blog-static/_next/static/chunks/large.js": {
              sha256: "a".repeat(64),
              bytes: 851_000_000,
              contentType: "application/javascript; charset=utf-8",
              current: true,
            },
          },
        });
      },
    }),
    /gateway budget/,
  );
  assert.equal(downloads, 0);
});
