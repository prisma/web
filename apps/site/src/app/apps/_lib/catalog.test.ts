import assert from "node:assert/strict";
import test from "node:test";
import {
  CATEGORY_ORDER,
  enrichTemplates,
  filterTemplates,
  frameworkMeta,
  frameworkOptions,
  groupByCategory,
  sortTemplates,
  templateManifestSchema,
  TEMPLATE_META,
  type ManifestTemplate,
} from "./catalog";

// The live manifest as of 2026-10, plus an entry the registry has never seen so
// the fallbacks are exercised.
const MANIFEST: ManifestTemplate[] = [
  {
    id: "hono",
    name: "Hono API",
    description: "Hono REST API.",
    path: "compute/hono",
    framework: "hono",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "Next.js App Router app.",
    path: "compute/nextjs",
    framework: "nextjs",
  },
  {
    id: "tanstack-start",
    name: "TanStack Start",
    description: "TanStack Start app.",
    path: "compute/tanstack-start",
    framework: "tanstack-start",
  },
  {
    id: "personal-site",
    name: "Personal Site",
    description: "Astro personal site.",
    path: "compute/personal-site",
    framework: "astro",
  },
  {
    id: "remix-run-blog",
    name: "Remix Blog",
    description: "A template the registry does not know.",
    path: "compute/remix-run-blog",
    framework: "remix-run",
  },
];

const NOW = new Date("2026-10-05T00:00:00Z");
const catalog = enrichTemplates(MANIFEST, NOW);
const byId = (id: string) => {
  const found = catalog.find((template) => template.id === id);
  assert.ok(found, `expected ${id} in the catalog`);
  return found;
};

test("manifest schema accepts entries with and without a framework", () => {
  const withFramework = templateManifestSchema.safeParse({ version: 1, templates: MANIFEST });
  assert.ok(withFramework.success);

  const legacy = templateManifestSchema.safeParse({
    version: 1,
    templates: MANIFEST.map(({ framework: _framework, ...rest }) => rest),
  });
  assert.ok(legacy.success);
});

test("legacy manifest entries take their framework from the registry", () => {
  const [legacy] = enrichTemplates([{ ...MANIFEST[0], framework: undefined }], NOW);
  assert.equal(legacy.framework.id, "hono");
  assert.equal(legacy.framework.label, "Hono");
});

test("unknown templates still render with fallbacks", () => {
  const unknown = byId("remix-run-blog");
  assert.equal(unknown.category, "app");
  assert.equal(unknown.framework.label, "Remix Run");
  assert.equal(unknown.framework.logo, undefined);
  assert.equal(unknown.preview, null);
  assert.equal(unknown.publishedAt, null);
  assert.equal(unknown.popularRank, null);
  assert.deepEqual(
    unknown.stack.map((item) => item.id),
    ["prisma-orm", "prisma-postgres", "bun", "typescript"],
  );
  assert.ok(
    unknown.featuredRank > Math.max(...Object.values(TEMPLATE_META).map((m) => m.featuredRank)),
    "unknown templates sort after every curated one",
  );
});

test("every template is by Prisma unless the manifest or registry says otherwise", () => {
  for (const template of catalog) {
    assert.equal(template.author.name, "Prisma", `${template.id} should default to Prisma`);
    assert.equal(template.author.logo, null, "the Prisma mark renders inline");
  }
});

test("a manifest author is credited as written, with or without a logo", () => {
  const author = { name: "Acme", url: "https://github.com/acme" };
  const [plain, withLogo] = enrichTemplates(
    [
      { ...MANIFEST[4], author },
      { ...MANIFEST[4], author: { ...author, logo: "https://example.com/acme.svg" } },
    ],
    NOW,
  );
  assert.deepEqual(plain.author, { name: "Acme", href: "https://github.com/acme", logo: null });
  assert.equal(withLogo.author.logo, "https://example.com/acme.svg");

  const parsed = templateManifestSchema.safeParse({
    version: 1,
    templates: [{ ...MANIFEST[4], author: { name: "Acme", url: "not a url" } }],
  });
  assert.equal(parsed.success, false, "an author needs a real link");
});

test("deploy and source URLs point at the console and the examples repo", () => {
  const hono = byId("hono");
  assert.equal(
    hono.deployUrl,
    "https://console.prisma.io/apps/hono?utm_source=website&utm_medium=templates",
  );
  assert.equal(hono.sourceUrl, "https://github.com/prisma/prisma-examples/tree/latest/compute/hono");
});

test("a template is new for sixty days after it lands", () => {
  assert.equal(byId("personal-site").isNew, true, "landed 2026-08-20, 46 days before NOW");
  assert.equal(byId("hono").isNew, false, "landed 2026-07-21, 76 days before NOW");

  const later = enrichTemplates(MANIFEST, new Date("2026-12-01T00:00:00Z"));
  assert.equal(later.find((t) => t.id === "personal-site")?.isNew, false);
});

test("featured order follows the curated ranks, then manifest order", () => {
  assert.deepEqual(
    sortTemplates(catalog, "featured").map((t) => t.id),
    ["nextjs", "hono", "tanstack-start", "personal-site", "remix-run-blog"],
  );
});

test("newest order is by landing date, undated last, manifest order as tie-break", () => {
  assert.deepEqual(
    sortTemplates(catalog, "newest").map((t) => t.id),
    ["personal-site", "hono", "nextjs", "tanstack-start", "remix-run-blog"],
  );
});

test("popular order uses the popularity ranks and puts unranked templates last", () => {
  assert.deepEqual(
    sortTemplates(catalog, "popular").map((t) => t.id),
    ["nextjs", "hono", "tanstack-start", "personal-site", "remix-run-blog"],
  );
});

test("sorting never mutates the input", () => {
  const before = catalog.map((t) => t.id);
  sortTemplates(catalog, "newest");
  assert.deepEqual(
    catalog.map((t) => t.id),
    before,
  );
});

test("filters combine category and framework", () => {
  assert.deepEqual(
    filterTemplates(catalog, { category: "app", framework: "all" }).map((t) => t.id),
    ["hono", "nextjs", "tanstack-start", "remix-run-blog"],
  );
  assert.deepEqual(
    filterTemplates(catalog, { category: "starter", framework: "all" }).map((t) => t.id),
    ["personal-site"],
  );
  assert.deepEqual(
    filterTemplates(catalog, { category: "all", framework: "nextjs" }).map((t) => t.id),
    ["nextjs"],
  );
  assert.deepEqual(
    filterTemplates(catalog, { category: "starter", framework: "nextjs" }),
    [],
    "a framework with no template in the category yields no results rather than throwing",
  );
});

test("framework options list only frameworks present, in featured order, with counts", () => {
  const options = frameworkOptions(catalog);
  assert.deepEqual(
    options.map((o) => o.framework.id),
    ["nextjs", "hono", "tanstack-start", "astro", "remix-run"],
  );
  assert.ok(options.every((o) => o.count === 1));
  assert.ok(
    !options.some((o) => o.framework.id === "nestjs"),
    "registry-only frameworks are not offered as filters",
  );
});

test("category groups follow CATEGORY_ORDER and skip empty groups", () => {
  const groups = groupByCategory(catalog);
  assert.deepEqual(
    groups.map((g) => g.category),
    [...CATEGORY_ORDER],
  );
  assert.deepEqual(
    groupByCategory(filterTemplates(catalog, { category: "all", framework: "astro" })).map(
      (g) => g.category,
    ),
    ["starter"],
  );
});

test("frameworkMeta falls back to a title-cased label", () => {
  assert.equal(frameworkMeta("react-router").label, "React Router");
  assert.equal(frameworkMeta("sveltekit").label, "SvelteKit");
  assert.equal(frameworkMeta("some-new-thing").label, "Some New Thing");
});
