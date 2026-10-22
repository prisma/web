import { COMPARISON_PATHS } from "@/app/compare/comparisons";
import { getDataguideRewritePathname } from "@/lib/dataguide-markdown";

/**
 * Agent-facing Markdown content negotiation for the marketing site.
 *
 * This is the site-side port of apps/docs/src/lib/agent-markdown.ts. The two
 * are deliberately separate modules rather than a shared one in packages/ui:
 * the docs helper is written around `basePath: "/docs"` and treats every docs
 * URL as a candidate, while the site has no basePath and must work off a
 * closed allow-list, because the site app also fronts the docs and blog zones
 * and must never answer for them. The signal detection is the part that has to
 * agree between the two, so it is kept byte-identical below.
 *
 * Everything here is pure and dependency-free so it can run in the proxy
 * (middleware) runtime without pulling the markdown renderers in with it.
 */

/**
 * User agents that we serve Markdown to on the plain HTML URL. Same list as
 * apps/docs; keep the two in step.
 *
 * The last four are user-triggered fetchers: they read a page because a person
 * asked about it. Sources (checked 2026-10-06): docs.perplexity.ai/guides/bots,
 * docs.mistral.ai/robots, developers.facebook.com/docs/sharing/webmasters/
 * web-crawlers, and packages/core/src/tools/web-fetch.ts in
 * google-gemini/gemini-cli. The same vendors' index, training and ads crawlers
 * (MistralAI-Index, MistralAI-Training, meta-externalagent, meta-webindexer,
 * meta-externalads, facebookexternalhit, Googlebot) are deliberately not listed
 * and must not match.
 */
const AGENT_USER_AGENT_PATTERNS = [
  /chatgpt-user/i,
  /gptbot/i,
  /claudebot/i,
  /claude-user/i,
  /perplexitybot/i,
  /cursor/i,
  /perplexity-user/i,
  /mistralai-user/i,
  /meta-externalfetcher/i,
  /google-gemini-cli/i,
];

/**
 * The site pages that have a Markdown rendition. This is a closed list on
 * purpose: the site app owns `/` and the marketing routes, but it also
 * rewrites `/docs/*` and `/blog/*` into the docs and blog zones, which serve
 * their own Markdown. Anything not named here, other than the product guides
 * matched by `getAnswerPagePath` below, is left alone.
 *
 * Keep in sync with `markdownPages` in `@/lib/markdown-pages` (asserted by
 * `src/lib/agent-markdown.test.ts`). `src/proxy.ts` runs on every page for
 * Agent Front, so this list and `getAnswerPagePath`, not its matcher, are what
 * bound the rewrite.
 */
export const AGENT_MARKDOWN_PATHS = [
  "/",
  "/orm",
  "/postgres",
  "/compute",
  "/pricing",
  "/studio",
  "/stack",
  "/enterprise",
  "/mcp",
  ...COMPARISON_PATHS,
] as const;

export type AgentMarkdownPath = (typeof AGENT_MARKDOWN_PATHS)[number];

const AGENT_MARKDOWN_PATH_SET: ReadonlySet<string> = new Set(AGENT_MARKDOWN_PATHS);

export type AgentMarkdownSignal = "accept" | "user-agent";

/**
 * The `Vary` value for a Markdown rendition. A page URL answers Markdown on
 * either signal above, so a shared cache has to key on both request headers.
 *
 * Both the proxy and the Markdown route send it, because on Vercel each one
 * covers a different response (measured on www.prisma.io, 2026-10-19). A 200
 * carries the route's own `Vary` and drops the proxy's: the proxy sent
 * `Accept, User-Agent` and the client got the route's `Accept`. A CDN 304 on
 * a page URL carries the proxy's `Vary` and not the route's. A 304 on a `.md`
 * or `/llms.mdx/*` URL, which the proxy never sees, carries no `Vary` at all.
 */
export const AGENT_MARKDOWN_VARY = "Accept, User-Agent";

/**
 * The product guides in `content/answers` (`/postgres/<slug>`,
 * `/compute/<slug>`), served by `src/app/{postgres,compute}/[slug]`. They get
 * the same Markdown negotiation as the pages above.
 *
 * The proxy cannot load the content collection, so this is a shape check, as
 * in apps/blog: one slug segment under a product that has guides, minus the
 * static routes that sit beside the guides. An unknown slug still 404s, from
 * the Markdown route instead of the page. `answer-page-markdown.test.ts` checks
 * that every guide matches and that every static route under the two products
 * is listed here; `ANSWER_PAGE_HEADER_SOURCES` in next.config.mjs has to agree.
 * `proxy-matcher.test.ts` checks the proxy end to end on every guide.
 */
export const ANSWER_PAGE_RESERVED_SEGMENTS: Readonly<Record<string, readonly string[]>> = {
  postgres: ["guides", "hipaa"],
  compute: ["guides"],
};

/** A guide's filename-derived slug: lowercase words joined by single hyphens. */
const ANSWER_PAGE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * `/mcp` is both a marketing page and the conventional MCP Streamable HTTP
 * endpoint, which next.config.mjs rewrites to mcp.prisma.io on three header
 * conditions. Proxy rewrites run before those rewrites, so protocol traffic
 * has to be recognised and left alone here — an MCP client running inside
 * Cursor or Claude Code carries a user agent that would otherwise look like an
 * agent asking for the marketing copy.
 */
export function isMcpProtocolRequest(headers: Headers) {
  if (headers.has("mcp-session-id")) return true;

  const accept = headers.get("accept")?.toLowerCase() ?? "";
  if (accept.includes("text/event-stream")) return true;

  const contentType = headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.startsWith("application/json")) return true;

  return false;
}

/**
 * Returns why this request should get Markdown, or undefined for a normal
 * browser request. Mirrors apps/docs.
 */
export function getAgentMarkdownSignal(headers: Headers): AgentMarkdownSignal | undefined {
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
 * Normalises a request pathname to one of `AGENT_MARKDOWN_PATHS`, or undefined
 * if the path has no Markdown rendition. Only a trailing slash is forgiven;
 * anything else (an unregistered path, a zone path, or a file extension) is
 * not a supported page.
 */
export function getAgentMarkdownPath(pathname: string): AgentMarkdownPath | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return AGENT_MARKDOWN_PATH_SET.has(normalized) ? (normalized as AgentMarkdownPath) : undefined;
}

/**
 * Normalises a request pathname to a product guide URL (`/postgres/<slug>` or
 * `/compute/<slug>`), or undefined if it does not have a guide's shape. Only a
 * trailing slash is forgiven.
 */
export function getAnswerPagePath(pathname: string): string | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  const [empty, product, slug, ...rest] = normalized.split("/");
  if (empty !== "" || !product || !slug || rest.length > 0) return undefined;
  if (!Object.hasOwn(ANSWER_PAGE_RESERVED_SEGMENTS, product)) return undefined;
  if (ANSWER_PAGE_RESERVED_SEGMENTS[product].includes(slug)) return undefined;
  if (!ANSWER_PAGE_SLUG.test(slug)) return undefined;

  return normalized;
}

/**
 * The internal route that serves a supported page's Markdown, or undefined
 * when the request should be left to the normal HTML route.
 *
 * The homepage goes to `/llms.mdx/index`, not the bare `/llms.mdx` that
 * apps/docs uses. A proxy rewrite is re-run through `rewrites()`, and
 * `/llms.mdx` matches the site's existing `/:path*.mdx` rule, which would send
 * it straight back to `/llms.mdx/llms` and 404. `/llms.mdx/index` has no `.mdx`
 * suffix, so it lands on the route handler, which reads `index` as the
 * homepage — the same slug `/index.md` produces.
 */
export function getAgentMarkdownRewritePathname(pathname: string): string | undefined {
  // Data Guide pages, which the site forwards to the Data Guide deployment;
  // their Markdown is read from that deployment's export. See
  // `@/lib/dataguide-markdown`.
  const dataguidePathname = getDataguideRewritePathname(pathname);
  if (dataguidePathname) return dataguidePathname;

  const answerPath = getAnswerPagePath(pathname);
  if (answerPath) return `/llms.mdx${answerPath}`;

  const path = getAgentMarkdownPath(pathname);
  if (!path) return undefined;
  return path === "/" ? "/llms.mdx/index" : `/llms.mdx${path}`;
}

/** The public `.md` URL for a supported page. Homepage is `/index.md`. */
export function getMarkdownUrlPath(path: AgentMarkdownPath | string): string {
  return path === "/" ? "/index.md" : `${path}.md`;
}
