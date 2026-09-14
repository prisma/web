import assert from "node:assert/strict";
import test from "node:test";

import { rankRelated, stableHash, type RelatedCandidate } from "./related-posts-ranking";

/**
 * 40 posts drawn from the two tags that dominate the real corpus, in
 * publication order (post-00 oldest). This is the shape that broke the old
 * ranking: nearly every pair shares a tag, so the tie-break decides everything.
 */
function corpus(size = 40): RelatedCandidate[] {
  return Array.from({ length: size }, (_, index) => ({
    slug: `post-${String(index).padStart(2, "0")}`,
    tags: index % 2 === 0 ? ["orm", "education"] : ["education"],
  }));
}

function recommendations(posts: RelatedCandidate[]): Map<string, string[]> {
  return new Map(posts.map((post) => [post.slug, rankRelated(post, posts, 2).map((p) => p.slug)]));
}

test("every post gets the full quota of recommendations", () => {
  const posts = corpus();
  for (const [slug, related] of recommendations(posts)) {
    assert.equal(related.length, 2, `${slug} got ${related.length}`);
    assert.ok(!related.includes(slug), `${slug} recommends itself`);
    assert.equal(new Set(related).size, 2, `${slug} recommends a post twice`);
  }
});

test("recommendations spread across the archive instead of piling on the newest posts", () => {
  const posts = corpus();
  const inbound = new Map(posts.map((post) => [post.slug, 0]));

  for (const related of recommendations(posts).values()) {
    for (const slug of related) inbound.set(slug, (inbound.get(slug) ?? 0) + 1);
  }

  const counts = [...inbound.values()];
  const worst = Math.max(...counts);
  const ceiling = Math.ceil((posts.length - 1) * 0.15);

  assert.ok(
    worst <= ceiling,
    `one post is recommended by ${worst} of the other ${posts.length - 1} (ceiling ${ceiling}); ` +
      `distribution: ${JSON.stringify(Object.fromEntries(inbound))}`,
  );

  // Ranking by recency put every inbound link on the same two newest posts.
  // Reaching most of the corpus is the point of the change.
  const reached = counts.filter((count) => count > 0).length;
  assert.ok(reached >= posts.length * 0.75, `only ${reached}/${posts.length} posts are reachable`);
});

test("with one tag tier the rotation is a perfect cycle", () => {
  // Every post shares every tag, so the rotation alone decides: each post
  // recommends the two that follow it around the hash ring, which means each
  // post is recommended by exactly two others. The uneven case above is the
  // interesting one; this is the property that makes it bounded.
  const posts: RelatedCandidate[] = Array.from({ length: 40 }, (_, index) => ({
    slug: `post-${String(index).padStart(2, "0")}`,
    tags: ["orm"],
  }));

  const inbound = new Map(posts.map((post) => [post.slug, 0]));
  for (const related of recommendations(posts).values()) {
    for (const slug of related) inbound.set(slug, (inbound.get(slug) ?? 0) + 1);
  }

  assert.deepEqual([...new Set(inbound.values())], [2]);
});

test("the same corpus always produces the same recommendations", () => {
  const first = recommendations(corpus());
  const second = recommendations(corpus());
  assert.deepEqual([...first.entries()], [...second.entries()]);

  // ...and the input order does not decide it either.
  const shuffled = corpus().reverse();
  for (const post of shuffled) {
    assert.deepEqual(
      rankRelated(post, shuffled, 2).map((p) => p.slug),
      first.get(post.slug),
    );
  }
});

test("more shared tags still wins over the rotation", () => {
  const current: RelatedCandidate = { slug: "current", tags: ["orm", "ai"] };
  const candidates: RelatedCandidate[] = [
    { slug: "no-overlap", tags: ["platform"] },
    { slug: "one-tag", tags: ["orm"] },
    { slug: "both-tags", tags: ["orm", "ai"] },
  ];

  assert.deepEqual(
    rankRelated(current, candidates, 3).map((p) => p.slug),
    ["both-tags", "one-tag", "no-overlap"],
  );
});

test("a series post is never recommended its own series", () => {
  const posts: RelatedCandidate[] = [
    { slug: "part-1", tags: ["orm"], series: "prisma-8" },
    { slug: "part-2", tags: ["orm"], series: "prisma-8" },
    { slug: "part-3", tags: ["orm"], series: "prisma-8" },
    { slug: "outside-a", tags: ["orm"] },
    { slug: "outside-b", tags: ["orm"] },
    { slug: "other-series", tags: ["orm"], series: "agentic-engineering" },
  ];

  const related = rankRelated(posts[0], posts, 2).map((post) => post.slug);
  assert.equal(related.length, 2);
  for (const slug of related) assert.ok(!slug.startsWith("part-"), `${slug} is in the same series`);

  // A post with no series is not treated as sharing one with the other
  // series-less posts.
  const standalone = rankRelated(posts[3], posts, 5).map((post) => post.slug);
  assert.ok(standalone.includes("outside-b"));
  assert.ok(standalone.includes("part-1"));
});

test("the hash is stable and not order-dependent", () => {
  assert.equal(stableHash("a:b"), stableHash("a:b"));
  assert.notEqual(stableHash("a:b"), stableHash("b:a"));
  assert.ok(Number.isInteger(stableHash("")) && stableHash("") >= 0);
});
