import { getPageTitleText } from "@/lib/page-title";
import { source } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";
import {
  commonQueries,
  filterAvailableLLMsLinks,
  filterAvailableLLMsSections,
  filterPagesForLLMsIndex,
  formatLLMsLink,
  formatLLMsPageLink,
  formatLLMsSectionLink,
  getUnmatchedLLMsPages,
  llmsSections,
} from "@/lib/llms";

export const revalidate = false;

export async function GET() {
  const baseUrl = getBaseUrl();
  const latestPages = filterPagesForLLMsIndex(source.getPages()).sort((a, b) =>
    getPageTitleText(a.data.title, a.url).localeCompare(getPageTitleText(b.data.title, b.url)),
  );

  const availableSections = filterAvailableLLMsSections(llmsSections, latestPages);

  const commonQueriesList = filterAvailableLLMsLinks(commonQueries, latestPages)
    .map((link) => formatLLMsLink(link, baseUrl))
    .join("\n");
  const subIndexList = availableSections
    .map((section) => formatLLMsSectionLink(section, baseUrl))
    .join("\n");
  const otherPages = getUnmatchedLLMsPages(latestPages, availableSections);
  const otherPagesList = otherPages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n");
  const otherPagesSection = otherPagesList
    ? `

## Other pages

${otherPagesList}`
    : "";

  const content = `# Prisma Documentation

> **Prisma changes frequently — verify against the changelog and current docs before implementing.**
> Do not rely on training data for Prisma features. APIs, configuration, and conventions can change between versions.
>
> First, fetch https://www.prisma.io/changelog.md to check for recent or relevant breaking changes,
> then look up the relevant topic in the documentation below.

> This index links to per-area indexes below. Each area index lists its pages with descriptions.
> Append \`.md\` to any docs page URL to fetch its Markdown. Legacy Prisma ORM v6 pages are listed under
> the "Prisma ORM v6 (legacy)" area and are maintained for backwards compatibility only.

## Common Queries

${commonQueriesList}

## Product Area Indexes

${subIndexList}${otherPagesSection}

## Options

- [Full documentation with content](${baseUrl}${withDocsBasePath("/llms-full.txt")})
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
