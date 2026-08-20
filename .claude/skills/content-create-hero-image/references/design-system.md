# Prisma cover design system — 2026 brand

The visual language for Prisma blog and social covers under the 2026 rebrand: light paper
surfaces, the three-color prism accent family, Sora display type. Machine-readable values live
in [`../assets/tokens.json`](../assets/tokens.json) — that file is the source of truth; this
document explains intent.

> **The pre-2026 style is retired.** The dark teal "aurora" surface, Mona Sans 800 headlines,
> uppercase dash eyebrows, and Geist Mono labels are the OLD look. The worked examples in
> `assets/examples/` and `assets/hero1–4.svg` predate the rebrand — study them for *composition
> and module structure only*, never for palette, type, or surface.

## Sources

The durable sources are the **eclipse package** and the **marketing site app**. The marketing
site currently lives at `apps/site-redesign` (a temporary app name — it replaces `apps/site` at
cutover); if that path is gone, look for the same files under `apps/site`. `tokens.json` bundles
every needed value, so a missing path never blocks a cover.

| What                       | Where (in `prisma/web`)                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Eclipse (docs/blog) tokens | `packages/eclipse/src/styles/globals.css` (ink/paper neutrals, Sora/Inter wiring) — durable                     |
| Brand fonts                | `packages/eclipse/src/static/fonts/` — durable; bundled copies in [`../assets/fonts/`](../assets/fonts/)        |
| Brand color tokens         | the marketing site's `src/app/globals.css` `@theme` block (prism-cyan/red/yellow ramps, paper, card-wash)       |
| Product accent map         | the marketing site's `src/components/product/icons.ts` (`PLATFORM_PRODUCT_ACCENTS`)                             |
| Logos / marks              | `apps/blog/public/logo/` (full-color lockup) and the prism mark; bundled in [`../assets/logos/`](../assets/logos/) |
| Live brand reference       | the marketing site's heroes and cards (`src/components/sections/`, `/brand` route)                              |
| Blog cover conventions     | `apps/blog/content/blog/<slug>/index.mdx` + `apps/blog/public/<slug>/imgs/`                                     |

## The look in one paragraph

A **light paper canvas** — white or `#f9faf5` — with barely-there grain and, usually, a soft
**spectral wash**: two or three radial pools of the prism colors (cyan, yellow, red at ~15–25%)
dissolving into the surface along one edge, exactly like the site's hero panels. **One prism
accent** (chosen by product) carries the cover: a small **kicker dot** beside a sentence-case
label names the topic, a **Sora 500** headline in ink carries the message, and one **content
module** — a white hairline-bordered card, an ink code card, a flow of rounded tiles — does the
showing. The **`Prisma`** wordmark (Sora 600 ink) or the small full-color lockup signs off in a
clear bottom corner. Nothing else: no dark aurora, no uppercase eyebrows, no glows, no stock
decoration. Restraint is still the brand; the surface just turned to daylight.

## Color

- **Cover surface (default, light):** `#ffffff` or paper `#f9faf5`. Add the **grain** (SVG
  `feTurbulence`, multiply, ~5% opacity) and usually a **spectral wash** — 2–3 soft radial
  gradients (`cyan rgba(1,215,228,.20)`, `yellow rgba(243,195,6,.16)`, `red rgba(255,118,130,.17)`)
  pooling along the bottom or a corner and fading to the surface. The wash is atmosphere; type and
  modules must sit on calm areas.
- **Accent (one per cover, by product):** ORM / Prisma 8 → **cyan `#01d7e4`**; Postgres →
  **yellow `#eaa700`** (dot may use `#f3c306`); Compute → **red `#f34a60`**. Deep variants for
  small text on white: cyan `#007f8d`, yellow `#965100`, red `#af0a33`. The other two prisms may
  appear only inside the wash or a deliberate prism-stripe motif.
- **Text:** ink `#151515` for titles, `#3a3b3c` body, `#646567` muted. On the rare dark cover:
  paper `#f9faf5` titles, `#a5a5a6` muted.
- **Cards:** white fill, hairline border `rgba(0,0,0,0.06)` (strong: `0.12`), radius ~20, soft
  shadow `0 10px 30px rgba(21,21,21,0.08)`. Inner chip/row surface: card-wash `#eef4f3`.
- **Code/terminal cards invert to ink** (`#151515` fill, paper text) — the one sanctioned dark
  element on a light cover, and it reads as the site's code blocks do.
- **Prism motif (optional):** 45° diagonal bands cyan → red → yellow (the logo's anatomy) as a
  corner glyph, edge bleed, or divider. Crisp and geometric — never a blurred rainbow.
- **Dark covers are the exception**, for genuinely nocturnal subjects: ink `#151515`/`#0f0f0f`
  surface, paper text, same accents. Say why when you choose it.

## Typography

| Role               | Family             | Weight | Notes                                                            |
| ------------------ | ------------------ | ------ | ---------------------------------------------------------------- |
| Title / headline   | **Sora**           | 500    | sentence case, line-height ~1.08, tracking ~-0.5 to -1; never 700+ |
| Kicker label       | **Inter**          | 600    | sentence case beside the accent dot; `rgba(21,21,21,.7)`         |
| Subtitle / body    | **Inter**          | 400    | line-height ~1.45                                                |
| Data values / code | **Mona Sans Mono** | 500    | snippets, paths, numbers inside modules                          |
| Big numbers        | **Sora**           | 600    | hero stats; 600 is the ceiling                                   |
| Wordmark sign-off  | **Sora**           | 600    | the word `Prisma`, ~24px ink                                     |

**Sora + Inter is the pairing.** Mona Sans display (the old 800 headlines), Geist Mono, and
Barlow are all off-brand on covers now. Headlines are **sentence case** — never all-caps, never
letter-spaced.

### Fonts & rendering (unchanged mechanics)

The bundled faces are variable fonts: `Sora-VF.woff2`, `Inter-VF.woff2`,
`MonaSansMono-VF.woff2`. A cover that only *names* the families renders with fallbacks wherever
they aren't installed, and librsvg ignores `@font-face` entirely. So the pipeline is still:

1. **`scripts/embed-fonts.py <hero.svg>`** — subsets and inlines the three faces as base64
   `@font-face` (self-contained SVG).
2. **`scripts/export-png.sh`** — renders the PNG with headless Chrome, which honors the embedded
   faces, making the PNG pixel-identical to the SVG in a browser.

Always embed before exporting or sharing.

## Layout (canonical 1200×630)

- Uniform **72px** padding; nothing touches the canvas edge.
- **Kicker** top-left: accent dot + sentence-case Inter 600 label — the site's `RoleKicker`
  treatment (`apps/site/src/components/brand/role-kicker.tsx`: color lives in the dot, label
  stays ink at 70%). At cover scale: ≥5.5px dot, ≥20px label — or omit it. No dash, no caps,
  no pill container.
- **Headline** below: Sora 500, ~56–68px, 1–3 hand-wrapped lines, ink. Emphasis inside a headline
  is the accent color (deep variant if the phrase is small), not a weight change.
- Optional **one-line subtitle**: Inter 400 ~26px, `#646567`.
- **Content module** lower/right; **wordmark** in a clear bottom corner.
- Left-anchored, generous negative space. Center only a single graphic-led composition.

### Spacing minimums (unchanged)

- ≥ 48px between any card and the canvas edge; ≥ 40px between sibling tiles; ≥ 24px padding
  inside cards; ≥ 28px between stacked rows. Verify on the rendered PNG, by measurement.

### Shared anatomy (the default stack — not a law)

The five-part stack below is the *ceiling*, not the formula: the strongest covers often drop
to two or three parts (a no-copy object + lockup; an atmosphere + one small card; a giant
numeral + kicker). Drop elements before adding any.

1. **Surface** — white/paper + grain, usually a spectral wash on one edge. Never the old dark
   aurora; never a flat grey.
2. **Kicker** — accent dot + sentence-case label naming product or topic.
3. **Headline** — Sora 500 ink; short and declarative. (No-copy covers stay first-class: the
   module + wordmark carry it, kicker optional.)
4. **One content module** — the visual that carries the idea (catalog below).
5. **Sign-off** — `Prisma` in Sora 600 ink, or the small full-color lockup, in a clear corner.

### Content modules (pick one per cover)

**The full component catalog and the article→visual routing live in
[`component-library.md`](component-library.md)** — families: HeroChart, MetricComponent,
ComparisonTable, CodeWindow, QueryPanel, ArchitectureFlow, DatabaseObject, PrismObject,
GradientField, TypeMark. Gradient/light recipes live in
[`gradient-system.md`](gradient-system.md). The table below defines the house *skin* the
classic modules take on the light surface:

| Module               | When                                | New-brand skin                                                                                                                                        |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pipeline / flow**  | a sequence or transform (A → B → C) | white rounded tiles with hairline borders on the light surface; equal gaps; the hero tile gets the accent border + accent tint fill; mono labels below |
| **Comparison card**  | "X vs Y", "% of", benchmarks        | one white card; bars in card-wash track; reference bar `#e5e5e4`→`#a5a5a6`; hero bar in the accent; ink numbers right-aligned                          |
| **Data / log panel** | streams, logs, events, real-time    | white card of mono rows (`#3a3b3c`), accent-tinted highlight row; or an ink code-card variant                                                          |
| **Terminal card**    | CLI, scaffolding, getting-started   | **ink card** (`#151515`, paper text) with a `$ command` and short ✓ checklist (✓ in the accent)                                                        |
| **Code card**        | config, schema, API shape           | ink card with a filename tab; syntax tints drawn from the prism ramps (cyan for keywords, yellow strings, red flags) — subtle, 2–3 tints max           |
| **Prism stripe**     | brand/launch moments                | the 45° three-band motif as the graphic itself, with the lockup or a single stat                                                                       |

**Isometric skew** stays available for card/table modules (one skewed plane max; flows stay
flat). **Multiple directions** (1–4) and **graphic-led no-copy variants** work as before.

## Formats

| Format             | Dimensions | Frontmatter / use | File name               |
| ------------------ | ---------- | ----------------- | ----------------------- |
| In-post hero       | 844×474    | `heroImagePath`   | `hero.svg` / `hero.png` |
| Social / OG        | 1200×630   | `metaImagePath`   | `meta.png`              |
| YouTube thumbnail  | 1280×720   | video             | `youtube-thumbnail.png` |
| Generic blog cover | 1200×630   | alias of social   | `blog-cover.svg/.png`   |

Scale font sizes proportionally when the frame changes (×0.70 for the 844-wide hero).
