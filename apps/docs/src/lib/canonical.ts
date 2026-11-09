import { withDocsBasePath } from "./urls";

/**
 * Resolves the canonical URL of a docs page.
 *
 * Pages are self-canonical by default. A page may point at another URL with the
 * optional `canonical` frontmatter field — used where two docs URLs are
 * materially the same document (an ORM v6 page whose body is identical to its
 * v7 twin, for example), so search engines consolidate them instead of treating
 * them as competing duplicates.
 *
 * Frontmatter values are written as docs-relative paths (`/orm/v7/...`) and get
 * the `/docs` base path applied; absolute URLs are passed through untouched.
 */
export function resolveCanonicalUrl(pageUrl: string, canonical?: string): string {
  const target = canonical?.trim();
  if (!target) return withDocsBasePath(pageUrl);
  if (/^https?:\/\//i.test(target)) return target;
  return withDocsBasePath(target);
}

/**
 * Absolute form of a resolved canonical, for places that need a full URL such
 * as the JSON-LD `mainEntityOfPage.@id`. A canonical that is already absolute
 * is returned as is; a `/docs/...` path is joined onto the site base URL.
 */
export function absoluteCanonicalUrl(canonical: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(canonical)) return canonical;
  return `${baseUrl.replace(/\/$/, "")}${canonical}`;
}

/**
 * `Link` header value that points a Markdown rendition at its HTML page's
 * canonical, so the `.md` URL and the Markdown served on the page's own URL are
 * read as the same document as the HTML. apps/site's Markdown route sends the
 * same `rel="canonical"` link. The docs-wide `rel="llms-txt"` link comes from
 * next.config.mjs and is not repeated here.
 */
export function canonicalLinkHeader(canonicalUrl: string): string {
  return `<${canonicalUrl}>; rel="canonical"`;
}
