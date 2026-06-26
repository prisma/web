import { blog } from "./source";
import { getSeriesMetadata } from "./series-registry";
import { toBlogCardItem } from "./post-card-item";
import type { BlogCardItem } from "@/components/BlogGrid";

type BlogPage = ReturnType<typeof blog.getPages>[number];

export type SeriesPostRef = {
  url: string;
  title: string;
  slug: string;
  seriesIndex?: number;
};

export type SeriesContext = {
  key: string;
  title: string;
  description?: string;
  posts: SeriesPostRef[];
  index: number;
  total: number;
  prev: BlogCardItem | null;
  next: BlogCardItem | null;
};

function getSlug(page: BlogPage): string {
  return page.slugs[0] ?? "";
}

function toRef(page: BlogPage): SeriesPostRef {
  const data = page.data as { title?: string; seriesIndex?: number };
  return {
    url: page.url,
    title: data.title ?? "",
    slug: getSlug(page),
    seriesIndex: data.seriesIndex,
  };
}

function findBySlug(slug: string): BlogPage | undefined {
  return blog.getPages().find((p) => getSlug(p) === slug);
}

/**
 * Returns all posts that belong to a given series key, ordered by
 * `seriesIndex` (asc). Posts without an index sort after indexed ones, by date.
 */
export function getSeriesPosts(seriesKey: string): BlogPage[] {
  return blog
    .getPages()
    .filter((p) => (p.data as { series?: string }).series === seriesKey)
    .sort((a, b) => {
      const ai = (a.data as { seriesIndex?: number }).seriesIndex;
      const bi = (b.data as { seriesIndex?: number }).seriesIndex;
      if (ai != null && bi != null) return ai - bi;
      if (ai != null) return -1;
      if (bi != null) return 1;
      const ad = new Date((a.data as { date?: Date }).date ?? 0).getTime();
      const bd = new Date((b.data as { date?: Date }).date ?? 0).getTime();
      return ad - bd;
    });
}

/**
 * Resolves the series context for a given post.
 *
 * Title/description come from the registry (keyed by `series` in frontmatter).
 * Prev/next are derived from `seriesIndex` order within the series unless the
 * post sets explicit `prev`/`next` slugs in frontmatter (those win).
 */
export function getSeriesContext(page: BlogPage): SeriesContext | null {
  const data = page.data as {
    series?: string;
    prev?: string;
    next?: string;
  };
  const key = data.series;
  if (!key) return null;

  const posts = getSeriesPosts(key);
  if (posts.length === 0) return null;

  const meta = getSeriesMetadata(key);

  const currentSlug = getSlug(page);
  const currentIndex = posts.findIndex((p) => getSlug(p) === currentSlug);

  const explicitPrev = data.prev ? findBySlug(data.prev) : undefined;
  const explicitNext = data.next ? findBySlug(data.next) : undefined;
  const explicitPrevInSeries =
    explicitPrev && (explicitPrev.data as { series?: string }).series === key
      ? explicitPrev
      : undefined;
  const explicitNextInSeries =
    explicitNext && (explicitNext.data as { series?: string }).series === key
      ? explicitNext
      : undefined;

  const positionalPrev = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const positionalNext =
    currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined;

  const prevPage = explicitPrevInSeries ?? positionalPrev;
  const nextPage = explicitNextInSeries ?? positionalNext;

  return {
    key,
    title: meta.title,
    description: meta.description,
    posts: posts.map(toRef),
    index: currentIndex >= 0 ? currentIndex + 1 : 0,
    total: posts.length,
    prev: prevPage ? toBlogCardItem(prevPage) : null,
    next: nextPage ? toBlogCardItem(nextPage) : null,
  };
}
