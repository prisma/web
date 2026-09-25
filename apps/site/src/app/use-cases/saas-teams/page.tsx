import { SaasIntroVisual } from "@/components/use-case/segment/abstractions/saas-teams";
import { saasTeamsUseCase } from "@/components/use-case/segment/content/saas-teams";
import { SegmentPage } from "@/components/use-case/segment/segment-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: `Prisma for ${saasTeamsUseCase.meta.title}`,
  description: saasTeamsUseCase.meta.description,
  path: "/use-cases/saas-teams",
  ogKicker: "Use cases",
});

export default function SaasTeamsRoute() {
  return <SegmentPage content={saasTeamsUseCase} introVisual={<SaasIntroVisual />} />;
}
