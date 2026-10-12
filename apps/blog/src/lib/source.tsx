import { blogPosts } from "../../.source/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blog = loader({
  baseUrl: "/",
  source: toFumadocsSource(blogPosts, []),
});

export function getPageImage() {
  const segments = ["image.png"];

  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

export type BlogPage = InferPageType<typeof blog>;

/** Posts that are not marked `draft: true` in their frontmatter. */
export function getPublishedPages(): BlogPage[] {
  return blog.getPages().filter((page) => page.data.draft !== true);
}

/** A post's publication time, or 0 when the date is missing or unparsable. */
export function getPageTime(page: BlogPage): number {
  const { date } = page.data;
  const time = date instanceof Date ? date.getTime() : new Date(date ?? "").getTime();
  return Number.isNaN(time) ? 0 : time;
}

/** Newest first. The sort is stable, so equal dates keep the source order. */
export function sortPagesNewestFirst(pages: BlogPage[]): BlogPage[] {
  return [...pages].sort((a, b) => getPageTime(b) - getPageTime(a));
}

export const getCardImageSrc = (post: any) => {
  const data = post.data as any;
  const rel =
    (data.heroImagePath as string | undefined) ?? (data.metaImagePath as string | undefined);
  if (rel) {
    // If frontmatter already provides an absolute path, use it directly
    if (rel.startsWith("/")) {
      return rel;
    }
    const base = post.url.startsWith("/") ? post.url : `/${post.url}`;
    const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
    const relClean = rel.replace(/^\.\//, "").replace(/^\/+/, "");
    return `${baseClean}/${relClean}`;
  }
  const absolute =
    (data.heroImageUrl as string | undefined) ?? (data.metaImageUrl as string | undefined);
  return absolute ?? null;
};
