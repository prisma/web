import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { flattenTocTitle } from "./toc-title.ts";

test("passes a plain string title through", () => {
  assert.equal(flattenTocTitle("Error reference"), "Error reference");
});

test("flattens a title containing a link element to its text", () => {
  const title = createElement(
    "a",
    { href: "/orm/v7/reference/error-reference" },
    "Prisma ORM error reference",
  );

  assert.equal(flattenTocTitle(title), "Prisma ORM error reference");
  // The rendered output must not carry an href, which is what 404'd on
  // www.prisma.io (no /docs basePath) and nested one <a> inside another.
  assert.ok(!flattenTocTitle(title).includes("href"));
  assert.ok(!flattenTocTitle(title).includes("/orm/v7"));
});

test("flattens a mixed array of text and elements, preserving order", () => {
  const title = [
    "platform (",
    createElement("a", { href: "/console/more/feature-maturity#early-access" }, "Early Access"),
    ")",
  ];

  assert.equal(flattenTocTitle(title), "platform (Early Access)");
});

test("flattens nested elements", () => {
  const title = createElement(
    "span",
    null,
    createElement("code", null, "prisma"),
    " ",
    createElement("a", { href: "/x" }, createElement("strong", null, "dev")),
  );

  assert.equal(flattenTocTitle(title), "prisma dev");
});

test("renders empty for nullish, boolean and unrenderable input", () => {
  assert.equal(flattenTocTitle(null), "");
  assert.equal(flattenTocTitle(undefined), "");
  assert.equal(flattenTocTitle(false), "");
  assert.equal(flattenTocTitle(createElement("br")), "");
});

test("keeps numeric title segments", () => {
  assert.equal(flattenTocTitle(["Prisma ", 7, " CLI"]), "Prisma 7 CLI");
});
