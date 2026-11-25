import { postModifiedDate } from "@/lib/post-dates";
import { pageContent } from "@prisma-docs/ui/lib/page-content";
import { formatTag, formatDate } from "@/lib/format";
import { notFound, permanentRedirect } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { blog, isDraft } from "@/lib/source";
import { PostToc, type PostTocItem } from "@/components/PostToc";

import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { BlogShare } from "@/components/BlogShare";
import { BlogCTA } from "@/components/BlogCTA";
import { AuthorAvatarGroup } from "@/components/AuthorAvatarGroup";
import { AuthorBio } from "@/components/AuthorBio";
import { getAuthorBioByName } from "@/lib/author-bios";
import { toAuthorSlug } from "@/lib/authors";
import { SeriesBanner } from "@/components/SeriesBanner";
import { SeriesMarker } from "@/components/SeriesMarker";
import { SeriesNavigation } from "@/components/SeriesNavigation";
import { KeepReading } from "@/components/KeepReading";
import { getSeriesContext } from "@/lib/series";
import { getRelatedPosts } from "@/lib/related-posts";
import { getBaseUrl, withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import { findCanonicalSlug } from "@/lib/slug-fallback";
import { containsLink, extractText, headingAnchorId } from "@/lib/heading-anchor";
import Link from "next/link";
import type { Metadata } from "next";

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
  const dateModified = postModifiedDate(page.data);

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

/**
 * Resolves a requested slug to a post, recovering mis-cased legacy links.
 *
 * A miss is not immediately a 404: if a post exists whose slug differs only in
 * case, we 308 once to the canonical URL. `permanentRedirect` takes a
 * basePath-free path — Next.js prepends `basePath` itself when it writes the
 * `Location` header (see `addPathPrefix` in
 * next/dist/server/app-render/app-render.js) — so `/${slug}` becomes
 * `/blog/${slug}` on the wire. Passing `withBlogBasePath(...)` here would
 * double the prefix.
 *
 * Called from both the page and `generateMetadata`, so the redirect wins over
 * metadata generation whichever runs first.
 */
function getPageOrRedirect(slug: string) {
  const page = blog.getPage([slug]);
  if (page) return page;

  const canonicalSlug = findCanonicalSlug(
    slug,
    blog.getPages().map((candidate) => candidate.slugs[0]),
  );
  if (canonicalSlug) permanentRedirect(`/${canonicalSlug}`);

  notFound();
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = getPageOrRedirect(params.slug);

  const content = await pageContent(page.data);
  const MDX = content.body;
  const blogPostingJsonLd = getBlogPostingJsonLd({ ...page, data: content });
  const seriesContext = getSeriesContext(page);
  // Series posts get recommendations too. `getRelatedPosts` excludes the
  // current post's own series, so "Keep reading" points outside it and the
  // series' own neighbours stay the job of `SeriesNavigation` below.
  const relatedPosts = getRelatedPosts(page, 2);
  // Reading time from the processed Markdown, at 230 words a minute.
  const wordCount = (await content.getText("processed")).split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 230));
  const tags = page.data.tags ?? [];
  // "Updated" only when it's a different day from the publish date.
  const publishedDay = page.data.date ? new Date(page.data.date).toISOString().slice(0, 10) : "";
  const updatedDay = page.data.updatedAt
    ? new Date(page.data.updatedAt).toISOString().slice(0, 10)
    : "";
  const showUpdated = Boolean(updatedDay) && updatedDay !== publishedDay;

  return (
    <div className="z-1 mx-auto w-full max-w-[88rem] px-4 pt-10 pb-8 sm:px-6 md:pt-16 lg:px-10">
      {blogPostingJsonLd ? (
        <JsonLd id="blog-posting-structured-data" data={blogPostingJsonLd} />
      ) : null}
      {/* Page width like the docs and Attio (client, 2026-11-25: "both of
          them, and our docs, use the page width much better"): up to 88rem
          with responsive gutters, so the article column grows to ~970px at
          1440 for tables, code and figures while running text keeps its
          44rem measure (global.css). */}
      {/* The post header, after Attio's article layout (client, 2026-11-25):
          the breadcrumb on its own line, then the title across the full
          width, the summary, and the byline with one date and the reading
          time, closed by a hairline. The breadcrumb
          replaces the back link and the tag pills. The summary stays: it's
          what AI answers quote. */}
      <header className="border-b border-stroke-neutral pb-10 md:pb-12">
        <div className="text-sm text-foreground-neutral-weak">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-1.5">
            {/* next/link prepends the /blog basePath, so these stay
                basePath-free. */}
            <Link
              href="/"
              className="font-medium text-foreground-neutral no-underline transition-colors duration-200 hover:text-foreground-neutral-strong motion-reduce:transition-none"
            >
              Blog
            </Link>
            {tags.length > 0 ? (
              <>
                <span aria-hidden className="text-foreground-neutral-weaker">
                  /
                </span>
                {tags.map((tag, i) => (
                  <span key={tag} className="inline-flex items-center">
                    <Link
                      href={`/tag/${tag}`}
                      className="no-underline transition-colors duration-200 hover:text-foreground-neutral-strong motion-reduce:transition-none"
                    >
                      {formatTag(tag)}
                    </Link>
                    {i < tags.length - 1 ? <span aria-hidden>,</span> : null}
                  </span>
                ))}
              </>
            ) : null}
          </nav>
        </div>

        {/* `md:type-title-4xl lg:type-title-5xl` never applied (type-title-*
            aren't variant-aware utilities), so the title was 30px at every
            width. The size is set directly, scaling 30px → 52px; `!` because
            type-title-3xl's own font-size comes later in the same layer. */}
        <h1 className="type-title-3xl mt-10 max-w-5xl text-[clamp(1.875rem,1rem+3vw,3.25rem)]! leading-[1.1]! tracking-[-0.01em] text-balance break-words text-foreground-neutral-strong md:mt-14">
          {page.data.title}
        </h1>
        {page.data.excerpt ? (
          <p className="mt-5 mb-0 max-w-[44rem] text-pretty text-lg leading-relaxed text-foreground-neutral-weak">
            {page.data.excerpt}
          </p>
        ) : null}
        {/* One date beside the author (client, 2026-11-25): "Updated" when
            the post changed after it was published, otherwise the publish
            date. The publish date stays in the tooltip and in the JSON-LD
            (datePublished), so search and AI answers still get it. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground-neutral">
          <AuthorAvatarGroup authors={page.data.authors} />
          <span className="flex flex-wrap items-center gap-x-1.5 text-foreground-neutral-weak tabular-nums">
            {showUpdated && page.data.updatedAt ? (
              <span
                title={
                  page.data.date
                    ? `Published ${formatDate(new Date(page.data.date).toISOString())}`
                    : undefined
                }
              >
                Updated{" "}
                <time dateTime={new Date(page.data.updatedAt).toISOString()}>
                  {formatDate(new Date(page.data.updatedAt).toISOString())}
                </time>
              </span>
            ) : page.data.date ? (
              <time dateTime={new Date(page.data.date).toISOString()}>
                {formatDate(new Date(page.data.date).toISOString())}
              </time>
            ) : null}
            <span aria-hidden>·</span>
            <span>{readMinutes} min read</span>
          </span>
        </div>
        {seriesContext ? <SeriesMarker series={seriesContext} /> : null}
      </header>

      {/* "On this page" in a right-hand rail, styled like the site's guides
          (PostToc), starting level with the article rather than the title.
          minmax(0,1fr), not 1fr: a bare 1fr column won't shrink below its
          widest content, so a wide table used to stretch the reading column
          to ~1,000px, push the rail off-screen and scroll the whole page
          sideways. With the floor at 0 the table scrolls inside its own
          wrapper. */}
      <div className="mt-10 gap-12 md:mt-12 md:grid md:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16 xl:gap-24">
        <div className="post-contents w-full min-w-0">
          {/* Body */}
          <article className="flex w-full min-w-0 flex-col pb-8">
            <div className="prose min-w-0 [&_figure]:w-full [&_figure]:md:max-w-140 [&_figure]:lg:max-w-200">
              <MDX
                components={getMDXComponents({
                  a: createRelativeLink(blog, page),
                  h2: (props) => {
                    const providedId =
                      typeof (props as { id?: unknown }).id === "string"
                        ? ((props as { id?: string }).id ?? "")
                        : "";
                    const final_id = providedId || headingAnchorId(props.children);
                    // A heading whose MDX contains a link cannot also be wrapped
                    // in the permalink anchor — that nests <a> inside <a>. There
                    // the link icon becomes the permalink instead.
                    const hasLink = containsLink(props.children);
                    const icon = (
                      <i className="fa-regular text-lg! fa-link shrink-0 text-fd-muted-foreground opacity-0 transition-opacity" />
                    );
                    return (
                      <h2
                        className="type-title-2xl flex scroll-m-28 flex-row items-center gap-2 hover:[&_i]:opacity-100"
                        id={final_id}
                      >
                        {hasLink ? (
                          props.children
                        ) : (
                          <a data-card href={`#${final_id}`}>
                            {props.children}
                          </a>
                        )}
                        {hasLink ? (
                          <a
                            data-card
                            href={`#${final_id}`}
                            aria-label={`Permalink to ${extractText(props.children)}`}
                          >
                            {icon}
                          </a>
                        ) : (
                          icon
                        )}
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
          ) : null}
          {/* `SeriesNavigation` closes with `my-12` and `KeepReading` opens with
            `my-16`; adjacent margins collapse, so the two blocks stack with the
            larger gap and neither needed a style change. */}
          <KeepReading posts={relatedPosts} />

          {/* Conversion CTA. A post can relabel it and point it at a tracked
            Console URL through the `cta` frontmatter field instead of adding
            a second button inside the article. */}
          <BlogCTA {...(page.data.cta ?? {})} />

          {/* Share Container */}
          <BlogShare desc={page.data.metaDescription as string} />
        </div>
        <aside className="hidden md:block">
          <nav
            aria-label="On this page"
            className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3"
          >
            <p className="mb-4 text-sm font-semibold text-foreground-neutral">On this page</p>
            <PostToc items={content.toc as PostTocItem[]} />
          </nav>
        </aside>
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
  const page = getPageOrRedirect(slug);

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
    // A draft renders at its URL for review but stays out of search results
    // until it is published; its links are still followed.
    ...(isDraft(page) && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      // The post's Markdown rendition, for agents that look for one before
      // parsing the HTML. next.config.mjs sends the same URL in a Link header.
      types: {
        "text/markdown": withBlogBasePath(`${page.url}.md`),
      },
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

export const generateStaticParams =
  process.env.COMPOSER_BUILD === "1"
    ? undefined
    : () => blog.getPages().map((page) => ({ slug: page.slugs[0] }));
