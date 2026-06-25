# Refreshing from the live Figma workspace (optional)

When a **Figma MCP is connected**, pull current specs and assets straight from the Prisma
team workspace instead of relying on the checked-in extraction. This keeps `tokens.json`
and `assets/logos/` in sync as the brand evolves. When no Figma MCP is connected, skip
this entirely — the committed assets and `prisma/web` source are the offline-safe default.

## How the Figma MCP is exposed here

The Figma Plugin API runs through the **`use_figma`** tool, which is gated behind the
`figma-use` skill. Before any `use_figma` call: load `figma-use`, and pass `figma-use` in
its `skillNames` parameter. Work read-only and in small steps. Scripts use plain JS with
top-level `await` and `return` (the return value is the only output channel).

The snippets below use the `use_figma` query helpers — `node.query(selector)` (CSS-like
selectors), `.values([...])`, and `.first()` — documented in the `figma-use` skill. These
are `use_figma` conveniences layered on the Plugin API, not raw `figma.*` calls; the raw
equivalents are `findAll`/`findOne` with a predicate.

Point it at the **SOCIALS** file (or the current covers file) — ask the operator for the
Figma URL, or operate on the file they have open. A design file URL looks like
`figma.com/design/...`.

## 1. Refresh design tokens from Figma variables

Read the Eclipse color variables live and reconcile against `assets/tokens.json`. Only
overwrite values that genuinely changed; keep the file's structure and comments.

```js
// use_figma (read-only) — list collections, then dump brand/ppg/orm color variables
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const toHex = (c) => '#' + ['r','g','b'].map(k => Math.round(c[k]*255).toString(16).padStart(2,'0')).join('');
const out = [];
for (const col of cols) {
  for (const id of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v.resolvedType !== 'COLOR') continue;
    if (!/brand|ppg|orm|background|foreground|stroke/i.test(v.name)) continue;
    const modeId = col.modes[0].modeId;
    let val = v.valuesByMode[modeId];
    // resolve one level of alias if present
    if (val && val.type === 'VARIABLE_ALIAS') {
      const a = await figma.variables.getVariableByIdAsync(val.id);
      val = a.valuesByMode[Object.keys(a.valuesByMode)[0]];
    }
    if (val && typeof val === 'object' && 'r' in val) out.push({ name: v.name, hex: toHex(val) });
  }
}
return out;
```

Compare the returned `{name, hex}` list to `tokens.json` and update changed hex values.
Figma colors are 0–1; convert to hex as above.

## 2. Use the live cover frames as composition reference

Find the current blog/social cover frames to confirm dimensions and layout before designing.

```js
// use_figma (read-only) — current page; fan out per page if needed (one setCurrentPageAsync per call)
return figma.currentPage
  .query('FRAME[name^=blog], FRAME[name*=COVER], FRAME[name*=SOCIAL]')
  .values(['name', 'width', 'height']);
```

Take a `get_screenshot` (or `await node.screenshot()`) of a representative frame for a
visual reference. Match the live layout; do not copy a one-off frame's content.

## 3. Export logo / mark nodes as SVG

Refresh `assets/logos/` from the source nodes. Export as **`SVG_STRING`** (returns markup
you can save directly); avoid binary `PNG`/`SVG` byte arrays in the return channel.

```js
// use_figma (read-only) — export a named node's vector as an SVG string
const node = figma.currentPage.query('[name=Prisma Logo], [name*=wordmark]').first();
if (!node) return { error: 'node not found' };
return { name: node.name, svg: await node.exportAsync({ format: 'SVG_STRING' }) };
```

Save the returned `svg` string to the matching file under `assets/logos/`, then regenerate
its PNG (if needed) with `scripts/export-png.sh`. Keep the white/dark variants in sync by
recoloring the `fill`.

## Guardrails

- **Read-only by default.** This skill consumes the workspace; it does not edit it. Never
  run write scripts against the shared Prisma file.
- **Reconcile, don't clobber.** Treat `tokens.json` as the source of truth and apply only
  real diffs, preserving its `$comment` notes.
- **Stay offline-safe.** Everything here is optional. If `use_figma` is unavailable or the
  operator has no file URL, fall back to the committed assets and the `prisma/web` source
  (see [`design-system.md`](./design-system.md) and [`figma-source.md`](./figma-source.md)).
