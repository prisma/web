import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { textContent } from "@prisma-docs/ui/lib/html-text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

// The homepage and pricing FAQs render this accordion, and most AI crawlers do
// not run JavaScript. The answers have to be in the server-rendered HTML, not
// only in the RSC payload, which means a closed panel stays mounted.
const QA: Array<[question: string, answer: string]> = [
  ["Do I have to use all three products?", "No. Use whichever pieces solve your problem."],
  ["Is my schema locked in?", "No. Your data sits in standard Postgres."],
  ["Are there egress fees?", "No egress fees on Prisma Postgres."],
];

function render(props: { defaultValue?: string; value?: string } = {}) {
  return renderToStaticMarkup(
    <Accordion type="single" collapsible {...props}>
      {QA.map(([question, answer], index) => (
        <AccordionItem key={question} value={`item-${index}`}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>,
  );
}

function panelTags(html: string): string[] {
  return [...html.matchAll(/<div[^>]*role="region"[^>]*>/g)].map((m) => m[0]);
}

test("closed panels ship their answers in the server-rendered markup", () => {
  const html = render({ defaultValue: "item-0" });
  const text = textContent(html);
  for (const [question, answer] of QA) {
    assert.ok(text.includes(question), `question missing from markup: ${question}`);
    assert.ok(text.includes(answer), `answer missing from markup: ${answer}`);
  }
  for (const panel of panelTags(html)) {
    assert.doesNotMatch(panel, /\shidden=""/, "a closed panel must not be display:none");
  }
});

test("only closed panels are inert", () => {
  const [open, ...closed] = panelTags(render({ defaultValue: "item-0" }));
  assert.match(open, /data-state="open"/);
  assert.doesNotMatch(open, /\sinert=""/);
  for (const panel of closed) {
    assert.match(panel, /data-state="closed"/);
    assert.match(panel, /\sinert=""/, "links inside a closed panel must stay out of the tab order");
  }
});

test("a controlled value decides which panel is inert", () => {
  const [first, second] = panelTags(render({ value: "item-1" }));
  assert.match(first, /\sinert=""/);
  assert.doesNotMatch(second, /\sinert=""/);
});

test("a closed panel starts collapsed before hydration", () => {
  // tw-animate-css's accordion-up keyframe animates from
  // --radix-accordion-content-height to 0 and falls back to auto when the
  // variable is unset, which would collapse every closed panel from full
  // height as the page loads.
  for (const panel of panelTags(render({ defaultValue: "item-0" }))) {
    assert.match(panel, /--radix-accordion-content-height:0px/);
  }
});

test("a single-mode string value is normalised when the accordion is multiple", () => {
  // Stands in for a wrapper that switches `type` to "multiple" without
  // remounting while its value is still a single-mode string.
  const html = renderToStaticMarkup(
    <Accordion type="multiple" value={"item-1" as unknown as string[]}>
      {QA.map(([question, answer], index) => (
        <AccordionItem key={question} value={`item-${index}`}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>,
  );
  const [first, second] = panelTags(html);
  assert.match(second, /data-state="open"/);
  assert.doesNotMatch(second, /\sinert=""/);
  assert.match(first, /\sinert=""/);
});

