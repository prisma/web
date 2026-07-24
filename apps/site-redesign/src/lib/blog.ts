import { getContentSlugs, getContentBySlug, getAllContent } from "./content"

type BlogFrontmatter = {
  title: string
  description: string
  date: string
  author: string
  image?: string
  tags?: string[]
}

export type Post = {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
}

export function getPostSlugs() {
  return getContentSlugs("blog")
}

export function getPostBySlug(slug: string): Post {
  const entry = getContentBySlug<BlogFrontmatter>("blog", slug)
  if (!entry) throw new Error(`Post not found: ${slug}`)
  return entry
}

export function getAllPosts(): Post[] {
  const posts = getAllContent<BlogFrontmatter>("blog")
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  )
}
