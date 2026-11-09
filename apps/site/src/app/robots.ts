import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const legacyDisallow = ["/dataguide/intro/example", "/dataguide/dummy", "/cloud"];
  // The docs and blog apps declare their own robots rules, but those render
  // under each zone's basePath (/docs/robots.txt, /blog/robots.txt) where
  // crawlers never look. This file produces the only robots.txt that exists
  // on www.prisma.io, so the zone rules have to live here.
  // /blog/*?tag=* is deliberately not disallowed: blog tag landing pages 301
  // into /blog?tag=<tag>, so blocking it would block a redirect destination.
  // OG images must remain crawlable for social previews. Their responses
  // use X-Robots-Tag: noindex to keep generated cards out of search indexes.
  const zoneDisallow = [
    "/docs/api/",
    "/docs/*?query=*",
    "/docs/*&query=*",
    "/docs/*?page=*",
    "/docs/*&page=*",
    "/blog/api/",
    "/blog/*?page=*",
    "/blog/*&page=*",
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...legacyDisallow, ...zoneDisallow],
    },
    sitemap: "https://www.prisma.io/sitemap.xml",
    host: baseUrl,
  };
}
