import type { Metadata } from "next";

import { getPageImage } from "@/lib/source";
import { FeaturedSeriesShelf } from "@/components/SeriesShelf";
import { BlogListing } from "@/components/BlogListing";
import { BlogListingHero } from "@/components/BlogListingHero";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import { getListingItems, getListingTags, getSeriesShelfItems } from "@/lib/blog-listing-data";
import { getPageSlice, getTotalPages } from "@/lib/blog-listing";
import { withBlogBasePath } from "@/lib/url";

/**
 * Page 1 of the blog archive, rendered entirely on the server.
 *
 * The listing used to be handed to `BlogHomeClient`, a client component that
 * read `?page=` / `?tag=` from `useSearchParams()`. Next.js renders a Suspense
 * fallback for such a component during static prerendering, so the HTML this
 * route shipped contained the hero and an empty `<div>` — no post links at all
 * (audit 3.2). Pagination was a query string, which robots.txt then disallowed.
 *
 * Now: this route serves page 1, `page/[n]` serves the rest, `tag/[tag]` serves
 * the filters, and all of them are static with real URLs.
 */
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: BLOG_HOME_TITLE,
    description: BLOG_HOME_DESCRIPTION,
    alternates: {
      canonical: withBlogBasePath("/"),
    },
    openGraph: {
      siteName: "Prisma",
      type: "website",
      title: BLOG_HOME_TITLE,
      description: BLOG_HOME_DESCRIPTION,
      url: withBlogBasePath("/"),
      images: withBlogBasePath(getPageImage().url),
    },
    twitter: {
      card: "summary_large_image",
      title: BLOG_HOME_TITLE,
      description: BLOG_HOME_DESCRIPTION,
      images: withBlogBasePath(getPageImage().url),
    },
  };
}

export default async function BlogHome() {
  const items = getListingItems();
  const uniqueTags = getListingTags(items);
  const { featured, posts } = getPageSlice(items, 1, true);

  return (
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 sm:px-6 lg:px-8">
      <BlogListingHero title="Blog" description={BLOG_HOME_DESCRIPTION} />
      <BlogListing
        items={posts}
        featuredPost={featured}
        uniqueTags={uniqueTags}
        currentPage={1}
        totalPages={getTotalPages(items.length)}
        seriesShelf={<FeaturedSeriesShelf series={getSeriesShelfItems()} />}
      />
    </main>
  );
}
