import assert from "node:assert/strict";
import test from "node:test";
import { searchPath } from "fumadocs-core/breadcrumb";
import { flattenTree } from "fumadocs-core/page-tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { loader } from "fumadocs-core/source";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { hiddenPagesPlugin, withoutHiddenPages } from "./hidden-pages.ts";

function buildSource(hiddenPages: string[]) {
  return loader({
    baseUrl: "/",
    source: {
      files: [
        {
          type: "meta",
          path: "(index)/meta.json",
          data: { title: "Getting Started", root: true, pages: ["index", "quickstart"] },
        },
        { type: "page", path: "(index)/index.mdx", data: { title: "Home" } },
        { type: "page", path: "(index)/from-scratch.mdx", data: { title: "From scratch" } },
        {
          type: "meta",
          path: "(index)/quickstart/meta.json",
          data: {
            title: "Quickstart",
            pages: ["[New app](/quickstart/postgresql)"],
            hiddenPages,
          },
        },
        { type: "page", path: "(index)/quickstart/postgresql.mdx", data: { title: "PostgreSQL" } },
        { type: "page", path: "(index)/quickstart/mongodb.mdx", data: { title: "MongoDB" } },
      ],
    },
    plugins: [hiddenPagesPlugin()],
  });
}

function sectionOf(tree: PageTree.Root, url: string) {
  const path = searchPath(tree.children, url) ?? [];
  return path.findLast((node) => node.type === "folder" && node.root) as
    | PageTree.Folder
    | undefined;
}

test("a hidden page keeps the sidebar of its folder's section", () => {
  const { pageTree } = buildSource(["mongodb", "../from-scratch"]);

  assert.equal(sectionOf(pageTree, "/quickstart/mongodb")?.name, "Getting Started");
  assert.equal(sectionOf(pageTree, "/from-scratch")?.name, "Getting Started");
});

test("withoutHiddenPages leaves only the listed entries", () => {
  const { pageTree } = buildSource(["mongodb", "../from-scratch"]);
  const section = sectionOf(pageTree, "/quickstart/mongodb");
  assert.ok(section);

  const urls = flattenTree(withoutHiddenPages(section).children).map((item) => item.url);

  assert.deepEqual(urls, ["/", "/quickstart/postgresql"]);
});

test("withoutHiddenPages returns the same tree when nothing is hidden", () => {
  const { pageTree } = buildSource([]);

  assert.equal(withoutHiddenPages(pageTree), pageTree);
});

test("a hiddenPages entry that is not a page fails the build", () => {
  assert.throws(
    () => buildSource(["missing"]).pageTree,
    /hiddenPages entry "missing" is not a page/,
  );
});
