import { Suspense } from "react";
import { blog } from "@/lib/source";
import { BlogGrid } from "@/components/BlogGrid";
import { Avatar, Badge, Card } from "@prisma-docs/eclipse";
import { getCardImageSrc } from "@/lib/source";
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
      description:
        (data.description as string) || (data.metaDescription as string) || "",
      author: getPrimaryAuthor(post),
      authorSrc: null,
      imageSrc: getCardImageSrc(post),
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
      <h1 className="stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-display">
        Blog
      </h1>
      {/* Category pills (static "Show all" to match layout) */}
      <div className="pt-6 pb-12 mt-10">
        {/* Grid with pagination */}
        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 12).map((post) => (
                <div
                  key={post.url}
                  className="rounded-2xl border border-fd-primary/20 bg-fd-secondary animate-pulse h-64"
                />
              ))}
            </div>
          }
        >
          <BlogGrid
            items={items.slice(1, -1)}
            pageSize={12}
            uniqueTags={uniqueTags}
          />
        </Suspense>
      </div>
    </main>
  );
}
