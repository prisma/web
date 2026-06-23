# Brand fonts

Static instances of the Eclipse brand fonts, bundled so covers render on-brand without a
`prisma/web` checkout. `scripts/export-png.sh` points fontconfig here automatically, and
`scripts/embed-fonts.py` subsets these into committed SVGs.

| File                  | Family     | Weight | Role                                             | License                        |
| --------------------- | ---------- | ------ | ------------------------------------------------ | ------------------------------ |
| `MonaSans.woff2`      | Mona Sans  | 800    | Headings, display, product wordmark, big numbers | SIL OFL 1.1 (GitHub Mona Sans) |
| `Inter-Regular.woff2` | Inter      | 400    | Body, subtitles, UI/category labels              | SIL OFL 1.1                    |
| `GeistMono.woff2`     | Geist Mono | 500    | Data values, code, technical labels              | SIL OFL 1.1 (Vercel Geist)     |

`MonaSans.woff2` is a static instance (weight 800, extended width) cut from Mona Sans VF
(`prisma/web` → `packages/eclipse/src/static/fonts/MonaSansVF[wdth,wght,opsz,ital].woff2`).
To regenerate at a different weight/width, instance the VF with `fonttools` and rename the
family to `Mona Sans`. All three families are open-source (OFL) and safe to redistribute.
