Fact check complete. The page is 356 lines before and after.

## Claims checked

| Line | Claim | Deciding source | Verdict |
|---|---|---|---|
| 11 | Two escape hatches: `fns.raw`, `db.raw.sql`, `db.raw.collection(...)`, `db.query.rawCommand(...)` | `sql-builder/src/runtime/functions.ts:227`; `sql-builder/src/types/raw-query.ts:164`; `mongo-raw.ts:6`; `query-builder/src/query.ts:30` | Confirmed |
| 14 | Only a whole `db.raw.sql` statement converts results; `.returnsRow` converts; `fns.raw`'s `.returns()` is TypeScript only | `2-sql/5-runtime/src/codecs/decoding.ts:77-100` (row spec supplies codecs) vs `sql-builder/src/runtime/builder-base.ts:332` (projection codec comes from `returnType.codec`, which a raw expression has not got) | Confirmed |
| 14 | MongoDB raw results are native BSON; write methods return driver result objects | `mongo-runtime.ts:251` (no `resultShape`, row passes through); `mongo-driver.ts:118-198` | Confirmed |
| 21 | `fns.raw` usable in `select()`, `where()`, `orderBy()`, `update()` | `builder-base.ts:325,342,387,416`; `mutation-impl.ts:330` | Confirmed |
| 23 | `.returnsRow(spec).build()` → `runtime.query`; `.affectedCount().build()` → `runtime.execute` | `relational-core/src/expression.ts:460-484` | Confirmed |
| 25 | `db.sql.public` keyed by table name | conventions requirement | **Corrected**: added "which is keyed by table name (the model name with a lowercase first letter unless the model sets `@@map`)" |
| 28-33 | `postgres<Contract>({ contractJson, url })`, `await db.connect()` | `3-extensions/postgres/src/runtime/postgres.ts:65,102,155` | Confirmed |
| 38-50 | `fns.raw` tagged template, `.returns(codecId)` compile-time only | `expression.ts:430-449`; integration test `test/integration/test/sql-builder/raw-sql.integration.test.ts:169` | Confirmed |
| 54 | A `.returns('pg/bool@1')` fragment satisfies `where()` alone | `sql-builder/src/expression.ts:12,38-41` (`BooleanCodecType`) | Confirmed |
| 67 | Interpolated `Expression` splices its AST, stays parameterized | `expression.ts:336-361` (`resolveInterpolation` → `value.buildAst()`) | Confirmed |
| 84 | Bare values work; `number`→`pg/int4@1`/`pg/int8number@1`/`pg/float8@1`, `bigint`→`pg/int8@1`, `string`→`pg/text@1`, `boolean`→`pg/bool@1`, `Uint8Array`→`pg/bytea@1` | `3-targets/6-adapters/postgres/src/core/adapter.ts:100-140`; integration `raw-query.integration.test.ts:118` uses bare `${1}` | Confirmed — **bare-scalar interpolation is not broken in rc.10**, so the earlier audit finding no longer holds and the page's current text is right |
| 84/87 | `param(value, { codecId })` from `@prisma/orm-postgres/relational-core/expression` | `relational-core/src/expression.ts:132`; `exports/expression.ts`; `@prisma/orm-postgres/package.json:127` | Confirmed |
| 100 | Object form of `.returns()` declares nullable | `expression.ts:434-449` | Confirmed |
| 118 | `db.raw` has one key, `sql` | `sql-builder/src/types/raw-query.ts:164` | Confirmed |
| 123 | `pg/timestamptz-temporal@1` is a real type id | codec ids in `3-targets/6-adapters/postgres/src` | Confirmed |
| 131-153 | `.returnsRow(spec)` entries: contract column or explicit type id; `user.columns.id` exists; `pg/int8@1` decodes to `bigint` | `types/raw-query.ts:29-63,115`; `table-proxy-impl.ts:95`; `raw-query.integration.test.ts:195` (`invitee_count: 2n`) | Confirmed |
| 156-168 | `.affectedCount()` takes no spec; `runtime.execute` returns `affectedRows` | `expression.ts:481`; `raw-query.integration.test.ts:140-148` | Confirmed |
| 162 | `SET "viewCount" = "viewCount" + 1` | The named example schema (sql-query-builder page) has no `viewCount` column on `Post` | **Corrected**: now `SET priority = ${'urgent'}` (`priority` is a real column of the example `Post` model, and the enum's storage type is `pg/text@1`, which a bare string binds to) |
| 171-196 | Row-returning raw queries compose into CTEs; `.returns.X` inherits a declaration | `expression.ts:378-386`; `raw-query.integration.test.ts:151-200` | Confirmed |
| 198 | `.affectedCount()` result cannot be interpolated | `expression.ts:304` (`RawAffectedCountQuery` has only `build()`); `RawSqlInterpolation` at `:334` | Confirmed |
| 202-208 | Accepted interpolations; `Date` throws `RUNTIME.RAW_SQL_UNSUPPORTED_INTERPOLATION` synchronously; TypeScript rejects it first | `ast/types.ts:44` (`RawSqlLiteral`); `expression.ts:356-360`; thrown from `templateParts` at tag-call time | Confirmed |
| 205 | Error message text | `expression.ts:358-359` and `adapter.ts:135-138`, identical strings | Confirmed |
| 212 | `db.raw.collection(rootName)`, nine methods, root name is the contract root | `raw-collection.ts:20-40`; `mongo-raw.ts:16-35` | Confirmed |
| 214 | `.build()` then `(await db.runtime()).query(plan)` | `raw-collection.ts:46-50`; `3-extensions/mongo/src/runtime/mongo.ts:33,38` | **Corrected**: added that `db.runtime()` returns a promise on MongoDB and is synchronous on PostgreSQL (conventions ask for this where it first appears) |
| 226-238 | `aggregate<Row>(pipeline)` | `raw-collection.ts:21,53` | Confirmed |
| 240-263 | `insertOne` → `{ insertedId }`; `insertMany` → `{ insertedCount, insertedIds }`, ids reshaped from the driver's index-keyed map | `mongo-driver.ts:118-145` (`Object.values(result.insertedIds)`) | Confirmed |
| 267 | `updateOne`/`updateMany` argument shapes and `{ matchedCount, modifiedCount, upsertedCount, upsertedId }` | `raw-collection.ts:65-71`; `mongo-driver.ts:124-158` | Confirmed |
| 293-305 | `deleteOne`/`deleteMany` → `{ deletedCount }` | `mongo-driver.ts:160-173` | Confirmed |
| 309 | `findOneAndUpdate` third argument `{ upsert }` | `raw-collection.ts:81-89` | Confirmed |
| 313 | `sort` and `returnDocument` "silently dropped, not a type or runtime error" | `raw-collection.ts:33-37` — the options type is `{ upsert?: boolean }`, so TypeScript's excess-property check rejects an options literal naming either key | **Corrected**: now says TypeScript rejects an options literal that names either key, and an untyped value is dropped without a run-time error; also names the direct route (`new RawFindOneAndUpdateCommand(...)` through `db.query.rawCommand(...)`), which the exports confirm |
| 314 | `returnDocument` never forwarded, driver default `'before'` applies | `mongo-driver.ts:176-186` (option omitted when undefined); `raw-commands.ts:106-111` | Confirmed |
| 318 | First upsert call returns empty; driver "yields `null`" | `mongo-driver.ts:183-185` — the driver returns `null` and the generator yields nothing | **Corrected**: "the driver returns `null`, and the query yields no row" |
| 336 | `findOneAndDelete` yields the raw matched document, not a wrapper | `mongo-driver.ts:188-198` | Confirmed |
| 346-354 | `db.query.rawCommand(command)` returns a plan with no `.build()`; rows typed `unknown`; `RawAggregateCommand` from `@prisma/orm-mongo/query-ast/execution` | `query-builder/src/query.ts:30,44-59`; `query-ast/src/exports/execution.ts:41-51`; `@prisma/orm-mongo/package.json` exports | Confirmed |

## Q (unverifiable)

- Line 290 `// { matchedCount: 2, modifiedCount: 2, ... }` and line 304 `// { deletedCount: 2 }`. These counts depend on seed data that neither this page nor the pipeline builder page shows. Searches run: `grep -rn "findOneAndUpdate" --include='*.test.ts' .`, `grep -rn "rawCollection\|mongoRaw\|\.collection(" --include='*.ts' test/integration/ packages/2-mongo-family/5-query-builders/orm/test/`, and a read of `packages/2-mongo-family/5-query-builders/orm/test/mongo-raw.test.ts` (which only checks the built command, never runs it). No live-database test exercises `db.raw.collection(...)` writes.
- Line 47 `// rows === [{ id: aliceId, upperEmail: 'ALICE@EXAMPLE.COM' }]` and the other example-schema result comments. The live tests use a different fixture (`users`/`posts` with int4 ids, `test/integration/test/sql-builder/fixtures/contract.ts`), not the schema this page names.

## Notes for the operator

- **The page's "every example is transcribed from an executable test suite" sentence is weaker than it reads.** The PostgreSQL raw tests do run against a live database, but against the `users`/`posts`/`comments` fixture in `wip/prisma-src/test/integration/test/sql-builder/fixtures/contract.ts`, not the `user`/`post` schema this page borrows from the SQL query builder page. The MongoDB raw collection methods have no live-database test at all; only the built command shape is tested. Every MongoDB example on this page is derived from the code, not from a test run.
- **No test covers the upsert-counter behaviour** described at lines 316-332. The driver tests (`packages/3-mongo-target/3-mongo-driver/test/mongo-driver.test.ts:176-230`) only pass `returnDocument: 'after'` explicitly. The page's claim follows from `mongo-driver.ts:176-186`, where the option is omitted when undefined.
- **The word "plan" appears 31 times**, and `conventions.md` bans it in favour of "the built query". I left it alone because the brief said to keep the banned-term agent's wording and the check script passes clean. If you want it removed, that is a separate pass.
- The bare word "codec" survives once, at line 205, inside the verbatim error message from the source. It has to stay.