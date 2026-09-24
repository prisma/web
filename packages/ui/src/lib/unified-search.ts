import Mixedbread from "@mixedbread/sdk";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { SortedResult } from "fumadocs-core/search";

type Source = "all" | "website" | "docs" | "blog";
const sources = new Set<string>(["all", "website", "docs", "blog"]);
type Chunk = {
  type?: string;
  text?: string | null;
  file_id?: string;
  chunk_index?: number;
  generated_metadata?: Record<string, unknown> | null;
  metadata?: unknown;
};

function slugger(value: string): string {
  if (typeof value !== "string") return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\s-]/g, "")
    .replace(/\s+/g, "-");
}

const headingParser = unified().use(remarkParse);
function extractHeadingTitle(text: string): string {
  const firstLine = text.trim().split("\n")[0] ?? "";
  const heading = headingParser.parse(firstLine).children[0];
  return heading?.type === "heading"
    ? toString(heading, { includeHtml: false, includeImageAlt: false })
    : "";
}

// These are the existing Mixedbread stores; do not replace them with a local index.
const stores = { website: "website-search", docs: "web-search", blog: "blog-search" };
function sourceOfUrl(url: string): Exclude<Source, "all"> {
  if (url === "/docs" || url.startsWith("/docs/")) return "docs";
  if (url === "/blog" || url.startsWith("/blog/")) return "blog";
  return "website";
}
function resultFromChunk(item: Chunk): SortedResult | undefined {
  const fileMetadata =
    typeof item.metadata === "object" && item.metadata !== null
      ? (item.metadata as Record<string, unknown>)
      : {};
  const metadata = { ...item.generated_metadata, ...fileMetadata };
  const website = fileMetadata.source === "website";
  const blog = !website && typeof metadata.slug === "string" && !!metadata.slug;
  const raw = blog ? metadata.slug : metadata.url;
  if (typeof raw !== "string" || !raw || raw === "#") return;
  let path: string;
  try {
    const url = new URL(
      raw.startsWith("/") || /^https?:\/\//.test(raw) ? raw : `/${raw}`,
      "https://www.prisma.io",
    );
    if (url.origin !== "https://www.prisma.io") return;
    path = url.pathname;
  } catch {
    return;
  }
  if (/^\/(?:docs\/)?eclipse(?:\/|$)/.test(path)) return;
  const source = website ? "website" : blog ? "blog" : "docs";
  if (!website && !new RegExp(`^/${source}(?:/|$)`).test(path)) path = `/${source}${path}`;
  if (website && sourceOfUrl(path) !== "website") return;
  path = path.replace(/^\/docs\/orm\/latest(?=\/|$)/, "/docs/orm");
  if (path.length > 1) path = path.replace(/\/$/, "");
  const title = blog ? metadata.metaTitle || metadata.title : metadata.title;
  return {
    id: `${item.file_id ?? path}-page`,
    type: "page",
    content: typeof title === "string" && title ? title : "Untitled",
    url: path,
    breadcrumbs: [website ? "Website" : blog ? "Blog" : "Docs"],
  };
}

export function createUnifiedSearch(getClient: () => Mixedbread) {
  async function searchPages(query: string, source: Source = "all"): Promise<SortedResult[]> {
    query = query.trim().slice(0, 200);
    if (!query || !/[\p{L}\p{N}]/u.test(query)) return [];
    const response = await getClient().stores.search({
      query,
      store_identifiers:
        source === "all" ? [stores.website, stores.docs, stores.blog] : [stores[source]],
      top_k: 20,
      search_options: { ...(source !== "blog" ? { rerank: true } : {}), return_metadata: true },
    });
    const seenPages = new Set<string>();
    const seenHeadings = new Set<string>();
    const results: SortedResult[] = [];
    for (const chunk of response.data) {
      const result = resultFromChunk(chunk);
      if (!result) continue;
      if (source !== "all" && sourceOfUrl(result.url) !== source) continue;
      if (!seenPages.has(result.url)) {
        seenPages.add(result.url);
        results.push(result);
      }
      if (result.url.startsWith("/docs/") && chunk.type === "text" && chunk.text) {
        const heading = extractHeadingTitle(chunk.text);
        const headingUrl = `${result.url}#${slugger(heading)}`;
        if (heading && !seenHeadings.has(headingUrl)) {
          seenHeadings.add(headingUrl);
          results.push({
            id: `${result.id}-${chunk.chunk_index}-heading`,
            type: "heading",
            content: heading,
            url: headingUrl,
          });
        }
      }
    }
    return results.slice(0, 30);
  }
  async function GET(request: Request) {
    const url = new URL(request.url);
    const source = url.searchParams.get("tag") || url.searchParams.get("source") || "all";
    if (!sources.has(source))
      return Response.json({ error: "Invalid search source." }, { status: 400 });
    const local = ["localhost", "127.0.0.1"].includes(url.hostname);
    const origins = {
      website:
        process.env.NEXT_SITE_ORIGIN || (local ? "http://localhost:3000" : "https://www.prisma.io"),
      docs:
        process.env.NEXT_DOCS_ORIGIN || (local ? "http://localhost:3001" : "https://www.prisma.io"),
      blog:
        process.env.NEXT_BLOG_ORIGIN || (local ? "http://localhost:3002" : "https://www.prisma.io"),
    };
    try {
      const results = await searchPages(url.searchParams.get("query") || "", source as Source);
      return Response.json(
        results.map((result) => {
          const kind = sourceOfUrl(result.url);
          return { ...result, url: new URL(result.url, origins[kind]).href };
        }),
      );
    } catch {
      // Do not log search text, credentials, or upstream response bodies.
      console.error("Mixedbread search is unavailable");
      return Response.json({ error: "Search is temporarily unavailable." }, { status: 503 });
    }
  }
  return { GET, searchPages };
}

let client: Mixedbread | undefined;
export const { GET, searchPages } = createUnifiedSearch(() => {
  if (!process.env.MIXEDBREAD_API_KEY) throw new Error("MIXEDBREAD_API_KEY is required");
  return (client ??= new Mixedbread({ apiKey: process.env.MIXEDBREAD_API_KEY }));
});
