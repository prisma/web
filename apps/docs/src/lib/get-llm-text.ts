import { source, sourceV6 } from "@/lib/source";
import { withDocsBasePath } from "@/lib/urls";
import type { InferPageType } from "fumadocs-core/source";

export async function getLLMText(page: InferPageType<typeof source> | InferPageType<typeof sourceV6>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${withDocsBasePath(page.url)})

${processed}`;
}
