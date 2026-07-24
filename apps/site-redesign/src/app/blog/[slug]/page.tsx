import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft } from "lucide-react"
import { getAllPosts } from "@/lib/blog"
import { getContentBySlug } from "@/lib/content"

type BlogFrontmatter = {
  title: string
  description: string
  date: string
  author: string
  image?: string
  tags?: string[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getContentBySlug<BlogFrontmatter>("blog", slug)
  if (!post) return {}
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getContentBySlug<BlogFrontmatter>("blog", slug)
  if (!post) notFound()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {post.frontmatter.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {post.frontmatter.description}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.frontmatter.author}</span>
            <span>&middot;</span>
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </div>
        </header>

        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </article>
      </div>
    </section>
  )
}
