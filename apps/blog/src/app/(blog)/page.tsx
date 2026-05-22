import { blog, getPageImage } from "@/lib/source";
import { type BlogCardItem } from "@/components/BlogGrid";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import type { Metadata } from "next";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import { Suspense } from "react";
import { BlogHomeClient } from "@/components/BlogHomeClient";

/**
 * Opt into full static rendering for this route.
 *
 * Previously, the page accepted `searchParams` as a Server Component prop which
 * forced Next.js into dynamic rendering and emitted:
 *   Cache-Control: private, no-cache, no-store
 *
 * By removing `searchParams` from this component and delegating URL-based
 * filtering/pagination to the `BlogHomeClient` client component (which reads
 * `useSearchParams()` after hydration), the page is now statically rendered and
 * receives proper public cache headers from Next.js / Vercel's edge network.
 *
 * All post data is passed as props so the RSC payload ships the full dataset —
 * no extra network round-trip is needed during client hydration.
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
  const posts = blog.getPages().sort((a, b) => {
    const aTime =
      a.data.date instanceof Date
        ? a.data.date.getTime()
        : new Date((a.data.date as unknown as string) ?? "").getTime();
    const bTime =
      b.data.date instanceof Date
        ? b.data.date.getTime()
        : new Date((b.data.date as unknown as string) ?? "").getTime();
    return bTime - aTime;
  });

  const getAllAuthors = (post: (typeof posts)[number]): string[] => {
    const data = post.data as any;
    const authors = Array.isArray(data?.authors) ? data.authors : [];
    return authors.filter((name: unknown): name is string => typeof name === "string");
  };

  const items: BlogCardItem[] = posts.map((post) => {
    const data = post.data as any;

    let dateISO = "";
    if (data.date) {
      try {
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj.getTime())) {
          dateISO = dateObj.toISOString();
        }
      } catch {
        dateISO = "";
      }
    }

    const authors = getAllAuthors(post);

    return {
      url: withBlogBasePath(post.url),
      title: data.title as string,
      date: dateISO,
      excerpt: data.metaDescription as string,
      author: authors[0] ?? null,
      authors,
      imageSrc: withBlogBasePathForImageSrc(post.data.heroImagePath ?? ""),
      imageAlt: (data.heroImageAlt as string) ?? (data.title as string),
      seriesTitle: data.series?.title ?? null,
      tags: data.tags,
    };
  });

  const uniqueTags = [
    ...new Set(
      items
        .flatMap((item) => item.tags ?? [])
        .filter((tag): tag is string => Boolean(tag)),
    ),
  ];

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <h1 className="stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-sans-display">
        Blog
      </h1>
      {/*
       * Suspense is required here because BlogHomeClient uses useSearchParams().
       * During static pre-rendering Next.js renders the fallback; after hydration
       * the client component takes over and applies URL-driven filtering instantly
       * since all post data is already present in the RSC payload.
       */}
      <Suspense fallback={<div className="pt-6 pb-12 mt-10 min-h-96" />}>
        <BlogHomeClient items={items} uniqueTags={uniqueTags} />
      </Suspense>
    </main>
  );
}
