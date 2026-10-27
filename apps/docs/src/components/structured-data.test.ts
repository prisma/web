import assert from "node:assert/strict";
import test from "node:test";
import { getTechArticleSchema } from "./structured-data";

/**
 * Docs pages carry their last-change date (`lastModified`, from git history)
 * but no publish date. `datePublished` must not reuse the last-change date:
 * a page first published years ago would claim it was published last week.
 */
function techArticle(data: Record<string, unknown>) {
  const page = {
    url: "/compute/faq",
    slugs: ["compute", "faq"],
    data: { title: "FAQ", description: "Answers about Compute.", ...data },
  } as unknown as Parameters<typeof getTechArticleSchema>[0];
  // As `JsonLd` serializes it: fields that are `undefined` are left out.
  return JSON.parse(JSON.stringify(getTechArticleSchema(page))) as Record<string, unknown>;
}

test("TechArticle gives the last-change date as dateModified only", () => {
  const schema = techArticle({ lastModified: new Date("2026-10-25T01:18:39Z") });
  assert.equal(schema.dateModified, "2026-10-25T01:18:39.000Z");
  assert.equal("datePublished" in schema, false);
});

test("TechArticle keeps a publish date the page sets", () => {
  const schema = techArticle({
    datePublished: "2024-03-01",
    lastModified: new Date("2026-10-25T01:18:39Z"),
  });
  assert.equal(schema.datePublished, "2024-03-01T00:00:00.000Z");
  assert.equal(schema.dateModified, "2026-10-25T01:18:39.000Z");
});

test("TechArticle omits both dates when none is known", () => {
  const schema = techArticle({});
  assert.equal("datePublished" in schema, false);
  assert.equal("dateModified" in schema, false);
});
