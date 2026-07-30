import { TestimonialsReveal } from "@/components/sections/testimonials-reveal";
import { ProductCta } from "./product-cta";
import { ProductFeatures } from "./product-features";
import { ProductHero } from "./product-hero";
import { ProductPlatform } from "./product-platform";
import { ProductProblem } from "./product-problem";
import type { ProductPageContent } from "./types";

// The standard product page shape, for routes whose approved copy doesn't add
// sections beyond it. Pages that do — /orm carries two extra top-level sections
// in V4 — compose these same section components directly instead; see
// app/orm/page.tsx.
export function ProductPage({ content }: { content: ProductPageContent }) {
  return (
    <>
      <ProductHero name={content.name} hero={content.hero} />
      <ProductProblem problem={content.problem} />
      <ProductFeatures features={content.features} />
      <ProductPlatform platform={content.platform} />
      <TestimonialsReveal heading="Trusted by 500K+ TypeScript developers" />
      <ProductCta cta={content.cta} />
    </>
  );
}
