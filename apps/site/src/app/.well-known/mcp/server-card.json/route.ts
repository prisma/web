import { buildMcpServerCard } from "@/lib/agent-skills";

export const revalidate = false;

export async function GET() {
  return new Response(JSON.stringify(buildMcpServerCard(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
