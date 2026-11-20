// Generates a hosted error-reference page from a canonical
// docs/reference/error-reference.md in a product repo, at the tag of the
// release users install. A page built from the repo's main branch would list
// codes and flags that no published version has.
//
// Usage:
//   node scripts/generate-error-reference.mjs [--target orm|cli] [--ref <tag> | --recorded] [--source <path-to-error-reference.md>]
//   node scripts/generate-error-reference.mjs [--target orm|cli] [--recorded] --print-ref
//
// Targets:
//   orm (default)  prisma/orm          -> content/docs/orm/reference/error-reference.mdx
//   cli            prisma/prisma-cli   -> content/docs/cli/error-reference.mdx
//
// The release is the `latest` version on npm of the target's npm package,
// and its tag is `v<version>`; the npm release must name the target's repo.
// --recorded uses instead the tag the committed page says it was generated
// from, so the check workflow can rebuild the page exactly. --ref names a
// tag directly. --print-ref prints the resolved tag and exits, so a workflow
// checks out the same ref it generates from. Without --source, the file is
// fetched at the ref from raw.githubusercontent.com.
//
// Every structured error carries (or can carry) a docsUrl pointing at its
// code's entry on the hosted page — either as a fragment
// (https://docs.prisma.io/docs/orm/reference/error-reference#<CODE>) or as a
// path segment (…/error-reference/<CODE>, the shape the CLI engine composes
// from a family docsBaseUrl; next.config.mjs redirects it to the fragment).
// Each `###` heading is a code, either `NAMESPACE.SUBCODE` or an undotted
// code of two or more words joined by underscores, such as
// `PSL_PRESET_CONFLICT`, and gets an explicit anchor equal to the raw code
// text via Fumadocs' `[#custom-id]` syntax.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOTTED_CODE = /[A-Z0-9_]+(?:\.[A-Z0-9_]+)+/;
const UNDOTTED_CODE = /[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+/;
const CODE_HEADING = new RegExp(`^### (${DOTTED_CODE.source}|${UNDOTTED_CODE.source})$`);

// The site names the product "Prisma ORM" and adds a version number only
// when two versions are contrasted, so a source that says "Prisma 8" means
// "Prisma ORM" and one that says "Prisma 7" means "Prisma ORM 7". Prose
// only: a version string inside a code span or fence is left as written.
function applyVersionNamingStandard(body) {
  body = replaceInProse(body, /\bPrisma 8 ORM\b/g, "Prisma ORM");
  body = replaceInProse(body, /\bPrisma 8\b/g, "Prisma ORM");
  return replaceInProse(body, /\bPrisma 7\b/g, "Prisma ORM 7");
}

// The canonical ORM source still uses the product's internal conventions.
// Until upstream adopts the published names, rewrite them to the site
// standard: the working name "Prisma Next" is now "Prisma ORM" (ADR 242
// rebrand), and app developers import from a facade package, not the
// unpublished @internal scope. Each rule is a narrow literal so it no-ops
// once upstream catches up.
function applyOrmNamingStandard(body) {
  return (
    applyVersionNamingStandard(body)
      .replace(/Prisma Next\b/g, "Prisma ORM")
      .replace(
        /`@internal\/utils\/structured-error`/g,
        "your facade package's `utils/structured-error` subpath (for example `@prisma/orm-postgres/utils/structured-error`)",
      )
      // The facade clients by their published names. Backtick-bounded so the
      // internal-only testkits (`@internal/postgres-codec-testkit`, ...) keep
      // their real names.
      .replace(/`@internal\/postgres`/g, "`@prisma/orm-postgres`")
      .replace(/`@internal\/sqlite`/g, "`@prisma/orm-sqlite`")
      .replace(/`@internal\/mongo`/g, "`@prisma/orm-mongo`")
  );
}

// Every span this file must treat as opaque, in the forms CommonMark allows:
// a fence opened with three or more backticks or tildes and closed by its own
// delimiter, and an inline span delimited by any number of backticks. Both the
// prose rewriter and the MDX check read this, so neither can reach inside code
// and rewrite an identifier or trip over a brace that is only ever displayed.
const CODE_SEGMENT = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\S\n]*$|(`+)[^\n]*?\2/gm;

/** Applies a prose-only rewrite, leaving every code segment untouched. */
function replaceInProse(body, pattern, replacement) {
  let out = "";
  let end = 0;
  for (const code of body.matchAll(CODE_SEGMENT)) {
    out += body.slice(end, code.index).replace(pattern, replacement) + code[0];
    end = code.index + code[0].length;
  }
  return out + body.slice(end).replace(pattern, replacement);
}

// prisma-cli names this API after the SDK it calls it through
// (`@prisma/management-api-sdk`), which is right in that repo. The docs site
// publishes the same API as the REST API and does not reintroduce the old
// name in prose (apps/docs/CLAUDE.md). Identifiers keep their real names, so
// this rewrites prose only.
function applyCliNamingStandard(body) {
  return replaceInProse(applyVersionNamingStandard(body), /\bManagement API\b/g, "REST API");
}

const ORM_PAGE = "[Prisma ORM error reference](/orm/reference/error-reference)";
const CLI_PAGE = "[CLI error reference](/cli/error-reference)";

export const TARGETS = {
  orm: {
    sourceRepo: "prisma/orm",
    npmPackage: "@prisma/orm-postgres",
    output: join(HERE, "../content/docs/orm/reference/error-reference.mdx"),
    applyNamingStandard: applyOrmNamingStandard,
    hostedIntro:
      "When an error prints a `docsUrl`, that link opens the code's entry on this page, except for " +
      "some `CLI.*` codes, which the next paragraph describes. " +
      "This page is generated from the `prisma/orm` repository.",
    scope:
      "This page lists the codes from the Prisma ORM commands, which start with `prisma contract`, " +
      "`prisma db`, `prisma migration`, and `prisma orm`, and the codes your app can raise at runtime, " +
      `including from extensions. Every other \`prisma\` command has its codes on the ${CLI_PAGE}.`,
    sharedCliNamespace:
      "One exception: some `CLI.*` codes come from the command-line layer that every `prisma` command " +
      "runs through, for its arguments, for loading `prisma.config.ts`, for prompts, and for consent. " +
      `Those are on the ${CLI_PAGE} even when you ran a Prisma ORM command. ` +
      "`CLI.CONFIG_SECTION_INVALID` from `prisma contract emit` is one of them. " +
      "When a Prisma ORM command raises one of these codes, its `docsUrl` still points to this page, " +
      "which has no entry for it, so the page opens at the top. " +
      "The `CLI.*` codes on this page are the ones the Prisma ORM commands raise themselves. " +
      "If a `CLI.*` code is not on this page, it is on the other.",
    frontmatter: `---
title: Error reference
description: The structured error codes of the Prisma ORM commands, runtime, and extensions, by namespace, with the condition that raises each one.
url: /orm/reference/error-reference
metaTitle: Prisma ORM error reference
metaDescription: The structured error codes of the Prisma ORM commands, runtime, and extensions, by namespace, with the condition that raises each one.
---
`,
  },
  cli: {
    sourceRepo: "prisma/prisma-cli",
    npmPackage: "prisma",
    output: join(HERE, "../content/docs/cli/error-reference.mdx"),
    applyNamingStandard: applyCliNamingStandard,
    hostedIntro:
      "When an error prints a `docsUrl`, that link opens the code's entry on this page. " +
      "This page is generated from the `prisma/prisma-cli` repository.",
    scope:
      "This page lists the codes from every `prisma` command except the Prisma ORM ones. The codes " +
      "from `prisma contract`, `prisma db`, `prisma migration`, and `prisma orm`, and the codes your " +
      `app can raise at runtime, are on the ${ORM_PAGE}.`,
    sharedCliNamespace:
      "One exception: the `CLI.*` codes on this page come from the command-line layer that every " +
      "`prisma` command runs through, for its arguments, for loading `prisma.config.ts`, for prompts, " +
      "and for consent. They are on this page even when you ran a Prisma ORM command. " +
      "`CLI.CONFIG_SECTION_INVALID` from `prisma contract emit` is one of them. " +
      `When a Prisma ORM command raises one of them, its \`docsUrl\` points to the ${ORM_PAGE} instead of this page. ` +
      `The Prisma ORM commands also raise \`CLI.*\` codes of their own, and those are on the ${ORM_PAGE}. ` +
      "If a `CLI.*` code is not on this page, it is on the other.",
    frontmatter: `---
title: Error reference
description: The structured error codes of the Prisma CLI platform commands, by namespace, with the condition that raises each one.
url: /cli/error-reference
metaTitle: Error reference | Prisma CLI
metaDescription: The structured error codes of the Prisma CLI platform commands, by namespace, with the condition that raises each one.
---
`,
  },
};

// A missing value, or one that is another flag, means a caller passed an
// empty variable; refusing it keeps `--ref "" --source x` from becoming a
// ref named `--source`.
export function readFlag(argv, name) {
  const i = argv.indexOf(name);
  if (i === -1) return undefined;
  const value = argv[i + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`${name} requires a value, got ${JSON.stringify(value ?? "")}`);
  }
  return value;
}

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const GITHUB_REPO = /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?\/?$/i;

export async function latestReleaseRef(target, fetchImpl = fetch) {
  const url = `https://registry.npmjs.org/${target.npmPackage}/latest`;
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const { version, repository } = await response.json();
  if (typeof version !== "string" || !SEMVER.test(version)) {
    throw new Error(`${url} returned no valid version: ${JSON.stringify(version)}`);
  }
  const repoUrl = typeof repository === "string" ? repository : repository?.url;
  const repo = typeof repoUrl === "string" ? repoUrl.match(GITHUB_REPO)?.[1] : undefined;
  if (repo?.toLowerCase() !== target.sourceRepo.toLowerCase()) {
    throw new Error(
      `${target.npmPackage}@${version}, the latest release on npm, comes from ` +
        `${JSON.stringify(repoUrl ?? null)}, not ${target.sourceRepo}. Refusing to generate from it.`,
    );
  }
  return `v${version}`;
}

const RECORDED_REF =
  /\{\/\* Generated by scripts\/generate-error-reference\.mjs from\s+https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/([^/\s]+)\/docs\/reference\/error-reference\.md/;

/** The tag a generated page records in its "Generated by" comment. */
export function recordedRef(target, mdx) {
  const match = mdx.match(RECORDED_REF);
  if (!match || match[1] !== target.sourceRepo) {
    throw new Error(`The page records no ref generated from ${target.sourceRepo}.`);
  }
  if (!/^v\d/.test(match[2])) {
    throw new Error(`The page records ${JSON.stringify(match[2])}, which is not a release tag.`);
  }
  return match[2];
}

export async function resolveRef(
  target,
  argv,
  { fetchImpl = fetch, readFile = readFileSync } = {},
) {
  const ref = readFlag(argv, "--ref");
  if (ref !== undefined) return ref;
  if (argv.includes("--recorded")) return recordedRef(target, readFile(target.output, "utf8"));
  return latestReleaseRef(target, fetchImpl);
}

async function loadSource(target, ref, argv, fetchImpl) {
  const path = readFlag(argv, "--source");
  if (path) return readFileSync(path, "utf8");
  const url = `https://raw.githubusercontent.com/${target.sourceRepo}/${ref}/docs/reference/error-reference.md`;
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function assertMdxSafe(markdown) {
  // The page is plain markdown compiled as MDX. Braces and JSX-like tags
  // outside code spans/fences would change meaning or break the build, so
  // refuse them here where the failure is attributable to the source file.
  const withoutCode = markdown.replace(CODE_SEGMENT, "");
  const hostile = withoutCode.match(/[{}]|<[A-Za-z/]/);
  if (hostile) {
    throw new Error(
      `Source contains MDX-unsafe text outside code spans (found ${JSON.stringify(hostile[0])}). ` +
        "Escape it in the canonical error-reference.md or teach this generator to handle it.",
    );
  }
}

const SOURCE_SCOPE_SENTENCE = "This page lists every published code.";

// Each page covers a subset of the CLI's commands, so the source's claims to
// list every code are replaced with the target's scope and a link to the
// other page.
function addScope(body, target, warnings) {
  body = body.replace(", and this page lists every code the CLI can emit.", ".");
  if (body.includes(SOURCE_SCOPE_SENTENCE)) {
    return body.replace(SOURCE_SCOPE_SENTENCE, target.scope);
  }
  warnings.push(
    `The source no longer contains ${JSON.stringify(SOURCE_SCOPE_SENTENCE)}. ` +
      "The scope sentence was inserted after the first paragraph instead.",
  );
  const firstParagraphEnd = body.search(/\n\s*\n/);
  if (firstParagraphEnd === -1) return `${body.trimEnd()}\n\n${target.scope}\n`;
  return `${body.slice(0, firstParagraphEnd)}\n\n${target.scope}${body.slice(firstParagraphEnd)}`;
}

/** Fumadocs' heading slug (github-slugger) for the heading shapes the sources use. */
function headingSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
}

const SOURCE_NAMESPACE_TABLE = /^Namespaces:\n\n((?:\|.*\|\n)+)\n?/m;

// The source's own namespace table can fall behind its `##` sections, so the
// list is rebuilt from the sections. The table still supplies each
// namespace's description.
function replaceNamespaceList(body, target) {
  const descriptions = new Map();
  const table = body.match(SOURCE_NAMESPACE_TABLE);
  if (table) {
    body = body.replace(SOURCE_NAMESPACE_TABLE, "");
    for (const row of table[1].split("\n")) {
      const cells = row.split("|").map((cell) => cell.trim());
      const namespace = cells[1]?.match(/^`([^`]+)`$/)?.[1];
      if (namespace && cells[2]) descriptions.set(namespace, cells[2]);
    }
  }

  const namespaces = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
  if (namespaces.length === 0) return body;
  const items = namespaces.map((namespace) => {
    const description = descriptions.get(namespace);
    const link = `[\`${namespace}\`](#${headingSlug(namespace)})`;
    return description ? `- ${link}: ${description}` : `- ${link}`;
  });
  const list = ["Namespaces on this page:", "", ...items, ""];

  const firstSection = body.search(/^## /m);
  body = `${body.slice(0, firstSection)}${list.join("\n")}\n${body.slice(firstSection)}`;
  if (!namespaces.includes("CLI")) return body;

  // The note answers the reader who arrived with a CLI.* code, so it sits
  // directly under the paragraph that holds the scope sentence.
  const scopeAt = body.indexOf(target.scope);
  const from = scopeAt === -1 ? 0 : scopeAt;
  const paragraphEnd = body.slice(from).search(/\n\s*\n/);
  const at = paragraphEnd === -1 ? body.length : from + paragraphEnd;
  return `${body.slice(0, at)}\n\n${target.sharedCliNamespace}${body.slice(at)}`;
}

export function transform(target, markdown, ref = "main") {
  assertMdxSafe(markdown);

  let body = markdown.replace(/^# Error reference\s*\n/, "");
  body = target.applyNamingStandard(body);

  // The source intro describes itself from the product repo's point of view
  // ("canonical source", its own CI check). Reworded for readers of the
  // hosted page; if upstream rewrites the sentence the original is kept.
  body = body.replace(
    /It is the canonical source for the hosted reference at[\s\S]*?missing from this page\./,
    target.hostedIntro,
  );

  const warnings = [];
  body = addScope(body, target, warnings);
  body = replaceNamespaceList(body, target);

  // Repo-relative links point at files that only exist in the source repo:
  // "./x.md", "../x.md", and bare sibling files like "transaction-options.md#timeout".
  const blobBase = `https://github.com/${target.sourceRepo}/blob/${ref}/docs/reference/`;
  body = body.replace(/\]\((\.\.?\/[^)]+|[\w-][^):\s]*\.md(?:#[^)]*)?)\)/g, (_, linkTarget) => {
    const url = new URL(linkTarget, `${blobBase}error-reference.md`);
    return `](${url.href})`;
  });

  // Docs and blog pages are published under www.prisma.io; docs.prisma.io and
  // blog.prisma.io only serve the site's rewrites. Only Markdown link targets
  // are rewritten; code spans and fences stay as the source wrote them.
  body = replaceInProse(
    body,
    /\]\(https:\/\/(?:docs|blog)\.prisma\.io\//g,
    "](https://www.prisma.io/",
  );

  const codes = [];
  body = body.replace(/^### .+$/gm, (heading) => {
    const match = heading.match(CODE_HEADING);
    if (!match) {
      throw new Error(
        `Unexpected heading shape: ${JSON.stringify(heading)}. ` +
          "A `###` heading must be an error code in one of two shapes: " +
          "uppercase parts joined by dots (`NAMESPACE.SUBCODE`), or " +
          "uppercase words joined by underscores (`PSL_PRESET_CONFLICT`). " +
          "A single word such as `FAQ` is not a code.",
      );
    }
    codes.push(match[1]);
    return `${heading} [#${match[1]}]`;
  });

  if (codes.length === 0) {
    throw new Error("No error-code headings found — refusing to write an empty page.");
  }
  const duplicates = codes.filter((code, i) => codes.indexOf(code) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate error codes in source: ${duplicates.join(", ")}`);
  }

  const header = `${target.frontmatter}
{/* Generated by scripts/generate-error-reference.mjs from
    https://github.com/${target.sourceRepo}/blob/${ref}/docs/reference/error-reference.md
    Do not edit by hand. The sync workflow overwrites changes. */}

`;

  return { mdx: header + body, codeCount: codes.length, warnings };
}

export async function run(
  argv,
  {
    fetchImpl = fetch,
    readFile = readFileSync,
    writeFile = writeFileSync,
    log = console.log,
    warn = console.warn,
  } = {},
) {
  const targetName = readFlag(argv, "--target") ?? "orm";
  const target = TARGETS[targetName];
  if (!target) {
    throw new Error(
      `Unknown --target ${JSON.stringify(targetName)}. Known: ${Object.keys(TARGETS).join(", ")}`,
    );
  }
  const ref = await resolveRef(target, argv, { fetchImpl, readFile });
  if (argv.includes("--print-ref")) {
    log(ref);
    return;
  }
  const source = await loadSource(target, ref, argv, fetchImpl);
  const { mdx, codeCount, warnings } = transform(target, source, ref);
  for (const warning of warnings) warn(`Warning: ${warning}`);
  writeFile(target.output, mdx);
  log(`Wrote ${target.output} with ${codeCount} error codes.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await run(process.argv.slice(2));
}
