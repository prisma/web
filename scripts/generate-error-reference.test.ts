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

const intro = "Every error is a structured envelope. This page lists every published code.";

function sourceWith({ intro: firstParagraph = intro, namespaces = ["AUTH", "CLI"] }: { intro?: string; namespaces?: string[] } = {}) {
  const sections = namespaces.map(
    (namespace) => `## ${namespace}\n\n### ${namespace}.FAILED\n\nIt failed.\n`,
  );
  return [
    "# Error reference",
    "",
    firstParagraph,
    "",
    "Match on `error.code`.",
    "",
    "Namespaces:",
    "",
    "| Namespace | Covers |",
    "| --- | --- |",
    "| `AUTH` | Workspace authentication |",
    "",
    ...sections,
  ].join("\n");
}

test("the source's claim to list every code becomes the target's scope with a link to the other page", () => {
  const { mdx, warnings } = transform(TARGETS.orm, sourceWith());

  assert.ok(mdx.includes(`Every error is a structured envelope. ${TARGETS.orm.scope}`));
  assert.ok(mdx.includes("[CLI error reference](/cli/error-reference)"));
  assert.ok(!mdx.includes("This page lists every published code."));
  assert.deepEqual(warnings, []);
});

test("the namespace list comes from the source's sections and keeps the table's descriptions", () => {
  const { mdx } = transform(TARGETS.cli, sourceWith({ namespaces: ["AUTH", "PROJECT"] }));

  assert.ok(
    mdx.includes(
      "Namespaces on this page:\n\n- [`AUTH`](#auth): Workspace authentication\n- [`PROJECT`](#project)\n",
    ),
  );
  assert.ok(!mdx.includes("| Namespace | Covers |"));
  assert.ok(mdx.indexOf("Namespaces on this page:") < mdx.indexOf("## AUTH"));
});

test("the shared CLI namespace is explained only when the source has a CLI section", () => {
  const withCli = transform(TARGETS.cli, sourceWith({ namespaces: ["AUTH", "CLI"] })).mdx;
  const withoutCli = transform(TARGETS.cli, sourceWith({ namespaces: ["AUTH"] })).mdx;

  assert.ok(withCli.includes(TARGETS.cli.sharedCliNamespace));
  assert.ok(withCli.indexOf(TARGETS.cli.sharedCliNamespace) < withCli.indexOf("Namespaces on this page:"));
  assert.ok(!withoutCli.includes("One exception:"));
});

test("a reworded source intro still gets the scope sentence after its first paragraph, with a warning", () => {
  const { mdx, warnings } = transform(
    TARGETS.orm,
    sourceWith({ intro: "Every error is a structured envelope." }),
  );

  assert.ok(
    mdx.includes(
      `Every error is a structured envelope.\n\n${TARGETS.orm.scope}\n\n${TARGETS.orm.sharedCliNamespace}\n\nMatch on`,
    ),
  );
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /This page lists every published code/);
});

test("the frontmatter descriptions do not claim to list every code", () => {
  for (const target of Object.values(TARGETS)) {
    assert.doesNotMatch(target.frontmatter, /\bevery\b/i);
  }
});
