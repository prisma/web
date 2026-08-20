# Content component library

The article determines the visual, and one component carries it. This catalog defines the
component families, when each earns the cover, and the routing heuristic. Skins come from
`tokens.json` and `design-system.md`; gradients from `gradient-system.md`; family starting
files in `../assets/templates/`.

## What world-class covers do (calibration)

Studied against the strongest developer-brand OG art (Anthropic, OpenAI, Neon, Vercel;
Supabase as the cautionary mixed bag):

- The best covers carry **one or two elements**, not four. Anthropic ships a single
  illustrated symbol on a flat color field, no text. OpenAI ships an atmospheric gradient
  with one tiny card. Neon ships one big playful object (a giant "18", a flock of sheep for
  autoscaling) and nothing else. Vercel pairs a short sentence-case thesis with one precise
  geometric object drawn from the article's literal concept.
- The object is **bespoke to the article's idea** (a cube inside a dashed boundary for "a
  sandbox needs a network boundary"), never a generic category icon.
- Nobody screenshots product UI; the weakest covers in the study were the ones that did.
- Dark is the crowd (Vercel, Supabase). **Prisma's light paper is the differentiator — own it.**

So: the default Prisma stack (kicker + headline + module + lockup) is the *ceiling*, not the
formula. Dropping elements is how covers get stronger.

## Composition disciplines (every family)

- **One idea, one hero, one highlight, plenty of space.** One dominant component; the viewer
  finds the point in under a second. No competing highlights.
- A normal cover: 1 hero component · 0–1 supporting element · 1 gradient/light treatment ·
  0–1 kicker · 0–1 short headline · 0–1 brand mark. Never a mini dashboard.
- Components are **editorial graphics, not analytics software**: oversized type, few rows,
  no chrome, no legends that a highlight can replace.
- Everything visible must be true to the article. No fake data, no invented numbers, no
  placeholder code presented as real.

## The families

### HeroChart — measurable results

Benchmarks, latency, throughput, usage, comparisons over time. Rules: real article data;
1–2 series; minimal grid (0–2 hairlines); no legend (label the lines directly); simplified
axes; **one emphasized data point or series** — accent stroke or spectral edge, siblings in
`#a5a5a6`/`#e5e5e4`; restrained gradient fill under the hero series only (accent → 0
opacity). The chart should feel like a magazine graphic. Template: `chart.svg`.

### MetricComponent — one strong number

When the article has one trustworthy numerical result. A giant Sora 600 value (140–220px)
with a short Inter label; optionally a quiet before-value struck beside it. No KPI-card
grid, no gauge. The number IS the composition. Template: `editorial.svg` (numeral variant).

### ComparisonTable — X vs Y

Product comparisons, before/after, feature differences, migration deltas. 2–4 columns ×
3–5 rows, large readable type (≥20px cells), highlight exactly one row/column/cell (accent
tint fill or spectral edge). Simplify aggressively; never reproduce a production table.
Template: `table.svg`.

### CodeWindow — code is the story

Schema, config, API shapes, migration commands, queries. ~4–8 lines of **real article
code**, readable at thumbnail scale (≥19px mono); ink card, filename tab optional, no fake
editor chrome; **one highlighted line or token** (accent text or a tinted line-bar), 2–3
syntax tints max from the prism ramps. Treat code as typography. Template: `code.svg`.

### QueryPanel — observability & query cost

Query Insights, database performance, reads, latency. Show only what makes the point: a
query fragment + 1–2 metrics, with **one number dominating** (e.g. `SELECT …` · `42 ms` ·
`12.4k reads`). An abstracted row, not a dashboard recreation. Template: `chart.svg` or
`code.svg` (panel variant).

### ArchitectureFlow — systems & movement

Connection pooling, request flow, branching, caching, deployment, pipelines. 3–5 nodes,
one clear relationship, labels grounded in the article, large legible geometry, simple
connectors, **one gradient beam** on the hero edge when movement is the point. Flows stay
flat (no isometric skew). Avoid dense diagrams. Template: `flow.svg`.

### DatabaseObject — the database as an object

Prisma Postgres, storage, branching, data architecture. A dimensional but abstract volume:
layered elliptical planes, a stacked-plane cylinder, split/branching volumes — geometric
SVG with light (radial bloom behind, spectral edge on one rim), not blue clip art and not
a literal cylinder icon. Can carry a no-copy cover alone. Template: `object.svg`.

### PrismObject — the brand as material

Announcements, identity moments, conceptual posts. A translucent wedge/refracting plane/
prism edge that **splits light into the three prism colors** — the logo's anatomy as
physics. Use where refraction genuinely maps to the idea (one input → many outputs, one
schema → many clients); never mechanically added. Template: `object.svg` (prism variant).

### GradientField — atmosphere-led

Launches and abstract topics where mood is the message. A mesh/aurora/bloom field
(`gradient-system.md`) covering the canvas with **one small sharp element** holding focus —
a short headline, a tiny card, the lockup. The OpenAI lesson: this only works when the
canvas is otherwise nearly empty. Template: `abstract.svg`.

### TypeMark — typography or a numeral as the hero

Version releases, one-word concepts, editorial essays. A giant Sora glyph/numeral/word
(180–320px) with one treatment: prism-gradient fill on a single character, a spectral edge
underline, or an ink word with one accent word. Nothing else but the kicker + lockup.
Template: `editorial.svg`.

## Routing heuristic (starting point, not a lookup table)

| Article signal | First candidates |
| --- | --- |
| benchmark / perf numbers | HeroChart · MetricComponent |
| comparison ("vs", pricing) | ComparisonTable |
| tutorial / how-to | CodeWindow · ArchitectureFlow |
| schema / modeling | CodeWindow · relationship diagram |
| architecture / infra | ArchitectureFlow · DatabaseObject |
| Prisma Postgres | DatabaseObject · HeroChart |
| ORM | CodeWindow · TypeMark |
| Compute / deploy | ArchitectureFlow · DatabaseObject |
| observability | QueryPanel · HeroChart |
| release / announcement | TypeMark · PrismObject · GradientField |
| conceptual / essay | TypeMark · GradientField · abstract geometry |
| customer story | MetricComponent · the story's concrete mechanism |

**The article's actual message always outranks the table.** If the strongest idea in a
tutorial is a 10× number, route to MetricComponent.

## Distribution (batch work)

When producing covers across many posts, keep the archive varied: no family should
dominate, and adjacent posts (same tag, same series) should not share a family + layout.
Track family counts across the batch; if `headline-left + card-right` starts repeating,
convert candidates to no-copy object-led, TypeMark, or atmosphere-led covers.
