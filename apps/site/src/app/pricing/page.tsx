import type { Metadata } from "next";
import { CtaBurst } from "@/components/sections/cta-burst";
import { PricingCalculator } from "@/components/sections/pricing-calculator";
import { PricingComparison } from "@/components/sections/pricing-comparison";
import { PricingFaq } from "@/components/sections/pricing-faq";
import { PricingHero } from "@/components/sections/pricing-hero";
import { PricingHowItWorks } from "@/components/sections/pricing-how-it-works";
import { PricingPlans } from "@/components/sections/pricing-plans";
import { PricingSpecTable } from "@/components/sections/pricing-spec-table";
import { TestimonialsReveal } from "@/components/sections/testimonials-reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing",
  description:
    "Usage-based pricing for your whole stack — Prisma Compute app hosting and Prisma Postgres databases. Pay for the work your app does, not seats or deploys. Free tier with no time limit, hard spend limits on every paid plan.",
};

// Built from the approved V2 pricing copy, in V2's order (CTA then FAQs).
// Compute GA launch (Shane, 2026-08-24): Compute pricing lives inside the
// existing structures — included allowances on the plan cards, rates and
// allowances as a group in the spec table — NOT as a separate section, hero
// subhead, or strip (all three were tried and removed on Shane's feedback:
// "we already have a table for these things").
// "Every plan includes" is the right-hand column of PricingHowItWorks; the
// calculator's three entry points double as its preset selector.
//
// Plan cards sit directly under the hero panel, ahead of the how-it-works
// copy, per the client (2026-07-30) — Shane asked for the table to be
// reachable without scrolling. The hero subhead still defines an operation
// before the cards quote operation counts, so the definition precedes the
// number even though the full explanation now follows the cards.
// Still to come: the full limits table Ankur asked for — blocked on the
// unanswered rows (Free-tier backups, compliance on Free/Starter, support).
export default function PricingPage() {
  return (
    <>
      {/* The headline and the plan cards share the hero's wrapped panel, per the
          client (2026-07-30) — the page resumes outside it from how-it-works on. */}
      <PricingHero>
        <PricingPlans />
      </PricingHero>
      <PricingHowItWorks />
      <PricingCalculator />
      <PricingComparison />
      <PricingSpecTable />
      <TestimonialsReveal />
      {/* V2's closing CTA, copy verbatim. CtaBurst is the site's CTA idiom —
          fully parameterised, so this is copy only, no new component. */}
      <CtaBurst
        headline="Start building on Prisma today"
        headlineMaxWidth="max-w-[24ch]"
        body="Prisma ORM is free and always will be. Spin up a Prisma Postgres database and deploy your first app in minutes."
        checks={[
          {
            label: "No credit card required to start",
            color: "text-prism-cyan-500",
          },
          {
            label: "Free tier with no time limit",
            color: "text-prism-yellow-400",
          },
          {
            label: "Upgrade or downgrade anytime",
            color: "text-prism-red-500",
          },
        ]}
        primaryCta={{
          label: "Get started free",
          href: "https://console.prisma.io/sign-up",
        }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />
      <PricingFaq />
    </>
  );
}
