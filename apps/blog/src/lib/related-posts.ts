import { blog } from "./source";
import { toBlogCardItem, type BlogPage } from "./post-card-item";
import { rankRelated, type RelatedCandidate } from "./related-posts-ranking";
import type { BlogCardItem } from "@/components/BlogGrid";

function toCandidate(page: BlogPage): RelatedCandidate & { page: BlogPage } {
  const data = page.data as { tags?: unknown; series?: unknown };
  return {
    page,
    slug: page.slugs[0] ?? "",
    tags: Array.isArray(data.tags)
      ? data.tags.filter((t): t is string => typeof t === "string")
      : [],
    series: typeof data.series === "string" ? data.series : undefined,
  };
}

/**
 * Returns up to `limit` posts to recommend after the given post, as cards.
 *
 * The current post and anything in its series are excluded; every other post is
 * eligible. Returns an empty array when no other posts exist.
 */
export function getRelatedPosts(current: BlogPage, limit = 2): BlogCardItem[] {
  const candidates = blog.getPages().map(toCandidate);
  return rankRelated(toCandidate(current), candidates, limit).map((entry) =>
    toBlogCardItem(entry.page),
  );
}
