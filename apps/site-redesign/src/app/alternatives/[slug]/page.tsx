import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, Check, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getContentSlugs, getContentBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type Alternative = {
  name: string
  description: string
  pros: string[]
  cons: string[]
}

type AlternativesListicleFrontmatter = {
  title: string
  description: string
  competitor: string
  alternatives: Alternative[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getContentSlugs("alternatives-listicle")
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const entry = getContentBySlug<AlternativesListicleFrontmatter>(
      "alternatives-listicle",
      slug
    )
    if (!entry) return {}
    const url = `${siteConfig.url}/alternatives/${slug}`
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
  } catch {
    return {}
  }
}

export default async function AlternativesListicleDetailPage({
  params,
}: Props) {
  const { slug } = await params
  const entry = getContentBySlug<AlternativesListicleFrontmatter>(
    "alternatives-listicle",
    slug
  )
  if (!entry) notFound()

  const { frontmatter, content } = entry
  const alternatives = frontmatter.alternatives ?? []

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/alternatives"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All alternatives
          </Link>

          <header className="mb-12">
            <Badge variant="secondary" className="mb-4">
              Alternatives
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Top {alternatives.length} {frontmatter.competitor} Alternatives in
              2025
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {frontmatter.description}
            </p>
          </header>

          <div className="space-y-6 mb-12">
            {alternatives.map((alt, index) => (
              <Card key={alt.name}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <CardTitle className="text-lg">{alt.name}</CardTitle>
                      <CardDescription>{alt.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Pros</p>
                      <ul className="space-y-1">
                        {(alt.pros ?? []).map((pro) => (
                          <li
                            key={pro}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="size-4 shrink-0 text-primary mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Cons</p>
                      <ul className="space-y-1">
                        {(alt.cons ?? []).map((con) => (
                          <li
                            key={con}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <X className="size-4 shrink-0 text-destructive mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
