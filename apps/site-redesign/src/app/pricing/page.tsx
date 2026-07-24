import type { Metadata } from "next"
import { PricingHero } from "@/components/sections/pricing-hero"
import { PricingHowItWorks } from "@/components/sections/pricing-how-it-works"
import { PricingIncludes } from "@/components/sections/pricing-includes"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Usage-based pricing by operation — pay for the queries your app runs, not seats or deploys. Free tier with no time limit, hard spend limits on every paid plan.",
}

// Rebuild in progress from the approved V2 pricing copy — sections land one
// at a time (plans, comparison, calculator, FAQs still to come).
export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingHowItWorks />
      <PricingIncludes />
    </>
  )
}
