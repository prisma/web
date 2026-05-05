import { generateRSS } from "@prisma-docs/ui/lib/rss";
import { getPageTitleText } from "@/lib/page-title";
import { source } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "./urls";

export function getRSS() {
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
    allPages.map((page: any) => ({
      id: `${withDocsBasePath(page.url)}`,
      url: `${withDocsBasePath(page.url)}`,
      title: getPageTitleText(page.data.title, page.url),
      description: page.data.description,
      date: page.data.lastModified ? new Date(page.data.lastModified) : new Date(),
    })),
  );
}
