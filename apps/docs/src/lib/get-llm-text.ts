import { source } from "@/lib/source";
import { withDocsBasePath } from "@/lib/urls";
import type { InferPageType } from "fumadocs-core/source";

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${withDocsBasePath(page.url)})

${processed}`;
}
