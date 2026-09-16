import assert from "node:assert/strict";
import test from "node:test";

import {
  buildListingHref,
  getPageSlice,
  getPaginationParams,
  getPaginationSequence,
  getTotalPages,
  isRoutableTag,
  PAGE_SIZE,
  parsePageParam,
} from "./blog-listing";

/** `n` stand-in items, so a slice can be identified by its contents. */
function items(n: number): string[] {
  return Array.from({ length: n }, (_, index) => `post-${index}`);
}

test("page 1 spends its first slot on the featured card", () => {
  const slice = getPageSlice(items(30), 1, true);

  assert.equal(slice.featured, "post-0");
  assert.equal(slice.posts.length, PAGE_SIZE - 1);
  assert.deepEqual(slice.posts[0], "post-1");
  assert.deepEqual(slice.posts.at(-1), `post-${PAGE_SIZE - 1}`);
});

test("page 2 picks up exactly where page 1 stopped", () => {
  const all = items(30);
  const first = getPageSlice(all, 1, true);
  const second = getPageSlice(all, 2, true);

  assert.equal(second.featured, undefined);
  assert.equal(second.posts.length, PAGE_SIZE);
  assert.equal(second.posts[0], `post-${PAGE_SIZE}`);

  // No post is dropped between the two pages and none is shown twice.
  const shown = [first.featured, ...first.posts, ...second.posts];
  assert.deepEqual(shown, all.slice(0, PAGE_SIZE * 2));
});

test("a listing without a featured card fills the whole page", () => {
  const slice = getPageSlice(items(30), 1);

  assert.equal(slice.featured, undefined);
  assert.deepEqual(slice.posts, items(30).slice(0, PAGE_SIZE));
});

test("the last page holds the remainder", () => {
  const all = items(30);
  const total = getTotalPages(all.length);

  assert.equal(total, 3);
  assert.deepEqual(getPageSlice(all, total).posts, all.slice(24));
});

test("page counts round up and never drop below one", () => {
  assert.equal(getTotalPages(0), 1);
  assert.equal(getTotalPages(1), 1);
  assert.equal(getTotalPages(PAGE_SIZE), 1);
  assert.equal(getTotalPages(PAGE_SIZE + 1), 2);
  assert.equal(getTotalPages(298), 25);
});

test("listing hrefs carry the basePath and keep page 1 at the bare URL", () => {
  assert.equal(buildListingHref(undefined, 1), "/blog");
  assert.equal(buildListingHref(undefined, 2), "/blog/page/2");
  assert.equal(buildListingHref(undefined, 25), "/blog/page/25");
  assert.equal(buildListingHref("orm", 1), "/blog/tag/orm");
  assert.equal(buildListingHref("orm", 3), "/blog/tag/orm/page/3");
  // `show-all` is the "no filter" sentinel, not a tag.
  assert.equal(buildListingHref("show-all", 1), "/blog");
  assert.equal(buildListingHref("show-all", 2), "/blog/page/2");
});

test("generateStaticParams enumerates every page but the first", () => {
  assert.deepEqual(getPaginationParams(PAGE_SIZE), []);
  assert.deepEqual(getPaginationParams(PAGE_SIZE + 1), [{ n: "2" }]);
  assert.deepEqual(
    getPaginationParams(298).map((param) => param.n),
    Array.from({ length: 24 }, (_, index) => String(index + 2)),
  );
  // Every generated param resolves back to a page that exists.
  for (const { n } of getPaginationParams(298)) {
    const page = parsePageParam(n);
    assert.ok(page !== null && page >= 2 && page <= getTotalPages(298));
  }
});

test("only plain positive integers are page numbers", () => {
  assert.equal(parsePageParam("2"), 2);
  assert.equal(parsePageParam("25"), 25);
  // Duplicates of a real page under a second URL all 404 instead.
  assert.equal(parsePageParam("02"), null);
  assert.equal(parsePageParam("2.0"), null);
  assert.equal(parsePageParam("-1"), null);
  assert.equal(parsePageParam("0"), null);
  assert.equal(parsePageParam(""), null);
  assert.equal(parsePageParam("abc"), null);
  assert.equal(parsePageParam("1e3"), null);
});

test("the numbered sequence stays compact on a long archive", () => {
  assert.deepEqual(getPaginationSequence(3, 1), [1, 2, 3]);
  assert.deepEqual(getPaginationSequence(7, 4), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(getPaginationSequence(25, 1), [1, 2, "ellipsis", 25]);
  assert.deepEqual(getPaginationSequence(25, 13), [1, "ellipsis", 12, 13, 14, "ellipsis", 25]);
  assert.deepEqual(getPaginationSequence(25, 25), [1, "ellipsis", 24, 25]);
});

test("only slug-shaped tags become routes", () => {
  for (const tag of ["orm", "ai", "prisma-postgres", "case-study"]) {
    assert.ok(isRoutableTag(tag), tag);
  }
  for (const tag of ["Prisma ORM", "orm/", "orm-", "-orm", "ORM", "a b", ""]) {
    assert.ok(!isRoutableTag(tag), tag);
  }
});
