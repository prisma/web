import { handleAgentFront } from "@/agent-front";
import {
  AGENT_MARKDOWN_VARY,
  getAgentMarkdownRewritePathname,
  getAgentMarkdownSignal,
  isMcpProtocolRequest,
} from "@/lib/agent-markdown";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/**
 * Two jobs, in this order.
 *
 * 1. Agent Front (`src/agent-front.ts`, ora's generated file, which strips
 *    query strings and fragments from reported referers)
 *    reports each page request to ora after the response has been sent, so the
 *    Agent traffic page can tell agents from people. It answers a request
 *    itself only for `/__ora/status`, or once Autopilot is switched on in the
 *    ora Portal; otherwise it returns null and the request carries on.
 * 2. The Markdown rendition of a marketing page, product guide or Data Guide
 *    page for agents that ask for it, mirroring apps/docs/src/proxy.ts and
 *    apps/blog's posts, with a `Vary` append on both variants (see
 *    `agentMarkdown`).
 *
 * The site app is the root zone, and a proxy runs before `rewrites()`, so this
 * one file sees `/docs/*` and `/blog/*` on their way to the docs and blog
 * zones. That is what lets a single Agent Front install cover all of
 * www.prisma.io, and it is also why the second job needs a boundary.
 */
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  // Prisma owns /mcp: protocol requests must reach the mcp.prisma.io rewrite,
  // and browser requests keep the existing marketing-page behavior. Ora's
  // policy must not take over this path, including during a policy outage.
  if (request.nextUrl.pathname === "/mcp" || request.nextUrl.pathname === "/mcp/") {
    return agentMarkdown(request);
  }

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

/**
 * The request headers the rewrite below sets for the Markdown routes. A client
 * can send them too, so a request the proxy does not rewrite loses them: the
 * Data Guide route reads `x-prisma-agent-markdown` to tell a rewritten HTML URL
 * from a `.md` URL.
 */
const AGENT_MARKDOWN_REQUEST_HEADERS = ["x-prisma-agent-markdown", "x-prisma-agent-markdown-path"];

function passThrough(request: NextRequest) {
  if (!AGENT_MARKDOWN_REQUEST_HEADERS.some((name) => request.headers.has(name))) {
    return NextResponse.next();
  }
  const headers = new Headers(request.headers);
  for (const name of AGENT_MARKDOWN_REQUEST_HEADERS) headers.delete(name);
  return NextResponse.next({ request: { headers } });
}

function agentMarkdown(request: NextRequest) {
  // The containment boundary. The matcher used to be it, naming the nine pages
  // that have a rendition and nothing else; now that the proxy runs on every
  // page for Agent Front, this line is what keeps the rest of the function off
  // `/docs/*`, `/blog/*`, `/api/*`, `/llms.mdx/*` and any path with a file
  // extension. Those get a bare `next()`, exactly as if the proxy had not run,
  // less any client-sent copy of the rewrite's request headers.
  const rewritePathname = getAgentMarkdownRewritePathname(request.nextUrl.pathname);
  if (!rewritePathname) return passThrough(request);

  // Markdown negotiation is a read. Anything else on these paths — notably an
  // MCP initialize POST to /mcp — belongs to whatever normally handles it.
  if (request.method !== "GET" && request.method !== "HEAD") return passThrough(request);
  if (isMcpProtocolRequest(request.headers)) return withVaryAccept(passThrough(request));

  // The no-signal branch has work to do: it appends `Vary: Accept` for the
  // HTML variant. Next overwrites the `Vary` it gets from `headers()` in
  // next.config.mjs with its own RSC value, so this append is the only place
  // the value is set. It does not reach a 200 on Vercel (that carries only
  // Next's RSC `Vary`), but it is what a CDN 304 for the page carries (see
  // the note on the rewrite below). The `Link` header still comes from
  // next.config.mjs.
  const signal = getAgentMarkdownSignal(request.headers);
  if (!signal) return withVaryAccept(passThrough(request));

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
  // The Markdown variant is chosen by `Accept` or by the agent's User-Agent, so
  // it varies on both: a shared cache must not hand it to a browser that sends
  // the same `Accept`. The HTML variant appends `Vary: Accept` only; an agent
  // served cached HTML still gets a correct page, and keying every page's HTML
  // on User-Agent would split shared caches per browser build.
  //
  // On Vercel the two response paths differ (measured on www.prisma.io,
  // 2026-10-19). On a 200 the Markdown route's own `Vary` wins and this one is
  // dropped, so the route sends the same value (`AGENT_MARKDOWN_VARY`). On a
  // CDN 304 (a conditional GET whose `If-None-Match` matches) it is the other
  // way round: the client gets this proxy's `Vary` and not the route's. So
  // both have to say `Accept, User-Agent`. Under `next start` the two merge.
  response.headers.append("Vary", AGENT_MARKDOWN_VARY);

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

