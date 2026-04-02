import { createPageMetadata } from "@/lib/page-metadata";
import { termsSections, termsLastUpdated } from "@/data/terms";
import { LegalAccordion } from "@/components/legal-accordion";

export const metadata = createPageMetadata({
  title: "Terms of Service | Prisma",
  description:
    "Read the Prisma Terms of Service governing your use of Prisma products and services.",
  path: "/terms",
  ogImage: "/og/og-terms.png",
});

export default function TermsPage() {
  return (
    <main className="flex-1 w-full z-1 -mt-24 relative legal-hero-gradient">
      {/* Hero */}
      <div className="text-center pb-16 pt-40 my-24">
        <h1 className="text-5xl md:text-6xl font-bold font-sans-display text-foreground-neutral mb-6">
          Terms of Service
        </h1>
        <p className="text-lg text-foreground-neutral-weak">
          <b>Last updated:</b> {termsLastUpdated}
        </p>
      </div>

      {/* Separator */}
      <div className="max-w-[1248px] mx-auto px-2.5 md:px-6">
        <hr className="border-stroke-neutral" />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1248px] px-2.5 md:px-6 grid gap-4 grid-rows-[auto_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[1fr_640px_1fr] print:grid-cols-[100%]">
        <LegalAccordion sections={termsSections} />
      </div>
    </main>
  );
}
