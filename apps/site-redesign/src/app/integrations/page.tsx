import type { Metadata } from "next"
import { HeroCentered } from "@/components/sections/hero-centered"
import { IntegrationGrid } from "@/components/sections/integration-grid"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Integrations",
  description: "Connect the tools you already use with our platform.",
}

export default function IntegrationsPage() {
  return (
    <>
      <HeroCentered />
      <IntegrationGrid />
      <CtaSimple />
    </>
  )
}
