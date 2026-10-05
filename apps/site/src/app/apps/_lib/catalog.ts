import { z } from "zod";

// The /apps gallery is fed by the Compute template manifest in
// prisma/prisma-examples. The manifest is the source of truth for which
// templates exist and what they are called; this module layers the gallery's
// own knowledge on top: framework identity and logo, the template's category,
// the stack it ships with, when it landed, the curated Featured and Popular
// orders, and the preview screenshot. Anything the manifest adds later that
// the registry here does not know about still renders, with sensible
// fallbacks, so a new template is never blocked on a site change.

export const TEMPLATE_MANIFEST_URL =
  "https://raw.githubusercontent.com/prisma/prisma-examples/latest/compute/templates.json";

export const TEMPLATE_SOURCE_BASE = "https://github.com/prisma/prisma-examples/tree/latest/";

export const templateManifestSchema = z.object({
  version: z.literal(1),
  templates: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      name: z.string().trim().min(1),
      description: z.string().trim().min(1),
      path: z.string().regex(/^compute\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/),
      // Added to the manifest after the gallery shipped; older manifests may
      // omit it, in which case the framework is read from the registry below.
      framework: z.string().trim().min(1).optional(),
      // Who built it. Prisma's own templates omit it; a community template
      // names its author here and the gallery credits them without a site
      // change. The logo is an absolute URL, or omitted for a plain name.
      author: z
        .object({
          name: z.string().trim().min(1),
          url: z.string().url(),
          logo: z.string().url().optional(),
        })
        .optional(),
    }),
  ),
});

export type ManifestTemplate = z.infer<typeof templateManifestSchema>["templates"][number];

// ---------------------------------------------------------------------------
// Categories

export type Category = "app" | "starter";

// Starters lead: the personal site is the quickest thing to make your own, and
// the framework apps follow underneath.
export const CATEGORY_ORDER: readonly Category[] = ["starter", "app"];

export type CategoryMeta = {
  label: string;
  shortLabel: string;
  /** One line under the section heading. */
  description: string;
  /** A phrase inside `description` to render as a link. */
  link?: { label: string; href: string };
  dot: string;
};

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  app: {
    label: "App templates",
    shortLabel: "Apps",
    description: "Framework starters with Prisma Stack, ready to build on top of and ship.",
    link: { label: "Prisma Stack", href: "/stack" },
    dot: "bg-prism-red-500",
  },
  starter: {
    label: "Personal & starter templates",
    shortLabel: "Personal & starter",
    description: "Small sites and starting points that run on Prisma Compute without a database.",
    dot: "bg-prism-yellow-400",
  },
};

// ---------------------------------------------------------------------------
// Frameworks

export type FrameworkMeta = {
  id: string;
  label: string;
  /** Path under /public. Omitted when the site has no mark for the framework. */
  logo?: string;
  /** Where the framework chip links to: the site's framework page or the Prisma 8 guide. */
  href?: string;
};

// Keys follow the manifest's `framework` values (the console's compute-sdk
// framework ids). Only frameworks that appear in the live manifest become
// filter options, so listing one here does not show it on the page.
export const FRAMEWORKS: Record<string, FrameworkMeta> = {
  nextjs: { id: "nextjs", label: "Next.js", logo: "/logos/nextjs-icon.svg", href: "/nextjs" },
  hono: {
    id: "hono",
    label: "Hono",
    logo: "/logos/hono.svg",
    href: "/docs/guides/next/frameworks/hono",
  },
  "tanstack-start": {
    id: "tanstack-start",
    label: "TanStack Start",
    logo: "/logos/tanstack.svg",
    href: "/docs/guides/next/frameworks/tanstack-start",
  },
  astro: {
    id: "astro",
    label: "Astro",
    logo: "/logos/astro.svg",
    href: "/docs/guides/next/frameworks/astro",
  },
  nestjs: { id: "nestjs", label: "NestJS", logo: "/icons/technologies/nestjs.svg", href: "/nestjs" },
  react: { id: "react", label: "React", logo: "/icons/technologies/react.svg", href: "/react" },
  nuxt: {
    id: "nuxt",
    label: "Nuxt",
    logo: "/logos/nuxt.svg",
    href: "/docs/guides/next/frameworks/nuxt",
  },
  sveltekit: {
    id: "sveltekit",
    label: "SvelteKit",
    logo: "/logos/svelte.svg",
    href: "/docs/guides/next/frameworks/sveltekit",
  },
  solidstart: { id: "solidstart", label: "SolidStart", logo: "/logos/solid-start.svg" },
  "react-router": { id: "react-router", label: "React Router", logo: "/logos/rr7.svg" },
  elysia: { id: "elysia", label: "Elysia" },
};

// Fall back to a readable label for a framework id the registry has never seen
// ("remix-run" -> "Remix Run"), so an unknown framework still filters and labels.
export function frameworkMeta(id: string): FrameworkMeta {
  const known = FRAMEWORKS[id];
  if (known) return known;
  const label = id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return { id, label };
}

// ---------------------------------------------------------------------------
// Stack chips — the logos beneath each description. Every chip links to the
// page on prisma.io (or the Prisma 8 guide) that explains that part of the
// stack, so the gallery doubles as a way into the rest of the site.

export type StackId = "prisma-orm" | "prisma-postgres" | "bun" | "typescript";

export type StackMeta = {
  id: StackId;
  label: string;
  href: string;
  /** Path under /public, or `null` for the Prisma mark, which renders inline so it can take the ink colour. */
  logo: string | null;
};

export const STACK: Record<StackId, StackMeta> = {
  "prisma-orm": { id: "prisma-orm", label: "Prisma ORM", href: "/orm", logo: null },
  "prisma-postgres": {
    id: "prisma-postgres",
    label: "Prisma Postgres",
    href: "/postgres",
    logo: "/icons/technologies/prisma-postgres.svg",
  },
  bun: { id: "bun", label: "Bun", href: "/docs/guides/next/runtimes/bun", logo: "/logos/bun.svg" },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    href: "/typescript",
    logo: "/icons/technologies/ts.svg",
  },
};

// What a Compute template ships with when the registry has nothing specific to
// say: the compute/ examples are database-backed TypeScript apps on Bun.
const DEFAULT_STACK: readonly StackId[] = ["prisma-orm", "prisma-postgres", "bun", "typescript"];

// ---------------------------------------------------------------------------
// Authors

export type AuthorMeta = {
  name: string;
  href: string;
  /** Path under /public or an absolute URL, or `null` for the Prisma mark. */
  logo: string | null;
};

export const PRISMA_AUTHOR: AuthorMeta = {
  name: "Prisma",
  href: "https://github.com/prisma",
  logo: null,
};

// Where community templates come from: a folder under compute/ and an entry in
// the manifest naming the author, sent as a pull request to prisma-examples.
export const CONTRIBUTE = {
  repoUrl: "https://github.com/prisma/prisma-examples",
  folderUrl: "https://github.com/prisma/prisma-examples/tree/latest/compute",
  manifestUrl: "https://github.com/prisma/prisma-examples/blob/latest/compute/templates.json",
  guideUrl: "https://github.com/prisma/prisma-examples/blob/latest/CONTRIBUTING.md",
  requestUrl:
    "https://github.com/prisma/prisma-examples/issues/new?title=Compute%20template%20request%3A%20",
} as const;

// ---------------------------------------------------------------------------
// Per-template registry

type TemplateMeta = {
  category: Category;
  /** Who maintains the template. Defaults to Prisma. */
  author?: AuthorMeta;
  /** Short use-case label shown beside the framework ("REST API", "Full-stack app"). */
  useCase: string;
  /** Framework id, used when the manifest entry predates the `framework` field. */
  framework?: string;
  stack: readonly StackId[];
  /** ISO date the template landed in prisma-examples (first commit on its folder). */
  publishedAt: string;
  /** 1 = first. Hand-ordered: the default view leads with the broadest full-stack starter. */
  featuredRank: number;
  /**
   * 1 = first. The console records a deploy_button_succeeded event per template
   * but does not expose counts yet, so this order is maintained by hand from
   * those numbers. Templates without a rank sort after ranked ones.
   */
  popularRank?: number;
  /** Screenshot under /public, 1280x800, captured from the running template. */
  preview?: string;
};

export const TEMPLATE_META: Record<string, TemplateMeta> = {
  nextjs: {
    category: "app",
    useCase: "Full-stack app",
    framework: "nextjs",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-07-21",
    featuredRank: 1,
    popularRank: 1,
    preview: "/apps/previews/nextjs.png",
  },
  hono: {
    category: "app",
    useCase: "REST API",
    framework: "hono",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-07-21",
    featuredRank: 2,
    popularRank: 2,
    preview: "/apps/previews/hono.png",
  },
  "tanstack-start": {
    category: "app",
    useCase: "Full-stack app",
    framework: "tanstack-start",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-07-21",
    featuredRank: 3,
    popularRank: 3,
    preview: "/apps/previews/tanstack-start.png",
  },
  "personal-site": {
    category: "starter",
    useCase: "Personal site",
    framework: "astro",
    stack: ["bun", "typescript"],
    publishedAt: "2026-08-20",
    featuredRank: 4,
    popularRank: 4,
    preview: "/apps/previews/personal-site.png",
  },
};

// A template counts as new for this long after it lands.
const NEW_FOR_DAYS = 60;

// ---------------------------------------------------------------------------
// Enriched gallery entries

export type GalleryTemplate = {
  id: string;
  name: string;
  description: string;
  path: string;
  sourceUrl: string;
  deployUrl: string;
  framework: FrameworkMeta;
  author: AuthorMeta;
  category: Category;
  useCase: string | null;
  stack: StackMeta[];
  publishedAt: string | null;
  isNew: boolean;
  featuredRank: number;
  popularRank: number | null;
  preview: string | null;
  /** Position in the manifest, the tie-breaker for every sort. */
  manifestIndex: number;
};

export function deployUrlFor(id: string): string {
  const url = new URL(`/apps/${id}`, "https://console.prisma.io");
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", "templates");
  return url.toString();
}

// The manifest names the author; the registry is the fallback for templates
// that predate the field, and Prisma is the default for everything else.
function authorFor(template: ManifestTemplate, meta: TemplateMeta | undefined): AuthorMeta {
  if (template.author) {
    return {
      name: template.author.name,
      href: template.author.url,
      logo: template.author.logo ?? null,
    };
  }
  return meta?.author ?? PRISMA_AUTHOR;
}

export function enrichTemplates(
  templates: readonly ManifestTemplate[],
  now: Date = new Date(),
): GalleryTemplate[] {
  const unranked = Object.values(TEMPLATE_META).length + 1;

  return templates.map((template, manifestIndex) => {
    const meta = TEMPLATE_META[template.id];
    const frameworkId = template.framework ?? meta?.framework ?? "unknown";
    const publishedAt = meta?.publishedAt ?? null;
    const ageDays = publishedAt
      ? (now.getTime() - new Date(publishedAt).getTime()) / 86_400_000
      : null;

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      path: template.path,
      sourceUrl: `${TEMPLATE_SOURCE_BASE}${template.path}`,
      deployUrl: deployUrlFor(template.id),
      framework: frameworkMeta(frameworkId),
      author: authorFor(template, meta),
      category: meta?.category ?? "app",
      useCase: meta?.useCase ?? null,
      stack: (meta?.stack ?? DEFAULT_STACK).map((id) => STACK[id]),
      publishedAt,
      isNew: ageDays !== null && ageDays >= 0 && ageDays <= NEW_FOR_DAYS,
      featuredRank: meta?.featuredRank ?? unranked + manifestIndex,
      popularRank: meta?.popularRank ?? null,
      preview: meta?.preview ?? null,
      manifestIndex,
    };
  });
}

// ---------------------------------------------------------------------------
// Sorting and filtering — pure, so the client gallery and the tests share them.

export type SortKey = "featured" | "newest" | "popular";

export const SORT_OPTIONS: readonly { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
];

export function isSortKey(value: string | null | undefined): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function isCategory(value: string | null | undefined): value is Category {
  return CATEGORY_ORDER.includes(value as Category);
}

const byManifest = (a: GalleryTemplate, b: GalleryTemplate) => a.manifestIndex - b.manifestIndex;

export function sortTemplates(templates: readonly GalleryTemplate[], sort: SortKey) {
  const list = [...templates];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => {
        if (a.publishedAt && b.publishedAt && a.publishedAt !== b.publishedAt) {
          return a.publishedAt < b.publishedAt ? 1 : -1;
        }
        // Undated templates sort after dated ones.
        if (!a.publishedAt !== !b.publishedAt) return a.publishedAt ? -1 : 1;
        return byManifest(a, b);
      });
    case "popular":
      return list.sort((a, b) => {
        if (a.popularRank !== null && b.popularRank !== null && a.popularRank !== b.popularRank) {
          return a.popularRank - b.popularRank;
        }
        if ((a.popularRank === null) !== (b.popularRank === null)) {
          return a.popularRank === null ? 1 : -1;
        }
        return a.featuredRank - b.featuredRank || byManifest(a, b);
      });
    default:
      return list.sort((a, b) => a.featuredRank - b.featuredRank || byManifest(a, b));
  }
}

export type GalleryFilter = {
  category: Category | "all";
  framework: string | "all";
};

export function filterTemplates(templates: readonly GalleryTemplate[], filter: GalleryFilter) {
  return templates.filter(
    (template) =>
      (filter.category === "all" || template.category === filter.category) &&
      (filter.framework === "all" || template.framework.id === filter.framework),
  );
}

/** Frameworks present in the catalog, in Featured order, with how many templates use each. */
export function frameworkOptions(templates: readonly GalleryTemplate[]) {
  const counts = new Map<string, { framework: FrameworkMeta; count: number }>();
  for (const template of sortTemplates(templates, "featured")) {
    const entry = counts.get(template.framework.id);
    if (entry) entry.count += 1;
    else counts.set(template.framework.id, { framework: template.framework, count: 1 });
  }
  return [...counts.values()];
}

/** Templates grouped by category, in category order, skipping empty groups. */
export function groupByCategory(templates: readonly GalleryTemplate[]) {
  return CATEGORY_ORDER.map((category) => ({
    category,
    meta: CATEGORY_META[category],
    templates: templates.filter((template) => template.category === category),
  })).filter((group) => group.templates.length > 0);
}
