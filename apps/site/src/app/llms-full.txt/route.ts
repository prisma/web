import { buildLlmsFullContent } from "../llms-content";

export const revalidate = false;

export async function GET() {
  return new Response(buildLlmsFullContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
