import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, Check, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getContentSlugs, getContentBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type CompareFrontmatter = {
  title: string
  description: string
  competitor: string
  features: { name: string; us: boolean; them: boolean }[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getContentSlugs("compare")
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const entry = getContentBySlug<CompareFrontmatter>("compare", slug)
    if (!entry) return {}
    const url = `${siteConfig.url}/compare/${slug}`
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

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params
  const entry = getContentBySlug<CompareFrontmatter>("compare", slug)
  if (!entry) notFound()

  const { frontmatter, content } = entry

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All comparisons
          </Link>

          <header className="mb-12">
            <Badge variant="secondary" className="mb-4">
              Comparison
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {siteConfig.name} vs {frontmatter.competitor}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {frontmatter.description}
            </p>
          </header>

          <div className="mb-12">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Feature</TableHead>
                  <TableHead className="text-center">{siteConfig.name}</TableHead>
                  <TableHead className="text-center">
                    {frontmatter.competitor}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(frontmatter.features ?? []).map((feature, index) => (
                  <TableRow
                    key={feature.name}
                    className={index % 2 === 1 ? "bg-muted/40" : ""}
                  >
                    <TableCell className="font-medium">
                      {feature.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.us ? (
                        <Check className="inline-block size-5 text-primary" />
                      ) : (
                        <X className="inline-block size-5 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.them ? (
                        <Check className="inline-block size-5 text-primary" />
                      ) : (
                        <X className="inline-block size-5 text-destructive" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
