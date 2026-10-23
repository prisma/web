import assert from "node:assert/strict";
import { test } from "node:test";
import { withOriginCache } from "./cache.ts";

const request = (init: RequestInit = {}, path = "/blog") =>
  new Request(`https://web.test${path}`, { headers: { accept: "text/html" }, ...init });
const html = (headers: Record<string, string> = {}, status = 200) =>
  new Response("prerendered HTML", {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "s-maxage=31536000",
      "x-nextjs-prerender": "1, 1",
      vary: "rsc, next-router-state-tree, Accept-Encoding",
      etag: '"unchanged"',
      ...headers,
    },
  });

test("prerendered HTML has origin-owned CDN freshness and browser revalidation", async () => {
  const response = await withOriginCache(() => html())(request());
  assert.equal(response.headers.get("cdn-cache-control"), "public, max-age=60");
  assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
  assert.equal(response.headers.get("vary"), "rsc, next-router-state-tree, Accept-Encoding");
  assert.equal(response.headers.get("etag"), '"unchanged"');
  assert.equal(await response.text(), "prerendered HTML");
});

test("dynamic/private HTML, error pages and cookie-setting responses cannot opt into CDN storage", async () => {
  for (const upstream of [
    () => html({ "cache-control": "private, no-cache, no-store, max-age=0" }),
    () => html({ "cache-control": "s-maxage=31536000, private" }),
    () => html({ "cache-control": "s-maxage=0" }),
    () => html({ "x-nextjs-prerender": "" }),
    () => html({ "set-cookie": "session=secret; HttpOnly" }),
    () => html({}, 404),
    () => html({}, 500),
  ]) {
    const response = await withOriginCache(upstream)(request());
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  }
});

test("the HTML freshness cap does not extend a shorter framework TTL", async () => {
  const response = await withOriginCache(() => html({ "cache-control": "s-maxage=30" }))(request());
  assert.equal(response.headers.get("cdn-cache-control"), "public, max-age=30");
});

test("explicit app CDN policies remain authoritative", async () => {
  for (const header of ["cdn-cache-control", "cloudflare-cdn-cache-control"]) {
    for (const policy of ["no-store", "private", "public, max-age=10"]) {
      const source = html({ [header]: policy });
      assert.equal(await withOriginCache(() => source)(request()), source);
    }
  }
});

test("304 revalidation retains the HTML freshness cap without a Content-Type or body", async () => {
  const source = new Response(null, {
    status: 304,
    headers: {
      "cache-control": "s-maxage=31536000",
      "x-nextjs-prerender": "1",
      etag: '"unchanged"',
    },
  });
  const response = await withOriginCache(() => source)(
    request({
      headers: {
        accept: "text/html",
        "if-none-match": '"unchanged"',
      },
    }),
  );
  assert.equal(response.status, 304);
  assert.equal(response.body, null);
  assert.equal(response.headers.get("etag"), '"unchanged"');
  assert.equal(response.headers.get("cdn-cache-control"), "public, max-age=60");
  assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
});

test("authorization, cookies, Next navigation, Markdown and query variants bypass shared HTML caching", async () => {
  for (const name of [
    "authorization",
    "cookie",
    "rsc",
    "next-router-state-tree",
    "next-router-prefetch",
    "next-router-segment-prefetch",
    "next-url",
    "next-action",
    "x-prerender-revalidate",
  ]) {
    const response = await withOriginCache(() => html())(
      request({ headers: { accept: "text/html", [name]: "1" } }),
    );
    assert.equal(response.headers.get("cdn-cache-control"), "no-store", name);
  }
  for (const accept of [
    "*/*",
    "text/x-component",
    "text/html, text/markdown",
    "text/html, text/x-component",
  ]) {
    const response = await withOriginCache(() => html())(request({ headers: { accept } }));
    assert.equal(response.headers.get("cdn-cache-control"), "no-store", accept);
  }
  for (const path of ["/blog?_rsc=abc", "/blog?tag=orm", "/blog?utm_source=test"]) {
    const response = await withOriginCache(() => html())(request({}, path));
    assert.equal(response.headers.get("cdn-cache-control"), "no-store", path);
  }
  const response = await withOriginCache(() => html())(request({ method: "POST" }));
  assert.equal(response.headers.get("cdn-cache-control"), "no-store");
});

test("HTML bodies stay streamed, including compressed bytes and metadata", async () => {
  const bytes = new Uint8Array([31, 139, 8, 0, 7]);
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
  const source = new Response(body, {
    headers: {
      "content-type": "text/html",
      "content-encoding": "gzip",
      "content-length": String(bytes.length),
      "cache-control": "s-maxage=31536000",
      "x-nextjs-prerender": "1",
    },
  });
  const response = await withOriginCache(() => source)(request());
  assert.equal(source.bodyUsed, false);
  assert.equal(response.headers.get("content-encoding"), "gzip");
  assert.equal(response.headers.get("content-length"), "5");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});

test("static assets, RSC, Markdown, range and HEAD responses keep upstream policy and bytes", async () => {
  for (const contentType of [
    "text/css",
    "font/woff2",
    "image/png",
    "text/x-component",
    "text/markdown",
  ]) {
    const source = new Response("original", {
      status: 206,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
        "content-range": "bytes 0-7/20",
        "accept-ranges": "bytes",
      },
    });
    const response = await withOriginCache(() => source)(request());
    assert.equal(response, source);
    assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
    assert.equal(await response.text(), "original");
  }
  const source = new Response(null, {
    headers: {
      "content-type": "text/html",
      "cache-control": "s-maxage=31536000",
      "x-nextjs-prerender": "1",
    },
  });
  const head = await withOriginCache(() => source)(request({ method: "HEAD" }));
  assert.equal(head.body, null);
  assert.equal(head.headers.get("cdn-cache-control"), "public, max-age=60");
});
