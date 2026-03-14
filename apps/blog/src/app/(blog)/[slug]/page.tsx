import { formatTag, formatDate } from "@/lib/format";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { blog } from "@/lib/source";
import {
  Badge,
  InlineTOC,
  Separator,
} from "@prisma/eclipse";

import { FooterNewsletterForm } from "@prisma-docs/ui/components/newsletter";
import { BlogShare } from "@/components/BlogShare";
import { AuthorAvatarGroup } from "@/components/AuthorAvatarGroup";
import {
  getBaseUrl,
  withBlogBasePath,
  withBlogBasePathForImageSrc,
} from "@/lib/url";
import Link from "next/link";
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
  };
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

function getBlogPostingJsonLd(page: ReturnType<typeof blog.getPage>): BlogPostingSchema | null {
  if (!page) return null;

  const title = (page.data.metaTitle ?? page.data.title)?.trim();
  const description = (page.data.metaDescription ?? page.data.description ?? "").trim();
  if (!title || !description) return null;

  const canonicalPath = withBlogBasePath(page.url);
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imagePath = page.data.metaImagePath ?? page.data.heroImagePath;
  const imageUrl = imagePath
    ? toAbsoluteUrl(withBlogBasePathForImageSrc(imagePath))
    : undefined;

  const authorNames = Array.isArray(page.data.authors)
    ? page.data.authors
        .filter((author): author is string => typeof author === "string")
        .map((author) => author.trim())
        .filter(Boolean)
    : [];

  const datePublished = toIsoDate(page.data.date);
  const dateModified = toIsoDate((page.data as { lastModified?: unknown }).lastModified) ?? datePublished;

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
    },
  };

  if (imageUrl) {
    jsonLd.image = {
      "@type": "ImageObject",
      url: imageUrl,
    };
  }

  if (authorNames.length === 1) {
    jsonLd.author = {
      "@type": "Person",
      name: authorNames[0],
    };
  } else if (authorNames.length > 1) {
    jsonLd.author = authorNames.map((name) => ({
      "@type": "Person" as const,
      name,
    }));
  }

  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  if (dateModified) {
    jsonLd.dateModified = dateModified;
  }

  return jsonLd;
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const MDX = page.data.body;
  const blogPostingJsonLd = getBlogPostingJsonLd(page);

  const newsletterApiUrl = withBlogBasePath("/api/newsletter");
  return (
    <div className="w-full px-4 z-1 mx-auto md:grid md:grid-cols-[1fr_180px] mt-4 md:mt-22 gap-12 max-w-257">
      {blogPostingJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostingJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <div className="post-contents w-full">
        {/* Title + meta */}
        <header className="w-full relative">
          <Link
            href="/"
            className="text-fd-primary hover:underline text-sm absolute -top-8"
          >
            ← Back to Blog
          </Link>
          <h1 className="mt-3 mb-8 font-bold max-md:text-3xl md:text-5xl   stretch-display font-sans-display text-foreground-neutral">
            {page.data.title}
          </h1>
          <div className="text-sm flex gap-2 items-center text-foreground-neutral mb-4">
            <AuthorAvatarGroup authors={page.data.authors} />
            {page.data.date ? (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-foreground-neutral-weak">
                  {formatDate(new Date(page.data.date).toISOString())}
                </span>
              </>
            ) : null}
          </div>
          {page.data.tags && page.data.tags.length > 0 && (
            <div className="filter-badge flex gap-2">
              {page.data?.tags?.map((tag) => (
                <Badge
                  key={tag}
                  color="neutral"
                  label={formatTag(tag)}
                  className="border capitalize border-stroke-neutral-strong bg-transparent text-foreground-neutral-weak"
                />
              ))}
            </div>
          )}
        </header>

        {/* Body */}
        <article className="w-full flex flex-col pb-8 mt-12">
          <div className="prose min-w-0 [&_figure]:w-full [&_figure]:md:max-w-140 [&_figure]:lg:max-w-200">

          <p className="font-semibold text-lg">{page.data.excerpt}</p>

            <MDX
              components={getMDXComponents({
                a: createRelativeLink(blog, page),
              })}
            />
          </div>
        </article>
        <Separator className="my-12" />

        {/* Share Container */}
        <BlogShare desc={page.data.metaDescription as string} />

        {/* Newsletter CTA */}
        <div className="w-full px-8 py-12 shadow-box-low newsletter-bg rounded-square border border-background-neutral flex max-sm:flex-col wrap items-start gap-4 sm:items-center justify-between my-12">
          <FooterNewsletterForm apiUrl={newsletterApiUrl} />
        </div>
      </div>
      <div className="max-md:hidden toc">
        <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto [&_a[data-state=inactive]]:text-foreground-neutral-weak! [&_a[data-state=active]]:text-foreground-neutral!">
          <span className="text-shadow-foreground-neutral-reverse font-semibold text-md mb-4 mt-0 block">
            On this page
          </span>
          <InlineTOC items={page.data.toc as TOCItem[]} className="px-0" />
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
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const title = page.data.metaTitle ?? page.data.title;
  const description = page.data.metaDescription ?? page.data.description;

  const metadataImagePath = page.data.metaImagePath ?? page.data.heroImagePath;
  const metadataImage = metadataImagePath
    ? withBlogBasePathForImageSrc(metadataImagePath)
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: withBlogBasePath(page.url),
    },
    openGraph: {
      title,
      description,
      url: withBlogBasePath(page.url),
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
