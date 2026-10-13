import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { once } from "node:events";
import {
  compileProxy,
  createProxy,
  type ProxyFetch,
  type ProxyOptions,
  type SiteDefinition,
} from "./index.ts";
import { vercel, type VercelConfig, type VercelExport } from "./vercel.ts";
import { rawFetch } from "./node.ts";

const origins = {
  root: "http://root.test",
  docs: "http://docs.test",
  nested: "http://nested.test",
  blog: "http://blog.test",
};
const send: ProxyFetch = async (url) => new Response(String(url));
const site = (
  name: keyof typeof origins,
  mount: string,
  config: VercelConfig | VercelExport = {},
): SiteDefinition => ({ name, mount, routing: vercel(config) });
function proxy(
  sites: SiteDefinition[],
  fetch: ProxyFetch = send,
  options: Partial<ProxyOptions> = {},
) {
  return createProxy(compileProxy(sites), { origins, fetch, ...options });
}
const request = (path: string, init?: RequestInit) =>
  new Request(`https://public.test${path}`, init);

test("longest mount wins, parents run first, and sibling rules stay isolated", async () => {
  const handler = proxy([
    site("docs", "/docs", {
      redirects: [{ source: "/old", destination: "/new", permanent: true }],
    }),
    site("root", "/", {
      redirects: [{ source: "/docs/root-old", destination: "/home", permanent: true }],
    }),
    site("nested", "/docs/api"),
    site("blog", "/blog"),
  ]);
  for (const [path, target] of [
    ["/docs/api/key", "nested"],
    ["/docs/page", "docs"],
    ["/docs-other", "root"],
    ["/blog/old", "blog"],
  ])
    assert.equal(
      await (await handler(request(path))).text(),
      `${origins[target as keyof typeof origins]}${path}`,
    );
  assert.equal(
    (await handler(request("/docs/old"))).headers.get("location"),
    "https://public.test/docs/new",
  );
  assert.equal(
    (await handler(request("/docs/root-old"))).headers.get("location"),
    "https://public.test/home",
  );
});
test("mixed mounted rules keep explicit public destinations and mount relative ones", async () => {
  const handler = proxy([
    site("root", "/"),
    site("docs", "/docs", {
      redirects: [
        { source: "/docs/company", destination: "/company", permanent: true },
        { source: "/old/:path*", destination: "/new/:path*", permanent: false },
      ],
    }),
  ]);
  assert.equal(
    (await handler(request("/docs/company"))).headers.get("location"),
    "https://public.test/company",
  );
  const response = await handler(request("/docs/old/a/b?ref=1&ref=2"));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://public.test/docs/new/a/b?ref=1&ref=2");
});
test("explicit destination queries override only their own keys; fragments and encoding survive", async () => {
  const handler = proxy([
    site("root", "/", {
      redirects: [
        {
          source: "/old/:slug",
          destination: "/new/:slug?tag=fixed&tag=second#anchor",
          permanent: true,
        },
      ],
    }),
  ]);
  const response = await handler(request("/old/a%2Fb?tag=old&ref=a&ref=b&value=a%2Fb&empty="));
  const url = new URL(response.headers.get("location")!);
  assert.equal(url.pathname, "/new/a%2Fb");
  assert.equal(url.hash, "#anchor");
  assert.deepEqual(url.searchParams.getAll("tag"), ["fixed", "second"]);
  assert.deepEqual(url.searchParams.getAll("ref"), ["a", "b"]);
  assert.equal(url.searchParams.get("value"), "a/b");
  assert.equal(url.searchParams.get("empty"), "");
});
test("Vercel's default redirect is 308, and explicit 301/302/307 are retained", async () => {
  for (const status of [301, 302, 307, 308]) {
    const handler = proxy([
      site("root", "/", {
        redirects: [{ source: "/old", destination: "/new", statusCode: status }],
      }),
    ]);
    assert.equal((await handler(request("/old"))).status, status);
  }
  assert.equal(
    (
      await proxy([site("root", "/", { redirects: [{ source: "/old", destination: "/new" }] })])(
        request("/old"),
      )
    ).status,
    308,
  );
});
test("conditions capture host/header/cookie/query values, use the last repeated query, and honor missing", async () => {
  const handler = proxy([
    site("root", "/", {
      redirects: [
        {
          source: "/conditional",
          destination: "/:audience/:choice",
          permanent: false,
          has: [
            { type: "host", value: "public\\.test" },
            { type: "header", key: "X-Audience", value: "(?<audience>team|public)" },
            { type: "cookie", key: "session", value: "active" },
            { type: "query", key: "choice" },
          ],
          missing: [{ type: "header", key: "x-preview" }],
        },
      ],
    }),
  ]);
  const headers = { "x-audience": "team", cookie: "other=value; session=active" };
  const response = await handler(request("/conditional?choice=first&choice=a%26b", { headers }));
  assert.equal(new URL(response.headers.get("location")!).pathname, "/team/a%26b");
  for (const override of [
    { "x-audience": "unknown" },
    { cookie: "session=missing" },
    { "x-preview": "1" },
  ])
    assert.equal(
      (await handler(request("/conditional?choice=last", { headers: { ...headers, ...override } })))
        .status,
      200,
    );
});
test("header accumulation and internal continue rewrites retain exported table order", async () => {
  const handler = proxy([
    site("root", "/", {
      version: 3,
      routes: [
        { src: "^/old/(.*)$", dest: "/new/$1", continue: true, headers: { "X-First": "$1" } },
        { src: "^/new/(.*)$", headers: { "X-Second": "matched" }, continue: true },
      ],
    }),
  ]);
  const response = await handler(request("/old/a%20b?q=a&q=b"));
  assert.equal(await response.text(), "http://root.test/new/a%20b?q=a&q=b");
  assert.equal(response.headers.get("x-first"), "a%20b");
  assert.equal(response.headers.get("x-second"), "matched");
});
test("headers support wildcard substitution and conditions", async () => {
  const handler = proxy([
    site("root", "/", {
      headers: [
        {
          source: "/headers/:slug",
          has: [{ type: "header", key: "x-test", value: "yes" }],
          headers: [{ key: "X-Item", value: ":slug" }],
        },
      ],
    }),
  ]);
  assert.equal(
    (await handler(request("/headers/example", { headers: { "x-test": "yes" } }))).headers.get(
      "x-item",
    ),
    "example",
  );
  assert.equal((await handler(request("/headers/example"))).headers.get("x-item"), null);
});
test("exported external rewrites stream to a fixed destination, preserving queries and method", async () => {
  const handler = proxy(
    [
      site("root", "/", {
        version: 3,
        routes: [
          { src: "^/external/(.*)$", dest: "https://external.test/$1?fixed=1", methods: ["POST"] },
        ],
      }),
    ],
    async (url, init) => {
      assert.equal(String(url), "https://external.test/page?fixed=1&ref=a&ref=b");
      assert.equal(init.method, "POST");
      assert.equal(new Headers(init.headers).get("host"), "external.test");
      assert.equal(await new Response(init.body).text(), "streamed");
      return new Response("done");
    },
  );
  assert.equal(
    await (
      await handler(request("/external/page?ref=a&ref=b", { method: "POST", body: "streamed" }))
    ).text(),
    "done",
  );
});
test("filesystem and check phases require resource providers and respect hit/miss precedence", async () => {
  const definition = [
    site("root", "/", { rewrites: [{ source: "/:path*", destination: "/fallback/:path*" }] }),
  ];
  assert.throws(() => proxy(definition), /hasResource/);
  const handler = proxy(definition, send, {
    hasResource: { root: (path) => path === "/existing" || path.startsWith("/fallback/") },
  });
  assert.equal(await (await handler(request("/existing"))).text(), "http://root.test/existing");
  assert.equal(
    await (await handler(request("/missing"))).text(),
    "http://root.test/fallback/missing",
  );
});
test("exported service handoffs apply the child table without repeating parent rules", async () => {
  const handler = proxy([
    site("root", "/", {
      version: 3,
      routes: [{ src: "^/docs/old$", destination: { service: "docs" } }],
    }),
    site("docs", "/docs", {
      redirects: [{ source: "/docs/old", destination: "/docs/new", permanent: true }],
    }),
  ]);
  assert.equal(
    (await handler(request("/docs/old"))).headers.get("location"),
    "https://public.test/docs/new",
  );
});
test("explicit origin aliases rebind old external application URLs to service targets", async () => {
  const handler = proxy(
    [
      site("root", "/", {
        version: 3,
        routes: [{ src: "^/forward$", dest: "https://old-docs.test/docs/old" }],
      }),
      site("docs", "/docs", {
        redirects: [{ source: "/docs/old", destination: "/docs/new", permanent: true }],
      }),
    ],
    send,
    { originAliases: { "https://old-docs.test": "docs" } },
  );
  assert.equal(
    (await handler(request("/forward"))).headers.get("location"),
    "https://public.test/docs/new",
  );
});
test("parent framework claims take precedence over child redirects and middleware", async () => {
  const calls: string[] = [];
  const root = site("root", "/");
  root.routing = vercel(
    {},
    {
      nextjs: {
        redirects: [{ source: "/docs/old", destination: "/elsewhere" }],
        rewrites: {
          beforeFiles: [
            {
              source: "/:path*",
              destination: "https://external.test/:path*",
              has: [{ type: "host", value: "special.test" }],
            },
          ],
        },
      },
    },
  );
  const handler = proxy(
    [
      root,
      site("docs", "/docs", { redirects: [{ source: "/docs/old", destination: "/docs/new" }] }),
    ],
    async (url) => {
      calls.push(String(url));
      return new Response("framework");
    },
    {
      middleware: {
        root: () => {
          throw new Error("framework owns this middleware hop");
        },
      },
    },
  );
  assert.equal(await (await handler(request("/docs/old"))).text(), "framework");
  assert.equal(
    await (await handler(new Request("https://special.test/docs/page"))).text(),
    "framework",
  );
  assert.deepEqual(calls, ["http://root.test/docs/old", "http://root.test/docs/page"]);
});
test("middleware can intercept child requests before their redirects and schedule background work", async () => {
  const jobs: Promise<unknown>[] = [],
    visits: string[] = [];
  const handler = proxy(
    [
      site("root", "/"),
      site("docs", "/docs", { redirects: [{ source: "/docs/old", destination: "/docs/new" }] }),
    ],
    send,
    {
      waitUntil: (job) => jobs.push(job),
      middleware: {
        root: (ctx) => {
          visits.push(ctx.target.name);
          ctx.waitUntil(Promise.resolve("reported"));
          return new Response("blocked", { status: 403 });
        },
      },
    },
  );
  assert.equal((await handler(request("/docs/old"))).status, 403);
  assert.deepEqual(visits, ["docs"]);
  assert.equal(jobs.length, 1);
  await Promise.all(jobs);
});
test("exported middleware providers are required and can continue routing", async () => {
  const definition = [
    site("root", "/", {
      version: 3,
      routes: [{ src: "^/.*$", middlewarePath: "auth", continue: true }],
    }),
  ];
  assert.throws(() => proxy(definition), /middleware provider: auth/);
  let calls = 0;
  const handler = proxy(definition, send, {
    middleware: {
      auth: () => {
        calls++;
        return null;
      },
    },
  });
  assert.equal((await handler(request("/page"))).status, 200);
  assert.equal(calls, 1);
});
test("asset aliases and exact extension paths preserve base paths without prefix collisions", async () => {
  const docs = site("docs", "/docs");
  docs.paths = ["/docs.md"];
  docs.assets = [{ prefix: "/docs-static/_next", destination: "/docs/_next" }];
  const handler = proxy([site("root", "/"), docs]);
  assert.equal(
    await (await handler(request("/docs-static/_next/static/a.js"))).text(),
    "http://docs.test/docs/_next/static/a.js",
  );
  assert.equal(await (await handler(request("/docs.md"))).text(), "http://docs.test/docs.md");
  assert.equal(
    await (await handler(request("/docs-static-other"))).text(),
    "http://root.test/docs-static-other",
  );
});
test("request bodies, cookies, RSC, ranges, public Host, and forwarded HTTPS survive proxying", async () => {
  const handler = proxy(
    [site("root", "/"), site("docs", "/docs")],
    async (url, init) => {
      assert.equal(String(url), "http://docs.test/docs/api?q=a%2Fb");
      const headers = new Headers(init.headers);
      assert.equal(headers.get("host"), "public.test");
      assert.equal(headers.get("x-forwarded-host"), "public.test");
      assert.equal(headers.get("x-forwarded-proto"), "https");
      assert.equal(headers.get("rsc"), "1");
      assert.equal(headers.get("range"), "bytes=0-99");
      assert.equal(headers.get("cookie"), "session=old");
      assert.equal(headers.get("connection"), null);
      assert.equal(headers.get("x-hop"), null);
      assert.equal(await new Response(init.body).text(), "hello");
      const outgoing = new Headers({ vary: "RSC, Accept" });
      outgoing.append("set-cookie", "a=1; HttpOnly");
      outgoing.append("set-cookie", "b=2; HttpOnly");
      return new Response("done", { status: 201, headers: outgoing });
    },
    { trustForwardedProto: true },
  );
  const response = await handler(
    new Request("http://public.test/docs/api?q=a%2Fb", {
      method: "POST",
      body: "hello",
      headers: {
        "x-forwarded-proto": "https",
        rsc: "1",
        range: "bytes=0-99",
        cookie: "session=old",
        connection: "x-hop",
        "x-hop": "remove",
      },
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(response.headers.getSetCookie().length, 2);
  assert.equal(response.headers.get("vary"), "RSC, Accept");
});
test("streaming returns before the producer finishes", async () => {
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
  const handler = proxy([site("root", "/")], async () => new Response(stream));
  const reader = (await handler(request("/stream"))).body!.getReader();
  assert.equal(new TextDecoder().decode((await reader.read()).value), "first");
  finish();
  assert.equal(new TextDecoder().decode((await reader.read()).value), "last");
});
test("HEAD and compressed range response metadata are retained", async () => {
  const handler = proxy([site("root", "/")], async (_url, init) => {
    assert.equal(init.method, "HEAD");
    return new Response(null, {
      status: 206,
      headers: {
        "content-encoding": "gzip",
        "content-length": "100",
        "content-range": "bytes 0-99/500",
      },
    });
  });
  const response = await handler(
    request("/asset", { method: "HEAD", headers: { range: "bytes=0-99" } }),
  );
  assert.equal(response.body, null);
  assert.equal(response.headers.get("content-encoding"), "gzip");
  assert.equal(response.headers.get("content-length"), "100");
});
test("upstream absolute and relative redirects stay on the public entrypoint", async () => {
  for (const location of ["http://docs.test/docs/page?q=1", "/docs/page?q=1"]) {
    const handler = proxy(
      [site("root", "/"), site("docs", "/docs")],
      async () => new Response(null, { status: 307, headers: { location } }),
    );
    assert.equal(
      (await handler(request("/docs/old"))).headers.get("location"),
      "https://public.test/docs/page?q=1",
    );
  }
});
test("untrusted headers/encoded paths cannot choose an upstream; repeated slashes normalize safely", async () => {
  const handler = proxy([site("root", "/")], async (url) => {
    assert.equal(new URL(url).origin, origins.root);
    return new Response("ok");
  });
  assert.equal(
    (await handler(request("/%2F%2Fattacker.test/path", { headers: { host: "attacker.test" } })))
      .status,
    200,
  );
  const normalized = await handler(request("//attacker.test/path?q=a&q=b"));
  assert.equal(normalized.status, 308);
  assert.equal(
    normalized.headers.get("location"),
    "https://public.test/attacker.test/path?q=a&q=b",
  );
});
test("cancelled requests propagate their signal and return 499 on transport abort", async () => {
  const controller = new AbortController();
  const handler = proxy([site("root", "/")], async (_url, init) => {
    assert.ok(init.signal);
    controller.abort();
    throw new Error("aborted");
  });
  assert.equal((await handler(request("/cancel", { signal: controller.signal }))).status, 499);
});
test("unavailable upstreams produce 502 and identify the site through the error hook", async () => {
  const errors: string[] = [];
  const handler = proxy(
    [site("root", "/"), site("docs", "/docs")],
    async () => {
      throw new Error("down");
    },
    { onError: (_error, site) => errors.push(site) },
  );
  assert.equal((await handler(request("/docs/page"))).status, 502);
  assert.deepEqual(errors, ["docs"]);
});
test("invalid bindings, unsupported routes, dynamic rewrite origins, and duplicate mounts fail early", () => {
  assert.throws(() => compileProxy([site("root", "/"), site("docs", "/")]), /Duplicate/);
  assert.throws(
    () => proxy([site("root", "/", { version: 3, routes: [{ handle: "miss" }] })]),
    /unsupported phase/,
  );
  assert.throws(
    () => proxy([site("root", "/", { version: 3, routes: [{ src: "^/.*$", transforms: [] }] })]),
    /unsupported field transforms/,
  );
  assert.throws(
    () =>
      proxy([
        site("root", "/", {
          version: 3,
          routes: [{ src: "^/(.*)$", dest: "https://$1.test/page" }],
        }),
      ]),
    /fixed HTTP/,
  );
  assert.throws(
    () => proxy([site("root", "/")], send, { origins: { root: "http://root.test/base" } }),
    /without path/,
  );
});
test("relative exported routes are mounted and do not change the caller's config", async () => {
  const config: VercelExport = {
    version: 3,
    routes: [{ src: "^/old/(.*)$", headers: { Location: "/new/$1" }, status: 308 }],
  };
  const docs = site("docs", "/docs");
  docs.routing = vercel(config, { paths: "relative" });
  const handler = proxy([site("root", "/"), docs]);
  assert.equal(
    (await handler(request("/docs/old/page"))).headers.get("location"),
    "https://public.test/docs/new/page",
  );
  assert.equal(config.routes![0].src, "^/old/(.*)$");
});
test("other providers plug into the same runtime without importing Vercel", async () => {
  const root: SiteDefinition = {
    name: "root",
    mount: "/",
    routing: {
      name: "example-provider",
      compile: () => ({
        routes: [{ pattern: "^/old$", headers: { location: "/new" }, status: 301 }],
      }),
    },
  };
  assert.equal(
    (await proxy([root])(request("/old"))).headers.get("location"),
    "https://public.test/new",
  );
});
test("fragment sources are diagnosed and never pretended to be HTTP matches", async () => {
  const plan = compileProxy([
    site("root", "/", { redirects: [{ source: "/old#fragment", destination: "/new" }] }),
  ]);
  assert.equal(plan.diagnostics[0].code, "unreachable-source");
  assert.equal(
    (await createProxy(plan, { origins, fetch: send })(request("/old#fragment"))).status,
    200,
  );
});
test("Node raw transport keeps real gzip bytes, cookies, and HEAD metadata", async () => {
  const encoded = gzipSync("compressed response");
  const server = createServer((req, res) => {
    res.writeHead(200, {
      "content-encoding": "gzip",
      "content-length": String(encoded.length),
      "set-cookie": ["a=1", "b=2"],
    });
    res.end(req.method === "HEAD" ? undefined : encoded);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const address = server.address() as import("node:net").AddressInfo;
    const handler = proxy([site("root", "/")], rawFetch, {
      origins: { root: `http://127.0.0.1:${address.port}` },
    });
    const response = await handler(request("/gzip"));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), encoded);
    assert.equal(response.headers.getSetCookie().length, 2);
    const head = await handler(request("/gzip", { method: "HEAD" }));
    assert.equal(head.body, null);
    assert.equal(head.headers.get("content-length"), String(encoded.length));
  } finally {
    server.close();
    server.closeAllConnections();
    await once(server, "close");
  }
});

test("Vercel configs are case-sensitive and exported overrides remain explicit", async () => {
  const strict = proxy([
    site("root", "/", { redirects: [{ source: "/old", destination: "/new" }] }),
  ]);
  assert.equal((await strict(request("/Old"))).status, 200);
  const relaxed = proxy([
    site("root", "/", {
      version: 3,
      routes: [{ src: "^/old$", caseSensitive: false, status: 308, headers: { Location: "/new" } }],
    }),
  ]);
  assert.equal((await relaxed(request("/Old"))).status, 308);
});
test("service selection does not fall back to root when the forwarded path is outside the child's mount", async () => {
  const handler = proxy([
    site("root", "/", {
      version: 3,
      routes: [{ src: "^/forward$", destination: { service: "docs" } }],
    }),
    site("docs", "/docs"),
  ]);
  assert.equal(await (await handler(request("/forward"))).text(), "http://docs.test/forward");
});
test("routing-only Vercel service paths and non-JavaScript PCRE constructs are rejected", () => {
  assert.throws(
    () =>
      proxy([
        site("root", "/", {
          version: 3,
          routes: [{ src: "^/forward$", destination: { service: "docs", path: "/private" } }],
        }),
      ]),
    /routing-only service path/,
  );
  assert.throws(
    () =>
      compileProxy([
        {
          name: "root",
          mount: "/",
          routing: { name: "other", compile: () => ({ routes: [{ pattern: "^\\Aold\\z$" }] }) },
        },
      ]),
    /Unsupported regular expression/,
  );
});
test("service cycles fail with a diagnostic rather than looping", async () => {
  const errors: unknown[] = [];
  const handler = proxy(
    [
      site("root", "/", {
        version: 3,
        routes: [{ src: "^/loop$", destination: { service: "docs" } }],
      }),
      site("docs", "/docs", {
        version: 3,
        routes: [{ src: "^/loop$", destination: { service: "root" } }],
      }),
    ],
    send,
    { onError: (error) => errors.push(error) },
  );
  assert.equal((await handler(request("/loop"))).status, 502);
  assert.match(String(errors[0]), /handoff cycle/);
});
test("serialized plans preserve behavior and legacy vercel.json version 2 remains accepted", async () => {
  const plan = JSON.parse(
    JSON.stringify(
      compileProxy([
        site("root", "/", { version: 2, redirects: [{ source: "/old", destination: "/new" }] }),
      ]),
    ),
  );
  assert.equal(
    (await createProxy(plan, { origins, fetch: send })(request("/old"))).headers.get("location"),
    "https://public.test/new",
  );
});
test("forwarded TLS is trusted only when explicitly enabled", async () => {
  const definition = [site("root", "/", { redirects: [{ source: "/old", destination: "/new" }] })];
  for (const trustForwardedProto of [false, true]) {
    const handler = proxy(definition, send, { trustForwardedProto });
    const response = await handler(
      new Request("http://public.test/old", { headers: { "x-forwarded-proto": "https" } }),
    );
    assert.equal(
      response.headers.get("location"),
      `${trustForwardedProto ? "https" : "http"}://public.test/new`,
    );
  }
});
