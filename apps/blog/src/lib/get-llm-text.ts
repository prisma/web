import { blog as source } from "@/lib/source";
import { formatPostMarkdown, getPostSlugs } from "@/lib/llms";
import { toLlmsPost } from "@/lib/llms-source";
import { getBaseUrl } from "@/lib/url";
import type { InferPageType } from "fumadocs-core/source";

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");
  const postSlugs = getPostSlugs(source.getPages().map((candidate) => ({ path: candidate.url })));

  return formatPostMarkdown(toLlmsPost(page), processed, getBaseUrl(), postSlugs);
}
