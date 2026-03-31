import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/url";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  ogImage = "/og/og-index.png",
}: PageMetadataOptions): Metadata {
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
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}
