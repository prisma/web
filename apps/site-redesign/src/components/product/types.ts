import type { ProductIconName } from "./icons"

type Cta = { label: string; href: string }
type Icon = ProductIconName

// Content contract for the generic product page template (Notion outline:
// "Product Page Template Copy" V1). Each Platform page (/postgres, /compute,
// /orm) is an instance of this shape — see placeholder-content.ts.
export type ProductPageContent = {
  /** Product name — hero eyebrow and boilerplate substitutions. */
  name: string
  hero: {
    /** Outcome-focused, 6–10 words. */
    headline: string
    /** Substring of headline that gets the glass-light glide (the phrase that matters most). */
    headlineEmphasis?: string
    /** 1–2 sentences: what it does, who it's for. */
    subheadline: string
    /** Exactly three specific benefits. */
    benefits: [string, string, string]
    primaryCta: Cta
    secondaryCta: Cta
  }
  problem: {
    /** Names the friction. */
    headline: string
    /** 2–3 sentences on the pain state before this product. */
    body: string
    /** Four outcome labels. */
    outcomes: { icon: Icon; label: string }[]
  }
  features: {
    /** States the outcome. */
    headline: string
    /** 1–2 sentence bridge to the Prisma platform. */
    bridge: string
    /** Four features. */
    items: { name: string; description: string; href: string }[]
  }
  platform: {
    /** How this product shares a common layer with the rest of Prisma. */
    body: string
    /** The other products this one composes with. */
    integrations: { icon: Icon; product: string; benefit: string; href: string }[]
  }
  cta: {
    /** Two product-specific benefits; the trust line is appended by the section. */
    benefits: [string, string]
    primaryCta: Cta
    secondaryCta: Cta
  }
}
