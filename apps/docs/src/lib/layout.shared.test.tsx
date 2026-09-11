import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { baseOptions } from "./layout.shared";

/**
 * Every anchor the docs shell renders on every page. An anchor whose only child
 * is an image reads as an empty link to a crawler, which is what the September
 * 2026 audit flagged on ~680 pages, so this walks the rendered markup instead of
 * trusting the JSX by eye.
 */
function anchors(html: string) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attributes, inner]) => ({
    attributes,
    text: inner
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
    ariaLabel: /aria-label="([^"]*)"/.exec(attributes)?.[1] ?? "",
    href: /href="([^"]*)"/.exec(attributes)?.[1] ?? "",
  }));
}

function renderNavTitle() {
  const title = baseOptions().nav?.title;
  assert.ok(title, "the docs navbar should render a title");
  return renderToStaticMarkup(<>{title}</>);
}

test("every anchor in the docs navbar title has an accessible name", () => {
  const found = anchors(renderNavTitle());

  assert.equal(found.length, 2, "expected the Prisma lockup and the docs wordmark");
  for (const anchor of found) {
    assert.ok(
      anchor.text.length > 0 || anchor.ariaLabel.length > 0,
      `anchor to "${anchor.href}" has neither text content nor an aria-label`,
    );
  }
});

test("the Prisma lockup link is named for both assistive tech and text-only crawlers", () => {
  const lockup = anchors(renderNavTitle()).find((a) => a.href === "https://www.prisma.io");

  assert.ok(lockup, "expected a link to www.prisma.io");
  assert.equal(lockup.ariaLabel, "Prisma home");
  assert.equal(lockup.text, "Prisma home", "expected visually hidden anchor text");
});

test("the docs wordmark link keeps its visible text but is no longer a generic anchor", () => {
  const html = renderNavTitle();
  const wordmark = anchors(html).find((a) => a.href === "/");

  assert.ok(wordmark, "expected a link to the docs root");
  assert.equal(wordmark.ariaLabel, "Prisma documentation home");
  assert.ok(
    wordmark.text.startsWith("docs"),
    `expected the visible "docs" wordmark, got "${wordmark.text}"`,
  );
  assert.ok(
    html.includes('<span class="sr-only">Prisma documentation home</span>'),
    "expected a visually hidden, specific anchor text",
  );
});

test("the lockup images are decorative and keep their alt text", () => {
  const images = [...renderNavTitle().matchAll(/<img\b([^>]*)>/g)].map(
    ([, attributes]) => attributes,
  );

  assert.equal(images.length, 2, "expected the light and dark lockup");
  for (const attributes of images) {
    assert.match(attributes, /alt="Prisma"/);
    assert.match(attributes, /aria-hidden="true"/);
    assert.doesNotMatch(attributes, /aria-label=/, "the link names itself, the image should not");
  }
});
