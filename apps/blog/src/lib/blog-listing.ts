/**
 * Pure helpers for the blog's listing pages.
 *
 * The home feed used to be sliced in the browser by `BlogHomeClient`, which
 * read `?page=` / `?tag=` from `useSearchParams()`. That kept every post link
 * out of the prerendered HTML (audit 3.2: 551 URLs with a single inbound
 * internal link, 118 of them posts) because Next.js renders the Suspense
 * fallback during static prerendering.
 *
 * The slicing now happens on the server, so it lives here as plain functions
 * over arrays: the route files decide *which* posts to pass in, these decide
 * *which slice* and *which URL*. Everything in this module is dependency-free
 * on purpose, so it can be unit tested without compiling ~300 MDX posts.
 */
import { withBlogBasePath } from "./url";

/** Cards per listing page. Unchanged from the client implementation. */
export const PAGE_SIZE = 12;

/** The "no tag selected" sentinel the chips and `PostCard` badge already use. */
export const SHOW_ALL = "show-all";

export interface ListingSlice<T> {
  /** The lead card, rendered full width above the grid. Page 1 of `/blog` only. */
  featured: T | undefined;
  /** The cards for the 3-up grid. */
  posts: T[];
}

/** Number of listing pages for `count` posts. Always at least 1. */
export function getTotalPages(count: number): number {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

/**
 * The slice of `items` shown on `page`.
 *
 * With `includeFeatured`, page 1 spends its first slot on the lead card and
 * puts the next `PAGE_SIZE - 1` in the grid — exactly what the client did with
 * `items[0]` plus `slice(1, PAGE_SIZE)` — so page 2 still starts at index
 * `PAGE_SIZE` and no post falls between the two pages.
 */
export function getPageSlice<T>(
  items: T[],
  page: number,
  includeFeatured = false,
): ListingSlice<T> {
  if (includeFeatured && page === 1) {
    return { featured: items[0], posts: items.slice(1, PAGE_SIZE) };
  }

  const start = (page - 1) * PAGE_SIZE;
  return { featured: undefined, posts: items.slice(start, start + PAGE_SIZE) };
}

/**
 * The URL of a listing page, with the `/blog` basePath applied.
 *
 * Page 1 is the bare listing (`/blog`, `/blog/tag/orm`) and never
 * `/blog/page/1`, so there is one canonical URL per slice.
 *
 * These are consumed by plain `<a href>` elements (the convention `PostCard`
 * follows), never by `next/link`, which prepends the basePath itself.
 */
export function buildListingHref(tag: string | undefined, page: number): string {
  const base = tag && tag !== SHOW_ALL ? `/tag/${tag}` : "";

  if (page <= 1) return withBlogBasePath(base === "" ? "/" : base);
  return withBlogBasePath(`${base}/page/${page}`);
}

/**
 * A page number parsed from a `[n]` route segment, or `null` when the segment
 * is not a plain positive integer (`01`, `2.0`, `-1`, `abc` all 404 rather than
 * serving a duplicate of a real page under a second URL).
 */
export function parsePageParam(value: string): number | null {
  if (!/^[1-9][0-9]*$/.test(value)) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

/**
 * `generateStaticParams` output for a `page/[n]` route: every page after the
 * first, because page 1 is served by the listing route itself.
 */
export function getPaginationParams(count: number): Array<{ n: string }> {
  const total = getTotalPages(count);
  const params: Array<{ n: string }> = [];
  for (let page = 2; page <= total; page += 1) params.push({ n: String(page) });
  return params;
}

/**
 * The compact numbered sequence: first page, a window around the current one,
 * last page, with ellipses for the gaps. Moved verbatim from `BlogHomeClient`.
 */
export function getPaginationSequence(
  totalPages: number,
  currentPage: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

/**
 * Tags that can become a route segment.
 *
 * A tag is written by hand in post frontmatter, so anything that is not already
 * a URL-safe slug is dropped rather than silently generating an escaped route
 * nobody links to. Every tag in `content/blog` today passes.
 */
export function isRoutableTag(tag: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag);
}
