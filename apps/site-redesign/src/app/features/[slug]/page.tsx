import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, Check, BarChart3, Puzzle, Users } from "lucide-react"
import { getContentSlugs, getContentBySlug } from "@/lib/content"
import { CtaSimple } from "@/components/sections/cta-simple"
import { siteConfig } from "@/lib/config"

type FeatureFrontmatter = {
  title: string
  description: string
  icon: string
  benefits: string[]
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  Puzzle,
  Users,
}

export function generateStaticParams() {
  const slugs = getContentSlugs("features")
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  try {
    const { slug } = await params
    const entry = getContentBySlug<FeatureFrontmatter>("features", slug)
    if (!entry) return {}

    const { frontmatter } = entry

    return {
      title: frontmatter.title,
      description: frontmatter.description,
      alternates: {
        canonical: `${siteConfig.url}/features/${slug}`,
      },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        url: `${siteConfig.url}/features/${slug}`,
        type: "article",
      },
    }
  } catch {
    return {}
  }
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getContentBySlug<FeatureFrontmatter>("features", slug)

  if (!entry) notFound()

  const { frontmatter, content } = entry
  const IconComponent = icons[frontmatter.icon]

  return (
    <>
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Features
          </Link>

          <div className="mt-10 flex flex-col items-start gap-6">
            {IconComponent && (
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <IconComponent className="size-7 text-primary" />
              </div>
            )}

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {frontmatter.title}
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {frontmatter.description}
            </p>
          </div>

          <ul className="mt-10 flex flex-col gap-3">
            {(frontmatter.benefits ?? []).map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-base text-foreground"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3 text-primary" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <article className="prose dark:prose-invert max-w-none mt-16">
            <MDXRemote source={content} />
          </article>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
