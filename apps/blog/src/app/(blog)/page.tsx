import { blog, getPageImage } from "@/lib/source";
import { getSeriesMetadata, seriesRegistry } from "@/lib/series-registry";
import { type BlogCardItem } from "@/components/BlogGrid";
import { FeaturedSeriesShelf, type SeriesShelfItem } from "@/components/SeriesShelf";
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
  const sortedByDate = blog.getPages().sort((a, b) => {
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

  // Pinned posts are surfaced ahead of the chronological feed so the latest
  // pinned post takes the featured slot (and the top of the list) instead of
  // the most recent post by date. The date sort above is stable, so pinned
  // posts keep their newest-first order among themselves.
  const isPinned = (post: (typeof sortedByDate)[number]): boolean =>
    (post.data as { pinned?: boolean }).pinned === true;
  const posts = [...sortedByDate.filter(isPinned), ...sortedByDate.filter((p) => !isPinned(p))];

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

    let updatedAtISO: string | null = null;
    if (data.updatedAt) {
      const updatedObj = new Date(data.updatedAt);
      if (!isNaN(updatedObj.getTime())) {
        updatedAtISO = updatedObj.toISOString();
      }
    }

    const authors = getAllAuthors(post);

    return {
      url: withBlogBasePath(post.url),
      title: data.title as string,
      date: dateISO,
      updatedAt: updatedAtISO,
      excerpt: data.metaDescription as string,
      author: authors[0] ?? null,
      authors,
      imageSrc: withBlogBasePathForImageSrc(post.data.heroImagePath ?? ""),
      imageAlt: (data.heroImageAlt as string) ?? (data.title as string),
      seriesTitle: typeof data.series === "string" ? getSeriesMetadata(data.series).title : null,
      tags: data.tags,
    };
  });

  const uniqueTags = [
    ...new Set(
      items.flatMap((item) => item.tags ?? []).filter((tag): tag is string => Boolean(tag)),
    ),
  ];

  const seriesCounts = new Map<string, number>();
  for (const post of posts) {
    const seriesKey = (post.data as { series?: string }).series;
    if (typeof seriesKey === "string") {
      seriesCounts.set(seriesKey, (seriesCounts.get(seriesKey) ?? 0) + 1);
    }
  }

  const seriesItems: SeriesShelfItem[] = Object.keys(seriesRegistry)
    .map((key) => {
      const meta = getSeriesMetadata(key);
      return {
        key,
        title: meta.title,
        description: meta.description,
        featured: meta.featured ?? false,
        count: seriesCounts.get(key) ?? 0,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // Featured series keep their registry order (the first one becomes the
      // home highlight card); the rest rank by part count.
      if (a.featured && b.featured) return 0;
      return b.count - a.count;
    });

  return (
    // Site width (1400px) — the same container the rebranded marketing pages
    // use, so the blog's grid lines up with the rest of prisma.io.
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 sm:px-6 lg:px-8">
      {/* CF's centered hero: display title, one muted line on a 2xl measure,
          generous vertical rhythm before the feed starts. */}
      <header className="mx-auto max-w-2xl py-16 text-center sm:py-20">
        <h1 className="landing-h1">Blog</h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground-neutral-weak text-balance">
          {BLOG_HOME_DESCRIPTION}
        </p>
      </header>
      {/*
       * Suspense is required here because BlogHomeClient uses useSearchParams().
       * During static pre-rendering Next.js renders the fallback; after hydration
       * the client component takes over and applies URL-driven filtering instantly
       * since all post data is already present in the RSC payload.
       */}
      <Suspense fallback={<div className="min-h-96 pb-20" />}>
        <BlogHomeClient
          items={items}
          uniqueTags={uniqueTags}
          seriesShelf={<FeaturedSeriesShelf series={seriesItems} />}
        />
      </Suspense>
    </main>
  );
}
