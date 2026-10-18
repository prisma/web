import { COMPARISONS, COMPARISON_INDEX, type ComparisonSlug } from "@/app/compare/comparisons";
import { createPageMetadata } from "./page-metadata";
import { getBaseUrl } from "./url";

/** Resolve a registered comparison's shared metadata and canonical path. */
function getComparison(slug: ComparisonSlug) {
  const entry = COMPARISONS.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown comparison: ${slug}`);
  return { ...entry, path: `/compare/${slug}` };
}

/** Describe a comparison as an article in social metadata, and advertise its Markdown. */
export function getComparisonMetadata(slug: ComparisonSlug) {
  const page = getComparison(slug);
  const metadata = createPageMetadata({ ...page, ogKicker: "Compare", ogAccent: "cyan" });
  const baseUrl = getBaseUrl();
  const types: Record<string, string> = {
    "text/markdown": new URL(`${page.path}.md`, baseUrl).toString(),
  };
  if (slug === "kysely" || slug === "mongoose" || slug === "convex") {
    types["application/json"] = new URL(`${page.path}.json`, baseUrl).toString();
  }
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types,
    },
    openGraph: {
      ...metadata.openGraph,
      type: "article" as const,
    },
  };
}

/** OG image URL from the comparison's page metadata. */
export function getComparisonOgImageUrl(slug: ComparisonSlug) {
  const page = getComparison(slug);
  const metadata = createPageMetadata({ ...page, ogKicker: "Compare", ogAccent: "cyan" });
  const og = metadata.openGraph;
  if (!og || !("images" in og) || og.images == null) {
    throw new Error(`Comparison metadata is missing an OG image: ${page.path}`);
  }
  const first = Array.isArray(og.images) ? og.images[0] : og.images;
  if (typeof first === "string") return first;
  if (first instanceof URL) return first.toString();
  if (typeof first === "object" && "url" in first) {
    return typeof first.url === "string" ? first.url : first.url.toString();
  }
  throw new Error(`Comparison OG image is not a URL: ${page.path}`);
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
