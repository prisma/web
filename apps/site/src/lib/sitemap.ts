import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { changelogSource } from "@/lib/changelog-source";
import { getBaseUrl } from "@/lib/url";

type SitemapEntry = {
  url: string;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
};

const HOST_SITEMAPS = ["/sitemap-site.xml", "/docs/sitemap.xml", "/blog/sitemap.xml"];
const APP_DIRECTORY = path.join(process.cwd(), "src/app");

/** Escape XML-sensitive characters before writing values into sitemap markup. */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** Build absolute URLs for the top-level sitemap index. */
export function getHostSitemapUrls(baseUrl = getBaseUrl()): string[] {
  return HOST_SITEMAPS.map((pathname) => new URL(pathname, baseUrl).toString());
}

type SegmentDisposition = "include" | "omit" | "exclude";

const INTERCEPTING_ROUTE_PREFIXES = ["(.)", "(..)", "(...)", "(..)(..)"] as const;

/** Classify app segments for sitemap generation. */
function getSegmentDisposition(segment: string): SegmentDisposition {
  if (segment.startsWith("_") || segment.startsWith("@")) {
    return "exclude";
  }

  if (segment.startsWith("[") && segment.endsWith("]")) {
    return "exclude";
  }

  if (INTERCEPTING_ROUTE_PREFIXES.some((prefix) => segment.startsWith(prefix))) {
    return "exclude";
  }

  if (segment.startsWith("(") && segment.endsWith(")")) {
    return "omit";
  }

  return "include";
}

/** Convert an app directory segment into its public URL segment. */
function toRouteSegment(segment: string): string | null {
  if (getSegmentDisposition(segment) !== "include") {
    return null;
  }

  return segment;
}

/** Assign default sitemap metadata for a public pathname. */
function getEntryMetadata(pathname: string): Omit<SitemapEntry, "url"> {
  if (pathname === "/") {
    return {
      changeFrequency: "daily",
      priority: 1,
    };
  }

  return {
    changeFrequency: "weekly",
    priority: 0.8,
  };
}

/** Recursively collect public page routes from the App Router tree. */
async function collectPageRoutes(directory: string, segments: string[] = []): Promise<string[]> {
  let entries: Dirent<string>[];

  try {
    entries = await readdir(directory, { encoding: "utf8", withFileTypes: true });
  } catch (error) {
    console.error(`Failed to read sitemap routes from ${directory}`, error);
    return [];
  }

  const routes = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectPageRoutes(entryPath, [...segments, entry.name]);
      }

      if (!entry.isFile() || entry.name !== "page.tsx") {
        return [];
      }

      const routeSegments = segments
        .map(toRouteSegment)
        .filter((segment): segment is string => Boolean(segment));

      const hasUnsupportedSegment = segments.some(
        (segment) => getSegmentDisposition(segment) === "exclude",
      );

      if (hasUnsupportedSegment) {
        return [];
      }

      return [routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`];
    }),
  );

  return routes.flat();
}

/** Generate sitemap entries for all public pages in the site app. */
export async function getSiteSitemapEntries(baseUrl = getBaseUrl()): Promise<SitemapEntry[]> {
  const [pathnames, changelogEntries] = await Promise.all([
    collectPageRoutes(APP_DIRECTORY),
    changelogSource.getPages().map((page) => page.url),
  ]);

  const allPathnames = [...new Set([...pathnames, ...changelogEntries])];

  return allPathnames
    .sort((left, right) => left.localeCompare(right))
    .map((pathname) => ({
      url: new URL(pathname, baseUrl).toString(),
      ...getEntryMetadata(pathname),
    }));
}

/** Render a sitemap index document. */
export function renderSitemapIndexXml(urls: string[]): string {
  const items = urls
    .map(
      (url) => `  <sitemap>
    <loc>${escapeXml(url)}</loc>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

/** Render a URL sitemap document. */
export function renderSitemapXml(entries: SitemapEntry[]): string {
  const items = entries
    .map(({ url, changeFrequency, priority }) => {
      const metadata = [
        changeFrequency
          ? `    <changefreq>${escapeXml(changeFrequency)}</changefreq>`
          : null,
        typeof priority === "number"
          ? `    <priority>${priority.toFixed(1)}</priority>`
          : null,
      ]
        .filter(Boolean)
        .join("\n");

      return `  <url>
    <loc>${escapeXml(url)}</loc>${metadata ? `\n${metadata}` : ""}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}
