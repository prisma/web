import {
  DATAGUIDE_ORIGIN,
  getDataguideMarkdownPath,
  getDataguidePagePath,
} from "@/lib/dataguide-markdown";
import { getBaseUrl } from "@/lib/url";

/**
 * Markdown for Data Guide pages on www: `/dataguide/<path>.md`,
 * `/dataguide/index.md`, and a Data Guide HTML URL requested by an agent.
 *
 * Two things route here:
 *  - the `/:path*.md` rewrite in next.config.mjs, which turns
 *    `/dataguide/<path>.md` into `/llms.mdx/dataguide/<path>`. This folder is
 *    more specific than `llms.mdx/[[...slug]]`, so it wins.
 *  - `src/proxy.ts`, when a request for a Data Guide HTML URL carries `Accept:
 *    text/markdown` or an agent user agent.
 *
 * The body is the Data Guide deployment's own Markdown export, byte for byte.
 * What this route adds is what the forward alone could not: the text/plain
 * content type the rest of www uses (ChatGPT's fetcher rejects text/markdown)
 * and the same `Vary` and `Link` headers as the site's other Markdown
 * responses.
 *
 * The Data Guide deploys on its own, so the export is read at request time
 * and cached for a few minutes rather than built into the site.
 */
const MARKDOWN_CONTENT_TYPE = "text/plain; charset=utf-8";
const UPSTREAM_REVALIDATE_SECONDS = 300;
/** Give up on a slow upstream well before the function's own time limit. */
const UPSTREAM_TIMEOUT_MS = 10_000;

function markdownHeaders(extra: Record<string, string>) {
  return { "Content-Type": MARKDOWN_CONTENT_TYPE, Vary: "Accept", ...extra };
}

function missingMarkdown(status: number) {
  const baseUrl = getBaseUrl();
  const content = `# Not found

There is no Markdown rendition of that page in Prisma's Data Guide.

## Options

- [Data Guide index](${new URL("/dataguide/llms.txt", baseUrl)})
- [Data Guide overview](${new URL("/dataguide/index.md", baseUrl)})
`;

  return new Response(content, { status, headers: markdownHeaders({}) });
}

/**
 * An agent asked for a Data Guide HTML URL that has no Markdown export: give
 * it the page it would have got without this route.
 */
async function pageFromDataguide(pagePath: string) {
  let page: Response;
  try {
    page = await fetch(new URL(pagePath, DATAGUIDE_ORIGIN), {
      cache: "no-store",
      // Pass a redirect through, as the plain forward would.
      redirect: "manual",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return new Response("Bad Gateway", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const headers = new Headers(page.headers);
  // fetch has already decoded the body.
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(page.body, { status: page.status, headers });
}

function isMarkdownExport(response: Response) {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  return (
    response.ok && (contentType.startsWith("text/markdown") || contentType.startsWith("text/plain"))
  );
}

export async function GET(
  request: Request,
  { params }: RouteContext<"/llms.mdx/dataguide/[...slug]">,
) {
  const { slug } = await params;
  const pagePath = getDataguidePagePath(slug);
  const markdownPath = getDataguideMarkdownPath(slug);
  if (!pagePath || !markdownPath) return missingMarkdown(404);

  // Set by src/proxy.ts when it rewrote an HTML URL here.
  const negotiated = request.headers.has("x-prisma-agent-markdown");

  let upstream: Response;
  try {
    upstream = await fetch(new URL(markdownPath, DATAGUIDE_ORIGIN), {
      next: { revalidate: UPSTREAM_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return negotiated ? pageFromDataguide(pagePath) : missingMarkdown(502);
  }

  if (!isMarkdownExport(upstream)) {
    if (negotiated) return pageFromDataguide(pagePath);
    return missingMarkdown(upstream.status >= 500 ? 502 : 404);
  }

  const baseUrl = getBaseUrl();
  return new Response(await upstream.text(), {
    headers: markdownHeaders({
      Link: `<${new URL(pagePath, baseUrl)}>; rel="canonical", <${new URL("/dataguide/llms.txt", baseUrl)}>; rel="llms-txt"`,
    }),
  });
}
