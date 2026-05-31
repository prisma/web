import type { Metadata } from "next";
import Link from "next/link";

import { blog } from "@/lib/source";
import { getSeriesMetadata, seriesRegistry } from "@/lib/series-registry";
import { withBlogBasePath } from "@/lib/url";
import { SeriesIndexGrid, type SeriesShelfItem } from "@/components/SeriesShelf";
import { BLOG_HOME_TITLE } from "@/lib/blog-metadata";

export const revalidate = false;

const PAGE_TITLE = "Series";
const PAGE_DESCRIPTION = "Multi-part series from the Prisma blog. Explore a topic end to end.";

export async function generateMetadata(): Promise<Metadata> {
  const title = `${PAGE_TITLE} — ${BLOG_HOME_TITLE}`;
  return {
    title,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: withBlogBasePath("/series") },
    openGraph: {
      type: "website",
      title,
      description: PAGE_DESCRIPTION,
      url: withBlogBasePath("/series"),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: PAGE_DESCRIPTION,
    },
  };
}

export default function SeriesIndexPage() {
  const seriesCounts = new Map<string, number>();
  for (const post of blog.getPages()) {
    const seriesKey = (post.data as { series?: string }).series;
    if (typeof seriesKey === "string") {
      seriesCounts.set(seriesKey, (seriesCounts.get(seriesKey) ?? 0) + 1);
    }
  }

  const items: SeriesShelfItem[] = Object.keys(seriesRegistry)
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
      return b.count - a.count;
    });

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <Link href="/" className="text-fd-primary hover:underline text-sm">
        ← Back to Blog
      </Link>
      <header className="mt-6 mb-10">
        <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak font-semibold mb-2">
          {items.length} {items.length === 1 ? "series" : "series"}
        </div>
        <h1 className="type-title-3xl md:type-title-4xl text-foreground-neutral">{PAGE_TITLE}</h1>
        <p className="mt-3 text-foreground-neutral-weak">{PAGE_DESCRIPTION}</p>
      </header>

      <SeriesIndexGrid series={items} />
    </main>
  );
}
