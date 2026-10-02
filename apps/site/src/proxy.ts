import { handleAgentFront } from "@/agent-front";
import {
  getAgentMarkdownRewritePathname,
  getAgentMarkdownSignal,
  isMcpProtocolRequest,
} from "@/lib/agent-markdown";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/**
 * Two jobs, in this order.
 *
 * 1. Agent Front (`src/agent-front.ts`, ora's file, with one change marked
 *    PRISMA LOCAL CHANGE that strips the query string from the referer)
 *    reports each page request to ora after the response has been sent, so the
 *    Agent traffic page can tell agents from people. It answers a request
 *    itself only for `/__ora/status`, or once Autopilot is switched on in the
 *    ora Portal; otherwise it returns null and the request carries on.
 * 2. The Markdown rendition of a marketing page for agents that ask for it,
 *    mirroring apps/docs/src/proxy.ts, with `Vary: Accept` on the HTML variant
 *    for everyone else.
 *
 * The site app is the root zone, and a proxy runs before `rewrites()`, so this
 * one file sees `/docs/*` and `/blog/*` on their way to the docs and blog
 * zones. That is what lets a single Agent Front install cover all of
 * www.prisma.io, and it is also why the second job needs a boundary.
 */
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const answered = await handleAgentFront(request, event);
  if (answered) return answered;

  return agentMarkdown(request);
}

function withVaryAccept(response: NextResponse) {
  // Append, never set: Next's own `Vary` carries the RSC negotiation headers
  // and dropping them would poison the router cache.
  response.headers.append("Vary", "Accept");
  response.headers.set("x-md-probe", "1");
  return response;
}

function agentMarkdown(request: NextRequest) {
  // The containment boundary. The matcher used to be it, naming the nine pages
  // that have a rendition and nothing else; now that the proxy runs on every
  // page for Agent Front, this line is what keeps the rest of the function off
  // `/docs/*`, `/blog/*`, `/api/*`, `/llms.mdx/*` and any path with a file
  // extension. Those get a bare `next()`, exactly as if the proxy had not run.
  const rewritePathname = getAgentMarkdownRewritePathname(request.nextUrl.pathname);
  if (!rewritePathname) return NextResponse.next();

  // Markdown negotiation is a read. Anything else on these paths — notably an
  // MCP initialize POST to /mcp — belongs to whatever normally handles it.
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();
  if (isMcpProtocolRequest(request.headers)) return withVaryAccept(NextResponse.next());

  // The no-signal branch has work to do: `Vary: Accept` has to reach the HTML
  // response, and Next overwrites the `Vary` it gets from `headers()` in
  // next.config.mjs with its own RSC value, so a proxy append is the only
  // place it survives. The `Link` header still comes from next.config.mjs.
  const signal = getAgentMarkdownSignal(request.headers);
  if (!signal) return withVaryAccept(NextResponse.next());

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
 * Every page request, and nothing the proxy could not use.
 *
 * Agent Front's own matcher is `/((?!_next/static|_next/image|favicon.ico).*)`.
 * This one is narrower in three ways, none of which costs it a reported event:
 *
 * - The three zones serve their assets from `/site-static`, `/docs-static` and
 *   `/blog-static`, not `/_next/static`, so those prefixes are excluded too.
 *   Without them every script, stylesheet and font would wake the proxy up.
 * - Paths ending in one of the extensions in `ASSET_EXTENSIONS` in
 *   `src/agent-front.ts` are excluded, because `shouldRecord` there drops them
 *   anyway. `src/lib/proxy-matcher.test.ts` keeps the two lists in step.
 * - Requests carrying the `rsc` header are excluded. Those are the App
 *   Router's own fetches for soft navigations and `<Link>` prefetches, and
 *   Agent Front does not count them: `isPageView` only counts a browser
 *   request whose `sec-fetch-dest` is a document.
 *
 * What is left still includes everything ora may manage under Autopilot
 * (`/robots.txt`, `/llms.txt`, `/agents.md`, `/openapi.json`, `/.well-known/*`,
 * `*.md`) and `/__ora/status`.
 *
 * Next reads `config` by static analysis, so this has to be an inline literal.
 */
export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|site-static|docs-static|blog-static|.*\\.(?:js|mjs|css|map|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|otf|eot|mp4|webm|mp3|wav)$).*)",
      missing: [{ type: "header", key: "rsc" }],
    },
  ],
};
