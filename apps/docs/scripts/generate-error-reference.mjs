// Generates a hosted error-reference page from a canonical
// docs/reference/error-reference.md in a product repo (main branch).
//
// Usage:
//   node scripts/generate-error-reference.mjs [--target orm|cli] [--source <path-to-error-reference.md>]
//
// Targets:
//   orm (default)  prisma/prisma       -> content/docs/orm/reference/error-reference.mdx
//   cli            prisma/prisma-cli   -> content/docs/cli/error-reference.mdx
//
// Without --source, the file is fetched from raw.githubusercontent.com.
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
    sourceRepo: "prisma/prisma",
    output: join(HERE, "../content/docs/orm/reference/error-reference.mdx"),
    applyNamingStandard: applyOrmNamingStandard,
    hostedIntro:
      "When an error prints a `docsUrl`, that link opens the code's entry on this page. " +
      "This page is generated from the `prisma/prisma` repository.",
    scope:
      "This page lists the codes from the Prisma ORM commands, which start with `prisma contract`, " +
      "`prisma db`, `prisma migration`, and `prisma orm`, and the codes your app can raise at runtime, " +
      `including from extensions. Every other \`prisma\` command has its codes on the ${CLI_PAGE}.`,
    sharedCliNamespace:
      `This page and the ${CLI_PAGE} both have a \`CLI\` namespace, with different codes in each. ` +
      "A `CLI.*` code from `prisma contract`, `prisma db`, `prisma migration`, or `prisma orm` is on this " +
      "page. One from any other `prisma` command is on the other page.",
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
      `This page and the ${ORM_PAGE} both have a \`CLI\` namespace, with different codes in each. ` +
      "A `CLI.*` code from `prisma contract`, `prisma db`, `prisma migration`, or `prisma orm` is on the " +
      "other page. One from any other `prisma` command is on this page.",
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

function readFlag(name) {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  const value = process.argv[i + 1];
  if (!value) throw new Error(`${name} requires a value`);
  return value;
}

async function loadSource(target) {
  const path = readFlag("--source");
  if (path) return readFileSync(path, "utf8");
  const url = `https://raw.githubusercontent.com/${target.sourceRepo}/main/docs/reference/error-reference.md`;
  const response = await fetch(url);
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
  if (namespaces.includes("CLI")) list.push(target.sharedCliNamespace, "");

  const firstSection = body.search(/^## /m);
  return `${body.slice(0, firstSection)}${list.join("\n")}\n${body.slice(firstSection)}`;
}

export function transform(target, markdown) {
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

  // Repo-relative links point at files that only exist in the source repo.
  const blobBase = `https://github.com/${target.sourceRepo}/blob/main/docs/reference/`;
  body = body.replace(/\]\((\.\.?\/[^)]+)\)/g, (_, linkTarget) => {
    const url = new URL(linkTarget, `${blobBase}error-reference.md`);
    return `](${url.href})`;
  });

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
    https://github.com/${target.sourceRepo}/blob/main/docs/reference/error-reference.md
    Do not edit by hand. The sync workflow overwrites changes. */}

`;

  return { mdx: header + body, codeCount: codes.length, warnings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const targetName = readFlag("--target") ?? "orm";
  const target = TARGETS[targetName];
  if (!target) {
    throw new Error(
      `Unknown --target ${JSON.stringify(targetName)}. Known: ${Object.keys(TARGETS).join(", ")}`,
    );
  }
  const { mdx, codeCount, warnings } = transform(target, await loadSource(target));
  for (const warning of warnings) console.warn(`Warning: ${warning}`);
  writeFileSync(target.output, mdx);
  console.log(`Wrote ${target.output} with ${codeCount} error codes.`);
}
