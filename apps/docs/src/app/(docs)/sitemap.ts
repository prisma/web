import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export const revalidate = 3600;

function isLegacyPage(url: string) {
  return url.startsWith("/v6") || url.startsWith("/orm/v6");
}

function getPriority(url: string, slugCount: number) {
  if (isLegacyPage(url)) return 0.4;
  if (slugCount === 0) return 1.0;
  if (slugCount === 1) return 0.8;
  return 0.5;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const url = (path: string): string => new URL(withDocsBasePath(path), baseUrl).toString();

  return source
    .getPages()
    .filter((page) => !(page.data as { noindex?: boolean }).noindex)
    .map((page) => {
      const lastModified = (page.data as { lastModified?: Date }).lastModified;

      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "weekly",
        priority: getPriority(page.url, page.slugs.length),
      } as MetadataRoute.Sitemap[number];
    });
}
