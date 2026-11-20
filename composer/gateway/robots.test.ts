import assert from "node:assert/strict";
import { test } from "node:test";
import { withRobotsDirectives } from "./robots.ts";

const request = (path: string) =>
  new Request(`https://web.test${path}`, { headers: { accept: "text/html" } });

const noindexed = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      "content-type": "text/html",
      "cache-control": "s-maxage=31536000",
      "cdn-cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });

test("the internal ingress noindex never reaches the pages a custom domain serves", async () => {
  const response = await withRobotsDirectives(() => noindexed("page"))(request("/"));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "page");
  for (const name of ["content-type", "cache-control", "cdn-cache-control"])
    assert.equal(response.headers.get(name), noindexed("").headers.get(name), name);
  assert.equal(
    response.headers.has("x-robots-tag"),
    false,
    "the ingress noindex protects generated hosts, not this content",
  );
});

test("app-intentional directives survive: social cards stay unindexable", async () => {
  const handler = withRobotsDirectives(() => noindexed("card"));
  for (const path of ["/og/home", "/docs/og/home", "/blog/og/home"]) {
    const response = await handler(request(path));
    assert.equal(response.headers.get("x-robots-tag"), "noindex", path);
  }
});

test("app-intentional directives survive: the console analytics page stays private", async () => {
  const response = await withRobotsDirectives(
    () =>
      new Response("analytics", {
        headers: { "x-robots-tag": "noindex, nofollow" },
      }),
  )(request("/console-analytics.html"));
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
});

test("zones without an intentional rule lose the ingress noindex", async () => {
  const handler = withRobotsDirectives(() => noindexed("page"));
  for (const path of ["/handbook/og/home", "/docsog/home", "/console-analytics", "/og.html/x"]) {
    const response = await handler(request(path));
    assert.equal(response.headers.has("x-robots-tag"), false, path);
  }
});

test("draft markdown keeps its own conditional noindex", async () => {
  const handler = withRobotsDirectives(() => noindexed("draft"));
  for (const path of ["/blog/some-post.md", "/blog/some-post.mdx", "/blog/llms.mdx/some-post.md"]) {
    const response = await handler(request(path));
    assert.equal(response.headers.get("x-robots-tag"), "noindex", path);
  }
});

test("agent-negotiated markdown keeps its directives on the plain post URL", async () => {
  const handler = withRobotsDirectives(
    () =>
      new Response("draft", {
        headers: {
          "x-robots-tag": "noindex",
          "x-prisma-agent-markdown": "accept",
          vary: "Accept, User-Agent",
        },
      }),
  );
  const response = await handler(request("/blog/some-draft"));
  assert.equal(response.headers.get("x-robots-tag"), "noindex");
  assert.equal(response.headers.get("x-prisma-agent-markdown"), "accept");
});

test("html pages next to the markdown renditions are still stripped", async () => {
  const handler = withRobotsDirectives(() => noindexed("page"));
  for (const path of ["/blog/some-post", "/blog/llms.mdxextra", "/blog/some-post.md/extra"]) {
    const response = await handler(request(path));
    assert.equal(response.headers.has("x-robots-tag"), false, path);
  }
});

test("responses without robots directives pass through untouched", async () => {
  const upstream = new Response("clean", { headers: { "content-type": "text/html" } });
  const response = await withRobotsDirectives(() => upstream)(request("/"));
  assert.equal(response, upstream, "no rebuild when there is nothing to rewrite");
});
