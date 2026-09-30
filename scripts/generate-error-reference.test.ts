import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error The generator is a plain .mjs script with no type declarations.
import { TARGETS, transform } from "../apps/docs/scripts/generate-error-reference.mjs";

function generate(body: string, target = TARGETS.orm): string {
  return transform(target, `# Error reference\n\n## PSL\n\n${body}\n`).mdx;
}

test("a dotted code gets an anchor equal to the code", () => {
  const mdx = generate("### MIGRATION.HASH_MISMATCH\n\nText.");
  assert.match(mdx, /^### MIGRATION\.HASH_MISMATCH \[#MIGRATION\.HASH_MISMATCH\]$/m);
});

test("an undotted code gets an anchor equal to the code", () => {
  const mdx = generate("### PSL_PRESET_CONFLICT\n\nText.");
  assert.match(mdx, /^### PSL_PRESET_CONFLICT \[#PSL_PRESET_CONFLICT\]$/m);
});

test("the cli target accepts both code shapes", () => {
  const mdx = generate(
    "### CLI.NOT_LOGGED_IN\n\nText.\n\n### PSL_PRESET_CONFLICT\n\nText.",
    TARGETS.cli,
  );
  assert.match(mdx, /^### CLI\.NOT_LOGGED_IN \[#CLI\.NOT_LOGGED_IN\]$/m);
  assert.match(mdx, /^### PSL_PRESET_CONFLICT \[#PSL_PRESET_CONFLICT\]$/m);
});

test("dotted and undotted codes are counted together", () => {
  const { codeCount } = transform(
    TARGETS.orm,
    "# Error reference\n\n### PSL.INVALID_ATTRIBUTE\n\n### PSL_PRESET_CONFLICT\n",
  );
  assert.equal(codeCount, 2);
});

for (const code of [
  "PSL_BACKTICK_STRING_REQUIRES_TAG",
  "PSL_UNKNOWN_DEFAULT_LITERAL_TAG",
  "PSL_DEPRECATED_SCALAR_NAME",
  "PSL_DEFAULT_TYPE_INCOMPATIBLE",
  "PSL_INVALID_DEFAULT_LITERAL",
  "PSL_INVALID_JSON_LITERAL",
  "PSL_TAGGED_LITERAL_NUL",
  "PSL_TAGGED_LITERAL_TOO_LARGE",
  "PSL_LIST_AUTOINCREMENT_UNSUPPORTED",
  "PSL_INVALID_DEFAULT_SQL",
  "PSL_PRESET_ON_VARIANT_FIELD",
  "PSL_PRESET_CONFLICT",
  "OTHER_FAMILY_CODE",
]) {
  test(`the undotted code ${code} is accepted`, () => {
    assert.ok(generate(`### ${code}\n\nText.`).includes(`### ${code} [#${code}]\n`));
  });
}

test("the error for a rejected heading names the accepted shapes", () => {
  assert.throws(
    () => generate("### FAQ\n\nText."),
    /NAMESPACE\.SUBCODE.*PSL_PRESET_CONFLICT/,
  );
});

for (const heading of [
  "### FAQ",
  "### NOTES",
  "### HTTP2",
  "### _NOTES",
  "### NOTES_",
  "### PSL__PRESET",
  "### How to read this page",
  "### Psl_Preset_Conflict",
  "### PSL-PRESET-CONFLICT",
  "### PSL_PRESET_CONFLICT (deprecated)",
  "### PSL.",
  "### .PSL",
  "### PSL..PRESET",
]) {
  test(`a heading that is not a code is rejected: ${heading}`, () => {
    assert.throws(() => generate(`${heading}\n\nText.`), /Unexpected heading shape/);
  });
}

test("a duplicate undotted code is rejected", () => {
  assert.throws(
    () => generate("### PSL_PRESET_CONFLICT\n\n### PSL_PRESET_CONFLICT"),
    /Duplicate error codes in source: PSL_PRESET_CONFLICT/,
  );
});
