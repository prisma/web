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
  const url = new URL(pathname, getBaseUrl()).toString();

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
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
