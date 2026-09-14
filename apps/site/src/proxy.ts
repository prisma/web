import {
  getAgentMarkdownRewritePathname,
  getAgentMarkdownSignal,
  isMcpProtocolRequest,
} from "@/lib/agent-markdown";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves the Markdown rendition of a marketing page to agents that ask for it,
 * mirroring apps/docs/src/proxy.ts, and marks the HTML variant `Vary: Accept`
 * for everyone else.
 *
 * The matcher below is the containment boundary: it enumerates exactly the
 * nine pages that have a rendition, so this can never run on `/docs/*`,
 * `/blog/*`, `/api/*`, `/_next/*`, `/site-static/*`, `/llms.mdx/*` or any path
 * with a file extension. It deliberately carries no `has` condition, because
 * the no-signal branch has work to do: `Vary: Accept` has to reach the HTML
 * response, and Next overwrites the `Vary` it gets from `headers()` in
 * next.config.mjs with its own RSC value, so a middleware append is the only
 * place it survives. The `Link` header still comes from next.config.mjs.
 */
function withVaryAccept(response: NextResponse) {
  // Append, never set: Next's own `Vary` carries the RSC negotiation headers
  // and dropping them would poison the router cache.
  response.headers.append("Vary", "Accept");
  response.headers.set("x-md-probe", "1");
  return response;
}

export function proxy(request: NextRequest) {
  // Markdown negotiation is a read. Anything else on these paths — notably an
  // MCP initialize POST to /mcp — belongs to whatever normally handles it.
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();
  if (isMcpProtocolRequest(request.headers)) return withVaryAccept(NextResponse.next());

  const signal = getAgentMarkdownSignal(request.headers);
  if (!signal) return withVaryAccept(NextResponse.next());

  const rewritePathname = getAgentMarkdownRewritePathname(request.nextUrl.pathname);
  if (!rewritePathname) return withVaryAccept(NextResponse.next());

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
  response.headers.append("Vary", "Accept");

  return response;
}

/**
 * Next extracts `matcher` statically at build time, so the page list has to be
 * an inline literal — it cannot be derived from `AGENT_MARKDOWN_PATHS`, and it
 * cannot even reference a const declared in this file.
 * `src/lib/agent-markdown.test.ts` reads the alternation back out of this
 * source and asserts it still matches `AGENT_MARKDOWN_PATHS`.
 *
 * Nine literal paths is the whole surface this runs on: no `/docs/*`, no
 * `/blog/*`, no `/api/*`, no `/_next/*`, no `/site-static/*`, no `/llms.mdx/*`,
 * and nothing with a file extension can match either source.
 */
export const config = {
  matcher: ["/", "/:page(orm|postgres|compute|pricing|studio|stack|enterprise|mcp)"],
};
