import type { Metadata } from "next";
import { partnersTosSections, partnersTosLastUpdated } from "@/data/partners-tos";
import { LegalAccordion } from "@/components/legal-accordion";

export const metadata: Metadata = {
  title: "Partner Network Terms of Service | Prisma",
  description:
    "Terms of Service for the Prisma Partner Network covering affiliates, technology partners, and resellers.",
};

export default function PartnersTosPage() {
  return (
    <main className="flex-1 w-full z-1 -mt-24 pt-24 relative legal-hero-gradient">
      {/* Hero */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold font-sans-display text-foreground-neutral mb-6">
          Terms of Service Prisma Partner Network
        </h1>
        <p className="text-lg text-foreground-neutral-weak">
          <b>Last updated:</b> {partnersTosLastUpdated}
        </p>
      </div>

      {/* Separator */}
      <div className="max-w-[1248px] mx-auto px-2.5 md:px-6">
        <hr className="border-stroke-neutral" />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1248px] px-2.5 md:px-6 grid gap-4 grid-rows-[auto_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[1fr_640px_1fr] print:grid-cols-[100%]">
        <LegalAccordion sections={partnersTosSections} />
      </div>
    </main>
  );
}
