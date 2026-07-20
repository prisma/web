import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";
import { createLLMsFullResponse, getLLMsFullPages } from "@/lib/llms";
import { getBaseUrl, withDocsBasePath } from "@/lib/urls";

export const revalidate = false;

export async function GET() {
  const baseUrl = getBaseUrl();
  const llmsTxtUrl = `${baseUrl}${withDocsBasePath("/llms.txt")}`;

  const description = `# Prisma Documentation - Full Content Feed

This file contains the current Prisma documentation in machine-readable format.
Legacy Prisma ORM v6 content is not included here; fetch any v6 page directly by
appending \`.md\` to its URL (for example, ${baseUrl}${withDocsBasePath("/orm/v6/...")}.md).
For the documentation index, see ${llmsTxtUrl}.

---

`;

  const pages = getLLMsFullPages(source.getPages());

  return createLLMsFullResponse(description, pages, getLLMText);
}
