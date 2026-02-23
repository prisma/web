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

export function normalize(urlOrPath: string) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith("/"))
    return urlOrPath.slice(0, -1);
  return urlOrPath;
}

export const DOCS_PREFIX = "/docs";

export function withDocsBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (
    normalizedPath === DOCS_PREFIX ||
    normalizedPath.startsWith(`${DOCS_PREFIX}/`)
  ) {
    return normalizedPath;
  }

  if (normalizedPath === "/") return DOCS_PREFIX;
  return `${DOCS_PREFIX}${normalizedPath}`;
}

/**
 * Strips the /docs prefix for segment-based comparison.
 * All docs paths share this prefix, so we compare the segments to avoid
 * /docs/orm incorrectly matching /docs/prisma-orm.
 */
function withoutDocsPrefix(path: string): string {
  if (path === DOCS_PREFIX || path === `${DOCS_PREFIX}/`) return "";
  if (path.startsWith(`${DOCS_PREFIX}/`)) return path.slice(DOCS_PREFIX.length);
  return path;
}

/**
 * @returns if `href` is matching the given pathname
 */
export function isActive(
  href: string,
  pathname: string,
  nested = true,
): boolean {
  href = normalize(href);
  pathname = normalize(pathname);

  const hrefSegment = withoutDocsPrefix(href);
  const pathSegment = withoutDocsPrefix(pathname);

  if (hrefSegment === pathSegment) return true;
  // Root /docs must only match /docs exactly, not nested paths like /docs/orm
  if (hrefSegment === "") return false;
  return (
    nested &&
    pathSegment.startsWith(`${hrefSegment}/`) &&
    // Ensure segment boundary: "orm" must not match "prisma-orm"
    (pathSegment.length === hrefSegment.length ||
      pathSegment[hrefSegment.length] === "/")
  );
}

/**
 * @returns if pathname matches any of the given paths (exact or nested)
 */
export function isActiveAny(paths: string[], pathname: string): boolean {
  const normalizedPathname = normalize(pathname);
  const pathSegment = withoutDocsPrefix(normalizedPathname);
  return paths.some((path) => {
    const normalized = normalize(path);
    const segment = withoutDocsPrefix(normalized);
    if (segment === pathSegment) return true;
    // Root /docs only matches /docs exactly
    if (segment === "") return false;
    return (
      pathSegment.startsWith(`${segment}/`) &&
      (pathSegment.length === segment.length ||
        pathSegment[segment.length] === "/")
    );
  });
}
