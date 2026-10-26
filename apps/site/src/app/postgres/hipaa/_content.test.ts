import assert from "node:assert/strict";
import test from "node:test";
import { createFaqStructuredData } from "@/lib/structured-data";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import { HIPAA_FAQ, HIPAA_PATH } from "./_content";

const EXISTING_QUESTIONS = [
  "Is Prisma Postgres HIPAA compliant?",
  "How much does a HIPAA compliant Postgres database cost on Prisma?",
  "Does Prisma sign a BAA, and how do I get one?",
  "Which products does the BAA cover?",
  "Where is my data stored?",
  "What am I responsible for under the shared responsibility model?",
  "How are backups and encryption handled?",
  "Can I use Prisma ORM with PHI?",
  "Is there a liability cap in the BAA?",
  "Where can I find SOC 2, ISO 27001 and other audit reports?",
] as const;

const NEW_QUESTION =
  "Can I use Prisma Postgres for a healthcare app that isn't written in TypeScript?";

const DASH_PATTERN = /[\u2013\u2014]/;

test("the HIPAA FAQ keeps the existing questions and adds the non-TypeScript entry after the ORM one", () => {
  const questions = HIPAA_FAQ.map((item) => item.question);
  assert.equal(questions.filter((question) => question === NEW_QUESTION).length, 1);
  assert.deepEqual(
    questions.filter((question) => question !== NEW_QUESTION),
    [...EXISTING_QUESTIONS],
  );
  assert.equal(questions[questions.indexOf("Can I use Prisma ORM with PHI?") + 1], NEW_QUESTION);
});

test("HIPAA FAQ answers strip cleanly and carry no dashes", () => {
  for (const item of HIPAA_FAQ) {
    assert.ok(!DASH_PATTERN.test(item.question), `${item.question}: question contains a dash`);
    assert.ok(!DASH_PATTERN.test(item.answer), `${item.question}: answer contains a dash`);

    const plain = stripFaqAnswerMarkup(item.answer);
    assert.ok(!plain.includes("`"), `${item.question}: backtick leaked into plain text`);
    assert.ok(
      !/\[[^\]]+\]\(/.test(plain),
      `${item.question}: Markdown link syntax leaked into plain text`,
    );
    assert.ok(plain.length > 0, `${item.question}: plain text is empty`);
  }
});

test("the non-TypeScript answer names the hosting guide and stays valid FAQPage JSON-LD", () => {
  const item = HIPAA_FAQ.find((faq) => faq.question === NEW_QUESTION);
  assert.ok(item, "non-TypeScript FAQ missing");
  assert.match(
    item.answer,
    /\[guide to HIPAA compliant app hosting\]\(https:\/\/hipaacomplianthosting\.com\/blog\/hipaa-compliant-app-hosting\)/,
  );
  assert.ok(!item.answer.toLowerCase().includes("prisma compute"));

  const structured = createFaqStructuredData(
    HIPAA_PATH,
    HIPAA_FAQ.map(({ question, answer }) => ({ question, answer })),
    "Prisma Postgres HIPAA FAQ",
  );
  assert.equal(structured["@type"], "FAQPage");
  const entity = structured.mainEntity.find((entry) => entry.name === NEW_QUESTION);
  assert.ok(entity, "FAQPage JSON-LD is missing the new question");
  assert.equal(entity.acceptedAnswer["@type"], "Answer");
  assert.equal(typeof entity.acceptedAnswer.text, "string");
  assert.ok(!entity.acceptedAnswer.text.includes("["));
  assert.ok(!entity.acceptedAnswer.text.includes("<"));
  assert.ok(entity.acceptedAnswer.text.includes("guide to HIPAA compliant app hosting"));
});
