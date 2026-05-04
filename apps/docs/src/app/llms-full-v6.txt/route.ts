import { sourceV6 } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";
import { createLLMsFullResponse } from "@/lib/llms";

export const revalidate = false;

export async function GET() {
  const description = `# Prisma Documentation v6 - Legacy Full Content Feed

This file contains the complete Prisma v6 documentation in machine-readable format.
Use this legacy feed only for projects that are intentionally staying on Prisma ORM v6.

---

`;

  return createLLMsFullResponse(description, sourceV6.getPages(), getLLMText);
}
