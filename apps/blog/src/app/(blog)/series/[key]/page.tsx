import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { blog } from "@/lib/source";
import { getSeriesPosts } from "@/lib/series";
import { getSeriesMetadata, isKnownSeriesKey, seriesRegistry } from "@/lib/series-registry";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import { BlogGrid, type BlogCardItem } from "@/components/BlogGrid";
import { BLOG_HOME_TITLE } from "@/lib/blog-metadata";

export const revalidate = false;

interface SeriesPageParams {
  key: string;
}

function buildCardItems(seriesKey: string): BlogCardItem[] {
  const posts = getSeriesPosts(seriesKey);
  return posts.map((post) => {
    const data = post.data as {
      title?: string;
      date?: Date | string;
      metaDescription?: string;
      authors?: string[];
      heroImagePath?: string;
      heroImageAlt?: string;
      tags?: string[];
    };

    let dateISO = "";
    if (data.date) {
      const dateObj = new Date(data.date);
      if (!Number.isNaN(dateObj.getTime())) {
        dateISO = dateObj.toISOString();
      }
    }

    const authors = Array.isArray(data.authors)
      ? data.authors.filter((a): a is string => typeof a === "string")
      : [];

    return {
      url: withBlogBasePath(post.url),
      title: data.title ?? "",
      date: dateISO,
      excerpt: data.metaDescription,
      author: authors[0] ?? null,
      authors,
      imageSrc: withBlogBasePathForImageSrc(data.heroImagePath ?? ""),
      imageAlt: data.heroImageAlt ?? data.title ?? "",
      tags: data.tags,
    };
  });
}

export default async function SeriesPage(props: { params: Promise<SeriesPageParams> }) {
  const { key } = await props.params;
  if (!isKnownSeriesKey(key)) notFound();

  const meta = getSeriesMetadata(key);
  const items = buildCardItems(key);

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <Link href="/" className="text-fd-primary hover:underline text-sm">
        ← Back to Blog
      </Link>

      <header className="mt-6 mb-10">
        <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak font-semibold mb-2">
          Series · {items.length} {items.length === 1 ? "part" : "parts"}
        </div>
        <h1 className="type-title-3xl md:type-title-4xl text-foreground-neutral break-words hyphens-auto">
          {meta.title}
        </h1>
        {meta.description ? (
          <p className="mt-3 text-foreground-neutral-weak">{meta.description}</p>
        ) : null}
      </header>

      <BlogGrid items={items} currentCategory="show-all" />
    </main>
  );
}

export function generateStaticParams(): SeriesPageParams[] {
  return Object.keys(seriesRegistry).map((key) => ({ key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SeriesPageParams>;
}): Promise<Metadata> {
  const { key } = await params;
  if (!isKnownSeriesKey(key)) return {};

  const meta = getSeriesMetadata(key);
  const title = `${meta.title} — ${BLOG_HOME_TITLE}`;
  const description = meta.description;

  return {
    title,
    description,
    alternates: { canonical: withBlogBasePath(`/series/${key}`) },
    openGraph: {
      type: "website",
      title,
      description,
      url: withBlogBasePath(`/series/${key}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Reference `blog` so the route is recompiled when content changes.
void blog;
