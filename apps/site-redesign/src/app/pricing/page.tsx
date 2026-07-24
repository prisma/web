import type { Metadata } from "next"
import { PricingToggle } from "@/components/sections/pricing-toggle"
import { Comparison } from "@/components/sections/comparison"
import { Faq } from "@/components/sections/faq"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for every team size.",
}

export default function PricingPage() {
  return (
    <>
      <PricingToggle />
      <Comparison />
      <Faq />
      <CtaSimple />
    </>
  )
}
