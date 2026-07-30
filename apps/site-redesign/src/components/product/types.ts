import type { ProductIconName } from "./icons";
import type { ProductIllustrationName } from "./illustrations";

type Cta = { label: string; href: string };
type Icon = ProductIconName;
type Illustration = ProductIllustrationName;

// Content contract for the product page template. Copy source is the Notion
// request card "Product Page Batch One (3-5) - Copy", toggle **V4** — the final
// approved version. Earlier drafts (V1–V3) differ in headlines, CTAs and
// section count; don't copy from them. Standing guardrails live in the Notion
// page "Prisma — Context & Source of Truth".
//
// Each Platform page (/postgres, /compute, /orm) is an instance of this shape —
// see content/.
export type ProductPageContent = {
  /** Product name, prefixed ("Prisma ORM"). Either all three pages prefix or none do. */
  name: string;
  hero: {
    /** Outcome-focused, 6–10 words. */
    headline: string;
    /** Substring of headline that gets the glass-light glide (the phrase that matters most). */
    headlineEmphasis?: string;
    /** 1–2 sentences: what it does, who it's for. */
    subheadline: string;
    /** Exactly three specific benefits. */
    benefits: [string, string, string];
    primaryCta: Cta;
    secondaryCta: Cta;
    /** The abstraction beside the copy. Falls back to a reserved placeholder. */
    illustration?: Illustration;
  };
  problem: {
    /** Names the friction. */
    headline: string;
    /**
     * The pain state before this product, one entry per paragraph. V4 sets the
     * closing "<Product> exists to change that." on its own line.
     */
    body: string[];
    /** Four outcome labels. */
    outcomes: { icon: Icon; label: string }[];
  };
  features: {
    /** States the outcome. */
    headline: string;
    /** 1–2 sentence bridge to the Prisma platform. */
    bridge: string;
    /** V4 ships 3 (ORM), 4 (Compute) and 5 (Postgres) — not a fixed four. */
    items: {
      name: string;
      description: string;
      /** Omitted where the approved copy carries no "Learn more" destination. */
      href?: string;
      illustration?: Illustration;
    }[];
  };
  platform: {
    /** How this product shares a common layer with the rest of Prisma. */
    body: string;
    /** Three per page in V4 — the other two products plus one ecosystem row. */
    integrations: { icon: Icon; product: string; benefit: string; href?: string }[];
  };
  cta: {
    /**
     * The closer is deliberately per-page. Review feedback flagged all three
     * pages ending on an identical paragraph as reading templated, so the
     * headline and body are content — don't hoist them into a shared default.
     */
    headline: string;
    body: string;
    /** Three in V4. The trust line is spelled out here, not appended by the section. */
    benefits: string[];
    primaryCta: Cta;
    secondaryCta: Cta;
  };
};
