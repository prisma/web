import { EngineeringIntroVisual } from "@/components/use-case/segment/abstractions/engineering-teams";
import { engineeringTeamsUseCase } from "@/components/use-case/segment/content/engineering-teams";
import { SegmentPage } from "@/components/use-case/segment/segment-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: `Prisma for ${engineeringTeamsUseCase.meta.title}`,
  description: engineeringTeamsUseCase.meta.description,
  path: "/use-cases/engineering-teams",
  ogKicker: "Use cases",
});

export default function EngineeringTeamsRoute() {
  return <SegmentPage content={engineeringTeamsUseCase} introVisual={<EngineeringIntroVisual />} />;
}
