import { StartupsIntroVisual } from "@/components/use-case/segment/abstractions/startups";
import { startupsUseCase } from "@/components/use-case/segment/content/startups";
import { SegmentPage } from "@/components/use-case/segment/segment-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: `Prisma for ${startupsUseCase.meta.title}`,
  description: startupsUseCase.meta.description,
  path: "/use-cases/startups",
  ogKicker: "Use cases",
});

export default function StartupsRoute() {
  return <SegmentPage content={startupsUseCase} introVisual={<StartupsIntroVisual />} />;
}
