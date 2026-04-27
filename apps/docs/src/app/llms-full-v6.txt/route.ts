import { sourceV6 } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";

export const revalidate = false;

export async function GET() {
  const description = `# Prisma Documentation v6 - Legacy Full Content Feed

This file contains the complete Prisma v6 documentation in machine-readable format.
Use this legacy feed only for projects that are intentionally staying on Prisma ORM v6.

---

`;

  const scan = sourceV6.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(description + scanned.join("\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
