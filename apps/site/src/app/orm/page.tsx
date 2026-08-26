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
// migrations argument and the feedback blocks.
//
// Order changed on 2026-08-06. V4 ran the migrations argument between the
// problem and the features, so the page spent its first three sections on
// agent safety before it had said what the ORM is. Client review asked for the
// core value first, so Features (declarative schema, typed client) now follows
// the problem directly and the migrations argument comes after it.
export default function OrmPage() {
  return (
    <>
      <ProductHero name={ormContent.name} accent={ormContent.accent} hero={ormContent.hero} />
      <ProductProblem problem={ormContent.problem} />
      <ProductFeatures features={ormContent.features} />
      <ProductNarrative
        headline={ormMigrations.headline}
        paragraphs={ormMigrations.paragraphs}
        illustration={<MigrationGraph />}
      />
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
