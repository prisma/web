/**
 * Returns the base URL for the site (e.g. https://www.prisma.io).
 * Used for canonical URLs, OpenGraph, and sitemaps.
 */
export function getBaseUrl(): string {
    return (
      process.env.NEXT_PUBLIC_PRISMA_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
      "http://localhost:3000"
    );
  }
  
