import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/url";
import { SITE_NAME } from "@/lib/site-metadata";
import { getOgCardUrl } from "@/lib/og-card";
import type { OgAccent } from "@prisma-docs/ui/components/og-image";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  /** Eyebrow on the generated card, e.g. "Prisma ORM". Defaults to the site name. */
  ogKicker?: string;
  /** Product accent on the generated card. Defaults to cyan. */
  ogAccent?: OgAccent;
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

/**
 * The generated card already prints the kicker as its eyebrow, so a descriptive
 * title that opens with the same product name would print it twice: "Prisma ORM"
 * over "Prisma ORM | Type-Safe ORM for TypeScript and Node.js". When the leading
 * segment is exactly what the eyebrow already says, the card headline carries the
 * descriptive half alone. Titles that don't repeat the kicker are untouched, and
 * the `<title>`, `og:title`, and `twitter:title` always keep the full string.
 */
function ogCardHeadline(rawTitle: string, kicker: string): string {
  const separator = rawTitle.indexOf(" | ");
  if (separator === -1) return rawTitle;

  const lead = rawTitle.slice(0, separator);
  const rest = rawTitle.slice(separator + 3);
  const duplicatesKicker = lead === kicker || lead === `${SITE_NAME} ${kicker}`;

  return duplicatesKicker ? rest : rawTitle;
}

export function createPageMetadata({
  title: rawTitle,
  description,
  path,
  ogKicker,
  ogAccent,
}: PageMetadataOptions): Metadata {
  const title = withSiteName(rawTitle);
  const ogImagePath = getOgCardUrl({
    title: ogCardHeadline(rawTitle, ogKicker ?? SITE_NAME),
    description,
    kicker: ogKicker,
    accent: ogAccent,
  });
  const pathname = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBaseUrl();
  const url = new URL(pathname, baseUrl).toString();
  const ogImageUrl = new URL(ogImagePath, baseUrl).toString();

  return {
    // Absolute: this helper already brands the title itself (word-boundary
    // logic above), so the root layout's "%s | Prisma" template must not
    // stack a second suffix on top.
    title: { absolute: title },
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
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prisma",
      creator: "@prisma",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
