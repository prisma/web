import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getContentSlugs, getContentBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type AlternativeFrontmatter = {
  title: string
  description: string
  competitor: string
  reasons: string[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getContentSlugs("alternatives")
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = getContentBySlug<AlternativeFrontmatter>("alternatives", slug)
  if (!entry) return {}
  const url = `${siteConfig.url}/alternative/${slug}`
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      url,
      type: "article",
    },
  }
}

export default async function AlternativeDetailPage({ params }: Props) {
  const { slug } = await params
  const entry = getContentBySlug<AlternativeFrontmatter>("alternatives", slug)
  if (!entry) notFound()

  const { frontmatter, content } = entry

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/alternative"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All alternatives
          </Link>

          <header className="mb-12">
            <Badge variant="secondary" className="mb-4">
              vs {frontmatter.competitor}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Looking for a{" "}
              <span className="text-primary">{frontmatter.competitor}</span>{" "}
              alternative?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {frontmatter.description}
            </p>
          </header>

          <div className="mb-12 rounded-lg border border-border bg-muted/50 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Top reasons to switch
            </h2>
            <ol className="space-y-3">
              {(frontmatter.reasons ?? []).map((reason, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ol>
          </div>

          <article className="prose dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </article>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
