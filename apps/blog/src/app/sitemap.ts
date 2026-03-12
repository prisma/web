import type { MetadataRoute } from "next";
import { blog } from "@/lib/source";
import { getBaseUrl, withBlogBasePath } from "@/lib/url";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const url = (path: string): string =>
    new URL(withBlogBasePath(path), baseUrl).toString();

  const items = blog.getPages().map((page) => {
    const { lastModified, date } = page.data as {
      lastModified?: Date | string;
      date?: Date | string;
    };
    const resolvedLastModified = lastModified ?? date;
    const lastModifiedDate = resolvedLastModified
      ? new Date(resolvedLastModified)
      : undefined;

    return {
      url: url(page.url),
      lastModified:
        lastModifiedDate && !Number.isNaN(lastModifiedDate.getTime())
          ? lastModifiedDate
          : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    } as MetadataRoute.Sitemap[number];
  });

  return [
    {
      url: url("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    ...items,
  ];
}
