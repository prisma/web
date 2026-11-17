/**
 * Markdown for Prisma's Data Guide at `/dataguide/*`.
 *
 * The Data Guide is its own deployment (the prisma/dataguide repo, a static
 * Gatsby build). www.prisma.io forwards `/dataguide/*` to it from the
 * `fallback` rewrites in next.config.mjs. That build already exports every
 * article as Markdown at `/dataguide/<path>.md` (and the overview at
 * `/dataguide/index.md`), advertises those URLs in each page's
 * `<link rel="alternate" type="text/markdown">` and lists them in
 * `/dataguide/llms.txt`.
 *
 * On www those URLs never reached it: the site's own `/:path*.md` rewrite runs
 * in `afterFiles`, before the `fallback` forward, so `/dataguide/<path>.md`
 * landed on the site's Markdown route and 404ed. `src/app/llms.mdx/dataguide`
 * now answers them by reading the Data Guide's export, and serves it as
 * text/plain like every other Markdown response on www. The proxy sends agents
 * that ask for a Data Guide HTML URL there too, as it does for the site's own
 * pages and as the docs and blog zones do for theirs.
 *
 * Pure and dependency-free, so the proxy can import it.
 */

/**
 * The Data Guide deployment. Must match the destination of the
 * `/dataguide/:any*` fallback rewrite in next.config.mjs;
 * `dataguide-markdown.test.ts` checks that it does.
 */
export const DATAGUIDE_ORIGIN = "https://dataguide.vercel.app";

/**
 * One Data Guide path segment. Article slugs are hyphenated words, and at
 * least one keeps capitals (`introduction-to-OLAP-OLTP`). No dots, so file
 * URLs such as `/dataguide/llms.txt` or `/dataguide/agent-index.json` never
 * match, and no percent-encoding or `..`.
 */
const SEGMENT = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

/** The deepest Data Guide article is three segments; this leaves room. */
const MAX_SEGMENTS = 8;

/** Gatsby's own directories under the path prefix: never pages. */
const RESERVED_FIRST_SEGMENTS: ReadonlySet<string> = new Set(["static", "page-data"]);

/**
 * The Data Guide page that a `/llms.mdx/dataguide/<slug>` request is about, or
 * undefined when the slug cannot be a Data Guide page. `["index"]` is the
 * overview at `/dataguide`, matching the Data Guide's own `index.md`.
 */
export function getDataguidePagePath(slug: readonly string[]): string | undefined {
  if (slug.length === 0 || slug.length > MAX_SEGMENTS) return undefined;
  if (!slug.every((segment) => SEGMENT.test(segment))) return undefined;
  if (RESERVED_FIRST_SEGMENTS.has(slug[0])) return undefined;
  if (slug.length === 1 && slug[0] === "index") return "/dataguide";
  return `/dataguide/${slug.join("/")}`;
}

/** The Markdown file the Data Guide deployment publishes for that slug. */
export function getDataguideMarkdownPath(slug: readonly string[]): string | undefined {
  if (!getDataguidePagePath(slug)) return undefined;
  return `/dataguide/${slug.join("/")}.md`;
}

/**
 * For the proxy: the internal route that serves the Markdown of a Data Guide
 * HTML URL, or undefined when the path is not one. Only a trailing slash is
 * forgiven, as for the site's own pages. The overview is the bare
 * `/dataguide`; a literal `/dataguide/index` is not a page there, so it keeps
 * the HTML forward (and its 404).
 */
export function getDataguideRewritePathname(pathname: string): string | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (normalized === "/dataguide") return "/llms.mdx/dataguide/index";
  if (!normalized.startsWith("/dataguide/")) return undefined;

  const slug = normalized.slice("/dataguide/".length).split("/");
  if (slug.length === 1 && slug[0] === "index") return undefined;
  if (!getDataguidePagePath(slug)) return undefined;
  return `/llms.mdx/dataguide/${slug.join("/")}`;
}
