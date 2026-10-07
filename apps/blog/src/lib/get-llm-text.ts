import { blog as source } from "@/lib/source";
import { formatPostMarkdown } from "@/lib/llms";
import { toLlmsPost } from "@/lib/llms-source";
import { getBaseUrl } from "@/lib/url";
import type { InferPageType } from "fumadocs-core/source";

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return formatPostMarkdown(toLlmsPost(page), processed, getBaseUrl());
}
