import { getLLMText } from "@/lib/get-llm-text";
import { blog as source } from "@/lib/source";
import { notFound } from "next/navigation";

export const revalidate = false;

/**
 * Markdown is served as text/plain, not text/markdown, as in apps/docs and
 * apps/site. ChatGPT's URL fetcher rejects text/markdown with "400
 * Unsupported content-type", and src/proxy.ts sends ChatGPT-User to this
 * route for ordinary post URLs. text/plain is read by every assistant and by
 * every browser, so nothing loses out.
 */
const MARKDOWN_CONTENT_TYPE = "text/plain; charset=utf-8";

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
