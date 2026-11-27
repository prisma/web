# Release check: temporary wording about ORM features, and notes about earlier release candidates

Checked by `temporary` on 2026-11-28. Docs: prisma/web `origin/main` at `b3525d8b6`. Release: ORM `v8.0.0-rc.25` (prisma/orm), CLI `v8.0.0-rc.36` (prisma/prisma-cli) for the CLI notes. Evidence is from reading the code at the tags and `git log v8.0.0-rc.20..v8.0.0-rc.25`; no reproduction was needed, so no database was started. Paths are under `apps/docs/content/docs/`. Line numbers are on current `origin/main`.

## Summary

| Item | Verdict | Docs change needed |
| --- | --- | --- |
| 2.1 MongoDB transactions (all 11 locations) | still missing | none |
| 2.2a MongoDB `whereUnique` | still missing | none |
| 2.2b MongoDB prepared queries | already removed from the docs (now documented as shipped) | none |
| 2.2c `.include` on an array of ids (MongoDB) | still missing | none |
| 2.2d Prisma 6 MongoDB schema features | still missing | none |
| 2.2e "still changes between release candidates" | still true | none |
| 2.2f `release-status.mdx:28` | still true | none |
| 2.2g MongoDB snapshots not checked | still missing | none |
| 2.2h hand-written MongoDB transforms, no staleness check | still missing | none |
| 2.3 MySQL, MariaDB and SQLite | partly out of date: several pages leave out MariaDB, two leave out MySQL | yes, see 2.3 |
| 2.4a `release-status.mdx:13` | **feature shipped, sentence now false** ("most nested writes") | yes |
| 2.4b rest of client and contract gaps | still missing | none |
| 2.5 migration tooling (squash, split, rehearsal, staleness check) | still missing | none |
| 2.6 generated error reference | still missing; page is generated from ORM rc.25 | none here (owned by prisma/orm) |
| 2.7 sentences the inventory missed | two new ones, both still true; three wording slips | small, see 2.7 |
| 3 notes about earlier release candidates (all locations) | accurate; all but two matter only to readers upgrading from an older release candidate | at GA, delete; two need rewording, not deletion |

What is now false: `orm/release-status.mdx:13` says "most nested writes" are not available. Since rc.24 and rc.25, most of them are. `orm/migrations/applying-a-migration.mdx:9` and `orm/migrations/how-migrations-work.mdx:11` list the databases `db migrate` works on and leave out MariaDB (and, on the first page, MySQL), though both migrate in rc.25.

No other "not yet" sentence about an ORM feature is false at rc.25. The docs were already updated for rc.25 in most places (nested writes, nested transactions, MongoDB prepared ORM reads, MariaDB client).

---

## 2.1 MongoDB transactions

**Verdict:** still missing.

**Evidence:** at `v8.0.0-rc.25` the MongoDB runtime has no transaction surface. `packages/2-mongo-family/7-runtime/src/mongo-middleware.ts:24` says "Mongo has no transactions, so every activity is finalized right after it ends", and `mongo-runtime.ts:166` notes a future `connection()/transaction()` surface. No commit in rc.20..rc.25 adds one; the savepoint and nested-transaction work (#31106, #31120, #31121) covers PostgreSQL, MySQL, MariaDB, SQLite and Supabase only.

Locations checked, all still present and accurate: `orm/supported-databases.mdx:63, 70`; `orm/reference/transactions-and-runtime.mdx:16, 736-737`; `orm/reference/orm-client.mdx:1477`; `orm/reference/raw-queries.mdx:225`; `orm/fundamentals/transactions.mdx:186`; `guides/switch-to-prisma-orm/from-mongoose.mdx:587-589`; `guides/upgrade-prisma-orm/mongodb.mdx:19, 406, 503`.

## 2.2 Other MongoDB gaps

**a. `whereUnique` on MongoDB** (`orm/fundamentals/reading-data.mdx:56, 159`; `orm/reference/orm-client.mdx:341`). **Still missing.** At rc.25 `whereUnique` exists only in `packages/3-extensions/sql-orm-client/src/collection.ts`; the MongoDB collection (`packages/2-mongo-family/5-query-builders/orm/src/collection.ts`) has none.

**b. Prepared queries on MongoDB** (`orm/reference/transactions-and-runtime.mdx`, inventory line 765). **Already removed from the docs.** The "Prepared statements (MongoDB)" section (lines 740-773) now documents `db.prepare` (shipped in rc.24, #30967) and prepared ORM reads with `.prepared.all()/.first()/.firstOrThrow()` "since `8.0.0-rc.25`" (#31054, first released in rc.25). Both match the code.

**c. `.include` on an array of ids** (`guides/switch-to-prisma-orm/from-mongoose.mdx:357, 604`). **Still missing.** `include()` at rc.25 (`collection.ts:461-528`) takes reference relations with one local and one target field only, and the Prisma 6 reader refuses list relations with `PSL.PRISMA6_MONGO_LIST_RELATION_UNSUPPORTED` ("which Prisma 8 does not support yet", `contract-prisma6/src/interpreter.ts:1401`).

**d. Prisma 6 schema features with no equivalent** (`guides/upgrade-prisma-orm/mongodb.mdx:209-220`). **Still missing.** All eight codes in the table exist at rc.25 in `packages/2-mongo-family/2-authoring/contract-prisma6/src/`, and the `DEFAULT_UNSUPPORTED` rule still allows only `auto()` and `now()` (`interpreter.ts:939-940`).

**e. "MongoDB support still changes between release candidates"** (`guides/upgrade-prisma-orm/mongodb.mdx:24`). **Still true.** It names rc.25, and MongoDB is still early access.

**f. `orm/release-status.mdx:28`** ("some of what Prisma ORM 6 does on MongoDB is not available yet"). **Still true**, per a to e.

**g. MongoDB snapshots not checked** (`orm/migrations/applying-a-migration.mdx:172`, "MongoDB snapshots are not checked yet"). **Still missing.** Snapshot content checks run only when the target's serializer has `hashCanonicalizationHooks` (`cli/src/utils/snapshot-content-verification.ts:19-31`). The SQL serializer has them; the MongoDB one says "No hashCanonicalizationHooks" (`2-mongo-family/9-family/src/core/ir/mongo-contract-serializer-base.ts:108`).

**h. Hand-written MongoDB transforms, and no check for an edit you did not recompile** (`orm/migrations/editing-a-migration.mdx:338`). **Still missing.** No rc.20..rc.25 commit adds a query-builder update for MongoDB data transforms, and `migration check` at rc.25 does not read `migration.ts`.

## 2.3 MySQL, MariaDB and SQLite

**Verdict:** partly out of date. The MySQL limits are still true; the problem is pages that list which databases a feature works on and leave out MariaDB, which gained its client in rc.25 (#31082) and runs the same ORM, SQL builder and migrations as MySQL.

Still true at rc.25:

- MySQL and MariaDB refuse row locks and LATERAL joins "yet" (`3-targets/mysql/1-mysql/2-adapter/src/core/sql-renderer.ts:373-376, 793-795`). So `orm/reference/sql-query-builder.mdx:156, 523` and `orm/supported-databases.mdx:41` stand.
- MySQL migrations create and drop tables, columns, indexes, uniques and foreign keys only, and refuse every other change (`mysql/1-target/src/core/migrations/planner.ts:106`). So `orm/supported-databases.mdx:47` and `orm/migrations/how-migrations-work.mdx:11` stand for MySQL.
- Many-to-many `connect()` on MySQL and MariaDB (`orm/reference/orm-client.mdx:1163, 1364`) is still refused. `connect` on a junction inserts with a skip-on-conflict (`sql-orm-client/src/statement-graph/nested-mutations.ts:902-910`, `linkKeyConflict` at 1288), and the MySQL renderer refuses `do-nothing` with `RUNTIME.AST_UNSUPPORTED` (`sql-renderer.ts:300-305`).
- SQLite "without a quickstart yet" (`orm/supported-databases.mdx:31`) is about the docs, and still true.
- `orm/supported-databases.mdx:9, 15-16, 49, 95` and `orm/supported-versions.mdx:42` and `orm/index.mdx:42` already describe MariaDB's client correctly. No current page says MariaDB has no client.

Now incomplete, with the change needed:

1. `orm/migrations/applying-a-migration.mdx:9`: "works on the [supported databases](/orm/supported-databases), PostgreSQL and MongoDB, with SQLite still experimental." `db migrate` also runs on MySQL (since rc.21, #30841) and MariaDB (since rc.24, #30964). Suggested: "works on the [supported databases](/orm/supported-databases): PostgreSQL and MongoDB, SQLite, which is experimental, and the MySQL and MariaDB early previews."
2. `orm/migrations/how-migrations-work.mdx:11`: "SQLite is experimental, and MySQL is an early preview whose migrations can create and drop …". Add MariaDB: "…and MySQL and MariaDB are early previews whose migrations can create and drop …". MariaDB uses the MySQL planner ("for MySQL or a target that extends it", `planner.ts:106`).
3. `orm/reference/orm-client.mdx:341` ("Available on PostgreSQL, SQLite, and MySQL"), `:984`, `:988-989` (custom collections; `mariadb(...)` takes the same `collections` option, `2-mariadb/9-facade/src/runtime/mariadb.ts:22-27`), `:1032`, `:1077`: add MariaDB, and `mariadb(...)` to the list of client functions at 989.
4. `orm/reference/sql-query-builder.mdx:14` ("PostgreSQL, SQLite, and the MySQL early preview are supported today") and `:156`: add MariaDB, created with `mariadb(...)` from `@prisma/orm-mariadb/runtime`, with the same limits as MySQL.
5. `orm/extensions/index.mdx:17` names only `@prisma/orm-mysql` as an early preview; add `@prisma/orm-mariadb`. The cache middleware row (line 23) and `orm/middleware/built-in-cache.mdx:41` say "PostgreSQL, SQLite, MySQL"; the cache has no target restriction (`3-extensions/middleware-cache/src/` names no family or target), so MariaDB works too.
6. `orm/index.mdx:3, 6` (page description and meta description) list "PostgreSQL, MongoDB, SQLite, and MySQL"; add MariaDB.
7. `orm/supported-databases.mdx:49` lists `contract emit`, `db migrate`, `db verify` and `db sign` for MariaDB but not `migration plan`, which works through the shared planner. Add it.
8. Wording slip, `orm/supported-databases.mdx:41`: "Row locks such as `FOR UPDATE`, `LATERAL` joins, `RETURNING`, and skipping rows that collide … are refused with a message that they are not supported on MySQL yet." Only the row-lock and LATERAL messages say "yet". `RETURNING` is refused because MySQL has none ("cannot return the rows … it has no RETURNING", `sql-renderer.ts:212`), and skip is refused by design ("cannot skip a conflicting row without also hiding other errors: INSERT IGNORE turns foreign-key and NOT NULL errors into warnings", `sql-renderer.ts:304`). Suggested: "Row locks such as `FOR UPDATE` and `LATERAL` joins are not supported on MySQL yet. `RETURNING`, which MySQL does not have, and skipping rows that collide with a unique constraint, which MySQL can only do while also hiding foreign-key and `NOT NULL` errors, are refused."

Minor, same cause: `orm/fundamentals/transactions.mdx:11` says `db.transaction(...)` "works the same way on SQLite and MySQL"; MariaDB too.

## 2.4 Client and contract gaps

**a. `orm/release-status.mdx:13`. Verdict: feature shipped, sentence now false.**

Current: "Before you decide, read [what is not available yet](/orm/coming-from-prisma-orm-7#not-available-yet). Today that includes `$extends`, filtering inside JSON columns, atomic `increment`, most nested writes, and the `P2002`-style error codes."

Evidence: nested `updateMany`/`deleteMany` shipped in rc.24 (#31014, #31016); nested `update`/`delete` of one row (#31096, #31100), `connectOrCreate` as `onConflict: 'connect'` (#31070) and disconnect criteria (#31095) shipped in rc.25. The page it links to now says "Most of Prisma ORM 7's nested writes have a Prisma ORM 8 form" (`orm/coming-from-prisma-orm-7.mdx:420`) and lists only nested `upsert` and relation `set` as missing. It also says `$extends` "will not be added" and is replaced by middleware, custom collections and query fragments (line 404), so it is not a gap that is "not available yet".

Should become: "Before you decide, read [what is not available](/orm/coming-from-prisma-orm-7#not-available-yet). Today that includes filtering inside JSON columns, atomic `increment`, nested `upsert` and relation `set`, and the `P2002`-style error codes. `$extends` is replaced by middleware and custom collections."

**b. Everything else: still missing.**

- `orm/coming-from-prisma-orm-7.mdx:80` (list filters "for now"), `:155`, `:265`, `:386-440`: already updated for rc.25 and accurate. `increment`/`decrement`, JSON path filters, list filters, `maxWait`, `omit`, `relationLoadStrategy`, nested `upsert`, relation `set`: no rc.20..rc.25 commit adds any of them, and `sql-orm-client/src` has no `increment`. Inventory line 351 now holds raw-query text with no temporary wording.
- Links to `#not-available-yet` from `orm/fundamentals/relations-and-joins.mdx:246`, `orm/fundamentals/writing-data.mdx:192` and `orm/middleware/authoring-custom-middleware.mdx:14`: the anchor exists and the surrounding text is accurate.
- `orm/data-modeling/index.mdx:168` (type version "always `@1` today"): still true; no codec id at rc.25 has a version other than `@1`.
- `orm/contract-authoring/advanced-postgresql.mdx:9, 194-215` ("gaps at `8.0.0-rc.25`"): written for rc.25. The three linked issues are still open: prisma/orm#30270, #30294, #30573.
- `orm/core-concepts.mdx:272`: general pointer, accurate.
- `guides/upgrade-prisma-orm/postgresql.mdx:392` (`increment` has no form "yet"): still true.
- `orm/contract-authoring/typescript-schema-builder.mdx:288` (`.defaultSql` deprecated, removed "in the stable `8.0.0` release"): still true; `contract-dsl.ts:522` says "@deprecated … Removed in 8.0.0."
- `cli/configuration.mdx:151` and `cli/contract-print.mdx:53` (`contract print` cannot write an `Unsupported(...)` column "yet"): still true; the printer refuses "column … is not stored by any field, so it cannot be written in Prisma 8 PSL" (`3-targets/postgres/1-target/src/core/psl-print/refusals.ts:425`).
- `guides/making-guides.mdx:198` (Cloudflare D1 as an example of something not supported "yet"): still true; no D1 code at rc.25.

## 2.5 Migration tooling

**Verdict:** still missing.

At rc.25 the CLI has no squash, split, rehearsal or shadow-database command (its commands are `db execute/init/migrate/pull/push/schema/seed/sign/update/verify` and `migration apply/check/graph/list/log/new/plan/ref/show/status`), and no rc.20..rc.25 commit adds one. `migration check` does not read `migration.ts`, so nothing checks that `ops.json` matches it.

Locations, all present and accurate: `orm/migrations/applying-a-migration.mdx:195`; `orm/migrations/how-migrations-work.mdx:203`; `orm/migrations/rollbacks-and-recovery.mdx:151`; `orm/migrations/the-migration-graph.mdx:189-192`; `orm/migrations/generating-a-migration.mdx:235` ("The one thing it cannot tell you is whether you remembered to recompile"); `orm/migrations/editing-a-migration.mdx:338`.

## 2.6 Generated error reference

**Verdict:** still missing, and accurate for rc.25.

`orm/reference/error-reference.mdx` is generated from `docs/reference/error-reference.md` at `v8.0.0-rc.25` (line 10 names the source). The inventory's sentences are now at lines 346 (generator with no function), 373 (relation to another contract space, "does not write yet"; matches `refusals.ts:703`, "which contract print cannot write yet"), 457 (`codec-not-for-enums`), 509 (`contract infer` cannot express a shape "yet"), 657 (codes "not yet dotted"), 751 (MongoDB composite index path "cannot express yet"), 798 (MongoDB list relation "does not support yet"; matches the interpreter), 1269 (`RUNTIME.AST_UNSUPPORTED`, MySQL query lowering "does not build yet"), and 2041 (`MIGRATION.STATEMENT_UNRESOLVED`, which no longer has temporary wording). Any change belongs in the ORM repository's source file, not on this page.

## 2.7 Sentences the inventory missed

A grep of current `origin/main` (ORM, CLI, guides and getting-started pages; not v6/v7, Compute, Composer, Postgres or Accelerate) found two ORM feature sentences the inventory does not list:

- `orm/middleware/built-in-cache.mdx:41` and `orm/middleware/how-middleware-works.mdx:312`: the cache "does not work on MongoDB yet … a MongoDB read has no way to be opted in". **Still missing**: MongoDB queries have no annotation support at rc.25 (no `annotat…` in `2-mongo-family/5-query-builders` or `7-runtime`). `orm/supported-databases.mdx:72` says the same.
- `orm/extensions/paradedb.mdx.hidden:19`: the ParadeDB search index "cannot [be declared in contract.prisma] yet". The page is hidden; not checked.

Everything else the grep found is either in 2.1 to 2.6, describes the reader's own project state ("no migration ends at it yet"), or is designed behaviour (`orm/reference/migration-api.mdx:246`, no `CONCURRENTLY` because a run is one transaction).

---

## 3. Notes about earlier release candidates

**Verdict for the section:** every note I checked is accurate at rc.25 / CLI rc.36. Each one tells a reader who used an older release candidate what changed, so it matters only to readers upgrading from that release candidate. A reader coming from Prisma ORM 7 at general availability needs none of them. Two notes state current behaviour through a release-candidate reference and need rewording, not deletion (marked **reword**).

Spot checks against the code: `CONTRACT.FIELD_HELPER_UNKNOWN`, `MIGRATION.OPERATION_OPTION_REMOVED`, `MIGRATION.TABLE_NAME_CASE_CHANGE…`, `RUNTIME.LC_MONETARY_NOT_C`, `PSL_DEPRECATED_SCALAR_NAME`, `PSL_UNSCOPED_INDEX_ON_STI_VARIANT`, `CONTRACT.TARGET_MISMATCH`, `ORM.ROW_IDENTITY_MISSING`, `PSL_RELATION_NULLABILITY_MISMATCH`, `plainJsonColumn` and `integerNumberColumn` all exist at rc.25. MongoDB `Int64` is a deprecated alias with no `type.*` helper (`3-targets/mongo/1-target/src/core/authoring.ts:105-114`). `@prisma/orm-postgres/migration` no longer exports `createExtension` or `dataTransform`. `--no-advance-ref` on `db migrate` first appears in rc.25. The commits behind the "since rc.24/rc.25" claims are first released in the tags the docs name (isolation levels and timeouts rc.24; nested transactions, nested update/delete, `onConflict: 'connect'`, MariaDB client and MySQL/MariaDB convenience types rc.25). In prisma-cli rc.36, `CLI.V7_COMMAND` exists, and `dev url`, `dev stop` and `emulator list` arrived in rc.24 (#355), as did plain data on a pipe (#353). The editor extension versions are right: 31.12.10, 31.12.13 and 31.12.15 are releases, and 31.13.0 is the latest.

Per location (inventory line → current line; "older RC only" means the note matters only to readers upgrading from that release candidate):

| Page | Current lines | Note | Accurate | Who it matters to |
| --- | --- | --- | --- | --- |
| `orm/coming-from-prisma-orm-7.mdx` | 207 | before rc.24, `migrate` commands failed with `CLI.COMMAND_MOVED` | yes | older RC only |
| | 416 | contract before rc.12 → `ORM.CAPABILITY_MISSING` with `onConflict` | yes | older RC only |
| | 438 (was 432) | `isolationLevel`/`timeout` since rc.24, nested transactions since rc.25 | yes, already updated | the "since" dates are history; the `maxWait` gap is current |
| `orm/contract-authoring/psl-syntax.mdx` | 263-265 (was 241-245) | field presets removed before rc.21 | yes | older RC only |
| | 541 (was 519) | MongoDB quoted members before rc.20 | yes | older RC only |
| | 738 (was 716) | `field(sort: Desc)` refused since rc.17 | yes | older RC only (the sentence's other content is current) |
| | 754-756 (was 732-736) | MongoDB index names, upgrading from before rc.23 | yes | older RC only |
| | 789 (was 767) | discriminator rule on every database since rc.20 | yes | the date is history; the rule is current |
| `orm/contract-authoring/typescript-schema-builder.mdx` | 146 | `type.Int64()` removed since rc.25 | yes (updated since the audit, which listed `type.Int64()`) | older RC only |
| | 158 | (audit listed it; no release-candidate note there now) | already removed | — |
| | 240-242 (was 238-242) | presets removed, upgrading from before rc.21 | yes | older RC only |
| | 273-280 (was 271-280) | upgrading from before rc.20, recipe at tag `v8.0.0-rc.20` | yes | older RC only |
| `orm/data-modeling/mongodb.mdx` | 73 (was 72) | `Date` before rc.24 | yes | older RC only |
| `orm/extensions/using-extensions.mdx` | 110-118 (was 108-118) | pgvector, PostGIS, citext before rc.22/rc.23 | yes | older RC only |
| | 270 (was 268) | Supabase extension contract changes in rc.12 and rc.20, re-sign | yes | first half (re-sign after any contract-changing update) is current; the rc.20 sentence is older RC only |
| `orm/migrations/how-migrations-work.mdx` | 62-73 | table names before rc.12, `add-model-map` script | yes | older RC only |
| | 127 | `ops.json` checks before rc.19 | yes | older RC only |
| | 142 | migrations planned before rc.20 | yes | older RC only |
| `orm/reference/migration-api.mdx` | 161 | sequence width before rc.19 | yes | older RC only |
| | 165 | `options` before rc.18 → `MIGRATION.OPERATION_OPTION_REMOVED` | yes | older RC only |
| | 171 | `defaultSql` before rc.15 | yes | older RC only |
| | 362 | `createExtension`/`dataTransform` before rc.24 | yes | older RC only |
| `orm/reference/orm-client.mdx` | 802 | lock capabilities, contract before rc.17 | yes | older RC only |
| | 1230 (was 1223) | `onConflict`, contract before rc.12 | yes | older RC only |
| | 2412 (was 2352) | `Models`, contract before rc.10 | yes | older RC only |
| `orm/reference/sql-query-builder.mdx` | 526 | lock methods, contract before rc.15 | yes | older RC only |
| `orm/reference/error-reference.mdx` | 433 (was 413), 721 (was 683), 1865 (was 1811), 2045 (was 1967) | error-code entries that mention earlier releases (`defaultSql`, contract validation, `OPERATION_OPTION_REMOVED`, `TABLE_NAME_CASE_CHANGED`) | yes; generated from ORM rc.25 | each code still exists, so the entries stay while the code does; change them in prisma/orm |
| `cli/contract-emit.mdx` | 37-60 | upgrades from before rc.12, rc.13, rc.15, rc.19, rc.22 | yes | older RC only |
| `cli/contract-infer.mdx` | 75 | contract inferred before rc.15 | yes | older RC only |
| `cli/db-sign.mdx` | 89, 119-125 | JSON shape before rc.15; storage hash after upgrading from before rc.19 | yes | older RC only |
| `cli/db-verify.mdx` | 61, 78, 104 | before rc.15, rc.20, rc.12 | yes | older RC only |
| `cli/migration-plan.mdx` | 116 (was 118), 125, 159 | before rc.20, rc.21, rc.19 | yes | older RC only |
| | 102 | "On MySQL and MongoDB, a changed stored name is handled as it was on every database before `8.0.0-rc.25`" | yes | **reword**: this is current behaviour on MySQL and MongoDB, described by reference to an old release. Write it directly: "On MySQL and MongoDB, a changed `@@map` is planned as dropping the table and creating an empty one, and asks for `--delete`." |
| `cli/configuration.mdx` | 32, 192, 281 | config before rc.12; indexes before rc.23; `formatter` since rc.24 | yes | older RC only |
| `cli/migration-new.mdx` | 39 | before rc.12 | yes | older RC only |
| `cli/global-flags.mdx` | 43 | pipe output before CLI rc.24 / ORM rc.20 | yes | older RC only |
| `cli/db-migrate.mdx` | 177, 179 (were 148, 150) | migrations planned before rc.20; MongoDB message before rc.20 | yes | older RC only |
| | 15, 32 | `db` ref advanced by default since rc.25; `--no-advance-ref` added in rc.25 | yes | older RC only (not in the inventory) |
| `cli/db-update.mdx` | 56, 106, 115, 159 (were 53, 75, 84, 128) | `accessWidening` before rc.20; namespace before rc.20; enums before rc.21; `warnings` before rc.24 | yes | older RC only |
| | 92 | same sentence as `migration-plan.mdx:102` | yes | **reword**, as above |
| | 134 (was 103) | MongoDB required field; no release-candidate reference now | already removed | — |
| `cli/db-schema.mdx` | 52 | `typeText` since rc.19 | yes | older RC only |
| `cli/dev.mdx` | 44 | `dev url`, `dev stop`, `--detach` since rc.24 | yes | older RC only |
| `cli/emulator.mdx` | 13 | `emulator list` since rc.24 | yes | older RC only |
| `cli/orm-init.mdx` | 66 | releases before rc.34 set `preserve` and `bundler` | yes | older RC only |
| `(index)/prisma-orm/local-database.mdx` | 117 | `dev url` since rc.24 | yes | older RC only |
| `composer/local-development.mdx` | 24 | `dev url`, `dev stop`, `--detach`, `emulator list` since rc.24 | yes | older RC only |
| `composer/getting-started.mdx` | 294 | `dev url` since rc.24, fallback for older versions | yes | older RC only |
| `orm/contract-authoring/editor-support.mdx` | 27, 49 (was 47-64) | extension versions 31.12.10 to 31.12.15 | yes | readers with an old extension; can shrink to "use 31.12.15 or later" at GA |

Notes the inventory did not list but that are the same kind (all accurate, all older RC only unless stated): `orm/contract-authoring/psl-syntax.mdx:168, 176` (`Money` and `lc_monetary` before rc.25; this one also tells rc.25 users how to repair rows written under another locale, so keep it while rc.25 data can exist), `:190` (`sql.String(n)` before rc.25), `:192`, `:803`; `orm/contract-authoring/typescript-schema-builder.mdx:53, 210`; `orm/data-modeling/mongodb.mdx:75`; `orm/extensions/using-extensions.mdx:72`; `orm/migrations/how-migrations-work.mdx:195`; `orm/reference/orm-client.mdx:1148, 1154, 1231, 1337, 1358, 1363, 1381`; `orm/reference/sql-query-builder.mdx:765, 972`; `cli/migration-plan.mdx:140`; `cli/db-update.mdx:130`; `cli/orm-init.mdx:171, 181`.
