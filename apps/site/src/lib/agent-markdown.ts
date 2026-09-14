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
 */
const AGENT_USER_AGENT_PATTERNS = [
  /chatgpt-user/i,
  /gptbot/i,
  /claudebot/i,
  /claude-user/i,
  /perplexitybot/i,
  /cursor/i,
];

/**
 * The site pages that have a Markdown rendition. This is a closed list on
 * purpose: the site app owns `/` and the marketing routes, but it also
 * rewrites `/docs/*` and `/blog/*` into the docs and blog zones, which serve
 * their own Markdown. Anything not named here is left alone.
 *
 * Keep in sync with `markdownPages` in `@/lib/markdown-pages` (asserted by
 * `src/lib/agent-markdown.test.ts`) and with the `matcher` in `src/proxy.ts`.
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
] as const;

export type AgentMarkdownPath = (typeof AGENT_MARKDOWN_PATHS)[number];

const AGENT_MARKDOWN_PATH_SET: ReadonlySet<string> = new Set(AGENT_MARKDOWN_PATHS);

export type AgentMarkdownSignal = "accept" | "user-agent";

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
 * anything else (a nested path, a zone path, a path with a file extension) is
 * not a supported page.
 */
export function getAgentMarkdownPath(pathname: string): AgentMarkdownPath | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return AGENT_MARKDOWN_PATH_SET.has(normalized) ? (normalized as AgentMarkdownPath) : undefined;
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
  const path = getAgentMarkdownPath(pathname);
  if (!path) return undefined;
  return path === "/" ? "/llms.mdx/index" : `/llms.mdx${path}`;
}

/** The public `.md` URL for a supported page. Homepage is `/index.md`. */
export function getMarkdownUrlPath(path: AgentMarkdownPath | string): string {
  return path === "/" ? "/index.md" : `${path}.md`;
}
