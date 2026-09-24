import assert from "node:assert/strict";
import test from "node:test";
import type * as PageTree from "fumadocs-core/page-tree";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { getPageFooterItems } from "./page-footer-items.ts";

const page = (name: string, url: string): PageTree.Item => ({
  $id: url,
  type: "page",
  name,
  description: `About ${name}`,
  url,
});

/**
 * Shaped like the real `source.pageTree`: the unversioned sections sit in
 * `children`, and the explicitly versioned ORM trees sit in `fallback`, each
 * version folder marked `root: true`. That layout is what makes
 * `TreeContextProvider` pick the version folder as the tree root for an
 * `/orm/v7/...` page, and it is what the prev/next resolver has to reproduce.
 */
function buildTree(): PageTree.Root {
  const versionFolder = (version: string): PageTree.Folder => ({
    type: "folder",
    name: version,
    root: true,
    children: [
      page(`Prisma ORM ${version}`, `/orm/${version}`),
      { $id: `sep-${version}`, type: "separator", name: "Reference" },
      page(`Client reference ${version}`, `/orm/${version}/reference/prisma-client-reference`),
      page(`Schema reference ${version}`, `/orm/${version}/reference/prisma-schema-reference`),
    ],
  });

  return {
    type: "root",
    name: "Documentation",
    children: [
      {
        type: "folder",
        name: "Postgres",
        root: true,
        children: [
          page("Overview", "/postgres/overview"),
          page("Getting started", "/postgres/getting-started"),
          {
            $id: "ext",
            type: "page",
            name: "Status",
            url: "https://status.prisma.io",
            external: true,
          },
          page("Pricing", "/postgres/pricing"),
        ],
      },
    ],
    fallback: {
      type: "root",
      name: "Docs",
      children: [
        {
          type: "folder",
          name: "Orm",
          root: true,
          children: [versionFolder("v6"), versionFolder("v7")],
        },
      ],
    },
  } as unknown as PageTree.Root;
}

test("resolves the neighbours inside the active section", () => {
  const items = getPageFooterItems(buildTree(), "/postgres/getting-started");

  assert.equal(items.previous?.url, "/postgres/overview");
  assert.equal(items.next?.url, "/postgres/pricing");
});

test("carries the descriptions the footer cards render", () => {
  const items = getPageFooterItems(buildTree(), "/postgres/getting-started");

  assert.equal(items.previous?.description, "About Overview");
  assert.equal(items.next?.description, "About Pricing");
});

test("skips external links, as the client footer did", () => {
  const items = getPageFooterItems(buildTree(), "/postgres/getting-started");

  assert.notEqual(items.next?.url, "https://status.prisma.io");
});

test("stays inside the active ORM version", () => {
  const items = getPageFooterItems(buildTree(), "/orm/v7/reference/prisma-client-reference");

  assert.equal(items.previous?.url, "/orm/v7");
  assert.equal(items.next?.url, "/orm/v7/reference/prisma-schema-reference");

  const v6 = getPageFooterItems(buildTree(), "/orm/v6/reference/prisma-client-reference");
  assert.equal(v6.previous?.url, "/orm/v6");
  assert.equal(v6.next?.url, "/orm/v6/reference/prisma-schema-reference");
});

test("has no previous on the first page and no next on the last", () => {
  const first = getPageFooterItems(buildTree(), "/postgres/overview");
  assert.equal(first.previous, undefined);
  assert.equal(first.next?.url, "/postgres/getting-started");

  const last = getPageFooterItems(buildTree(), "/orm/v7/reference/prisma-schema-reference");
  assert.equal(last.previous?.url, "/orm/v7/reference/prisma-client-reference");
  assert.equal(last.next, undefined);
});

test("returns nothing for a pathname that is not in the tree", () => {
  assert.deepEqual(getPageFooterItems(buildTree(), "/nope/at/all"), {});
});

test("tolerates the /docs basePath on the pathname", () => {
  const items = getPageFooterItems(buildTree(), "/postgres/getting-started/");

  assert.equal(items.previous?.url, "/postgres/overview");
});
