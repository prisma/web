import { source, sourceV6 } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";
import type { InferPageType } from "fumadocs-core/source";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

type DocsPage = InferPageType<typeof source> | InferPageType<typeof sourceV6>;

type RelatedPageLink = {
  title: string;
  href: string;
  description?: string;
};

const sectionTitleCache = new Map<string, string | null>();

function getContentDirectory(page: DocsPage) {
  return page.url.startsWith("/v6") ? "content/docs.v6" : "content/docs";
}

function getPageSource(page: DocsPage) {
  return page.url.startsWith("/v6") ? sourceV6 : source;
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPageUrlSegments(page: DocsPage) {
  const url = page.url.startsWith("/v6") ? page.url.slice("/v6".length) : page.url;
  return url.split("/").filter(Boolean);
}

function getSectionTitle(page: DocsPage, slugs: string[]) {
  if (slugs.length === 0) return undefined;

  const contentDirectory = getContentDirectory(page);
  const cacheKey = `${contentDirectory}:${slugs.join("/")}`;
  const cached = sectionTitleCache.get(cacheKey);

  if (cached !== undefined) {
    return cached ?? undefined;
  }

  const candidatePaths = [
    join(process.cwd(), contentDirectory, ...slugs, "meta.json"),
    join(process.cwd(), contentDirectory, "(index)", ...slugs, "meta.json"),
  ];

  for (const candidatePath of candidatePaths) {
    try {
      const meta = JSON.parse(readFileSync(candidatePath, "utf8")) as { title?: string };
      if (typeof meta.title === "string" && meta.title.trim().length > 0) {
        sectionTitleCache.set(cacheKey, meta.title);
        return meta.title;
      }
    } catch {}
  }

  sectionTitleCache.set(cacheKey, null);
  return undefined;
}

function getBreadcrumbName(page: DocsPage, slugs: string[], index: number) {
  if (index === slugs.length - 1) return page.data.title;

  return getSectionTitle(page, slugs.slice(0, index + 1)) ?? humanizeSlug(slugs[index]);
}

function getBreadcrumbLine(page: DocsPage) {
  const segments = getPageUrlSegments(page);
  const names = segments.map((_, index) => getBreadcrumbName(page, segments, index));

  if (page.url.startsWith("/v6")) names.unshift("v6");
  return names.length > 0 ? `Location: ${names.join(" > ")}` : undefined;
}

function resolveHref(href: string, page: DocsPage, baseUrl: string) {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(href)) return href;
  const resolved = getPageSource(page).getPageByHref(href, { dir: dirname(page.path) });
  if (resolved) return `${baseUrl}${withDocsBasePath(resolved.page.url)}`;
  if (href.startsWith("/")) return `${baseUrl}${withDocsBasePath(href)}`;
  return undefined;
}

function getExplicitRelatedPages(page: DocsPage, baseUrl: string) {
  const data = page.data as {
    related?: unknown;
    relatedPages?: unknown;
  };
  const related = data.relatedPages ?? data.related;

  if (!Array.isArray(related)) return [];

  return related.flatMap((entry): RelatedPageLink[] => {
    if (typeof entry === "string") {
      const resolved = getPageSource(page).getPageByHref(entry, { dir: dirname(page.path) });
      const href = resolveHref(entry, page, baseUrl);
      if (!href) return [];

      return [
        {
          title: resolved?.page.data.title ?? entry,
          href,
          description: resolved?.page.data.description,
        },
      ];
    }

    if (!entry || typeof entry !== "object") return [];

    const relatedPage = entry as {
      title?: unknown;
      href?: unknown;
      url?: unknown;
      description?: unknown;
    };
    const hrefValue = typeof relatedPage.href === "string" ? relatedPage.href : relatedPage.url;
    if (typeof hrefValue !== "string") return [];

    const href = resolveHref(hrefValue, page, baseUrl);
    if (!href) return [];

    return [
      {
        title: typeof relatedPage.title === "string" ? relatedPage.title : hrefValue,
        href,
        description:
          typeof relatedPage.description === "string" ? relatedPage.description : undefined,
      },
    ];
  });
}

function getSiblingRelatedPages(page: DocsPage, baseUrl: string) {
  const pageSegments = getPageUrlSegments(page);
  const parentSegments = pageSegments.slice(0, -1);

  return getPageSource(page)
    .getPages()
    .filter((candidate) => {
      const candidateSegments = getPageUrlSegments(candidate);
      return (
        candidate.url !== page.url &&
        candidateSegments.length === pageSegments.length &&
        parentSegments.every((segment, index) => candidateSegments[index] === segment)
      );
    })
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .slice(0, 5)
    .map((candidate) => ({
      title: candidate.data.title,
      href: `${baseUrl}${withDocsBasePath(candidate.url)}`,
      description: candidate.data.description,
    }));
}

function formatRelatedPages(relatedPages: RelatedPageLink[]) {
  if (relatedPages.length === 0) return "";

  const links = relatedPages
    .map((page) => {
      const description = page.description ? `: ${page.description}` : "";
      return `- [\`${page.title}\`](${page.href})${description}`;
    })
    .join("\n");

  return `\n\n## Related pages\n\n${links}`;
}

function trimComponentContent(value: string) {
  const lines = value.replace(/^\n+|\n+$/g, "").split("\n");
  const indent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((minimum, line) => Math.min(minimum, line.match(/^ */)?.[0].length ?? 0), Infinity);

  return lines
    .map((line) => (Number.isFinite(indent) ? line.slice(indent) : line))
    .join("\n")
    .trim();
}

function cleanCalloutContent(value: string) {
  return trimComponentContent(value)
    .replace(
      /<Callout(?:Title|Description)>([\s\S]*?)<\/Callout(?:Title|Description)>/g,
      (_match, content: string) => trimComponentContent(content),
    )
    .replace(/<\/?(?:CalloutTitle|CalloutDescription)>/g, "")
    .replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n");
}

function formatCallout(type: string, content: string) {
  const label = type.trim().toUpperCase() || "NOTE";
  const text = cleanCalloutContent(content);
  if (!text) return "";

  return `> [!${label}]\n${text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n")}`;
}

function formatCodeBlockTab(value: string, content: string) {
  const text = trimComponentContent(content);
  if (!text) return "";

  return `#### ${value.trim()}\n\n${text}`;
}

function normalizeProcessedMarkdown(markdown: string) {
  return markdown
    .replace(
      /<CalloutContainer\s+type="([^"]+)"[^>]*>([\s\S]*?)<\/CalloutContainer>/g,
      (_match, type: string, content: string) => formatCallout(type, content),
    )
    .replace(/<CodeBlockTabsList>[\s\S]*?<\/CodeBlockTabsList>/g, "")
    .replace(
      /<CodeBlockTab\s+value="([^"]+)"[^>]*>([\s\S]*?)<\/CodeBlockTab>/g,
      (_match, value: string, content: string) => formatCodeBlockTab(value, content),
    )
    .replace(/<\/?CodeBlockTabs[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getLLMText(page: DocsPage) {
  const processed = normalizeProcessedMarkdown(await page.data.getText("processed"));
  const breadcrumbLine = getBreadcrumbLine(page);
  const baseUrl = getBaseUrl();
  const explicitRelatedPages = getExplicitRelatedPages(page, baseUrl);
  const relatedPages =
    explicitRelatedPages.length > 0
      ? explicitRelatedPages.slice(0, 5)
      : getSiblingRelatedPages(page, baseUrl);
  const context = breadcrumbLine ? `${breadcrumbLine}\n\n` : "";
  const related = formatRelatedPages(relatedPages);

  return `# ${page.data.title} (${withDocsBasePath(page.url)})

${context}${processed}${related}`;
}
