/**
 * Invariant for the docs content: no two pages in the same version tree may
 * share a `metaTitle` + `metaDescription` pair.
 *
 * Twins across version trees are fine — `/orm/v6/...` and `/orm/v7/...` start
 * from the same frontmatter and are told apart at render time by the version
 * label `generateMetadata` appends (see version-metadata.ts). Two pages in the
 * *same* tree have no such tiebreaker: they compete for the same query with
 * byte-identical `<title>` and meta description, which is what the SEO audit
 * flagged.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { getPageVersion } from "./version-metadata";

const CONTENT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../content/docs",
);

interface PageMeta {
  file: string;
  tree: string;
  metaTitle: string;
  metaDescription: string;
}

function loadPages(): PageMeta[] {
  return globSync("**/*.mdx", { cwd: CONTENT_ROOT })
    .sort()
    .map((file) => {
      const { data } = matter(readFileSync(path.join(CONTENT_ROOT, file), "utf8"));
      const url = typeof data.url === "string" ? data.url : `/${file.replace(/\.mdx$/, "")}`;
      return {
        file,
        tree: getPageVersion(url)?.version ?? "latest",
        metaTitle: typeof data.metaTitle === "string" ? data.metaTitle.trim() : "",
        metaDescription:
          typeof data.metaDescription === "string" ? data.metaDescription.trim() : "",
      };
    });
}

test("every docs page has a metaTitle and a metaDescription", () => {
  const missing = loadPages().filter((page) => !page.metaTitle || !page.metaDescription);
  assert.deepEqual(
    missing.map((page) => page.file),
    [],
  );
});

test("no two pages in the same version tree share metaTitle + metaDescription", () => {
  const groups = new Map<string, PageMeta[]>();

  for (const page of loadPages()) {
    const key = `${page.tree} ${page.metaTitle} ${page.metaDescription}`;
    const group = groups.get(key) ?? [];
    group.push(page);
    groups.set(key, group);
  }

  const duplicates = [...groups.values()]
    .filter((group) => group.length > 1)
    .map(
      (group) =>
        `[${group[0].tree}] "${group[0].metaTitle}": ${group.map((page) => page.file).join(", ")}`,
    )
    .sort();

  assert.deepEqual(duplicates, [], `Same-tree duplicates:\n${duplicates.join("\n")}`);
});
