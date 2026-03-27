import { readdir } from "node:fs/promises";
import path from "node:path";
import { getBaseUrl } from "@/lib/url";

type SitemapEntry = {
  url: string;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
};

const HOST_SITEMAPS = ["/sitemap-site.xml", "/docs/sitemap.xml", "/blog/sitemap.xml"];
const APP_DIRECTORY = path.join(process.cwd(), "src/app");

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function getHostSitemapUrls(baseUrl = getBaseUrl()): string[] {
  return HOST_SITEMAPS.map((pathname) => new URL(pathname, baseUrl).toString());
}

function toRouteSegment(segment: string): string | null {
  if (segment.startsWith("(") && segment.endsWith(")")) {
    return null;
  }

  if (segment.startsWith("_") || (segment.startsWith("[") && segment.endsWith("]"))) {
    return null;
  }

  return segment;
}

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

async function collectPageRoutes(directory: string, segments: string[] = []): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
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
        (segment) =>
          segment.startsWith("_") ||
          (segment.startsWith("[") && segment.endsWith("]")),
      );

      if (hasUnsupportedSegment) {
        return [];
      }

      return [routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`];
    }),
  );

  return routes.flat();
}

export async function getSiteSitemapEntries(baseUrl = getBaseUrl()): Promise<SitemapEntry[]> {
  const pathnames = await collectPageRoutes(APP_DIRECTORY);

  return pathnames
    .sort((left, right) => left.localeCompare(right))
    .map((pathname) => ({
      url: new URL(pathname, baseUrl).toString(),
      ...getEntryMetadata(pathname),
    }));
}

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
