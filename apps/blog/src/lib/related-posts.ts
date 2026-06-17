import { blog } from "./source";
import { getPostTime, toBlogCardItem, type BlogPage } from "./post-card-item";
import type { BlogCardItem } from "@/components/BlogGrid";

function getSlug(page: BlogPage): string {
  return page.slugs[0] ?? "";
}

function getTags(page: BlogPage): string[] {
  const tags = (page.data as { tags?: unknown }).tags;
  return Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string") : [];
}

/**
 * Returns up to `limit` posts to recommend after the given post.
 *
 * Ranking: most shared tags with the current post first, then most recent.
 * The current post is excluded; any other post is eligible (including posts
 * that belong to other series). Returns an empty array when no other posts
 * exist.
 */
export function getRelatedPosts(current: BlogPage, limit = 2): BlogCardItem[] {
  const currentSlug = getSlug(current);
  const currentTags = new Set(getTags(current));

  return blog
    .getPages()
    .filter((page) => getSlug(page) !== currentSlug)
    .map((page) => ({
      page,
      sharedTags: getTags(page).filter((tag) => currentTags.has(tag)).length,
      time: getPostTime(page),
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags || b.time - a.time)
    .slice(0, limit)
    .map((candidate) => toBlogCardItem(candidate.page));
}
