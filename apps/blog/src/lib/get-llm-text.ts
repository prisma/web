import { formatPostMarkdown, getPostSlugs } from "@/lib/llms";
import { toLlmsPost } from "@/lib/llms-source";
import { blog as source, type BlogPage } from "@/lib/source";
import { getBaseUrl } from "@/lib/url";

/**
 * One post's Markdown for its `.md` URL. Every post, drafts included, resolves
 * here because its HTML page resolves too; only the index and full file skip
 * drafts.
 */
export async function getLLMText(page: BlogPage) {
  const processed = await page.data.getText("processed");
  const postSlugs = getPostSlugs(source.getPages().map((candidate) => ({ path: candidate.url })));

  return formatPostMarkdown(toLlmsPost(page), processed, getBaseUrl(), postSlugs, {
    standalone: true,
  });
}
