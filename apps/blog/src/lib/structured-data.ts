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
        // The blog is a section of prisma.io, not a site of its own. It used to
        // declare its own WebSite, which competed with the canonical one in
        // apps/site for the site name Google shows.
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        name: "Prisma Blog",
        url: blogUrl,
        description: BLOG_HOME_DESCRIPTION,
        isPartOf: {
          "@id": `${baseUrl}#website`,
        },
        publisher: {
          "@id": `${baseUrl}#organization`,
        },
      },
    ],
  };
}
