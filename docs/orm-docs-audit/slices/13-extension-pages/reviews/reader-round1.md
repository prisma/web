# Reader round 1 (2026-10-28, Opus, Prisma ORM 7 reader persona, all three pages)

## Marks

- All pages: registration snippets were fragments relying on the pgvector page; `/control`, `/runtime`, and `/pack` never explained in one plain sentence; emit, plan, and apply and `--advance-ref db` unexplained; the project setup (contract, `db.ts`) assumed.
- PostGIS: SRID undefined; whether a value's SRID must match the column; whether `polygon()` closes a ring; a `Point4326` type that holds any shape; no index; the SQL builder table name.
- ParadeDB: BM25 and "experimental" undefined; the TypeScript-contract requirement stated in passing, with no path for an existing `contract.prisma`; the contract path note after the code; how to search two columns; `paradeDbMatch` versus `paradeDbMatchAny`; where `pg_search` runs in production; whether `paradeDbScore` works without a match.
- arktype-json: three things named `arktypeJson`; "key the pack" jargon; whether a failed `create()` leaves the bad row; what happens to an existing `Json` column and its rows; whether one bad row fails a list read.

## What changed

All of the above. Checked by running them: `@@index([location], type: "gist")` emits `CREATE INDEX ... USING gist (location)`; `point(1, 2)` stores SRID 4326, and SRID 3857 is refused with `Geometry SRID (3857) does not match column SRID (4326)`; `polygon()` with four corners returns five, closing the ring; `or(a.title.paradeDbMatch(q), a.body.paradeDbMatch(q))` finds rows by either column; `paradeDbScore` without a ParadeDB filter fails with SQLSTATE 0A000; a list read with one bad arktype-json row fails whole; the bad row from a failed `create()` stays in the table; switching a `jsonb` column between plain `Jsonb` and `arktypeJson` makes `migration plan` stop with `MIGRATION.PLANNING_FAILED` and point to `migration new --from <hash>`.
