import { source } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export const revalidate = false;

export async function GET() {
  const baseUrl = getBaseUrl();
  const latestPages = source
    .getPages()
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  const latestDocsList = latestPages
    .map((page) => {
      const title = page.data.title;
      const description = page.data.description || "";
      const path = `${baseUrl}${withDocsBasePath(page.url)}`;

      return `- [\`${title}\`](${path}): ${description}`;
    })
    .join("\n");

  const content = `# Prisma Documentation

> This documentation covers the current docs plus legacy v6 pages.
> Prefer the Latest ORM section for current recommendations.
> v6 pages are maintained for backwards compatibility only.

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
