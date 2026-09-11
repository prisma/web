import { getPageImage, source } from "@/lib/source";
import { getPageTitleText } from "@/lib/page-title";
import { withDocsBasePath } from "@/lib/urls";
import { resolveCanonicalUrl } from "@/lib/canonical";
import {
  getPageVersion,
  withVersionDescription,
  withVersionTitle,
} from "@/lib/version-metadata";
import { Badge } from "@prisma/eclipse";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { CopyPromptButton, LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { getPromptContent } from "@/lib/get-prompt-content";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  PageLastUpdate,
} from "@/components/layout/notebook/page";
import { TechArticleSchema, BreadcrumbSchema } from "@/components/structured-data";

interface PageParams {
  slug?: string[];
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const aiPromptSlug = (page.data as { aiPrompt?: string }).aiPrompt;
  const promptContent = aiPromptSlug ? await getPromptContent(aiPromptSlug) : null;
  const hideSidebar = (page.data as { hideSidebar?: boolean }).hideSidebar;
  const pageVersion = getPageVersion(page.url);

  return (
    <>
      {hideSidebar && (
        // Server-rendered so the sidebar never flashes in. Desktop-only: the
        // mobile drawer stays available behind the hamburger. Pages remain in
        // nav, search, sitemap, and llms.txt.
        <style>{`@media (min-width: 768px){
#nd-notebook-layout{--fd-sidebar-col:0px !important}
#nd-sidebar,#nd-notebook-layout div:has(> #nd-sidebar){display:none !important}
}`}</style>
      )}
      {/* The hidden llms.txt directive for AI agents lives in the root layout
          (src/app/layout.tsx) as the first child of <body> — agent-readiness
          audits require it near the top of the HTML, before the sidebar. */}
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
          <div className="flex flex-row flex-wrap items-center gap-3">
            <DocsTitle>{page.data.title}</DocsTitle>
            {/* Versioned trees (`/orm/v6`, `/cli/v7`, ...) repeat the title of
                their twin in every other tree, so the page carries the version
                as a visible signal next to — never inside — the <h1>. */}
            {pageVersion && (
              <Badge
                color="neutral"
                label={pageVersion.label}
                size="md"
                // `rounded-full!`: the eclipse badge ships `rounded-square`,
                // which tailwind-merge cannot collapse without the important
                // flag. Same pattern as the sidebar badges.
                className="shrink-0 rounded-full!"
                data-markdown-ignore
              />
            )}
          </div>
          <div className="flex flex-row gap-2 items-center" data-markdown-ignore>
            {promptContent && <CopyPromptButton fullPrompt={promptContent.fullPrompt} />}
            {!page.url.startsWith("/rest-api/endpoints") && (
              <LLMCopyButton markdownUrl={`${withDocsBasePath(page.url)}.mdx`} />
            )}

            <ViewOptions
              markdownUrl={`${withDocsBasePath(page.url)}.mdx`}
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
        <div
          className="flex flex-row flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm"
          data-markdown-ignore
        >
          <EditOnGitHub
            href={`https://github.com/prisma/docs/edit/main/apps/docs/content/docs/${page.path}`}
          />
          {(page.data as { lastModified?: Date }).lastModified && (
            <PageLastUpdate date={(page.data as { lastModified: Date }).lastModified} />
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

  // Versioned pages share their frontmatter title and description with their
  // twin in every other version tree, so the version is folded into both. The
  // `| Prisma Documentation` template lives in the root layout and is untouched.
  const pageVersion = getPageVersion(page.url);
  const title = withVersionTitle(
    page.data.metaTitle ?? getPageTitleText(page.data.title, page.url),
    pageVersion,
  );
  const description = withVersionDescription(
    page.data.metaDescription ?? page.data.description,
    pageVersion,
  );
  const noindex = (page.data as { noindex?: boolean }).noindex;
  const canonical = resolveCanonicalUrl(page.url, (page.data as { canonical?: string }).canonical);

  return {
    title,
    description,
    ...(noindex && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
    },
    openGraph: {
      siteName: "Prisma",
      title,
      description,
      url: withDocsBasePath(page.url),
      images: withDocsBasePath(page.data.image ?? getPageImage(page).url),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
