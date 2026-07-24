import type { Metadata } from "next"
import { HeroCentered } from "@/components/sections/hero-centered"
import { FounderLetter } from "@/components/sections/founder-letter"
import { TeamGrid } from "@/components/sections/team-grid"
import { Stats } from "@/components/sections/stats"
import { TestimonialSingle } from "@/components/sections/testimonial-single"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about our mission and the team behind the product.",
}

export default function AboutPage() {
  return (
    <>
      <HeroCentered />
      <FounderLetter />
      <TeamGrid />
      <Stats />
      <TestimonialSingle />
      <CtaSimple />
    </>
  )
}
