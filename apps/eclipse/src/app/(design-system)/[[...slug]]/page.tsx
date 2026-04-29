import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "@/components/layout/notebook/page";

interface PageParams {
  slug?: string[];
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      tableOfContent={{
        style: "normal",
      }}
      toc={page.data.toc}
      full={page.data.full}
    >
      <div className="flex flex-col md:flex-row items-start gap-4 pt-2 pb-6 md:justify-between">
        <DocsTitle>{page.data.title}</DocsTitle>
      </div>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source as any, page),
          })}
        />
      </DocsBody>
      <div className="flex flex-row flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm">
        {(page.data as { lastModified?: Date }).lastModified && (
          <PageLastUpdate date={(page.data as { lastModified: Date }).lastModified} />
        )}
      </div>
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

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {},
  };
}
