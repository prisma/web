import { AGENT_MARKDOWN_VARY } from "@/lib/agent-markdown";
import { canonicalLinkHeader, getPostCanonicalUrl } from "@/lib/canonical";
import { getLLMText } from "@/lib/get-llm-text";
import { findCanonicalSlug } from "@/lib/slug-fallback";
import { blog as source } from "@/lib/source";
import { withBlogBasePath } from "@/lib/url";

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
 * so a mis-cased legacy slug gets one permanent redirect instead of a 404. It
 * always goes to the canonical `.md` URL, so a plain `.md` request keeps getting
 * Markdown (the contract /blog/llms.txt documents) and an agent that src/proxy.ts
 * rewrote here gets the same Markdown in one hop.
 *
 * This route is static (`revalidate = false`), so it must not read
 * `request.headers`: in a production build that throws DYNAMIC_SERVER_USAGE
 * and the request ends in a 500 (it works in `next dev`, which hid it in #8402).
 */
function redirectToCanonicalSlug(slug: string[] | undefined): Response | undefined {
  if (slug?.length !== 1) return;

  const canonicalSlug = findCanonicalSlug(
    slug[0],
    source.getPages().map((candidate) => candidate.slugs[0]),
  );
  if (!canonicalSlug) return;

  // Unlike a page, a route handler's redirect does not get the base path added.
  return new Response(null, {
    status: 308,
    headers: {
      Location: withBlogBasePath(`/${canonicalSlug}.md`),
      Vary: AGENT_MARKDOWN_VARY,
    },
  });
}

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const page = source.getPage(slug);
  // src/proxy.ts sends an agent here from the post's own URL, so the 308 and
  // the empty 404 are negotiated responses too and name the same `Vary` as the
  // Markdown. They are built by hand because `permanentRedirect()` and
  // `notFound()` send only Next's RSC `Vary`.
  if (!page) {
    return (
      redirectToCanonicalSlug(slug) ??
      new Response(null, {
        status: 404,
        headers: {
          Vary: AGENT_MARKDOWN_VARY,
        },
      })
    );
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      // src/proxy.ts serves this body on the post's own URL too, picked by
      // `Accept` or the agent's User-Agent. The route is static, so the `.md`
      // URL gets the same value.
      Vary: AGENT_MARKDOWN_VARY,
      // Names the HTML post as the canonical URL, so the `.md` URL is not
      // indexed as a second copy of the post.
      Link: canonicalLinkHeader(getPostCanonicalUrl(page.url, page.data.canonicalUrl)),
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
