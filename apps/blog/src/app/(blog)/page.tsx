import { Suspense } from "react";
import { blog } from "@/lib/source";
import { BlogGrid } from "@/components/BlogGrid";
import { Avatar, Badge, Card } from "@prisma-docs/eclipse";

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

  const formatDate = (value: unknown) => {
    const date =
      value instanceof Date ? value : new Date((value as string) ?? "");
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const getPrimaryAuthor = (post: (typeof posts)[number]) => {
    const data = post.data as any;
    const authors = Array.isArray(data?.authors) ? data?.authors : [];
    return authors.length > 0 ? authors[0] : null;
  };
  const getCardImageSrc = (post: (typeof posts)[number]) => {
    const data = post.data as any;
    const rel =
      (data.heroImagePath as string | undefined) ??
      (data.metaImagePath as string | undefined);
    if (rel) {
      // If frontmatter already provides an absolute path, use it directly
      if (rel.startsWith("/")) {
        return rel;
      }
      const base = post.url.startsWith("/") ? post.url : `/${post.url}`;
      const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
      const relClean = rel.replace(/^\.\//, "").replace(/^\/+/, "");
      return `${baseClean}/${relClean}`;
    }
    const absolute =
      (data.heroImageUrl as string | undefined) ??
      (data.metaImageUrl as string | undefined);
    return absolute ?? null;
  };
  const items = posts.map((post) => {
    const data = post.data as any;
    return {
      url: post.url,
      title: data.title as string,
      date: data.date ? new Date(data.date).toISOString() : "",
      description: (data.description as string) ?? "",
      author: getPrimaryAuthor(post),
      authorSrc: null,
      imageSrc: getCardImageSrc(post),
      imageAlt: (data.heroImageAlt as string) ?? (data.title as string),
      seriesTitle: data.series?.title ?? null,
      badge: "Release",
    };
  });
  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8">
      <h1 className="stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-display">
        Blog
      </h1>
      {/* Category pills (static "Show all" to match layout) */}
      <div className="pt-6 pb-12 mt-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge color="ppg" label="Show all" />
          <Badge color="neutral" label="User Story" />
          <Badge color="neutral" label="Release" />
          {/*
            {categories.map((category: string, idx: number) =>
              <Badge color={activeCat === category ? "ppg" : "neutral"} label={category} />
            )}
          */}
        </div>

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
          <a
            href={items[0].url}
            className="grid grid-cols-1 sm:grid-cols-2 rounded-square overflow-hidden border border-stroke-neutral shadow-box-low"
          >
            <img
              src={items[0].imageSrc as string}
              alt={items[0].imageAlt ?? items[0].title}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02] max-h-52 h-full w-full sm:max-h-72"
            />
            <Card className="rounded-none! border-none! gap-0">
              <div className="eyebrow flex gap-2 items-center">
                <Badge color="success" label="Release" className="w-min" />
                <span className="text-xs text-foreground-neutral-weak">
                  {formatDate(items[0].date)}
                </span>
              </div>
              <h2 className="text-2xl text-foreground-neutral font-bold font-mona-sans mt-4 mb-2">
                {items[0].title}
              </h2>
              {items[0].description && (
                <p className="text-sm text-foreground-neutral-weak">
                  {items[0].description}
                </p>
              )}
              {items[0].author && (
                <span className="mt-auto flex items-center gap-2 font-semibold text-sm">
                  {items[0]?.authorSrc && (
                    <Avatar
                      format="image"
                      src="/avatar.jpg"
                      alt="Disabled user"
                      size="lg"
                      disabled
                    />
                  )}
                  <span>{items[0].author}</span>
                </span>
              )}
            </Card>
          </a>
          <BlogGrid items={items.slice(1, -1)} pageSize={12} />
        </Suspense>
      </div>
    </main>
  );
}
