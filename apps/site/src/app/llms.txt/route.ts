import { buildLlmsIndexContent } from "../llms-content";

export const revalidate = false;

export async function GET() {
  return new Response(buildLlmsIndexContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
