// Presentation model for the /changelog feed.
//
// The entries themselves are the MDX release notes in content/changelog,
// loaded by lib/changelog.ts (`getChangelogFeedEntries`). What lives here is
// the structure the redesign adds on top of that flat list: a product-area
// category per entry (which drives colour and the filter), a short tag set,
// and a "highlight" flag for the launches that deserve a feature card.

/** Product areas. The id drives the category chip colour and the filter. */
export type ChangelogCategory = "compute" | "orm" | "postgres" | "studio" | "platform";

export type ChangelogEntry = {
  slug: string;
  /** ISO date. Formatted at render with an explicit UTC timezone. */
  date: string;
  title: string;
  description: string;
  category: ChangelogCategory;
  /** Short labels shown as pills under the entry. */
  tags: string[];
  /**
   * The big launches get a featured treatment (larger card, ships an accent).
   * Reserve for genuine "generally available" / "now in beta" moments.
   */
  highlight?: boolean;
  /** The entry's own page, /changelog/[slug]. */
  href: string;
};

// Category display + colour. Each area gets one of the three brand anchors (or
// ink for the platform-wide entries), so the feed reads as coloured bands you
// can scan without reading. Kept in one place so the chip, the timeline node
// and the filter tab always agree.
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

// The order the filter tabs show categories in — hand-ordered so the three
// headline products lead and the cross-cutting areas follow.
export const CATEGORY_ORDER: ChangelogCategory[] = [
  "compute",
  "orm",
  "postgres",
  "studio",
  "platform",
];

export const CHANGELOG_CATEGORIES = new Set<string>(CATEGORY_ORDER);
