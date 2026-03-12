import type { MetadataRoute } from "next";
import { getBaseUrl, withBlogBasePath } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const disallow = [
    "/api/",
    "/_next/",
    "/og/",
    "/*?tag=*",
    "/*?page=*",
    "/*&tag=*",
    "/*&page=*",
  ].map(withBlogBasePath);
  const legacyDisallow = [
    "/dataguide/intro/example",
    "/dataguide/dummy",
    "/cloud",
  ];

  return {
    rules: {
      userAgent: "*",
      allow: withBlogBasePath("/"),
      disallow: [...disallow, ...legacyDisallow],
    },
    sitemap: "https://www.prisma.io/sitemap.xml",
    host: baseUrl,
  };
}
