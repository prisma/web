import { createPageMetadata } from "@/lib/page-metadata";
import { slaSections, slaLastUpdated } from "@/data/sla";
import { LegalAccordion } from "@/components/legal-accordion";

export const metadata = createPageMetadata({
  title: "Service Level Agreement (SLA) | Prisma",
  description:
    "Explore our Service Level Agreement (SLA) detailing our monthly uptime percentage, service credits, and any exclusions.",
  path: "/sla",
  ogImage: "/og/og-sla.png",
});

export default function SlaPage() {
  return (
    <main className="flex-1 w-full z-1 -mt-24 pt-24 relative legal-hero-gradient">
      {/* Hero */}
      <div className="text-center pb-16 pt-40">
        <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
          Prisma Service Level Agreement
        </h1>
        <p className="text-lg text-foreground-neutral-weak">
          <b>Last updated:</b> {slaLastUpdated}
        </p>
      </div>

      {/* Separator */}
      <div className="max-w-[1248px] mx-auto px-2.5 md:px-6">
        <hr className="border-stroke-neutral" />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1248px] px-2.5 md:px-6 grid gap-4 grid-rows-[auto_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[1fr_640px_1fr] print:grid-cols-[100%]">
        <LegalAccordion sections={slaSections} />
      </div>
    </main>
  );
}
