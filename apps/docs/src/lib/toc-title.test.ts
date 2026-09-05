import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { stripTocLinks } from "./toc-title.ts";

const render = (node: Parameters<typeof stripTocLinks>[0]) =>
  renderToStaticMarkup(createElement("span", null, stripTocLinks(node)));

test("passes a plain string title through", () => {
  assert.equal(render("Error reference"), "<span>Error reference</span>");
});

test("unwraps a link element to its children", () => {
  const title = createElement(
    "a",
    { href: "/orm/v7/reference/error-reference" },
    "Prisma ORM error reference",
  );

  // No anchor and no href survive: the href is what 404'd on www.prisma.io
  // (no /docs basePath) and the <a> is what nested inside the TOC's own link.
  assert.equal(render(title), "<span>Prisma ORM error reference</span>");
});

test("keeps inline code and other elements intact", () => {
  const title = [createElement("code", { key: "c" }, "prisma migrate dev"), " options"];

  assert.equal(render(title), "<span><code>prisma migrate dev</code> options</span>");
});

test("unwraps a link inside a mixed array, preserving order and siblings", () => {
  const title = [
    "platform (",
    createElement(
      "a",
      { key: "a", href: "/console/more/feature-maturity#early-access" },
      "Early Access",
    ),
    ")",
  ];

  assert.equal(render(title), "<span>platform (Early Access)</span>");
});

test("unwraps a nested link while keeping the elements around and inside it", () => {
  const title = createElement(
    "span",
    { className: "x" },
    createElement("code", null, "prisma"),
    " ",
    createElement("a", { href: "/x" }, createElement("strong", null, "dev")),
  );

  assert.equal(
    render(title),
    '<span><span class="x"><code>prisma</code> <strong>dev</strong></span></span>',
  );
});

test("renders nothing for nullish, boolean and childless input", () => {
  assert.equal(render(null), "<span></span>");
  assert.equal(render(undefined), "<span></span>");
  assert.equal(render(false), "<span></span>");
  assert.equal(render(createElement("br")), "<span><br/></span>");
});

test("keeps numeric title segments", () => {
  assert.equal(render(["Prisma ", 7, " CLI"]), "<span>Prisma 7 CLI</span>");
});
