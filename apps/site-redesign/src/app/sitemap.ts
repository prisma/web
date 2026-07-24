import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { getAllPosts } from "@/lib/blog"
import { getContentSlugs } from "@/lib/content"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/features",
    "/pricing",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
    "/changelog",
    "/how-it-works",
    "/integrations",
    "/solutions",
    "/case-studies",
    "/compare",
    "/alternative",
    "/versus",
    "/alternatives",
    "/demo",
    "/lead-magnet",
    "/podcasts",
    "/webinars",
    "/resources",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }))

  const posts = getAllPosts()
  const blogRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
  }))

  const contentTypes = [
    { dir: "features", prefix: "features" },
    { dir: "solutions", prefix: "solutions" },
    { dir: "case-studies", prefix: "case-studies" },
    { dir: "compare", prefix: "compare" },
    { dir: "alternatives", prefix: "alternative" },
    { dir: "versus", prefix: "versus" },
    { dir: "alternatives-listicle", prefix: "alternatives" },
  ]

  const contentRoutes = contentTypes.flatMap(({ dir, prefix }) =>
    getContentSlugs(dir).map((slug) => ({
      url: `${siteConfig.url}/${prefix}/${slug}`,
      lastModified: new Date(),
    }))
  )

  return [...staticRoutes, ...blogRoutes, ...contentRoutes]
}
