import { pageContent } from "@prisma-docs/ui/lib/page-content";
import { blog as source } from "@/lib/source";
import { buildLlmsFullContent } from "@/lib/llms";
import { toLlmsPost } from "@/lib/llms-source";
import { getBaseUrl } from "@/lib/url";

export const revalidate = false;

export async function GET() {
  const entries = await Promise.all(
    source.getPages().map(async (page) => ({
      post: toLlmsPost(page),
      body: await (await pageContent(page.data)).getText("processed"),
    })),
  );

  return new Response(buildLlmsFullContent(entries, getBaseUrl()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
