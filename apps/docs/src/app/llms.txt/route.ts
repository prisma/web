import { source } from "@/lib/source";
import { getBaseUrl } from "@/lib/urls";
import { buildLLMsIndexContent } from "@/lib/llms";

export const revalidate = false;

export async function GET() {
  const content = buildLLMsIndexContent(source.getPages(), getBaseUrl());

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
