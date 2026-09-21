#!/usr/bin/env npx tsx

/**
 * Every pinned Prisma ORM 8 version in the current docs must be what a reader
 * installs today: the package's `latest` dist-tag on npm, except
 * `@prisma/cli-engine`, which `prisma orm init` installs at the exact version
 * `prisma@latest` declares as its dependency (its own `latest` tag can lag).
 * A version mentioned as history ("since 8.0.0-rc.10", an "Added in" column)
 * is allowed to be older, and so is a pin to an older major line, such as a
 * `prisma@6.x` install step for readers staying on 6.
 *
 * Usage: npx tsx scripts/lint-versions.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../content/docs");

/** Packages whose `latest` dist-tag is the version the docs must pin. */
const REGISTRY_PACKAGES = [
  "prisma",
  "@prisma/orm-postgres",
  "@prisma/orm-mongo",
  "@prisma/prisma7",
];

/** Installed by `orm init` at the version the `prisma` manifest names, not at `latest`. */
const CLI_ENGINE = "@prisma/cli-engine";

/** Older releases keep their own content trees and pin their own versions. */
const VERSIONED_TREES = ["(index)/v7", "cli/v7", "guides/v7", "orm/v6", "orm/v7"];

/** A version preceded by one of these on the same line names a past release. */
const HISTORY_PHRASES = [
  "since",
  "before",
  "below",
  "prior to",
  "added in",
  "removed in",
  "from before",
  "older than",
  "earlier than",
  "introduced in",
  "as of",
  "until",
];

const HISTORY_COLUMNS = new Set(["added in", "since", "removed in", "changed in"]);

const PACKAGE_PIN_REGEX = /(@?[\w./-]+)@(\d+\.\d+\.\d+(?:-[\w.]+)?)/g;
const PRERELEASE_REGEX = /(?<![\w.@-])(\d+\.\d+\.\d+-rc\.\d+)(?![\w.-])/g;

export type Violation = {
  file: string;
  line: number;
  found: string;
  expected: string;
};

export type Manifest = { version: string; dependencies?: Record<string, string> };

async function fetchLatestManifest(pkg: string): Promise<Manifest> {
  const response = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status} for ${pkg}`);
  }
  return (await response.json()) as Manifest;
}

/**
 * The version each tracked package must be pinned at, from the `latest`
 * manifests of `REGISTRY_PACKAGES`. `@prisma/cli-engine` comes from the
 * `prisma` manifest's dependencies, which is where `orm init` reads it.
 */
export function expectedVersions(manifests: Map<string, Manifest>): Map<string, string> {
  const expected = new Map<string, string>();
  for (const [pkg, manifest] of manifests) expected.set(pkg, manifest.version);
  const engine = manifests.get("prisma")?.dependencies?.[CLI_ENGINE];
  if (!engine) throw new Error(`prisma@latest does not declare ${CLI_ENGINE} as a dependency`);
  expected.set(CLI_ENGINE, engine);
  return expected;
}

function findMdxFiles(dir: string, fileList: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) findMdxFiles(filePath, fileList);
    else if (entry.name.endsWith(".mdx")) fileList.push(filePath);
  }
  return fileList;
}

function isVersionedTree(file: string): boolean {
  const relativePath = path.relative(DOCS_DIR, file);
  return VERSIONED_TREES.some((tree) => relativePath.startsWith(`${tree}${path.sep}`));
}

function isHistoryPhrase(line: string, index: number): boolean {
  const before = line.slice(Math.max(0, index - 40), index).toLowerCase();
  return HISTORY_PHRASES.some((phrase) => new RegExp(`\\b${phrase}\\s+\`?$`).test(before));
}

/**
 * Column indexes of the table cells whose header names a past release, keyed
 * by the line number of each table's first body row.
 */
function historyColumns(lines: string[]): Map<number, Set<number>> {
  const columns = new Map<number, Set<number>>();
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!lines[i].startsWith("|") || !/^\|\s*:?-/.test(lines[i + 1])) continue;
    const headers = lines[i]
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim().toLowerCase());
    const indexes = new Set(
      headers.flatMap((header, index) => (HISTORY_COLUMNS.has(header) ? [index] : [])),
    );
    if (indexes.size === 0) continue;
    for (let row = i + 2; row < lines.length && lines[row].startsWith("|"); row++) {
      columns.set(row, indexes);
    }
  }
  return columns;
}

function major(version: string): number {
  return Number(version.split(".")[0]);
}

function cellIndex(line: string, index: number): number {
  return line.slice(0, index).split("|").length - 2;
}

export function lintFile(file: string, latest: Map<string, string>): Violation[] {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const tables = historyColumns(lines);
  const relativeFile = path.relative(path.join(__dirname, ".."), file);
  const violations: Violation[] = [];
  const currentVersions = new Set(latest.values());

  lines.forEach((line, lineIndex) => {
    const allowed = (index: number) =>
      isHistoryPhrase(line, index) || tables.get(lineIndex)?.has(cellIndex(line, index));

    for (const match of line.matchAll(PACKAGE_PIN_REGEX)) {
      const [pin, pkg, version] = match;
      const expected = latest.get(pkg);
      if (!expected || version === expected || allowed(match.index)) continue;
      if (major(version) < major(expected)) continue;
      violations.push({ file: relativeFile, line: lineIndex + 1, found: pin, expected });
    }

    for (const match of line.matchAll(PRERELEASE_REGEX)) {
      const version = match[1];
      if (currentVersions.has(version) || allowed(match.index)) continue;
      violations.push({
        file: relativeFile,
        line: lineIndex + 1,
        found: version,
        expected: [...currentVersions]
          .filter((v) => v.startsWith(version.split("-")[0]))
          .join(" or "),
      });
    }
  });

  return violations;
}

async function main() {
  const manifests = new Map(
    await Promise.all(
      REGISTRY_PACKAGES.map(async (pkg) => [pkg, await fetchLatestManifest(pkg)] as const),
    ),
  );
  const latest = expectedVersions(manifests);
  for (const [pkg, version] of latest) console.log(`${pkg}@${version}`);

  const files = findMdxFiles(DOCS_DIR).filter((file) => !isVersionedTree(file));
  const violations = files.flatMap((file) => lintFile(file, latest));

  if (violations.length === 0) {
    console.log(`\n✅ Every pinned version in ${files.length} files is current.`);
    return;
  }

  console.error(`\n❌ ${violations.length} stale version reference(s):\n`);
  for (const { file, line, found, expected } of violations) {
    console.error(`${file}:${line}: ${found} (latest is ${expected})`);
  }
  console.error(
    '\nBump the version, or mark it as history with a phrase like "since" or "before" or an "Added in" column.',
  );
  process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
