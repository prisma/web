import { getAgentMarkdownRewritePathname, getAgentMarkdownSignal } from "@/lib/agent-markdown";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const signal = getAgentMarkdownSignal(request.headers);
  if (!signal) return NextResponse.next();

  const rewritePathname = getAgentMarkdownRewritePathname(request.nextUrl.pathname);
  if (!rewritePathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = rewritePathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-prisma-agent-markdown", signal);
  requestHeaders.set("x-prisma-agent-markdown-path", request.nextUrl.pathname);

  console.info("docs:agent_markdown_rewrite", {
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
 * Only agent requests reach this proxy.
 *
 * It used to run on every docs request (`/((?!_next|monitoring).*)`) just to
 * read two headers and, for the 99.9% of requests that are ordinary browsers
 * and crawlers, return `NextResponse.next()`. That is a middleware invocation
 * in front of every prerendered HTML response, which the September 2026 SEO
 * audit measured as 660 URLs over the crawler's TTFB threshold. The matcher now
 * carries the same two conditions the function checks, so a request that cannot
 * possibly be rewritten never wakes the proxy up.
 *
 * Matcher notes:
 *
 * - Entries in the array are OR'd; the `has` conditions inside one entry are
 *   AND'd. `Accept: text/markdown` and the agent user-agents are alternatives,
 *   so they need one entry each.
 * - `has` values are regexes anchored with `^…$` and compiled without flags
 *   (see `matchHas` in `next/dist/shared/lib/router/utils/prepare-destination`),
 *   and Vercel's routing layer compiles them with a Rust engine. Neither
 *   supports an inline `(?i)`, so case-insensitivity is spelled out with
 *   character classes. `proxy-matcher.test.ts` keeps the agent list in sync
 *   with `AGENT_USER_AGENT_TOKENS` and pins the behaviour of both patterns —
 *   Next.js reads `config` by static analysis, so it cannot be built from an
 *   import.
 * - The source excludes `_next`, `monitoring` and `docs-static`, plus any path
 *   whose last segment contains a dot (`.md`, `.ico`, `.png`, …). The function
 *   body's own skip list (`/api`, `/llms*`, `/og`, `rss.xml`, `sitemap`) stays
 *   where it is: those are rewrite-target rules, not asset paths.
 */
export const config = {
  matcher: [
    {
      source: "/((?!_next|monitoring|docs-static)(?:[^/]*/)*[^/.]*)",
      has: [
        {
          type: "header",
          key: "accept",
          value: ".*[tT][eE][xX][tT]/[mM][aA][rR][kK][dD][oO][wW][nN].*",
        },
      ],
    },
    {
      source: "/((?!_next|monitoring|docs-static)(?:[^/]*/)*[^/.]*)",
      has: [
        {
          type: "header",
          key: "user-agent",
          value:
            ".*([cC][hH][aA][tT][gG][pP][tT]-[uU][sS][eE][rR]|[gG][pP][tT][bB][oO][tT]|[cC][lL][aA][uU][dD][eE][bB][oO][tT]|[cC][lL][aA][uU][dD][eE]-[uU][sS][eE][rR]|[pP][eE][rR][pP][lL][eE][xX][iI][tT][yY][bB][oO][tT]|[cC][uU][rR][sS][oO][rR]).*",
        },
      ],
    },
  ],
};
