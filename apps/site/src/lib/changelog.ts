import {
  CHANGELOG_CATEGORIES,
  type ChangelogCategory,
  type ChangelogEntry,
} from "@/data/changelog";
import { getAllContent, getContentBySlug } from "@/lib/content";

// Changelog entries, ported from apps/site/content/changelog (fumadocs there,
// plain gray-matter + next-mdx-remote here to match this app's content stack).

export type ChangelogFrontmatter = {
  title: string;
  date: string;
  headline?: string;
  tags?: string[];
  metaDescription?: string;
  /**
   * Product area for the /changelog feed's colour and filter. Optional: when
   * absent it is derived from `tags` (see `deriveCategory`), so set it only
   * where that guess is wrong for the entry.
   */
  category?: ChangelogCategory;
  /** Featured treatment in the feed — reserve for GA / public-beta moments. */
  highlight?: boolean;
};

// Which product area a frontmatter tag speaks for. The first tag in the
// entry's own order that maps wins, so an entry tagged "Prisma 8" ahead of
// "Prisma Compute" files under ORM: the release notes list the headline
// product first.
const TAG_CATEGORY: Record<string, ChangelogCategory> = {
  "Prisma ORM": "orm",
  "Prisma 8": "orm",
  "Prisma Postgres": "postgres",
  Accelerate: "postgres",
  Pulse: "postgres",
  "Prisma Compute": "compute",
  "Prisma Composer": "compute",
  "Prisma Studio": "studio",
  Studio: "studio",
  "Query Insights": "studio",
  Optimize: "studio",
};

function deriveCategory(frontmatter: ChangelogFrontmatter): ChangelogCategory {
  if (frontmatter.category && CHANGELOG_CATEGORIES.has(frontmatter.category)) {
    return frontmatter.category;
  }
  for (const tag of frontmatter.tags ?? []) {
    const category = TAG_CATEGORY[tag];
    if (category) return category;
  }
  return "platform";
}

// The bare "Prisma" tag is on nearly every entry and says nothing the page
// doesn't already; the rest stay as pills.
const GENERIC_TAGS = new Set(["Prisma"]);

/** The feed's view of every entry, newest first — see data/changelog.ts. */
export function getChangelogFeedEntries(): ChangelogEntry[] {
  return getChangelogEntries().map((entry) => ({
    slug: entry.slug,
    date: entry.frontmatter.date,
    title: entry.frontmatter.headline ?? entry.frontmatter.title,
    description: entry.frontmatter.metaDescription ?? extractPreview(entry.content) ?? "",
    category: deriveCategory(entry.frontmatter),
    tags: (entry.frontmatter.tags ?? []).filter((tag) => !GENERIC_TAGS.has(tag)),
    highlight: entry.frontmatter.highlight === true,
    href: `/changelog/${entry.slug}`,
  }));
}

// Entry images still live in apps/site/public/changelog (~78MB — deliberately
// not duplicated into this app). Until the asset cutover, point them at the
// live site, which serves the same paths today.
export function rewriteChangelogAssets(content: string) {
  return content.replaceAll("](/changelog/image-", "](https://www.prisma.io/changelog/image-");
}

export function getChangelogEntries() {
  return getAllContent<ChangelogFrontmatter>("changelog").sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

// `getChangelogEntries()` is sorted newest first, so the entry before this one
// in the list is the newer neighbour and the entry after it is the older one.
// Entry pages link both ways, which gives every entry inbound internal links
// from its neighbours on top of the one from the index.
export function getChangelogNeighbours(slug: string) {
  const entries = getChangelogEntries();
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { newer: undefined, older: undefined };
  return { newer: entries[index - 1], older: entries[index + 1] };
}

export function getChangelogEntry(slug: string) {
  return getContentBySlug<ChangelogFrontmatter>("changelog", slug);
}

export function formatChangelogDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// First real paragraph of the body, markdown stripped — used as the index
// preview. Ported (simplified) from the old site's changelog-source.
export function extractPreview(content: string, maxLength = 200) {
  const lines = content.split("\n");
  let inCode = false;
  const paragraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (!trimmed) {
      if (paragraph.length) break;
      continue;
    }
    if (/^(#|!\[|- |\* |>|\d+\.\s|<)/.test(trimmed)) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(trimmed);
  }

  const text = paragraph
    .join(" ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return null;
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`;
}
