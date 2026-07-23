import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/url";
import { SITE_NAME } from "@/lib/site-metadata";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

/**
 * Google rewrites a title link when the title doesn't identify the site,
 * falling back to whatever inbound links call the page. Titles here are
 * inconsistent about carrying the brand, so add it where it's missing rather
 * than blanket-appending and ending up with "Prisma ORM | Prisma".
 *
 * The brand is matched as a whole word, so a title that already carries it
 * ("Prisma ORM | Type-Safe ORM…", "…with Prisma & CockroachDB") is left alone,
 * while a title that merely contains the letters ("Prismatic…") still gets it.
 */
const SITE_NAME_PATTERN = new RegExp(`\\b${SITE_NAME}\\b`);

function withSiteName(title: string): string {
  return SITE_NAME_PATTERN.test(title) ? title : `${title} | ${SITE_NAME}`;
}

export function createPageMetadata({
  title: rawTitle,
  description,
  path,
  ogImage = "/og/og-index.png",
}: PageMetadataOptions): Metadata {
  const title = withSiteName(rawTitle);
  const pathname = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBaseUrl();
  const url = new URL(pathname, baseUrl).toString();
  const ogImageUrl = ogImage
    ? new URL(ogImage.startsWith("/") ? ogImage : `/${ogImage}`, baseUrl).toString()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Prisma",
      locale: "en_US",
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      site: "@prisma",
      creator: "@prisma",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}
