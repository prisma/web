import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

  const url = (path: string): string => new URL(path, baseUrl).toString();
  const items = source.getPages().map((page) => {
    const lastModified = (page.data as { lastModified?: Date }).lastModified;

    return {
      url: url(page.url),
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency: 'weekly',
      priority: 0.5,
    } as MetadataRoute.Sitemap[number];
  });

  return [
    ...items.filter((v) => v !== undefined),
  ];
}
