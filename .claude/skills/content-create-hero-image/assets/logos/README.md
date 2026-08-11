# Logo assets

Official, reusable brand marks for covers. Prefer these over re-extracting each time.

## Sources

- **Prisma logo + symbol** — official press kit [`prisma/presskit`](https://github.com/prisma/presskit).
- **Prisma 8 mark** — the layered-prism brand mark, vectorized to white/dark.
- **Prisma Postgres icon** — FontAwesome [`chart-pyramid`](https://fontawesome.com/icons/chart-pyramid) (solid).
- **Prisma Compute icon** — FontAwesome [`microchip`](https://fontawesome.com/icons/microchip) (solid).

## Inventory

| File                         | What                                          | Use                            |
| ---------------------------- | --------------------------------------------- | ------------------------------ |
| `prisma-logo-white.svg`      | Official Prisma logo (mark + wordmark), white | Brand sign-off on dark covers  |
| `prisma-logo-dark.svg`       | Official Prisma logo, dark                    | Brand sign-off on light covers |
| `prisma-logo-indigo.svg`     | Official Prisma logo, brand indigo            | Indigo-on-light contexts       |
| `prisma-symbol-white.svg`    | Prisma prism symbol, white                    | Brand mark, dark covers        |
| `prisma-symbol-indigo.svg`   | Prisma prism symbol, indigo                   | Brand mark, light contexts     |
| `prisma-8-mark-white.svg`    | Prisma 8 layered-prism mark, white            | Prisma 8 mark on dark          |
| `prisma-8-mark-dark.svg`     | Prisma 8 mark, dark                           | Prisma 8 mark on light         |
| `prisma-8-logo.svg`          | Prisma 8 mark + "Prisma 8" (Mona Sans)        | Prisma 8 lockup                |
| `prisma-postgres-icon.svg`   | Chart-pyramid, teal `#71e8df`                 | Prisma Postgres covers         |
| `prisma-compute-icon.svg`    | Microchip, teal `#71e8df`                     | Prisma Compute covers          |

## Rules

- **Intentional, not decorative.** One brand mark per cover. Product icons/lockups are for
  product-focused covers where the product is the subject.
- Use the official `prisma-logo-*` / `prisma-symbol-*` and the Prisma 8 mark as-is — do not
  recolor (beyond the white/dark variants), stretch, rotate, or add effects.
- Product accents: Postgres = teal `#71e8df`, Compute = teal, Prisma 8 pairs the white mark with
  a Mona Sans wordmark, ORM = indigo `#4f46e5`.
- The lockup uses live Mona Sans text; render/commit it with the brand fonts embedded
  (`scripts/embed-fonts.py`) so it stays correct standalone.
