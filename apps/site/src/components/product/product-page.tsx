import { CompareLinks } from "@/components/sections/compare-links";
import { Faq } from "@/components/sections/faq";
import { TestimonialsReveal } from "@/components/sections/testimonials-reveal";
import { ProductCta } from "./product-cta";
import { ProductFeatures } from "./product-features";
import { ProductHero } from "./product-hero";
import { ProductPlatform } from "./product-platform";
import { ProductProblem } from "./product-problem";
import type { ProductPageContent } from "./types";

// The standard product page shape, for routes whose approved copy doesn't add
// sections beyond it. Pages that do (for example, /orm carries two extra
// top-level sections in V4) compose these same section components directly
// instead; see app/orm/page.tsx.
//
// `faqId` makes the FAQ section a deep-link target: /postgres sets "faq" so
// /postgres#faq scrolls to the heading. It is page-scoped, so other product
// pages leave it off and their FAQ sections stay without an id.
export function ProductPage({ content, faqId }: { content: ProductPageContent; faqId?: string }) {
  return (
    <>
      <ProductHero name={content.name} accent={content.accent} hero={content.hero} />
      <ProductProblem problem={content.problem} />
      <ProductFeatures features={content.features} />
      <ProductPlatform platform={content.platform} />
      {/* Optional, content-driven: the "Compare Prisma" list and the FAQ sit
          between the platform section and the testimonials, and the Markdown
          rendition (lib/markdown/product.ts) mirrors that order. */}
      {content.compare ? <CompareLinks intro={content.compare.intro} /> : null}
      {content.faq ? <Faq items={content.faq} id={faqId} /> : null}
      <TestimonialsReveal heading="Trusted by 500K+ TypeScript developers" />
      <ProductCta cta={content.cta} />
    </>
  );
}
