import { getPageImage, source } from "@/lib/source";
import { withDocsBasePath } from "@/lib/urls";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  PageLastUpdate,
} from "@/components/layout/notebook/page";
import {
  TechArticleSchema,
  BreadcrumbSchema,
} from "@/components/structured-data";

interface PageParams {
  slug?: string[];
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <>
      <TechArticleSchema page={page} />
      <BreadcrumbSchema page={page} />
      <DocsPage
        tableOfContent={{
          style: "normal",
        }}
        toc={page.data.toc}
        full={page.data.full}
      >
        <div className="flex flex-col md:flex-row items-start gap-4 pt-2 pb-1 md:justify-between">
          <DocsTitle>{page.data.title}</DocsTitle>
          <div className="flex flex-row gap-2 items-center">
            {!page.url.startsWith("/management-api/endpoints") && (
              <LLMCopyButton markdownUrl={`${withDocsBasePath(page.url)}.mdx`} />
            )}

            <ViewOptions
              markdownUrl={`${page.url}.mdx`}
              githubUrl={`https://github.com/prisma/docs/blob/main/apps/docs/content/docs/${page.path}`}
            />
          </div>
        </div>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm">
          <EditOnGitHub
            href={`https://github.com/prisma/docs/edit/main/apps/docs/content/docs/${page.path}`}
          />
          {(page.data as { lastModified?: Date }).lastModified && (
            <PageLastUpdate
              date={(page.data as { lastModified: Date }).lastModified}
            />
          )}
        </div>
      </DocsPage>
    </>
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

  const title = page.data.metaTitle ?? page.data.title;
  const description = page.data.metaDescription ?? page.data.description;

  return {
    title,
    description,
    alternates: {
      canonical: withDocsBasePath(page.url),
    },
    openGraph: {
      title,
      description,
      url: withDocsBasePath(page.url),
      images: page.data.image || withDocsBasePath(getPageImage(page).url),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
