# Fact re-check (2026-10-28, Opus)

Run in `wip/slice-13/geo` and `wip/slice-13/search` against PostGIS 3.5 / PostgreSQL 17 and `pg_search` 0.26.3 / PostgreSQL 18, plus the packages' declarations, the ParadeDB docs, and the linked pages.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| "A shape without an SRID takes the column's" | a query value without an SRID has SRID 0; `distance`, `dwithin`, `within`, `contains`, `intersects` then fail with `Operation on mixed SRID geometries` (`distanceSphere`, `intersectsBbox` do not) | written shapes take the column's SRID; query shapes must pass it |
| Query samples without an SRID | same | `point(..., 4326)`, `polygon(..., 4326)` |
| `paradeDbTerm` ignores case | `paradeDbTerm('Prisma')` matched nothing, `'prisma'` matched | "compared as written, so give it in lowercase" |
| `key_field` must be unique and listed first | `pg_search` 0.26 docs: `key_field` is deprecated and ignored; an index without it was created and scored | "The package requires it, although `pg_search` 0.26 and newer ignore it" |

## Confirmed

Every sample, run and type-checked: the PostGIS read shape, the 3857 refusal, lines and `bboxPolygon`, ring closing, the filters and the SQL builder distances, the column and index definitions, the operation-to-function mapping; ParadeDB's match, match-all, phrase, case-insensitive match, two-column `or`, score ranking, `migrations/paradedb/`; arktype-json's create, null reads, pre-write check, bad-row read error and message, bad `create()` leaving the row, the emitted type, the `Jsonb` switch and `migration new --from`; the directory's `@onCreate(uuid())`; all links.

## Q, left as written

- The example scores (1.478, 0.43) depend on every row in the table; illustrative.
- "BM25, the ranking most search engines use" and "most managed providers include PostGIS": general claims.
