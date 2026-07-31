import type { Metadata } from "next";
import { TestimonialsReveal } from "@/components/sections/testimonials-reveal";
import { ormContent, ormFeedback, ormMigrations } from "@/components/product/content/orm";
import { FeedbackLoop } from "@/components/product/illustrations/feedback-loop";
import { MigrationGraph } from "@/components/product/illustrations/migration-graph";
import { ProductCta } from "@/components/product/product-cta";
import { ProductDetailBlocks } from "@/components/product/product-detail-blocks";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductHero } from "@/components/product/product-hero";
import { ProductNarrative } from "@/components/product/product-narrative";
import { ProductPlatform } from "@/components/product/product-platform";
import { ProductProblem } from "@/components/product/product-problem";

export const metadata: Metadata = {
  title: "Prisma ORM",
  description: "Give your agent database access it can't get wrong.",
};

// /orm composes the product sections directly rather than going through
// ProductPage: V4 puts two extra top-level sections on this page — the
// migrations argument between the problem and the features, and the feedback
// blocks after them — in that order.
export default function OrmPage() {
  return (
    <>
      <ProductHero name={ormContent.name} accent={ormContent.accent} hero={ormContent.hero} />
      <ProductProblem problem={ormContent.problem} />
      <ProductNarrative
        headline={ormMigrations.headline}
        paragraphs={ormMigrations.paragraphs}
        illustration={<MigrationGraph />}
      />
      <ProductFeatures features={ormContent.features} />
      <ProductDetailBlocks
        headline={ormFeedback.headline}
        bridge={ormFeedback.bridge}
        blocks={ormFeedback.blocks}
        visual={<FeedbackLoop />}
      />
      <ProductPlatform platform={ormContent.platform} />
      <TestimonialsReveal heading="Trusted by 500K+ TypeScript developers" />
      <ProductCta cta={ormContent.cta} />
    </>
  );
}
