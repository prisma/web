# Prisma — Marketing Website Redesign

The new prisma.io marketing site, designed and built by [Conversion Factory](https://conversionfactory.co). Prismatic light theme from the approved creative direction: a 3-color prism palette (cyan / yellow / red) over light neutral backgrounds, chrome accents, prism-ray motifs, and purposeful motion.

This app is intentionally self-contained — it has its own toolkit and does not depend on the monorepo's shared packages, so it can evolve alongside `apps/site` without touching it. Pages land here as they're approved; first up is the homepage.

## Development

From the monorepo root:

```bash
pnpm install
pnpm --filter site-redesign dev
```

Open [http://localhost:3010](http://localhost:3010).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with design tokens as CSS custom properties in `src/app/globals.css` (single source of truth — no separate token file)
- **Components**: [shadcn/ui](https://ui.shadcn.com) primitives + custom brand components
- **Fonts**: Sora (headings, 400) and Inter (body) via `next/font/google`
- **Icons**: Forma Thin by Icons8 (starter sections still on Lucide are migrated as they're rebuilt)
- **Content**: MDX files with gray-matter frontmatter in `content/`

## Design System

The site is **light-only** — no dark mode, no theme toggle, no `dark:` variants.

**Brand palette** (canonical hexes): cyan `#01D7E4` · red `#F34A60` · yellow `#F3C306`. Full 50–950 scales are defined in `globals.css` as `prism-cyan-*`, `prism-red-*`, and `prism-yellow-*` tokens — always use tokens, never ad-hoc hex values.

**Brand components** (`src/components/brand/`): `<Texture />` (grain overlay), `<Pattern />` (cursor-reactive isometric cube grid), `<PrismButton />` / `<PrismButtonOutline />` (spectrum-glow CTAs with WebGL prismatic burst on hover).
