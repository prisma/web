import { test } from "node:test";
import assert from "node:assert/strict";
import { createGateway } from "./proxy.ts";
import { redirect, redirectMatcher, route } from "./routes.ts";

const origins = {
  site: "http://localhost:4000",
  docs: "http://localhost:4001",
  blog: "http://localhost:4002",
  handbook: "http://localhost:4003",
  eclipse: "http://localhost:4004",
};

test("the public entrypoint dispatches all five websites without prefix collisions", () => {
  for (const zone of ["docs", "blog", "handbook", "eclipse"] as const) {
    assert.equal(route(`/${zone}`).zone, zone);
    assert.equal(route(`/${zone}/nested/page?ignored`).zone, zone);
    assert.equal(route(`/${zone}-other`).zone, "site");
  }
  assert.equal(route("/").zone, "site");
  assert.equal(route("/docs.md").zone, "docs");
});

test("standalone Next.js receives static asset paths under its basePath", () => {
  for (const [zone, path] of Object.entries({
    site: "/_next/static/chunk.js",
    docs: "/docs/_next/static/chunk.js",
    blog: "/blog/_next/static/chunk.js",
    handbook: "/handbook/_next/static/chunk.js",
    eclipse: "/eclipse/_next/static/chunk.js",
  }))
    assert.deepEqual(route(`/${zone}-static/_next/static/chunk.js`), { zone, pathname: path });
});

test("Vercel redirects remain active with query strings and wildcard parameters", () => {
  assert.deepEqual(redirect(new URL("https://web.example/accelerate?utm_source=test")), {
    location: "https://web.example/docs/accelerate?utm_source=test",
    status: 308,
  });
  assert.deepEqual(redirect(new URL("https://web.example/docs/guide/a/b?utm_source=test")), {
    location: "https://web.example/docs/guides/a/b?utm_source=test",
    status: 308,
  });
  assert.equal(redirect(new URL("https://web.example/unknown")), undefined);
});

test("a redirect's explicit query takes priority and temporary redirects use 307", () => {
  const matcher = redirectMatcher([{ source: "/old/:slug", destination: "/new/:slug?tag=new" }]);
  assert.deepEqual(matcher(new URL("https://web.example/old/hello%20world?tag=old&ref=test")), {
    location: "https://web.example/new/hello%20world?tag=new&ref=test",
    status: 307,
  });
});

test("site-level legacy zone redirects run before dispatch and honor host conditions", async () => {
  const gateway = createGateway(origins, async () => {
    throw new Error("must redirect before proxying");
  }, [
    { source: "/blog/old-post", destination: "/docs/guides/example", statusCode: 308 },
    {
      source: "/:path*",
      destination: "https://www.prisma.io/:path*",
      statusCode: 307,
      has: [{ type: "host", value: "prismagraphql.com" }],
    },
  ]);
  const legacy = await gateway(new Request("https://web.example/blog/old-post?ref=test"));
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get("location"), "https://web.example/docs/guides/example?ref=test");
  const hostname = await gateway(new Request("https://prismagraphql.com/path"));
  assert.equal(hostname.status, 307);
  assert.equal(hostname.headers.get("location"), "https://www.prisma.io/path");
});

test("Next's internal trailing-slash redirect uses its compiled regex", () => {
  const matcher = redirectMatcher([
    {
      source: "/:path+/",
      destination: "/:path+",
      statusCode: 308,
      regex: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$",
    },
  ]);
  assert.equal(matcher(new URL("https://web.example/docs/page")), undefined);
  assert.equal(
    matcher(new URL("https://web.example/docs/page/"))?.location,
    "https://web.example/docs/page",
  );
});

test("conditional redirects require matching headers and cookies and honor missing conditions", async () => {
  const gateway = createGateway(origins, async () => new Response("no redirect"), [
    {
      source: "/docs/conditional",
      destination: "/docs/:audience",
      has: [
        { type: "header", key: "x-audience", value: "(?<audience>team|public)" },
        { type: "cookie", key: "session", value: "active" },
      ],
      missing: [{ type: "header", key: "x-preview" }],
    },
  ]);
  const url = "https://web.example/docs/conditional";
  const headers = { "x-audience": "team", cookie: "other=value; session=active" };
  const response = await gateway(new Request(url, { headers }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://web.example/docs/team");
  for (const unmatched of [
    { ...headers, "x-audience": "unknown" },
    { ...headers, cookie: "other=value" },
    { ...headers, "x-preview": "1" },
  ]) {
    assert.equal((await gateway(new Request(url, { headers: unmatched }))).status, 200);
  }
});

test("TLS termination preserves HTTPS in gateway redirects", async () => {
  const gateway = createGateway(origins);
  const response = await gateway(
    new Request("http://web.example/accelerate", { headers: { "x-forwarded-proto": "https" } }),
  );
  assert.equal(response.headers.get("location"), "https://web.example/docs/accelerate");
});

test("POST bodies, cookies, RSC headers, and forwarded origin reach the correct website", async () => {
  const gateway = createGateway(origins, async (input, init) => {
    assert.equal(String(input), "http://localhost:4001/docs/api/newsletter?tag=a%2Fb");
    assert.equal(init?.method, "POST");
    assert.equal(init?.redirect, "manual");
    const headers = new Headers(init?.headers);
    assert.equal(headers.get("host"), "web.example");
    assert.equal(headers.get("x-forwarded-host"), "web.example");
    assert.equal(headers.get("x-forwarded-proto"), "https");
    assert.equal(headers.get("cookie"), "session=value");
    assert.equal(headers.get("rsc"), "1");
    assert.equal(headers.get("connection"), null);
    assert.equal(headers.get("x-hop"), null);
    assert.equal(await new Response(init?.body).text(), "hello");
    return new Response("done", {
      status: 201,
      headers: { "set-cookie": "session=new; HttpOnly", vary: "RSC, Accept" },
    });
  });
  const response = await gateway(
    new Request("https://web.example/docs/api/newsletter?tag=a%2Fb", {
      method: "POST",
      body: "hello",
      headers: { cookie: "session=value", rsc: "1", connection: "x-hop", "x-hop": "remove" },
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("set-cookie"), "session=new; HttpOnly");
  assert.equal(response.headers.get("vary"), "RSC, Accept");
  assert.equal(await response.text(), "done");
});

test("response streams return before the upstream finishes sending", async () => {
  let finish!: () => void;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("first"));
      finish = () => {
        controller.enqueue(new TextEncoder().encode("last"));
        controller.close();
      };
    },
  });
  const gateway = createGateway(origins, async () => new Response(stream));
  const response = await gateway(new Request("https://web.example/blog/media.mp4"));
  const reader = response.body!.getReader();
  assert.equal(new TextDecoder().decode((await reader.read()).value), "first");
  finish();
  assert.equal(new TextDecoder().decode((await reader.read()).value), "last");
  assert.equal((await reader.read()).done, true);
});

test("upstream absolute redirects stay on the public entrypoint", async () => {
  const gateway = createGateway(
    origins,
    async () =>
      new Response(null, {
        status: 307,
        headers: { location: "http://localhost:4002/blog/tag/orm?q=1" },
      }),
  );
  const response = await gateway(new Request("https://web.example/blog/tag/unknown"));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://web.example/blog/tag/orm?q=1");
});

test("HEAD, range requests, and compressed assets keep their upstream semantics", async () => {
  const gateway = createGateway(origins, async (_input, init) => {
    assert.equal(init?.method, "HEAD");
    assert.equal(new Headers(init?.headers).get("range"), "bytes=0-99");
    assert.equal((init as RequestInit & { decompress: boolean }).decompress, false);
    return new Response(null, {
      status: 206,
      headers: {
        "content-encoding": "gzip",
        "content-length": "100",
        "content-range": "bytes 0-99/500",
      },
    });
  });
  const response = await gateway(
    new Request("https://web.example/blog/media.mp4", {
      method: "HEAD",
      headers: { range: "bytes=0-99" },
    }),
  );
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-encoding"), "gzip");
  assert.equal(response.headers.get("content-length"), "100");
});

test("untrusted path and host headers cannot choose an arbitrary upstream", async () => {
  const gateway = createGateway(origins, async (input) => {
    assert.equal(new URL(String(input)).origin, origins.site);
    return new Response("ok");
  });
  await gateway(
    new Request("https://web.example//attacker.example/path", {
      headers: { host: "attacker.example" },
    }),
  );
});
