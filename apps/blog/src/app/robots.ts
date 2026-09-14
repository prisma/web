import type { MetadataRoute } from "next";
import { BLOG_PREFIX, getBaseUrl, withBlogBasePath } from "@/lib/url";

/**
 * The listing URLs that only exist as legacy links now.
 *
 * `?page=` / `?tag=` on the blog root were the old pagination and tag filter;
 * they 308 to `/blog/page/N` and `/blog/tag/X`. They stay `Disallow`ed so the
 * parameterised forms are not indexed beside the static routes.
 *
 * The patterns are anchored at the blog root on purpose. The previous
 * `/blog/*?tag=*` form never matched the URL it was written for (`/blog?tag=orm`
 * has no segment after `/blog`) and, now that the tag routes exist, it *would*
 * match `/blog/tag/orm?tag=orm` — the exact URL a legacy redirect lands on,
 * because Next.js forwards the source query string to a redirect destination.
 * Blocking that would throw away the redirect.
 */
function legacyListingPatterns(): string[] {
  const patterns: string[] = [];
  for (const root of [BLOG_PREFIX, `${BLOG_PREFIX}/`]) {
    for (const key of ["tag", "page"]) {
      patterns.push(`${root}?${key}=`);
      patterns.push(`${root}?*&${key}=`);
    }
  }
  return patterns;
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const disallow = ["/api/", "/_next/", "/og/"].map(withBlogBasePath);
  const legacyDisallow = ["/dataguide/intro/example", "/dataguide/dummy", "/cloud"];

  return {
    rules: {
      userAgent: "*",
      allow: withBlogBasePath("/"),
      disallow: [...disallow, ...legacyListingPatterns(), ...legacyDisallow],
    },
    sitemap: "https://www.prisma.io/sitemap.xml",
    host: baseUrl,
  };
}
