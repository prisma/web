import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLlmsFullContent,
  buildLlmsIndexContent,
  buildLlmsYearContent,
  countPostsByYear,
  formatLinkLabel,
  formatPostLink,
  formatPostMarkdown,
  getPostSlugs,
  getPostYears,
  LATEST_POST_COUNT,
  type LlmsPost,
  type LlmsSeries,
} from "./llms";

const BASE_URL = "https://www.prisma.io";
const POST_SLUGS = new Set(["hello", "bare"]);

function post(overrides: Partial<LlmsPost> & { path: string }): LlmsPost {
  return {
    title: `Post ${overrides.path}`,
    description: "A description.",
    date: new Date("2026-03-01T00:00:00Z"),
    updatedAt: null,
    authors: ["Ada Lovelace"],
    tags: [],
    series: null,
    ...overrides,
  };
}

/** `n` posts, one per day, so the newest is the last one created. */
function posts(n: number, year = 2026): LlmsPost[] {
  return Array.from({ length: n }, (_, index) =>
    post({ path: `/post-${index}`, date: new Date(Date.UTC(year, 0, 1 + index)) }),
  );
}

const series: LlmsSeries[] = [
  { key: "prisma-compute", title: "Prisma Compute", description: "The story.", postCount: 3 },
  { key: "empty", title: "Empty", description: "No posts yet.", postCount: 0 },
];

test("an index line carries the absolute /blog URL, the date and the description", () => {
  const line = formatPostLink(
    post({ path: "/hello", title: "Hello", description: "Line one.\n  Line two." }),
    BASE_URL,
  );

  assert.equal(
    line,
    "- [`Hello`](https://www.prisma.io/blog/hello): 2026-03-01. Line one. Line two.",
  );
});

test("a title that contains a backtick is not wrapped in a code span", () => {
  const line = formatPostLink(post({ path: "/info", title: "The `info` argument" }), BASE_URL);

  assert.ok(line.startsWith("- [The `info` argument](https://www.prisma.io/blog/info)"));
});

test("brackets in a title stay literal: in a code span, or escaped next to a backtick", () => {
  assert.equal(formatLinkLabel("Prisma 8 [Early Access]"), "`Prisma 8 [Early Access]`");
  assert.equal(
    formatLinkLabel("Prisma 8 [Early Access] with the `info` argument"),
    "Prisma 8 \\[Early Access\\] with the `info` argument",
  );

  const line = formatPostLink(
    post({ path: "/ea", title: "Prisma 8 [Early Access] with the `info` argument" }),
    BASE_URL,
  );
  assert.ok(
    line.startsWith(
      "- [Prisma 8 \\[Early Access\\] with the `info` argument](https://www.prisma.io/blog/ea)",
    ),
  );
});

test("the index lists the newest posts first and stops at the latest-post limit", () => {
  const content = buildLlmsIndexContent(posts(LATEST_POST_COUNT + 5), series, BASE_URL);
  const latest = content.split("## Latest posts")[1].split("## All posts by year")[0];
  const lines = latest.trim().split("\n");

  assert.equal(lines.length, LATEST_POST_COUNT);
  assert.ok(lines[0].includes(`/blog/post-${LATEST_POST_COUNT + 4})`));
  assert.ok(!latest.includes("/blog/post-0)"));
});

test("the index links every year that has posts, with its count", () => {
  const content = buildLlmsIndexContent([...posts(2, 2026), ...posts(1, 2019)], series, BASE_URL);

  assert.ok(content.includes("- [2026](https://www.prisma.io/blog/llms/2026.txt): 2 posts"));
  assert.ok(content.includes("- [2019](https://www.prisma.io/blog/llms/2019.txt): 1 post"));
  assert.deepEqual(getPostYears([...posts(2, 2026), ...posts(1, 2019)]), [2026, 2019]);
  assert.deepEqual(
    [...countPostsByYear([...posts(2, 2026), post({ path: "/undated", date: null })])],
    [[2026, 2]],
  );
});

test("the index lists only series that have posts", () => {
  const content = buildLlmsIndexContent(posts(1), series, BASE_URL);

  assert.ok(content.includes("](https://www.prisma.io/blog/series/prisma-compute): The story."));
  assert.ok(!content.includes("/series/empty"));
});

test("the index points at the full file, the docs index and the changelog", () => {
  const content = buildLlmsIndexContent(posts(1), series, BASE_URL);

  assert.ok(content.startsWith("# Prisma Blog\n"));
  assert.ok(content.includes("https://www.prisma.io/blog/llms-full.txt"));
  assert.ok(content.includes("https://www.prisma.io/docs/llms.txt"));
  assert.ok(content.includes("https://www.prisma.io/changelog.md"));
});

test("a year index holds that year's posts only, newest first", () => {
  const content = buildLlmsYearContent(2026, [...posts(3, 2026), ...posts(2, 2019)], BASE_URL);
  const links = content.split("\n").filter((line) => line.startsWith("- [`Post"));

  assert.equal(links.length, 3);
  assert.ok(links[0].includes("/blog/post-2)"));
  assert.ok(links.every((line) => line.includes(": 2026-")));
});

test("a post's Markdown opens with its URL and dates, and skips empty fields", () => {
  const markdown = formatPostMarkdown(
    post({
      path: "/hello",
      title: "Hello",
      updatedAt: new Date("2026-04-02T00:00:00Z"),
      tags: ["orm", "ai"],
      series: "Prisma 8",
    }),
    "\nBody text.\n",
    BASE_URL,
    POST_SLUGS,
  );

  assert.equal(
    markdown,
    [
      "# Hello",
      "",
      "URL: https://www.prisma.io/blog/hello",
      "Published: 2026-03-01",
      "Updated: 2026-04-02",
      "Authors: Ada Lovelace",
      "Tags: orm, ai",
      "Series: Prisma 8",
      "Description: A description.",
      "",
      "Body text.",
    ].join("\n"),
  );

  const bare = formatPostMarkdown(
    post({ path: "/bare", authors: [] }),
    "Body.",
    BASE_URL,
    POST_SLUGS,
  );
  assert.ok(!bare.includes("Updated:"));
  assert.ok(!bare.includes("Authors:"));
  assert.ok(!bare.includes("Tags:"));
  assert.ok(!bare.includes("Series:"));
});

test("a post served on its own carries the freshness notice and a pointer to the index", () => {
  const standalone = formatPostMarkdown(post({ path: "/hello" }), "Body.", BASE_URL, POST_SLUGS, {
    standalone: true,
  });
  const embedded = formatPostMarkdown(post({ path: "/hello" }), "Body.", BASE_URL, POST_SLUGS);

  assert.ok(
    standalone.includes("> For an index of every post, fetch https://www.prisma.io/blog/llms.txt."),
  );
  assert.ok(standalone.includes("https://www.prisma.io/docs/llms.txt"));
  assert.ok(standalone.endsWith("\n\nBody."));
  assert.ok(!embedded.includes("/blog/llms.txt"));
});

test("the full file orders posts newest first whatever order they arrive in", () => {
  const [oldest, middle, newest] = posts(3);
  const content = buildLlmsFullContent(
    [
      { post: middle, body: "Middle body." },
      { post: oldest, body: "Oldest body." },
      { post: newest, body: "Newest body." },
    ],
    BASE_URL,
  );

  assert.ok(content.startsWith("# Prisma Blog: full content"));
  assert.ok(content.includes("3 posts"));
  assert.ok(content.indexOf("Newest body.") < content.indexOf("Middle body."));
  assert.ok(content.indexOf("Middle body.") < content.indexOf("Oldest body."));
});

test("the full file keeps a link to a post it leaves out under /blog when told its slug", () => {
  const entries = [{ post: post({ path: "/kept" }), body: "See [the draft](/left-out)." }];

  assert.ok(buildLlmsFullContent(entries, BASE_URL).includes("](https://www.prisma.io/left-out)"));
  assert.ok(
    buildLlmsFullContent(entries, BASE_URL, new Set(["kept", "left-out"])).includes(
      "](https://www.prisma.io/blog/left-out)",
    ),
  );
});

test("post slugs come from the post paths", () => {
  assert.deepEqual(
    [...getPostSlugs([post({ path: "/hello" }), post({ path: "/bare/" })])],
    ["hello", "bare"],
  );
});

test("the full file makes links between posts absolute and flattens components", () => {
  const content = buildLlmsFullContent(
    [
      {
        post: post({ path: "/first", date: new Date("2026-01-01T00:00:00Z") }),
        body: '<Accordions>\n  <Accordion title="Where next?">\n    Read [the second post](/second).\n  </Accordion>\n</Accordions>',
      },
      { post: post({ path: "/second" }), body: "See the [docs](/docs/compute)." },
    ],
    BASE_URL,
  );

  assert.ok(
    content.includes(
      "### Where next?\n\nRead [the second post](https://www.prisma.io/blog/second).",
    ),
  );
  assert.ok(content.includes("See the [docs](https://www.prisma.io/docs/compute)."));
  assert.ok(!content.includes("<Accordion"));
});
