import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { canonicalLinkHeader, getPostCanonicalUrl } from "./canonical";

const BASE_URL = "https://www.prisma.io";

test("a post is self-canonical under /blog", () => {
  assert.equal(
    getPostCanonicalUrl("/prisma-vs-netlify", undefined, BASE_URL),
    "https://www.prisma.io/blog/prisma-vs-netlify",
  );
  assert.equal(
    getPostCanonicalUrl("/prisma-vs-netlify", "  ", BASE_URL),
    "https://www.prisma.io/blog/prisma-vs-netlify",
  );
});

test("a cross-posted article names the original", () => {
  assert.equal(
    getPostCanonicalUrl(
      "/search-encrypted-data-with-prisma-8-and-cipherstash",
      "https://cipherstash.com/blog/search-encrypted-data-with-prisma-next-and-cipherstash",
      BASE_URL,
    ),
    "https://cipherstash.com/blog/search-encrypted-data-with-prisma-next-and-cipherstash",
  );
});

test("the Link value has the same shape as apps/site's Markdown route", () => {
  assert.equal(
    canonicalLinkHeader("https://www.prisma.io/blog/prisma-vs-netlify"),
    '<https://www.prisma.io/blog/prisma-vs-netlify>; rel="canonical"',
  );
});

test("the Markdown route sends the canonical Link on a post", () => {
  // The route reads the MDX collection, which node:test cannot load, so this
  // reads its source, as markdown-route-vary.test.ts does.
  const routeSource = readFileSync(
    new URL("../app/llms.mdx/[[...slug]]/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    routeSource,
    /Link: canonicalLinkHeader\(getPostCanonicalUrl\(page\.url, page\.data\.canonicalUrl\)\)/,
  );
});
