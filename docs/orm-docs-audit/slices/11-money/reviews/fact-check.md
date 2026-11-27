# Fact re-check (2026-10-28, Opus)

Run in `wip/slice-11/m` on `@prisma/orm-postgres` 8.0.0-rc.21 and PostgreSQL 15, plus the PostgreSQL manual, Decimal.js 10.6, MDN, the Bun 1.4 and Deno 2.7 release notes, and the linked docs pages.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| `avgDecimal` returns the exact average | `avg` of 1, 1, 2 is `1.3333333333333333`; PostgreSQL rounds `avg` to about 16 significant digits | "the average as a string, which PostgreSQL rounds to at least 16 significant digits, far more than money needs" |
| `.mul(order.taxRate) // "434.7825"` | `.mul()` returns a Decimal.js object | `// 434.7825` |

## Confirmed

The read and write types; the rounding table, including `-1.005` to `-1.01`; the overflow error (`SqlQueryError`, `numeric field overflow`, `sqlState` `22003`) and the page's `catch`; `"abc"`; numeric filtering and sorting; `sum`, `sumBigInt`, `avg`, `avgDecimal` result types and `null` on no rows; the `Intl.NumberFormat` outputs, including `bigint` cents; Decimal.js 5997 × 0.0725 = 434.7825, rounded to 435; `@default(1.50)` and the `PSL_INVALID_DEFAULT_LITERAL` refusal of `1.505`; every code sample type-checks under `strict` with TypeScript 5.9; the commands; `Float` as `float8` and `BigInt` as `bigint`; the 21-million-dollar and 99,999,999.99 limits; Prisma ORM 7's `Prisma.Decimal` as Decimal.js and `@db.Decimal(10, 2)` as `Numeric(10, 2)`; MongoDB's `Decimal128`, `Int32`, `Int64`; `Temporal` in Node.js 26.0.0, 26.8.1 and 26.8.2 from mise, absent in Homebrew's 26.8.1 and in Node.js 24, Bun 1.4 and Deno 2.7 per their release notes; every link and anchor.

## Q, left as written

- The values in the `aggregate` comments are illustrative; their formats are confirmed.
- An optional `Numeric?` field reading as `null` was not run; it is the general rule for optional fields.
