import { Suspense } from "react";
import { blog, getPageImage } from "@/lib/source";
import { BlogGrid } from "@/components/BlogGrid";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import type { Metadata } from "next";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";

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

export default function BlogHome() {
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

  const getPrimaryAuthor = (post: (typeof posts)[number]) => {
    const data = post.data as any;
    const authors = Array.isArray(data?.authors) ? data?.authors : [];
    return authors.length > 0 ? authors[0] : null;
  };


  const items = posts.map((post) => {
    const data = post.data as any;

    // Safely convert date to ISO string with validation
    let dateISO = "";
    if (data.date) {
      try {
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj.getTime())) {
          dateISO = dateObj.toISOString();
        }
      } catch (error) {
        // If date conversion fails, fall back to empty string
        dateISO = "";
      }
    }

    return {
      url: post.url,
      title: data.title as string,
      date: dateISO,
      excerpt: data.metaDescription as string,
      author: getPrimaryAuthor(post),
      imageSrc: withBlogBasePathForImageSrc(post.data.heroImagePath ?? ""),
      imageAlt: (data.heroImageAlt as string) ?? (data.title as string),
      seriesTitle: data.series?.title ?? null,
      tags: data.tags,
    };
  });
  const uniqueTags = [
    ...new Set(items.filter((item) => item.tags).flatMap((item) => item.tags)),
  ];
  
  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <h1 className="stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-sans-display">
        Blog
      </h1>
      {/* Category pills (static "Show all" to match layout) */}
      <div className="pt-6 pb-12 mt-10">
        {/* Grid with pagination */}
        <Suspense
          fallback={
            <div className="animate-pulse">
              <div className="flex justify-between items-center gap-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={`pill-${index}`}
                      className="h-8 w-20 rounded-full bg-fd-secondary border border-fd-primary/20"
                    />
                  ))}
                </div>
                <div className="h-10 w-20 md:w-52 rounded-full bg-fd-secondary border border-fd-primary/20" />
              </div>

              <div className="rounded-square border border-fd-primary/20 bg-fd-secondary h-64 md:h-80 mb-12" />

              <div className="grid gap-6 mt-12 grid-cols-1">
                {items.slice(0, 6).map((post) => (
                  <div
                    key={post.url}
                    className="h-44 border-b border-fd-primary/20 bg-fd-secondary/60"
                  />
                ))}
              </div>
            </div>
          }
        >
          <BlogGrid
            items={items}
            pageSize={12}
            uniqueTags={uniqueTags}
          />
        </Suspense>
      </div>
    </main>
  );
}
