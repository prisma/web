import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const legacyDisallow = [
    "/dataguide/intro/example",
    "/dataguide/dummy",
    "/cloud",
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...legacyDisallow],
    },
    sitemap: "https://www.prisma.io/sitemap.xml",
    host: baseUrl,
  };
}
