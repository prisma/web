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
// Each `### NAMESPACE.SUBCODE` heading therefore gets an explicit anchor
// equal to the raw code text (uppercase, with the dot) via Fumadocs'
// `[#custom-id]` syntax.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CODE_HEADING = /^### ([A-Z0-9_]+\.[A-Z0-9_.]+)$/;

// The canonical ORM source still uses the product's internal conventions.
// Until upstream adopts the published names, rewrite them to the site
// standard: the working name "Prisma Next" is now "Prisma 8" (ADR 242
// rebrand), and app developers import from a facade package, not the
// unpublished @internal scope. Each rule is a narrow literal so it no-ops
// once upstream catches up.
function applyOrmNamingStandard(body) {
  return (
    body
      .replace(/Prisma Next\b/g, "Prisma 8")
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
  return replaceInProse(body, /\bManagement API\b/g, "REST API");
}

const TARGETS = {
  orm: {
    sourceRepo: "prisma/prisma",
    output: join(HERE, "../content/docs/orm/reference/error-reference.mdx"),
    applyNamingStandard: applyOrmNamingStandard,
    hostedIntro:
      "Each code anchors as `#<CODE>` — the exact fragment every emitted error carries in its " +
      "`docsUrl`. This page is generated from the canonical reference in the `prisma/prisma` " +
      "repository, whose CI requires every code in production source to be documented before it ships.",
    frontmatter: `---
title: Error reference
description: Every structured error code Prisma 8 can emit, by namespace, with the condition that raises it.
url: /orm/reference/error-reference
metaTitle: Prisma 8 error reference
metaDescription: Every structured error code Prisma 8 can emit, by namespace, with the condition that raises it.
---
`,
  },
  cli: {
    sourceRepo: "prisma/prisma-cli",
    output: join(HERE, "../content/docs/cli/error-reference.mdx"),
    applyNamingStandard: applyCliNamingStandard,
    hostedIntro:
      "Each code anchors as `#<CODE>` — the fragment an emitted error's `docsUrl` resolves to. " +
      "This page is generated from the canonical registry in the `prisma/prisma-cli` repository, " +
      "whose CI requires every code in production source to be documented before it ships.",
    frontmatter: `---
title: Error reference
description: Every structured error code the unified Prisma CLI can emit, by namespace, with the condition that raises it.
url: /cli/error-reference
metaTitle: Error reference | Prisma 8 CLI
metaDescription: Every structured error code the unified Prisma CLI can emit, by namespace, with the condition that raises it.
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

function transform(target, markdown) {
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
          "Anchors are only generated for `### NAMESPACE.SUBCODE` headings.",
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
    Do not edit by hand — changes are overwritten by the sync workflow. */}

`;

  return { mdx: header + body, codeCount: codes.length };
}

const targetName = readFlag("--target") ?? "orm";
const target = TARGETS[targetName];
if (!target) {
  throw new Error(
    `Unknown --target ${JSON.stringify(targetName)}. Known: ${Object.keys(TARGETS).join(", ")}`,
  );
}
const { mdx, codeCount } = transform(target, await loadSource(target));
writeFileSync(target.output, mdx);
console.log(`Wrote ${target.output} with ${codeCount} error codes.`);
