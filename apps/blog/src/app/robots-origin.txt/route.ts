// Served at blog.prisma.io/robots.txt via the basePath-free rewrite in
// next.config.mjs. The blog origin host duplicates every page on
// www.prisma.io (the canonical host the multi-zone setup serves), and Search
// Console shows blog.prisma.io URLs, including ?tag=/?page= parameter
// variants, indexed with impressions but zero clicks. Direct crawling of
// this host is blocked entirely. Requests proxied from www.prisma.io never
// hit this route: www's robots.txt is served by apps/site.
export const dynamic = "force-static";

export function GET() {
  return new Response("User-agent: *\nDisallow: /\n", {
    headers: { "Content-Type": "text/plain" },
  });
}
