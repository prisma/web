# SOCIALS.fig — source reference

`SOCIALS.fig` is Prisma's master Figma file for blog, social, and banner cover art.
It is the design source the hand-made blog hero/meta images are cut from, and the
reference this skill matches.

## Why it is not committed

The file is ~98 MB (mostly embedded raster photography). This repo has no Git LFS and
its largest tracked asset is < 1 MB, so committing the binary would bloat every clone
permanently. Instead, the **lightweight, relevant content** is extracted into this skill
(tokens, fonts, formats, logos, board thumbnail) and the binary is parked at
`spaces/SOCIALS.fig` (gitignored) for local re-extraction.

If `spaces/SOCIALS.fig` is missing, ask the operator for the latest export from the
Prisma Figma workspace before re-extracting.

## What the file contains

- Sections: `BLOG`, `BLOG_LANDING`, `BANNERS`, `COVER`, plus per-post cover frames
  (e.g. `blog-6.19`, `blog-614-article`, `blog_PrismaNextTS_01`, `blog-2025-year`).
- Eclipse color variables: `Color/Brand/100–900`, `Brand/brand-primary`, and the
  `background/foreground/stroke` `-ppg` semantic tokens (teal Prisma Postgres scale).
- Fonts seen in older frames: Barlow (display), Inter, JetBrains/Geist/Roboto Mono.
  **Note:** the current Eclipse brand display font is **Mona Sans** (see
  [`design-system.md`](./design-system.md) → Typography) — covers use Mona Sans, not Barlow.
  Body is Inter; data/code is Geist Mono.
- `assets/figma/board-thumbnail.png` — a small overview render of the whole board.
- `assets/figma/board-meta.json` — the file's export metadata.

## How the extraction was done (re-extraction recipe)

A local `.fig` is a ZIP container. The vector canvas is a kiwi message whose data block
is **Zstandard**-compressed (Figma format version ≥ 106).

```bash
unzip -o spaces/SOCIALS.fig -d /tmp/fig          # -> canvas.fig, thumbnail.png, meta.json, images/
# canvas.fig = 8-byte 'fig-kiwi' header + uint32 version + [uint32 len + block] x N
# block 0 = kiwi schema (raw deflate); block 1 = data (zstd)
python3 - <<'PY'
import struct
d=open('/tmp/fig/canvas.fig','rb').read(); pos=12
n0=struct.unpack('<I',d[pos:pos+4])[0]; pos+=4+n0
n1=struct.unpack('<I',d[pos:pos+4])[0]; pos+=4
open('/tmp/fig/data.zst','wb').write(d[pos:pos+n1])
PY
zstd -d /tmp/fig/data.zst -o /tmp/fig/data.bin
strings -n 3 /tmp/fig/data.bin | grep -iE 'blog|cover|prisma|barlow|inter'   # layer/text/font names
```

Color **values** are stored as RGBA floats in the kiwi data and are not safely
greppable; take hex values from the Eclipse source instead (see
[`design-system.md`](./design-system.md) → Sources). The fig is authoritative for
_structure, fonts, and cover formats_; Eclipse source is authoritative for _exact hex_.

## Live Figma (optional)

When a Figma MCP is connected, the same specs/assets can be pulled live from the Prisma
team workspace — see [`figma-mcp.md`](./figma-mcp.md) for the read-only token/asset refresh
recipe. The local extraction above is the offline-safe default and needs no auth.
