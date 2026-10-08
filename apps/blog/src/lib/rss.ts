import { generateRSS } from "@prisma-docs/ui/lib/rss";
import { blog, sortPagesNewestFirst } from "@/lib/source";
import {
  getBaseUrl,
  toAbsoluteUrl,
  withBlogBasePath,
  withBlogBasePathForImageSrc,
} from "@/lib/url";

export function getRSS() {
  const baseUrl = getBaseUrl();
  const pages = sortPagesNewestFirst(blog.getPages());

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
      const cover = page.data.metaImagePath ?? page.data.heroImagePath;
      const rel = cover ? withBlogBasePathForImageSrc(cover) : "";
      const image = rel.startsWith("/") ? toAbsoluteUrl(baseUrl, rel) : undefined;

      return {
        id: withBlogBasePath(page.url),
        url: withBlogBasePath(page.url),
        title: page.data.metaTitle ?? page.data.title,
        description: page.data.metaDescription ?? page.data.description ?? page.data.excerpt,
        date,
        image,
      };
    }),
  );
}
