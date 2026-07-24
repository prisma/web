import { Bot, Code, Database, Layers, Repeat, Rocket, Server } from "@/components/icons/forma"

// Icons referenced by name in ProductPageContent so content objects stay
// serializable across the server/client boundary (and CMS-ready). Extend as
// product pages need more glyphs.
export const PRODUCT_ICONS = {
  bot: Bot,
  code: Code,
  database: Database,
  layers: Layers,
  repeat: Repeat,
  rocket: Rocket,
  server: Server,
}

export type ProductIconName = keyof typeof PRODUCT_ICONS

// Canonical icon per Platform product — every surface that shows a product
// glyph (navbar, cross-sell cards, platform canvas) resolves through this so
// the identities never drift.
export const PLATFORM_PRODUCT_ICONS: Record<string, ProductIconName> = {
  "/postgres": "database",
  "/compute": "server",
  "/orm": "code",
}
