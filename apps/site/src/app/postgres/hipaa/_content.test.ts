import assert from "node:assert/strict";
import test from "node:test";
import { createFaqStructuredData } from "@/lib/structured-data";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import { HIPAA_FAQ, HIPAA_PATH } from "./_content";

const NEW_QUESTION =
  "Can I use Prisma Postgres for a healthcare app that isn't written in TypeScript?";

const DASH_PATTERN = /[\u2013\u2014]/;

test("the non-TypeScript FAQ appears once and follows the ORM question", () => {
  const questions = HIPAA_FAQ.map((item) => item.question);
  assert.equal(questions.filter((question) => question === NEW_QUESTION).length, 1);
  assert.equal(questions[questions.indexOf("Can I use Prisma ORM with PHI?") + 1], NEW_QUESTION);
});

test("HIPAA FAQ answers carry no dashes", () => {
  for (const item of HIPAA_FAQ) {
    assert.ok(!DASH_PATTERN.test(item.question), `${item.question}: question contains a dash`);
    assert.ok(!DASH_PATTERN.test(item.answer), `${item.question}: answer contains a dash`);
  }
});

test("the non-TypeScript answer links the connection docs first and stays valid FAQPage JSON-LD", () => {
  const item = HIPAA_FAQ.find((faq) => faq.question === NEW_QUESTION);
  assert.ok(item, "non-TypeScript FAQ missing");
  assert.match(
    item.answer,
    /\[connection docs\]\(\/docs\/postgres\/database\/connecting-to-your-database\)/,
  );
  assert.match(
    item.answer,
    /\[guide to HIPAA compliant app hosting\]\(https:\/\/hipaacomplianthosting\.com\/blog\/hipaa-compliant-app-hosting\)\{newtab\}/,
  );
  assert.ok(
    item.answer.indexOf("/docs/postgres/database/connecting-to-your-database") <
      item.answer.indexOf("hipaacomplianthosting.com"),
  );
  assert.ok(!item.answer.toLowerCase().includes("prisma compute"));
  assert.ok(
    item.answer.includes("If a third-party provider hosts your app, it needs to sign a BAA too."),
  );
  assert.ok(!item.answer.includes("You also need a BAA-covered host for the app itself."));

  const plain = stripFaqAnswerMarkup(item.answer);
  assert.ok(!plain.includes("["));
  assert.ok(!plain.includes("{newtab}"));
  assert.ok(plain.includes("HIPAA Compliant Hosting"));
  assert.ok(plain.includes("connection docs"));
  assert.ok(!/\bThis (third-party )?guide\b/.test(plain));

  const structured = createFaqStructuredData(
    HIPAA_PATH,
    HIPAA_FAQ.map(({ question, answer }) => ({ question, answer })),
    "Prisma Postgres HIPAA FAQ",
  );
  assert.equal(structured["@type"], "FAQPage");
  const entity = structured.mainEntity.find((entry) => entry.name === NEW_QUESTION);
  assert.ok(entity, "FAQPage JSON-LD is missing the new question");
  assert.equal(entity.acceptedAnswer["@type"], "Answer");
  assert.equal(entity.acceptedAnswer.text, plain);
});
