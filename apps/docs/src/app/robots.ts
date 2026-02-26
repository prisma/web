import type { MetadataRoute } from 'next'
import { getBaseUrl, withDocsBasePath } from '@/lib/urls'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()
  const sitemap = new URL(withDocsBasePath('/sitemap.xml'), baseUrl).toString()
  const disallow = [
    '/api/',
    '/_next/',
    '/og/',
    '/*?query=*',
    '/*?page=*',
    '/*&query=*',
    '/*&page=*',
  ].map(withDocsBasePath)

  return {
    rules: {
      userAgent: '*',
      allow: withDocsBasePath('/'),
      disallow,
    },
    sitemap,
    host: baseUrl,
  }
}
