// Served at docs.prisma.io/robots.txt via the basePath-free rewrite in
// next.config.mjs. The docs origin host duplicates every page on
// www.prisma.io (the canonical host the multi-zone setup serves), and Google
// has indexed origin-host URLs in the past, so direct crawling of this host
// is blocked entirely. Requests proxied from www.prisma.io never hit this
// route: www's robots.txt is served by apps/site.
export const dynamic = "force-static";

export function GET() {
  return new Response("User-agent: *\nDisallow: /\n", {
    headers: { "Content-Type": "text/plain" },
  });
}
