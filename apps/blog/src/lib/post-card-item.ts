import { blog } from "./source";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "./url";
import type { BlogCardItem } from "@/components/BlogGrid";

export type BlogPage = ReturnType<typeof blog.getPages>[number];

/** Epoch millis for a post's `date`, or 0 when missing/invalid. */
export function getPostTime(page: BlogPage): number {
  const date = (page.data as { date?: Date | string }).date;
  const time = date instanceof Date ? date.getTime() : new Date(date ?? 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Maps a blog page to the `BlogCardItem` shape consumed by `PostCard`.
 *
 * Shared by the home feed, "Keep reading", and series navigation so card data
 * is built one consistent way. `url`/`imageSrc` are base-path prefixed here
 * (the prefixing helpers are idempotent, so a second pass in `PostCard` is safe).
 */
export function toBlogCardItem(page: BlogPage): BlogCardItem {
  const data = page.data as {
    title?: string;
    metaDescription?: string;
    authors?: unknown;
    heroImagePath?: string;
    heroImageAlt?: string;
    tags?: string[];
  };
  const authors = Array.isArray(data.authors)
    ? data.authors.filter((name): name is string => typeof name === "string")
    : [];
  const time = getPostTime(page);

  return {
    url: withBlogBasePath(page.url),
    title: data.title ?? "",
    date: time ? new Date(time).toISOString() : "",
    excerpt: data.metaDescription ?? null,
    author: authors[0] ?? null,
    authors,
    imageSrc: withBlogBasePathForImageSrc(data.heroImagePath ?? ""),
    imageAlt: data.heroImageAlt ?? data.title ?? "",
    tags: data.tags,
  };
}
