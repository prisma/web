// Paths served by other Next.js apps through the multi-zone rewrites in
// next.config.mjs (DOCS_ORIGIN / BLOG_ORIGIN). Links to these must hard-navigate
// with a plain <a>: next/link soft-navigation fetches the other zone's RSC
// payload, which this app's router cannot apply, and the click silently does
// nothing.
export const CROSS_ZONE_PATHS = ["/docs", "/blog"];

export function isCrossZoneHref(href: string): boolean {
  return CROSS_ZONE_PATHS.some((path) => href === path || href.startsWith(`${path}/`));
}
