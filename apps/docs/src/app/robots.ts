import type { MetadataRoute } from "next";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const sitemap = new URL(withDocsBasePath("/sitemap.xml"), baseUrl).toString();
  // Social crawlers need OG images; their responses carry noindex instead.
  const disallow = ["/api/", "/_next/", "/*?query=*", "/*?page=*", "/*&query=*", "/*&page=*"].map(
    withDocsBasePath,
  );

  return {
    rules: {
      userAgent: "*",
      allow: withDocsBasePath("/"),
      disallow,
    },
    sitemap,
    host: baseUrl,
  };
}
