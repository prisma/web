import { generateRSS } from "@prisma-docs/ui/lib/rss";
import { getPageTitleText } from "@/lib/page-title";
import { source } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "./urls";

export async function getRSS() {
  const baseUrl = getBaseUrl();
  const allPages = source.getPages();

  return generateRSS(
    {
      title: "Prisma Documentation",
      baseUrl: baseUrl,
      description: "Latest updates to Prisma documentation",
      copyright: `All rights reserved ${new Date().getFullYear()}, Prisma Data, Inc.`,
      author: {
        name: "Prisma Data, Inc.",
      },
    },
    await Promise.all(
      allPages.map(async (page) => ({
        id: `${withDocsBasePath(page.url)}`,
        url: `${withDocsBasePath(page.url)}`,
        title: getPageTitleText(page.data.title, page.url),
        description: page.data.description,
        date: (await pageContent(page.data)).lastModified ?? new Date(),
      })),
    ),
  );
}
import { pageContent } from "@prisma-docs/ui/lib/page-content";
