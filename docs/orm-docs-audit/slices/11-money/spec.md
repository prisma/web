# Slice: Money and decimal values

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C8 of `changes.md`. Written 2026-10-28 by `seacole-52`.)_

## At a glance

How to store and compute money in Prisma ORM 8 is spread over five pages, and no page says that a decimal string avoids JavaScript's floating-point loss while the column's declared scale still rounds. After this slice, `orm/data-modeling/money.mdx` answers it in one place: which type to pick, what your code reads and writes, how rounding and overflow behave, defaults, doing arithmetic, and the Prisma ORM 7 differences.

## The facts, each checked on 2026-10-28

Run in `wip/slice-11/m` (`@prisma/orm-postgres` 8.0.0-rc.21, `prisma` 8.0.0-rc.27, PostgreSQL 15) with `totalCents Int`, `total Numeric(10, 2)`, `fee Numeric(10, 2) @default(1.50)`, `rate Decimal`:

| What | Result |
| --- | --- |
| Column types | `integer`, `numeric(10,2)`, `numeric(10,2)` with default `1.50`, `numeric` |
| Read type | `Int` is a `number`; `Numeric(10, 2)` is `Numeric<10, 2>`, a string type; `Decimal` a string |
| Write `"19.99"` | stored `19.99` |
| Write the number `19.99` | stored `19.99` at runtime, but TypeScript refuses a number for a decimal field (TS2769); a literal, a `string` variable, and a value read back all type-check |
| Write `"1.005"` and `"2.675"` | `Numeric(10, 2)` stores `1.01` and `2.68` (PostgreSQL rounds half away from zero); `Decimal` stores them unchanged |
| Write `0.1 + 0.2` | `Numeric(10, 2)` stores `0.30`; `Decimal` stores `0.30000000000000004` |
| Write `"123456789.00"` to `Numeric(10, 2)` | `SqlQueryError`, message `numeric field overflow`, `sqlState` `22003` |
| Write `"abc"` | `invalid input syntax for type numeric: "abc"` |
| Aggregates | `sum("total")` `"43.97"` (string), `avg("total")` `"8.7940000000000000"` (string), `avgDecimal("total")` the same, `sum("totalCents")` `4397`, `avg("totalCents")` `879.4` (number), `avgDecimal("totalCents")` `"879.4000000000000000"` |
| TypeScript builder | `field.column(type.Numeric(10, 2))`, `.default("1.50")`; rc.21 removed `field.decimal()` and the other field presets |
| Prisma ORM 7 | `Prisma.Decimal` was Decimal.js (`orm/v7/prisma-client/special-fields-and-types`); `Decimal @db.Decimal(10, 2)` is `Numeric(10, 2)` (`coming-from-prisma-orm-7.mdx:53`) |
| MongoDB | `Decimal128` reads as a string (`orm/data-modeling/mongodb.mdx:52`) |

## Chosen design

- New page `orm/data-modeling/money.mdx` at `/orm/data-modeling/money`, after the overview in the Data modeling sidebar. Sections: pick a type (cents by default; `Numeric(p, s)` when amounts arrive with decimals or several currencies share a column; `Decimal` for rates); what your code reads and writes; rounding and overflow; defaults in PSL and the builder; arithmetic (integers, a decimal library, or `sum` and `avgDecimal` in the database); coming from Prisma ORM 7; MongoDB last, separate.
- `orm/data-modeling/index.mdx` links it from the money paragraph.
- Follow-up done here: `orm/data-modeling/index.mdx` and `orm/reference/raw-queries.mdx` say `Temporal` is in Node.js 26.8.2 and later; it is in 26.0 (checked for #8572).
- Not here: the builder pages' field presets, which #8583 rewrites for rc.21.

## Checks before the PR

The three scripts, cspell, `lint:links`, `lint:versions`; two cold reader rounds; a fact re-check.
