/**
 * The blog's listing data, built once from the content source and shared by
 * every listing route (`/blog`, `/blog/page/N`, `/blog/tag/X`,
 * `/blog/tag/X/page/N`) and the sitemap.
 *
 * This is the code that used to live inline in `src/app/(blog)/page.tsx`, moved
 * out so the four routes agree on post order, card shape, and the tag list
 * without copying it.
 */
import { notFound } from "next/navigation";

import { blog } from "./source";
import { getSeriesMetadata, seriesRegistry } from "./series-registry";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "./url";
import { isRoutableTag } from "./blog-listing";
import type { BlogCardItem } from "@/components/BlogGrid";
import type { SeriesShelfItem } from "@/components/SeriesShelf";

type BlogPage = ReturnType<typeof blog.getPages>[number];

function getTime(page: BlogPage): number {
  const date = (page.data as { date?: Date | string }).date;
  const time =
    date instanceof Date ? date.getTime() : new Date((date as unknown as string) ?? "").getTime();
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Every post, newest first, with pinned posts hoisted to the front.
 *
 * The date sort is stable, so pinned posts keep their newest-first order among
 * themselves and the latest pinned post takes the featured slot.
 */
function getOrderedPages(): BlogPage[] {
  const sortedByDate = [...blog.getPages()].sort((a, b) => getTime(b) - getTime(a));
  const isPinned = (post: BlogPage): boolean => (post.data as { pinned?: boolean }).pinned === true;
  return [...sortedByDate.filter(isPinned), ...sortedByDate.filter((post) => !isPinned(post))];
}

function toItem(post: BlogPage): BlogCardItem {
  const data = post.data as {
    title?: string;
    date?: Date | string;
    updatedAt?: Date | string;
    metaDescription?: string;
    authors?: unknown;
    heroImagePath?: string;
    heroImageAlt?: string;
    series?: string;
    tags?: string[];
  };

  const time = getTime(post);

  let updatedAtISO: string | null = null;
  if (data.updatedAt) {
    const updated = new Date(data.updatedAt);
    if (!Number.isNaN(updated.getTime())) updatedAtISO = updated.toISOString();
  }

  const authors = Array.isArray(data.authors)
    ? data.authors.filter((name): name is string => typeof name === "string")
    : [];

  return {
    url: withBlogBasePath(post.url),
    title: data.title ?? "",
    date: time ? new Date(time).toISOString() : "",
    updatedAt: updatedAtISO,
    excerpt: data.metaDescription,
    author: authors[0] ?? null,
    authors,
    imageSrc: withBlogBasePathForImageSrc(data.heroImagePath ?? ""),
    imageAlt: data.heroImageAlt ?? data.title ?? "",
    seriesTitle: typeof data.series === "string" ? getSeriesMetadata(data.series).title : null,
    tags: data.tags,
  };
}

/** Every post as a card item, in feed order. */
export function getListingItems(): BlogCardItem[] {
  return getOrderedPages().map(toItem);
}

/**
 * The tags the chips offer, in first-appearance order across the feed — the
 * same order the client filter showed.
 *
 * Only routable tags survive, so a chip never links at a `/blog/tag/...` URL
 * that `generateStaticParams` did not build.
 */
export function getListingTags(items: BlogCardItem[]): string[] {
  return [
    ...new Set(
      items.flatMap((item) => item.tags ?? []).filter((tag): tag is string => Boolean(tag)),
    ),
  ].filter(isRoutableTag);
}

/** The items carrying a given tag, in feed order. */
export function getItemsForTag(items: BlogCardItem[], tag: string): BlogCardItem[] {
  return items.filter((item) => item.tags?.includes(tag));
}

/** Series that have at least one post, featured first. Powers the home shelf. */
export function getSeriesShelfItems(): SeriesShelfItem[] {
  const seriesCounts = new Map<string, number>();
  for (const post of blog.getPages()) {
    const seriesKey = (post.data as { series?: string }).series;
    if (typeof seriesKey === "string") {
      seriesCounts.set(seriesKey, (seriesCounts.get(seriesKey) ?? 0) + 1);
    }
  }

  return Object.keys(seriesRegistry)
    .map((key) => {
      const meta = getSeriesMetadata(key);
      return {
        key,
        title: meta.title,
        description: meta.description,
        featured: meta.featured ?? false,
        count: seriesCounts.get(key) ?? 0,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // Featured series keep their registry order (the first one becomes the
      // home highlight card); the rest rank by part count.
      if (a.featured && b.featured) return 0;
      return b.count - a.count;
    });
}

/**
 * A tag listing, or a 404 when the tag is not one the chips offer.
 *
 * Lives here rather than in the route file because both `/blog/tag/[tag]` and
 * `/blog/tag/[tag]/page/[n]` need it, and a Next.js page module may only export
 * the fields the framework knows about.
 */
export function getTagListing(tag: string): { items: BlogCardItem[]; tagged: BlogCardItem[] } {
  const items = getListingItems();
  if (!getListingTags(items).includes(tag)) notFound();
  return { items, tagged: getItemsForTag(items, tag) };
}
