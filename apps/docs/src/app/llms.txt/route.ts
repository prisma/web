import { source, sourceV6 } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export const revalidate = false;

export async function GET() {
  const baseUrl = getBaseUrl();
  const latestPages = source
    .getPages()
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
  const v6Pages = sourceV6
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

  const v6DocsList = v6Pages
    .map((page) => {
      const title = page.data.title;
      const description = page.data.description || "";
      const path = `${baseUrl}${withDocsBasePath(page.url)}`;

      return `- [\`${title}\`](${path}): ${description}`;
    })
    .join("\n");

  const content = `# Prisma Documentation

## Latest

${latestDocsList}

## v6

${v6DocsList}

## Options

- [Full documentation with content](${baseUrl}${withDocsBasePath("/llms-full.txt")})
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
