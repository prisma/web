import { buildLlmsIndexContent } from "@/lib/llms";
import { getLlmsPosts, getLlmsSeries } from "@/lib/llms-source";
import { getBaseUrl } from "@/lib/url";

export const revalidate = false;

export function GET() {
  return new Response(buildLlmsIndexContent(getLlmsPosts(), getLlmsSeries(), getBaseUrl()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
