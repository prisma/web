import { withBlogBasePath } from "./url";

// These retired articles are still in the source archive, but their public
// URLs redirect to canonical pages elsewhere (site/next.config.mjs).
export const redirectedBlogPages = new Set([
  "/blog/performance-engineering-aeduv0rei0jk",
  "/blog/prisma-studio-3rtf78dg99fe",
  "/blog/prisma-the-complete-orm-inw24qjeawmb",
]);

export function isCanonicalBlogPage(
  page: { url: string; data: { canonicalUrl?: string } },
  origin: string,
) {
  const url = new URL(withBlogBasePath(page.url), origin);
  return (
    !redirectedBlogPages.has(url.pathname) &&
    (!page.data.canonicalUrl || new URL(page.data.canonicalUrl, origin).href === url.href)
  );
}
