// Generates content/docs/orm/v8/reference/error-reference.mdx from the
// canonical docs/reference/error-reference.md in prisma/prisma (main branch).
//
// Usage:
//   node scripts/generate-error-reference.mjs [--source <path-to-error-reference.md>]
//
// Without --source, the file is fetched from raw.githubusercontent.com.
//
// Every Prisma 8 error carries a docsUrl of the form
// https://docs.prisma.io/docs/orm/v8/reference/error-reference#<CODE>
// (builds that predate the /v8 rename emit /orm/next/..., which 308-redirects
// here with the fragment preserved), so each `### NAMESPACE.SUBCODE` heading
// gets an explicit anchor equal to the raw code text (uppercase, with the dot)
// via Fumadocs' `[#custom-id]` syntax.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL =
  "https://raw.githubusercontent.com/prisma/prisma/main/docs/reference/error-reference.md";
const GITHUB_BLOB_BASE = "https://github.com/prisma/prisma/blob/main/docs/reference/";
const OUTPUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../content/docs/orm/v8/reference/error-reference.mdx",
);
const CODE_HEADING = /^### ([A-Z0-9_]+\.[A-Z0-9_.]+)$/;

async function loadSource() {
  const flagIndex = process.argv.indexOf("--source");
  if (flagIndex !== -1) {
    const path = process.argv[flagIndex + 1];
    if (!path) throw new Error("--source requires a path");
    return readFileSync(path, "utf8");
  }
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status}`);
  }
  return response.text();
}

function assertMdxSafe(markdown) {
  // The page is plain markdown compiled as MDX. Braces and JSX-like tags
  // outside code spans/fences would change meaning or break the build, so
  // refuse them here where the failure is attributable to the source file.
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  const hostile = withoutCode.match(/[{}]|<[A-Za-z/]/);
  if (hostile) {
    throw new Error(
      `Source contains MDX-unsafe text outside code spans (found ${JSON.stringify(hostile[0])}). ` +
        "Escape it in prisma/prisma docs/reference/error-reference.md or teach this generator to handle it.",
    );
  }
}

// The canonical source still uses the product's internal conventions. Until
// upstream adopts the published names, rewrite them to the site standard:
// the working name "Prisma Next" is now "Prisma 8" (ADR 242 rebrand), and app
// developers import from a facade package, not the unpublished @internal
// scope. Each rule is a narrow literal so it no-ops once upstream catches up.
function applyNamingStandard(body) {
  return body
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
    .replace(/`@internal\/mongo`/g, "`@prisma/orm-mongo`");
}

function transform(markdown) {
  assertMdxSafe(markdown);

  let body = markdown.replace(/^# Error reference\s*\n/, "");
  body = applyNamingStandard(body);

  // The source intro describes itself from the prisma/prisma repo's point of
  // view ("canonical source", its own CI check). Reworded for readers of the
  // hosted page; if upstream rewrites the sentence the original is kept.
  body = body.replace(
    /It is the canonical source for the hosted reference at[\s\S]*?missing from this page\./,
    "Each code anchors as `#<CODE>` — the exact fragment every emitted error carries in its " +
      "`docsUrl`. This page is generated from the canonical reference in the `prisma/prisma` " +
      "repository, whose CI requires every code in production source to be documented before it ships.",
  );

  // Repo-relative links point at files that only exist in prisma/prisma.
  body = body.replace(/\]\((\.\.?\/[^)]+)\)/g, (_, target) => {
    const url = new URL(target, `${GITHUB_BLOB_BASE}error-reference.md`);
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

  const frontmatter = `---
title: Error reference
description: Every structured error code Prisma 8 can emit, by namespace, with the condition that raises it.
url: /orm/v8/reference/error-reference
metaTitle: Prisma 8 error reference
metaDescription: Every structured error code Prisma 8 can emit, by namespace, with the condition that raises it.
badge: release-candidate
---

{/* Generated by scripts/generate-error-reference.mjs from
    https://github.com/prisma/prisma/blob/main/docs/reference/error-reference.md
    Do not edit by hand — changes are overwritten by the sync workflow. */}

`;

  return { mdx: frontmatter + body, codeCount: codes.length };
}

const { mdx, codeCount } = transform(await loadSource());
writeFileSync(OUTPUT, mdx);
console.log(`Wrote ${OUTPUT} with ${codeCount} error codes.`);
