# Reader round 2 (2026-10-28, Opus, Prisma ORM 7 reader persona, all three pages)

## Marks

- All pages: "extension" not distinguished from Prisma ORM 7's `$extends`; whether the full config and client listings replace or merge into existing files.
- PostGIS: whether the "within 5 km" filter uses the `gist` index; whether a TypeScript contract needs `/pack`; the other comparison names; a four-idea sentence on the SQL builder; when an SRID mismatch is refused.
- ParadeDB: "its BM25 index" ambiguous; "experimental" for production; the rewrite to a TypeScript contract hidden in a clause and `db.ts` "stays the same" contradicting the setup; `table: 'article'` inviting a rename of an existing `Article` table; what happens to `paradeDbScore` without a filter.
- arktype-json: the migration steps in one sentence; "a value that TypeScript did not check"; `ArticleMeta` not exported or imported in the validation snippet; whether changing the arktype type later needs a migration; how to repair a row that fails to read.

## What changed

All of the above. Checked by running them: `EXPLAIN` shows a `distanceSphere` filter scans every row while `dwithin` uses the `gist` index, so the page pairs `and(dwithin(here, 0.1), distanceSphere(here).lt(5000))`, which returns the same rows through the index; changing the arktype type makes `migration plan` stop with `MIGRATION.PLANNING_FAILED` again; the SQL builder also validates on read; `update()` repairs a bad row; `SELECT id FROM article WHERE jsonb_typeof(meta->'tags') <> 'array'` finds one; without `table:` the ParadeDB table is `Article`; `paradeDbScore` without a ParadeDB filter fails with `pdb.score must be evaluated by a ParadeDB scan`.
