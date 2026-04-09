import { SiteSearchResult } from "@/components/support/search-types";
import Mixedbread from "@mixedbread/sdk";
import { NextRequest, NextResponse } from "next/server";

type GeneratedMetadata = {
  title?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaImagePath?: string;
  heroImagePath?: string;
  tags?: string[];
  excerpt?: string;
  url?: string;
};

export const dynamic = "force-dynamic";

const mixedbreadApiKey = process.env.MIXEDBREAD_API_KEY;
const storeIdentifiers = ["blog-search", "web-search"] as const;
const client = mixedbreadApiKey
  ? new Mixedbread({ apiKey: mixedbreadApiKey })
  : null;
const websiteBaseUrl = "https://www.prisma.io";
const blogPrefix = "/blog";
const docsPrefix = "/docs";

type MixedbreadSearchChunk = {
  id?: string;
  file_id?: string;
  chunk_index?: number;
  text?: string;
  generated_metadata?: GeneratedMetadata;
};

function withPrefixedPath(
  path: string | undefined,
  prefix: string,
): string {
  const normalizedPath = (path ?? "")
    .replace(/^\/+/, "")
    .replace(new RegExp(`^${prefix.replace("/", "")}/`), "");

  return normalizedPath ? `${prefix}/${normalizedPath}` : "#";
}

function withBaseAndPrefixedPath(
  path: string | undefined,
  prefix: string,
): string {
  const prefixedPath = withPrefixedPath(path, prefix);
  return prefixedPath === "#"
    ? prefixedPath
    : new URL(prefixedPath, websiteBaseUrl).toString();
}

function normalizeBlogUrl(slug?: string): string {
  return withBaseAndPrefixedPath(slug, blogPrefix);
}

function normalizeBlogImagePath(imagePath?: string): string {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  const blogPath = withBaseAndPrefixedPath(imagePath, blogPrefix);
  return blogPath === "#" ? "" : blogPath;
}

function normalizeDocsUrl(url?: string): string {
  return withBaseAndPrefixedPath(url, docsPrefix);
}

function getDocsImagePath(normalizedDocsUrl: string): string {
  if (!normalizedDocsUrl || normalizedDocsUrl === "#") return "";
  const docsUrl = new URL(normalizedDocsUrl, websiteBaseUrl);
  const docsPath = docsUrl.pathname.replace(/^\/docs\//, "").replace(/^\/+/, "");
  return `https://www.prisma.io/docs/og/${docsPath}/image.png`;
}

function transformResult(item: MixedbreadSearchChunk): SiteSearchResult | null {
  const metadata = item.generated_metadata;
  if (!metadata) return null;

  const source: SiteSearchResult["source"] | null = metadata.slug
    ? "blog"
    : metadata.url
      ? "docs"
      : null;
  if (!source) return null;

  const base =
    item.id ?? `${item.file_id ?? "unknown"}-${item.chunk_index ?? "0"}`;

  const normalizedUrl =
    source === "blog"
      ? normalizeBlogUrl(metadata.slug)
      : normalizeDocsUrl(metadata.url);

  return {
    id: `${base}-page`,
    type: "page",
    source,
    content:
      source === "blog"
        ? metadata.metaTitle ?? metadata.title ?? item.text ?? "Untitled"
        : metadata.title ?? item.text ?? "Untitled",
    url: normalizedUrl,
    description:
      source === "blog"
        ? metadata.metaDescription ?? metadata.excerpt ?? item.text ?? ""
        : metadata.metaDescription ?? item.text ?? "",
    heroImagePath:
      source === "blog"
        ? normalizeBlogImagePath(
            metadata.heroImagePath ?? metadata.metaImagePath,
          )
        : getDocsImagePath(normalizedUrl),
    tags: source === "blog" ? metadata.tags ?? [] : [],
  };
}

function transformResults(results: MixedbreadSearchChunk[]): SiteSearchResult[] {
  return results
    .map(transformResult)
    .filter((item): item is SiteSearchResult => item !== null);
}

export async function GET(request: NextRequest) {
  if (!client) {
    console.error("Search API called but Mixedbread is not configured");
    console.error("Please set MIXEDBREAD_API_KEY environment variable");
    return NextResponse.json([]);
  }

  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const response = await client.stores.search({
      query,
      store_identifiers: [...storeIdentifiers],
      top_k: 20,
      search_options: {
        rerank: true,
        return_metadata: true,
      },
    });

    return NextResponse.json(
      transformResults(response.data as MixedbreadSearchChunk[]),
    );
  } catch (error) {
    console.error("Mixedbread search failed:", error);
    return NextResponse.json([]);
  }
}
