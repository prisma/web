/**
 * Base URL for canonicals, OpenGraph, and sitemaps. Same fallback chain as
 * apps/docs and apps/blog: never let a production build point at a Vercel
 * deployment hostname.
 */
export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_PRISMA_URL ??
    (process.env.NODE_ENV === "production" ? "https://www.prisma.io" : null) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    `http://localhost:${process.env.PORT ?? "3004"}`
  );
}

export const HANDBOOK_PREFIX = "/handbook";

/**
 * Prefix a handbook-relative path with the zone's basePath. Only for raw
 * string URLs (metadata, sitemap, <img src>). next/link and next/image
 * already respect basePath; do not double-prefix those.
 */
export function withHandbookBasePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === HANDBOOK_PREFIX || normalized.startsWith(`${HANDBOOK_PREFIX}/`)) {
    return normalized;
  }
  if (normalized === "/") return HANDBOOK_PREFIX;
  return `${HANDBOOK_PREFIX}${normalized}`;
}
