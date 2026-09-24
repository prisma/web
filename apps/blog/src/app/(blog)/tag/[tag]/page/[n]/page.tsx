import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { blog, getPageImage } from "@/lib/source";
import { BlogListing } from "@/components/BlogListing";
import { BlogListingHero } from "@/components/BlogListingHero";
import { blogTagDescription, blogTagTitle } from "@/lib/blog-metadata";
import {
  getItemsForTag,
  getListingItems,
  getListingTags,
  getTagListing,
} from "@/lib/blog-listing-data";
import {
  buildListingHref,
  getPaginationParams,
  getPageSlice,
  getTotalPages,
  parsePageParam,
} from "@/lib/blog-listing";
import { formatTag } from "@/lib/format";
import { withBlogBasePath } from "@/lib/url";

/**
 * `/blog/tag/orm/page/2` …: the rest of a tag's archive.
 *
 * Only generated for tags with more than `PAGE_SIZE` posts; a smaller tag is a
 * single page and this route 404s for it.
 */
export const revalidate = false;

interface TagPageNumberParams {
  tag: string;
  n: string;
}

function resolvePage(tag: string, n: string, totalPages: number): number {
  const page = parsePageParam(n);
  if (page === null) notFound();
  // `permanentRedirect` takes a basePath-free path; Next.js prepends /blog.
  if (page === 1) permanentRedirect(`/tag/${tag}`);
  if (page > totalPages) notFound();
  return page;
}

export default async function BlogTagArchivePage(props: { params: Promise<TagPageNumberParams> }) {
  const { tag, n } = await props.params;
  const { items, tagged } = getTagListing(tag);
  const totalPages = getTotalPages(tagged.length);
  const page = resolvePage(tag, n, totalPages);

  const { posts } = getPageSlice(tagged, page);

  return (
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 sm:px-6 lg:px-8">
      <BlogListingHero
        title={`${formatTag(tag)} posts`}
        description={blogTagDescription(tag)}
        eyebrow={`Page ${page} of ${totalPages}`}
      />
      <BlogListing
        items={posts}
        uniqueTags={getListingTags(items)}
        currentCategory={tag}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}

export function generateStaticParams(): TagPageNumberParams[] {
  const items = getListingItems();
  return getListingTags(items).flatMap((tag) =>
    getPaginationParams(getItemsForTag(items, tag).length).map(({ n }) => ({ tag, n })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TagPageNumberParams>;
}): Promise<Metadata> {
  const { tag, n } = await params;
  const { tagged } = getTagListing(tag);
  const page = resolvePage(tag, n, getTotalPages(tagged.length));

  const title = blogTagTitle(tag, page);
  const description = blogTagDescription(tag);
  const canonical = buildListingHref(tag, page);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      siteName: "Prisma",
      type: "website",
      title,
      description,
      url: canonical,
      images: withBlogBasePath(getPageImage().url),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: withBlogBasePath(getPageImage().url),
    },
  };
}

// Reference `blog` so the route is recompiled when content changes.
void blog;
