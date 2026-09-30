import { agentSkillMarkdown } from "@/lib/agent-skill";

export const revalidate = false;

// text/plain, not text/markdown: ChatGPT's fetcher rejects text/markdown.
// See src/app/llms.mdx/[[...slug]]/route.ts.

export async function GET() {
  return new Response(agentSkillMarkdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
