import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CountUp } from "@/components/motion/count-up";

// The server render is what crawlers, agents, and no-JS readers get. It used
// to be "$0-0": the counter held at zero until it scrolled into view, which on
// the server is never. These pin the real figures to the markup so the count-up
// cannot quietly take the prices back out of the page.

// Text content of the static markup: walk the string and drop everything
// between a `<` and its `>`. A hand-rolled walk rather than a regex replace
// because this is a test helper reading React's own output, not a sanitizer,
// and CodeQL reads any tag-stripping `replace` as one.
function renderedText(node: React.ReactElement) {
  let text = "";
  let inTag = false;
  for (const ch of renderToStaticMarkup(node)) {
    if (ch === "<") inTag = true;
    else if (ch === ">") inTag = false;
    else if (!inTag) text += ch;
  }
  return text;
}

test("CountUp server-renders the real figures, not zero", () => {
  assert.equal(renderedText(<CountUp value="$2,800-3,400" />), "$2,800-3,400");
  assert.equal(renderedText(<CountUp value="$19-39" />), "$19-39");
  assert.equal(renderedText(<CountUp value="$0" />), "$0");
});

test("an inactive CountUp also server-renders the real figures", () => {
  assert.equal(renderedText(<CountUp value="$640-780" active={false} />), "$640-780");
});

test("CountUp keeps the non-numeric parts of the price as plain text", () => {
  const html = renderToStaticMarkup(<CountUp value="$2,800-3,400" />);
  // Digit runs are the only tabular spans; symbol and dash stay untouched.
  assert.equal((html.match(/tabular-nums/g) ?? []).length, 2);
  assert.ok(html.includes("<span>$</span>") && html.includes("<span>-</span>"), html);
});
