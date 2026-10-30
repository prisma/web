import assert from "node:assert/strict";
import test from "node:test";
import { blogPosts } from "../../source.config";

/**
 * A post's `date` and `updatedAt` drive the visible byline, BlogPosting
 * `datePublished`/`dateModified`, the sitemap `lastmod` and the RSS `pubDate`.
 * An empty or numeric value must fail the build instead of becoming a 1970 date,
 * and an impossible day must fail instead of rolling over into the next month.
 */

/** Validates frontmatter with the blog schema, as fumadocs-mdx does for each post. */
async function validateFrontmatter(data: Record<string, unknown>) {
  const schema = blogPosts.schema;
  assert.ok(schema && "~standard" in schema);
  return schema["~standard"].validate({
    title: "Post",
    authors: ["Ada Lovelace"],
    date: "2026-07-24",
    ...data,
  });
}

test("blog frontmatter keeps date and updatedAt as Dates", async () => {
  // Quoted or not, YAML gives a date-shaped value as a string.
  const result = await validateFrontmatter({ date: "2024-02-29", updatedAt: "2026-10-27" });
  if (result.issues) assert.fail(result.issues.map((issue) => issue.message).join("; "));
  assert.equal(result.value.date.toISOString(), "2024-02-29T00:00:00.000Z");
  assert.equal(result.value.updatedAt?.toISOString(), "2026-10-27T00:00:00.000Z");
});

test("blog frontmatter leaves updatedAt optional", async () => {
  const result = await validateFrontmatter({});
  if (result.issues) assert.fail(result.issues.map((issue) => issue.message).join("; "));
  assert.equal(result.value.updatedAt, undefined);
});

test("blog frontmatter rejects a date or updatedAt that is empty, a number or not a date", async () => {
  // As YAML parses `date:`, `date: 2024` and `date: nope`, then days that
  // `new Date()` would roll over into March.
  for (const value of [null, 2024, "nope", "2026-02-30", "2026-02-29"]) {
    for (const key of ["date", "updatedAt"]) {
      const result = await validateFrontmatter({ [key]: value });
      assert.ok(result.issues?.length, `accepted ${key}: ${JSON.stringify(value)}`);
    }
  }
});
