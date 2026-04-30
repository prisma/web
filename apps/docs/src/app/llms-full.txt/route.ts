import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";
import { createLLMsFullResponse } from "@/lib/llms";

export const revalidate = false;

export async function GET() {
  const description = `# Prisma Documentation - Full Content Feed

This file contains the complete Prisma documentation in machine-readable format.
Includes v7 documentation only.

---

`;

  return createLLMsFullResponse(description, source.getPages(), getLLMText);
}
