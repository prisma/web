import type { Metadata } from "next"
import { HeroCentered } from "@/components/sections/hero-centered"
import { HowItWorks } from "@/components/sections/how-it-works"
import { TestimonialSingle } from "@/components/sections/testimonial-single"
import { Faq } from "@/components/sections/faq"
import { CtaSplit } from "@/components/sections/cta-split"

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how to get started in three simple steps.",
}

export default function HowItWorksPage() {
  return (
    <>
      <HeroCentered />
      <HowItWorks />
      <TestimonialSingle />
      <Faq />
      <CtaSplit />
    </>
  )
}
