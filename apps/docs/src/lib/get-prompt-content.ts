import { source } from "@/lib/source";

/**
 * Extracts the full prompt text from a prompt MDX page.
 * The prompt is expected to be inside a ````md code fence.
 */
export async function getPromptContent(slug: string) {
  const page = source.getPage(["ai", "prompts", slug]);
  if (!page) return null;

  const processed = await page.data.getText("processed");
  const match = processed.match(/````md\n([\s\S]*?)\n````/);
  if (!match) return null;

  return {
    fullPrompt: match[1],
    promptPageUrl: page.url,
  };
}
