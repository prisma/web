/**
 * Returns the base URL for the site (e.g. https://www.prisma.io).
 * Used for canonical URLs, OpenGraph, and sitemaps.
 */
export function getBaseUrl(): string {
    return (
      process.env.NEXT_PUBLIC_PRISMA_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
      "http://localhost:3001"
    );
  }
  
  export function normalize(urlOrPath: string) {
    if (urlOrPath.length > 1 && urlOrPath.endsWith("/"))
      return urlOrPath.slice(0, -1);
    return urlOrPath;
  }
  
  export const BLOG_PREFIX = "/blog";
  
  export function withBlogBasePath(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
    if (
      normalizedPath === BLOG_PREFIX ||
      normalizedPath.startsWith(`${BLOG_PREFIX}/`)
    ) {
      return normalizedPath;
    }
  
    if (normalizedPath === "/") return BLOG_PREFIX;
    return `${BLOG_PREFIX}${normalizedPath}`;
  }
  
  export function withBlogBasePathForImageSrc(src: string): string {
    if (!src.startsWith("/")) return src;
    if (src.startsWith("/_next/")) return src;
    return withBlogBasePath(src) as string;
  }
  /**
   * Strips the /blog prefix for segment-based comparison.
   * All blog paths share this prefix, so we compare the segments to avoid
   * /blog/orm incorrectly matching /blog/prisma-orm.
   */
  function withoutBlogPrefix(path: string): string {
    if (path === BLOG_PREFIX || path === `${BLOG_PREFIX}/`) return "";
    if (path.startsWith(`${BLOG_PREFIX}/`)) return path.slice(BLOG_PREFIX.length);
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
  
    const hrefSegment = withoutBlogPrefix(href);
    const pathSegment = withoutBlogPrefix(pathname);
  
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
    const pathSegment = withoutBlogPrefix(normalizedPathname);
    return paths.some((path) => {
      const normalized = normalize(path);
      const segment = withoutBlogPrefix(normalized);
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
  