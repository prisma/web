import { generateRSS } from '@prisma-docs/ui/lib/rss';
import { source, sourceV6 } from '@/lib/source';
import { getBaseUrl, withDocsBasePath } from './urls';

export function getRSS() {
  const baseUrl = getBaseUrl();
  // Combine v7 and v6 pages
  const allPages = [
    ...source.getPages(),
    ...sourceV6.getPages(),
  ];

  return generateRSS(
    {
      title: 'Prisma Documentation',
      baseUrl: baseUrl,
      description: 'Latest updates to Prisma documentation',
      copyright: `All rights reserved ${new Date().getFullYear()}, Prisma Data, Inc.`,
      author: {
        name: 'Prisma Data, Inc.',
      },
    },
    allPages.map((page: any) => ({
      id: `${baseUrl}${withDocsBasePath(page.url)}`,
      url: `${baseUrl}${withDocsBasePath(page.url)}`,
      title: page.data.title,
      description: page.data.description,
      date: page.data.lastModified ? new Date(page.data.lastModified) : new Date(),
    }))
  );
}