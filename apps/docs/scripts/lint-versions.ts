#!/usr/bin/env npx tsx

/**
 * Every pinned Prisma ORM 8 version in the current docs must be the package's
 * `latest` dist-tag on npm. `@prisma/cli-engine` is the exception: `prisma`
 * installs the exact engine version it depends on, so the expected version is
 * the one in the `dependencies` of `prisma@latest`. A version mentioned as history ("since 8.0.0-rc.10",
 * an "Added in" column) is allowed to be older, and so is a pin to an older
 * major line, such as a `prisma@6.x` install step for readers staying on 6.
 *
 * Usage: npx tsx scripts/lint-versions.ts [--fix]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchVersions, isVersionedTree, lintVersions, rewriteVersions } from "./version-utils";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../content/docs");

function findMdxFiles(dir: string, fileList: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) findMdxFiles(filePath, fileList);
    else if (entry.name.endsWith(".mdx")) fileList.push(filePath);
  }
  return fileList;
}

async function main() {
  const latest = await fetchVersions((pkg, version, prismaVersion) => {
    const installedBy = prismaVersion ? ` (installed by prisma@${prismaVersion})` : "";
    console.log(`${pkg}@${version}${installedBy}`);
  });

  const relativePath = (file: string) => path.relative(DOCS_DIR, file).split(path.sep).join("/");
  const files = findMdxFiles(DOCS_DIR).filter((file) => !isVersionedTree(relativePath(file)));
  if (process.argv.includes("--fix")) {
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const fixed = rewriteVersions(relativePath(file), content, latest);
      if (fixed !== content) fs.writeFileSync(file, fixed);
    }
  }
  // Read the files again after fixing; unfixable references still fail the check.
  const violations = files.flatMap((file) =>
    lintVersions(fs.readFileSync(file, "utf8"), latest).map((violation) => ({
      ...violation,
      file: path.relative(path.join(__dirname, ".."), file),
    })),
  );

  if (violations.length === 0) {
    console.log(`\n✅ Every pinned version in ${files.length} files is current.`);
    return;
  }

  console.error(`\n❌ ${violations.length} stale version reference(s):\n`);
  for (const { file, line, found, expected } of violations) {
    console.error(`${file}:${line}: ${found} (expected ${expected})`);
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
