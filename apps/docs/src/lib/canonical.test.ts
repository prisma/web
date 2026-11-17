import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { absoluteCanonicalUrl, canonicalLinkHeader, resolveCanonicalUrl } from "./canonical";

test("pages are self-canonical without frontmatter", () => {
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt"),
    "/docs/orm/v6/more/troubleshooting/nuxt",
  );
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt", "   "),
    "/docs/orm/v6/more/troubleshooting/nuxt",
  );
});

test("a frontmatter canonical gets the docs base path", () => {
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt", "/orm/v7/more/troubleshooting/nuxt"),
    "/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("a frontmatter canonical that already carries the base path is left alone", () => {
  assert.equal(
    resolveCanonicalUrl(
      "/orm/v6/more/troubleshooting/nuxt",
      "/docs/orm/v7/more/troubleshooting/nuxt",
    ),
    "/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("an absolute canonical is passed through", () => {
  assert.equal(
    resolveCanonicalUrl(
      "/orm/v6/more/troubleshooting/nuxt",
      "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
    ),
    "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("absoluteCanonicalUrl joins a docs path onto the base URL", () => {
  assert.equal(
    absoluteCanonicalUrl("/docs/orm/v7/more/troubleshooting/nuxt", "https://www.prisma.io"),
    "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
  );
  assert.equal(
    absoluteCanonicalUrl("/docs/orm/v7/more/troubleshooting/nuxt", "https://www.prisma.io/"),
    "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("absoluteCanonicalUrl leaves an absolute canonical alone", () => {
  assert.equal(
    absoluteCanonicalUrl(
      "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
      "https://docs-preview.vercel.app",
    ),
    "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("canonicalLinkHeader has the same shape as apps/site's Markdown route", () => {
  assert.equal(
    canonicalLinkHeader("https://www.prisma.io/docs/compute/faq"),
    '<https://www.prisma.io/docs/compute/faq>; rel="canonical"',
  );
});

test("the Markdown route sends the page's canonical in a Link header", () => {
  // The route reads the MDX collection, which node:test cannot load, so this
  // reads its source, as markdown-route-vary.test.ts does.
  const routeSource = readFileSync(
    new URL("../app/llms.mdx/[[...slug]]/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    routeSource,
    /resolveCanonicalUrl\(page\.url, \(page\.data as \{ canonical\?: string \}\)\.canonical\)/,
  );
  assert.match(
    routeSource,
    /headers: \{ \.\.\.MARKDOWN_HEADERS, Link: canonicalLinkHeader\(canonical\) \}/,
  );
});
