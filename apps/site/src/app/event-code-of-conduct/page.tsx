import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { cocDescription, cocLastUpdated, cocSections } from "@/data/event-code-of-conduct";

export const metadata: Metadata = {
  alternates: { canonical: "/event-code-of-conduct" },
  title: "Event Code of Conduct",
  description: "Read our Event Code of Conduct and how it relates to you.",
};

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
