import type { ProductIconName } from "@/components/product/icons";
import type { ProductPageContent } from "@/components/product/types";
import type { FaqItem } from "@/components/sections/faq";

type Cta = { label: string; href: string };

// Content contract for the use-case page template. Copy source is the Notion
// request card "Use Case Template Copy", toggle **V2** — the final version. V1
// differs (Management API instead of Prisma Skills, a different closing CTA);
// don't copy from it.
//
// V2 is a *template*: every use-case-specific string in it is a bracketed
// placeholder. Those brackets are carried through to the page verbatim rather
// than being guessed at, per the placeholder convention this project already
// uses on /pricing — a visible placeholder, never an invented value. See
// content/template.ts.
//
// The page reuses the product-page sections wholesale where the layout is the
// same one (hero, the four-card grid), so the two templates can't drift apart.
export type UseCasePageContent = {
  /** Route segment: /use-cases/<slug>. */
  slug: string;
  /** Browser/OG title and description. */
  meta: { title: string; description: string };
  /**
   * Hero eyebrow — the use case name, short and developer-native
   * ("Ship a SaaS backend"). Renders as the site's standard RoleKicker.
   */
  eyebrow: string;
  /**
   * Same shape as the product hero, so both run through ProductHero. The dot
   * colour is fixed rather than per-page: a use case isn't a product and must
   * not borrow a product's canonical accent (see product/icons.ts).
   */
  hero: ProductPageContent["hero"] & {
    /** Label for the reserved visual slot until the real screenshot/sample exists. */
    placeholderLabel?: string;
  };
  /** "Why [use case] breaks down on a stitched-together stack" — the homepage before/after. */
  problem: {
    headline: string;
    before: string[];
    after: string[];
  };
  /**
   * "Ship [outcome] in three steps" — Define / Deploy / Iterate.
   *
   * Reserved, not built: André asked for the slot to be held while the section
   * gets designed (2026-08-13). `items` and `cta` carry V2's copy verbatim so
   * nothing is lost in the meantime — the section renders the headline and a
   * reserved block, and picks the rest up when it's designed.
   */
  steps: {
    headline: string;
    items: { step: string; name: string; body: string }[];
    cta: Cta;
  };
  /** "How Prisma handles [use case]" — four cards, two rows of two. */
  handles: {
    headline: string;
    bridge: string;
    /** Four in V2: the ORM, Postgres, Compute, and the agent workflow. */
    items: { name: string; description: string }[];
    cta: Cta;
  };
  /** "What changes when your stack is built to work together" — three icon columns. */
  changes: {
    headline: string;
    items: { icon: ProductIconName; title: string; body: string }[];
  };
  /**
   * "Why teams choose Prisma for [use case]" — the fixed D4 differentiators.
   * These four are real copy in V2, not placeholders: keep them, and tailor
   * only the trailing one-line read per use case. Never claim a best-in-class
   * ORM, database or host individually — the integrated slice is the claim.
   */
  reasons: {
    headline: string;
    items: { title: string; body: string }[];
  };
  /** Closing CTA — V2's CHANGE #12 rewrite, which closes on the use-case outcome. */
  cta: {
    headline: string;
    body: string;
    benefits: string[];
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  faqs: FaqItem[];
};
