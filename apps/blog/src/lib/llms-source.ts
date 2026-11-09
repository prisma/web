import type { LlmsPost, LlmsSeries } from "./llms";
import { getSeriesMetadata, seriesRegistry } from "./series-registry";
import { type BlogPage, getPublishedPages } from "./source";

function toDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toLlmsPost(page: BlogPage): LlmsPost {
  const { data } = page;
  return {
    title: data.title,
    path: page.url,
    // Same precedence as the RSS feed.
    description: data.metaDescription ?? data.description ?? data.excerpt ?? "",
    date: toDate(data.date),
    updatedAt: toDate(data.updatedAt),
    authors: data.authors,
    tags: data.tags ?? [],
    series: data.series ? getSeriesMetadata(data.series).title : null,
  };
}

/** Every published post. Drafts stay out of all the agent-facing files. */
export function getLlmsPosts(): LlmsPost[] {
  return getPublishedPages().map(toLlmsPost);
}

/** Registered series in registry order, each with its published post count. */
export function getLlmsSeries(): LlmsSeries[] {
  const pages = getPublishedPages();
  return Object.entries(seriesRegistry).map(([key, entry]) => ({
    key,
    title: entry.title,
    description: entry.description,
    postCount: pages.filter((page) => page.data.series === key).length,
  }));
}
