import { source } from "@/lib/source";
import {
  normalizeProcessedMarkdown,
  protectFencedCodeBlocks,
  protectInlineCode,
} from "@/lib/llm-markdown";
import { getPageTitleText } from "@/lib/page-title";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";
import type { InferPageType } from "fumadocs-core/source";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

type DocsPage = InferPageType<typeof source>;

type RelatedPageLink = {
  title: string;
  href: string;
  description?: string;
};

const sectionTitleCache = new Map<string, string | null>();

function getContentDirectory() {
  return "content/docs";
}

function getPageSource() {
  return source;
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPageUrlSegments(page: DocsPage) {
  return page.url.split("/").filter(Boolean);
}

function getSectionTitle(page: DocsPage, slugs: string[]) {
  if (slugs.length === 0) return undefined;

  const contentDirectory = getContentDirectory();
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
  if (index === slugs.length - 1) return getPageTitleText(page.data.title, slugs[index] ?? "Docs");

  return getSectionTitle(page, slugs.slice(0, index + 1)) ?? humanizeSlug(slugs[index]);
}

function getBreadcrumbLine(page: DocsPage) {
  const segments = getPageUrlSegments(page);
  const names = segments.map((_, index) => getBreadcrumbName(page, segments, index));
  return names.length > 0 ? `Location: ${names.join(" > ")}` : undefined;
}

function resolveHref(href: string, page: DocsPage, baseUrl: string) {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(href)) return href;
  const resolved = getPageSource().getPageByHref(href, { dir: dirname(page.path) });
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
      const resolved = getPageSource().getPageByHref(entry, { dir: dirname(page.path) });
      const href = resolveHref(entry, page, baseUrl);
      if (!href) return [];

      return [
        {
          title: resolved ? getPageTitleText(resolved.page.data.title, entry) : entry,
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

  return getPageSource()
    .getPages()
    .filter((candidate) => {
      const candidateSegments = getPageUrlSegments(candidate);
      return (
        candidate.url !== page.url &&
        candidateSegments.length === pageSegments.length &&
        parentSegments.every((segment, index) => candidateSegments[index] === segment)
      );
    })
    .sort((a, b) =>
      getPageTitleText(a.data.title, a.url).localeCompare(getPageTitleText(b.data.title, b.url)),
    )
    .slice(0, 5)
    .map((candidate) => ({
      title: getPageTitleText(candidate.data.title, candidate.url),
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

/**
 * Rewrites in-body markdown links so the full feed and per-page markdown resolve
 * correctly when read outside the app. Root-relative links (`/orm/...`) do not
 * carry the `/docs` base path in the processed markdown, so an agent resolving
 * them against the feed URL would drop `/docs`. We resolve each link against the
 * docs source: known docs pages become absolute `<baseUrl>/docs/...` URLs, while
 * links that are not docs pages (e.g. `/pricing`) become site-root URLs so they
 * are not wrongly prefixed with `/docs`. Absolute, protocol-relative (`//`),
 * anchor-only, and relative (`./`, `../`) links are left untouched.
 */
function resolveInBodyHref(target: string, page: DocsPage, baseUrl: string) {
  const hashIndex = target.indexOf("#");
  const hash = hashIndex === -1 ? "" : target.slice(hashIndex);
  const path = hashIndex === -1 ? target : target.slice(0, hashIndex);

  const resolved = getPageSource().getPageByHref(path, { dir: dirname(page.path) });
  if (resolved) {
    const resolvedHash = resolved.hash ? `#${resolved.hash}` : hash;
    return `${baseUrl}${withDocsBasePath(resolved.page.url)}${resolvedHash}`;
  }

  // Not a docs page: treat as a site-root link (do not add the /docs base path).
  return `${baseUrl}${target}`;
}

function absolutizeInBodyLinks(markdown: string, page: DocsPage, baseUrl: string) {
  // Protect fenced code blocks, then inline code spans, so example code AND inline
  // code containing markdown link syntax (e.g. `[label](/path)`) are left untouched
  // by the rewrite below. Order matters: fences first, then inline spans.
  const protectedFences = protectFencedCodeBlocks(markdown);
  const protectedInline = protectInlineCode(protectedFences.markdown);

  const rewritten = protectedInline.markdown.replace(
    /\]\((\/[^)\s]*)\)/g,
    (full, target: string) => {
      if (target.startsWith("//")) return full;
      return `](${resolveInBodyHref(target, page, baseUrl)})`;
    },
  );

  return protectedFences.restore(protectedInline.restore(rewritten));
}

export async function getLLMText(page: DocsPage) {
  const baseUrl = getBaseUrl();
  const processed = absolutizeInBodyLinks(
    normalizeProcessedMarkdown(await page.data.getText("processed")),
    page,
    baseUrl,
  );
  const breadcrumbLine = getBreadcrumbLine(page);
  const explicitRelatedPages = getExplicitRelatedPages(page, baseUrl);
  const relatedPages =
    explicitRelatedPages.length > 0
      ? explicitRelatedPages.slice(0, 5)
      : getSiblingRelatedPages(page, baseUrl);
  const context = breadcrumbLine ? `${breadcrumbLine}\n\n` : "";
  const related = formatRelatedPages(relatedPages);

  const llmsTxtUrl = `${baseUrl}${withDocsBasePath("/llms.txt")}`;
  const directive = `> For the complete Prisma documentation index, see [llms.txt](${llmsTxtUrl}). A markdown version of any docs page is available by appending \`.md\` to its URL.`;

  const description =
    typeof page.data.description === "string" && page.data.description.trim().length > 0
      ? `\n\n${page.data.description.trim()}`
      : "";

  return `# ${getPageTitleText(page.data.title, page.url)} (${withDocsBasePath(page.url)})

${directive}${description}

${context}${processed}${related}`;
}
