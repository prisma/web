import { getLLMText } from "@/lib/get-llm-text";
import { findCanonicalSlug } from "@/lib/slug-fallback";
import { blog as source } from "@/lib/source";
import { withBlogBasePath } from "@/lib/url";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = false;

/**
 * Markdown is served as text/plain, not text/markdown, as in apps/docs and
 * apps/site. ChatGPT's URL fetcher rejects text/markdown with "400
 * Unsupported content-type", and src/proxy.ts sends ChatGPT-User to this
 * route for ordinary post URLs. text/plain is read by every assistant and by
 * every browser, so nothing loses out.
 */
const MARKDOWN_CONTENT_TYPE = "text/plain; charset=utf-8";

/**
 * The same case-insensitive recovery as the post page (see `@/lib/slug-fallback`),
 * so a mis-cased legacy slug gets one permanent redirect instead of a 404. A
 * request that src/proxy.ts rewrote here goes back to the post URL, where the
 * proxy serves its Markdown again; a direct `.md` request goes to the canonical
 * `.md`.
 */
function redirectToCanonicalSlug(request: Request, slug: string[] | undefined) {
  if (slug?.length !== 1) return;

  const canonicalSlug = findCanonicalSlug(
    slug[0],
    source.getPages().map((candidate) => candidate.slugs[0]),
  );
  if (!canonicalSlug) return;

  // Unlike a page, a route handler's redirect does not get the base path added.
  const viaProxy = request.headers.has("x-prisma-agent-markdown");
  permanentRedirect(withBlogBasePath(viaProxy ? `/${canonicalSlug}` : `/${canonicalSlug}.md`));
}

export async function GET(request: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    redirectToCanonicalSlug(request, slug);
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
