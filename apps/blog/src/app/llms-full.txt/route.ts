import { buildLlmsFullContent, getPostSlugs } from "@/lib/llms";
import { toLlmsPost } from "@/lib/llms-source";
import { blog as source, getPublishedPages } from "@/lib/source";
import { getBaseUrl } from "@/lib/url";

export const revalidate = false;

export async function GET() {
  const entries = await Promise.all(
    getPublishedPages().map(async (page) => ({
      post: toLlmsPost(page),
      body: await page.data.getText("processed"),
    })),
  );
  // Every post, drafts included: a link to a draft still points at a live page.
  const postSlugs = getPostSlugs(source.getPages().map((page) => ({ path: page.url })));

  return new Response(buildLlmsFullContent(entries, getBaseUrl(), postSlugs), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
