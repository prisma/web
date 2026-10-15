import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { getAllPosts } from "@/lib/blog"
import { isStarterKitComparison } from "@/app/compare/comparisons"
import { getContentSlugs } from "@/lib/content"
import { CUSTOMER_STORY_DETAILS } from "@/data/customer-stories"

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
    "/customers",
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
    { dir: "compare", prefix: "compare" },
    { dir: "alternatives", prefix: "alternative" },
    { dir: "versus", prefix: "versus" },
    { dir: "alternatives-listicle", prefix: "alternatives" },
  ]

  const contentRoutes = contentTypes.flatMap(({ dir, prefix }) =>
    getContentSlugs(dir)
      .filter((slug) => dir !== "compare" || !isStarterKitComparison(slug))
      .map((slug) => ({
        url: `${siteConfig.url}/${prefix}/${slug}`,
        lastModified: new Date(),
      }))
  )

  const customerStoryRoutes = CUSTOMER_STORY_DETAILS.map((story) => ({
    url: `${siteConfig.url}/customers/${story.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...blogRoutes, ...contentRoutes, ...customerStoryRoutes]
}
