import { getBaseUrl, withDocsBasePath } from '@/lib/urls';
import type { InferPageType } from 'fumadocs-core/source';
import type { source, sourceV6 } from '@/lib/source';
import { JsonLd } from '@prisma-docs/ui/components/json-ld';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type DocsPage = InferPageType<typeof source> | InferPageType<typeof sourceV6>;

interface StructuredDataProps {
  page: DocsPage;
}

const sectionTitleCache = new Map<string, string | null>();

function toIsoDate(value: Date | string | undefined) {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function getContentDirectory(page: DocsPage) {
  return page.url.startsWith('/v6') ? 'content/docs.v6' : 'content/docs';
}

function getSectionTitle(page: DocsPage, slugs: string[]) {
  if (slugs.length === 0) return undefined;

  const contentDirectory = getContentDirectory(page);
  const cacheKey = `${contentDirectory}:${slugs.join('/')}`;
  const cached = sectionTitleCache.get(cacheKey);

  if (cached !== undefined) {
    return cached ?? undefined;
  }

  const candidatePaths = [
    join(process.cwd(), contentDirectory, ...slugs, 'meta.json'),
    join(process.cwd(), contentDirectory, '(index)', ...slugs, 'meta.json'),
  ];

  for (const candidatePath of candidatePaths) {
    try {
      const meta = JSON.parse(readFileSync(candidatePath, 'utf8')) as { title?: string };
      if (typeof meta.title === 'string' && meta.title.trim().length > 0) {
        sectionTitleCache.set(cacheKey, meta.title);
        return meta.title;
      }
    } catch {}
  }

  sectionTitleCache.set(cacheKey, null);
  return undefined;
}

function getBreadcrumbName(page: DocsPage, slugs: string[], index: number) {
  if (index === slugs.length - 1) {
    return page.data.title;
  }

  return (
    getSectionTitle(page, slugs.slice(0, index + 1)) ??
    slugs[index].charAt(0).toUpperCase() + slugs[index].slice(1).replace(/-/g, ' ')
  );
}

export function TechArticleSchema({ page }: StructuredDataProps) {
  const baseUrl = getBaseUrl();
  const lastModified = (page.data as { lastModified?: Date | string }).lastModified;
  const datePublished = (page.data as { datePublished?: Date | string }).datePublished;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: (page.data as any).metaTitle ?? page.data.title,
    description: (page.data as any).metaDescription ?? page.data.description,
    url: `${baseUrl}${withDocsBasePath(page.url)}`,
    datePublished: toIsoDate(datePublished) ?? toIsoDate(lastModified),
    dateModified: toIsoDate(lastModified),
    author: {
      '@type': 'Organization',
      name: 'Prisma Data, Inc.',
      url: 'https://www.prisma.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prisma',
      url: 'https://www.prisma.io',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${withDocsBasePath(page.url)}`,
    },
  };

  return (
    <JsonLd id="tech-article-structured-data" data={schema} />
  );
}

export function BreadcrumbSchema({ page }: StructuredDataProps) {
  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
  ];

  let currentPath = '';
  page.slugs.forEach((_, index) => {
    const slugs = page.slugs.slice(0, index + 1);
    currentPath = `/${slugs.join('/')}`;

    breadcrumbItems.push({
      '@type': 'ListItem',
      position: index + 2,
      name: getBreadcrumbName(page, slugs, index),
      item: `${baseUrl}${withDocsBasePath(currentPath)}`,
    });
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  return (
    <JsonLd id="breadcrumb-structured-data" data={schema} />
  );
}
