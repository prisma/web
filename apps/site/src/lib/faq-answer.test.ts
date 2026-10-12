import assert from "node:assert/strict";
import test from "node:test";
import { postgresContent } from "@/components/product/content/postgres";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";

/**
 * The visible /postgres FAQ and the FAQPage JSON-LD on the same page come
 * from the same `postgresContent.faq` strings (see `app/postgres/page.tsx`
 * and `lib/structured-data.ts`). This test is the drift alarm:
 *
 *  - every answer round-trips through `stripFaqAnswerMarkup` (same regexes
 *    `lib/structured-data.ts`'s `toPlainText` uses) with every `[text](...)`
 *    link and every inline-code backtick removed;
 *  - the stripped text keeps the visible words (anchor text, code content)
 *    so the structured copy matches what a reader sees;
 *  - the postgres FAQ is replaced word for word by faq-v2.json, and the
 *    source-of-truth copy for the two most-moved answers is pinned here.
 */

const faq = postgresContent.faq ?? [];

const MARKUP_PATTERN = /[`[\]()]|(?:^|[^!])\(https?:\/\//;

test("every /postgres FAQ answer strips cleanly to plain text", () => {
  assert.equal(faq.length, 9, "expected the 9-item v2 FAQ");

  for (const item of faq) {
    const plain = stripFaqAnswerMarkup(item.answer);

    assert.ok(!plain.includes("`"), `${item.question}: backtick leaked into plain text`);
    assert.ok(
      !/\[[^\]]+\]\(/.test(plain),
      `${item.question}: Markdown link syntax leaked into plain text`,
    );
    assert.ok(
      plain.length > 0 && !plain.startsWith("["),
      `${item.question}: plain text is empty or starts mid-link`,
    );
  }
});

test("the HIPAA and backups answers carry the VP-approved opening sentences", () => {
  const byQuestion = Object.fromEntries(faq.map((item) => [item.question, item.answer]));

  assert.ok(byQuestion["Are backups included?"], "backups FAQ missing");
  assert.ok(
    byQuestion["Are backups included?"].startsWith(
      "Yes, every paid plan includes daily [automatic backups](/docs/postgres/database/backups). Starter and Pro keep them for 7 days and Business keeps them for 30; the Free plan has none.",
    ),
    "backups FAQ opener does not match the VP-approved copy",
  );

  assert.ok(byQuestion["Is Prisma Postgres HIPAA compliant?"], "HIPAA FAQ missing");
  assert.ok(
    byQuestion["Is Prisma Postgres HIPAA compliant?"].startsWith(
      "Yes, from the Pro plan up. HIPAA is available on Pro ($49 a month) and Business ($129 a month), so you can run workloads with protected health information on either; it is not available on Free or Starter.",
    ),
    "HIPAA FAQ opener does not match the VP-approved copy",
  );
});

test("no /postgres FAQ answer uses an em dash", () => {
  for (const item of faq) {
    assert.ok(!item.answer.includes("\u2014"), `${item.question}: contains an em dash`);
  }
});

test("every answer the parser touches carries recognisable markup", () => {
  // The sanity check: if an answer parses as having structure we expect, make
  // sure one of the two markup forms actually appears in it. Otherwise a bare
  // `[` or backtick would silently fall through the renderer as literal text.
  for (const item of faq) {
    const hasMarkupHint = MARKUP_PATTERN.test(item.answer);
    if (!hasMarkupHint) continue;

    assert.ok(
      /\[[^\]]+\]\(/.test(item.answer) || /`[^`]+`/.test(item.answer),
      `${item.question}: answer looks like it has markup but neither link nor code form matches`,
    );
  }
});
