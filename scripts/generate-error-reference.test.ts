import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error The generator is a plain .mjs script with no type declarations.
import {
  TARGETS,
  latestReleaseRef,
  readFlag,
  recordedRef,
  run,
  transform,
} from "../apps/docs/scripts/generate-error-reference.mjs";

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
  assert.throws(() => generate("### FAQ\n\nText."), /NAMESPACE\.SUBCODE.*PSL_PRESET_CONFLICT/);
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

function sourceWith({
  intro: firstParagraph = intro,
  namespaces = ["AUTH", "CLI"],
}: { intro?: string; namespaces?: string[] } = {}) {
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
  assert.ok(
    withCli.indexOf(TARGETS.cli.sharedCliNamespace) < withCli.indexOf("Namespaces on this page:"),
  );
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

test("links to the docs and blog origin hosts point at www.prisma.io", () => {
  const mdx = generate(
    "### CLI.CONSENT_UNUSED\n\n" +
      "See [CLI.CONSENT_UNUSED](https://docs.prisma.io/docs/cli/error-reference#CLI.CONSENT_UNUSED) " +
      "and [the post](https://blog.prisma.io/blog/rethinking-database-migrations).\n\n" +
      "```text\ndocs: https://docs.prisma.io/docs/orm/reference/error-reference#CLI.CONSENT_UNUSED\n```",
  );
  assert.match(
    mdx,
    /\]\(https:\/\/www\.prisma\.io\/docs\/cli\/error-reference#CLI\.CONSENT_UNUSED\)/,
  );
  assert.match(mdx, /\]\(https:\/\/www\.prisma\.io\/blog\/rethinking-database-migrations\)/);
  assert.doesNotMatch(mdx, /\]\(https:\/\/(?:docs|blog)\.prisma\.io/);
  assert.match(mdx, /^docs: https:\/\/docs\.prisma\.io\/docs\/orm/m);
});

test("links inside code spans and fences keep the origin hosts", () => {
  const mdx = generate(
    "### CLI.CONSENT_UNUSED\n\n" +
      "```md\n[CLI.CONSENT_UNUSED](https://docs.prisma.io/docs/cli/error-reference)\n```\n\n" +
      "Inline: `[the post](https://blog.prisma.io/blog/rethinking-database-migrations)`.",
  );
  assert.match(
    mdx,
    /^\[CLI\.CONSENT_UNUSED\]\(https:\/\/docs\.prisma\.io\/docs\/cli\/error-reference\)$/m,
  );
  assert.match(
    mdx,
    /`\[the post\]\(https:\/\/blog\.prisma\.io\/blog\/rethinking-database-migrations\)`/,
  );
  assert.doesNotMatch(mdx, /\]\(https:\/\/www\.prisma\.io\//);
});

test("links into the source repo and the generated-from comment use the release ref", () => {
  const { mdx } = transform(
    TARGETS.orm,
    "# Error reference\n\nSee [conventions](./error-conventions.md).\n\n### PSL.INVALID_ATTRIBUTE\n",
    "v8.0.0-rc.24",
  );
  assert.match(mdx, /blob\/v8\.0\.0-rc\.24\/docs\/reference\/error-reference\.md/);
  assert.match(
    mdx,
    /\(https:\/\/github\.com\/prisma\/orm\/blob\/v8\.0\.0-rc\.24\/docs\/reference\/error-conventions\.md\)/,
  );
  assert.doesNotMatch(mdx, /blob\/main\//);
});

function registry(body: unknown, status = 200) {
  return async (url: string) => {
    assert.equal(url, "https://registry.npmjs.org/@prisma/orm-postgres/latest");
    return new Response(JSON.stringify(body), { status });
  };
}

const ormRelease = {
  version: "8.0.0-rc.24",
  repository: { url: "git+https://github.com/prisma/orm.git" },
};

test("the release ref is the latest npm version with a v prefix", async () => {
  assert.equal(await latestReleaseRef(TARGETS.orm, registry(ormRelease)), "v8.0.0-rc.24");
});

test("a failed registry response stops the lookup", async () => {
  await assert.rejects(latestReleaseRef(TARGETS.orm, registry({}, 503)), /503/);
});

test("a registry response without a version stops the lookup", async () => {
  await assert.rejects(
    latestReleaseRef(TARGETS.orm, registry({ repository: ormRelease.repository })),
    /no valid version/,
  );
});

test("a latest release from another repository stops the lookup", async () => {
  await assert.rejects(
    latestReleaseRef(
      TARGETS.cli,
      async () =>
        new Response(
          JSON.stringify({
            version: "7.10.2",
            repository: { url: "git+https://github.com/prisma/prisma.git" },
          }),
        ),
    ),
    /not prisma\/prisma-cli/,
  );
});

test("a repository whose name only starts with the source repo's name does not match", async () => {
  await assert.rejects(
    latestReleaseRef(
      TARGETS.orm,
      registry({ ...ormRelease, repository: { url: "https://github.com/prisma/orm-extras.git" } }),
    ),
    /not prisma\/orm/,
  );
});

for (const argv of [["--ref"], ["--ref", ""], ["--ref", "--source", "x.md"]]) {
  test(`readFlag rejects ${JSON.stringify(argv)}`, () => {
    assert.throws(() => readFlag(argv, "--ref"), /--ref requires a value/);
  });
}

test("recordedRef reads the tag from a generated page", () => {
  const { mdx } = transform(
    TARGETS.cli,
    "# Error reference\n\n### CLI.NOT_LOGGED_IN\n",
    "v8.0.0-rc.34",
  );
  assert.equal(recordedRef(TARGETS.cli, mdx), "v8.0.0-rc.34");
  assert.throws(() => recordedRef(TARGETS.orm, mdx), /no ref generated from prisma\/orm/);
});

test("recordedRef refuses a page generated from main", () => {
  const { mdx } = transform(TARGETS.orm, "# Error reference\n\n### PSL.INVALID_ATTRIBUTE\n");
  assert.throws(() => recordedRef(TARGETS.orm, mdx), /not a release tag/);
});

test("without --ref, the page is generated from the tag of the npm release", async () => {
  const fetched: string[] = [];
  const written: string[] = [];
  await run(["--target", "orm"], {
    fetchImpl: async (url: string) => {
      fetched.push(url);
      return url.startsWith("https://registry.npmjs.org/")
        ? new Response(JSON.stringify(ormRelease))
        : new Response("# Error reference\n\n### PSL.INVALID_ATTRIBUTE\n");
    },
    writeFile: (_path: string, mdx: string) => written.push(mdx),
    log: () => {},
  });
  assert.equal(
    fetched[1],
    "https://raw.githubusercontent.com/prisma/orm/v8.0.0-rc.24/docs/reference/error-reference.md",
  );
  assert.match(written[0], /blob\/v8\.0\.0-rc\.24\/docs\/reference\/error-reference\.md/);
});

test("--print-ref prints the resolved tag and writes nothing", async () => {
  const logged: string[] = [];
  await run(["--target", "orm", "--print-ref"], {
    fetchImpl: registry(ormRelease),
    writeFile: () => assert.fail("--print-ref must not write"),
    log: (line: string) => logged.push(line),
  });
  assert.deepEqual(logged, ["v8.0.0-rc.24"]);
});
