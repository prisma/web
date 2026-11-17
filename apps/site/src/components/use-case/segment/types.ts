import type { ProductIconName } from "@/components/product/icons";
import type { ProductPageContent } from "@/components/product/types";
import type { ComparisonContent } from "./comparison-table";

// Content contract for the audience use-case pages (SaaS teams, startups &
// founders, engineering teams). These follow the AI-agents page shape — hero,
// an illustrated intro, "when to use" icon cards, an is-it-the-right-fit split,
// an optional "why choose" icon-card grid, a comparison TABLE, "what they
// build" cards, testimonials, closer — differing from the /use-cases/[slug]
// template (which has before/after, three steps, D4 reasons and FAQs).
//
// Every string is transcribed verbatim from André's copy doc — nothing added,
// tightened or reworded.

type Cta = { label: string; href: string };
/** Icon + heading + body — the "when to use" and "why choose" grids. */
export type IconItem = { icon: ProductIconName; title: string; body: string };
/** Heading + body — the "what they build" cards (icon is decorative, not copy). */
export type TextItem = { icon: ProductIconName; title: string; body: string };

export type SegmentUseCaseContent = {
  slug: string;
  meta: { title: string; description: string };
  /** Hero eyebrow — the audience name ("SaaS Teams"), rendered as the RoleKicker. */
  eyebrow: string;
  /** Runs through the shared segment hero; subheadline is the hero paragraphs. */
  hero: ProductPageContent["hero"];
  /** "What Prisma is for … / Why … use Prisma" — a lede and narrative paragraphs. */
  intro: { headline: string; lede: string; body: string[] };
  /** "When to use Prisma …" — intro + four icon cards. */
  when: { headline: string; intro: string; items: IconItem[] };
  /** "Is Prisma the right fit …?" — the suited line and the honest caveat. */
  fit: { headline: string; suited: string; caveat: string };
  /** "Why … choose Prisma over a stitched-together stack" — intro paragraphs + icon cards. Optional. */
  whyChoose?: { headline: string; intro: string[]; items: IconItem[] };
  /** The comparison table (see comparison-table.tsx). */
  comparison: ComparisonContent;
  /** "What … build with Prisma / Who Prisma is best for" — cards. */
  builds: { headline: string; intro?: string; items: TextItem[] };
  /** Testimonials section heading. */
  testimonialsHeading: string;
  /** Closing CTA. */
  cta: { headline: string; body: string; benefits: string[]; primaryCta: Cta; secondaryCta: Cta };
};
