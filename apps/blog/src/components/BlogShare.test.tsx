import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogShare } from "./BlogShare";
import { textContent } from "@prisma-docs/ui/lib/html-text";

// The share row sits on every post. The copy-link control used to be a <div>
// with an onClick: no role, no tab stop, no accessible name, and dead to
// Enter/Space.
function render() {
  return renderToStaticMarkup(<BlogShare desc="A test post" />);
}

test("the copy-link control is a button with an accessible name", () => {
  const html = render();
  const copyButtons = [...html.matchAll(/<button\b([^>]*)>/g)].map(([, attributes]) => attributes);

  assert.equal(copyButtons.length, 1, "expected exactly one button in the share row");
  assert.match(copyButtons[0], /type="button"/);
  assert.match(copyButtons[0], /aria-label="Copy article link"/);
});

test("the copy-link control looks like the share links beside it", () => {
  const html = render();
  const button = /<button\b([^>]*)>/.exec(html)?.[1] ?? "";
  const anchor = /<a\b([^>]*)>/.exec(html)?.[1] ?? "";

  // The row is plain icons with the docs' quiet hover (client, 2026-11-25),
  // so the copy button must carry the same round 36px target as the links.
  for (const attributes of [button, anchor]) {
    assert.match(attributes, /class="[^"]*\bquiet-hover\b[^"]*"/);
    assert.match(attributes, /class="[^"]*\bsize-9\b[^"]*"/);
    assert.match(attributes, /class="[^"]*\brounded-full\b[^"]*"/);
  }
});

test("every share anchor still has an accessible name", () => {
  const anchors = [...render().matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];

  assert.ok(anchors.length > 0, "expected the social share links");
  for (const [, attributes, inner] of anchors) {
    const text = textContent(inner);
    const ariaLabel = /aria-label="([^"]+)"/.exec(attributes)?.[1] ?? "";
    assert.ok(text.length > 0 || ariaLabel.length > 0, `unnamed anchor: <a ${attributes}>`);
  }
});

test("no interactive control is nested inside another", () => {
  const open: string[] = [];

  const VOID = new Set(["img", "br", "input", "hr", "meta", "link", "path", "circle", "rect"]);

  for (const [, closing, name, selfClosing] of render().matchAll(/<(\/?)([a-z]+)\b[^>]*?(\/?)>/g)) {
    if (closing) {
      const index = open.lastIndexOf(name);
      if (index !== -1) open.splice(index, 1);
      continue;
    }
    if (name === "button" || name === "a") {
      const enclosing = open.findLast((tag) => tag === "button" || tag === "a");
      assert.equal(enclosing, undefined, `<${name}> is nested inside <${enclosing}>`);
    }
    if (!selfClosing && !VOID.has(name)) open.push(name);
  }
});
