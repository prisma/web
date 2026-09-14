import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { ArrowRight } from "@/components/icons/forma";
import { siteConfig } from "@/lib/config";
import { getContentSlugs } from "@/lib/content";
import {
  type ChangelogFrontmatter,
  formatChangelogDate,
  getChangelogEntry,
  getChangelogNeighbours,
  rewriteChangelogAssets,
} from "@/lib/changelog";

type Props = {
  params: Promise<{ slug: string }>;
};

// next-mdx-remote ships no syntax highlighting of its own, so code blocks
// rendered plain `<pre><code>`. Reuse fumadocs' rehype-code (the docs app's
// pipeline: shiki, github-light/github-dark as `--shiki-*` CSS variables,
// consumed in globals.css) and fall back to plain text for fences like
// ```npm whose language shiki does not know.
const mdxOptions: NonNullable<MDXRemoteProps["options"]>["mdxOptions"] = {
  rehypePlugins: [[rehypeCode, { icon: false, tab: false, fallbackLanguage: "plaintext" }]],
};

// Components changelog MDX may use. PrismButton* are client components; RSC
// serializes the reference, so passing them straight through is fine.
const components = { PrismButton, PrismButtonOutline };

export async function generateStaticParams() {
  return getContentSlugs("changelog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) return {};
  const title = entry.frontmatter.headline ?? entry.frontmatter.title;
  const description =
    entry.frontmatter.metaDescription ??
    `${title}. New features, improvements, and fixes across Prisma ORM, Prisma Postgres, and the Prisma platform.`;
  return createPageMetadata({
    title: `${title} | Changelog`,
    description,
    path: `/changelog/${slug}`,
    ogKicker: "Changelog",
  });
}

function NeighbourLink({
  entry,
  label,
  align,
}: {
  entry: { slug: string; frontmatter: ChangelogFrontmatter };
  label: string;
  align: "start" | "end";
}) {
  return (
    <Link
      href={`/changelog/${entry.slug}`}
      className={`group flex flex-col gap-1 rounded-[1rem] border border-black/[0.08] p-5 transition-colors hover:border-black/20 ${
        align === "end" ? "text-right" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        {align === "start" && <ArrowRight className="size-4 rotate-180" aria-hidden />}
        {label}
        {align === "end" && <ArrowRight className="size-4" aria-hidden />}
      </span>
      <span className="text-balance leading-snug transition-colors group-hover:text-prism-cyan-700">
        {entry.frontmatter.headline ?? entry.frontmatter.title}
      </span>
    </Link>
  );
}

export default async function ChangelogEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) notFound();

  const { newer, older } = getChangelogNeighbours(slug);

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
          <MDXRemote
            source={rewriteChangelogAssets(entry.content)}
            components={components}
            options={{ mdxOptions }}
          />
        </div>

        {(newer || older) && (
          <nav
            aria-label="More changelog entries"
            className="mt-16 grid gap-4 border-t border-black/[0.08] pt-10 sm:grid-cols-2"
          >
            {older ? <NeighbourLink entry={older} label="Older entry" align="start" /> : <div />}
            {newer ? <NeighbourLink entry={newer} label="Newer entry" align="end" /> : null}
          </nav>
        )}
      </div>
    </article>
  );
}
