import React from "react";
import { formatTag, formatDate } from "@/lib/format";
import { notFound, permanentRedirect } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { blog } from "@/lib/source";
import { InlineTOC, Separator } from "@prisma/eclipse";

import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { BlogShare } from "@/components/BlogShare";
import { GooglePreferredSourceCallout } from "@prisma-docs/ui/components/google-preferred-source";
import { BlogCTA } from "@/components/BlogCTA";
import { AuthorAvatarGroup } from "@/components/AuthorAvatarGroup";
import { AuthorBio } from "@/components/AuthorBio";
import { getAuthorBioByName } from "@/lib/author-bios";
import { toAuthorSlug } from "@/lib/authors";
import { SeriesBanner } from "@/components/SeriesBanner";
import { SeriesMarker } from "@/components/SeriesMarker";
import { SeriesNavigation } from "@/components/SeriesNavigation";
import { KeepReading } from "@/components/KeepReading";
import { BackToBlogLink } from "@/components/BackToBlogLink";
import { getSeriesContext } from "@/lib/series";
import { getRelatedPosts } from "@/lib/related-posts";
import { getBaseUrl, withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import Link from "next/link";
import { Text } from "lucide-react";
import type { Metadata } from "next";

interface TOCItem {
  title: string;
  url: string;
  depth: number;
  items?: TOCItem[];
}

interface PageParams {
  slug: string;
}

interface PersonSchema {
  "@type": "Person";
  name: string;
  url?: string;
  description?: string;
  sameAs?: string[];
}

interface ImageObjectSchema {
  "@type": "ImageObject";
  url: string;
}

interface BlogPostingSchema {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  mainEntityOfPage: string;
  url: string;
  image?: string | ImageObjectSchema;
  author?: PersonSchema | PersonSchema[];
  datePublished?: string;
  dateModified?: string;
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
}

/**
 * Resolves a post for a requested slug, tolerating case differences.
 *
 * Legacy slugs carry a mixed-case suffix (`...-7D056s1s0k3l`) and lowercased
 * copies still arrive from old links and search results. Rather than a
 * per-slug redirect in `next.config.mjs` — Next.js matches redirect sources
 * case-insensitively, so `source` and `destination` differing only in case is
 * an infinite loop — resolve the canonical slug here and issue a single 308.
 *
 * Returns the page when the slug is already canonical. Otherwise it either
 * redirects (throws) to the canonical URL or 404s; it never returns null.
 */
function getPostOrRedirect(slug: string): NonNullable<ReturnType<typeof blog.getPage>> {
  const page = blog.getPage([slug]);
  if (page) return page;

  const lowered = slug.toLowerCase();
  const canonical = blog.getPages().find((candidate) => {
    const first = candidate.slugs[0];
    return candidate.slugs.length === 1 && typeof first === "string" && first.toLowerCase() === lowered;
  });

  // `permanentRedirect` throws, so control never falls through.
  if (canonical) permanentRedirect(`/${canonical.slugs[0]}`);

  notFound();
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

function toAbsoluteUrl(pathOrUrl: string): string {
  if (isAbsoluteUrl(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, getBaseUrl()).toString();
}

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function buildAuthorSchema(name: string): PersonSchema {
  const author: PersonSchema = { "@type": "Person", name };
  const slug = toAuthorSlug(name);
  const bio = getAuthorBioByName(name);
  if (slug) author.url = toAbsoluteUrl(withBlogBasePath(`/author/${slug}`));
  if (bio) {
    author.description = bio.bio;
    if (bio.socials.length > 0) author.sameAs = bio.socials.map((s) => s.url);
  }
  return author;
}

function getBlogPostingJsonLd(page: ReturnType<typeof blog.getPage>): BlogPostingSchema | null {
  if (!page) return null;

  const title = (page.data.metaTitle ?? page.data.title)?.trim();
  const description = (page.data.metaDescription ?? page.data.description ?? "").trim();
  if (!title || !description) return null;

  // Matches the canonical link tag: a cross-posted article points at the
  // original rather than at this copy.
  const canonicalUrl = page.data.canonicalUrl ?? toAbsoluteUrl(withBlogBasePath(page.url));
  const imagePath = page.data.metaImagePath ?? page.data.heroImagePath;
  const imageUrl = imagePath ? toAbsoluteUrl(withBlogBasePathForImageSrc(imagePath)) : undefined;

  const authorNames = Array.isArray(page.data.authors)
    ? page.data.authors
        .filter((author): author is string => typeof author === "string")
        .map((author) => author.trim())
        .filter(Boolean)
    : [];

  const datePublished = toIsoDate(page.data.date);
  const dateModified =
    toIsoDate(page.data.updatedAt) ??
    toIsoDate((page.data as { lastModified?: unknown }).lastModified) ??
    datePublished;

  const jsonLd: BlogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Prisma",
      logo: {
        "@type": "ImageObject",
        url: "https://www.prisma.io/images/logo.svg",
      },
    },
  };

  if (imageUrl) {
    jsonLd.image = {
      "@type": "ImageObject",
      url: imageUrl,
    };
  }

  if (authorNames.length === 1) {
    jsonLd.author = buildAuthorSchema(authorNames[0]);
  } else if (authorNames.length > 1) {
    jsonLd.author = authorNames.map(buildAuthorSchema);
  }

  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  if (dateModified) {
    jsonLd.dateModified = dateModified;
  }

  return jsonLd;
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node))
    return extractText((node.props as { children?: React.ReactNode }).children);
  return "";
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = getPostOrRedirect(params.slug);

  const MDX = page.data.body;
  const blogPostingJsonLd = getBlogPostingJsonLd(page);
  const seriesContext = getSeriesContext(page);
  const relatedPosts = seriesContext ? [] : getRelatedPosts(page, 2);

  return (
    <div className="z-1 mx-auto w-full max-w-257 gap-12 px-4 pt-10 pb-8 md:grid md:grid-cols-[1fr_180px] md:pt-20">
      {blogPostingJsonLd ? (
        <JsonLd id="blog-posting-structured-data" data={blogPostingJsonLd} />
      ) : null}
      <div className="post-contents w-full">
        {/* Title + meta — CF's post header: back link, display title, muted
            dek, then the byline row. */}
        <header className="w-full">
          <BackToBlogLink className="mb-8" />
          <h1 className="type-title-3xl md:type-title-4xl lg:type-title-5xl text-balance break-words hyphens-auto text-foreground-neutral-strong">
            {page.data.title}
          </h1>
          {page.data.excerpt ? (
            <p className="mt-5 text-lg leading-relaxed text-foreground-neutral-weak">
              {page.data.excerpt}
            </p>
          ) : null}
          <div className="mt-8 mb-4 flex flex-wrap items-center gap-2 text-sm text-foreground-neutral">
            <AuthorAvatarGroup authors={page.data.authors} />
            {page.data.date ? (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-foreground-neutral-weak">
                  {formatDate(new Date(page.data.date).toISOString())}
                </span>
              </>
            ) : null}
            {page.data.updatedAt ? (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-foreground-neutral-weak">
                  Updated {formatDate(new Date(page.data.updatedAt).toISOString())}
                </span>
              </>
            ) : null}
          </div>
          {page.data.tags && page.data.tags.length > 0 && (
            // Same ghost pill as the home page's category chips, so a tag reads
            // identically wherever it appears. Hover is the docs shell's accent
            // wash (`fd-accent` = cyan-100 light / cyan-950 dark) rather than a
            // grey tint, so pointing at a pill answers in the brand hue.
            <div className="filter-badge flex flex-wrap gap-2">
              {page.data?.tags?.map((tag) => (
                <Link
                  href={{ pathname: "/", query: { tag } }}
                  key={tag}
                  className="inline-flex items-center rounded-circle border border-stroke-neutral px-3 py-1 text-xs font-medium capitalize text-foreground-neutral-weak transition-colors duration-300 hover:border-stroke-ppg-weak hover:bg-fd-accent hover:text-fd-accent-foreground motion-reduce:transition-none"
                >
                  {formatTag(tag)}
                </Link>
              ))}
            </div>
          )}
          {seriesContext ? <SeriesMarker series={seriesContext} /> : null}
        </header>

        {/* Body */}
        <article className="mt-12 flex w-full flex-col pb-8">
          <div className="prose min-w-0 [&_figure]:w-full [&_figure]:md:max-w-140 [&_figure]:lg:max-w-200">
            <MDX
              components={getMDXComponents({
                a: createRelativeLink(blog, page),
                h2: (props) => {
                  const providedId =
                    typeof (props as { id?: unknown }).id === "string"
                      ? ((props as { id?: string }).id ?? "")
                      : "";
                  const final_id =
                    providedId ||
                    extractText(props.children)
                      .trim()
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");
                  return (
                    <h2
                      className="type-title-2xl flex scroll-m-28 flex-row items-center gap-2 hover:[&>i]:opacity-100"
                      id={final_id}
                    >
                      <a data-card href={`#${final_id}`}>
                        {props.children}
                      </a>
                      <i className="fa-regular text-lg! fa-link shrink-0 text-fd-muted-foreground opacity-0 transition-opacity" />
                    </h2>
                  );
                },
              })}
            />
          </div>
        </article>

        {/* About the author(s) — placed at the end of the post so readers reach
            the author credentials right after finishing the article. */}
        <AuthorBio authors={page.data.authors} />

        {seriesContext ? (
          <>
            <SeriesBanner series={seriesContext} />
            <SeriesNavigation series={seriesContext} />
          </>
        ) : (
          <KeepReading posts={relatedPosts} />
        )}

        {/* Conversion CTA */}
        <BlogCTA />

        {/* Share Container */}
        <BlogShare desc={page.data.metaDescription as string} />

        {/* Google Preferred Sources — readers who finish a post are the most likely to opt in */}
        <GooglePreferredSourceCallout className="mt-12" />
      </div>
      <div className="toc max-md:hidden">
        {/* InlineTOC ships the docs shell's own treatment — cool-spectrum
            gradient text on the active item plus the vertical spectrum thumb
            on the rail, and the docs sidebar's spectrum hover on the rest —
            via the shared classes in eclipse globals.css. No overrides, so
            the blog TOC reads exactly like the docs TOC in both modes. */}
        <div className="fd-scroll-container sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h3 className="mt-0 mb-3 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
            <Text className="size-4" />
            On this page
          </h3>
          <InlineTOC items={page.data.toc as TOCItem[]} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPostOrRedirect(slug);

  const title = page.data.metaTitle ?? page.data.title;
  const description = page.data.metaDescription ?? page.data.description;

  const metadataImagePath = page.data.metaImagePath ?? page.data.heroImagePath;
  const metadataImage = metadataImagePath
    ? withBlogBasePathForImageSrc(metadataImagePath)
    : undefined;

  // Cross-posted articles credit the original, so search engines index that
  // copy rather than treating this one as a duplicate.
  const canonical = page.data.canonicalUrl ?? withBlogBasePath(page.url);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      siteName: "Prisma",
      title,
      description,
      url: canonical,
      images: metadataImage ? [metadataImage] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: metadataImage ? [metadataImage] : undefined,
    },
  };
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
