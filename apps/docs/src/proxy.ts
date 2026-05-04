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

export const config = {
  matcher: ["/((?!_next|monitoring).*)"],
};
