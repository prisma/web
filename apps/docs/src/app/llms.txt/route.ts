import { source, sourceV6 } from "@/lib/source";
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
  const v6Pages = sourceV6.getPages().sort((a, b) => a.data.title.localeCompare(b.data.title));

  const commonQueriesList = filterAvailableLLMsLinks(commonQueries, latestPages)
    .map((link) => formatLLMsLink(link, baseUrl))
    .join("\n");
  const subIndexList = filterAvailableLLMsSections(llmsSections, latestPages)
    .map((section) => formatLLMsSectionLink(section, baseUrl))
    .join("\n");
  const latestDocsList = latestPages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n");
  const v6DocsList = v6Pages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n");

  const content = `# Prisma Documentation

> This documentation covers Prisma v7 (current) and v6 (legacy).
> Prefer the Latest section for current recommendations.
> v6 pages are maintained for backwards compatibility only.

## Common Queries

${commonQueriesList}

## Product Area Indexes

${subIndexList}

## Latest

${latestDocsList}

## v6

${v6DocsList}

## Options

- [Full current documentation with content](${baseUrl}${withDocsBasePath("/llms-full.txt")})
- [Legacy v6 documentation with content](${baseUrl}${withDocsBasePath("/llms-full-v6.txt")})
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
