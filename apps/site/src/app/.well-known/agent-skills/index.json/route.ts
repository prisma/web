import { buildAgentSkillsIndex } from "@/lib/agent-skills";

export const revalidate = false;

export async function GET() {
  return new Response(JSON.stringify(buildAgentSkillsIndex(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
