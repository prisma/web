---
name: content-create-hero-image
description: Use when the operator wants a hero or meta image for a Prisma blog post; asks to create or generate a blog hero, cover, social card, Open Graph, or YouTube image; mentions cover art, a blog thumbnail, cover.svg/hero.svg/meta.png; references content-create-hero-image; or wants to interactively design cover imagery in Prisma's 2026 brand (light paper, prism accents, Sora). An editorial art-direction system - each cover is derived from the article's core message and strongest visual highlight, routed to a component family (chart, code, table, flow, object, abstract, type) with one light treatment. Produces an editable SVG hero plus a pixel-exact PNG meta image, and includes an interactive mode and a built-in design-review pass.
metadata:
  author: Prisma
  version: "2026.8.20"
---

# Create blog hero & meta images

Produce the **hero** and **meta** (Open Graph) images for a Prisma blog post in the **2026
brand** — light paper surfaces, the prism accent family (cyan/yellow/red), Sora display type —
styled from the bundled reference assets and from the most recent posts in the operator's
checkout, then wire them into the post's frontmatter.

The hero is a hand-authored, layered **SVG** — the editable source of truth — rendered to a
**pixel-exact PNG**. The meta image is **raster (PNG)** because social platforms do not render
SVG. A single design usually serves both. Output is saved into the repo, not just returned in
chat.

Companion to `content-write-blog` (which scaffolds the post itself). This skill makes the
imagery; it can be invoked standalone or as the cover step of that workflow.

Use [`README.md`](README.md) for usage and sample prompts; this `SKILL.md` is the execution contract for producing assets.

## References (load on demand)

- [`references/design-system.md`](references/design-system.md) — colors, fonts, layout recipe, formats, sources. **Read before designing.**
- [`references/component-library.md`](references/component-library.md) — the content component families (chart, table, code, query, flow, object, prism, field, type), the article→visual routing heuristic, and the world-class-cover calibration. **Read before choosing a visual.**
- [`references/gradient-system.md`](references/gradient-system.md) — the light treatments (wash, bloom, glow, spectrum, edge, beam, mesh, aurora, fade mask) as SVG recipes, plus gradient anti-patterns.
- [`references/design-review.md`](references/design-review.md) — structured critique (A–F grades, AI-slop list, fix loop), adapted from the gstack `design-review` skill. **Read before the review pass.**
- [`assets/tokens.json`](assets/tokens.json) — machine-readable tokens; the source of truth for hex/font values.
- [`references/figma-source.md`](references/figma-source.md) — what `SOCIALS.fig` contains and how it was extracted.
- [`references/figma-mcp.md`](references/figma-mcp.md) — **optional**: pull live specs/assets from the Prisma Figma workspace when a Figma MCP is connected.
- [`assets/logos/`](assets/logos/) — official Prisma logo/symbol, Prisma 8 mark + lockup, Postgres/Compute icons (`README.md`).
- [`assets/fonts/`](assets/fonts/) — bundled brand fonts (Mona Sans, Inter, Geist Mono); used by the scripts.
- [`assets/templates/`](assets/templates/) — modular starting families (`editorial`, `chart`, `code`, `table`, `flow`, `object`, `abstract`) sharing canvas/typography/token setup but **not** one composition; `cover.svg` is the legacy general-purpose base. Each carries the reusable primitive defs (wash, bloom, spectrum, beam, fade mask, grain).
- [`assets/examples/`](assets/examples/) — worked hero/meta pairs per content module. **Pre-rebrand (dark Eclipse era): study for composition and module structure ONLY — their palette, fonts, and surfaces are retired.** The current quality bar is the newest committed covers in `apps/blog/public/*/imgs/`.
- [`assets/hero1.svg`](assets/hero1.svg)–[`hero4.svg`](assets/hero4.svg) — abstract reference heroes, also pre-rebrand; same structure-only caveat.
- [`scripts/embed-fonts.py`](scripts/embed-fonts.py) — inline the brand fonts into the SVG as base64 `@font-face`. **Run first.**
- [`scripts/export-png.sh`](scripts/export-png.sh) — render the font-embedded SVG to PNG via headless Chrome so the PNG matches the SVG in a browser exactly. **Run second.**
- [`scripts/validate-covers.sh`](scripts/validate-covers.sh) — machine-check dimensions/size/fonts/frontmatter for a slug list or `--all`.
- [`scripts/contact-sheet.sh`](scripts/contact-sheet.sh) — thumbnail contact sheets for batch review.

## Output contract

Two images: a `hero` shown on the post itself, and a `meta` image for Open Graph and social
cards. A single design may serve both files.

**Contexts of use — design for all three.** A cover lives as (1) a **grid thumbnail** in the
blog index, cropped to ~16:9 by `object-cover` and rendered ~400px wide **directly beside the
post's real title**, on light AND dark card surfaces; (2) the full-size social/OG card; (3) the
in-post hero. The thumbnail-next-to-title context drives the hardest rules:

- **Headline**: a compressed thesis of ≤6 words, or no copy at all — never a restatement of the
  post title it will sit beside. Across a batch, vary composition (no-copy graphic-led,
  corner-stripe brand moment, headline+module) so adjacent covers don't read as one template.
- **Kicker**: ≥20px with a ≥5.5px dot, or omit it — a 17px kicker is noise at thumbnail scale.
- **Sign-off**: prefer the **full-color lockup** (`assets/logos/prisma-lockup-color.svg`,
  ~112px wide, inlined as a group) over the plain-text wordmark; the mark carries at thumbnail
  scale where small grey type disappears.
- **Crop-safe zone**: every critical element (lockup, kicker, headline, module edges) stays
  ≥72px from every canvas edge and must survive a centered 16:9 crop of the 1200×630 frame.
- **Dual-surface**: the artwork never theme-switches; it must read as an intentional object on
  both white and ink (#1a1a1a) surrounds. Avoid vast empty pure-white regions — washes on
  covers run a step stronger than page washes (~0.18–0.28 per stop) so the piece carries color
  at small sizes and on dark.

1. **Format.**
   - **hero: SVG by default** — the prisma.io/blog standard, and it suits the typographic,
     geometric heroes the blog favours. The SVG is the editable source of truth; always export
     its PNG too. Fall back to a raster (PNG) hero only when the hero is genuinely photographic,
     or when the operator asks for raster — and say so when you do.
   - **meta: PNG (raster) always.** Open Graph and social cards do not render SVG.
2. **Dimensions.** `1200×630 px` (standard Open Graph size, ~1.9:1) for **both** hero and meta
   by default.
   - **SVG:** `viewBox="0 0 1200 630"` with `width`/`height` set to `1200`/`630`.
   - **Raster:** `1200×630` at 1x (renders crisply on social cards, ~200–500 KB). A 2x export
     (`2400×1260`) is acceptable for retina crispness only if it stays within budget; otherwise
     drop back to 1x. Always preserve the 1.9:1 ratio.
   - Other canvases (in-post hero `844×474`, YouTube `1280×720`, custom) are produced on request
     — change `width`/`height`/`viewBox` and scale font sizes proportionally (≈ ×0.70 for the
     844-wide hero).
3. **Size budget.** Keep the meta PNG **under 1 MB**. A 1x export normally lands ~200–500 KB;
   a cover whose art is mostly smooth wash gradients can overshoot (one landed at 1.4 MB), so
   check the file and re-export at 1x, or flatten a redundant wash layer, if it does. Keep the
   SVG lean with **subset, embedded fonts** (step 6): a typographic cover lands ~30–55 KB, and
   a code/terminal-heavy one ~55–75 KB because the mono glyph subset is larger. Above ~120 KB,
   check that fonts actually subset (the venv python needs `fonttools` + `brotli`; without them
   `embed-fonts.py` silently falls back to embedding whole WOFF2 files). Prefer vector paths
   over embedded raster; flag any SVG over ~1 MB.
4. **Naming.** Base names `hero` and `meta`, extension following the format: `hero.svg` (or
   `hero.png` when raster) and `meta.png`. **No content hashes, no dimensions** in filenames.
   For N explored directions, suffix the base name (`hero-a.svg`/`meta-a.png`, …).
5. **One design, both files.** When one design serves hero and meta, render the meta PNG from the
   hero SVG so they are pixel-identical.
6. **Destination.** The image directory the recent posts use for the given `{slug}` (see
   _Discover blog conventions_). Fall back per step 7 of the workflow only when discovery yields
   nothing.

## Pre-conditions — halt if unmet

1. A blog post slug, or a post title to derive the kebab-case slug from. Ask if neither is given.
2. Reference material: the bundled `assets/` (examples, logos, fonts, tokens) or the recent posts
   found during discovery. Ask the operator to supply some if none is available.

## Discover blog conventions

Never hardcode blog structure: the repo evolves. Before designing, learn the current conventions
from the operator's checkout.

1. Find the last few published posts (most recent by date in filename or frontmatter).
2. From those posts, extract:
   1. **Image directory and filename pattern** for both hero and meta (e.g.
      `public/{slug}/imgs/hero.svg`, `meta.png`, or whatever the recent posts use).
   2. **Frontmatter fields** that point at the hero and the meta image, and the exact value shape
      each expects (public-relative path, relative path, etc.).
   3. **Prevailing hero format** (SVG vs raster) so the default matches what the blog ships.
3. Record the resolved directory, filenames, frontmatter fields, and value shapes; use them for
   the rest of the workflow.

## Inputs

Blog context drives the design. Useful inputs: title, subtitle/excerpt, the Prisma product in
focus, target audience, the core technical concept, desired mood, required dimensions, and the
output format. A path to the post's `index.mdx` is the richest input — read its frontmatter and
lead. A GitHub PR URL is also valid input: read the PR title/body and any changed blog
`index.mdx` files before designing.

## Workflow

### 0. (Optional) Refresh from the live Figma workspace

If a **Figma MCP is connected**, follow [`references/figma-mcp.md`](references/figma-mcp.md) to
reconcile `tokens.json` against the live Eclipse variables, sight the current cover frames for
layout/dimensions, and re-export any stale logos. Read-only — never edit the shared file. If no
Figma MCP is connected, skip this; the committed assets are the default.

### 1. Read the article and extract its message

The cover is driven by the article, never by a template. Do not start from "which layout?" —
start from "what is the most important idea in this article, and what visual best communicates
it?" Given an `index.mdx`, read the frontmatter and enough of the body to know what the piece
actually shows (code, numbers, architecture, story). Given a `prisma/web` PR URL, fetch the PR
metadata and changed blog files first.

Write down, before any drawing:

- **Primary message** — one sentence: *what should the reader understand after reading this?*
- **Core highlight** — one concrete idea from the article that can become the visual focus.
  Prefer, in order: a meaningful result → a surprising comparison → a product capability → a
  technical mechanism → a meaningful code pattern → an architecture relationship → a memorable
  conceptual idea. ("Query latency dropped from X to Y" → a chart with Y emphasized; "one
  expensive query causes most reads" → a query row with the read count highlighted; "this
  workflow reduces migration to three steps" → a three-stage flow.)
- Never invent numbers, claims, code, or technical details — everything shown must come from
  the article or another approved repository source.

Also extract: main product, audience, and emotional register (launch / educational /
conceptual / editorial / technical).

### 1b. Derive the cover title (separate from the article title)

Never place the full blog title on the image by default — the thumbnail renders directly
*beside* the real title, and metadata keeps the real title regardless. If text helps, derive a
short editorial title: **~3–7 words, max two lines**, strong display hierarchy, readable at
social-preview size, and not a marketing claim ("How we improved Prisma Postgres performance
for serverless applications" → `Faster Postgres` / `for serverless`). **If the visual already
communicates the message, no headline is a first-class choice.** Blog frontmatter titles are
never modified to fit a cover.

### 2. Gather inputs — interactive or inferred

Two ways to reach a design brief. Pick based on how the skill was invoked:

- **Inferred (default).** Context is rich (an `index.mdx`, a PR, a clear pitch). Infer the brief
  and ask only what you genuinely cannot — offer a recommended default with each, and prefer a
  structured-choice question when the environment supports one.
- **Interactive.** The operator asks for interactive/guided mode, or gives only a thin prompt
  ("make me a cover"). Drive the brief through the question set below in **one** structured-choice
  round (don't interrogate one question at a time). Skip any question already answered by context,
  and carry the recommended default into each.

**Interactive question set.** Always read the post first, then ask a single structured-choice
round. **Make every question context-aware** — phrase it around this specific post and carry the
recommended default (derived from the content) into each option, so the author can accept the
whole set in one pass. Title each round with the post, e.g. _"Blog hero — 'Price the Work, Not
the Workflow'"_.

| # | Question                               | Context to surface                                                                                                                                             | Default                                                                    |
| - | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1 | **Canvas size**                        | which format(s) this is for                                                                                                                                    | Social/OG 1200×630 (offer in-post hero 844×474, YouTube 1280×720, custom)  |
| 2 | **Text on the cover?**                 | "Most Prisma blog images carry **no copy** — the graphic + `Prisma` wordmark carry it. But this post has a strong short thesis that could work as a headline." | No copy, unless the thesis is short and punchy                             |
| 3 | **Custom copy** (if text)              | quote the post's own thesis as the suggestion                                                                                                                  | the post's thesis verbatim; blank = no text                                |
| 4 | **What should the graphic symbolise?** | restate the post's core idea in concrete terms                                                                                                                 | the literal mechanism from the post                                        |
| 5 | **Isometric skew on the graphic?**     | "Default yes for card/table modules; flow/loop diagrams usually read best **flat**."                                                                           | yes for cards/tables, flat for flows                                       |
| 6 | **Accent color**                       | name the owning product                                                                                                                                        | cyan (ORM / Prisma 8 / platform); yellow (Postgres); red (Compute)         |
| 7 | **Mood**                               | launch / educational / conceptual / editorial / technical                                                                                                      | educational, light paper                                                   |
| 8 | **Product logo**                       | which mark, if any                                                                                                                                             | the post's product mark when it clarifies; else just the `Prisma` wordmark |
| 9 | **How many directions to explore?**    | 1–4 distinct concepts                                                                                                                                          | 1 (offer up to 4)                                                          |

Turn the answers into the brief(s) in step 3. **No-copy is a first-class, common choice** — when
chosen, the graphic + `Prisma` wordmark carry the cover. If **N directions** are requested,
produce N separate `hero`/`meta` pairs (`hero-a`, `hero-b`, …) and present them together. Honor
every "must be present" element and the chosen logo/skew/background; creative direction still
obeys the anti-patterns and the design-review bar — creative ≠ slop.

### 3. Design brief — establish before rendering

Route the highlight to a **component family** via
[`references/component-library.md`](references/component-library.md) (HeroChart,
MetricComponent, ComparisonTable, CodeWindow, QueryPanel, ArchitectureFlow, DatabaseObject,
PrismObject, GradientField, TypeMark) and pick **one** light treatment from
[`references/gradient-system.md`](references/gradient-system.md). Surface is light paper by
default; dark only with a stated reason. Anchor exact values in `design-system.md` /
`tokens.json`.

Write the brief before drawing — every field, explicitly:

- **Core message:** the one sentence from step 1.
- **Highlight:** the specific fact, mechanism, result, or idea that becomes visually dominant.
- **Visual metaphor:** the simplest form that communicates it.
- **Component:** which family carries it (chart, table, code, query panel, flow, object,
  abstract, type).
- **Product & accent:** the owning product and its canonical prism accent.
- **Gradient:** the single light treatment that reinforces the concept — and what that light
  is *doing* (atmosphere, emphasis, movement, material).
- **Headline:** the derived cover title from step 1b, or "none".
- **Empty space:** which area of the canvas stays deliberately open.

**Composition principles:** one dominant visual element, asymmetrical balance, obvious
hierarchy, large forms, fewer better components — *one idea, one hero, one highlight, plenty
of space*. Component budget: 1 hero component, 0–1 supporting, 1 gradient treatment, 0–1
kicker, 0–1 headline, 0–1 brand mark. One obvious focal element the viewer finds in under a
second; never competing highlights; never fill space because it exists. Simplicity comes from
editing, not from blandness.

### 4. Select assets

From `assets/logos/`: use an official logo or product mark only when it clarifies the idea.
Default to **no footer chrome**. If a brand sign-off is wanted, place the `Prisma` wordmark in
the **bottom-left as plain text with no logo mark beside it**, or use a single official product
lockup as the subject — never pair an icon with extra "Prisma" text, and **never** add
`prisma.io/blog` to the canvas. Drop the wordmark entirely rather than crowd the frame. Pull exact
hex/fonts from `tokens.json`; do not introduce off-system colors, fonts, or stock imagery.

### 5. Generate the SVG

Copy the `assets/templates/` family that matches the brief's component (fall back to
`cover.svg`), fill the `{{TOKENS}}`, and replace its placeholder module with the real one — or
hand-compose when the graphic is the message (e.g. a chart). Keep named layer groups
(`background`, `kicker`, `headline`, `module`, `brand`) so it stays editable, and reuse the
primitive defs (`wash-*`, `bloom`, `spectrum`, `beam`, `fadeMask`, `grain`) instead of
duplicating raw gradient stops. Hand-wrap the headline into 1–2 lines. Include the
`<title>`/`<desc>` metadata (the full post title belongs in `<title>`, not on canvas).

**Fonts (avoid the #1 off-brand bug):** the brand faces are **Sora** (headings/display, weight
500, emphasis 600 — never 700+), **Inter** (body 400, kicker labels 600), and **Mona Sans Mono**
(data/code, 500), bundled in `assets/fonts/`. Do **not** use Mona Sans display, Geist Mono, or
Barlow — those are the retired pre-rebrand faces. A wrong family/weight falls back to a
generic sans. For emphasis, change colour or size, **not** weight. When the graphic _is_ the
message, let it own the canvas — center it, drop competing chrome, use the standalone product logo
as the brand mark, and label data with real numbers.

Keep text short. Don't repeat the full blog title when a sharper phrase reads better — use the post
title in `<title>` metadata and a shorter headline on canvas. Supporting lines must be factual
labels, not taglines. Avoid fluffy copy, ellipses, and stacked sentence fragments.

**Diagram cards (the right-side metaphor):** keep the card off the canvas edge — **≥ 48px margin**
on the right (1200-wide canvas → card right edge ≤ ~1128). Position absolutely, not via a group
`transform` that pushes past the edge. Inside: give arrows real length (~40–56px shaft +
arrowhead), pad content evenly from the card walls, and make every node **labeled and connected**
— a flow should end in a recipient (`client`, `webp` file, deploy target), not a dangling arrow.
Tie any header number to the data it labels, and highlight the "live"/current element.

**SVG text rendering gotchas (librsvg/rsvg-convert):**

- **Whitespace between `<tspan>`s is stripped.** With the default `xml:space`, librsvg trims
  whitespace on each `tspan`, so `export default` + `<tspan> defineComputeConfig` renders as
  `export defaultdefineComputeConfig`. For any multi-`tspan` line that needs internal spaces (code
  snippets especially), put **`xml:space="preserve"` on each `<text>` element itself**, and keep the
  text content on a single source line so `preserve` doesn't pull in indentation.
  **Put it on the `<text>`, never only on a wrapping `<g>`:** Chrome does not inherit
  `xml:space` from a group, so a `<g xml:space="preserve">` around code `<text>` nodes **fails
  silently** — the SVG looks right in source and every leading space and column alignment
  vanishes in the exported PNG. This is the single most expensive gotcha in the pipeline because
  nothing errors; it is only visible by opening the raster. Grep your finished SVG for
  `<g[^>]*xml:space` and move any hit down onto the individual `<text>` elements.
- **Long words don't wrap.** SVG `<text>` has no auto-wrap — hand-split into `<tspan>` lines with
  explicit `x`/`dy`.
- **Gradients on straight lines need `gradientUnits="userSpaceOnUse"`.** An objectBoundingBox
  gradient (the default) degenerates on a purely horizontal or vertical `<line>`/`<path>` —
  the stroke silently renders empty. Every gradient beam sets `userSpaceOnUse` with real
  coordinates.
- **Centering: avoid `text-anchor="middle"` + `dx`.** For a bold-name + quiet-label pair (e.g.
  `api` / `Hono`), stack two single-run centered lines on the same `x`. Always **measure**
  centering against the rendered PNG — never eyeball the source.

### 6. Embed fonts FIRST, then export the PNG

Order matters — the PNG must be rendered from the **font-embedded** SVG so the raster and the SVG
are pixel-identical:

```bash
python3 scripts/embed-fonts.py <hero.svg>                          # 1. inline brand fonts
bash scripts/export-png.sh <hero.svg> <meta.png> 1200 630          # 2. render PNG (Chrome)
```

`embed-fonts.py` inlines Sora/Inter/Mona Sans Mono as base64 `@font-face` — subsetting to the
glyphs the SVG uses (with `fonttools` + `brotli`, ~20–30 KB) or embedding the whole WOFF2 when
those are unavailable (larger, still self-contained). `export-png.sh` renders with **headless
Chrome/Chromium**, which honors `@font-face`, so the PNG looks exactly like the SVG in a
browser/Figma. (librsvg/`rsvg-convert` ignores `@font-face` and falls back to a generic sans — the
old "PNG looks different from the SVG" bug. rsvg/magick are kept only as warned fallbacks.) Chrome
renders at 1x by default; set `SCALE=2` for a supersampled, extra-crisp render. If you edit a
committed SVG (fonts already embedded), just re-run `export-png.sh`.

### 7. Save into the repo

Save to a **durable** location, never a temp dir. Resolve in this order:

1. **Discovered blog convention (preferred for live blog assets).** Use the directory,
   filenames, and frontmatter fields resolved in _Discover blog conventions_ — e.g.
   `apps/blog/public/{slug}/imgs/hero.svg` + `hero.png`, social/OG → `meta.png`. Fall back to
   `apps/blog/public/{slug}/imgs/` only when discovery yields nothing.
2. **Skill examples.** When the operator asks for examples, samples, or quality references for
   this skill, save under `assets/examples/<slug>/hero.svg` + `meta.png`, keeping `<slug>` aligned
   with the blog post slug.
3. **Fallback** (no web checkout / generating ahead of the post): `blog-covers/<slug>/` at the
   repo root with clear per-format names; tell the operator to move them into the post's `imgs/`
   folder when the post lands.

Always announce the absolute path before writing outside the current repo.

### 8. Wire into the post frontmatter

Set the resolved hero and meta frontmatter fields (from discovery) to the resolved value shapes.
If a field already exists, confirm it points at the new file. Report the exact frontmatter lines.

### 9. Design review (render → critique → fix loop)

Cover design is a render → critique → fix loop, not a one-shot. Run the structured review in
[`references/design-review.md`](references/design-review.md) — critique the **rendered PNG**, never
the SVG source:

1. **Open the PNG and react** — one honest first-impression sentence (premium, or AI filler?).
   Most defects — cramped margins, stripped whitespace in code, stubby arrows, a node touching the
   edge — are invisible in the markup and obvious in the raster.
2. **Grade the 10 categories A–F** (hierarchy, type, colour, spacing, composition, metaphor,
   render fidelity, thumbnail legibility, brand, AI-slop). Anything below B is a finding.
3. **Fix worst-first, minimally**: locate in the SVG → smallest fix → re-render → re-inspect →
   classify `verified`/`best-effort`/`reverted`. Repeat until every category is ≥ B.
4. When refining a committed example, edit the `hero.svg` (the embedded `@font-face` survives edits
   to visual elements), then **regenerate `meta.png`** so the committed raster matches.

### 10. Return paths + rationale

Report the saved SVG and PNG paths and 2–3 sentences on the design direction (surface, accent,
product, why the metaphor fits). Example:

```text
hero: apps/blog/public/query-insights-ga/imgs/hero.svg
meta: apps/blog/public/query-insights-ga/imgs/meta.png
Direction: Paper surface with a bottom spectral wash and the Postgres yellow accent; Query
Insights framed as a GA launch via the kicker dot; one white metric card carries the idea and
restraint keeps it premium and thumbnail-legible.
```

## Batch mode (multiple posts)

When covering many posts in one effort, two extra disciplines apply:

1. **Plan distribution first.** Route every post (step 3) *before* drawing any, and balance
   the family mix — charts, code, tables, flows, typography-led, objects, abstract, query
   treatments. No family dominates; adjacent/series posts don't share family + layout.
   Cohesion comes from type, color, surfaces, spacing, and restraint — never one composition.
2. **Review the set together.** After individual reviews, build contact sheets
   (`scripts/contact-sheet.sh <out> <meta.png>…` — 24 thumbnails per sheet at the 300px
   review size) and inspect for: repeated layouts, repeated gradient treatments, covers too
   dense, covers that don't reflect their article, weak typography or truncation, thumbnail
   illegibility. Revise the weak or repetitive ones, then re-sheet.

`scripts/validate-covers.sh <blog-app-dir> --all` (or a slug list) machine-checks dimensions,
size budget, embedded fonts, and frontmatter wiring for every cover.

## Validation — must pass before finalizing

Visually inspect the rendered PNG, then verify:

- [ ] Dimensions are `1200×630` (~1.9:1) for both images (or the requested format, ratio
      preserved). SVG declares `viewBox="0 0 1200 630"` with matching `width`/`height`.
- [ ] The meta image is **PNG**; the hero is **SVG** (raster hero only on an explicit photographic
      request). Each asset is self-contained — the SVG resolves with no external references.
- [ ] Colors match `tokens.json` exactly — no off-system values, and **no retired dark-aurora
      teal/navy surfaces**. The surface is light paper unless a dark cover was explicitly chosen.
- [ ] Fonts render in real Sora/Inter/Mona Sans Mono (not a fallback sans; **not Mona Sans
      display, Geist Mono, or Barlow** — all retired); heed the export warning. The committed SVG
      has embedded `@font-face` (ran `embed-fonts.py`). Headlines are Sora **500**, sentence case.
- [ ] One accent, one idea. Clear hierarchy; generous negative space. If a graphic is the message,
      it is centered and uncluttered.
- [ ] The visual represents the article's **primary message**, and the single dominant highlight
      is the brief's **core highlight** — no competing highlights, no elements that say nothing
      about the article.
- [ ] Exactly **one** gradient/light treatment, and it behaves like light, depth, material, or
      data emphasis — not decoration (see `gradient-system.md` anti-patterns).
- [ ] The headline (if any) is the derived cover title (≈3–7 words, ≤2 lines), not the full
      article title; the article's frontmatter `title` was not modified to fit the cover.
- [ ] Diagram cards sit ≥ 48px off the canvas edge; arrows are full-length; no node is jammed
      against a wall; every flow ends in a labeled recipient.
- [ ] Code/snippet text renders its spaces correctly (multi-`tspan` lines carry
      `xml:space="preserve"`).
- [ ] Title text is legible as a small thumbnail **and** at full 1200px social-preview size.
- [ ] The cover reads as intentional artwork on BOTH white and ink (#1a1a1a) surrounds (render
      the PNG onto each and look); no vast empty pure-white regions; critical elements are ≥72px
      from every edge and survive a centered 16:9 crop.
- [ ] The headline (if any) is ≤6 words and does not restate the post title; the kicker (if any)
      is ≥20px; the sign-off is the full-color lockup unless there's a reason for text.
- [ ] Any logo/lockup is intentional, correctly colored, not stretched, and not paired with extra
      label text. The `Prisma` wordmark, if used, sits bottom-left with no mark beside it.
- [ ] Any data/chart uses real numbers and the framing the prompt asked for.
- [ ] The canvas does not contain `prisma.io/blog`.
- [ ] **No** noisy background, random gradient, stock illustration, or unrelated decoration.
- [ ] Size budget: meta PNG **under 1 MB**; SVG lean (subset fonts, vector paths).
- [ ] SVG is layered/grouped and includes `<title>`/`<desc>`.
- [ ] Both files saved to a durable repo path (not temp), and the resolved frontmatter fields point
      at them.

## Anti-patterns

(Format, filename, and destination rules live in _Output contract_ and _Validation_; these are the
creative and brand traps a checklist can't catch.)

- **Hardcoding blog conventions.** The repo evolves — always discover the image directory,
  filenames, and frontmatter fields from recent posts; the documented standard is a fallback.
- **Generic AI look.** Glows everywhere, faux-3D blobs, busy gradients, literal robots. Prisma
  covers are restrained and typographic. When in doubt, remove an element.
- **The template-generator look.** Random glowing cards, glassmorphism, meaningless UI, tiny
  dashboards, fake charts/data/terminal output, decorative floating icons, browser mockups,
  giant logos as decoration, everything centered, multiple competing components. Final test:
  *would this still feel art-directed with the logo removed, and does any element fail to
  communicate something about the article?* Remove what fails.
- **One repeated layout across a batch.** `headline-left + rounded-card-right` for every post
  is the failure mode. Across a set of covers keep a healthy distribution of chart, code,
  table, flow, typography-led, object, abstract, and query treatments; cohesion comes from
  typography, color, surfaces, spacing, and restraint — not identical composition.
- **Off-system styling.** Inventing colors, or swapping the Sora + Inter pairing (Mona Sans
  display, Geist Mono, and Barlow are all retired/off-brand).
- **Reaching for the retired look.** The dark teal aurora surface, Mona Sans 800 headlines,
  uppercase dash eyebrows, and glow-heavy cards are the pre-2026 style — old committed covers and
  `assets/examples/` show it; do not reproduce their skin.
- **Decorative logos.** Marks are a footer sign-off or the subject — never wallpaper.
- **Centering text-only layouts.** Default covers are left-anchored with right-side breathing room.
  Center only a single graphic-led composition.
- **Fabricating product palettes.** ORM / Prisma 8 = prism cyan, Postgres = prism yellow,
  Compute = prism red (see `tokens.json → products`). One accent per cover; don't invent hues or
  revive the old teal/indigo mapping.
- **Tagline filler.** Avoid lines like `Resize. Encode. Cache.` If a secondary line is needed,
  make it concrete and informational.
- **Copying a single reference.** Synthesise the house style from across the examples and recent
  posts' images; do not clone one asset.
