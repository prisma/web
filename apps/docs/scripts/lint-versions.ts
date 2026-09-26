#!/usr/bin/env npx tsx

/**
 * Every pinned Prisma ORM 8 version in the current docs must be the package's
 * `latest` dist-tag on npm. A version mentioned as history ("since 8.0.0-rc.10",
 * an "Added in" column) is allowed to be older, and so is a pin to an older
 * major line, such as a `prisma@6.x` install step for readers staying on 6.
 *
 * Usage: npx tsx scripts/lint-versions.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../content/docs");

const TRACKED_PACKAGES = [
  "prisma",
  "@prisma/orm-postgres",
  "@prisma/orm-mongo",
  "@prisma/cli-engine",
  "@prisma/prisma7",
];

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

type Violation = {
  file: string;
  line: number;
  found: string;
  expected: string;
};

async function fetchLatest(pkg: string): Promise<string> {
  const response = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status} for ${pkg}`);
  }
  const { version } = (await response.json()) as { version: string };
  return version;
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
    if (!lines[i].startsWith("|") || !/^\|\s*-/.test(lines[i + 1])) continue;
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

function lintFile(file: string, latest: Map<string, string>): Violation[] {
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
  const latest = new Map(
    await Promise.all(TRACKED_PACKAGES.map(async (pkg) => [pkg, await fetchLatest(pkg)] as const)),
  );
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
