import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { withHandbookBasePath } from "@/lib/url";
import { ChapterMeta } from "@/components/handbook/chapter-meta";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";

interface PageParams {
  slug?: string[];
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const { status, readingTime, lastModified } = page.data;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} tableOfContent={{ style: "clerk" }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <ChapterMeta status={status} readingTime={readingTime} lastModified={lastModified} />
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  // The root layout's template appends "| Builders Handbook"; the landing
  // page IS the handbook, so it takes the bare name.
  const isIndex = !slug || slug.length === 0;

  return {
    title: isIndex ? { absolute: page.data.title } : page.data.title,
    description: page.data.description,
    alternates: { canonical: withHandbookBasePath(page.url) },
    openGraph: {
      siteName: "Prisma",
      title: page.data.title,
      description: page.data.description,
      url: withHandbookBasePath(page.url),
    },
  };
}
