import { buildSkillMarkdown } from "@/lib/agent-skills";

export const revalidate = false;

export async function GET() {
  return new Response(buildSkillMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
