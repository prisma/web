import { BLOG_HOME_DESCRIPTION } from "@/lib/blog-metadata";
import { getBaseUrl, withBlogBasePath } from "@/lib/url";

function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, getBaseUrl()).toString();
}

export function createBlogStructuredData() {
  const baseUrl = getBaseUrl();
  const blogUrl = absoluteUrl(withBlogBasePath("/"));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "Prisma",
        url: baseUrl,
        sameAs: [
          "https://github.com/prisma",
          "https://twitter.com/prisma",
          "https://www.linkedin.com/company/prisma-io",
          "https://www.youtube.com/prismadata",
          "https://www.facebook.com/prisma.io/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${blogUrl}#website`,
        name: "Prisma Blog",
        url: blogUrl,
        description: BLOG_HOME_DESCRIPTION,
        publisher: {
          "@id": `${baseUrl}#organization`,
        },
      },
    ],
  };
}
