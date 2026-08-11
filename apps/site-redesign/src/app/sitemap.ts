import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { getContentSlugs } from "@/lib/content"

// Real routes only: CF's template scaffolding (features/compare/versus/etc.)
// stays out of the sitemap, and the blog app publishes its own under /blog.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/pricing",
    "/orm",
    "/postgres",
    "/compute",
    "/stack",
    "/customers",
    "/company",
    "/company/careers",
    "/programs",
    "/changelog",
    "/support",
    "/community",
    "/demo",
    "/legal/privacy",
    "/legal/terms",
    "/legal/sla",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }))

  const changelogRoutes = getContentSlugs("changelog").map((slug) => ({
    url: `${siteConfig.url}/changelog/${slug}`,
    lastModified: new Date(slug),
  }))

  return [...staticRoutes, ...changelogRoutes]
}
