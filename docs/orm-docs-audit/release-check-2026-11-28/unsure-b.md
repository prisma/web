# Release check: Section 4 ("Unsure") items 34 to 50

Checked against the ORM packages at `8.0.0-rc.25` (tag `v8.0.0-rc.25` in prisma/orm) and `prisma` `8.0.0-rc.36`. Docs are prisma/web `origin/main` at `b3525d8b6`; line numbers below are on that commit. "Designed" is judged from the ADRs in `docs/architecture docs/adrs/` at the tag, from code comments, from tests at the tag and from the pull requests that chose the behaviour. Nothing was reproduced by running packages: the local Homebrew PostgreSQL 15 has neither pgvector nor PostGIS, and the code and tests at the tag settled every item. `npm view` was used for the dist-tags in item 50.

The numbering of the Section 4 bullets matched the brief: 34 is "arktype-json." and 50 is "`latest` tag warning.".

Since the inventory was written (2026-11-22), only `#31173` (reserved names such as `constructor`) and the version bump landed in the checked areas before the rc.25 tag, so the passages written against the code of that week are still accurate unless noted.

## Summary

| # | Item | Verdict | Docs change |
| --- | --- | --- | --- |
| 34 | arktype-json: `Planned 0 operation(s)`; `create()` saves an invalid row, then throws | designed, not a workaround (both) | none |
| 35 | PostGIS: a query shape needs its SRID | still present (a gap, not a decision) | none |
| 36 | Supabase: a client checks only one kind of JWT | designed, not a workaround | none |
| 37 | MongoDB: `bigint` filter needs `MongoParamRef`; `.first()` takes no argument | still present | none |
| 38 | Reads do not stream without `cursor` | designed, not a workaround | none |
| 39 | Many-to-many `deleteAll()` deletes the targets | designed, not a workaround | none |
| 40 | `upsert` without `conflictOn` uses the primary key; bulk writes accept and ignore `.orderBy()` | designed, not a workaround (both) | none |
| 41 | No atomic update of a field from its own value; no top-level `.count()` | still missing | none |
| 42 | `ShorthandWhereFilter` and `ModelAccessor` take the schema in different positions | still present | none |
| 43 | Budgets: bare table names, no per-query opt-out; lints ignore `mode`; no read-only annotation | still present (differs from ADR 022 and ADR 023) | none |
| 44 | Middleware: no `latencyMs` on an ORM call; a statement that fails before the driver says `source: 'driver'` | partly designed: first half designed, second still present | none |
| 45 | Cache `deriveKey` does not run for ORM reads | designed (recorded limitation), not a workaround | none |
| 46 | Extension packs leave some columns unclaimed by `contract infer` | **partly fixed: the pgvector half is now false** | `orm/reference/error-reference.mdx:505`, fixed at the source in prisma/orm |
| 47 | Error codes nothing raises | 3 codes still never raised; `MIGRATION.UNFILLED_PLACEHOLDER` is raised | `orm/reference/error-reference.mdx:205-211, 1380-1382, 1404-1406`, fixed at the source in prisma/orm |
| 48 | Other API gaps | still present (all); one sentence contradicts another | `orm/reference/sql-query-builder.mdx:139` (optional qualifier) |
| 49 | MySQL sign-in reported as `CONTRACT.MARKER_READ_FAILED`; MySQL raw SQL rules; SQLite `date('now')` | still present | none |
| 50 | `latest` tag warning and "Until the final release" | still true (no general availability yet) | none |

## 34. arktype-json

- **Verdict:** designed, not a workaround, for both passages.
- **Evidence:**
  - `Planned 0 operation(s)` (`orm/extensions/arktype-json.mdx:105`): prisma/orm#30639 (TML-3393, "migration plan says how to proceed when a contract change needs no database change") made a contract-only change write a migration with no operations, on purpose. `packages/1-framework/3-tooling/cli/test/orm/migration-plan.no-operations.test.ts` asserts the message `Planned 0 operation(s). The storage the contract describes changed, but the database needs no operation for it, so the migration has none.`
  - Validation on read only (`:123-129`): `packages/3-extensions/arktype-json/README.md` at the tag has a section "Data integrity: validate on read, not on write" that calls it intentional: ADR 208 keeps `toWire` independent of the column's schema, and the README describes the same consequence the docs do (the `INSERT ... RETURNING` commits, then the read-back throws `RUNTIME.JSON_SCHEMA_VALIDATION_FAILED`). The codec's `toWire` only checks that the value is JSON (`src/core/arktype-json-codec.ts`).
- **Docs change needed:** none. Optional: the README suggests wrapping the write in a transaction so the failed read-back rolls the row back; the page offers only checking the value first.

## 35. PostGIS SRID on query shapes

- **Verdict:** still present. A gap, not a recorded decision.
- **Evidence:** `packages/3-extensions/postgis/src/core/codecs.ts` header: "The geometry codec's encode/decode is parameter-independent ... the resolved codec for every `(srid)` instance is the same shared codec today. The factory threads the closure for future per-instance state (e.g. SRID cross-checks)". So a shape written without an SRID is sent without one, whatever the column's SRID; on a write PostGIS fills the column's SRID, in a comparison it does not. No ADR decides this, and the package README promises the opposite direction ("let the framework handle the wire format, SRID metadata").
- **Docs change needed:** none. Passage at `orm/extensions/postgis.mdx:115`.

## 36. Supabase JWT kinds

- **Verdict:** designed, not a workaround.
- **Evidence:** `packages/3-extensions/supabase/src/runtime/supabase.ts`: the options type is `JwtSecretOption | JwksUrlOption`, each with the other key typed `never`; passing both throws `SUPABASE.CONFIG_INVALID` "Provide either jwtSecret or jwksUrl, not both". `algKeyMismatchReason` rejects a token whose algorithm does not fit the configured key with `SUPABASE.JWT_INVALID`, and its message names the other option, as the docs say. No ADR covers it. The consequence during a move from HS256 to ES256 (old tokens rejected until they refresh) follows from the one-option design; accepting both would be a new feature.
- **Docs change needed:** none. Passage at `orm/extensions/using-extensions.mdx:235`.

## 37. MongoDB `bigint` filters and `.first()`

- **Verdict:** still present (both).
- **Evidence:** `packages/2-mongo-family/1-foundation/mongo-value/src/values.ts`: `LiteralValue = string | number | boolean | null | Date`, no `bigint`, so `MongoFieldFilter.gt(field, value: MongoValue)` takes a `bigint` only inside `MongoParamRef`. `packages/2-mongo-family/5-query-builders/orm/src/collection.ts:170, 562`: `first(): Promise<...>` takes no argument. No ADR decides either.
- **Docs change needed:** none. Passages at `orm/fundamentals/reading-data.mdx:141, 231`. Aside, not my item: `reading-data.mdx:56` says `.whereUnique(...)` "is not available on MongoDB yet"; the Mongo ORM still has no `whereUnique` at the tag, so that sentence is still true.

## 38. Reads do not stream without `cursor`

- **Verdict:** designed, not a workaround.
- **Evidence:** ADR 263, section "Cursors are off by default": unset `cursor` means no cursor and the whole result is fetched first. The reason recorded: with cursors on, every read hangs behind Cloudflare Hyperdrive. The same ADR records that a query inside a `for await` over a cursor read on a one-connection client waits forever. ADR 125's "auto" mode (choose buffering or streaming by estimate) was never built and is overtaken by ADR 263.
- **Docs change needed:** none. Passages at `orm/fundamentals/reading-data.mdx:417`, `orm/reference/sql-query-builder.mdx:1162`, `orm/reference/transactions-and-runtime.mdx:1014`.

## 39. Many-to-many `deleteAll()` deletes the targets

- **Verdict:** designed, not a workaround.
- **Evidence:** prisma/orm#31016 description: "`deleteAll()` does not touch junction rows; the database's foreign-key action decides (with keys that do not cascade, its error rolls back the whole update)." `test/integration/test/sql-orm-client/mn-nested-write.test.ts:842` asserts it: "deleteAll() with junction keys that do not cascade surfaces the database error and rolls back the whole update".
- **Docs change needed:** none. Passage at `orm/fundamentals/relations-and-joins.mdx:227`.

## 40. `upsert` without `conflictOn`; `.orderBy()` on bulk writes

- **Verdict:** designed, not a workaround (both).
- **Evidence:**
  - `packages/3-extensions/sql-orm-client/src/collection.ts`, doc comment on `upsert`: "`conflictOn` selects which unique constraint drives the conflict resolution — omit to use the model's primary key", and "omit it only when the conflict is on the primary key". The failure the docs describe is PostgreSQL's `ON CONFLICT (id)` not covering a clash on `email`.
  - `src/write-guards.ts`: `assertBulkWriteIgnoresNothing` refuses `limit`, `offset`, `cursor`, `distinct` and `distinctOn` with `ORM.ARGUMENT_INVALID`, because each would change which rows are written, and leaves out `orderBy`, which does not.
- **Docs change needed:** none. Passages at `orm/fundamentals/writing-data.mdx:276, 324`. A nit: "Always pass `conflictOn`" (`:276`) is stronger than needed when `create` supplies the primary key.

## 41. Read-then-write toggle; `.count()` only inside `.include`

- **Verdict:** still missing.
- **Evidence:** no update operator that sets a field from its own value (no `increment`, no negation) in `packages/3-extensions/sql-orm-client/src` at the tag, and no `count()` method on the collection (`collection.ts`). `orm/release-status.mdx:13` lists atomic `increment` as not available yet, so this is a known gap, not a decision.
- **Docs change needed:** none. Passages at `guides/switch-to-prisma-orm/from-drizzle.mdx:682, 799`, `guides/integrations/github-actions.mdx:765`, `orm/fundamentals/writing-data.mdx:230`.

## 42. `ShorthandWhereFilter` and `ModelAccessor` parameter order

- **Verdict:** still present. An inconsistency, not a recorded decision.
- **Evidence:** `packages/3-extensions/sql-orm-client/src/types.ts:649`: `ModelAccessor<TContract, ModelName, NsId = never>`; `:1303`: `ShorthandWhereFilter<TContract, NsId, ModelName>`.
- **Docs change needed:** none. Passage at `orm/fundamentals/types.mdx:105`.

## 43. Budgets and lints

- **Verdict:** still present. Not designed: the code differs from what ADR 022 and ADR 023 decided.
- **Evidence:**
  - `packages/2-sql-family/5-runtime/src/middleware/budgets.ts:60`: the estimate looks up `tableRows[primaryTable] ?? defaultTableRows`, by bare table name, with no warning for an unknown key. There is no per-query override; ADR 023 ("Lane annotations") provides `annotations.intent = 'bulk'` and `annotations.maxExpectedRows` for that, and neither exists in the code.
  - `src/middleware/lints.ts:170-177`: the severity comes from the rule or `severities` only; `mode` is never read. ADR 022 defines `strict` and `permissive` presets that set the lint levels.
  - `src/guardrails/raw.ts:47, 134-139`: `LINT.READ_ONLY_MUTATION` fires on `meta.annotations.intent` of `read`, `report` or `readonly`; no source file at the tag sets `intent`, so no public API reaches it.
- **Docs change needed:** none. Passages at `orm/middleware/built-in-budgets.mdx:63, 145-161`, `orm/middleware/built-in-lints.mdx:48, 156, 158, 162`, `orm/reference/transactions-and-runtime.mdx:211`.

## 44. Middleware result fields

- **Verdict:** partly designed. No `latencyMs` on an ORM call is designed; the pre-driver failure labelled `source: 'driver'` is still present and not designed.
- **Evidence:** ADR 271, `activityEnded`: "A statement's result also carries its latency, where its result came from"; latency is given to statements only. `packages/1-framework/1-core/framework-components/src/execution/runtime-middleware.ts`: `StatementEnded` has `latencyMs` and `source: 'driver' | 'middleware'`, `ClientActivityEnded` has neither latency nor `'driver'`. `run-with-middleware.ts:276-277`: a statement that never ran gets `latencyMs` 0 and whatever `#source` was last set, which is `'driver'` when no intercept answered; nothing records this as a choice.
- **Docs change needed:** none. Passages at `orm/middleware/how-middleware-works.mdx:139, 266`.

## 45. Cache `deriveKey` is not used for ORM reads

- **Verdict:** designed (a recorded limitation), not a workaround.
- **Evidence:** `packages/3-extensions/middleware-cache/src/cache-middleware.ts:23-30`: "It does not apply to a client activity, such as an ORM call, which has no execution plan ... A `deriveKey` that separates tenants does not separate ORM calls; give each annotated ORM call a tenant-prefixed `key`". The docs say the same. The limitation follows from `deriveKey` taking an `ExecutionPlan`; it is still a hazard (one tenant's cached read served to another), worth a ticket for a client-activity key hook.
- **Docs change needed:** none. Passage at `orm/middleware/built-in-cache.mdx:130`.

## 46. Extension packs leave some columns unclaimed

- **Verdict:** partly fixed. **The pgvector half of the sentence is now false.** The PostGIS half is still true.
- **Evidence:**
  - prisma/orm#30664 (merged 2026-11-18, in rc.25) added dimensionless vectors. `packages/3-extensions/pgvector/src/core/data-types.ts` declares the text `vector` with `written: true`, and `packages/3-extensions/pgvector/test/contract-infer.test.ts` asserts, for both `vector(3)` and `vector`, that `contract infer` prints `pgvector.Vector` (with no argument for `vector`). The docs already describe dimensionless vectors at `orm/extensions/using-extensions.mdx:72`.
  - `packages/3-extensions/postgis/src/core/data-types.ts`: only `geometry` and `geometry(geometry,{srid})` are claimed, so `geometry(Point,4326)` and the other subtypes stay unclaimed.
- **Docs change needed:** `orm/reference/error-reference.mdx:505`, entry `CONTRACT.INFER_COLUMN_TYPE_UNCLAIMED`. The page is generated, so the fix goes in prisma/orm `docs/reference/error-reference.md` (line 494 at the tag, still there on `origin/main` of 2026-11-27); the sentence was written in prisma/orm#30735 (2026-10-15), before #30664.
  - Current: "Some forms stay unclaimed even with their pack configured: a `vector` column with no dimension (`pgvector`), and `geometry(Point,<srid>)` and the other geometry subtypes (`postgis`)."
  - New: "Some forms stay unclaimed even with their pack configured: `geometry(Point,<srid>)` and the other geometry subtypes (`postgis`)."

## 47. Error codes nothing raises

- **Verdict:** three codes are still never raised; the fourth (`MIGRATION.UNFILLED_PLACEHOLDER`, old line 1991) is raised.
- **Evidence:** `git grep` over the whole tag finds each of these only in `docs/reference/error-reference.md` (and, for the first, ADR 239's table of old codes and `skills/prisma-8/references/debug.md:88`). Same on prisma/orm `origin/main` of 2026-11-27.
  - `CLI.INIT_REINIT_NEEDS_FORCE`: the entry itself says the code belonged to the deleted commander `orm init` and that `CLI.CONSENT_REQUIRED` replaces it.
  - `RUNTIME.EXECUTION_RESULT_MISSING`: no raiser.
  - `RUNTIME.MIDDLEWARE_RESULT_MISMATCH`: no raiser.
  - `MIGRATION.UNFILLED_PLACEHOLDER`: raised by `placeholder()` (`packages/1-framework/1-core/errors/src/migration.ts`) and by `db migrate` before it applies anything (`cli/src/control-api/operations/migrate.ts:383-389`, added in prisma/orm#30929, first in `v8.0.0-rc.22-dev.9`). The current entry describes both, so it is right.
- **Docs change needed:** in prisma/orm `docs/reference/error-reference.md`, delete the entries `CLI.INIT_REINIT_NEEDS_FORCE` (line 194 at the tag), `RUNTIME.EXECUTION_RESULT_MISSING` (1369) and `RUNTIME.MIDDLEWARE_RESULT_MISMATCH` (1393), and drop `CLI.INIT_REINIT_NEEDS_FORCE` from `skills/prisma-8/references/debug.md:88`. The synced page then loses `orm/reference/error-reference.mdx:205-211, 1380-1382, 1404-1406`. If the team keeps retired codes on the page on purpose, the two `RUNTIME` entries at least need the same "no longer raised" note the `CLI` one has, because today they describe conditions as if they happen.

## 48. Other API gaps with workarounds

- **Verdict:** still present, every passage. One sentence on the SQL query builder page is contradicted by another on the same page.
- **Evidence** (current line, then the code at the tag):
  - `migration-api.mdx:21` (a string is used as written, a `sql` value is dedented): describes the `sql` helper; designed.
  - `migration-api.mdx:475`: `foreignKey(columns, refTable, refColumns, options)` in `packages/2-sql-family/4-lanes/relational-core/src/contract-free/column.ts:63` has no schema argument.
  - `migration-api.mdx:479`: still no published list of codec ids; `sql-query-builder.mdx:195` agrees ("The full list is what your contract uses").
  - `orm-client.mdx:850`: no `count()` on the collection (item 41).
  - `orm-client.mdx:1131`: no run-time check for a missing `where()` on PostgreSQL. ADR 265, "A run-time guard on `deleteAll` and `updateAll`": "Whether to refuse that at run time is a separate decision." Open, not decided.
  - `orm-client.mdx:1153, 1229, 1277, 1654-1655`: `onConflict` on a variant in its own table is refused in `statement-graph/conflict-keys.ts:104-109`; `createAndCount()` and `upsert()` call `#assertNotMtiVariant` (`collection.ts:2234, 2310`).
  - `orm-client.mdx:1511`: the MongoDB update count is `modifiedCount` (`packages/2-mongo-family/7-runtime/src/statistics-count-field.ts:6-9`).
  - `orm-client.mdx:1888`: `grouped-collection.ts:157-160`: "Ordering by an aggregate alias needs a builder surface over the aliases and isn't supported here."
  - `orm-client.mdx:2324`: MongoDB `upsert()` refuses dot paths (`orm/src/collection.ts:819`).
  - `orm-client.mdx:2326`: `#requireFilters` checks `filters.length === 0` (`orm/src/collection.ts:1559-1567`), and `.where({})` adds none.
  - `pipeline-builder.mdx:660, 938`: `expression-helpers.ts` has no helper for a `$$` variable and no `and`, `or` or `not`.
  - `raw-queries.mdx:314`: `raw-collection.ts:41-45`: `options?: { upsert?: boolean }` only.
  - `sql-query-builder.mdx:524, 687, 688, 775, 856, 1004`: no change in the SQL builder since the audit except prisma/orm#31173; the SQL builder's `fns` still has `ilike` only (`packages/3-targets/postgres/1-target/src/core/query-operations.ts:172`), while the ORM client has `like`.
  - `sql-query-builder.mdx:766`: `sql-builder/src/runtime/mutation-impl.ts:97-107`: `buildParamValues`, called from `build()`, evaluates `applyMutationDefaults` and stores the generated values as fixed parameters. So a built insert repeats the same generated id. This looks like a defect (the ORM client generates per call), not a decision.
  - `transactions-and-runtime.mdx:31, 38`: describe validation and pool ownership; designed. `:41`: ADR 021's update says the runtime warns instead of throwing on a missing or mismatched marker; designed. `:211`: lints ignore `mode` (item 43).
- **Docs change needed:** optional, `orm/reference/sql-query-builder.mdx:139`. Current: "You can run the same built query more than once." It is false for an insert that Prisma ORM fills with generated values, which `:766` explains. Suggested: "You can run the same built query more than once, except an insert that Prisma ORM fills with generated values, such as `@onCreate(uuid())`: see [`insert()`](#insert)." The real fix is in prisma/orm (generate at execution), after which `:766` goes.

## 49. MySQL sign-in error code; MySQL raw SQL rules; SQLite defaults

- **Verdict:** still present.
- **Evidence:**
  - `packages/3-targets/mysql/1-mysql/3-driver/src/core/normalize-error.ts`: the public-key failure becomes a `SqlConnectionError`, which has no `DRIVER.*` code. `packages/1-framework/1-core/errors/src/execution.ts:149-171` (`rethrowMarkerReadError`) passes through only structured errors and `DRIVER.*` codes and wraps anything else as `CONTRACT.MARKER_READ_FAILED`. So the app's first query reports a sign-in failure under the marker code. This looks like a defect in the runtime, and the same wrapping applies to any connection failure that reaches the marker read as a `SqlConnectionError`. The CLI path (`migrations/control-driver.ts:141-142`) raises `DRIVER.CONNECTION_FAILED`, as the docs say.
  - Raw SQL rules: the driver README's "Environment requirements" at the tag, which the docs link; designed.
  - SQLite `date('now')`: `packages/3-targets/sqlite/1-target/src/core/datetime-text.ts:18` and `default-normalizer.ts`; no SQLite verify change since the audit.
- **Docs change needed:** none. Passages at `orm/supported-databases.mdx:31, 33, 43`. Line 31 also says SQLite is "without a quickstart yet"; still true.

## 50. `latest` tag warning; "Until the final release"

- **Verdict:** still true. Prisma ORM 8 has not reached general availability.
- **Evidence:** `npm view` on 2026-11-28: `prisma` `latest` `8.0.0-rc.36`, `prev` `7.10.1`; `@prisma/orm-postgres` and `@prisma/orm-mongo` `latest` `8.0.0-rc.25`; `@prisma/client` `latest` `7.10.1`. These match the table and the warning at `orm/release-status.mdx:49-61`. The warning stays true for as long as `latest` points at Prisma ORM 8, so it does not depend on general availability.
- **Docs change needed:** none now. At general availability, `orm/release-status.mdx:9, 17` and `orm/supported-databases.mdx:27` ("Until the final release") must change.
