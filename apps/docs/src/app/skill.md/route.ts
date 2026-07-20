import { agentSkillMarkdown } from "@/lib/agent-skill";

export const revalidate = false;

export async function GET() {
  return new Response(agentSkillMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
