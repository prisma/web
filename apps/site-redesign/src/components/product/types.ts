import type { ProductAccentName, ProductIconName } from "./icons";
import type { ProductIllustrationName } from "./illustrations";

type Cta = { label: string; href: string };
type Icon = ProductIconName;
type Illustration = ProductIllustrationName;

/**
 * One stop on the hero's product tour (see product-tour.tsx). Four per page —
 * enough to answer "what is this, and why this one" without the tab strip
 * wrapping to two lines inside the hero column.
 */
export type ProductTourStop = {
  /** Tab label. One or two words; the strip has to fit the hero column. */
  label: string;
  /** The claim this panel is evidence for, in one short sentence. */
  caption: string;
  illustration: Illustration;
};

// Content contract for the product page template. Copy source is the Notion
// request card "Product Page Batch One (3-5) - Copy", toggle **V4** — the final
// approved version. Earlier drafts (V1–V3) differ in headlines, CTAs and
// section count; don't copy from them. Standing guardrails live in the Notion
// page "Prisma — Context & Source of Truth".
//
// Client review on 2026-08-06 asked the pages to show the product before
// explaining it, and granted permission to rewrite copy where that requires it.
// Deviations from V4 are marked at the point they occur in content/.
//
// Each Platform page (/postgres, /compute, /orm) is an instance of this shape —
// see content/.
export type ProductPageContent = {
  /** Product name, prefixed ("Prisma ORM"). Either all three pages prefix or none do. */
  name: string;
  /**
   * Which product's canonical colour the hero tagline dot carries. Resolved
   * through PLATFORM_PRODUCT_ACCENTS so it matches the homepage and /brand.
   */
  accent: ProductAccentName;
  hero: {
    /** Outcome-focused, 6–10 words. */
    headline: string;
    /**
     * Substring of the headline that gets the glass-light glide (the phrase
     * that matters most). Keep it short — GlassGlide is deliberately
     * whitespace-nowrap from md up so the light travels an unbroken phrase, so
     * a long emphasis becomes one unbreakable token and overflows the column.
     * Roughly three words at the top of the headline clamp.
     */
    headlineEmphasis?: string;
    /**
     * One sentence: what it does, who it's for. Deliberately shorter than V4's
     * two — the second sentence pushed the primary CTA to ~700px, below the
     * fold on a 1440x800 laptop, and every page's second sentence was already
     * restated by the section under the hero.
     */
    subheadline: string;
    /** Exactly three specific benefits. Sit under the CTA, not above it. */
    benefits: [string, string, string];
    primaryCta: Cta;
    secondaryCta: Cta;
    /** Reassurance directly under the CTA — price, licence or reach. */
    microline?: string;
    /**
     * The tour beside the copy (product-tour.tsx). Four stops. Pages still
     * carrying a single still frame fall back to `illustration`.
     */
    tour?: ProductTourStop[];
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
    /**
     * Four per page — the other two products, a coding-agent row, and one
     * ecosystem row. V4 shipped three and no alternatives, and client review
     * found the resulting diagram read as "you must adopt all of Prisma",
     * i.e. as lock-in. Every row now carries what it swaps out for, so the
     * section says best-together AND open.
     */
    integrations: {
      icon: Icon;
      product: string;
      /** Why this pairing is better than wiring it yourself. */
      benefit: string;
      /**
       * What this layer can be replaced with. Names only, no logos — we have
       * no marks for these and inventing them would misrepresent partnerships.
       * Required: a row without alternatives is the lock-in read we're fixing.
       */
      alternatives: string[];
      href?: string;
    }[];
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
