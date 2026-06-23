---
name: content-create-hero-image
description: Use when the operator wants a hero or meta image for a Prisma blog post; asks to create or generate a blog hero, cover, social card, Open Graph, or YouTube image; mentions cover art, a blog thumbnail, cover.svg/hero.svg/meta.png; references content-create-hero-image; or wants to interactively design cover imagery in Prisma's Eclipse house style. Produces an editable SVG hero plus a pixel-exact PNG meta image, and includes an interactive mode and a built-in design-review pass.
metadata:
  author: Prisma
  version: "2026.6.23"
---

# Create blog hero & meta images

Produce the **hero** and **meta** (Open Graph) images for a Prisma blog post in the Eclipse
house style, styled from the bundled reference assets and from the most recent posts in the
operator's checkout, then wire them into the post's frontmatter.

The hero is a hand-authored, layered **SVG** — the editable source of truth — rendered to a
**pixel-exact PNG**. The meta image is **raster (PNG)** because social platforms do not render
SVG. A single design usually serves both. Output is saved into the repo, not just returned in
chat.

Companion to `content-write-blog` (which scaffolds the post itself). This skill makes the
imagery; it can be invoked standalone or as the cover step of that workflow.

## Read first

Use [`README.md`](README.md) when the operator asks how to use this skill or wants sample
prompts. Use this `SKILL.md` as the execution contract when actually producing assets. Read
[`references/design-system.md`](references/design-system.md) **before designing** and
[`references/design-review.md`](references/design-review.md) **before the design-review pass**.

## References (load on demand)

- [`references/design-system.md`](references/design-system.md) — colors, fonts, layout recipe, the **content-module catalog**, formats, sources. **Read before designing.**
- [`references/design-review.md`](references/design-review.md) — structured critique (A–F grades, AI-slop list, fix loop), adapted from the gstack `design-review` skill. **Read before the review pass.**
- [`assets/tokens.json`](assets/tokens.json) — machine-readable tokens; the source of truth for hex/font values.
- [`references/figma-source.md`](references/figma-source.md) — what `SOCIALS.fig` contains and how it was extracted.
- [`references/figma-mcp.md`](references/figma-mcp.md) — **optional**: pull live specs/assets from the Prisma Figma workspace when a Figma MCP is connected.
- [`assets/logos/`](assets/logos/) — official Prisma logo/symbol, Prisma Next mark + lockup, Postgres/Compute icons (`README.md`).
- [`assets/fonts/`](assets/fonts/) — bundled brand fonts (Mona Sans, Inter, Geist Mono); used by the scripts.
- [`assets/templates/cover.svg`](assets/templates/cover.svg) — parameterized starting template.
- [`assets/examples/`](assets/examples/) — one worked hero/meta pair per house content module; the quality bar for new work.
- [`assets/hero1.svg`](assets/hero1.svg)–[`hero4.svg`](assets/hero4.svg) — abstract reference heroes in the house style; study for palette, type, and motif alongside the worked examples.
- [`scripts/embed-fonts.py`](scripts/embed-fonts.py) — inline the brand fonts into the SVG as base64 `@font-face`. **Run first.**
- [`scripts/export-png.sh`](scripts/export-png.sh) — render the font-embedded SVG to PNG via headless Chrome so the PNG matches the SVG in a browser exactly. **Run second.**

## Output contract

Two images: a `hero` shown on the post itself, and a `meta` image for Open Graph and social
cards. A single design may serve both files.

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
3. **Size budget.** Keep the meta PNG **under 1 MB** (1x normally lands ~200–500 KB; re-export
   at 1x if a denser export overshoots). Keep the SVG lean: **subset, embedded fonts** (see step
   6) land each hero around ~20–30 KB. Prefer vector paths over embedded raster; flag any SVG
   over ~1 MB.
4. **Naming.** Base names `hero` and `meta`, extension following the format: `hero.svg` (or
   `hero.png` when raster) and `meta.png`. **No content hashes, no dimensions** in filenames.
   For N explored directions, suffix the base name (`hero-a.svg`/`meta-a.png`, …).
5. **One design, both files.** When one design serves hero and meta, render the meta PNG from the
   hero SVG so they are pixel-identical.
6. **Destination.** The image directory the recent posts use for the given `{slug}` (see
   _Discover blog conventions_). Fall back per step 7 of the workflow only when discovery yields
   nothing.

## Pre-conditions — halt if unmet

1. A blog post slug is known or can be derived. If the operator has not given one, ask for the
   slug or the post title and derive the kebab-case slug.
2. The reference material is present: the bundled `assets/` (examples, logos, fonts, tokens) — or
   the recent posts found during discovery. If nothing is available, ask the operator to supply
   reference material before proceeding.

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

### 1. Read the blog context

Extract: main product, core concept, audience, and intended emotional register (launch /
educational / conceptual / editorial / technical). Given an `index.mdx`, read the frontmatter
(`title`, `metaDescription`, `slug`) and the lead paragraph. Given a `prisma/web` PR URL, fetch
the PR metadata and changed blog files, then design one hero/meta pair per changed post unless the
operator asks for a single combined cover.

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
| 6 | **Background family**                  | name the product's surface                                                                                                                                     | teal (Postgres/Compute/Next/platform); indigo only for ORM                 |
| 7 | **Mood**                               | launch / educational / conceptual / editorial / technical                                                                                                      | educational, dark                                                          |
| 8 | **Product logo**                       | which mark, if any                                                                                                                                             | the post's product mark when it clarifies; else just the `Prisma` wordmark |
| 9 | **How many directions to explore?**    | 1–4 distinct concepts                                                                                                                                          | 1 (offer up to 4)                                                          |

Turn the answers into the brief(s) in step 3. **No-copy is a first-class, common choice** — when
chosen, the graphic + `Prisma` wordmark carry the cover. If **N directions** are requested,
produce N separate `hero`/`meta` pairs (`hero-a`, `hero-b`, …) and present them together. Honor
every "must be present" element and the chosen logo/skew/background; creative direction still
obeys the anti-patterns and the design-review bar — creative ≠ slop.

### 3. Choose a visual direction

Decide a concept that's literal-but-elegant, never generic. Pick: surface (dark default / light
editorial), product accent, eyebrow label, the **content module** that fits the content (see
`design-system.md` → _Content modules_: pipeline/flow, data/log panel, terminal, code card,
comparison card), and whether a product lockup belongs in the composition. Anchor every choice in
`design-system.md`. One accent, one idea, strong hierarchy, generous space.

Before drawing, write a compact design brief for yourself:

- **Message:** the one sentence the cover must communicate.
- **Metaphor / module:** the concrete visual structure, preferably from the post itself (log,
  stream, config file, deploy target, image pipeline, chart, …).
- **Product signal:** the product logo/icon to use, or "Prisma only" if no product owns it.
- **Output path:** the discovered blog asset path, the example path, or the fallback path.

### 4. Select assets

From `assets/logos/`: use an official logo or product mark only when it clarifies the idea.
Default to **no footer chrome**. If a brand sign-off is wanted, place the `Prisma` wordmark in
the **bottom-left as plain text with no logo mark beside it**, or use a single official product
lockup as the subject — never pair an icon with extra "Prisma" text, and **never** add
`prisma.io/blog` to the canvas. Drop the wordmark entirely rather than crowd the frame. Pull exact
hex/fonts from `tokens.json`; do not introduce off-system colors, fonts, or stock imagery.

### 5. Generate the SVG

Copy `assets/templates/cover.svg` and fill the `{{TOKENS}}`, or hand-compose when the graphic is
the message (e.g. a chart) — keep the layer groups (`background`, `badge`, `headline`, `brand`,
`chart`) so it stays editable. Hand-wrap the title into 1–3 lines (drop title size to 56px if > 30
chars). Set the eyebrow/badge pill width to roughly `(label length × 14) + 48`. Include the
`<title>`/`<desc>` metadata.

**Fonts (avoid the #1 off-brand bug):** the brand faces are **Mona Sans** (headings/display, 800),
**Inter** (body, 400), and **Geist Mono** (data/code, 500), bundled in `assets/fonts/`. Do **not**
use Barlow — it is the legacy docs face and reads off-brand. A wrong family/weight falls back to a
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
  snippets especially), put **`xml:space="preserve"`** on the parent `<text>`/`<g>`, and keep the
  text content on a single source line so `preserve` doesn't pull in indentation.
- **Long words don't wrap.** SVG `<text>` has no auto-wrap — hand-split into `<tspan>` lines with
  explicit `x`/`dy`.
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

`embed-fonts.py` inlines Mona Sans/Inter/Geist Mono as base64 `@font-face` — subsetting to the
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
Direction: Dark Eclipse surface with the Postgres teal accent; Query Insights framed as a GA
launch via the pill eyebrow; restraint keeps it premium and thumbnail-legible.
```

## Validation — must pass before finalizing

Visually inspect the rendered PNG, then verify:

- [ ] Dimensions are `1200×630` (~1.9:1) for both images (or the requested format, ratio
      preserved). SVG declares `viewBox="0 0 1200 630"` with matching `width`/`height`.
- [ ] The meta image is **PNG**; the hero is **SVG** (raster hero only on an explicit photographic
      request). Each asset is self-contained — the SVG resolves with no external references.
- [ ] Colors and gradient match `tokens.json` exactly — no off-system values.
- [ ] Fonts render in real Mona Sans/Inter/Geist Mono (not a fallback sans, and **not Barlow**);
      heed the export warning. The committed SVG has embedded `@font-face` (ran `embed-fonts.py`).
- [ ] One accent, one idea. Clear hierarchy; generous negative space. If a graphic is the message,
      it is centered and uncluttered.
- [ ] Diagram cards sit ≥ 48px off the canvas edge; arrows are full-length; no node is jammed
      against a wall; every flow ends in a labeled recipient.
- [ ] Code/snippet text renders its spaces correctly (multi-`tspan` lines carry
      `xml:space="preserve"`).
- [ ] Title text is legible as a small thumbnail **and** at full 1200px social-preview size.
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

- **Hardcoding blog conventions.** The repo evolves — always discover the image directory,
  filenames, and frontmatter fields from recent posts; the documented standard is a fallback.
- **An SVG meta image.** Open Graph and social cards do not render SVG; the meta image is always
  raster.
- **A raster hero by default.** SVG is the house standard for the hero; use PNG only when the hero
  is genuinely photographic and the operator asked for it.
- **Generic AI look.** Glows everywhere, faux-3D blobs, busy gradients, literal robots. Prisma
  covers are restrained and typographic. When in doubt, remove an element.
- **Off-system styling.** Inventing colors, or swapping the Mona Sans + Inter pairing (Barlow is
  off-brand).
- **Decorative logos.** Marks are a footer sign-off or the subject — never wallpaper.
- **Centering text-only layouts.** Default covers are left-anchored with right-side breathing room.
  Center only a single graphic-led composition.
- **Content hashes or dimensions in filenames.** Keep the base names `hero` and `meta`; the
  extension follows the format and nothing else.
- **PNG-only or SVG-only.** SVG is the editable source of truth; the PNG is the export. Produce
  both for the hero; the meta is always PNG.
- **Saving to temp.** Final assets live in a durable repo location.
- **Fabricating product palettes.** Postgres = teal, ORM = indigo. Compute/Next have no official
  tokens yet — use the platform teal and say so; don't invent a brand color.
- **Tagline filler.** Avoid lines like `Resize. Encode. Cache.` If a secondary line is needed,
  make it concrete and informational.
- **Copying a single reference.** Synthesise the house style from across the examples and recent
  posts' images; do not clone one asset.
