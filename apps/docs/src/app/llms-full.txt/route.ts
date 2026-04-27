import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";

export const revalidate = false;

export async function GET() {
  const description = `# Prisma Documentation - Full Content Feed

This file contains the complete Prisma documentation in machine-readable format.
Includes v7 documentation only.

---

`;

  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(description + scanned.join("\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
