import { getBaseUrl, withDocsBasePath } from '@/lib/urls';
import type { InferPageType } from 'fumadocs-core/source';
import type { source, sourceV6 } from '@/lib/source';

interface StructuredDataProps {
  page: InferPageType<typeof source> | InferPageType<typeof sourceV6>;
}

export function TechArticleSchema({ page }: StructuredDataProps) {
  const baseUrl = getBaseUrl();
  const lastModified = (page.data as { lastModified?: Date }).lastModified;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: (page.data as any).metaTitle ?? page.data.title,
    description: (page.data as any).metaDescription ?? page.data.description,
    url: `${baseUrl}${withDocsBasePath(page.url)}`,
    dateModified: lastModified?.toISOString(),
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function BreadcrumbSchema({ page }: StructuredDataProps) {
  const baseUrl = getBaseUrl();

  // Build breadcrumb items from URL slugs
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
  ];

  let currentPath = '';
  page.slugs.forEach((slug, index) => {
    currentPath += `/${slug}`;
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: index + 2,
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      item: `${baseUrl}${withDocsBasePath(currentPath)}`,
    });
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
