import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { BlogListing } from "./BlogListing";
import type { BlogCardItem } from "./BlogGrid";
import { getPageSlice, getTotalPages, PAGE_SIZE } from "@/lib/blog-listing";

/**
 * The listing's whole purpose is the markup it puts in the prerendered HTML:
 * before this change `/blog` shipped a hero and an empty `<div>`, because the
 * grid was rendered by a client component behind `useSearchParams()`.
 */
const TAGS = ["orm", "education", "announcement", "ai"];

function fixture(count = 30): BlogCardItem[] {
  return Array.from({ length: count }, (_, index) => ({
    url: `/blog/post-${index}`,
    title: `Post ${index}`,
    date: new Date(Date.UTC(2026, 0, 1 + index)).toISOString(),
    excerpt: `Excerpt ${index}`,
    authors: ["Nikolas Burk"],
    author: "Nikolas Burk",
    imageSrc: index % 3 === 0 ? `/blog/images/post-${index}.png` : "",
    imageAlt: `Post ${index}`,
    tags: [TAGS[index % TAGS.length]],
  }));
}

function renderPage(items: BlogCardItem[], page: number, tag?: string) {
  const slice = getPageSlice(items, page, tag === undefined);
  return renderToStaticMarkup(
    <BlogListing
      items={slice.posts}
      featuredPost={slice.featured}
      uniqueTags={TAGS}
      currentCategory={tag}
      currentPage={page}
      totalPages={getTotalPages(items.length)}
    />,
  );
}

/** Every anchor in the markup, as `[attributes, innerHTML]`. */
function anchors(html: string): Array<[string, string]> {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, inner]) => [
    attrs,
    inner,
  ]);
}

function hrefs(html: string): string[] {
  return anchors(html)
    .map(([attrs]) => /href="([^"]*)"/.exec(attrs)?.[1] ?? "")
    .filter(Boolean);
}

function postHrefs(html: string): string[] {
  return hrefs(html).filter((href) => /^\/blog\/post-\d+$/.test(href));
}

test("page 1 renders a full page of post links, in feed order", () => {
  const items = fixture();
  const html = renderPage(items, 1);
  const links = postHrefs(html);

  assert.equal(links.length, PAGE_SIZE, "the featured card plus the grid");
  // The featured card leads, then the grid continues the feed — the exact
  // order BlogHomeClient produced from `items[0]` and `slice(1, PAGE_SIZE)`.
  assert.deepEqual(
    links,
    items.slice(0, PAGE_SIZE).map((item) => item.url),
  );
});

test("every link in the listing is a real, absolute blog URL", () => {
  const html = renderPage(fixture(), 1);
  const links = hrefs(html);

  assert.ok(links.length > PAGE_SIZE, "posts, tag chips and pagination");
  for (const href of links) {
    assert.ok(href.startsWith("/blog"), `not a /blog URL: ${href}`);
    // The query-string listing is gone: no link may reintroduce it.
    assert.ok(!href.includes("?page="), `query pagination: ${href}`);
    assert.ok(!href.includes("?tag="), `query tag filter: ${href}`);
  }
});

test("no anchor is rendered disabled", () => {
  // `aria-disabled` on a live anchor is a link that goes nowhere: it was on
  // Previous on page 1 and on Next on the last page.
  for (const page of [1, 2, 3]) {
    for (const [attrs] of anchors(renderPage(fixture(), page))) {
      assert.ok(!/aria-disabled/.test(attrs), `page ${page}: <a ${attrs}>`);
    }
  }
});

test("prev/next point at the neighbouring pages and stop at the ends", () => {
  const items = fixture(30); // 3 pages
  const paginationHrefs = (html: string) =>
    hrefs(html).filter((href) => href === "/blog" || /^\/blog\/page\/\d+$/.test(href));

  const first = renderPage(items, 1);
  assert.ok(!/Previous/.test(first), "page 1 has no Previous control");
  assert.ok(/Next/.test(first));
  assert.deepEqual(paginationHrefs(first), [
    "/blog",
    "/blog/page/2",
    "/blog/page/3",
    "/blog/page/2",
  ]);

  const middle = renderPage(items, 2);
  assert.ok(/Previous/.test(middle) && /Next/.test(middle));
  // Previous on page 2 is /blog, never /blog/page/1.
  assert.deepEqual(paginationHrefs(middle), [
    "/blog",
    "/blog",
    "/blog/page/2",
    "/blog/page/3",
    "/blog/page/3",
  ]);

  const last = renderPage(items, 3);
  assert.ok(/Previous/.test(last), "the last page still has Previous");
  assert.ok(!/Next/.test(last), "the last page has no Next control");
  assert.deepEqual(paginationHrefs(last), [
    "/blog/page/2",
    "/blog",
    "/blog/page/2",
    "/blog/page/3",
  ]);
});

test("the current page is marked and the others are plain links", () => {
  const current = anchors(renderPage(fixture(), 2)).filter(([attrs]) =>
    /aria-current="page"/.test(attrs),
  );

  assert.equal(current.length, 1);
  assert.equal(current[0][1], "2");
});

test("the tag chips link to the static tag routes", () => {
  const html = renderPage(fixture(), 1);

  for (const tag of TAGS) {
    assert.ok(hrefs(html).includes(`/blog/tag/${tag}`), `no chip links at ${tag}`);
  }
});

test("a tag listing paginates under its own URL and can be cleared", () => {
  const items = fixture(120).filter((item) => item.tags?.includes("orm")); // 30 posts
  const html = renderPage(items, 1, "orm");

  // The selected chip clears the filter rather than linking to itself.
  const chip = anchors(html).find(([, inner]) => inner === "ORM");
  assert.ok(chip, "no chip for the current tag");
  assert.match(chip[0], /aria-current="page"/);
  assert.equal(/href="([^"]*)"/.exec(chip[0])?.[1], "/blog");

  assert.ok(hrefs(html).includes("/blog/tag/orm/page/2"), "next page of the tag listing");
  assert.equal(postHrefs(html).length, PAGE_SIZE, "no featured slot on a tag listing");
});

test("a single-page listing renders no pagination at all", () => {
  const html = renderPage(fixture(PAGE_SIZE), 1);

  assert.ok(!/aria-label="pagination"/.test(html));
  assert.equal(postHrefs(html).length, PAGE_SIZE);
});
