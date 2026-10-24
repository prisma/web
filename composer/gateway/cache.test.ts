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
  assert.equal(
    response.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
  assert.equal(response.headers.get("cache-control"), "public, max-age=0");
  const vary = response.headers.get("vary")!.split(", ");
  for (const name of [
    "rsc",
    "next-router-state-tree",
    "accept-encoding",
    "accept",
    "user-agent",
    "authorization",
    "next-action",
    "x-prerender-revalidate",
  ])
    assert.ok(vary.includes(name), name);
  assert.equal(response.headers.get("etag"), '"unchanged"');
  assert.equal(await response.text(), "prerendered HTML");
});

test("alternating HTML, Markdown and uncached navigation keep one document Vary schema", async () => {
  const handler = withOriginCache((req) => {
    if (req.headers.has("rsc"))
      return new Response(null, {
        status: 307,
        headers: { location: "/?navigation", vary: "Accept" },
      });
    if (req.headers.get("accept") === "text/markdown")
      return new Response("# Public document", {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=60",
          vary: "Accept, User-Agent, RSC, Next-Router-State-Tree",
        },
      });
    return html();
  });
  const original = await handler(request());
  const schema = original.headers.get("vary");
  assert.equal(
    original.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
  for (const headers of [
    { accept: "text/markdown" },
    { accept: "text/x-component", rsc: "1" },
    { accept: "text/html", authorization: "Bearer test" },
    { accept: "text/html" },
  ] as Record<string, string>[]) {
    const response = await handler(request({ headers }));
    assert.equal(response.headers.get("vary"), schema);
    if (headers.rsc || headers.authorization)
      assert.equal(response.headers.get("cdn-cache-control"), "no-store");
    if (headers.accept === "text/markdown")
      assert.equal(await response.text(), "# Public document");
  }
});

test("dynamic/private HTML, error pages and cookie-setting responses cannot opt into CDN storage", async () => {
  for (const upstream of [
    () => html({ "cache-control": "private, no-cache, no-store, max-age=0" }),
    () => html({ "cache-control": "s-maxage=31536000, private" }),
    () => html({ "cache-control": "s-maxage=0" }),
    () => html({ "x-nextjs-prerender": "" }),
    () => html({ "set-cookie": "session=secret; HttpOnly" }),
    () => html({ vary: "*" }),
    () => html({ vary: "Accept-Language" }),
    () => html({}, 404),
    () => html({}, 500),
  ]) {
    const response = await withOriginCache(upstream)(request());
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  }
});

test("the HTML freshness cap does not extend a shorter framework TTL", async () => {
  const response = await withOriginCache(() => html({ "cache-control": "s-maxage=30" }))(request());
  assert.equal(
    response.headers.get("cdn-cache-control"),
    "public, max-age=30, stale-while-revalidate=300",
  );
});

test("explicit app CDN policies remain authoritative", async () => {
  for (const header of ["cdn-cache-control", "cloudflare-cdn-cache-control"]) {
    for (const policy of ["no-store", "private", "public, max-age=10"]) {
      const source = html({ [header]: policy });
      const result = await withOriginCache(() => source)(request());
      assert.equal(result.headers.get(header), policy);
      assert.equal(await result.text(), "prerendered HTML");
      assert.ok(result.headers.get("vary")!.includes("accept"));
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
  assert.equal(
    response.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
  assert.equal(response.headers.get("cache-control"), "public, max-age=0");
});

test("authorization, Next navigation, Markdown and RSC query variants bypass shared HTML caching", async () => {
  for (const name of [
    "authorization",
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
  for (const path of ["/blog?_rsc=abc", "/blog?%5Frsc=abc"]) {
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

test("cookies and full query keys can reuse invariant prerendered HTML", async () => {
  for (const path of ["/blog", "/blog?utm_source=example", "/blog?tag=orm"]) {
    const response = await withOriginCache(() => html())(
      request({ headers: { accept: "text/html", cookie: "cookieyes-consent=example" } }, path),
    );
    assert.equal(
      response.headers.get("cdn-cache-control"),
      "public, max-age=60, stale-while-revalidate=300",
    );
  }
});

test("explicit public MDX documents can use edge caching without a runtime full-route disk cache", async () => {
  const document = (extra: Record<string, string> = {}, status = 200) =>
    html(
      {
        "x-nextjs-prerender": "",
        "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
        "x-composer-public-document": "1",
        ...extra,
      },
      status,
    );
  const response = await withOriginCache(() => document())(request());
  assert.equal(
    response.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
  assert.equal(response.headers.get("cache-control"), "public, max-age=0");
  assert.equal(response.headers.has("x-composer-public-document"), false);
  const conditional = await withOriginCache(
    () =>
      new Response(null, {
        status: 304,
        headers: {
          "x-composer-public-document": "1",
          "cache-control": "private, no-cache, no-store, max-age=0",
        },
      }),
  )(request());
  assert.equal(
    conditional.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
  for (const status of [404, 500]) {
    const response = await withOriginCache(() => document({}, status))(request());
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  }
  for (const extra of [{ "set-cookie": "session=secret" }, { vary: "Cookie" }] as Record<
    string,
    string
  >[]) {
    const response = await withOriginCache(() => document(extra))(request());
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  }
  for (const header of ["authorization", "rsc", "next-router-prefetch"]) {
    const response = await withOriginCache(() => document())(
      request({ headers: { accept: "text/html", [header]: "1" } }),
    );
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  }
});

test("only actual public files get the bounded file policy, preserving raw ranges", async () => {
  const assets = new Map(
    ["/blog/original.gif", "/blog/a%40b.gif"].map((path) => [path, { bytes: 20, sha256: "test" }]),
  );
  const file = (extra: Record<string, string> = {}, status = 206) =>
    new Response("GIF8", {
      status,
      headers: {
        "content-type": "image/gif",
        "content-length": "4",
        "cache-control": "public, max-age=0",
        "content-range": "bytes 0-3/20",
        ...extra,
      },
    });
  const source = file();
  const result = await withOriginCache(() => source, assets)(request({}, "/blog/original.gif"));
  assert.equal(
    result.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300, no-transform",
  );
  assert.equal(result.headers.get("cache-control"), "public, max-age=0, no-transform");
  assert.equal(result.status, 206);
  assert.equal(result.headers.get("content-length"), "4");
  assert.equal(result.headers.get("content-range"), "bytes 0-3/20");
  assert.equal(await result.text(), "GIF8");
  const encoded = await withOriginCache(() => file(), assets)(request({}, "/blog/a@b.gif"));
  assert.equal(encoded.headers.get("cache-control"), "public, max-age=0, no-transform");
  const unknown = file();
  assert.equal(
    await withOriginCache(() => unknown, assets)(request({}, "/api/avatar.gif")),
    unknown,
  );
  const privateHeaders: Record<string, string>[] = [
    { "set-cookie": "private=1" },
    { "cache-control": "private, max-age=0" },
  ];
  for (const extra of privateHeaders) {
    const result = await withOriginCache(
      () => file(extra),
      assets,
    )(request({}, "/blog/original.gif"));
    assert.equal(result.headers.get("cdn-cache-control"), "no-store");
  }
  const explicit = file({ "cache-control": "public, max-age=3600" });
  assert.equal(
    await withOriginCache(() => explicit, assets)(request({}, "/blog/original.gif")),
    explicit,
  );
  const disabled = file({ "cache-control": "public, max-age=0, s-maxage=0" });
  assert.equal(
    await withOriginCache(() => disabled, assets)(request({}, "/blog/original.gif")),
    disabled,
  );
  const conditional = new Response(null, {
    status: 304,
    headers: { "cache-control": "public, max-age=0", etag: '"original"' },
  });
  const revalidated = await withOriginCache(
    () => conditional,
    assets,
  )(request({}, "/blog/original.gif"));
  assert.equal(revalidated.headers.get("cache-control"), "public, max-age=0, no-transform");
  assert.equal(revalidated.body, null);
  assert.equal(
    revalidated.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300, no-transform",
  );
});

test("static assets, Markdown, range and HEAD responses keep upstream policy and bytes", async () => {
  for (const contentType of ["text/css", "font/woff2", "image/png", "text/markdown"]) {
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
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("content-range"), "bytes 0-7/20");
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
  assert.equal(
    head.headers.get("cdn-cache-control"),
    "public, max-age=60, stale-while-revalidate=300",
  );
});

test("a generic CDN rule cannot store Next navigation's default long-lived responses", async () => {
  const variants: RequestInit[] = [
    { headers: { rsc: "1" } },
    { headers: { "next-router-prefetch": "1" } },
    { headers: { authorization: "Bearer private-test" } },
    {},
  ];
  for (const init of variants) {
    const response = await withOriginCache(
      () =>
        new Response("streamed RSC", {
          headers: {
            "content-type": "text/x-component",
            "cache-control": "s-maxage=31536000",
            vary: "RSC, Next-Router-State-Tree",
          },
        }),
    )(request(init));
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
    assert.equal(await response.text(), "streamed RSC");
  }
  const query = await withOriginCache(
    () =>
      new Response("prefetch", {
        headers: {
          "content-type": "application/octet-stream",
          "cache-control": "s-maxage=31536000",
        },
      }),
  )(request({}, "/blog?_rsc=navigation"));
  assert.equal(query.headers.get("cdn-cache-control"), "no-store");
});
