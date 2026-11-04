import { securityHeaders } from "../../../../../../packages/ui/security-headers.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  CATEGORY_ORDER,
  authorBadge,
  enrichTemplates,
  filterTemplates,
  frameworkMeta,
  frameworkOptions,
  groupByCategory,
  ogCardPathFor,
  sortTemplates,
  templatePage,
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
    assert.equal(template.author.logo, null);
    assert.deepEqual(authorBadge(template.author), { kind: "prisma" });
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
  assert.deepEqual(authorBadge(plain.author), {
    kind: "photo",
    src: "https://github.com/acme.png",
  });
  assert.deepEqual(authorBadge(withLogo.author), {
    kind: "photo",
    src: "https://example.com/acme.svg",
  });

  const parsed = templateManifestSchema.safeParse({
    version: 1,
    templates: [{ ...MANIFEST[4], author: { name: "Acme", url: "not a url" } }],
  });
  assert.equal(parsed.success, false, "an author needs a real link");
});

test("a community author with no logo gets their GitHub profile photo", () => {
  const author = {
    name: "Mohammed Obaid",
    href: "https://github.com/mdobaid311",
    logo: null,
  };
  assert.deepEqual(authorBadge(author), {
    kind: "photo",
    src: "https://github.com/mdobaid311.png",
  });
  assert.deepEqual(authorBadge({ ...author, href: "https://github.com/mdobaid311/" }), {
    kind: "photo",
    src: "https://github.com/mdobaid311.png",
  });
  assert.deepEqual(
    authorBadge({ ...author, href: "https://www.github.com/mdobaid311?tab=repositories" }),
    { kind: "photo", src: "https://github.com/mdobaid311.png" },
  );
  assert.deepEqual(authorBadge({ ...author, href: "https://github.com/mdobaid311/room-booking" }), {
    kind: "photo",
    src: "https://github.com/mdobaid311.png",
  });
});

test("a GitHub avatar uses the profile login, or the login after /orgs/", () => {
  const photo = (href: string) => authorBadge({ name: "Acme", href, logo: null });

  assert.deepEqual(photo("https://github.com/acme"), {
    kind: "photo",
    src: "https://github.com/acme.png",
  });
  assert.deepEqual(photo("https://github.com/acme/room-booking"), {
    kind: "photo",
    src: "https://github.com/acme.png",
  });
  assert.deepEqual(photo("https://github.com/orgs/acme"), {
    kind: "photo",
    src: "https://github.com/acme.png",
  });
  assert.deepEqual(photo("https://github.com/orgs/acme/people"), {
    kind: "photo",
    src: "https://github.com/acme.png",
  });
  assert.deepEqual(photo("https://www.github.com/orgs/acme/repositories"), {
    kind: "photo",
    src: "https://github.com/acme.png",
  });
  assert.deepEqual(photo("https://github.com/orgs"), { kind: "github" });
  assert.deepEqual(photo("https://github.com/orgs/-acme"), { kind: "github" });
});

test("Prisma keeps its mark, and a missing photo never falls back to it", () => {
  for (const href of [
    "https://github.com/prisma",
    "https://github.com/prisma/",
    "https://github.com/Prisma",
    "https://www.github.com/prisma",
    "https://github.com/orgs/prisma",
    "https://github.com/orgs/prisma/people",
  ]) {
    assert.deepEqual(authorBadge({ name: "Prisma", href, logo: null }), { kind: "prisma" });
  }

  assert.deepEqual(
    authorBadge({
      name: "Prisma",
      href: "https://github.com/prisma",
      logo: "https://example.com/x.svg",
    }),
    { kind: "prisma" },
    "an explicit logo does not replace the Prisma mark",
  );
  assert.deepEqual(authorBadge({ name: "Acme", href: "https://acme.example", logo: null }), {
    kind: "github",
  });
  assert.deepEqual(authorBadge({ name: "Acme", href: "not a url", logo: null }), {
    kind: "github",
  });
  assert.deepEqual(authorBadge({ name: "Acme", href: "http://github.com/acme", logo: null }), {
    kind: "github",
  });
});

test("room booking uses its scheduler screenshot instead of the framework fallback", () => {
  const [room] = enrichTemplates(
    [
      {
        id: "room-booking-prisma-template",
        name: "Room Booking",
        description: "Next.js meeting room booking on a Resource Scheduler timeline.",
        path: "compute/room-booking-prisma-template",
        framework: "nextjs",
        author: { name: "Mohammed Obaid", url: "https://github.com/mdobaid311" },
      },
    ],
    NOW,
  );
  assert.equal(room.preview, "/apps/previews/room-booking-prisma-template.png");
  assert.equal(room.useCase, "Booking app");
  assert.equal(room.publishedAt, "2026-11-01");
  assert.equal(room.pagePath, "/apps/room-booking-prisma-template");
  assert.equal(room.author.name, "Mohammed Obaid", "the manifest author wins");
  const png = readFileSync(
    new URL("../../../../public/apps/previews/room-booking-prisma-template.png", import.meta.url),
  );
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
});

test("the site image policy allows GitHub profile photos to load", () => {
  const policy = securityHeaders.find(({ key }) => key === "Content-Security-Policy")?.value ?? "";
  const imgSrc = policy.match(/img-src[\s\S]*?;/)?.[0] ?? "";
  assert.match(imgSrc, /https:\/\/github\.com(?:\s|\/)/);
  assert.match(imgSrc, /https:\/\/avatars\.githubusercontent\.com/);
});

test("deploy and source URLs point at the console and the examples repo", () => {
  const hono = byId("hono");
  assert.equal(
    hono.deployUrl,
    "https://console.prisma.io/apps/hono?utm_source=website&utm_medium=templates",
  );
  assert.equal(
    hono.sourceUrl,
    "https://github.com/prisma/prisma-examples/tree/latest/compute/hono",
  );
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

test("a curated template page uses its own copy and licence", () => {
  const [room] = enrichTemplates(
    [
      {
        id: "room-booking-prisma-template",
        name: "Room Booking",
        description: "Next.js meeting room booking.",
        path: "compute/room-booking-prisma-template",
        framework: "nextjs",
        author: { name: "Mohammed Obaid", url: "https://github.com/mdobaid311" },
      },
    ],
    NOW,
  );
  const page = templatePage(room);
  assert.equal(page.title, "Room Booking: a Next.js app that never double-books");
  assert.ok(page.description.length <= 160, `meta description is ${page.description.length} chars`);
  assert.notEqual(page.ogTitle, page.title);
  assert.equal(page.highlights.length, 4);
  assert.equal(page.license.label, "MIT");
  assert.match(page.license.href, /room-booking-prisma-template\/LICENSE$/);
});

test("an uncurated template still gets a complete page from the manifest", () => {
  const [novel] = enrichTemplates(
    [
      {
        id: "remix-notes",
        name: "Remix Notes",
        description: "A notes app.",
        path: "compute/remix-notes",
        framework: "remix-run",
      },
    ],
    NOW,
  );
  const page = templatePage(novel);
  assert.equal(page.title, "Remix Notes on Prisma Compute: Remix Run app template");
  assert.match(page.description, /^A notes app\. Deploy it to Prisma Compute in one click/);
  assert.equal(page.ogTitle, "Remix Notes on Prisma Compute");
  assert.equal(page.tagline, "A notes app.");
  assert.deepEqual(page.highlights, []);
  assert.equal(page.demoUrl, null);
  assert.equal(page.license.label, "Apache 2.0");
  assert.equal(novel.pagePath, "/apps/remix-notes");
});

test("the social card URL names the template and changes with its copy", () => {
  const manifest = {
    id: "remix-notes",
    name: "Remix Notes",
    description: "A notes app.",
    path: "compute/remix-notes",
    framework: "remix-run",
  };
  const [a] = enrichTemplates([manifest], NOW);
  const [b] = enrichTemplates([{ ...manifest, description: "A better notes app." }], NOW);
  const [again] = enrichTemplates([manifest], NOW);

  const url = new URL(ogCardPathFor(a), "https://www.prisma.io");
  assert.equal(url.pathname, "/og/app.png");
  assert.equal(url.searchParams.get("id"), "remix-notes");
  assert.match(url.searchParams.get("v") ?? "", /^[0-9a-f]{8}$/);
  assert.equal(ogCardPathFor(a), ogCardPathFor(again));
  assert.notEqual(ogCardPathFor(a), ogCardPathFor(b));
});
