import type { MetadataRoute } from "next";
import { source, sourceV6 } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const url = (path: string): string => new URL(withDocsBasePath(path), baseUrl).toString();

  // v7 pages (default)
  const items = source.getPages().map((page) => {
    const lastModified = (page.data as { lastModified?: Date }).lastModified;

    return {
      url: url(page.url),
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency: "weekly",
      priority: 0.5,
    } as MetadataRoute.Sitemap[number];
  });

  // v6 pages
  const v6Items = sourceV6.getPages().map((page) => {
    const lastModified = (page.data as { lastModified?: Date }).lastModified;

    return {
      url: url(page.url),
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency: "weekly",
      priority: 0.4, // Lower priority than v7
    } as MetadataRoute.Sitemap[number];
  });

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/showcase"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...items.filter((v) => v !== undefined),
    ...v6Items.filter((v) => v !== undefined),
  ];
}

