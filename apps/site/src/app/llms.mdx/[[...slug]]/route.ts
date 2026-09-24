import {
  AGENT_MARKDOWN_PATHS,
  getMarkdownUrlPath,
  type AgentMarkdownPath,
} from "@/lib/agent-markdown";
import { getMarkdownPage, markdownPageList, renderMarkdownDocument } from "@/lib/markdown-pages";
import { getBaseUrl } from "@/lib/url";

/**
 * Markdown renditions of the marketing pages.
 *
 * Three things route here:
 *  - `/:path*.md` and `/:path*.mdx` rewrites in next.config.mjs, so `/orm.md`
 *    and `/index.md` work as URLs an agent can guess or read off the `Link`
 *    header.
 *  - `src/proxy.ts`, when a request for the HTML URL carries `Accept:
 *    text/markdown` or an agent user agent.
 *  - `/llms-full.txt`, which embeds the same bodies.
 *
 * Mirrors apps/docs/src/app/llms.mdx/[[...slug]]/route.ts, including the
 * nearest-match suggestions on a miss and `revalidate = false` so the
 * renditions are built once.
 */
export const revalidate = false;

/** Guards the Levenshtein pass below against a pathological request path. */
const MAX_NEAREST_MATCH_SEGMENTS = 12;
const MAX_NEAREST_MATCH_PATH_LENGTH = 240;

/**
 * `/` is served as `/llms.mdx` (empty slug), but `/index.md` — the URL the
 * homepage's `Link: rel="alternate"` header advertises, since `/.md` is not a
 * URL anyone would type — rewrites to `/llms.mdx/index`. Both mean the
 * homepage.
 */
function resolvePath(slug: string[] | undefined): AgentMarkdownPath | undefined {
  const slugs = (slug ?? []).filter(Boolean);
  if (slugs.length === 0) return "/";
  if (slugs.length === 1 && slugs[0] === "index") return "/";

  const page = getMarkdownPage(`/${slugs.join("/")}`);
  return page?.path;
}

function normalizePath(path: string) {
  return path.toLowerCase().replace(/[^a-z0-9/]+/g, "-");
}

function getDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function getBoundedRequestedPath(slug: string[] | undefined) {
  const slugs = slug ?? [];
  if (slugs.length > MAX_NEAREST_MATCH_SEGMENTS) return undefined;

  const requestedPath = `/${slugs.join("/")}`;
  if (requestedPath.length > MAX_NEAREST_MATCH_PATH_LENGTH) return undefined;

  return normalizePath(requestedPath);
}

function getNearestPaths(slug: string[] | undefined) {
  const requestedPath = getBoundedRequestedPath(slug);
  if (!requestedPath) return [];

  return markdownPageList
    .map((page) => ({ page, distance: getDistance(requestedPath, normalizePath(page.path)) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(({ page }) => page);
}

function markdownHeaders(extra: Record<string, string>) {
  // Cache-Control is deliberately not set, which is what the site's other
  // text/markdown responders (changelog.md, skill.md, .well-known/agent-skills)
  // do: `revalidate = false` makes these static, and Next and the CDN then
  // apply the same caching the rest of the site gets. Pinning a value here
  // would opt the renditions out of it.
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    // The same URL answers HTML to a browser and Markdown to an agent, so a
    // shared cache has to key the two variants apart.
    Vary: "Accept",
    ...extra,
  };
}

function notFoundResponse(slug: string[] | undefined) {
  const baseUrl = getBaseUrl();
  const nearest = getNearestPaths(slug);

  const available = markdownPageList
    .map((page) => `- [${page.title}](${new URL(getMarkdownUrlPath(page.path), baseUrl)})`)
    .join("\n");
  const suggestions = nearest
    .map((page) => `- [${page.title}](${new URL(getMarkdownUrlPath(page.path), baseUrl)})`)
    .join("\n");

  const content = `# Not found

There is no Markdown rendition of that page on www.prisma.io.

Documentation and blog posts serve their own Markdown from their own zones:
append \`.md\` to any [/docs](${new URL("/docs", baseUrl)}) or [/blog](${new URL("/blog", baseUrl)}) URL.

${suggestions ? `## Nearest matches\n\n${suggestions}\n\n` : ""}## Available Markdown pages

${available}

## Options

- [Website index](${new URL("/llms.txt", baseUrl)})
- [Full website content](${new URL("/llms-full.txt", baseUrl)})
`;

  return new Response(content, {
    status: 404,
    headers: markdownHeaders({}),
  });
}

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const path = resolvePath(slug);
  if (!path) return notFoundResponse(slug);

  const page = getMarkdownPage(path);
  if (!page) return notFoundResponse(slug);

  const baseUrl = getBaseUrl();
  const canonical = new URL(page.path, baseUrl).toString();
  const llmsTxt = new URL("/llms.txt", baseUrl).toString();

  return new Response(renderMarkdownDocument(page, baseUrl), {
    headers: markdownHeaders({
      Link: `<${canonical}>; rel="canonical", <${llmsTxt}>; rel="llms-txt"`,
    }),
  });
}

/**
 * Prerenders one rendition per supported page, plus `/llms.mdx/index` for the
 * homepage's `.md` URL. The bare `/llms.mdx` (empty slug) case is what the
 * proxy rewrites the homepage to.
 */
export function generateStaticParams() {
  return [
    { slug: [] as string[] },
    { slug: ["index"] },
    ...AGENT_MARKDOWN_PATHS.filter((path) => path !== "/").map((path) => ({
      slug: path.slice(1).split("/"),
    })),
  ];
}
