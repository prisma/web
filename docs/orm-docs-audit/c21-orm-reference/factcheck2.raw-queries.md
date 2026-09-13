Fact re-check complete. Both slices are the same length as before (raw-queries 354 lines, index 41 lines). Five corrections, all on the raw-queries page; the index page needed none.

## 1. Claims checked

### `index.mdx`

| Line | Claim | Source | Verdict |
| --- | --- | --- | --- |
| 11 | ORM client at `db.orm`, works on PostgreSQL and MongoDB | `packages/3-extensions/postgres/src/runtime/postgres.ts:51-61`, `packages/3-extensions/mongo/src/runtime/mongo.ts:30-40` | Confirmed |
| 12 | SQL query builder at `db.sql`; not on the MongoDB client | same two files (no `sql` on `MongoClient`) | Confirmed |
| 13 | Pipeline builder at `db.query`, MongoDB only | `mongo.ts:31`; no `query` on `PostgresClient` | Confirmed |
| 17 | `.build()` then `runtime.query(...)`, or `runtime.execute(...)` for a write with no rows | `packages/2-sql/5-runtime/src/sql-runtime.ts:99-113`, `packages/2-mongo-family/7-runtime/src/mongo-runtime.ts:37-47,99` | Confirmed |
| 20, 26 | `const runtime = db.runtime();` on PostgreSQL, `await db.runtime()` on MongoDB | `postgres.ts:66` (`runtime(): Runtime`), `mongo.ts:38` (`runtime(): Promise<MongoRuntime>`) | Confirmed |
| 21 | `db.orm.public.User.where((u) => u.kind.eq('admin')).all()` | `packages/3-extensions/sql-orm-client/src/collection.ts:319-325`; `test/integration/test/sql-orm-client/mn-include.test.ts:257` | Confirmed |
| 22 | `db.sql.public.user.select('id','email').where((f, fns) => fns.eq(f.kind,'admin')).build()` | `packages/2-sql/4-lanes/sql-builder/src/types/select-query.ts:40`, `src/expression.ts:38-41` | Confirmed |
| 22 | `'admin'` is the stored value of the `user_type` enum | example schema in `sql-query-builder.mdx:17-40` (member with no `=`) | Confirmed |
| 26 | `.all()` replaced `findMany` | conventions.md; `collection.ts` doc comments | Confirmed |
| 28 | `User` is the model name, `user` the table name | `@@map("user")` in the shared example schema | Confirmed |
| 30 | Two things named `query` | `packages/2-mongo-family/5-query-builders/query-builder/src/query.ts:30`; `sql-runtime.ts` | Confirmed |
| 12 | SQL query builder "is PostgreSQL only" | `@prisma/orm-sqlite` exists, so the builder also runs on SQLite; page-conventions.md sanctions this wording for the docs' PostgreSQL/MongoDB scope | Left as is, noted below |

### `raw-queries.mdx`

| Line | Claim | Source | Verdict |
| --- | --- | --- | --- |
| 11 | Two kinds: `fns.raw` / `db.raw.sql`, and `db.raw.collection(...)` / `db.query.rawCommand(...)` | `sql-builder/src/expression.ts:116`, `types/raw-query.ts:165-172`, `orm/src/mongo-raw.ts`, `query-builder/src/query.ts:30` | Confirmed |
| 19 | `.returnsRow(spec).build()` → `runtime.query`; `.affectedCount().build()` → `runtime.execute` | `relational-core/src/expression.ts:304-316,460-482`; `test/integration/test/raw-query.integration.test.ts:117-149` | Confirmed |
| 22 | Type id names the JavaScript type; the property is `codecId` | `types/raw-query.ts:29-36`, `expression.ts:226` | Confirmed |
| 22 | `.returnsRow()` converts, `.returns()` does not | `2-sql/5-runtime/src/codecs/decoding.ts:66-100` (row-spec codecs) vs `sql-builder/src/runtime/builder-base.ts:331-332` (a raw fragment's `returnType` has no `codec`, so no codec is attached) | Confirmed. No test covers the fragment case directly; it follows from the code. |
| 22 | A `numeric` column arrives as a string | `postgres/src/core/codecs.ts:922` (wire form is a decimal string) | Confirmed |
| 22 | A date column gets no conversion by Prisma ORM | same mechanism as the fragment case above | Confirmed |
| 25 | `db.runtime()` direct on PostgreSQL, a promise on MongoDB | `postgres.ts:66`, `mongo.ts:38` | Confirmed |
| 38 | `select()` callback takes `f` and `fns`; `fns.raw` is a tagged template | `sql-builder/src/runtime/builder-base.ts:318-336`, `src/expression.ts:116` | Confirmed |
| 38 | Fragments go in `select()`, `where()`, `orderBy()`, `update()` | `types/select-query.ts:40-53`, `types/table-proxy.ts:132-137` | Confirmed |
| 50 | `.returns()` takes a type id string or `{ codecId, nullable }` | `types/raw-query.ts:126-134`, `expression.ts:430-441` | Confirmed |
| 50 | "`.returns(db.sql.public.user.columns.id)` is a type error; only `.returnsRow(spec)` takes columns" | `types/raw-query.ts:29-36,130-134`: a `ContractColumnRef` is `{ codecId, nullable, [symbol]? }`, which matches the object overload of `.returns()`; nothing excludes it | **Corrected** — both sentences removed. The paragraph now stops after the two accepted forms. |
| 54 | A `.returns('pg/bool@1')` fragment works straight in `where()` | `sql-builder/src/expression.ts:12,38-41` | Confirmed |
| 67 | "Interpolated values are sent as query parameters, so they are safe. Column and table names cannot be parameters, so they would be pasted into the SQL text. Never build an identifier from user input." | `relational-core/src/expression.ts:336-360`: an interpolated string is bound as a `ParamRef`; there is no way to interpolate an identifier at all, so nothing is pasted into the SQL | **Corrected** — now: "The expression itself goes into the fragment, not its rendered SQL, so it stays type-checked. An interpolated value is sent as a query parameter, never pasted into the SQL. A column or table name cannot be interpolated as a string, because a string becomes a parameter." The run-time-chosen-column advice is kept. |
| 84-92 | The bare-value type id table, all seven rows | `packages/3-targets/6-adapters/postgres/src/core/adapter.ts:120-141` | Confirmed |
| 94 | Type id shape `pg/` + name + `@1`, suffixes such as `int8number`, `timestamptz-temporal` | `postgres/src/core/codec-ids.ts` (full list) | Confirmed |
| 94 | `pg/uuid@1`, `pg/numeric@1`, `pg/jsonb@1` exist | `codec-ids.ts:21,37,39` | Confirmed |
| 94 | `db.sql.public.<table>.columns.<column>.codecId` | `sql-builder/test/types/raw-query.types.test-d.ts:113-117` | Confirmed |
| 94 | `contract.json` path `storage.namespaces.<schema>.entries.table.<table>.columns.<column>.codecId` | `test/integration/test/fixtures/contract.json` (read the tree directly) | Confirmed |
| 94 | `pg/timestamptz-temporal@1` takes a `Temporal.Instant`, not a `Date` | `postgres/src/core/temporal-codecs.ts:139-160`; `authoring.ts:735-741` | Confirmed |
| 94 | "`Temporal` is a global in Node.js 26 and later" | `skills/prisma-8/references/contract.md:118`: Node.js **26.8.2** and later ship `globalThis.Temporal`; 26.8.1 and earlier do not | **Corrected** — "Node.js 26.8.2 and later". |
| 94, 99 | Polyfill `import 'temporal-polyfill/full/global'` | `test/integration/test/setup-temporal.ts:1` | Confirmed |
| 97 | `param` from `@prisma/orm-postgres/relational-core/expression` | `packages/9-public/@prisma/orm-postgres/package.json:127`; `relational-core/src/expression.ts:132` | Confirmed |
| 110-115 | `{ codecId, nullable: true }` object form of `.returns()` | `expression.ts:433-441` | Confirmed |
| 123 | `db.raw` holds `sql` on PostgreSQL, `collection(...)` on MongoDB | `types/raw-query.ts:165-172`, `orm/src/mongo-raw.ts:8-11` | Confirmed |
| 136 | Spec entries are a contract column or a type id; object form for a nullable column | `types/raw-query.ts:50-62`; `test/types/raw-query.types.test-d.ts:20-75` | Confirmed |
| 136 | Missing spec column throws `RUNTIME.RAW_ROW_COLUMN_MISSING` | `2-sql/5-runtime/src/codecs/decoding.ts:316-323`; `raw-query.integration.test.ts:224-233` | Confirmed |
| 136 | `SqlQueryError` with `sqlState`, `23505` for a unique violation | `packages/2-sql/1-core/errors/src/errors.ts:7-56` | Confirmed |
| 150-154 | `postCount: 'pg/int8@1'` reads back as a `bigint` | `raw-query.types.test-d.ts:40-47`; `raw-query.integration.test.ts:167-200` | Confirmed |
| 142-148 | `FROM "user"` with no schema qualifier | the statement is sent verbatim; `public` is on the default `search_path` | Confirmed (a PostgreSQL fact, not a Prisma one) |
| 157 | `.affectedCount()` + `runtime.execute` → `{ affectedRows }` | `raw-query.integration.test.ts:140-149` | Confirmed |
| 157 | `tx.query` / `tx.execute` take the same built queries | `sql-runtime.ts:132-140` (`TransactionContext extends RuntimeQueryable`) | Confirmed |
| 170 | Nesting: interpolate before `.build()`, outer `.build()` only, `.returns` property, no nesting of `.affectedCount()`, `UPDATE ... RETURNING` nests | `expression.ts:296-316,460-482`; `raw-query.types.test-d.ts:89-108` | Confirmed |
| 172-173 | The three similar names | same as above | Confirmed |
| 195-199 | Accepted interpolations; a `Date` is a TypeScript error; the exact error code and message | `relational-core/src/ast/types.ts:44`; `expression.ts:329-360` (message matches character for character) | Confirmed |
| 205 | Nine methods, no raw `find()`, no `public` segment, no MongoDB transactions | `orm/src/raw-collection.ts:22-39`; `mongo-raw.ts`; `transactions-and-runtime.mdx:555` | Confirmed |
| 207 | Every method, writes included, runs through `runtime.query(...)` and yields a one-element array | `mongo-runtime.ts:37-47` — `execute()` supports only the typed `updateOne/updateMany/deleteOne/deleteMany` kinds and throws `RUNTIME.MONGO_STATISTICS_UNSUPPORTED` for the `raw*` kinds; `7-runtime/test/raw-commands.test.ts` runs every raw write through `query()` | Confirmed |
| 210 | "The write methods give you the `mongodb` package's own result objects" | `packages/3-mongo-target/3-mongo-driver/src/mongo-driver.ts:118-175` builds new objects from the driver's fields, and reshapes `insertedIds` from a map to an array | **Corrected** — "give you the counts and ids under the `mongodb` package's own key names". The listed shapes were already right. |
| 210 | `_id` is an `ObjectId`, compare with `String(...)` | `mongo-driver.ts:176-200` (documents pass through undecoded) | Confirmed |
| 228-233 | `aggregate<Row>()` sends the pipeline unchanged, so a real `ObjectId` matches | `mongo-adapter.ts:285` (`rawAggregate` passes `draft.pipeline` through) | Confirmed |
| 238-248 | `{ insertedId }`; `{ insertedCount, insertedIds }` as an array in input order | `mongo-driver.ts:118-146` | Confirmed |
| 253-270 | `updateOne/updateMany`, document or pipeline form, `{ matchedCount, modifiedCount, upsertedCount, upsertedId }` | `raw-collection.ts:26-29`; `mongo-driver.ts:126-158`; `7-runtime/test/raw-commands.test.ts:69-150` | Confirmed |
| 275-284 | `deleteOne/deleteMany` → `{ deletedCount }` | `mongo-driver.ts:160-174` | Confirmed |
| 293 | `findOneAndUpdate()` takes only `{ upsert }`; TypeScript rejects `sort` or `returnDocument` | `raw-collection.ts:33-37,81-90` | Confirmed |
| 295-302 | `RawFindOneAndUpdateCommand` and its six arguments, the optional ones, the pre-image default | `query-ast/src/raw-commands.ts:96-127` | Confirmed |
| 305 | Import from `@prisma/orm-mongo/query-ast/execution` | `packages/9-public/@prisma/orm-mongo/package.json:96`; `query-ast/src/exports/execution.ts:41-51` | Confirmed |
| 314-323 | Upsert counter: first call gives `[]`, then `count: 1`, then `count: 2`; a plain string `_id` is allowed | `mongo-driver.ts:176-187` (`if (result) yield`); `7-runtime/test/raw-commands.test.ts:113-127` uses `_id: 'pageViews'` | Confirmed. The test pins `returnDocument: 'after'`; the `[]`-then-`1`-then-`2` sequence follows from the code, and no test covers it. |
| 328-334 | `findOneAndDelete()` yields the raw document; `String(deleted._id) === aliceId` | `mongo-driver.ts:189-200`; `7-runtime/test/raw-commands.test.ts:186-196` | Confirmed |
| 339 | "runs a raw MongoDB **aggregate** command"; "takes no type parameter" | `query-builder/src/query.ts:30,44-59`: `rawCommand` accepts any `AnyMongoCommand` (the page's own example passes a `RawFindOneAndUpdateCommand`), and it does have a type parameter, just not one for the row | **Corrected** — "runs a raw MongoDB command"; "has no row type parameter". |
| 339 | Returns a built query, so no `.build()`; rows are `unknown` | `query.ts:44-59` | Confirmed |
| 349-353 | `rawCommand()` sends the command unchanged, so a real `ObjectId` matches | `mongo-adapter.ts:285` | Confirmed |
| Cross-page links | `#example-schema` (both), `#select`, `#fnsraw-and-returns`, `#dbtransactioncallback`, `#transactions-mongodb`, `#rawcommand` | the target headings in the four sibling pages | Confirmed |

## 2. Q list (unverifiable)

None. Every claim resolved for or against.

Two claims rest on code rather than a test, which I state above rather than marking Q: a raw fragment's `.returns()` not converting the value, and the first upsert-counter call returning `[]`.

## 3. Page-conventions' last bullet

The last bullet says the error-reference page is generated upstream and out of scope. Neither of my slices touches it. The two error codes they name, `RUNTIME.RAW_SQL_UNSUPPORTED_INTERPOLATION` and `RUNTIME.RAW_ROW_COLUMN_MISSING`, are written in the prescribed "throws an error whose `code` is `X`" form and match the source strings exactly.

## 4. Line counts

| File | Before | After |
| --- | --- | --- |
| `wip/c21/ref/fc2/raw-queries.mdx` | 354 | 354 |
| `wip/c21/ref/fc2/index.mdx` | 41 | 41 |

`check-plain.sh` is clean on both.

## 5. One item for the operator

The index page says the SQL query builder "is PostgreSQL only". The source tree ships `@prisma/orm-sqlite`, so the builder also runs on SQLite. I left the wording alone because `page-conventions.md` names "PostgreSQL only" as the approved phrasing, and the same sentence predates these rounds. If SQLite is meant to be visible in the docs, this sentence and its twin on the SQL query builder page both need a decision.