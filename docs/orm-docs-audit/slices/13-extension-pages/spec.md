# Slice: Extension pages for PostGIS, ParadeDB, and arktype-json

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C19 of `changes.md`. Written 2026-10-28 by `seacole-52`.)_

## At a glance

Each of the three extensions is one catalog row. The directory pages they link show one snippet and send readers to package READMEs of about 25 lines. After this slice, `orm/extensions/postgis.mdx`, `paradedb.mdx`, and `arktype-json.mdx` take a reader from install to a working query.

## The facts, each checked on 2026-10-28 by running them

All on `@prisma/orm-postgres` and the extensions at 8.0.0-rc.21, `prisma` 8.0.0-rc.27; PostGIS 3.5.2 on PostgreSQL 17 (`postgis/postgis:17-3.5`), ParadeDB `pg_search` 0.26.3 on PostgreSQL 18 (`paradedb/paradedb`). Scratch projects in `wip/slice-13/geo` and `wip/slice-13/search`.

| What | Result |
| --- | --- |
| Registration | `/control` in `prisma.config.ts`, `/runtime` in `db.ts`, `/pack` in `defineContract({ extensions: { <pack id>: pack } })`; pack ids `postgis`, `paradedb`, `arktype-json`; another key fails with `RUNTIME.MISSING_EXTENSION_PACK`; `/pack` in the config is refused (`extensions[0].create must be a function`) |
| PostGIS column | `postgis.Geometry(4326)` in a `types` block; `geometry(Geometry,4326)` in PostgreSQL; `type.postgis.Geometry(4326)` in the builder; migration under `migrations/postgis/` |
| PostGIS values | `point(lng, lat, srid)`, `polygon(ring, srid)`, `bboxPolygon(...)` from `/geojson`; reads `{ type: "Point", coordinates, srid }` |
| PostGIS queries | `dwithin(here, 0.05)` and `within(polygon)` filter on the ORM; `distanceSphere(here).lt(5000)` filters by meters; `fns.distanceSphere(f.location, here)` selects and orders in the SQL builder (0, 2481.397, 879087.67 m); no `using` methods |
| ParadeDB index | PSL `@@index(..., type: "bm25", options: { key_field: "id" })` fails with `CONTRACT.VALIDATION_FAILED ... unregistered index type "bm25"`; the TypeScript builder's `constraints.index([...], { type: "bm25", options: { key_field: "id" } })` emits `CREATE INDEX ... USING bm25 (id, title, body) WITH (key_field=id)`; migration under `migrations/paradedb/` |
| ParadeDB queries | `paradeDbMatch` and `paradeDbMatchAny` match any word, `paradeDbMatchAll` every word, `paradeDbPhrase` adjacent words, `paradeDbTerm` one word; `fns.paradeDbScore(f.id)` ranks (1.478, 0.430). `paradeDbFuzzy` is not chainable on a match; its usage was not established, so the modifier operations are not documented |
| arktype-json | TypeScript builder only (`field.column(arktypeJson(schema))`); `jsonb`; `contract.d.ts` types the field from the schema; a stored value that breaks the schema fails on read with `RUNTIME.JSON_SCHEMA_VALIDATION_FAILED`; writes are not checked: an invalid value is stored and `create()` then fails reading it back |
| Directory snippets | `apps/site/src/components/extensions/usage-snippets.ts` used `@default(uuid())`, refused since rc.19; changed to `@onCreate(uuid())` |

ORM-side follow-up (D35): PSL cannot declare an extension's index type such as `bm25`.

## Checks before the PR

The three scripts, cspell, `lint:links`; two cold reader rounds; a fact re-check.
