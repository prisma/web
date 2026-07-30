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
