# Prisma cover design system

The visual language for Prisma blog and social covers, distilled from the Eclipse
design system, the canonical OG generator, and `SOCIALS.fig`. Machine-readable
values live in [`../assets/tokens.json`](../assets/tokens.json) — that file is the
source of truth; this document explains intent.

## Sources

| What                        | Where (in `prisma/web`)                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color tokens (hex)          | `packages/eclipse/src/styles/globals.css`                                                                                                         |
| Type tokens (font + scale)  | `apps/eclipse/content/design-system/tokens/typography.mdx`                                                                                        |
| Layout composition recipe   | `apps/docs/src/app/og/[...slug]/route.tsx` (layout only — it uses Barlow, which is **off-brand**; covers use Mona Sans)                           |
| Brand fonts                 | `packages/eclipse/src/static/fonts/` (Mona Sans VF, Mona Sans Mono VF); bundled static instances in [`../assets/fonts/`](../assets/fonts/)        |
| Logos / marks               | Official press kit [`prisma/presskit`](https://github.com/prisma/presskit); product icons in [`../assets/logos/`](../assets/logos/) (`README.md`) |
| Blog cover conventions      | `apps/blog/content/blog/<slug>/index.mdx` + `apps/blog/public/<slug>/imgs/`                                                                       |
| Hand-designed cover library | `SOCIALS.fig` (see [`figma-source.md`](./figma-source.md))                                                                                        |

The skill bundles its brand fonts in `assets/fonts/`, so it renders on-brand without extra setup.
This skill lives in the `prisma/web` repo, so the live Eclipse tokens in `packages/eclipse/` are
available to reconcile against.

## The look in one paragraph

A premium **teal-green "aurora" surface** — a luminous teal glow at the top (strongest top-left)
fading through dark navy to near-black at the bottom — with a single mint-teal accent (`#5EEAD4`).
A **dash-prefixed eyebrow** (a short teal hairline + uppercase label) names the topic; a bold,
**large** Mona Sans headline with its key phrase in teal carries the message; and one **content
module** does the showing — a row of icon tiles, a comparison card of bars, a log/data panel, a
terminal, or a code card. The word **`Prisma`** signs off in a clear bottom corner. Nothing else:
no stock illustration, no random gradient, no decorative noise. Restraint is the brand, and the
diagram is minimal — favour a few clean boxes and one hero glyph over arrows, chips, and pills.
(See the worked examples in `assets/examples/`, which mirror the brand reference frames.)

## Color

- **Cover surface (default, dark):** a **vertical** gradient — teal-green `#163535` (top) → `#0A1018` → near-black `#03060E` (bottom). The lighter top carries the eyebrow + headline; the bottom anchors the content module. This visible top-to-bottom shift is part of the look — do not flatten it.
- **Accent (signature):** mint teal **`#5EEAD4`** (Eclipse teal-300) for eyebrows, headline highlight, hero numbers, hairlines (`#71e8df` is an accepted near-equivalent). Use exactly one accent per cover.
- **Title text:** `#f7fafc`/white on dark, `#111827` on light.
- **Body / subtitle / muted:** `#9CA3AF` (`#a0aec0` ok).
- **Background texture:** a faint slate grid (`#94A3B8` @ ~4.5%, 48px cells) plus a soft teal radial glow (`rgba(45,212,191,0.16)`), positioned to complement the composition. Both barely-there — atmosphere, not decoration.
- **Bar / data fills:** neutral/reference bars = slate gradient `#64748B → #CBD5E1`; the hero/product bar = teal gradient `#14B8A6 → #5EEAD4` with a `#2DD4BF` glow. Track behind bars = `#1F2937`.
- **Card surface:** `#111827` at ~92% opacity, `1.5px` border `#FFFFFF` @ 8%, radius ~22.
- **Product palettes** (semantic, from Eclipse): Postgres = teal (`#0d9488` / cover accent `#5EEAD4`), ORM = indigo (`#4f46e5`). Compute and Next inherit the platform teal. See `tokens.json → products`.

Light covers are allowed for editorial/educational pieces: white background, `#111827`
title, product-colored accent. Dark is the default and the launch/announcement standard.

## Typography

| Role               | Family                               | Weight | Notes                                                         |
| ------------------ | ------------------------------------ | ------ | ------------------------------------------------------------- |
| Title / headline   | **Mona Sans**                        | 800    | Eclipse titles run 800–900, extended width; line-height ~1.1  |
| Eyebrow (kicker)   | **Geist Mono**                       | 600    | UPPERCASE, letter-spacing ~2.7, accent teal, leading `—` rule |
| Subtitle / body    | **Inter**                            | 400    | line-height 1.5                                               |
| Data values / code | **Geist Mono** (alt: Mona Sans Mono) | 500    | benchmark numbers, req/s, snippets, API paths                 |
| Big numbers        | **Mona Sans**                        | 800    | hero stats and percentages                                    |

Never substitute a different display face. **Mona Sans + Inter** is the pairing — **not Barlow**.
Barlow is the legacy docs-OG face and reads off-brand; do not use it on covers.

### Fonts & rendering (important)

The brand faces are **Mona Sans** (headings/display, weight 800), **Inter** (body, 400), and
**Geist Mono** (data/code, 500). The skill bundles static instances in
[`../assets/fonts/`](../assets/fonts/) (Mona Sans is a variable font; the bundled instance is the
weight-800 display cut). Use those families/weights — an arbitrary weight or a different family
makes renderers fall back to a generic sans, the #1 cause of an off-brand cover.

**One source of truth: embed the fonts, then render.** A cover that only _names_ the families
renders with fallback fonts wherever they are not installed. Two renderers disagree about
fonts, which is the #1 cause of "the PNG and SVG look different":

- A **browser/Figma** renders the SVG's embedded `@font-face` (correct brand fonts).
- **librsvg/`rsvg-convert`** _ignores_ `@font-face`, and since fontconfig does not index the
  bundled `.woff2`, it falls back to a generic sans (e.g. Verdana) — wrong.

So the pipeline is: **(1) `scripts/embed-fonts.py <hero.svg>`** inlines the faces as base64
`@font-face` (self-contained SVG), then **(2) `scripts/export-png.sh`** renders the PNG with
**headless Chrome/Chromium**, which honors the embedded faces — making the PNG pixel-identical
to the SVG-in-browser. Always embed before exporting or sharing. (rsvg/magick remain only as
fallbacks and warn that fonts may not match.)

## Layout (canonical 1200×630)

- Uniform **72px** padding on all edges; nothing touches the canvas edge.
- **Headline block:** top-left; eyebrow, then title (1–3 hand-wrapped lines), optional one-line
  subtitle (~20px gap). Large type — title ~62–72px.
- **`Prisma` wordmark:** the brand sign-off — the word `Prisma` in Mona Sans 800, white, ~22px,
  in whichever **bottom corner is clear of content** (bottom-left when the module is right-side;
  bottom/top-right when content fills the bottom). Never the URL `prisma.io/blog`; never an icon
  paired with extra text.
- Strong left alignment and generous negative space on the right. Do not center everything.

### Spacing & breathing room (coherence)

Cramped elements read as "off". Hold these minimums and keep them consistent across a set:

- **≥ 48px** between any card/diagram and the canvas edge.
- **≥ 40px** between sibling tiles/boxes in a row (equal gaps; symmetric about their center).
- **≥ 24px** padding inside a card before its content; **≥ 28px** between stacked rows of content.
- Eyebrow → headline → subtitle → module each get clear air; never let two text blocks crowd.
- Verify spacing on the **rendered PNG**, by measurement, not by eye (see `design-review.md`).

### Shared anatomy (every cover)

The house style is one frame with a few fixed parts and a swappable **content module**:

1. **Eyebrow** top-left — a short teal **hairline dash** (~30px) + uppercase label in **Mona Sans
   800** ~16px, letter-spacing ~2.4, accent teal (`— LABEL`). Names the topic (e.g.
   `REQUEST-TIME IMAGE PIPELINE`, `THROUGHPUT VS RAW PG`).
2. **Headline** below it — **Mona Sans 800**, **~62–72px** (go large), tight tracking (about -1.8),
   1–3 lines, white with the **key phrase in accent teal** (e.g. "Image transforms / **as app
   logic**").
3. **Content module** in the lower/right area — the visual that carries the idea (see catalog).
   Keep it **minimal**: a few clean tiles/rows and one hero element beat a busy diagram.
4. **`Prisma` wordmark** — Mona Sans 800, white, ~22px, in a clear bottom corner. Always present.
5. **Base** — the teal-green **aurora** surface (bright teal top, strongest top-left → near-black
   bottom) + a barely-there slate grid. Always. Never a flat/near-solid dark fill.

Left-anchored, generous space, one accent, no decoration beyond the base aurora.

### Content modules (pick one per cover)

Each example folder in [`../assets/examples/`](../assets/examples/) is a worked instance:

| Module               | When                                | Looks like                                                                                                                                                                                                                                                              | Example                                            |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Pipeline / flow**  | a sequence or transform (A → B → C) | a row of rounded **square tiles**, equal size and equal gaps, a mono label under each; the key tile gets a teal-glow border and holds the hero logo/glyph (e.g. the Bun mark). Keep it minimal — the tiles + labels read as a flow; skip arrows, param chips, and pills | `image-transformations-with-bun-on-prisma-compute` |
| **Comparison card**  | "X vs Y", "% of", benchmarks        | rounded `#111827`@92% card of **horizontal bars** — each row = prism icon + label, big right-aligned number + unit; reference row fills 100% (slate), hero row fills its true ratio (teal + glow). Bar width _is_ the comparison                                        | `prisma-next-benchmark`                            |
| **Data / log panel** | streams, logs, events, real-time    | a dark panel of monospace **rows** (timestamp + label + mini-bar), optionally a small flow beneath (`source → client`)                                                                                                                                                  | `building-open-chat`                               |
| **Terminal card**    | CLI, scaffolding, getting-started   | a terminal-style card with a `$ command` and a short ✓ checklist                                                                                                                                                                                                        | `create-prisma-deploy-prisma-compute`              |
| **Code card**        | config, schema, API shape           | a code-editor card (filename tab + syntax-tinted lines), optional target nodes beneath                                                                                                                                                                                  | `prisma-compute-config-file`                       |

Tiles/cards: rounded ~22–24px, **translucent** fill `#0A1622` @ ~0.74 (so the aurora shows
faintly through), hairline border `#FFFFFF` @ ~10%; inner chips/boxes `#0B1220` @ ~0.7; the hero
element uses a teal border + `#2DD4BF` glow. Labels and code/data are **Geist Mono**; headings and
big numbers are **Mona Sans**; prose is **Inter**.

**No-copy covers (common).** Most Prisma blog images carry **no headline at all** — the content
module plus the `Prisma` wordmark do the work. Default to no-copy unless the post has a short,
punchy thesis worth setting as a headline. A no-copy cover centres/enlarges the module and keeps
the eyebrow optional.

**Isometric skew (optional hero treatment).** For card/table/grid modules, a subtle isometric
skew (e.g. `transform="matrix(1,0.18,-0.18,1,…)"` or a ~15–25° rotate + scale) gives the hero a
premium 3-D plane. Use it for **cards and tables**; keep **flow/loop/pipeline and "→ bill"
diagrams flat** (skew muddies a left-to-right read). One skewed plane per cover, never the whole
canvas.

**Multiple directions.** When asked for N directions (1–4), produce N independent
`cover-<a|b|…>.svg`/`.png` pairs exploring distinct modules or framings (e.g. literal diagram vs
typographic thesis vs comparison), each fully on-brand, and present them together for selection.

**Graphic-led variant.** When a single chart/diagram is the whole message, you can drop the
headline and **center the module**, with the standalone product logo (e.g. `prisma-next-logo.svg`)
centered on top as the only brand mark.

## Formats

| Format             | Dimensions | Frontmatter / use | File name               |
| ------------------ | ---------- | ----------------- | ----------------------- |
| In-post hero       | 844×474    | `heroImagePath`   | `hero.svg` / `hero.png` |
| Social / OG        | 1200×630   | `metaImagePath`   | `meta.png`              |
| YouTube thumbnail  | 1280×720   | video             | `youtube-thumbnail.png` |
| Generic blog cover | 1200×630   | alias of social   | `blog-cover.svg/.png`   |

Scale font sizes proportionally when the frame changes (e.g. ×0.70 for the 844-wide hero).
