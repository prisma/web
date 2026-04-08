import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { Badge, InlineTOC, Separator } from "@prisma/eclipse";
import { formatDate, formatTag } from "@/lib/format";
import { createPageMetadata } from "@/lib/page-metadata";
import { changelogSource } from "@/lib/changelog-source";
import { getMDXComponents } from "@/mdx-components";

interface PageParams {
  slug: string[];
}

interface TOCItem {
  title: string;
  url: string;
  depth: number;
  items?: TOCItem[];
}

export default async function ReleaseNotesPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const page = changelogSource.getPage(slug);

  if (!page) notFound();

  const MDX = page.data.body;
  const description = page.data.summary ?? page.data.description;
  const tags = page.data.tags ?? [];
  const toc = (page.data.toc as TOCItem[] | undefined) ?? [];

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1 mt-12">
      <div className="w-full px-4 z-1 mx-auto md:grid md:grid-cols-[1fr_180px] mt-4 md:mt-22 gap-12 max-w-257">
        <div className="post-contents w-full">
          {/* Title + meta */}
          <header className="w-full relative">
            <Link
              href="/changelog"
              className="text-fd-primary hover:underline text-sm absolute -top-8"
            >
              ← Back to Changelog
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
              {page.data.title}
            </h1>
            <div className="text-sm flex gap-2 items-center text-foreground-neutral mb-4">
              <Badge
                color="neutral"
                label={page.data.version}
                className="border border-stroke-neutral bg-background-default text-foreground-neutral"
              />
              {page.data.date ? (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-foreground-neutral-weak">
                    {formatDate(new Date(page.data.date).toISOString())}
                  </span>
                </>
              ) : null}
            </div>
            {tags.length > 0 ? (
              <div className="filter-badge flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    color="neutral"
                    label={formatTag(tag)}
                    className="transition-colors border capitalize border-stroke-neutral-strong bg-transparent text-foreground-neutral-weak"
                  />
                ))}
              </div>
            ) : null}
          </header>

          {/* Body */}
          <article className="w-full flex flex-col pb-8 mt-12">
            <div className="prose min-w-0 [&_figure]:w-full [&_figure]:md:max-w-140 [&_figure]:lg:max-w-200">
              {description ? (
                <p className="font-semibold text-lg">{description}</p>
              ) : null}

              <MDX
                components={getMDXComponents({
                  a: createRelativeLink(changelogSource, page),
                })}
              />
            </div>
          </article>
          <Separator className="my-12" />

          {/* Share Container */}
          {/* <BlogShare desc={page.data.metaDescription as string} /> */}

          {/* Newsletter CTA */}
          {/* <div className="w-full px-8 py-12 shadow-box-low newsletter-bg rounded-square border border-background-neutral flex max-sm:flex-col wrap items-start gap-4 sm:items-center justify-between my-12">
          <FooterNewsletterForm apiUrl={newsletterApiUrl} />
        </div> */}
        </div>
        {toc.length > 0 ? (
          <div className="max-md:hidden toc">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto [&_a[data-state=inactive]]:text-foreground-neutral-weak! [&_a[data-state=active]]:text-foreground-neutral!">
              <span className="text-shadow-foreground-neutral-reverse font-semibold text-md mb-4 mt-0 block">
                On this page
              </span>
              <InlineTOC items={toc} className="px-0" />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = changelogSource.getPage(slug);

  if (!page) notFound();

  return createPageMetadata({
    title: page.data.metaTitle ?? `${page.data.title} | Prisma`,
    description:
      page.data.metaDescription ??
      page.data.summary ??
      page.data.description ??
      "Read the latest Prisma release notes.",
    path: page.url,
    ogImage: page.data.ogImage ?? "/og/og-changelog.png",
  });
}

export function generateStaticParams(): PageParams[] {
  return changelogSource.getPages().map((page) => ({
    slug: page.slugs,
  }));
}
