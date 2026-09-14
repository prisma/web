import {
  getAgentMarkdownRewritePathname,
  getAgentMarkdownSignal,
  isMcpProtocolRequest,
} from "@/lib/agent-markdown";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves the Markdown rendition of a marketing page to agents that ask for it,
 * mirroring apps/docs/src/proxy.ts.
 *
 * The matcher below is the first line of defence: it enumerates exactly the
 * nine pages that have a rendition and only fires when the request carries an
 * agent signal, so this never runs on `/docs/*`, `/blog/*`, `/api/*`,
 * `/_next/*`, `/site-static/*`, any path with a file extension, or the
 * overwhelming majority of browser traffic. The checks in the function repeat
 * the decision precisely, because matcher regexes are coarse by design.
 */
export function proxy(request: NextRequest) {
  // Markdown negotiation is a read. Anything else on these paths — notably an
  // MCP initialize POST to /mcp — belongs to whatever normally handles it.
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();
  if (isMcpProtocolRequest(request.headers)) return NextResponse.next();

  const signal = getAgentMarkdownSignal(request.headers);
  if (!signal) return NextResponse.next();

  const rewritePathname = getAgentMarkdownRewritePathname(request.nextUrl.pathname);
  if (!rewritePathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = rewritePathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-prisma-agent-markdown", signal);
  requestHeaders.set("x-prisma-agent-markdown-path", request.nextUrl.pathname);

  console.info("site:agent_markdown_rewrite", {
    path: request.nextUrl.pathname,
    signal,
  });

  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-prisma-agent-markdown", signal);

  return response;
}

/**
 * `matcher` has to be a statically analysable literal, so the page list and
 * the user-agent alternation are spelled out here rather than derived from
 * `AGENT_MARKDOWN_PATHS` / the pattern list in `@/lib/agent-markdown`.
 * `src/lib/agent-markdown.test.ts` asserts the two stay in step.
 *
 * The user-agent alternation is written with character classes because a
 * matcher `has` value is compiled with `new RegExp`, which has no inline
 * case-insensitivity flag.
 */
const AGENT_MARKDOWN_SOURCES = ["/", "/:page(orm|postgres|compute|pricing|studio|stack|enterprise|mcp)"];

const ACCEPT_MARKDOWN = {
  type: "header",
  key: "accept",
  value: ".*text/markdown.*",
} as const;

const AGENT_USER_AGENT = {
  type: "header",
  key: "user-agent",
  value:
    ".*([cC][hH][aA][tT][gG][pP][tT]-[uU][sS][eE][rR]|[gG][pP][tT][bB][oO][tT]|[cC][lL][aA][uU][dD][eE][bB][oO][tT]|[cC][lL][aA][uU][dD][eE]-[uU][sS][eE][rR]|[pP][eE][rR][pP][lL][eE][xX][iI][tT][yY][bB][oO][tT]|[cC][uU][rR][sS][oO][rR]).*",
} as const;

export const config = {
  matcher: [
    { source: "/", has: [ACCEPT_MARKDOWN] },
    { source: "/", has: [AGENT_USER_AGENT] },
    {
      source: "/:page(orm|postgres|compute|pricing|studio|stack|enterprise|mcp)",
      has: [ACCEPT_MARKDOWN],
    },
    {
      source: "/:page(orm|postgres|compute|pricing|studio|stack|enterprise|mcp)",
      has: [AGENT_USER_AGENT],
    },
  ],
};

export { AGENT_MARKDOWN_SOURCES };
