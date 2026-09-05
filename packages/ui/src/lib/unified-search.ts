import { createSearchAPI } from "fumadocs-core/search/server";
import index from "./search-index";

const labels = { website: "Website", docs: "Docs", blog: "Blog" };
// Fumadocs builds and reuses an in-memory Orama index lazily on the first query.
const engines = new Map<string, ReturnType<typeof createSearchAPI>>();
export async function searchPages(query: string, source = "all") {
  if (!query.trim() || !/[\p{L}\p{N}]/u.test(query)) return [];
  if (!engines.has(source)) {
    engines.set(
      source,
      createSearchAPI("simple", {
        indexes: index
          .filter((page) => source === "all" || page.source === source)
          .map((page) => ({
            title: page.title,
            description: page.description,
            content: page.keywords,
            url: page.url,
            breadcrumbs: [labels[page.source as keyof typeof labels], ...page.url.split("/").filter(Boolean).slice(1, -1)],
          })),
        search: { limit: 30, tolerance: 1, boost: { title: 5 } },
      }),
    );
  }
  return engines.get(source)!.search(query.trim().slice(0, 200));
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = url.searchParams.get("tag") || url.searchParams.get("source") || "all";
  if (!["all", "website", "docs", "blog"].includes(source))
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
  const results = await searchPages(url.searchParams.get("query") || "", source);
  return Response.json(
    results.map((result) => {
      const kind = result.url.startsWith("/docs")
        ? "docs"
        : result.url.startsWith("/blog")
          ? "blog"
          : "website";
      return { ...result, url: new URL(result.url, origins[kind]).href };
    }),
  );
}
