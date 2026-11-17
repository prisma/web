import assert from "node:assert/strict";
import { test } from "node:test";
import { withFileValidators } from "./file-validators.ts";
import { withOriginCache } from "./cache.ts";
import { byteRange } from "./ranges.ts";
import { withExternalDocuments } from "./external-documents.ts";
import { securityHeaders } from "../../packages/ui/security-headers.mjs";

const request = (path: string, headers: Record<string, string> = {}, method = "GET") =>
  new Request(`https://web.test${path}`, { method, headers: { accept: "text/html", ...headers } });

test("inventory files return 416 without asking Bun/Next to serve an impossible range", async () => {
  const files = new Map([["/blog/file.png", { bytes: 10, sha256: "hash" }]]);
  const handler = withFileValidators((incoming) => {
    assert.equal(incoming.headers.has("range"), false);
    return new Response("1234567890", {
      headers: { etag: 'W/"a-deadbeef"', "content-length": "10", "content-type": "image/png" },
    });
  }, files);
  for (const range of ["bytes=999999999-", "bytes=5-2", "bytes=-0"]) {
    const response = await handler(request("/blog/file.png", { range }));
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get("content-range"), "bytes */10");
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
    assert.equal(await response.text(), "");
  }
  const notModified = await handler(
    request("/blog/file.png", { range: "bytes=99-", "if-none-match": '"asset-v1-hash"' }),
  );
  assert.equal(notModified.status, 304, "preconditions precede ranges");
  assert.equal(
    (await handler(request("/blog/file.png", { range: "bytes=99-", "if-match": '"wrong"' })))
      .status,
    412,
  );
  const full = await handler(
    request("/blog/file.png", { range: "bytes=99-", "if-range": '"outdated"' }),
  );
  assert.equal(full.status, 200, "If-Range mismatch requests the full representation");
});

test("the shared byte-range parser bounds valid ranges and ignores multipart syntax", () => {
  assert.deepEqual(byteRange("bytes=2-999", 10), { start: 2, end: 9 });
  assert.deepEqual(byteRange("bytes=-3", 10), { start: 7, end: 9 });
  assert.equal(byteRange("bytes=0-", 0), "unsatisfiable");
  assert.equal(byteRange("bytes=0-1,4-5", 10), undefined);
  assert.equal(byteRange("items=0-1", 10), undefined);
});

test("mutable public machine-readable documents never inherit year-long edge or browser TTLs", async () => {
  for (const [path, type] of [
    ["/sitemap.xml", "application/xml"],
    ["/blog/rss.xml", "application/rss+xml"],
    ["/docs/sitemap.xml", "text/xml"],
    ["/llms-full.txt", "text/plain"],
    ["/docs/composer.md", "text/markdown"],
  ]) {
    const handler = withOriginCache(
      () =>
        new Response("public document", {
          headers: {
            "content-type": type,
            "cache-control": "public, max-age=31536000, s-maxage=31536000",
          },
        }),
    );
    const response = await handler(request(path));
    assert.equal(
      response.headers.get("cdn-cache-control"),
      "public, max-age=60, stale-while-revalidate=300",
      path,
    );
    assert.equal(response.headers.get("cache-control"), "public, max-age=0", path);
    const privateRead = await handler(request(path, { authorization: "Bearer test" }));
    assert.equal(privateRead.headers.get("cdn-cache-control"), "no-store", path);
  }
});

test("browser HTML does not gain a per-browser UA cache key, and UA-only Markdown is not shared", async () => {
  const html = withOriginCache(
    () =>
      new Response("html", {
        headers: {
          "content-type": "text/html",
          "cache-control": "s-maxage=31536000",
          "x-nextjs-prerender": "1",
        },
      }),
  );
  const browser = await html(request("/", { "user-agent": "Chrome/155" }));
  assert.ok(!browser.headers.get("vary")!.includes("user-agent"));
  assert.ok(browser.headers.get("vary")!.includes("accept"));
  const markdown = withOriginCache(
    () =>
      new Response("# Markdown", {
        headers: {
          "content-type": "text/markdown",
          vary: "Accept, User-Agent",
          "cache-control": "s-maxage=31536000",
        },
      }),
  );
  const agent = await markdown(request("/docs/composer", { "user-agent": "Claude-User/1.0" }));
  assert.equal(agent.headers.get("cdn-cache-control"), "no-store");
  assert.equal(agent.headers.get("cache-control"), "no-store");
});

test("404 HTML gets a brief edge lifetime only without credentials or session cookies", async () => {
  const handler = withOriginCache(
    () =>
      new Response("public not found", {
        status: 404,
        headers: {
          "content-type": "text/html",
          "cache-control": "private, no-store",
          "x-nextjs-prerender": "1",
        },
      }),
  );
  assert.equal(
    (await handler(request("/docs/missing"))).headers.get("cdn-cache-control"),
    "public, max-age=15",
  );
  for (const extra of [{ authorization: "Bearer test" }, { cookie: "session=test" }] as Record<
    string,
    string
  >[])
    assert.equal(
      (await handler(request("/docs/missing", extra))).headers.get("cdn-cache-control"),
      "no-store",
    );
  assert.equal(
    (await handler(request("/docs/api/missing"))).headers.get("cdn-cache-control"),
    "no-store",
  );
  const dynamic = withOriginCache(
    () =>
      new Response("private 404", {
        status: 404,
        headers: { "content-type": "text/html", "cache-control": "private, no-store" },
      }),
  );
  assert.equal((await dynamic(request("/missing"))).headers.get("cdn-cache-control"), "no-store");
});

test("implementation-only headers are stripped even on image optimizer and error responses", async () => {
  const response = await withOriginCache(
    () =>
      new Response("image", {
        headers: {
          "content-type": "image/webp",
          "x-composer-public-document": "1",
          "x-nextjs-cache": "HIT",
          "x-nextjs-prerender": "1",
          "x-nextjs-stale-time": "300",
          "x-powered-by": "Next.js",
          "x-robots-tag": "noindex",
        },
      }),
  )(request("/docs/_next/image?url=%2Fimage.png&w=640&q=75"));
  for (const name of [
    "x-composer-public-document",
    "x-nextjs-cache",
    "x-nextjs-prerender",
    "x-nextjs-stale-time",
    "x-powered-by",
  ])
    assert.equal(response.headers.has(name), false, name);
  assert.equal(
    response.headers.get("x-robots-tag"),
    "noindex",
    "never hide an ingress indexing blocker",
  );
});

test("Data Guide receives the shared security policy without making private responses cacheable", async () => {
  const handler = withExternalDocuments(
    () =>
      new Response("guide", {
        headers: {
          "content-type": "text/html",
          "cache-control": "public, max-age=0",
          "cdn-cache-control": "no-store",
        },
      }),
  );
  const publicRead = await handler(request("/dataguide/postgresql"));
  for (const { key, value } of securityHeaders) assert.equal(publicRead.headers.get(key), value);
  assert.equal(
    publicRead.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
  assert.equal(
    (await handler(request("/dataguide/postgresql", { cookie: "session=test" }))).headers.get(
      "cdn-cache-control",
    ),
    "no-store",
  );
  for (const headers of [
    { vary: "Cookie" },
    { "cache-control": "public, private, no-store" },
    { "set-cookie": "session=test" },
  ] as Record<string, string>[]) {
    const guarded = withExternalDocuments(
      () =>
        new Response("private", {
          headers: {
            "content-type": "text/html",
            "cache-control": "public",
            "cdn-cache-control": "no-store",
            ...headers,
          },
        }),
    );
    assert.equal(
      (await guarded(request("/dataguide/postgresql"))).headers.get("cdn-cache-control"),
      "no-store",
    );
  }
});
