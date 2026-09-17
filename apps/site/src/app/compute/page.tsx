import { createPageMetadata } from "@/lib/page-metadata";
import { computeContent } from "@/components/product/content/compute";
import { ProductCta } from "@/components/product/product-cta";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductHero } from "@/components/product/product-hero";
import { ProductPlatform } from "@/components/product/product-platform";
import { ProductProblem } from "@/components/product/product-problem";

export const metadata = createPageMetadata({
  title: "Prisma Compute | Deploy TypeScript Apps and AI Agents on Bun",
  description:
    "Prisma Compute deploys TypeScript apps, APIs, and AI agents from your repo as long-lived Bun processes next to Prisma Postgres, with long-running requests and streaming. One platform for your app and its database.",
  path: "/compute",
  ogKicker: "Prisma Compute",
  ogAccent: "red",
});

// /compute composes the product sections directly, like /orm: V4 gives this page
// no testimonial section, so it can't go through ProductPage. It adds no extra
// sections either, so this is the template's plain shape minus the testimonials.
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
      <ProductCta cta={computeContent.cta} />
    </>
  );
}
