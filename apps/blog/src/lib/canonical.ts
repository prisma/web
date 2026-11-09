import { getBaseUrl, withBlogBasePath } from "./url";

/**
 * The absolute canonical URL of a post. A cross-posted article names the
 * original through its `canonicalUrl` frontmatter; every other post is
 * self-canonical. Same rule as the post page's `<link rel="canonical">` in
 * src/app/(blog)/[slug]/page.tsx.
 */
export function getPostCanonicalUrl(
  pageUrl: string,
  canonicalUrl?: string,
  baseUrl: string = getBaseUrl(),
): string {
  const target = canonicalUrl?.trim() || withBlogBasePath(pageUrl);
  return new URL(target, baseUrl).toString();
}

/**
 * `Link` header value that points a Markdown rendition at its HTML page, so
 * the `.md` URL and the Markdown served on the post's own URL are read as the
 * same document as the HTML. apps/site's Markdown route sends the same
 * `rel="canonical"` link. The blog-wide `rel="llms-txt"` link comes from
 * next.config.mjs and is not repeated here.
 */
export function canonicalLinkHeader(canonicalUrl: string): string {
  return `<${canonicalUrl}>; rel="canonical"`;
}
