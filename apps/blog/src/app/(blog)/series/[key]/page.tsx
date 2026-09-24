import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { blog } from "@/lib/source";
import { getSeriesPosts } from "@/lib/series";
import { getSeriesMetadata, isKnownSeriesKey, seriesRegistry } from "@/lib/series-registry";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import { BlogGrid, type BlogCardItem } from "@/components/BlogGrid";
import { BackToBlogLink } from "@/components/BackToBlogLink";
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
      updatedAt?: Date | string;
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

    let updatedAtISO: string | null = null;
    if (data.updatedAt) {
      const updatedObj = new Date(data.updatedAt);
      if (!Number.isNaN(updatedObj.getTime())) {
        updatedAtISO = updatedObj.toISOString();
      }
    }

    const authors = Array.isArray(data.authors)
      ? data.authors.filter((a): a is string => typeof a === "string")
      : [];

    return {
      url: withBlogBasePath(post.url),
      title: data.title ?? "",
      date: dateISO,
      updatedAt: updatedAtISO,
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
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <BackToBlogLink />

      <header className="mt-8 mb-12 max-w-3xl">
        <div className="type-heading-2xs mb-3 text-foreground-ppg">
          Series · {items.length} {items.length === 1 ? "part" : "parts"}
        </div>
        <h1 className="type-title-3xl md:type-title-4xl text-balance break-words hyphens-auto text-foreground-neutral-strong">
          {meta.title}
        </h1>
        {meta.description ? (
          <p className="mt-4 text-lg leading-relaxed text-foreground-neutral-weak">
            {meta.description}
          </p>
        ) : null}
        {meta.docsUrl ? (
          <a
            href={meta.docsUrl}
            className="mt-4 inline-block text-sm font-medium text-foreground-ppg transition-colors duration-300 hover:text-foreground-ppg-strong motion-reduce:transition-none"
          >
            {meta.docsLabel ?? "Read the docs"} →
          </a>
        ) : null}
        {(() => {
          const related = (meta.relatedSeries ?? []).filter(isKnownSeriesKey);
          if (related.length === 0) return null;
          return (
            <div className="mt-5 text-sm text-foreground-neutral-weak">
              Related series:{" "}
              {related.map((relKey, i) => (
                <span key={relKey}>
                  {i > 0 ? ", " : ""}
                  <Link
                    // next/link prepends the /blog basePath itself; passing
                    // withBlogBasePath() here produced /blog/blog/series/... (404).
                    href={`/series/${relKey}`}
                    className="font-medium text-foreground-neutral-strong underline decoration-prism-cyan-400/50 underline-offset-4 transition-colors duration-300 hover:decoration-prism-cyan-500 motion-reduce:transition-none"
                  >
                    {getSeriesMetadata(relKey).title}
                  </Link>
                </span>
              ))}
            </div>
          );
        })()}
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
      siteName: "Prisma",
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
