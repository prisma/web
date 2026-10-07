import { getAgentMarkdownRewritePathname, getAgentMarkdownSignal } from "@/lib/agent-markdown";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves a post's Markdown rendition on its plain URL to agents that ask for
 * it, mirroring apps/docs/src/proxy.ts. Browsers and search crawlers never
 * reach this function: the matcher below only fires on an agent user-agent or
 * an `Accept: text/markdown` header.
 */
export function proxy(request: NextRequest) {
  const signal = getAgentMarkdownSignal(request.headers);
  if (!signal) return NextResponse.next();

  // Negotiation is a read; leave anything else to the route that owns it.
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();

  const rewritePathname = getAgentMarkdownRewritePathname(request.nextUrl.pathname);
  if (!rewritePathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = rewritePathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-prisma-agent-markdown", signal);
  requestHeaders.set("x-prisma-agent-markdown-path", request.nextUrl.pathname);

  console.info("blog:agent_markdown_rewrite", {
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
 * Only agent requests reach this proxy, for the same reason as apps/docs: a
 * proxy invocation in front of every prerendered HTML response costs crawler
 * TTFB. Entries are OR'd and the `has` conditions inside one entry are AND'd.
 * `has` values are anchored and compiled without flags (also by Vercel's Rust
 * router), so case-insensitivity is spelled out with character classes.
 * `src/lib/proxy-matcher.test.ts` keeps the agent list in sync with
 * `AGENT_USER_AGENT_TOKENS`.
 *
 * The source excludes `_next`, `monitoring` and `blog-static`, plus any path
 * whose last segment contains a dot (`.md`, `.xml`, `.png`, …). Which of the
 * remaining paths are posts is decided in `getPostSlug`.
 */
export const config = {
  matcher: [
    {
      source: "/((?!_next|monitoring|blog-static)(?:[^/]*/)*[^/.]*)",
      has: [
        {
          type: "header",
          key: "accept",
          value: ".*[tT][eE][xX][tT]/[mM][aA][rR][kK][dD][oO][wW][nN].*",
        },
      ],
    },
    {
      source: "/((?!_next|monitoring|blog-static)(?:[^/]*/)*[^/.]*)",
      has: [
        {
          type: "header",
          key: "user-agent",
          value:
            ".*([cC][hH][aA][tT][gG][pP][tT]-[uU][sS][eE][rR]|[gG][pP][tT][bB][oO][tT]|[cC][lL][aA][uU][dD][eE][bB][oO][tT]|[cC][lL][aA][uU][dD][eE]-[uU][sS][eE][rR]|[pP][eE][rR][pP][lL][eE][xX][iI][tT][yY][bB][oO][tT]|[cC][uU][rR][sS][oO][rR]|[pP][eE][rR][pP][lL][eE][xX][iI][tT][yY]-[uU][sS][eE][rR]|[mM][iI][sS][tT][rR][aA][lL][aA][iI]-[uU][sS][eE][rR]|[mM][eE][tT][aA]-[eE][xX][tT][eE][rR][nN][aA][lL][fF][eE][tT][cC][hH][eE][rR]|[gG][oO][oO][gG][lL][eE]-[gG][eE][mM][iI][nN][iI]-[cC][lL][iI]).*",
        },
      ],
    },
  ],
};
