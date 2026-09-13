Fact re-check complete. Slice: `wip/c21/ref/fc2/transactions-and-runtime.mdx` (771 lines before, 770 after).

## Claims checked

| Slice line | Claim | Source | Verdict |
|---|---|---|---|
| 9 | `contract emit` writes `contract.json` + `contract.d.ts`; `findMany` → `db.orm.public.User.where(...).all()` | `cli/src/commands/init/templates/code-templates.ts:318-345`; `test/integration/test/cli-journeys/init-journey.e2e.test.ts:166-186` | Confirmed |
| 11 | `db` is what `postgres(...)` / `mongo(...)` return; `runtime()` runs queries | `3-extensions/postgres/src/runtime/postgres.ts:155-384`, `mongo.ts:116-240` | Confirmed |
| 17 | "Transactions are PostgreSQL only" | `3-extensions/sqlite/src/runtime/sqlite.ts:83` has `transaction()` | **Corrected** → "Transactions are not available on MongoDB. To run one there, …" |
| 17 | MongoDB route: `mongoClient` option + `session.withTransaction(...)` | `mongo.ts:56,197-214`; `projects/sqlite-mongo-transactions/spec.md:20` | Confirmed |
| 29 | `contractJson` or `contract`, exactly one | `postgres.ts:92-109` (`contract?: never` / `contractJson?: never`) | Confirmed |
| 30 | `<Contract>` needed with `contractJson`, inferred with `contract`; `contract.d.ts` exports `Contract` | `postgres.ts:99-105,155-160`; init e2e test line 167 | Confirmed |
| 31 | Three ways (`url`, `pg`, `binding`); binding kinds `url` / `pgPool` / `pgClient`; exactly one, or pass to `connect()` | `postgres/src/runtime/binding.ts:11-31,67-127` | Confirmed |
| 32 | You own a `pg` pool; `poolOptions` only affects a pool built from `url` | `postgres.ts:128-146,194-220,374-379` | Confirmed (order "`db.close()` first, then `pool.end()`" is advice the source neither states nor contradicts) |
| 33 | pgvector: install, import `/runtime`, `extensions: [pgvector]` | `test/e2e/framework/test/transaction-orm.test.ts:5,35` | Confirmed |
| 34 | Middleware object with `name` + hooks; `query.sql`; eight hook names | `framework-components/src/execution/runtime-middleware.ts:172,200,235-240`; `2-sql/5-runtime/src/middleware/sql-middleware.ts:49,75,80,84,89,119,124,128`; `relational-core/src/sql-execution-plan.ts:24` | Confirmed |
| 35 | `verifyMarker` default `onFirstUse`, warns and runs anyway; `npx prisma db update` | `sql-runtime.ts:214-216,898-929`; `cli/src/control-api/operations/db-verify.ts:348` | Confirmed |
| 36 | `postgres()` does not connect; connects on first use | `postgres.ts:222-262` | Confirmed |
| 45-51 | Options table (`url`, `pg`, `binding`, `poolOptions` 20000/30000, `extensions`, `middleware`, `verifyMarker`) | `postgres.ts:76-90,140-142` | Confirmed |
| 59-62 | Client members `.orm`, `.sql`, `.raw`, `.enums`, `.nativeEnums`, `.contract` | `postgres.ts:56-74` | Confirmed (the client also has `.context` and `.stack`, which the page no longer lists) |
| 61 | `db.nativeEnums.public['AalLevel'].values` is `['aal1','aal2']` | `test/integration/test/authoring/parity/native-enum/expected.contract.json:96-146` — `AalLevel` is in namespace `auth`, values `aal1, aal2, aal3`; `contract/src/enum-accessor.ts:16-17` for `.values` | **Corrected** → "`db.nativeEnums.auth['AalLevel'].values` is `['aal1', 'aal2', 'aal3']`" |
| 73, 86 | `process.env.X!` | `code-templates.ts:331` (`process.env['DATABASE_URL']!`) | Confirmed |
| 76 | JSON import line, `resolveJsonModule` / `module: "preserve"` / `moduleResolution: "bundler"` | `cli/src/commands/init/templates/tsconfig.ts:23-27`; `code-templates.ts:327` | Confirmed |
| 76 | "needs Node.js 22.18 or newer" | not in the source | **Q** |
| 96 | "It has five calls" | `sql-runtime.ts:100-113` — `Runtime` also has `close()`, so six members | **Corrected** → "It has these calls:" |
| 97-101 | `query`, `execute` (`{ affectedRows }`), `connection()` + `release()`, `prepare(declaration, callback)`, `telemetry()` | `sql-runtime.ts:100-134`; `relational-core/src/runtime-scope.ts:23-26`; `relational-core/src/ast/driver-types.ts:24-26` | Confirmed |
| 102 | `connect({ url })` / `connect({ binding: { kind: 'url', url } })` | `postgres.ts:289-324`; `binding.ts:16-31` | Confirmed |
| 103 | Errors carry `code`; compare `error.code` | `framework-components/src/shared/runtime-error.ts:32-44` | Confirmed |
| 104 | A query connects, so a later `connect()` throws `DRIVER.ALREADY_CONNECTED`; a second `connect()` too | `postgres.ts:249-251,298-303` | Confirmed |
| 127 | PostgreSQL `runtime()` is synchronous, callable before connecting | `postgres.ts:66,326-328,222-262` | Confirmed |
| 141-142 | `close()` safe at any time; then `connect()` rejects and `runtime()` throws `DRIVER.NOT_CONNECTED` (`Postgres client is closed`) | `postgres.ts:223-229,290-296,374-376`; `postgres/test/postgres-close.test.ts:134-144` | Confirmed |
| 156 | `db.orm.public.User.where((u) => u.kind.eq('admin')).all()` | example schema in `orm-client.mdx` (`kind user_type`, values `admin`/`user`) | Confirmed |
| 162-167 | `Symbol.asyncDispose`, block-scoped disposal | `postgres.ts:381-383`; `postgres/test/postgres-close.test.ts:146-155` | Confirmed |
| 167 | `"esnext.disposable"` lib name | not in the source (a TypeScript fact) | **Q** |
| 190-194 | MongoDB contract options; four binding ways; kinds `url` / `mongoClient` with `dbName`; `dbName` separate; ownership; no connection on create | `3-extensions/mongo/src/runtime/binding.ts:5-41,82-151`; `mongo.ts:120-145,220-235` | Confirmed |
| 192 | "Use `uri` only when you must pass `dbName` separately" | `binding.ts:101-138` — `{ url, dbName }` is also allowed, which the same bullet says | **Corrected** → "`uri` takes the same kind of string, and always needs `dbName`." |
| 203-208 | MongoDB options table; `mode` ignored by Prisma ORM, passed to middleware | `mongo.ts:43-57,139-144`; `2-mongo-family/7-runtime/src/mongo-runtime.ts:120` (only fills the middleware context) | Confirmed |
| 214-218 | `MongoClient` members `.orm`, `.query`, `.raw`, `.enums`, `.contract`; `@@map("users")` | `mongo.ts:28-41`; `orm-client.mdx` MongoDB schema | Confirmed |
| 251-252 | MongoDB `connect()` returns `Promise<MongoRuntime>`; `DRIVER.ALREADY_CONNECTED` after a query or a second call; takes the same options | `mongo.ts:147-169,197-214` | Confirmed |
| 266-267 | MongoDB `runtime()` returns a promise; `MongoRuntime` is `query`, `execute`, `close` only | `mongo.ts:216-218`; `mongo-runtime.ts:76-101` | Confirmed |
| 281-283 | `runtime.query(built)`; returns `AsyncIterableResult`; `runtime.execute(built)` returns `{ affectedRows }` for "a write that returns no rows" | `mongo-runtime.ts:37-48,270-307` — `execute` only supports `updateOne`, `updateMany`, `deleteOne`, `deleteMany`; anything else throws `RUNTIME.MONGO_STATISTICS_UNSUPPORTED` | **Corrected** → "For an update or delete command, use `runtime.execute(built)` … Other commands throw an error whose `code` is `RUNTIME.MONGO_STATISTICS_UNSUPPORTED`." |
| 299 (old) | Example ran `execute(built)` on the pipeline built by `db.query.from('posts')` | same as above: an aggregate command has no statistics field | **Corrected** → line removed |
| 296 | `'posts'` is the collection key | `orm-client.mdx` MongoDB schema `@@map("posts")` | Confirmed |
| 308-309 | Always `db.close()`; `runtime.close()` leaves the client looking open; after `close()` everything rejects `DRIVER.NOT_CONNECTED`; a supplied `mongoClient` stays open | `mongo.ts:128,147-150,220-235`; `mongo-runtime.ts:309-311` | Confirmed from the code; no test covers `runtime.close()` on the client |
| 332 | MongoDB `await using` | `mongo.ts:237-239`; `mongo/test/mongo.test.ts:448` | Confirmed |
| 355 | `tx.orm`, `tx.sql`, `tx.query`, `tx.execute` → `{ affectedRows }`; same connection | `postgres.ts:341-372`; `sql-runtime.ts:139-141`; `driver-types.ts:24-26` | Confirmed |
| 356 | No options, no isolation level, no retries, no time limit; `idle_in_transaction_session_timeout` | `postgres.ts:67,341`; `sql-runtime.ts:960-1087` (no retry) | Confirmed, except the PostgreSQL setting name, which is not in the source → **Q** |
| 357 | `signal` per call limits a statement | `runtime-scope.ts:23-26`; `runtime-core.ts:107-147` | Confirmed |
| 358 | No nesting; `TransactionContext` from `@prisma/orm-postgres/family-runtime` with `query`/`execute`; derived `Tx` type | `sql-runtime.ts:139-141`; `2-sql/5-runtime/src/exports/index.ts:66-74`; `orm-postgres/package.json` `./family-runtime` | Confirmed (`TransactionContext` also has a read-only `invalidated` property, which the page does not mention) |
| 360-363 | Read-your-own-writes; `tx.enums` / `tx.nativeEnums` and `.values`; return value passes through; escaped result throws `RUNTIME.TRANSACTION_CLOSED` | `postgres.ts:365-368`; `sql-runtime.ts:960-1050`; `test/e2e/framework/test/transaction-orm.test.ts:101-115`, `transaction.test.ts:72-83` | Confirmed |
| 382-411 | Commit, rollback, read-your-own-writes examples | `transaction.test.ts:13-44`, `transaction-orm.test.ts:101-115` | Confirmed |
| 417-421 | `AbortSignal.timeout` passed as the second argument to `tx.execute` | `runtime-scope.ts:25` | Confirmed |
| 425-435 | Escaped-result warning and example | `sql-runtime.ts:966-996`; `transaction.test.ts:72-83` | Confirmed |
| 446 | `tx.orm.public.User.create({ email, displayName })` | example schema: `kind user_type` is required and has no default; `orm-client.mdx:976-980` passes `kind` | **Corrected** → added `kind: 'user'` |
| 460-462 | `withTransaction` and `Runtime` from `/family-runtime`; handle has `query`/`execute` only; commits on return, rolls back on throw | `exports/index.ts:62-74`; `sql-runtime.ts:960-1087`; `transaction-orm.test.ts:6` | Confirmed |
| 484-491 | Helper signature taking `sql: typeof db.sql` | `postgres.ts:57` (`sql` is `Db<TContract>`) | Confirmed (no test uses this exact helper shape) |
| 500-501 | `connection()`, `transaction()`, `commit()`, `rollback()`, `release()`, `destroy()` | `sql-runtime.ts:101,116-134` | Confirmed (`destroy(reason?)` takes an optional advisory argument the page no longer shows) |
| 518-552 | Manual-control examples, including the read on the connection before the transaction | `sql-runtime.ts:116-134`; `relational-core/src/runtime-scope.ts:23-26` | Confirmed (no integration test covers these exact snippets) |
| 558 | No MongoDB `db.transaction`; planned, not shipped | `mongo.ts:28-41`; `projects/sqlite-mongo-transactions/spec.md:20,128` | Confirmed |
| 562 | "Prepared statements are PostgreSQL only" | `sqlite/src/runtime/sqlite.ts:79,285` has `prepare` | **Corrected** → "Prepared statements are not available on MongoDB." |
| 570-573 | Declaration maps names to type ids; `columns.<column>.codecId`; single-argument callback returning the built query; `where((f, fns) => …)`; `RUNTIME.PREPARE_UNUSED_PARAM` with `details.unused`, at prepare time | `prepared/types.ts:20-51`; `sql-builder/src/types/table-proxy.ts:115-116`, `types/raw-query.ts:29-37`, `expression.ts:38-41`; `sql-runtime.ts:560-574`; `runtime-error.ts:37-41` | Confirmed |
| 595-610 | Prepare examples, including the unused-parameter rejection | `sql-runtime.ts:567-573`; `test/integration/test/raw-prepared.integration.test.ts:133-171` | Confirmed |
| 619-620 | `db.prepare` injects `sql` as the first callback argument; `prepare()` connects, so `db.connect()` throws `DRIVER.ALREADY_CONNECTED` | `postgres.ts:330-339,249-251,298-303` | Confirmed |
| 653-664 | `PreparedExecution` from `.affectedCount()`, `execute(target, params)` → `{ affectedRows }`; raw parameterised example; `target` required; no `close()` | `prepared/types.ts:53-106`; `raw-prepared.integration.test.ts:133-145` | Confirmed |
| 702 | Which calls take `RuntimeExecuteOptions`, and a prepared statement takes it third | `runtime-scope.ts:23-26`; `prepared/types.ts:60-83` | Confirmed |
| 710-712 | `signal`; pre-aborted rejects before any row with `RUNTIME.ABORTED`; `cause` is the signal reason; `details.phase`; an abort inside a transaction rolls it back | `runtime-core.ts:107-147`; `race-against-abort.ts:12-19`; `runtime-error.ts:22-47`; `sql-runtime.ts:1036-1060` | Confirmed |
| 740-744 | Telemetry: PostgreSQL only, `null` before the first query, `{ lane, target, fingerprint, outcome, durationMs? }`, most recent query only, `lane` values, fingerprint from the SQL text, `outcome` values, `durationMs` always set | `sql-runtime.ts:883-885,932-944,423,545,746`; `runtime-spi.ts:44`; `sql-orm-client/src/query-plan-meta.ts:51`; `relational-core/src/plan.ts:38-45` | Confirmed |
| 767-771 | `AsyncIterableResult` from `all()`, `createAll()`, `query()`; `await` vs `for await`; buffering on PostgreSQL; `.toArray()` equals `await`; re-await safe; mixing or a second loop throws `RUNTIME.ITERATOR_CONSUMED`; MongoDB shares the rules | `framework-components/src/execution/async-iterable-result.ts:3-86`; `sql-orm-client/src/collection.ts:1440-1452`; `3-targets/7-drivers/postgres/src/postgres-driver.ts:296-333`; `postgres.ts:245-247` | Confirmed |
| all links | `#executing-a-plan`, `#binding-a-bare-value-with-param`, `#asynciterableresult`, `#example-schema`, `/orm/middleware/how-middleware-works`, `#options-and-isolation-level`, `#transactions-on-mongodb` | the target pages in `apps/docs/content/docs/orm/` | Confirmed |

## Q list (unverifiable, page text left alone)

1. **"It needs Node.js 22.18 or newer"** (line 76). Searches: `grep -rn "22\.18\|22\.12\|>=22" --include='*.json' --include='*.md'`, `grep -rn -i "node 22|node.js 22"`, `grep -rn '"engines"' -A3`. The only engine requirement in the tree is `"node": ">=24"` (root `package.json:100`, `cli/package.json:103`), which is the repository's own build requirement, not the version an application needs for JSON import attributes.
2. **`"esnext.disposable"` in `lib`** (line 167). Searches: `grep -rn "esnext.disposable\|asyncDispose" --include='*.json' --include='*.ts'`. The source only shows `Symbol.asyncDispose` implementations and tests; no tsconfig in the tree sets that lib.
3. **`idle_in_transaction_session_timeout`** (line 356). Searches: `grep -rni "idle_in_transaction\|statement_timeout"` over the whole tree. No hit. It is a PostgreSQL server setting, outside this source.

## Extra item the page conventions asked for

The last bullet of `page-conventions.md` is about the generated error-reference page being out of scope. My slice only links to it and never quotes its wording, so there is nothing to change. The one code I added, `RUNTIME.MONGO_STATISTICS_UNSUPPORTED`, is present on that page (`error-reference.mdx:734`).

## One gap the operator should decide on

`RuntimeExecuteOptions` still has a second field, `scope` (`'runtime' | 'connection' | 'transaction'`), in `framework-components/src/execution/runtime-middleware.ts:335-338`, and `runtime-core.ts:117,141` reads it. A reader-review round deleted both the `scope` table row and the remark about it, so the Options table under `### RuntimeExecuteOptions` now lists only `signal`. Nothing on the page is false, but the table no longer lists every field of the type it documents. I left it alone because the brief says not to make the slice longer; restoring the row costs one line.