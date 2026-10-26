/**
 * Paid-campaign landing pages live under one prefix so the rest of the site
 * can treat them as a group: the root layout drops the site header, footer and
 * announcement banner for them (components/site-chrome.tsx), the sitemap
 * leaves them out, and each page is `noindex`. They exist to convert an ad
 * click, not to rank, and the product pages they summarise stay the canonical
 * organic entry points.
 */
export const LANDING_ROUTE_PREFIX = "/lp";

export function isLandingPath(pathname: string): boolean {
  return pathname === LANDING_ROUTE_PREFIX || pathname.startsWith(`${LANDING_ROUTE_PREFIX}/`);
}
