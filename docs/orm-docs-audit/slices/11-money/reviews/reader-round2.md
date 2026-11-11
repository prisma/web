# Reader round 2 (2026-10-28, Opus, Prisma ORM 7 reader persona)

## Marks

- "contract" still defined only in passing; "a migration creates the columns" names no command.
- "three ways ... not both".
- Which type to pick for ordinary prices not stated as a recommendation.
- `String(value)` for "what a user typed" is odd, since that is already a string.
- "rounds a value exactly halfway away from zero" misreads.
- The ES2023 and `` `${number}` `` sentence: three conditions, and detail almost no price needs.
- The `avgDecimal` sentence carries too much; why `879.4` is a problem.
- The Prisma ORM 7 section does not say to install `decimal.js`; whether moving to `Numeric(10, 2)` needs a migration.
- Missing: sort syntax, an optional decimal field, an empty sum, formatting `BigInt` cents.

## What changed

All of the above. Checked by running them: `sum`, `sum` over `Int`, and `avgDecimal` all return `null` when no rows match; `where(...).orderBy((o) => o.total.asc()).all()` and `usd.format(Number(cents) / 100)` with `cents: bigint` type-check under `strict`. The ES2023 sentence was removed.
