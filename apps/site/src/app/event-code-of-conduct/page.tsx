import { createPageMetadata } from "@/lib/page-metadata";
import {
  cocSections,
  cocLastUpdated,
  cocDescription,
} from "@/data/event-code-of-conduct";
import { LegalAccordion } from "@/components/legal-accordion";

export const metadata = createPageMetadata({
  title: "Event Code of Conduct | Prisma",
  description:
    "All attendees, speakers, sponsors, and volunteers at Prisma events are required to agree to this code of conduct.",
  path: "/event-code-of-conduct",
  ogImage: "/og/og-event-code-of-conduct.png",
});

export default function EventCodeOfConductPage() {
  return (
    <main className="flex-1 w-full z-1 -mt-24 pt-24 relative legal-hero-gradient">
      {/* Hero */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold font-sans-display text-foreground-neutral mb-6">
          Event Code of Conduct
        </h1>
        <p className="max-w-[640px] mx-auto text-lg text-foreground-neutral-weak text-left mb-6">
          {cocDescription}
        </p>
        <p className="text-lg text-foreground-neutral-weak">
          <b>Last updated:</b> {cocLastUpdated}
        </p>
      </div>

      {/* Separator */}
      <div className="max-w-[1248px] mx-auto px-2.5 md:px-6">
        <hr className="border-stroke-neutral" />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1248px] px-2.5 md:px-6 grid gap-4 grid-rows-[auto_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[1fr_640px_1fr] print:grid-cols-[100%]">
        <LegalAccordion sections={cocSections} />
      </div>
    </main>
  );
}
