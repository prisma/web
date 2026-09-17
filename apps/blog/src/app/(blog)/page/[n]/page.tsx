import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { blog, getPageImage } from "@/lib/source";
import { BlogListing } from "@/components/BlogListing";
import { BlogListingHero } from "@/components/BlogListingHero";
import { BLOG_HOME_DESCRIPTION, blogPageTitle } from "@/lib/blog-metadata";
import { getListingItems, getListingTags } from "@/lib/blog-listing-data";
import {
  buildListingHref,
  getPaginationParams,
  getPageSlice,
  getTotalPages,
  parsePageParam,
} from "@/lib/blog-listing";
import { withBlogBasePath } from "@/lib/url";

/**
 * `/blog/page/2` … `/blog/page/N`: the rest of the archive, one static route
 * per page.
 *
 * Every page after the first lives at its own URL with its own canonical, so a
 * crawler can walk from `/blog` to the oldest post without JavaScript. Page 1
 * is `/blog` itself; `/blog/page/1` 308s there rather than serving the same
 * cards under a second URL.
 */
export const revalidate = false;

interface PageParams {
  n: string;
}

/**
 * Resolves the `[n]` segment to a page number, or leaves the request.
 *
 * `permanentRedirect` takes a basePath-free path — Next.js prepends `basePath`
 * itself when it writes the `Location` header — so `/` becomes `/blog`.
 */
function resolvePage(n: string, totalPages: number): number {
  const page = parsePageParam(n);
  if (page === null) notFound();
  if (page === 1) permanentRedirect("/");
  if (page > totalPages) notFound();
  return page;
}

export default async function BlogArchivePage(props: { params: Promise<PageParams> }) {
  const { n } = await props.params;
  const items = getListingItems();
  const totalPages = getTotalPages(items.length);
  const page = resolvePage(n, totalPages);

  const { posts } = getPageSlice(items, page);

  return (
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 sm:px-6 lg:px-8">
      <BlogListingHero
        title="Blog"
        description={BLOG_HOME_DESCRIPTION}
        eyebrow={`Page ${page} of ${totalPages}`}
      />
      <BlogListing
        items={posts}
        uniqueTags={getListingTags(items)}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}

export function generateStaticParams(): PageParams[] {
  return getPaginationParams(getListingItems().length);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { n } = await params;
  const items = getListingItems();
  const page = resolvePage(n, getTotalPages(items.length));

  const title = blogPageTitle(page);
  // Self-canonical: these pages are the archive's crawl path, so each one must
  // be indexable in its own right rather than pointing back at /blog.
  const canonical = buildListingHref(undefined, page);

  return {
    title,
    description: BLOG_HOME_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      siteName: "Prisma",
      type: "website",
      title,
      description: BLOG_HOME_DESCRIPTION,
      url: canonical,
      images: withBlogBasePath(getPageImage().url),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: BLOG_HOME_DESCRIPTION,
      images: withBlogBasePath(getPageImage().url),
    },
  };
}

// Reference `blog` so the route is recompiled when content changes.
void blog;
