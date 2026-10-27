import assert from "node:assert/strict";
import test from "node:test";
import { docs } from "../../source.config";
import { getTechArticleSchema } from "./structured-data";

/**
 * Docs pages carry their last-change date (`lastModified`, from git history)
 * and a publish date only when their frontmatter sets `datePublished` (none does yet).
 * `datePublished` must not reuse the last-change date:
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

test("TechArticle keeps a publish date the default build passes as a Date", () => {
  // The default build exports the frontmatter schema's output as is, so the
  // date arrives as a `Date`; the async build (`COMPOSER_BUILD=1`) passes it
  // as an ISO string.
  const schema = techArticle({ datePublished: new Date("2024-03-01T00:00:00Z") });
  assert.equal(schema.datePublished, "2024-03-01T00:00:00.000Z");
});

/** Validates frontmatter with the docs schema, as fumadocs-mdx does for each page. */
async function validateFrontmatter(data: Record<string, unknown>) {
  const schema = docs.docs.schema;
  assert.ok(schema && "~standard" in schema);
  return schema["~standard"].validate({
    title: "FAQ",
    url: "/compute/faq",
    metaTitle: "Prisma Compute FAQ",
    metaDescription: "Answers about Compute.",
    ...data,
  });
}

test("docs frontmatter keeps datePublished as a Date", async () => {
  // Quoted or not, YAML gives a date-shaped value as a string.
  const result = await validateFrontmatter({ datePublished: "2024-03-01" });
  if (result.issues) assert.fail(result.issues.map((issue) => issue.message).join("; "));
  assert.equal(result.value.datePublished?.toISOString(), "2024-03-01T00:00:00.000Z");
});

test("docs frontmatter rejects a datePublished that is empty, a number or not a date", async () => {
  // As YAML parses `datePublished:`, `datePublished: 2024` and `datePublished: nope`.
  for (const datePublished of [null, 2024, "nope"]) {
    const result = await validateFrontmatter({ datePublished });
    assert.ok(result.issues?.length, `accepted ${JSON.stringify(datePublished)}`);
  }
});

test("TechArticle omits both dates when none is known", () => {
  const schema = techArticle({});
  assert.equal("datePublished" in schema, false);
  assert.equal("dateModified" in schema, false);
});
