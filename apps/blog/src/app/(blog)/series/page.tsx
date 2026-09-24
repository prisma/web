import type { Metadata } from "next";

import { blog } from "@/lib/source";
import { getSeriesMetadata, seriesRegistry } from "@/lib/series-registry";
import { withBlogBasePath } from "@/lib/url";
import { SeriesIndexGrid, type SeriesShelfItem } from "@/components/SeriesShelf";
import { BackToBlogLink } from "@/components/BackToBlogLink";
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
      siteName: "Prisma",
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
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <BackToBlogLink />
      <header className="mt-8 mb-12 max-w-2xl">
        <div className="type-heading-2xs mb-3 text-foreground-neutral-weak">
          {items.length} {items.length === 1 ? "series" : "series"}
        </div>
        <h1 className="type-title-3xl md:type-title-4xl text-foreground-neutral-strong">
          {PAGE_TITLE}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground-neutral-weak">
          {PAGE_DESCRIPTION}
        </p>
      </header>

      <SeriesIndexGrid series={items} />
    </main>
  );
}
