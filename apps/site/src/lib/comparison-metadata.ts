import { COMPARISONS, COMPARISON_INDEX, type ComparisonSlug } from "@/app/compare/comparisons";
import { createPageMetadata } from "./page-metadata";
import { getBaseUrl } from "./url";

/** Resolve a registered comparison's shared metadata and canonical path. */
function getComparison(slug: ComparisonSlug) {
  const entry = COMPARISONS.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown comparison: ${slug}`);
  return { ...entry, path: `/compare/${slug}` };
}

/** Describe a comparison as an article in social metadata. */
export function getComparisonMetadata(slug: ComparisonSlug) {
  const page = getComparison(slug);
  const metadata = createPageMetadata({ ...page, ogKicker: "Compare", ogAccent: "cyan" });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const } };
}

/** Describe the comparison article and its directory hierarchy without inventing publication dates. */
export function getComparisonStructuredData(slug: ComparisonSlug) {
  const page = getComparison(slug);
  const baseUrl = getBaseUrl();
  const url = new URL(page.path, baseUrl).toString();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: page.title,
        description: page.description,
        url,
        mainEntityOfPage: url,
        publisher: { "@id": `${baseUrl}#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: COMPARISON_INDEX.title,
            item: new URL(COMPARISON_INDEX.path, baseUrl).toString(),
          },
          { "@type": "ListItem", position: 2, name: page.competitor, item: url },
        ],
      },
    ],
  };
}
