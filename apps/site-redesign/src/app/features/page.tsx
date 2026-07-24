import type { Metadata } from "next"
import { HeroCentered } from "@/components/sections/hero-centered"
import { FeatureRows } from "@/components/sections/feature-rows"
import { IntegrationGrid } from "@/components/sections/integration-grid"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Features",
  description: "Explore all the features that make our product powerful.",
}

export default function FeaturesPage() {
  return (
    <>
      <HeroCentered />
      <FeatureRows />
      <IntegrationGrid />
      <CtaSimple />
    </>
  )
}
