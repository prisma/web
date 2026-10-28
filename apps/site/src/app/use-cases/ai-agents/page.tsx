import { aiAgentsUseCase } from "@/components/use-case/ai-agents/content";
import { AiAgentsUseCasePage } from "@/components/use-case/ai-agents/ai-agents-page";
import { createPageMetadata } from "@/lib/page-metadata";

// The AI & Agents use case carries a different section set from the segment
// use cases (saas-teams, startups, engineering-teams), so it has its own
// composition rather than running through SegmentPage.
export const metadata = createPageMetadata({
  title: `Prisma for ${aiAgentsUseCase.meta.title}`,
  description: aiAgentsUseCase.meta.description,
  path: "/use-cases/ai-agents",
  ogKicker: "Use cases",
});

export default function AiAgentsRoute() {
  return <AiAgentsUseCasePage />;
}
