/**
 * Agent-facing Markdown content negotiation for the blog.
 *
 * This is the blog-side port of apps/docs/src/lib/agent-markdown.ts. The
 * signal detection is kept byte-identical to the docs and site copies; keep
 * the three in step. What differs is the set of pages: only a post URL
 * (`/blog/<slug>`, one segment) has a Markdown rendition, so the index, tag,
 * author, series and pagination pages are left to their HTML routes.
 *
 * The site app is the root zone and deliberately leaves `/blog/*` alone (see
 * apps/site/src/lib/agent-markdown.ts), so without this module ChatGPT-User
 * and the other agent fetchers get the full HTML page for every post.
 *
 * Everything here is pure and dependency-free so it can run in the proxy
 * runtime without pulling the content collections in with it.
 */

const BLOG_BASE_PATH = "/blog";

/**
 * User-agent substrings that identify an agent asking for a blog post.
 *
 * Source of truth for both the runtime check below and the `user-agent`
 * matcher in `src/proxy.ts` — `proxy-matcher.test.ts` asserts the two agree,
 * because Next.js requires the proxy `config` export to be a literal and so
 * the matcher cannot import from here.
 *
 * Same list as apps/docs/src/lib/agent-markdown.ts and
 * apps/site/src/lib/agent-markdown.ts. The last four are user-triggered
 * fetchers (a person asked about the page), as their vendors documented them
 * on 2026-10-06. The same vendors' index, training and ads crawlers are
 * deliberately not listed and must not match.
 */
export const AGENT_USER_AGENT_TOKENS = [
  "chatgpt-user",
  "gptbot",
  "claudebot",
  "claude-user",
  "perplexitybot",
  "cursor",
  "perplexity-user",
  "mistralai-user",
  "meta-externalfetcher",
  "google-gemini-cli",
] as const;

const AGENT_USER_AGENT_PATTERNS = AGENT_USER_AGENT_TOKENS.map((token) => new RegExp(token, "i"));

/**
 * One-segment paths that are routes of their own, not posts. Multi-segment
 * paths (`/tag/x`, `/author/x`, `/page/2`, `/series/x`) never match the post
 * shape, and anything with a dot (`/rss.xml`, `/llms.txt`, `<slug>.md`) is
 * excluded by the shape check too.
 */
const RESERVED_SEGMENTS = new Set([
  "api",
  "author",
  "blog-static",
  "llms",
  "llms.mdx",
  "monitoring",
  "og",
  "page",
  "series",
  "sitemap",
  "tag",
]);

const POST_SLUG = /^[A-Za-z0-9_-]+$/;

function stripBlogBasePath(pathname: string) {
  if (pathname === BLOG_BASE_PATH) return "/";
  if (pathname.startsWith(`${BLOG_BASE_PATH}/`)) return pathname.slice(BLOG_BASE_PATH.length);
  return pathname;
}

function getBlogBasePath(pathname: string) {
  return pathname === BLOG_BASE_PATH || pathname.startsWith(`${BLOG_BASE_PATH}/`)
    ? BLOG_BASE_PATH
    : "";
}

export function getAgentMarkdownSignal(headers: Headers) {
  const accept = headers.get("accept")?.toLowerCase() ?? "";
  if (accept.split(",").some((value) => value.trim().startsWith("text/markdown"))) {
    return "accept";
  }

  const userAgent = headers.get("user-agent") ?? "";
  if (AGENT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return "user-agent";
  }

  return undefined;
}

/**
 * The post slug for a blog URL, or undefined if the URL is not a post. Only a
 * trailing slash is forgiven.
 */
export function getPostSlug(pathname: string) {
  let blogPath = stripBlogBasePath(pathname);
  if (blogPath.length > 1 && blogPath.endsWith("/")) blogPath = blogPath.slice(0, -1);

  const segments = blogPath.split("/").filter(Boolean);
  if (segments.length !== 1) return undefined;

  const [slug] = segments;
  if (RESERVED_SEGMENTS.has(slug) || !POST_SLUG.test(slug)) return undefined;

  return slug;
}

/**
 * The internal route that serves a post's Markdown, or undefined when the
 * request should be left to the normal HTML route. An unknown slug still
 * 404s, from the Markdown route instead of the post page.
 */
export function getAgentMarkdownRewritePathname(pathname: string) {
  const slug = getPostSlug(pathname);
  if (!slug) return undefined;

  return `${getBlogBasePath(pathname)}/llms.mdx/${slug}`;
}
