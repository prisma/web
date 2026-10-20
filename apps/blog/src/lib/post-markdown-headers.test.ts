import assert from "node:assert/strict";
import test from "node:test";
// Next's own compiled path-to-regexp: the same compiler that turns a header
// `source` into a regex at build time.
// @ts-expect-error No types ship for the compiled copy.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";

import nextConfig, { POST_HEADER_SOURCE } from "../../next.config.mjs";
import { getPostSlug } from "./agent-markdown";

const { pathToRegexp } = pathToRegexpModule as {
  pathToRegexp: (source: string) => RegExp;
};

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

const rules = (await nextConfig.headers?.()) as HeaderRule[];
const postRule = rules.find((rule) => rule.source === POST_HEADER_SOURCE);

test("a post sends a Link header naming its Markdown and the blog llms.txt", () => {
  assert.ok(postRule, "no header rule for post URLs");
  assert.deepEqual(postRule.headers, [
    {
      key: "Link",
      value:
        '</blog/:slug.md>; rel="alternate"; type="text/markdown", </blog/llms.txt>; rel="llms-txt"',
    },
  ]);
});

test("every page names the blog llms.txt, and the post rule comes after it so it wins", () => {
  const catchAll = rules.findIndex((rule) => rule.source === "/:path*");
  assert.ok(catchAll >= 0);
  assert.ok(
    rules[catchAll].headers.some(
      (header) => header.key === "Link" && header.value === '</blog/llms.txt>; rel="llms-txt"',
    ),
  );
  assert.ok(rules.indexOf(postRule!) > catchAll);
});

test("the post rule matches exactly the URLs the agent proxy treats as posts", () => {
  const pattern = pathToRegexp(POST_HEADER_SOURCE);

  for (const pathname of [
    "/prisma-vs-netlify",
    "/where-to-host-typescript-frontend-node-api-postgres",
    "/nestjs-prisma-authentication-7D056s1s0k3l",
    "/testing-series-1-8eRB5p0Y8o",
    "/",
    "/series",
    "/series/prisma-compute",
    "/tag/orm",
    "/author/gregory-boch",
    "/page/2",
    "/api",
    "/og",
    "/sitemap",
    "/llms",
    "/rss.xml",
    "/llms.txt",
    "/prisma-vs-netlify.md",
    "/blog-static",
  ]) {
    assert.equal(
      pattern.test(pathname),
      getPostSlug(pathname) !== undefined,
      `${pathname}: the Link header rule and getPostSlug disagree`,
    );
  }
});
