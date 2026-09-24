import type { ProductPageContent } from "@/components/product/types";
import { bulletList, ctaList, definitionList, heading, joinBlocks, paragraphs } from "./blocks";
import { renderTestimonialsMarkdown } from "./testimonials";

/**
 * Markdown rendition of the product page template (src/components/product/*).
 *
 * /orm, /postgres and /compute are all instances of `ProductPageContent`, so
 * their Markdown is generated from the exact object the React page renders
 * from — there is no second copy of the marketing text to drift. Only the
 * template's own framing headings ("Built to work with the rest of Prisma",
 * the swap line, the testimonials heading) are string literals here, because
 * they are literal JSX in the section components; `markdown-parity.test.ts`
 * scans those components and fails if one of them changes.
 */

/** product-platform.tsx renders this h2 above `platform.body` on every page. */
export const PRODUCT_PLATFORM_HEADING = "Built to work with the rest of Prisma";
/** product-platform.tsx: SWAP_LINE, the bolded line under `platform.body`. */
export const PRODUCT_PLATFORM_SWAP_LINE = "Best together. Swappable when needed.";
/** product-page.tsx / app/orm/page.tsx pass this to <TestimonialsReveal />. */
export const PRODUCT_TESTIMONIALS_HEADING = "Trusted by 500K+ TypeScript developers";

/** A section rendered between the template's own sections, in page order. */
export type ProductExtraSection =
  | {
      kind: "narrative";
      headline: string;
      paragraphs: string[];
    }
  | {
      kind: "detail-blocks";
      headline: string;
      bridge: string;
      blocks: { name: string; description: string }[];
    };

export type ProductMarkdownOptions = {
  content: ProductPageContent;
  /** Sections the page composes between features and platform, in render order. */
  afterFeatures?: ProductExtraSection[];
  /** Whether the page renders <TestimonialsReveal />. /compute does not. */
  testimonials?: boolean;
};

function renderExtraSection(section: ProductExtraSection): string {
  if (section.kind === "narrative") {
    return joinBlocks([heading(2, section.headline), paragraphs(section.paragraphs)]);
  }

  return joinBlocks([
    heading(2, section.headline),
    paragraphs(section.bridge),
    definitionList(section.blocks),
  ]);
}

/** The page's `<h1>`: product-hero.tsx renders `hero.headline` into it. */
export function productH1(content: ProductPageContent): string {
  return content.hero.headline;
}

/** The paragraph directly under the h1. */
export function productSubheadline(content: ProductPageContent): string {
  return content.hero.subheadline;
}

export function renderProductMarkdown({
  content,
  afterFeatures = [],
  testimonials = true,
}: ProductMarkdownOptions): string {
  const { hero, problem, features, platform, cta } = content;

  return joinBlocks([
    // Hero. The h1 and subheadline are emitted by the caller, so this picks up
    // at the CTAs, the reassurance microline and the three benefits.
    ctaList([hero.primaryCta, hero.secondaryCta]),
    hero.microline,
    bulletList([...hero.benefits]),
    // product-tour.tsx shows one stop at a time behind a tab strip. Markdown
    // has no tabs, so every stop is listed.
    hero.tour?.length
      ? joinBlocks([
          heading(3, `${content.name} at a glance`),
          definitionList(
            hero.tour.map((stop) => ({ name: stop.label, description: stop.caption })),
          ),
        ])
      : undefined,

    // product-problem.tsx
    heading(2, problem.headline),
    paragraphs(problem.body),
    bulletList(problem.outcomes.map((outcome) => outcome.label)),

    // product-features.tsx
    heading(2, features.headline),
    paragraphs(features.bridge),
    definitionList(features.items),

    ...afterFeatures.map(renderExtraSection),

    // product-platform.tsx
    heading(2, PRODUCT_PLATFORM_HEADING),
    paragraphs(platform.body),
    paragraphs(`**${PRODUCT_PLATFORM_SWAP_LINE}**`),

    // sections/testimonials-reveal.tsx
    testimonials ? renderTestimonialsMarkdown(PRODUCT_TESTIMONIALS_HEADING) : undefined,

    // product-cta.tsx -> sections/cta-burst.tsx
    heading(2, cta.headline),
    paragraphs(cta.body),
    bulletList(cta.benefits),
    ctaList([cta.primaryCta, cta.secondaryCta]),
  ]);
}
