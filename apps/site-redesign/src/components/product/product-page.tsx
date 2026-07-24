import { CtaBurst } from "@/components/sections/cta-burst"
import { TestimonialsReveal } from "@/components/sections/testimonials-reveal"
import { ProductFeatures } from "./product-features"
import { ProductHero } from "./product-hero"
import { ProductPlatform } from "./product-platform"
import { ProductProblem } from "./product-problem"
import type { ProductPageContent } from "./types"

const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"]

// Generic product page (Notion outline "Product Page Template Copy" V1).
// Instantiate by passing a ProductPageContent — one per Platform route.
export function ProductPage({ content }: { content: ProductPageContent }) {
  const ctaChecks = [
    ...content.cta.benefits,
    "The TypeScript stack 500,000+ developers already trust",
  ].map((label, i) => ({ label, color: CHECK_COLORS[i % 3] }))

  return (
    <>
      <ProductHero name={content.name} hero={content.hero} />
      <ProductProblem problem={content.problem} />
      <ProductFeatures features={content.features} />
      <ProductPlatform platform={content.platform} />
      <TestimonialsReveal heading="Trusted by 500K+ TypeScript developers" />
      <CtaBurst
        headlineMaxWidth="max-w-[30ch]"
        bodyMaxWidth="max-w-[78ch]"
        headline={
          <>
            Start with what you need.
            <br className="max-sm:hidden" />
            <span className="sm:hidden"> </span>
            Keep everything else in reach.
          </>
        }
        body={`${content.name} is part of an integrated TypeScript stack built to work end-to-end. Your agent drives all of it from one CLI and API — no vendor stitching.`}
        checks={ctaChecks}
        primaryCta={content.cta.primaryCta}
        secondaryCta={content.cta.secondaryCta}
      />
    </>
  )
}
