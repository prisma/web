import { Feed } from 'feed';

export interface RSSConfig {
  /**
   * The title of the RSS feed
   */
  title: string;
  /**
   * The base URL of the site (e.g., 'https://prisma.io/docs')
   */
  baseUrl: string;
  /**
   * Description of the RSS feed
   */
  description: string;
  /**
   * Language of the feed (default: 'en')
   */
  language?: string;
  /**
   * Copyright notice (default: auto-generated with current year)
   */
  copyright?: string;
  /**
   * Author information
   */
  author?: {
    name: string;
    email?: string;
    link?: string;
  };
}

export interface RSSItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Relative URL path (will be appended to baseUrl)
   */
  url: string;
  /**
   * Title of the item
   */
  title: string;
  /**
   * Description or summary of the item
   */
  description?: string;
  /**
   * Publication date (defaults to current date if not provided)
   */
  date?: Date;
  /**
   * Author information for this specific item
   */
  author?: {
    name: string;
    email?: string;
  };
  /**
   * Categories or tags for the item
   */
  categories?: string[];
  /** Absolute image URL (RSS 2.0 enclosure) */
  image?: string;
}

/**
 * Generates an RSS 2.0 feed from the provided configuration and items
 *
 * @param config - RSS feed configuration including title, baseUrl, and description
 * @param items - Array of items to include in the feed
 * @returns RSS 2.0 XML string
 *
 * @example
 * ```ts
 * const rss = generateRSS(
 *   {
 *     title: 'My Blog',
 *     baseUrl: 'https://example.com',
 *     description: 'Latest blog posts',
 *   },
 *   posts.map(post => ({
 *     id: post.slug,
 *     url: `/blog/${post.slug}`,
 *     title: post.title,
 *     description: post.excerpt,
 *     date: new Date(post.publishedAt),
 *   }))
 * );
 * ```
 */
export function generateRSS(config: RSSConfig, items: RSSItem[]): string {
  const feed = new Feed({
    title: config.title,
    id: config.baseUrl,
    link: config.baseUrl,
    language: config.language || 'en',
    description: config.description,
    favicon: `${config.baseUrl}/favicon.ico`,
    copyright:
      config.copyright ||
      `All rights reserved ${new Date().getFullYear()}`,
    author: config.author,
  });

  for (const item of items) {
    feed.addItem({
      id: item.id,
      title: item.title,
      description: item.description,
      link: `${config.baseUrl}${item.url}`,
      date: item.date || new Date(),
      author: item.author ? [item.author] : undefined,
      category: item.categories?.map((name) => ({ name })),
      ...(item.image ? { image: item.image } : {}),
    });
  }

  return feed.rss2();
}
