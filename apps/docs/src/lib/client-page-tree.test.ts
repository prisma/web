import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import type * as PageTree from "fumadocs-core/page-tree";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { getClientPageTree, trimPageTreeForClient } from "./client-page-tree.ts";

/** A tree shaped like `source.pageTree`: three ORM versions, one other section. */
function buildTree(): PageTree.Root {
  const page = (name: string, url: string, file: string): PageTree.Item => ({
    $id: file,
    type: "page",
    name,
    description: `Description of ${name}`,
    icon: undefined,
    url,
    $ref: file as never,
  });

  const versionFolder = (version: string): PageTree.Folder => ({
    type: "folder",
    name: version,
    root: true,
    defaultOpen: undefined,
    collapsible: undefined,
    description: undefined,
    children: [
      page(`Prisma ORM ${version}`, `/orm/${version}`, `orm/${version}/index.mdx`),
      page("Reference", `/orm/${version}/reference`, `orm/${version}/reference.mdx`),
    ],
    $id: `orm/${version}`,
    $ref: { folder: `orm/${version}`, meta: `orm/${version}/meta.json` } as never,
    icon: createElement("svg", { key: version }),
  });

  return {
    type: "root",
    $ref: { folder: "", meta: "meta.json" } as never,
    $id: "root",
    name: "Documentation",
    description: undefined,
    children: [
      {
        type: "folder",
        name: "ORM",
        root: true,
        children: [page("Prisma ORM", "/orm", "orm/index.mdx")],
        $id: "orm",
        $ref: { folder: "orm", meta: "orm/meta.json" } as never,
      },
      {
        type: "folder",
        name: "Postgres",
        root: true,
        children: [
          { $id: "_0", type: "separator", name: "Start", icon: undefined },
          page("Overview", "/postgres/overview", "postgres/overview.mdx"),
        ],
        $id: "postgres",
        $ref: { folder: "postgres", meta: "postgres/meta.json" } as never,
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
          children: [versionFolder("v6"), versionFolder("v7"), versionFolder("v8")],
          $id: "orm-fallback",
          $ref: { folder: "orm", meta: undefined } as never,
        },
      ],
    },
  } as unknown as PageTree.Root;
}

function collectKeys(node: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) {
    for (const child of node) collectKeys(child, out);
    return out;
  }
  if (node === null || typeof node !== "object") return out;
  // A React element is opaque here; the transform must not walk into it.
  if ("$$typeof" in (node as Record<string, unknown>)) return out;
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    out.add(key);
    collectKeys(value, out);
  }
  return out;
}

function collectIds(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const child of node) collectIds(child, out);
    return out;
  }
  if (node === null || typeof node !== "object") return out;
  if ("$$typeof" in (node as Record<string, unknown>)) return out;
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === "$id" && typeof value === "string") out.push(value);
    collectIds(value, out);
  }
  return out;
}

test("drops every field the client never reads", () => {
  const keys = collectKeys(trimPageTreeForClient(buildTree()));

  assert.ok(!keys.has("description"), "description must not cross the boundary");
  assert.ok(!keys.has("$ref"), "$ref must not cross the boundary");
});

test("keeps every field the sidebar, breadcrumbs and version switcher read", () => {
  const keys = collectKeys(trimPageTreeForClient(buildTree()));

  for (const key of ["type", "name", "url", "children", "root", "$id", "fallback", "icon"]) {
    assert.ok(keys.has(key), `${key} must survive`);
  }
});

test("omits undefined-valued keys instead of serialising them", () => {
  const trimmed = trimPageTreeForClient(buildTree());
  const postgres = trimmed.children[1] as PageTree.Folder;
  const separator = postgres.children[0];

  assert.ok(!Object.hasOwn(separator, "icon"), "an undefined icon key must be absent");
  assert.equal(separator.icon, undefined, "and still read back as undefined");
});

test("keeps the whole structure: every version, every page, in order", () => {
  const trimmed = trimPageTreeForClient(buildTree());

  assert.deepEqual(
    trimmed.children.map((child) => child.name),
    ["ORM", "Postgres"],
  );

  const ormFallback = trimmed.fallback?.children[0] as PageTree.Folder;
  assert.deepEqual(
    ormFallback.children.map((child) => child.name),
    ["v6", "v7", "v8"],
  );
  const v7 = ormFallback.children[1] as PageTree.Folder;
  assert.deepEqual(
    v7.children.map((child) => (child as PageTree.Item).url),
    ["/orm/v7", "/orm/v7/reference"],
  );
});

test("copies React element icons by reference rather than walking into them", () => {
  const tree = buildTree();
  const ormFallback = tree.fallback?.children[0] as PageTree.Folder;
  const original = (ormFallback.children[0] as PageTree.Folder).icon;

  const trimmed = trimPageTreeForClient(tree);
  const trimmedFallback = trimmed.fallback?.children[0] as PageTree.Folder;

  assert.equal((trimmedFallback.children[0] as PageTree.Folder).icon, original);
});

test("rewrites $id to short unique ids", () => {
  const ids = collectIds(trimPageTreeForClient(buildTree()));

  assert.ok(ids.length > 0);
  assert.equal(new Set(ids).size, ids.length, "React keys must stay unique");
  for (const id of ids) {
    assert.ok(id.length <= 2, `expected a short id, got ${id}`);
  }
});

test("is pure: the source tree is untouched", () => {
  const tree = buildTree();
  const snapshot = JSON.stringify(tree, (key, value) => (key === "icon" ? undefined : value));

  trimPageTreeForClient(tree);

  assert.equal(
    JSON.stringify(tree, (key, value) => (key === "icon" ? undefined : value)),
    snapshot,
  );
});

test("getClientPageTree returns one stable object per source tree", () => {
  const tree = buildTree();

  // Both the docs layout and the global not-found boundary call this; React's
  // flight serialiser only deduplicates by reference, so two calls returning
  // two objects would put two trees in the payload.
  assert.equal(getClientPageTree(tree), getClientPageTree(tree));
  assert.notEqual(getClientPageTree(tree), getClientPageTree(buildTree()));
});

test("is materially smaller than the tree it replaces", () => {
  const tree = buildTree();
  const before = JSON.stringify(tree).length;
  const after = JSON.stringify(trimPageTreeForClient(tree)).length;

  assert.ok(after < before * 0.7, `expected a >30% cut, got ${before} -> ${after}`);
});
