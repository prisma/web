/**
 * How the blog picks the posts it recommends after an article.
 *
 * Kept apart from `related-posts.ts` so it can be unit tested: that module
 * reads the Fumadocs content source, and importing it compiles ~300 MDX files.
 */

/** The minimum a candidate has to expose to be ranked. */
export interface RelatedCandidate {
  slug: string;
  tags: string[];
  /** Series key, when the post belongs to one. */
  series?: string;
}

/**
 * FNV-1a, 32-bit. Small, stable across runs and processes, and with no
 * dependency — all this needs is a number that does not correlate with
 * publication date.
 */
export function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * The distance from `from` to `to` around the 32-bit hash ring.
 *
 * Unsigned modular subtraction: the distance from the last position back to the
 * first is small, not negative, so the ring wraps.
 */
function ringDistance(from: number, to: number): number {
  return (to - from) >>> 0;
}

/**
 * Ranks `candidates` as recommendations to show after `current`.
 *
 * Shared tags first, as before. The tie-break used to be recency, and since
 * most posts carry one of the same four tags, that made virtually every post in
 * the archive recommend the same handful of newest posts: the oldest 90% of the
 * corpus received no inbound link from a related-posts module at all (audit
 * 3.2).
 *
 * The tie-break is now a rotation. Every post is placed on a 32-bit ring by a
 * stable hash of its slug, and a post recommends the candidates that follow it
 * around that ring. Because a post's own position comes from the same hash, the
 * posts form one cycle: within a group of equally-tagged candidates each post
 * is recommended by exactly `limit` others, so the links spread evenly over the
 * whole archive instead of piling onto whatever is newest. It is deterministic
 * — this build produces the same pairs as the next one — and it depends on
 * nothing but the slugs, so a new post does not reshuffle the corpus.
 *
 * Posts in the same series as `current` are excluded: a series post gets its
 * neighbours from `SeriesNavigation`, so "Keep reading" is there to point
 * outside the series.
 */
export function rankRelated<T extends RelatedCandidate>(
  current: RelatedCandidate,
  candidates: T[],
  limit = 2,
): T[] {
  const currentTags = new Set(current.tags);
  const currentSeries = current.series;
  const origin = stableHash(current.slug);

  return candidates
    .filter((candidate) => candidate.slug !== current.slug)
    .filter((candidate) => !currentSeries || candidate.series !== currentSeries)
    .map((candidate) => ({
      candidate,
      sharedTags: candidate.tags.filter((tag) => currentTags.has(tag)).length,
      rotation: ringDistance(origin, stableHash(candidate.slug)),
    }))
    .sort(
      (a, b) =>
        b.sharedTags - a.sharedTags ||
        a.rotation - b.rotation ||
        // Two slugs can only tie here by colliding on the hash; order them by
        // name so the result never depends on the input array's order.
        (a.candidate.slug < b.candidate.slug ? -1 : 1),
    )
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
