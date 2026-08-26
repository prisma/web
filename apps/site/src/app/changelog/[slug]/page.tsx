import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRight } from "@/components/icons/forma";
import { siteConfig } from "@/lib/config";
import { getContentSlugs } from "@/lib/content";
import { formatChangelogDate, getChangelogEntry, rewriteChangelogAssets } from "@/lib/changelog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getContentSlugs("changelog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) return {};
  const title = entry.frontmatter.headline ?? entry.frontmatter.title;
  const description = entry.frontmatter.metaDescription;
  return createPageMetadata({
    title: `${title} | Changelog`,
    description: description ?? "",
    path: `/changelog/${slug}`,
    ogKicker: "Changelog",
  });
}

export default async function ChangelogEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) notFound();

  return (
    <article className="bg-white px-4 pb-24 pt-32 sm:px-8 sm:pb-32 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/changelog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4 rotate-180" aria-hidden />
          All changelog entries
        </Link>

        <time
          dateTime={entry.frontmatter.date}
          className="mt-8 block text-sm font-semibold text-foreground/60"
        >
          {formatChangelogDate(entry.frontmatter.date)}
        </time>
        <h1 className="mt-3 text-balance text-3xl leading-[1.1] sm:text-4xl">
          {entry.frontmatter.headline ?? entry.frontmatter.title}
        </h1>

        <div className="prose mt-10 max-w-none prose-headings:font-heading prose-a:text-prism-cyan-700 prose-img:rounded-xl prose-img:border prose-img:border-black/[0.06]">
          <MDXRemote source={rewriteChangelogAssets(entry.content)} />
        </div>
      </div>
    </article>
  );
}
