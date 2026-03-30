import { generateRSS } from "@prisma-docs/ui/lib/rss";
import { blog } from "@/lib/source";
import { getBaseUrl, withBlogBasePath } from "@/lib/url";

export function getRSS() {
  const baseUrl = getBaseUrl();
  const pages = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return generateRSS(
    {
      title: "Prisma Blog",
      baseUrl,
      description: "Latest posts from the Prisma blog",
      copyright: `All rights reserved ${new Date().getFullYear()}, Prisma Data, Inc.`,
      author: {
        name: "Prisma Data, Inc.",
      },
    },
    pages.map((page) => {
      const date = new Date(page.data.date);
      return {
        id: withBlogBasePath(page.url),
        url: withBlogBasePath(page.url),
        title: page.data.metaTitle ?? page.data.title,
        description: page.data.metaDescription ?? page.data.description ?? page.data.excerpt,
        date
      };
    }),
  );
}
