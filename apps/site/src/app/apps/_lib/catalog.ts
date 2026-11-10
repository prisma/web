import { z } from "zod";

// The /apps gallery is fed by the Compute template manifest in
// prisma/prisma-examples. The manifest is the source of truth for which
// templates exist and what they are called; this module layers the gallery's
// own knowledge on top: framework identity and logo, the stack it ships
// with, when it landed, the curated Featured and Popular orders, and the
// preview screenshot. Anything the manifest adds later that
// the registry here does not know about still renders, with sensible
// fallbacks, so a new template is never blocked on a site change.

export const TEMPLATE_MANIFEST_URL = manifestUrlFor("latest");

// Branches of prisma-examples whose manifests preview deployments and local
// development merge in after the latest branch, so a template that is still
// under review shows up on its gallery PR's preview. List the branch here in
// the PR that adds the template's page, and drop it once the template merges.
// Production reads the latest branch only.
export const PREVIEW_MANIFEST_BRANCHES: readonly string[] = [
  // Resource Discovery (DevShelf), prisma/prisma-examples#8651
  "compute/devshelf-prisma-8-review-fixes",
];

export function manifestUrlFor(branch: string): string {
  return `https://raw.githubusercontent.com/prisma/prisma-examples/${branch}/compute/templates.json`;
}

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
      // change. `logo` is an optional absolute URL. When it is omitted, the
      // card paints the Prisma mark for Prisma and the GitHub profile photo
      // for everyone else.
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
  nestjs: {
    id: "nestjs",
    label: "NestJS",
    logo: "/icons/technologies/nestjs.svg",
    href: "/nestjs",
  },
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
  /**
   * Explicit mark: a path under /public or an absolute URL.
   * `null` is not "the Prisma mark". The card resolves that itself: Prisma
   * keeps its mark, and a community author gets the GitHub profile photo.
   */
  logo: string | null;
};

export const PRISMA_AUTHOR: AuthorMeta = {
  name: "Prisma",
  href: "https://github.com/prisma",
  logo: null,
};

// GitHub usernames are 1–39 characters, alphanumeric or hyphens, and cannot
// start or end with a hyphen. The avatar URL is the profile plus `.png`,
// which redirects to avatars.githubusercontent.com.
const GITHUB_LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

function githubLogin(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") return null;
  const segments = url.pathname.split("/").filter(Boolean);
  // /orgs/{login}/… is an organization page. The first segment is the route,
  // not the account, so the avatar login is the one after it.
  const login = segments[0]?.toLowerCase() === "orgs" ? segments[1] : segments[0];
  if (!login || !GITHUB_LOGIN.test(login)) return null;
  return login;
}

function isPrismaAuthor(author: Pick<AuthorMeta, "name" | "href">): boolean {
  return author.name === "Prisma" && githubLogin(author.href)?.toLowerCase() === "prisma";
}

// What the byline paints. `logo: null` only means "no explicit mark": Prisma
// still gets its own logo, and a community profile becomes
// https://github.com/{login}.png. A photo that fails to load is the card's
// concern; it falls back to the GitHub mark, never to Prisma.
export type AuthorBadge = { kind: "prisma" } | { kind: "photo"; src: string } | { kind: "github" };

export function authorBadge(author: AuthorMeta): AuthorBadge {
  if (isPrismaAuthor(author)) return { kind: "prisma" };
  if (author.logo) return { kind: "photo", src: author.logo };
  const login = githubLogin(author.href);
  if (login) return { kind: "photo", src: `https://github.com/${login}.png` };
  return { kind: "github" };
}

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
// Per-template pages — every template has a public permalink at /apps/{id}
// built from the manifest alone. The optional `page` block below adds what
// the manifest cannot say: a sharper headline, a few highlights, a running
// demo. A template without one still gets a complete page from its name,
// description, framework, author and stack.

export type TemplateHighlight = { title: string; body: string };

export type TemplatePageMeta = {
  /** One sentence under the name, in place of the manifest description. */
  tagline?: string;
  /** `<title>` without the site name. Defaults to "{name} on Prisma Compute: {framework} app template". */
  seoTitle?: string;
  /** Meta description, ideally under 160 characters. Defaults to the manifest description plus the deploy line. */
  seoDescription?: string;
  /** Headline on the social card and in og:title. Defaults to `seoTitle`. */
  ogTitle?: string;
  /** Body on the social card and in og:description. Defaults to `seoDescription`. */
  ogDescription?: string;
  /** Two to four things the app does, each a short title and one or two sentences. */
  highlights?: readonly TemplateHighlight[];
  /** A public, running copy of the template. */
  demoUrl?: string;
  /** Libraries the template is built around, beyond the stack chips. */
  builtWith?: readonly { label: string; href: string }[];
  /** The template's own licence, when it is not the repository's Apache 2.0. */
  license?: { label: string; href: string };
};

export function pagePathFor(id: string): string {
  return `/apps/${id}`;
}

// ---------------------------------------------------------------------------
// Per-template registry

type TemplateMeta = {
  /** Who maintains the template. Defaults to Prisma. */
  author?: AuthorMeta;
  /** Short use-case label shown beside the framework ("REST API", "Full-stack app", "Personal site"). */
  useCase?: string;
  /** Framework id, used when the manifest entry predates the `framework` field. */
  framework?: string;
  stack: readonly StackId[];
  /** ISO date the template landed in prisma-examples (first commit on its folder). */
  publishedAt?: string;
  /** 1 = first. Hand-ordered: the full-stack apps lead, broadest first, and the personal site closes. */
  featuredRank: number;
  /**
   * 1 = first. The console records a deploy_button_succeeded event per template
   * but does not expose counts yet, so this order is maintained by hand from
   * those numbers. Templates without a rank sort after ranked ones.
   */
  popularRank?: number;
  /** Screenshot under /public, 1280x800, captured from the running template. */
  preview?: string;
  /** Copy for the template's own page at /apps/{id}. */
  page?: TemplatePageMeta;
};

export const TEMPLATE_META: Record<string, TemplateMeta> = {
  nextjs: {
    useCase: "Full-stack app",
    framework: "nextjs",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-07-21",
    featuredRank: 1,
    popularRank: 1,
    preview: "/apps/previews/nextjs.png",
  },
  hono: {
    useCase: "REST API",
    framework: "hono",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-07-21",
    featuredRank: 2,
    popularRank: 2,
    preview: "/apps/previews/hono.png",
  },
  "tanstack-start": {
    useCase: "Full-stack app",
    framework: "tanstack-start",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-07-21",
    featuredRank: 3,
    popularRank: 3,
    preview: "/apps/previews/tanstack-start.png",
  },
  // The one template without a database, so it closes the Featured order:
  // the full-stack apps lead and the site is the quick thing to make your own.
  "personal-site": {
    useCase: "Personal site",
    framework: "astro",
    stack: ["bun", "typescript"],
    publishedAt: "2026-08-20",
    featuredRank: 6,
    popularRank: 4,
    preview: "/apps/previews/personal-site.png",
  },
  // The manifest supplies the author; the registry adds the use case, the
  // date it landed, the screenshot and the page copy.
  "room-booking-prisma-template": {
    useCase: "Booking app",
    framework: "nextjs",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-11-01",
    featuredRank: 4,
    preview: "/apps/previews/room-booking-prisma-template.png",
    page: {
      tagline: "Book meeting rooms on a drag-to-book timeline that never double-books.",
      seoTitle: "Room Booking: a Next.js app that never double-books",
      seoDescription:
        "Drag to book a meeting room on a timeline; a red footprint blocks busy slots. Next.js, Prisma ORM and Prisma Postgres by Mohammed Obaid. Deploy it in one click.",
      ogTitle: "Room Booking: meeting rooms that never double-book",
      ogDescription:
        "A drag-to-book timeline in Next.js with Prisma ORM and Prisma Postgres, by Mohammed Obaid. Deploy it to Prisma Compute in one click.",
      highlights: [
        {
          title: "Drag to book",
          body: "Rooms are rows, half hours are columns. Drag across free time to book, drag a booking to move it, drag its edge to resize it, click it to cancel.",
        },
        {
          title: "Red means taken",
          body: "A busy slot, a time outside opening hours or one that already started turns red before you drop, so most mistakes never reach the server.",
        },
        {
          title: "One winner per slot",
          body: "Every write runs in a transaction that locks the room and re-checks the rules, and a Postgres exclusion constraint backstops it. Twenty-five people booking the same slot at once: exactly one wins.",
        },
        {
          title: "On the office clock",
          body: "Times are shown and checked in the office's time zone, whatever zone the visitor or the server is in. An empty database seeds six rooms and a day of bookings on first visit.",
        },
      ],
      builtWith: [
        { label: "Resource Scheduler", href: "https://www.npmjs.com/package/resource-scheduler" },
      ],
      license: {
        label: "MIT",
        href: "https://github.com/prisma/prisma-examples/blob/latest/compute/room-booking-prisma-template/LICENSE",
      },
    },
  },
  // DevShelf by Anas Ibn Belal: a searchable resource directory. The manifest
  // supplies the author; the registry adds the use case, the date it landed,
  // the screenshot and the page copy.
  "scalable-indexing-platform-template": {
    useCase: "Resource directory",
    framework: "nextjs",
    stack: ["prisma-orm", "prisma-postgres", "bun", "typescript"],
    publishedAt: "2026-11-06",
    featuredRank: 5,
    preview: "/apps/previews/scalable-indexing-platform-template.png",
    page: {
      tagline:
        "A searchable resource directory with full-text search, filters and cursor pagination that stay fast past a million rows.",
      seoTitle: "Resource Discovery: a searchable directory in Next.js and Prisma",
      seoDescription:
        "Full-text search, filters and keyset pagination over a million rows. Next.js, Prisma ORM and Prisma Postgres by Anas Ibn Belal. Deploy it in one click.",
      ogTitle: "Resource Discovery: search a million rows in Next.js",
      ogDescription:
        "A searchable resource directory in Next.js with Prisma ORM and Prisma Postgres, by Anas Ibn Belal. Deploy it to Prisma Compute in one click.",
      highlights: [
        {
          title: "Search that uses an index",
          body: 'Titles and descriptions sit behind a PostgreSQL full-text index declared in the Prisma contract, and tags behind a GIN index. Words match as prefixes, so typing "kuber" finds Kubernetes, and a term that matches nothing answers in milliseconds.',
        },
        {
          title: "Filters that seek",
          body: "Category and difficulty filters combine with search and read from composite indexes, so the database jumps to the cursor instead of scanning.",
        },
        {
          title: "Pagination that never skips",
          body: "Next, Previous and First buttons page with a keyset cursor over one stable order. A page costs the same on the first screen or the fifty-thousandth, and rows are never repeated or dropped.",
        },
        {
          title: "Seed it at any scale",
          body: "An empty database gets 20 curated resources on the first visit. One command adds 100,000 generated rows, or a million, in batches through the ORM, so you can watch the app at scale.",
        },
      ],
      demoUrl: "https://shelf.anasi.me/",
      license: {
        label: "MIT",
        href: "https://github.com/prisma/prisma-examples/blob/latest/compute/scalable-indexing-platform-template/LICENSE",
      },
    },
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
  /** The template's own page on this site. */
  pagePath: string;
  framework: FrameworkMeta;
  author: AuthorMeta;
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
  // Past every curated rank, so an unregistered template never ties with one.
  const unranked = Math.max(...Object.values(TEMPLATE_META).map((meta) => meta.featuredRank)) + 1;

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
      pagePath: pagePathFor(template.id),
      framework: frameworkMeta(frameworkId),
      author: authorFor(template, meta),
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
  framework: string | "all";
};

export function filterTemplates(templates: readonly GalleryTemplate[], filter: GalleryFilter) {
  return templates.filter(
    (template) => filter.framework === "all" || template.framework.id === filter.framework,
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

// ---------------------------------------------------------------------------
// Page copy — what /apps/{id}, its metadata and its social card say. Every
// field has a fallback built from the manifest, so an uncurated template still
// gets a complete, specific page.

export type TemplatePage = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  tagline: string;
  highlights: readonly TemplateHighlight[];
  demoUrl: string | null;
  builtWith: readonly { label: string; href: string }[];
  license: { label: string; href: string };
};

// prisma-examples is Apache 2.0 at the root; a community template may carry its own.
const REPO_LICENSE = { label: "Apache 2.0", href: `${CONTRIBUTE.repoUrl}/blob/latest/LICENSE` };

export function templatePage(template: GalleryTemplate): TemplatePage {
  const page = TEMPLATE_META[template.id]?.page;
  const title =
    page?.seoTitle ??
    `${template.name} on Prisma Compute: ${template.framework.label} app template`;
  const description =
    page?.seoDescription ??
    `${template.description} Deploy it to Prisma Compute in one click, or fork the source on GitHub.`;

  return {
    title,
    description,
    // The card headline is short on purpose; the SEO title carries the detail.
    ogTitle: page?.ogTitle ?? `${template.name} on Prisma Compute`,
    ogDescription: page?.ogDescription ?? description,
    tagline: page?.tagline ?? template.description,
    highlights: page?.highlights ?? [],
    demoUrl: page?.demoUrl ?? null,
    builtWith: page?.builtWith ?? [],
    license: page?.license ?? REPO_LICENSE,
  };
}

// The page's social card lives at /og/app.png (see app/og/app.png/route.tsx).
// The version is a hash of what the card prints, so the URL changes whenever
// the copy, author or screenshot does and the social networks refetch it.
export function ogCardPathFor(template: GalleryTemplate): string {
  const page = templatePage(template);
  const inputs = [
    template.name,
    page.ogTitle,
    page.tagline,
    template.author.name,
    template.author.logo ?? "",
    template.framework.label,
    template.preview ?? "",
  ].join("\n");
  const params = new URLSearchParams({ id: template.id, v: fnv1a(inputs) });
  return `/og/app.png?${params}`;
}

// 32-bit FNV-1a, as eight hex characters. A cache key, not a security hash.
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
