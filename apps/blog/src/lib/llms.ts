/**
 * Builders for the blog's agent-facing text files:
 *
 * - `/blog/llms.txt`: a small index (series, latest posts, links to the
 *   per-year indexes).
 * - `/blog/llms/<year>.txt`: every post from one year, with its description.
 * - `/blog/llms-full.txt`: every post's Markdown, newest first.
 *
 * Everything here takes plain data, so it runs under `node:test` without the
 * content source. `llms-source.ts` maps the source's pages onto `LlmsPost`.
 */
import { withBlogBasePath } from "./url";

export type LlmsPost = {
  title: string;
  /** Path under the blog, as the content source reports it: `/my-post`. */
  path: string;
  description: string;
  date: Date | null;
  updatedAt: Date | null;
  authors: string[];
  tags: string[];
  /** The series title, when the post belongs to one. */
  series: string | null;
};

export type LlmsSeries = {
  key: string;
  title: string;
  description: string;
  postCount: number;
};

/** How many posts the root index lists before handing over to the year indexes. */
export const LATEST_POST_COUNT = 30;

const FULL_ENTRY_SEPARATOR = "\n\n---\n\n";

function time(post: LlmsPost): number {
  return post.date?.getTime() ?? 0;
}

/** Newest first. Undated posts sort last, and ties keep a stable path order. */
export function sortNewestFirst(posts: LlmsPost[]): LlmsPost[] {
  return [...posts].sort((a, b) => time(b) - time(a) || a.path.localeCompare(b.path));
}

function formatDate(date: Date | null): string | null {
  return date ? date.toISOString().slice(0, 10) : null;
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toAbsoluteBlogUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${withBlogBasePath(path)}`;
}

/** Years that have at least one post, newest first. */
export function getPostYears(posts: LlmsPost[]): number[] {
  const years = new Set<number>();
  for (const post of posts) {
    if (post.date) years.add(post.date.getUTCFullYear());
  }
  return [...years].sort((a, b) => b - a);
}

export function getPostsForYear(posts: LlmsPost[], year: number): LlmsPost[] {
  return sortNewestFirst(posts.filter((post) => post.date?.getUTCFullYear() === year));
}

/**
 * One index line: the linked title, then the publication date so a reader can
 * judge how current the post is before fetching it.
 */
export function formatPostLink(post: LlmsPost, baseUrl: string): string {
  // A title that already contains a backtick cannot be wrapped in a code span.
  const label = post.title.includes("`") ? post.title : `\`${post.title}\``;
  const details = [formatDate(post.date), singleLine(post.description)].filter(Boolean).join(". ");
  return `- [${label}](${toAbsoluteBlogUrl(baseUrl, post.path)}): ${details}`;
}

function freshnessNotice(baseUrl: string): string {
  const root = baseUrl.replace(/\/$/, "");
  return `> Blog posts describe Prisma as it was on the date shown and are not kept current. Before implementing from a post, check the documentation index at ${root}/docs/llms.txt and the changelog at ${root}/changelog.md.`;
}

function markdownNotice(baseUrl: string): string {
  return `> Append \`.md\` to any post URL to fetch its Markdown, for example ${toAbsoluteBlogUrl(baseUrl, "/<slug>.md")}.`;
}

export function buildLlmsIndexContent(
  posts: LlmsPost[],
  series: LlmsSeries[],
  baseUrl: string,
): string {
  const ordered = sortNewestFirst(posts);
  const root = baseUrl.replace(/\/$/, "");

  const seriesList = series
    .filter((entry) => entry.postCount > 0)
    .map(
      (entry) =>
        `- [\`${entry.title}\`](${toAbsoluteBlogUrl(baseUrl, `/series/${entry.key}`)}): ${singleLine(entry.description)} (${entry.postCount} ${entry.postCount === 1 ? "post" : "posts"})`,
    )
    .join("\n");

  const latestList = ordered
    .slice(0, LATEST_POST_COUNT)
    .map((post) => formatPostLink(post, baseUrl))
    .join("\n");

  const yearList = getPostYears(ordered)
    .map((year) => {
      const count = getPostsForYear(ordered, year).length;
      return `- [${year}](${toAbsoluteBlogUrl(baseUrl, `/llms/${year}.txt`)}): ${count} ${count === 1 ? "post" : "posts"}`;
    })
    .join("\n");

  return `# Prisma Blog

> Engineering deep dives, product announcements, tutorials and customer stories from the team behind Prisma ORM, Prisma Postgres and Prisma Compute.

${freshnessNotice(baseUrl)}

${markdownNotice(baseUrl)}

## Series

${seriesList}

## Latest posts

${latestList}

## All posts by year

${yearList}

## Options

- [Full blog content](${toAbsoluteBlogUrl(baseUrl, "/llms-full.txt")})
- [RSS feed](${toAbsoluteBlogUrl(baseUrl, "/rss.xml")})
- [Documentation index](${root}/docs/llms.txt)
- [Website index](${root}/llms.txt)
`;
}

export function buildLlmsYearContent(year: number, posts: LlmsPost[], baseUrl: string): string {
  const list = getPostsForYear(posts, year)
    .map((post) => formatPostLink(post, baseUrl))
    .join("\n");

  return `# Prisma Blog: posts from ${year}

${freshnessNotice(baseUrl)}

${markdownNotice(baseUrl)}

${list}

## Options

- [Blog index](${toAbsoluteBlogUrl(baseUrl, "/llms.txt")})
- [Full blog content](${toAbsoluteBlogUrl(baseUrl, "/llms-full.txt")})
`;
}

/**
 * One post as Markdown: the title, a metadata block, then the body. Served on
 * its own at the post's `.md` URL and concatenated into `llms-full.txt`.
 */
export function formatPostMarkdown(post: LlmsPost, body: string, baseUrl: string): string {
  const published = formatDate(post.date);
  const updated = formatDate(post.updatedAt);
  const description = singleLine(post.description);
  const metadata = [
    `URL: ${toAbsoluteBlogUrl(baseUrl, post.path)}`,
    published && `Published: ${published}`,
    updated && updated !== published && `Updated: ${updated}`,
    post.authors.length > 0 && `Authors: ${post.authors.join(", ")}`,
    post.tags.length > 0 && `Tags: ${post.tags.join(", ")}`,
    post.series && `Series: ${post.series}`,
    description && `Description: ${description}`,
  ].filter(Boolean);

  return `# ${post.title}

${metadata.join("\n")}

${body.trim()}`;
}

export function buildLlmsFullContent(
  entries: Array<{ post: LlmsPost; body: string }>,
  baseUrl: string,
): string {
  const byPath = new Map(entries.map((entry) => [entry.post.path, entry.body]));
  const ordered = sortNewestFirst(entries.map((entry) => entry.post));
  const count = ordered.length;

  const header = `# Prisma Blog: full content

> Every post on the Prisma blog as Markdown, newest first: ${count} ${count === 1 ? "post" : "posts"}. Each one starts with its URL and publication date.

${freshnessNotice(baseUrl)}

> For a short index of the same posts, fetch ${toAbsoluteBlogUrl(baseUrl, "/llms.txt")}.`;

  return [
    header,
    ...ordered.map((post) => formatPostMarkdown(post, byPath.get(post.path) ?? "", baseUrl)),
  ].join(FULL_ENTRY_SEPARATOR);
}
