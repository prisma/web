import assert from "node:assert/strict";
import test from "node:test";
import { resolveCanonicalUrl } from "./canonical";

test("pages are self-canonical without frontmatter", () => {
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt"),
    "/docs/orm/v6/more/troubleshooting/nuxt",
  );
  assert.equal(resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt", "   "), "/docs/orm/v6/more/troubleshooting/nuxt");
});

test("a frontmatter canonical gets the docs base path", () => {
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt", "/orm/v7/more/troubleshooting/nuxt"),
    "/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("a frontmatter canonical that already carries the base path is left alone", () => {
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt", "/docs/orm/v7/more/troubleshooting/nuxt"),
    "/docs/orm/v7/more/troubleshooting/nuxt",
  );
});

test("an absolute canonical is passed through", () => {
  assert.equal(
    resolveCanonicalUrl("/orm/v6/more/troubleshooting/nuxt", "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt"),
    "https://www.prisma.io/docs/orm/v7/more/troubleshooting/nuxt",
  );
});
