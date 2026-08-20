# Gradient & light system

Gradients are encouraged — as **light, atmosphere, material, hierarchy, or data emphasis**.
The anti-pattern was never "gradient"; it is *generic gradient decoration with no purpose*.
Every treatment below is a plain-SVG recipe using `tokens.json` values only. Pick **one**
treatment per cover (a fade mask supporting it does not count as a second).

Ask before adding any gradient: *what is this light doing?* If the answer is "filling space",
delete it.

## The treatments

### 1. Spectral wash (house default)

Two–three soft radial pools of the prism colors dissolving into the paper along one edge.
Atmosphere behind the hero element; keep type on calm areas. This is the baseline from
`templates/` — reposition the pools per cover, don't ship the default placement unexamined.

```svg
<radialGradient id="wash-cyan" cx="0.30" cy="1.05" r="0.75">
  <stop offset="0%" stop-color="#01d7e4" stop-opacity="0.20"/>
  <stop offset="100%" stop-color="#01d7e4" stop-opacity="0"/>
</radialGradient>
<!-- + wash-yellow (#f3c306 @ .16), wash-red (#ff7682 @ .17); paint as full-canvas rects -->
```

### 2. Radial bloom

**One** soft light source placed *behind the hero element* — the module appears lit, not
decorated. Use when a single card/object/metric needs quiet emphasis. One bloom max.

```svg
<radialGradient id="bloom" cx="0.5" cy="0.5" r="0.55">
  <stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.22"/>
  <stop offset="100%" stop-color="{ACCENT}" stop-opacity="0"/>
</radialGradient>
<ellipse cx="{hero-x}" cy="{hero-y}" rx="420" ry="300" fill="url(#bloom)"/>
```

### 3. Product glow

The cover's accent fading softly out of one region of the surface — a directional tint rather
than a centered bloom. Good for grounding a composition in its product without a wash.

```svg
<linearGradient id="glow" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.18"/>
  <stop offset="60%" stop-color="{ACCENT}" stop-opacity="0"/>
</linearGradient>
```

### 4. Prism / spectrum gradient

Refracted light — the Prisma identity as physics. Two canonical forms, don't mix them up:

- **Spectrum** (the brand gradient, eclipse `--gradient-spectrum`, ~85°):
  cyan → yellow → orange → scarlet → pink. Use for refraction, spectral edges, gradient
  text (rare), a chart's hero line.
- **Prism stripe** (the logo's anatomy): three crisp 45° bands cyan / red / yellow
  (`#01d7e4`, `#f34a60`, `#f3c306`). Geometric motif, never blurred.

```svg
<linearGradient id="spectrum" x1="0" y1="0.05" x2="1" y2="-0.05">
  <stop offset="0%"   stop-color="#01d7e4"/>
  <stop offset="30%"  stop-color="#f3c306"/>
  <stop offset="55%"  stop-color="#f37a03"/>
  <stop offset="78%"  stop-color="#f43531"/>
  <stop offset="100%" stop-color="#f00e5c"/>
</linearGradient>
```

Use on a beam, an edge, a chart line, or a dimensional object's face — crisp direction,
never a blurred rainbow field.

### 5. Spectral edge

A narrow iridescent edge (2–4px) on one meaningful boundary: a card top, a divider, a prism
face, a highlighted table row, the stroke of a chart's hero series. The smallest way to make
one element "the" element.

```svg
<rect x="{card-x}" y="{card-y}" width="{card-w}" height="3" rx="1.5" fill="url(#spectrum)"/>
```

### 6. Gradient beam

A stroke that carries light along a path — for movement: requests, connections, data flow,
propagation. One beam, on the flow's *hero* edge; sibling connectors stay hairline neutral.

```svg
<linearGradient id="beam" gradientUnits="userSpaceOnUse" x1="{start-x}" y1="0" x2="{end-x}" y2="0">
  <stop offset="0%"  stop-color="{ACCENT}" stop-opacity="0"/>
  <stop offset="45%" stop-color="{ACCENT}"/>
  <stop offset="100%" stop-color="{ACCENT}" stop-opacity="0.15"/>
</linearGradient>
<path d="M …" stroke="url(#beam)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
```

`gradientUnits="userSpaceOnUse"` is mandatory on beams: an objectBoundingBox gradient
degenerates to invisible on a purely horizontal or vertical line.

### 7. Mesh field

Large, low-contrast overlapping color fields for ambient depth behind one hero visual —
an evolved wash for conceptual/announcement covers. 2–3 offset radials in *one* accent's
ramp plus at most one neighbor prism at lower opacity. Low contrast: nothing above ~0.24.

### 8. Aurora band

One soft flowing band (a wide blurred path, not the whole sky). Sparingly, for genuinely
atmospheric conceptual covers. Draw a curved path, `stroke-width` 120–200, accent at
0.14–0.2 opacity, `feGaussianBlur stdDeviation="40–60"`. Never neon, never more than one.

### Fade mask (supporting, always allowed)

Dissolve any treatment into the paper so effects end on purpose, not at a hard edge:

```svg
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="60%" stop-color="#ffffff"/>
  <stop offset="100%" stop-color="#000000"/>
</linearGradient>
<mask id="fadeMask"><rect width="1200" height="630" fill="url(#fade)"/></mask>
<!-- apply mask="url(#fadeMask)" to the effect group -->
```

## Dark-cover variants

Same recipes on ink `#151515`; raise stop opacities ~1.3× so the light reads, and prefer the
400-level accent values (they carry on dark).

## Anti-patterns (auto-fail)

- Giant blue-purple startup gradients, or any hue outside the prism ramps.
- Rainbow backgrounds with no refraction concept behind them.
- Glow on every object; multiple neon blobs; more than one bloom.
- Gradient text as a default (reserve for at most one word, rarely).
- Multiple border beams / spectral edges competing.
- A gradient nobody can name the purpose of ("it looked empty").

## Render notes

- Large soft gradients + grain inflate PNG size; if `meta.png` overshoots ~700 KB, drop a
  redundant wash layer or lower grain opacity before re-exporting.
- `feGaussianBlur` over big areas is fine in Chrome export but check the raster for banding;
  add the grain layer *above* washes to break banding up.
- Reference libraries (Magic UI border-beam/shine, Aceternity aurora/spotlight, React Bits
  fields) are *idea* sources — reproduce the effect with these SVG recipes; never import
  their default neon-on-black identity, and never add runtime dependencies for a static cover.
