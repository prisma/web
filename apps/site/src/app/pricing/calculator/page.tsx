import { StaticReveals } from "@/components/motion/reveal";
import { PricingCalculator } from "@/components/sections/pricing-calculator";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Pricing Calculator | Estimate Your Prisma Compute and Postgres Bill",
  description:
    "Estimate your monthly bill for Prisma Compute and Prisma Postgres. Pick what you're building and roughly how big it is, fine-tune the usage, and see the cheapest plan that covers it.",
  path: "/pricing/calculator",
  ogKicker: "Pricing",
});

// The calculator on its own page (client, 2026-11-24: "create an entirely new
// page for the calculator and move it there"). /pricing links here from its
// plans footer, its "Estimate your bill" section and the comparison note.
// The estimate lives in the page address (?app=…&requests=…), so a copied
// link reopens it here as it did on /pricing.
export default function PricingCalculatorPage() {
  return (
    // Nothing animates in, as on /pricing (client, 2026-11-22).
    <StaticReveals>
      <PricingCalculator />
    </StaticReveals>
  );
}
