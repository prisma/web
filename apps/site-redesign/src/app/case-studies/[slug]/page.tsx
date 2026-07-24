import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getContentSlugs, getContentBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type CaseStudyFrontmatter = {
  title: string
  description: string
  company: string
  industry: string
  metric: string
  metricLabel: string
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getContentSlugs("case-studies")
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = getContentBySlug<CaseStudyFrontmatter>("case-studies", slug)
  if (!entry) return {}

  const { frontmatter } = entry

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: `${siteConfig.url}/case-studies/${slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${siteConfig.url}/case-studies/${slug}`,
      type: "article",
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const entry = getContentBySlug<CaseStudyFrontmatter>("case-studies", slug)
  if (!entry) notFound()

  const { frontmatter, content } = entry

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to case studies
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{frontmatter.industry}</Badge>
              <span className="text-sm text-muted-foreground">
                {frontmatter.company}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {frontmatter.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {frontmatter.description}
            </p>

            <div className="mt-8 rounded-xl bg-muted px-6 py-8 text-center">
              <p className="text-5xl font-bold text-primary">
                {frontmatter.metric}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {frontmatter.metricLabel}
              </p>
            </div>
          </header>

          <article className="prose dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </article>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
