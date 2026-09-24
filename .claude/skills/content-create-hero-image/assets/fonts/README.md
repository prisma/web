# Brand fonts

The 2026-brand faces, bundled so covers render on-brand without a `prisma/web` checkout.
`scripts/export-png.sh` points fontconfig here automatically, and `scripts/embed-fonts.py`
subsets these into committed SVGs.

## Current brand (use these)

| File                    | Family         | Weights used | Role                                        | License     |
| ----------------------- | -------------- | ------------ | ------------------------------------------- | ----------- |
| `Sora-VF.woff2`         | Sora           | 500, 600     | Headlines, big numbers, `Prisma` wordmark   | SIL OFL 1.1 |
| `Inter-VF.woff2`        | Inter          | 400, 600     | Body, subtitles, kicker labels              | SIL OFL 1.1 |
| `MonaSansMono-VF.woff2` | Mona Sans Mono | 500          | Code, data values, paths                    | SIL OFL 1.1 |

All three are variable fonts copied from `prisma/web` →
`packages/eclipse/src/static/fonts/` (`SoraVF-latin.woff2`, `InterVariable.woff2`,
`MonaSansMonoVF[wght].woff2`). One `@font-face` with a weight range serves every weight.

## Legacy (pre-rebrand — keep only to re-render old covers)

`MonaSans.woff2` (Mona Sans 800 display), `Inter-Regular.woff2` (static Inter 400), and
`GeistMono.woff2` are the retired Eclipse-era faces. Do not use them on new covers.

All families are open-source (OFL) and safe to redistribute.
