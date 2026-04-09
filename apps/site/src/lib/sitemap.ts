import type { Dirent } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { changelogSource } from "@/lib/changelog-source";
import { getBaseUrl } from "@/lib/url";

type SitemapEntry = {
  url: string;
  lastModified?: string;
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

type PageRoute = {
  pathname: string;
  filePath: string;
};

/** Recursively collect public page routes from the App Router tree. */
async function collectPageRoutes(directory: string, segments: string[] = []): Promise<PageRoute[]> {
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

      return [{
        pathname: routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`,
        filePath: entryPath,
      }];
    }),
  );

  return routes.flat();
}

/** Get the last modified date of a file as an ISO date string (YYYY-MM-DD). */
async function getFileLastModified(filePath: string): Promise<string | undefined> {
  try {
    const fileStat = await stat(filePath);
    return fileStat.mtime.toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

/** Generate sitemap entries for all public pages in the site app. */
export async function getSiteSitemapEntries(baseUrl = getBaseUrl()): Promise<SitemapEntry[]> {
  const [pageRoutes, changelogPages] = await Promise.all([
    collectPageRoutes(APP_DIRECTORY),
    changelogSource.getPages(),
  ]);

  // Build a map of pathname → lastmod from page file stats
  const pageLastModMap = new Map<string, string | undefined>();
  await Promise.all(
    pageRoutes.map(async ({ pathname, filePath }) => {
      pageLastModMap.set(pathname, await getFileLastModified(filePath));
    }),
  );

  // Changelog entries use their frontmatter date as lastmod
  const changelogLastModMap = new Map<string, string>();
  for (const page of changelogPages) {
    const date = page.data.date instanceof Date
      ? page.data.date.toISOString().split("T")[0]
      : String(page.data.date).split("T")[0];
    changelogLastModMap.set(page.url, date);
  }

  const allPathnames = [
    ...new Set([
      ...pageRoutes.map((route) => route.pathname),
      ...changelogPages.map((page) => page.url),
    ]),
  ];

  return allPathnames
    .sort((left, right) => left.localeCompare(right))
    .map((pathname) => ({
      url: new URL(pathname, baseUrl).toString(),
      lastModified: changelogLastModMap.get(pathname) ?? pageLastModMap.get(pathname),
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
    .map(({ url, lastModified, changeFrequency, priority }) => {
      const metadata = [
        lastModified
          ? `    <lastmod>${escapeXml(lastModified)}</lastmod>`
          : null,
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
