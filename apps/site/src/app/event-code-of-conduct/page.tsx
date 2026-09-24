import { createPageMetadata } from "@/lib/page-metadata";
import { LegalPage } from "@/components/sections/legal-page";
import { cocDescription, cocLastUpdated, cocSections } from "@/data/event-code-of-conduct";

export const metadata = createPageMetadata({
  title: "Event Code of Conduct",
  description: "Read our Event Code of Conduct and how it relates to you.",
  path: "/event-code-of-conduct",
  ogKicker: "Events",
});

export default function EventCodeOfConductPage() {
  return (
    <LegalPage
      title="Event Code of Conduct"
      lastUpdated={cocLastUpdated}
      sections={cocSections}
      intro={cocDescription}
    />
  );
}
