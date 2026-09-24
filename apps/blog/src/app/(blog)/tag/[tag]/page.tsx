import type { Metadata } from "next";
import { blog, getPageImage } from "@/lib/source";
import { BlogListing } from "@/components/BlogListing";
import { BlogListingHero } from "@/components/BlogListingHero";
import { blogTagDescription, blogTagTitle } from "@/lib/blog-metadata";
import { getListingItems, getListingTags, getTagListing } from "@/lib/blog-listing-data";
import { buildListingHref, getPageSlice, getTotalPages } from "@/lib/blog-listing";
import { formatTag } from "@/lib/format";
import { withBlogBasePath } from "@/lib/url";

/**
 * `/blog/tag/orm`: page 1 of a tag's archive.
 *
 * These listings used to exist only as `?tag=` on the home page — rendered
 * after hydration and `Disallow`ed in robots.txt, so they gave the posts they
 * list no inbound links at all (audit 3.2).
 */
export const revalidate = false;

interface TagPageParams {
  tag: string;
}

export default async function BlogTagPage(props: { params: Promise<TagPageParams> }) {
  const { tag } = await props.params;
  const { items, tagged } = getTagListing(tag);
  const { posts } = getPageSlice(tagged, 1);

  return (
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 sm:px-6 lg:px-8">
      <BlogListingHero
        title={`${formatTag(tag)} posts`}
        description={blogTagDescription(tag)}
        eyebrow={`${tagged.length} ${tagged.length === 1 ? "post" : "posts"}`}
      />
      <BlogListing
        items={posts}
        uniqueTags={getListingTags(items)}
        currentCategory={tag}
        currentPage={1}
        totalPages={getTotalPages(tagged.length)}
      />
    </main>
  );
}

export function generateStaticParams(): TagPageParams[] {
  return getListingTags(getListingItems()).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TagPageParams>;
}): Promise<Metadata> {
  const { tag } = await params;
  // 404 before describing a tag that has no posts, whichever of the two runs
  // first.
  getTagListing(tag);

  const title = blogTagTitle(tag);
  const description = blogTagDescription(tag);
  const canonical = buildListingHref(tag, 1);

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
