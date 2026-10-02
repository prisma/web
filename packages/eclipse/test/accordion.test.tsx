import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion, Accordions } from "../src/components/accordion";
import { textContent } from "./html-text";

// FAQ blocks are the most quotable part of a post, and most AI crawlers do not
// run JavaScript. The answers have to be in the server-rendered HTML, not only
// in the RSC payload, which means a closed panel stays mounted.
const QA: Array<[question: string, answer: string]> = [
  ["What is Prisma?", "Prisma is an ORM for TypeScript."],
  ["Is it type safe?", "Yes, end to end."],
];

function render(props: { defaultValue?: string } = {}) {
  return renderToStaticMarkup(
    <Accordions type="single" {...props}>
      {QA.map(([question, answer]) => (
        <Accordion key={question} title={question}>
          {answer}
        </Accordion>
      ))}
    </Accordions>,
  );
}

function panelTags(html: string): string[] {
  return [...html.matchAll(/<div[^>]*role="region"[^>]*>/g)].map((m) => m[0]);
}

test("closed panels ship their answers in the server-rendered markup", () => {
  const html = render();
  const text = textContent(html);
  for (const [question, answer] of QA) {
    assert.ok(text.includes(question), `question missing from markup: ${question}`);
    assert.ok(text.includes(answer), `answer missing from markup: ${answer}`);
  }

  const panels = panelTags(html);
  assert.equal(panels.length, QA.length);
  for (const panel of panels) {
    assert.match(panel, /data-state="closed"/);
    assert.doesNotMatch(panel, /\shidden=""/, "a closed panel must not be display:none");
  }
});

test("a closed panel is inert and an open one is not", () => {
  const [open, closed] = panelTags(render({ defaultValue: QA[0][0] }));
  assert.match(open, /data-state="open"/);
  assert.doesNotMatch(open, /\sinert=""/);
  assert.match(closed, /data-state="closed"/);
  assert.match(closed, /\sinert=""/, "links inside a closed panel must stay out of the tab order");
});

test("a closed panel starts collapsed before hydration", () => {
  // The accordion-up keyframe animates from --radix-accordion-content-height to
  // 0 and falls back to `auto` when the variable is unset, which would play a
  // full-height-to-zero collapse on every closed panel as the page loads.
  for (const panel of panelTags(render())) {
    assert.match(panel, /--radix-accordion-content-height:0px/);
  }
});
