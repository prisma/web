// Presentation + categorization for the changelog feed. No filesystem access,
// so this is safe to import from the client feed component. The entries
// themselves are built server-side in app/changelog/page.tsx from the live
// changelog content and passed into the feed.

/** Product areas. The id drives the category chip colour and the filter. */
export type ChangelogCategory = "compute" | "orm" | "postgres" | "studio" | "platform";

export type ChangelogEntry = {
  /** ISO date. Formatted at render with an explicit UTC timezone. */
  date: string;
  title: string;
  description: string;
  /** The area that colours the entry: the first of `categories`. */
  category: ChangelogCategory;
  /** Every product area the entry's tags name. An entry about a Compute feature
   *  backed by Prisma Postgres is in both, so both filters list it. */
  categories: ChangelogCategory[];
  /** Short labels shown as pills under the entry. */
  tags: string[];
  /** Big launches get a featured treatment (larger card, accent). */
  highlight?: boolean;
  /** Links to the live changelog entry page. */
  href: string;
};

// Category display + colour. Each area gets one of the three brand anchors (or
// ink for the platform-wide entries), so the feed reads as coloured bands you
// can scan without reading.
export const CATEGORY_META: Record<
  ChangelogCategory,
  { label: string; dot: string; text: string; glow: string }
> = {
  compute: {
    label: "Compute",
    dot: "bg-prism-cyan-400",
    text: "text-prism-cyan-700",
    glow: "var(--color-prism-cyan-400)",
  },
  orm: {
    label: "ORM",
    dot: "bg-prism-red-500",
    text: "text-prism-red-700",
    glow: "var(--color-prism-red-500)",
  },
  postgres: {
    label: "Postgres",
    dot: "bg-prism-yellow-400",
    text: "text-prism-yellow-700",
    glow: "var(--color-prism-yellow-400)",
  },
  studio: {
    label: "Studio",
    dot: "bg-prism-cyan-600",
    text: "text-prism-cyan-800",
    glow: "var(--color-prism-cyan-600)",
  },
  platform: {
    label: "Platform",
    dot: "bg-foreground",
    text: "text-foreground",
    glow: "var(--primary)",
  },
};

// The order the filter tabs show categories in — the three headline products
// lead and the cross-cutting areas follow.
export const CATEGORY_ORDER: ChangelogCategory[] = [
  "compute",
  "orm",
  "postgres",
  "studio",
  "platform",
];

// Derive product areas from an entry's tags. Entries carry free-form tags
// (e.g. "Prisma ORM", "Prisma Postgres", "Pulse"), not a single category, and
// one entry often spans several products, so every area a tag names is kept.
// Pulse/Accelerate are data-platform products, grouped under Postgres. The
// result is ordered most specific first, and that first area colours the entry.
// An entry whose tags name no product is platform-wide.
const AREA_PATTERNS: [ChangelogCategory, RegExp][] = [
  ["studio", /studio/],
  ["compute", /compute|composer/],
  ["postgres", /postgres|accelerate|pulse|data platform/],
  ["orm", /\borm\b|client|migrate|schema/],
];

export function categoriesForTags(tags: string[] = []): ChangelogCategory[] {
  const areas = AREA_PATTERNS.filter(([, pattern]) =>
    tags.some((tag) => pattern.test(tag.toLowerCase())),
  ).map(([area]) => area);
  return areas.length > 0 ? areas : ["platform"];
}

/** The one area that colours an entry: the most specific of its areas. */
export function categoryForTags(tags: string[] = []): ChangelogCategory {
  return categoriesForTags(tags)[0];
}

// Big launches get the featured treatment — reserved for genuine GA / beta /
// preview launch moments, inferred from the title.
export function isHighlight(title: string): boolean {
  return /generally available|now in (beta|preview|general availability)|now available|\bGA\b/i.test(
    title,
  );
}
