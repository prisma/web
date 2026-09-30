import { createPageMetadata } from "@/lib/page-metadata";
import { computeContent } from "@/components/product/content/compute";
import { ProductCta } from "@/components/product/product-cta";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductHero } from "@/components/product/product-hero";
import { ProductPlatform } from "@/components/product/product-platform";
import { ProductProblem } from "@/components/product/product-problem";
import { CompareLinks } from "@/components/sections/compare-links";
import { Faq } from "@/components/sections/faq";

export const metadata = createPageMetadata({
  title: "Prisma Compute | Deploy TypeScript Apps and AI Agents on Bun",
  // The entity wording shared with the homepage, /postgres and the docs, kept
  // verbatim. lib/markdown-pages.ts repeats it for the .md rendition.
  description:
    "Prisma Compute hosts TypeScript apps (Node.js, Bun or Next.js) next to Prisma Postgres on one plan. Generally available since August 2026. Free plan, no credit card. Any Postgres client works; Prisma ORM is optional.",
  path: "/compute",
  ogKicker: "Prisma Compute",
  ogAccent: "red",
});

// /compute composes the product sections directly, like /orm: V4 gives this page
// no testimonial section, so it can't go through ProductPage. Apart from that
// it is the template's shape, including the two optional sections ProductPage
// renders for /postgres: the shared "Compare Prisma" list and a visible FAQ,
// both read from computeContent so lib/markdown/product.ts prints them in the
// same order.
export default function ComputePage() {
  return (
    <>
      <ProductHero
        name={computeContent.name}
        accent={computeContent.accent}
        hero={computeContent.hero}
      />
      <ProductProblem problem={computeContent.problem} />
      <ProductFeatures features={computeContent.features} />
      <ProductPlatform platform={computeContent.platform} />
      {computeContent.compare ? <CompareLinks intro={computeContent.compare.intro} /> : null}
      {computeContent.faq ? <Faq items={computeContent.faq} /> : null}
      <ProductCta cta={computeContent.cta} />
    </>
  );
}
