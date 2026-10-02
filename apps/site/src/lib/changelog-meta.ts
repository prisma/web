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
  category: ChangelogCategory;
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

// Derive a product area from an entry's tags. Entries carry free-form tags
// (e.g. "Prisma ORM", "Prisma Postgres", "Pulse"), not a single category, so we
// map the most specific product match first and fall back to platform-wide.
// Pulse/Accelerate are data-platform products, grouped under Postgres.
export function categoryForTags(tags: string[] = []): ChangelogCategory {
  const haystack = tags.join(" ").toLowerCase();
  if (/studio/.test(haystack)) return "studio";
  if (/compute/.test(haystack)) return "compute";
  if (/postgres|accelerate|pulse|data platform/.test(haystack)) return "postgres";
  if (/orm|client|migrate|schema/.test(haystack)) return "orm";
  return "platform";
}

// Big launches get the featured treatment — reserved for genuine GA / beta /
// preview launch moments, inferred from the title.
export function isHighlight(title: string): boolean {
  return /generally available|now in (beta|preview|general availability)|now available|\bGA\b/i.test(
    title,
  );
}
