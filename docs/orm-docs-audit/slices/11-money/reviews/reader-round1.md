# Reader round 1 (2026-10-28, Opus, two cold readers: a Prisma ORM 7 user and a developer new to Prisma)

## Marks

- "contract", "PSL", "the TypeScript builder", `db`, and `contract emit` used without saying what they are or where `db` comes from; how the model becomes a table.
- "scale" used before it is defined.
- The `String(value)` advice ("never came from arithmetic") is unclear; "any string type-checks" reads like a feature, not a warning.
- `avg` versus `avgDecimal` on a decimal column: the example contradicts the sentence after it.
- The default sentence packs four unknowns.
- Missing: multiplying (line totals, tax) and where to round; filtering a total; what `sum` returns for `Int` cents; `BigInt`'s JavaScript type; catching the overflow error; filtering and sorting on a string-typed amount; displaying cents; several currencies; the Decimal.js code that replaces `.plus()` and `.toFixed()`; whether moving `@db.Decimal(10, 2)` to `Numeric(10, 2)` changes the database; the MongoDB field type name.
- The example model stores the amount three ways without saying a real model uses one.

## What changed

All of the above. Facts checked by running them in `wip/slice-11/m`: `where(...).aggregate(...)` filters a total, and `sum("totalCents")` is a `number`; `o.total.gt("10.00")` excludes `9.50`, and sorting gives 9.50, 10.00, 100.00, so decimals compare as numbers; Decimal.js 10.6 `new Decimal(5997).mul("0.0725").toDecimalPlaces(0, ROUND_HALF_UP)` is 435 from 434.7825; `error.sqlState === "22003"` matches the overflow; the page's code type-checks under `strict` with the `orm init` tsconfig except `Intl.NumberFormat.format(string)`, which needs ES2023's types and a `` `${number}` `` cast, so the page formats `Number(order.total)` and explains the string form.
