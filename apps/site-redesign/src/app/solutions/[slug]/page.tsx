import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TestimonialSingle } from "@/components/sections/testimonial-single"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getContentSlugs, getContentBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type SolutionFrontmatter = {
  title: string
  description: string
  persona: string
  painPoints: string[]
  benefits: string[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getContentSlugs("solutions")
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = getContentBySlug<SolutionFrontmatter>("solutions", slug)
  if (!entry) return {}

  const url = `${siteConfig.url}/solutions/${slug}`

  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      url,
      type: "website",
    },
  }
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params
  const entry = getContentBySlug<SolutionFrontmatter>("solutions", slug)
  if (!entry) notFound()

  const { frontmatter, content } = entry

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to solutions
          </Link>

          <header className="mb-12">
            <Badge variant="secondary" className="mb-4">
              {frontmatter.persona}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {frontmatter.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {frontmatter.description}
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Common pain points
              </h2>
              <ul className="space-y-3">
                {(frontmatter.painPoints ?? []).map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <X className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">
                How we solve them
              </h2>
              <ul className="space-y-3">
                {(frontmatter.benefits ?? []).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <article className="prose dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </article>
        </div>
      </section>

      <TestimonialSingle />
      <CtaSimple />
    </>
  )
}
