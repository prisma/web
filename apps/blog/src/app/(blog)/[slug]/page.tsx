import { formatTag, formatDate } from "@/lib/format";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { blog } from "@/lib/source";
import {
  Action,
  Avatar,
  Badge,
  Button,
  cn,
  InlineTOC,
  Input,
  Label,
  Separator,
} from "@prisma-docs/eclipse";
import { FooterNewsletterForm } from "@prisma-docs/ui/components/newsletter";
import { BlogShare } from "@/components/BlogShare";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const MDX = page.data.body;

  return (
    <div className="w-full px-4 z-1 mx-auto md:grid md:grid-cols-[1fr_180px] mt-4 md:mt-22 gap-12 max-w-257">
      <div className="post-contents w-full">
        {/* Title + meta */}
        <header className="w-full relative">
          <Link
            href="/blog"
            className="text-fd-primary hover:underline text-sm absolute -top-8"
          >
            ← Back to Blog
          </Link>
          <h1 className="mt-3 mb-8 font-bold max-md:text-3xl md:text-5xl   stretch-display font-display text-foreground-neutral">
            {page.data.title}
          </h1>
          <div className="text-sm text-fd-muted-foreground flex gap-2 items-center text-foreground-neutral mb-4">
            {page.data.authors?.length > 1 ? (
              page.data.authors.join(", ")
            ) : page.data.authors?.length === 1 ? (
              <span className="mt-auto flex items-center gap-2 font-semibold text-sm">
                {page.data?.authorSrc && (
                  <Avatar
                    format="image"
                    src={page.data.authorSrc}
                    alt={page.data.authors[0]}
                    size="lg"
                  />
                )}
                <span>{page.data.authors[0]}</span>
              </span>
            ) : null}
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
          <div className="prose min-w-0 [&_figure]:w-full! [&_figure]:md:max-w-140! [&_figure]:lg:max-w-200!">
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
          <FooterNewsletterForm />
        </div>
      </div>
      <div className="max-md:hidden toc">
        <div className="sticky top-24 [&_a[data-state=inactive]]:text-foreground-neutral-weak! [&_a[data-state=active]]:text-foreground-neutral!">
          <span className="text-shadow-foreground-neutral-reverse font-semibold text-md mb-4 mt-0 block">
            On this page
          </span>
          <InlineTOC items={page.data.toc} className="px-0" />
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
