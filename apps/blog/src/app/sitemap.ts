import { postModifiedDate } from "@/lib/post-dates";
import { isCanonicalBlogPage } from "@/lib/sitemap-policy";
import type { MetadataRoute } from "next";
import { getPublishedPages } from "@/lib/source";
import { getBaseUrl, withBlogBasePath } from "@/lib/url";
import { getItemsForTag, getListingItems, getListingTags } from "@/lib/blog-listing-data";
import { buildListingHref, getTotalPages } from "@/lib/blog-listing";

export const revalidate = false;

/**
 * Listing URLs: `/blog`, every `/blog/page/N`, every `/blog/tag/X` and its own
 * pages. These are the archive's crawl path — without them a crawler reaches a
 * post only through whatever single link happens to point at it (audit 3.2).
 */
export function getListingSitemapPaths(): string[] {
  const items = getListingItems();
  const paths: string[] = [];

  for (let page = 2; page <= getTotalPages(items.length); page += 1) {
    paths.push(buildListingHref(undefined, page));
  }

  for (const tag of getListingTags(items)) {
    const total = getTotalPages(getItemsForTag(items, tag).length);
    for (let page = 1; page <= total; page += 1) {
      paths.push(buildListingHref(tag, page));
    }
  }

  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const url = (path: string): string => new URL(withBlogBasePath(path), baseUrl).toString();

  // Drafts render at their URL but are left out, as on the listing pages.
  const items = getPublishedPages()
    .filter((page) => isCanonicalBlogPage(page, baseUrl))
    .map((page) => {
      // Use the same editorial date as BlogPosting.dateModified. Never use
      // the synthetic deployment commit or the source file's archive mtime.
      const modified = postModifiedDate(page.data);

      return {
        url: url(page.url),
        lastModified: modified,
        changeFrequency: "weekly",
        priority: 0.7,
      } as MetadataRoute.Sitemap[number];
    });

  const listings = getListingSitemapPaths().map(
    (path) =>
      ({
        url: url(path),
        changeFrequency: "daily",
        priority: 0.5,
      }) as MetadataRoute.Sitemap[number],
  );

  return [
    {
      url: url("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    ...listings,
    ...items,
  ];
}
