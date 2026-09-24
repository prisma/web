import {
  Bot,
  CheckCircle,
  Code,
  Console,
  Database,
  GitBranch,
  Layers,
  LayoutGrid,
  Repeat,
  Rocket,
  Server,
  Settings,
  Shield,
  Swap,
} from "@/components/icons/forma";

// Icons referenced by name in ProductPageContent so content objects stay
// serializable across the server/client boundary (and CMS-ready). Extend as
// product pages need more glyphs.
export const PRODUCT_ICONS = {
  bot: Bot,
  checkCircle: CheckCircle,
  code: Code,
  console: Console,
  database: Database,
  gitBranch: GitBranch,
  layers: Layers,
  layoutGrid: LayoutGrid,
  repeat: Repeat,
  rocket: Rocket,
  server: Server,
  settings: Settings,
  shield: Shield,
  swap: Swap,
};

export type ProductIconName = keyof typeof PRODUCT_ICONS;

// Canonical icon per Platform product — every surface that shows a product
// glyph (navbar, cross-sell cards, platform canvas) resolves through this so
// the identities never drift.
export const PLATFORM_PRODUCT_ICONS: Record<string, ProductIconName> = {
  "/postgres": "database",
  "/compute": "server",
  "/orm": "code",
};

// Canonical tagline dot colour per Platform product. Every surface that shows a
// product tagline resolves through this so the identities can't drift apart.
// Pairings are the ones the homepage stack uses (stack-bento.tsx) and the ones
// the tagline examples on /brand are documented with.
export const PLATFORM_PRODUCT_ACCENTS = {
  orm: "bg-prism-cyan-400",
  postgres: "bg-prism-yellow-400",
  compute: "bg-prism-red-500",
} as const;

export type ProductAccentName = keyof typeof PLATFORM_PRODUCT_ACCENTS;
