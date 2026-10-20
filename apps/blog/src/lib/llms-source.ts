import type { InferPageType } from "fumadocs-core/source";

import type { LlmsPost, LlmsSeries } from "./llms";
import { getSeriesMetadata, seriesRegistry } from "./series-registry";
import { blog } from "./source";

type BlogPage = InferPageType<typeof blog>;

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

export function getLlmsPosts(): LlmsPost[] {
  return blog.getPages().map(toLlmsPost);
}

/** Registered series in registry order, each with its current post count. */
export function getLlmsSeries(): LlmsSeries[] {
  const pages = blog.getPages();
  return Object.entries(seriesRegistry).map(([key, entry]) => ({
    key,
    title: entry.title,
    description: entry.description,
    postCount: pages.filter((page) => page.data.series === key).length,
  }));
}
