import { test } from "node:test";
import assert from "node:assert/strict";
import { createProxy, type ProxyFetch } from "@prisma/proxy";
import { gatewaySites } from "./config.ts";
const origins = Object.fromEntries(
  ["site", "docs", "blog", "handbook", "eclipse"].map((name) => [name, `http://${name}.test`]),
);
const send: ProxyFetch = async (input) => new Response(String(input));
test("blog media, unknown files and framework redirects stay with the blog server", async () => {
  const proxy = createProxy(gatewaySites(new URL("../../apps/", import.meta.url), {}), {
    origins,
    fetch: send,
  });
  for (const pathname of [
    "/blog/post/image%20name.svg",
    "/blog/post",
    "/blog/post/unknown.svg",
    "/blog/robots.txt",
  ]) {
    const url = `${pathname}?ref=a&ref=b`;
    assert.equal(
      await (await proxy(new Request(`https://web.test${url}`))).text(),
      `http://blog.test${url}`,
    );
  }
});
test("all five web projects and their asset aliases dispatch through the library", async () => {
  const proxy = createProxy(gatewaySites(new URL("../../apps/", import.meta.url), {}), {
    origins,
    fetch: send,
  });
  for (const name of Object.keys(origins)) {
    const pathname = name === "site" ? "/" : `/${name}`;
    assert.equal(
      await (await proxy(new Request(`https://web.test${pathname}`))).text(),
      `${origins[name]}${pathname}`,
    );
    const response = await proxy(
      new Request(`https://web.test/${name}-static/_next/static/chunk.js`),
    );
    assert.equal(
      await response.text(),
      `${origins[name]}${name === "site" ? "" : `/${name}`}/_next/static/chunk.js`,
    );
  }
  for (const pathname of ["/docs.md", "/docs.mdx", "/blog.md", "/handbook.md", "/eclipse.md"])
    assert.equal(
      new URL(await (await proxy(new Request(`https://web.test${pathname}`))).text()).hostname,
      `${pathname.split(/[/.]/)[1]}.test`,
    );
  assert.equal(
    await (await proxy(new Request("https://web.test/docs-other"))).text(),
    "http://site.test/docs-other",
  );
});
test("actual Vercel config imports retain marketing destinations and repeated queries", async () => {
  const proxy = createProxy(gatewaySites(new URL("../../apps/", import.meta.url), {}), {
    origins,
    fetch: send,
  });
  for (const [source, dest] of [
    ["/accelerate", "/docs/accelerate"],
    ["/docs/showcase", "/customers"],
    ["/docs/about/prisma", "/company"],
    ["/docs/guide/a/b", "/docs/guides/a/b"],
  ]) {
    const response = await proxy(new Request(`https://web.test${source}?ref=a&ref=b`));
    assert.equal(response.status, 308, source);
    assert.equal(response.headers.get("location"), `https://web.test${dest}?ref=a&ref=b`, source);
  }
});
test("site Next rules and hostname rewrites preempt child configs, retaining the Next response", async () => {
  const sites = gatewaySites(new URL("../../apps/", import.meta.url), {
    redirects: [{ source: "/docs/showcase", destination: "/framework-owned" }],
    rewrites: {
      beforeFiles: [
        {
          source: "/:path*",
          destination: "https://accelerate-speed-test.vercel.app/:path*",
          has: [{ type: "host", value: "accelerate-speed-test.prisma.io" }],
        },
      ],
    },
  });
  const proxy = createProxy(sites, {
    origins,
    fetch: async (url, init) => {
      assert.equal(new URL(url).origin, origins.site);
      assert.equal(new Headers(init.headers).get("host"), new URL(origins.site).host);
      assert.ok(
        ["web.test", "accelerate-speed-test.prisma.io"].includes(
          new Headers(init.headers).get("x-forwarded-host")!,
        ),
      );
      return new Response(null, {
        status: 307,
        headers: { location: "/framework-owned", "x-framework": "retained" },
      });
    },
  });
  for (const host of ["web.test", "accelerate-speed-test.prisma.io"]) {
    const response = await proxy(new Request(`https://${host}/docs/showcase`));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), `https://${host}/framework-owned`);
    assert.equal(response.headers.get("x-framework"), "retained");
  }
});
