import { getLLMText } from "@/lib/get-llm-text";
import { getPageTitleText } from "@/lib/page-title";
import { source } from "@/lib/source";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export const revalidate = false;

const MAX_NEAREST_MATCH_SEGMENTS = 12;
const MAX_NEAREST_MATCH_PATH_LENGTH = 240;

function resolvePage(slug: string[] | undefined) {
  const slugs = slug ?? [];
  return source.getPage(slugs);
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

function getNearestPages(slug: string[] | undefined) {
  const requestedPath = getBoundedRequestedPath(slug);
  if (!requestedPath) return [];

  return source
    .getPages()
    .map((page) => ({
      page,
      distance: getDistance(requestedPath, normalizePath(page.url)),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .map(({ page }) => page);
}

function getMarkdownNotFoundResponse(slug: string[] | undefined) {
  const baseUrl = getBaseUrl();
  const nearestPages = getNearestPages(slug);
  const nearestLinks = nearestPages
    .map((page) => {
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [\`${getPageTitleText(page.data.title, page.url)}\`](${baseUrl}${withDocsBasePath(page.url)})${description}`;
    })
    .join("\n");

  const content = `# Not found

The requested documentation page was not found.

- [Documentation index](${baseUrl}${withDocsBasePath("/llms.txt")})
- [Full documentation](${baseUrl}${withDocsBasePath("/llms-full.txt")})

## Nearest matches

${nearestLinks || "_No nearby documentation pages found._"}
`;

  return new Response(content, {
    status: 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) return getMarkdownNotFoundResponse(slug);

  const content = await getLLMText(page);

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  // Only pre-render leaf pages to avoid file/dir conflicts during static export.
  // A slug is considered non-leaf if it is a prefix of any other slug.
  const params = source.generateParams();

  const seen = new Set<string>();
  const allParams = params.filter((p) => {
    const key = JSON.stringify(p.slug ?? []);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const allSlugs = allParams.map((p) => p.slug ?? []);
  const isPrefix = (a: string[], b: string[]) =>
    a.length < b.length && a.every((seg, i) => seg === b[i]);

  return allParams.filter((p) => {
    const s = p.slug ?? [];
    return !allSlugs.some((other) => isPrefix(s, other));
  });
}
