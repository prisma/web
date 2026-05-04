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
  llmsSections,
} from "@/lib/llms";

export const revalidate = false;

export async function GET() {
  const baseUrl = getBaseUrl();
  const latestPages = filterPagesForLLMsIndex(source.getPages()).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );

  const commonQueriesList = filterAvailableLLMsLinks(commonQueries, latestPages)
    .map((link) => formatLLMsLink(link, baseUrl))
    .join("\n");
  const subIndexList = filterAvailableLLMsSections(llmsSections, latestPages)
    .map((section) => formatLLMsSectionLink(section, baseUrl))
    .join("\n");
  const latestDocsList = latestPages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n");

  const content = `# Prisma Documentation

> This documentation covers the current docs plus legacy v6 pages.
> Prefer the Latest ORM section for current recommendations.
> v6 pages are maintained for backwards compatibility only.

## Common Queries

${commonQueriesList}

## Product Area Indexes

${subIndexList}

## Latest

${latestDocsList}

## Options

- [Full documentation with content](${baseUrl}${withDocsBasePath("/llms-full.txt")})
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
