import assert from "node:assert/strict";
import { test } from "node:test";
import { isCanonicalBlogPage, redirectedBlogPages } from "./sitemap-policy";

test("sitemaps omit retired URLs and externally syndicated copies, keeping the live lower-case Remix article", () => {
  const origin = "https://www.prisma.io";
  for (const url of redirectedBlogPages)
    assert.equal(isCanonicalBlogPage({ url, data: {} }, origin), false);
  assert.equal(
    isCanonicalBlogPage(
      {
        url: "/search-encrypted-data",
        data: { canonicalUrl: "https://cipherstash.com/blog/original" },
      },
      origin,
    ),
    false,
  );
  assert.equal(
    isCanonicalBlogPage(
      { url: "/fullstack-remix-prisma-mongodb-1-7d0bftxbmb6r", data: {} },
      origin,
    ),
    true,
  );
});
