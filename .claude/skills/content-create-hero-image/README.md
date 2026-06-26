# Create blog hero & meta images

Produces an editable **SVG hero** and a **pixel-exact PNG meta** image for a Prisma blog post in
the Eclipse visual style, using the bundled brand tokens, logos, and fonts. The hero SVG is the
source of truth; the PNG is the export, and the meta image is always raster (Open Graph and social
cards do not render SVG).

`SKILL.md` is the execution contract. This README is the usage and iteration guide.

## Usage

Invoke `content-create-hero-image` with the richest context you have:

- a blog post path — `apps/blog/content/blog/<slug>/index.mdx`
- a `prisma/web` PR URL (one hero/meta pair per changed post)
- a one-line title/pitch plus the product and target format

**Interactive mode** — ask for guided/interactive mode (or invoke with only a thin prompt) and the
skill drives the brief with you in one round: the blog title or content, the one thing to
**highlight**, whether there's **copy** on the cover, what **must be present** (a logo, command,
metric, or metaphor), plus format and surface. It honors every required element and designs around
your highlight.

```text
Use content-create-hero-image in interactive mode. The post is "Prisma Compute config file";
highlight that one typed file targets every app; the prisma.compute.ts snippet must be present.
```

```text
Use content-create-hero-image for apps/blog/content/blog/prisma-compute-config-file/index.mdx.
Create a 1200x630 hero + meta and save hero.svg + meta.png under
assets/examples/prisma-compute-config-file/.
```

```text
Use content-create-hero-image for https://github.com/prisma/web/pull/7962.
Read the changed post and generate one hero/meta pair with the metaphor
"tokens append to a durable log before the UI tails them".
```

The skill discovers the blog's current conventions, reads the context, picks one concrete
metaphor, builds a layered hero SVG, embeds the fonts, exports a pixel-exact meta PNG, and saves
both to a durable path.

## How to iterate

Covers are a **render → critique → fix** loop. Don't judge the SVG source — judge the raster.
Critique with [`references/design-review.md`](references/design-review.md) — a structured pass
(first-impression → 10 categories graded A–F → AI-slop check → worst-first fixes), adapted from
the [gstack `design-review`](https://awesomeskill.ai/skill/gstack-gstack-design-review) skill.
Anything below a B is a finding; fix and re-render until every category clears.

```bash
# 1. embed brand fonts into the SVG (do this BEFORE rendering)
python3 scripts/embed-fonts.py assets/examples/<slug>/hero.svg

# 2. render via headless Chrome — matches the SVG-in-browser exactly (real Mona Sans)
bash scripts/export-png.sh assets/examples/<slug>/hero.svg /tmp/<slug>.png 1200 630

# 3. open /tmp/<slug>.png and look — margins, spacing, fonts, whitespace in code
# 4. edit hero.svg, then re-render. repeat until the SKILL.md checklist passes.

# 5. regenerate the committed meta PNG so it matches the SVG
bash scripts/export-png.sh assets/examples/<slug>/hero.svg assets/examples/<slug>/meta.png 1200 630
```

The PNG is rendered with **headless Chrome**, which honors the SVG's embedded `@font-face`, so the
`.png` is pixel-identical to the `.svg` opened in a browser. (rsvg/`rsvg-convert` ignores embedded
fonts and falls back to a generic sans — that was the old "PNG looks different from the SVG" bug.)
Set `SCALE=2` for a supersampled, extra-crisp render. Install `fonttools` + `brotli` for subset
embedding (~20–30 KB SVGs); without them the whole WOFF2 is embedded (larger, still self-contained).

Editing a committed `hero.svg` is safe: the embedded `@font-face` block stays intact while you
change visual elements. Two recurring gotchas (see SKILL.md for the full list):

- **Spaces vanish between `<tspan>`s** — add `xml:space="preserve"` to multi-`tspan` lines (code
  snippets especially), or `export default define...` runs together.
- **Diagram cards drift off the right edge** — keep ≥ 48px margin, give arrows real length, and end
  every flow in a labeled node.

## Output paths

| Context                       | Path                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------- |
| Live blog post (`prisma/web`) | discovered `imgs/` dir, e.g. `apps/blog/public/<slug>/imgs/hero.svg` + `meta.png` |
| Skill examples / samples      | `assets/examples/<slug>/hero.svg` + `meta.png`                                    |

## Samples

One worked hero/meta pair per house content module — the quality bar for new work.

| PR                | Blog post                                          | Module          | Image                                                                                 |
| ----------------- | -------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------- |
| `prisma/web#7962` | `building-open-chat`                               | data/log panel  | [meta.png](assets/examples/building-open-chat/meta.png)                               |
| `prisma/web#7957` | `create-prisma-deploy-prisma-compute`              | terminal        | [meta.png](assets/examples/create-prisma-deploy-prisma-compute/meta.png)              |
| `prisma/web#7957` | `prisma-compute-config-file`                       | code card       | [meta.png](assets/examples/prisma-compute-config-file/meta.png)                       |
| `prisma/web#7961` | `image-transformations-with-bun-on-prisma-compute` | pipeline/flow   | [meta.png](assets/examples/image-transformations-with-bun-on-prisma-compute/meta.png) |
| —                 | `prisma-next-benchmark`                            | comparison card | [meta.png](assets/examples/prisma-next-benchmark/meta.png)                            |

## Quality bar

Read `references/design-system.md` before designing. Mona Sans for display, Inter for body, Geist
Mono for code/data. No stock imagery, generic AI visuals, logo wallpaper, random gradients,
off-system colors, or on-canvas taglines. One cover, one idea.

Open items the team is still validating: the Eclipse cover direction on new product posts; Compute
and Prisma Next have no dedicated color tokens yet (they inherit platform teal); and the skill
depends on extracted Figma resources rather than a live source in every environment.
