import assert from "node:assert/strict";
import test from "node:test";
import { releaseNotes } from "../../source.config";

/**
 * A changelog entry's `date` is shown on /changelog and in /changelog.md. An
 * empty or numeric value must fail the build instead of becoming a 1970 date.
 */

/** Validates frontmatter with the changelog schema, as fumadocs-mdx does for each entry. */
async function validateFrontmatter(data: Record<string, unknown>) {
  const schema = releaseNotes.schema;
  assert.ok(schema && "~standard" in schema);
  return schema["~standard"].validate({
    title: "Release",
    version: "7.0.0",
    date: "2024-03-13",
    ...data,
  });
}

test("changelog frontmatter keeps date as a Date", async () => {
  // Quoted or not, YAML gives a date-shaped value as a string.
  const result = await validateFrontmatter({ date: "2024-03-13" });
  if (result.issues) assert.fail(result.issues.map((issue) => issue.message).join("; "));
  assert.equal(result.value.date.toISOString(), "2024-03-13T00:00:00.000Z");
});

test("changelog frontmatter rejects a date that is empty, a number or not a date", async () => {
  // As YAML parses `date:`, `date: 2024` and `date: nope`.
  for (const date of [null, 2024, "nope"]) {
    const result = await validateFrontmatter({ date });
    assert.ok(result.issues?.length, `accepted ${JSON.stringify(date)}`);
  }
});
