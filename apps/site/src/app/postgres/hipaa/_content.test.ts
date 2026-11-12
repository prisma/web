import assert from "node:assert/strict";
import test from "node:test";
import { createFaqStructuredData } from "@/lib/structured-data";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import { HIPAA_FAQ, HIPAA_PATH } from "./_content";

const NEW_QUESTION =
  "Can I use Prisma Postgres for a healthcare app that isn't written in TypeScript?";
const COVERED_ENTITY_QUESTION =
  "Will Prisma sign a BAA directly with a covered entity, such as a medical practice or clinic?";
const AUDIT_LOGS_QUESTION = "Does Prisma Postgres provide audit logs?";

const DASH_PATTERN = /[\u2013\u2014]/;

test("the non-TypeScript FAQ appears once and follows the ORM question", () => {
  const questions = HIPAA_FAQ.map((item) => item.question);
  assert.equal(questions.filter((question) => question === NEW_QUESTION).length, 1);
  assert.equal(questions[questions.indexOf("Can I use Prisma ORM with PHI?") + 1], NEW_QUESTION);
});

test("the covered-entity BAA FAQ sits with the other BAA questions", () => {
  const questions = HIPAA_FAQ.map((item) => item.question);
  assert.equal(questions.filter((question) => question === COVERED_ENTITY_QUESTION).length, 1);
  assert.equal(
    questions[questions.indexOf("Does Prisma sign a BAA, and how do I get one?") + 1],
    COVERED_ENTITY_QUESTION,
  );
  assert.equal(
    questions[questions.indexOf(COVERED_ENTITY_QUESTION) + 1],
    "Which products does the BAA cover?",
  );

  const item = HIPAA_FAQ.find((faq) => faq.question === COVERED_ENTITY_QUESTION);
  assert.ok(item, "covered-entity BAA FAQ missing");
  assert.match(item.answer, /Email compliance@prisma\.io to get started\./);
  assert.ok(!/\$/.test(item.answer), "covered-entity BAA answer must not add pricing");
});

test("the audit-logs FAQ sits with the security and operations questions", () => {
  const questions = HIPAA_FAQ.map((item) => item.question);
  assert.equal(questions.filter((question) => question === AUDIT_LOGS_QUESTION).length, 1);
  assert.equal(
    questions[questions.indexOf("How are backups and encryption handled?") + 1],
    AUDIT_LOGS_QUESTION,
  );

  const item = HIPAA_FAQ.find((faq) => faq.question === AUDIT_LOGS_QUESTION);
  assert.ok(item, "audit-logs FAQ missing");
  assert.ok(
    !/\b(Free|Starter|Pro|Business)\b/.test(item.answer),
    "audit-logs answer must not add a plan restriction",
  );
  assert.ok(!/\$/.test(item.answer), "audit-logs answer must not add pricing");
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
  assert.equal(structured.mainEntity.length, HIPAA_FAQ.length);
  const entity = structured.mainEntity.find((entry) => entry.name === NEW_QUESTION);
  assert.ok(entity, "FAQPage JSON-LD is missing the new question");
  assert.equal(entity.acceptedAnswer["@type"], "Answer");
  assert.equal(entity.acceptedAnswer.text, plain);

  const coveredEntity = HIPAA_FAQ.find((faq) => faq.question === COVERED_ENTITY_QUESTION);
  const logs = HIPAA_FAQ.find((faq) => faq.question === AUDIT_LOGS_QUESTION);
  assert.ok(coveredEntity && logs, "covered-entity or audit-logs FAQ missing");
  const coveredEntityEntity = structured.mainEntity.find(
    (entry) => entry.name === COVERED_ENTITY_QUESTION,
  );
  const logsEntity = structured.mainEntity.find((entry) => entry.name === AUDIT_LOGS_QUESTION);
  assert.ok(coveredEntityEntity, "FAQPage JSON-LD is missing the covered-entity question");
  assert.ok(logsEntity, "FAQPage JSON-LD is missing the audit-logs question");
  assert.equal(coveredEntityEntity.acceptedAnswer.text, stripFaqAnswerMarkup(coveredEntity.answer));
  assert.equal(logsEntity.acceptedAnswer.text, stripFaqAnswerMarkup(logs.answer));
});

test("the BAA scope covers Prisma Compute and the hosting FAQ follows it", () => {
  const questions = HIPAA_FAQ.map((item) => item.question);
  const HOSTING_QUESTION = "Is Prisma Compute HIPAA compliant?";
  assert.equal(questions.filter((question) => question === HOSTING_QUESTION).length, 1);
  assert.equal(
    questions[questions.indexOf("Which products does the BAA cover?") + 1],
    HOSTING_QUESTION,
  );

  const scope = HIPAA_FAQ.find((faq) => faq.question === "Which products does the BAA cover?");
  assert.ok(scope, "BAA scope FAQ missing");
  assert.match(scope.answer, /\[Prisma Compute\]\(\/compute\)/);

  const hosting = HIPAA_FAQ.find((faq) => faq.question === HOSTING_QUESTION);
  assert.ok(hosting, "hosting FAQ missing");
  assert.match(hosting.answer, /^Yes, on the Business plan\./);
  assert.ok(!/\$/.test(hosting.answer), "hosting answer must not add pricing");
});
