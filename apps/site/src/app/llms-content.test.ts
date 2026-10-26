import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { crossAppKeyPages } from "./llms-content";

const appsRoot = new URL("../../../", import.meta.url).pathname;

/** Where each cross-app Key Page's frontmatter lives, keyed by its site path. */
const SOURCES: Record<string, string> = {
  "/blog/host-a-test-version-without-replacing-production":
    "blog/content/blog/host-a-test-version-without-replacing-production/index.mdx",
  "/docs/compute/deploy-on-push": "docs/content/docs/compute/deploy-on-push.mdx",
};

function readMetaTitle(relativePath: string) {
  const source = readFileSync(`${appsRoot}${relativePath}`, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const value = frontmatter.match(/^metaTitle:\s*(.+)$/m)?.[1]?.trim() ?? "";
  return value.replace(/^(["'])(.*)\1$/, "$2");
}

test("every cross-app Key Page has a known source file", () => {
  assert.deepEqual(crossAppKeyPages.map((page) => page.path).sort(), Object.keys(SOURCES).sort());
});

for (const page of crossAppKeyPages) {
  test(`llms.txt title for ${page.path} matches the page's metaTitle`, () => {
    assert.equal(page.title, readMetaTitle(SOURCES[page.path]));
  });
}
