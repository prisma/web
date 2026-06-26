# Design review (cover art)

A structured design-critique pass for blog/social cover art. Adapted for **static SVG/PNG
covers** from the gstack `design-review` skill (a senior-designer-who-codes audit:
first-impression → categorized audit with A–F grades → atomic fix loop). The original audits
live web UIs for interaction/responsive quality; covers have no interactions, so those
categories are dropped and render-fidelity + thumbnail legibility are added.

Run this in **step 8 of the workflow** before finalizing, and any time you refine an existing
cover. Critique the **rendered PNG**, not the SVG source — most defects are invisible in markup.

## Three laws (apply to every cover)

1. **Don't make me think.** The concept must be legible in ~3 seconds. If a viewer has to
   decode the metaphor, the cover failed.
2. **Thinking is the cost, not pixels.** Minimize cognitive load — one idea, one accent, one
   focal point. Every extra element taxes the reader.
3. **Omit, then omit again.** When in doubt, remove an element. Restraint is the house style.

## Audit: grade each category A–F

Start with a **first-impression gut reaction** (one honest sentence, before analysis: does it
look premium, or does it look like AI filler?). Then grade:

| #  | Category                    | What to check                                                                                                                                                                             |
| -- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | **Hierarchy & focal point** | One clear focal point; eye lands where intended; eyebrow → headline → support → graphic order reads cleanly.                                                                              |
| 2  | **Typography**              | Mona Sans (display) / Inter (body) / Geist Mono (data) only — never Barlow or a fallback sans. Emphasis via colour or size, never random weights. Title hand-wrapped, not overflowing.    |
| 3  | **Colour & contrast**       | Only `tokens.json` values. Text passes a squint legibility test on the dark surface. One accent (teal/indigo), not a rainbow.                                                             |
| 4  | **Spacing & alignment**     | Even canvas margins; elements share a grid; consistent padding inside cards; nothing kissing an edge.                                                                                     |
| 5  | **Composition & balance**   | Left-anchored headline with right-side breathing room (or a single centred graphic). Diagram cards sit ≥ 48px off the canvas edge. Visual weight balanced L↔R.                            |
| 6  | **Metaphor clarity**        | The diagram tells one true story; arrows connect real nodes; every flow ends in a labelled recipient; header numbers match the data they label.                                           |
| 7  | **Render fidelity**         | No stripped whitespace in code (`xml:space="preserve"`), no missing-glyph boxes, no fallback fonts, no text overflow or clipping, no overlapping nodes.                                   |
| 8  | **Thumbnail legibility**    | Still readable shrunk to ~200px wide (the real feed/SERP size). Squint: headline + metaphor survive.                                                                                      |
| 9  | **Brand correctness**       | Logos intentional, correctly coloured, not stretched, not wallpaper; no `prisma.io/blog` on canvas; product accent correct (Postgres = teal, ORM = indigo, Compute/Next = platform teal). |
| 10 | **AI-slop check**           | None of the anti-patterns below.                                                                                                                                                          |

A cover ships at **B or better in every category** — no C-or-lower anywhere.

## AI-slop anti-patterns (auto-fail any present)

Adapted from gstack's slop list:

- Purple/rainbow gradients; glows on everything.
- Faux-3D blobs, glassmorphism soup, drop-shadow overload.
- Icon-in-a-circle grids; uniform bubbly corner radius everywhere.
- Everything centred (covers are left-anchored unless a single graphic owns the canvas).
- Emoji used as a design element.
- Generic hero copy ("Unlock the power of…", "Supercharge your…", "The future of…").
- Stock illustrations, literal robots, mascots.
- Decorative tagline filler with periods ("Resize. Encode. Cache.").

## Fix loop

For each finding, worst-first:

1. **Locate** the element in the `hero.svg`.
2. **Fix minimally** — smallest change that resolves it; don't redesign around a small flaw.
3. **Re-render** the PNG and **re-inspect** — confirm the fix landed and broke nothing else.
4. **Classify**: `verified` (looks right in the raster), `best-effort` (improved but
   constrained), or `reverted` (fix made it worse — roll back).
5. Re-grade the affected categories. Repeat until every category is ≥ B.

Then regenerate the committed PNG so it matches the SVG, and re-run `embed-fonts.py` if fonts
aren't yet embedded.

## Verify alignment by measurement, not by eye

Alignment/centering claims must be **measured against the rendered raster**, not judged by
eye — a few pixels of drift is invisible at a glance but obvious to the author, and "looks
centered in my render" is not "is centered". For any centering or alignment a reviewer
asserts is fixed, prove it with pixel coordinates:

```bash
# Trim the ink inside a region and report its bounding box + offset within the crop.
# Compare the ink center to the intended geometry (chip center, row center, card center).
magick meta.png -crop <W>x<H>+<X>+<Y> +repage -fuzz 35% -trim \
  -format "ink %wx%h at +%X+%Y  (center x=%[fx:<X>+page.x+w/2] y=%[fx:<Y>+page.y+h/2])" info:
```

- Use a low-ish `-fuzz` (~30–40%) so dim secondary text (greys) is kept as ink, not trimmed
  as background; too high a fuzz silently drops it and gives a false center.
- Measure connector legs, bar extents, and the vertical drop the same way (they're font-free
  paths, so they render identically everywhere) and confirm legs land on the elements they
  point at.
- A claim ships only when the measured center matches the intended center within ~1px.

**Renderer-portable centering.** `text-anchor="middle"` on a single text run centers
identically in every renderer (librsvg, browsers, Figma). `text-anchor="middle"` combined
with a child `<tspan dx="…">` can drift between renderers — so for a label that pairs a bold
name with a quiet annotation (e.g. `api` + `Hono`), prefer **two single-run centered lines
stacked** on the same x over one mixed-run line with `dx`. It is both more portable and reads
as obviously centered (the bold word sits dead-center instead of left-of-block).

## Report

When asked for a review (not just a fix), report concisely:

```text
First impression: <one honest sentence>
Grades: hierarchy A · type A · colour B · spacing A · composition B · metaphor A ·
        render A · thumbnail B · brand A · slop pass
Findings → fixes:
  1. [composition, C→A] card touched right edge → pulled to 72px margin (verified)
  2. [render, F→A] code spaces stripped → added xml:space="preserve" (verified)
Result: ships.
```
