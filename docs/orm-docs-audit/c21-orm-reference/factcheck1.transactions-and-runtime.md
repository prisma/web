Fact check complete for `apps/docs/content/docs/orm/reference/transactions-and-runtime.mdx`, against `wip/prisma-src/` at 8.0.0-rc.10.

## 1. Claims checked

| Line | Claim | Source that decides it | Verdict | Text now |
|---|---|---|---|---|
| 9–13 | Intro: page scope; "every PostgreSQL example is transcribed from an executable test suite"; "MongoDB behavior is verified the same way" | No fixture in the tree uses a `Tag` model with a `label` field (`test/integration/test/sql-orm-client/fixtures/mn-psl/contract.prisma:26` has `Tag { id, name }`) | Corrected | Dropped both process claims. Intro now ends "Transactions are fully supported on PostgreSQL and not shipped on MongoDB." |
| 28 | `postgres()` binds "in one of two ways" (`url`, `pg`) | `packages/3-extensions/postgres/src/runtime/binding.ts:16-31, 67-82` | Corrected | "one of three ways": `url`, `pg`, or a `binding` object naming its kind. Pass exactly one. |
| 29 | Pool defaults `20000` / `30000`, "source-read from `postgres.ts`" | `.../runtime/postgres.ts:141-142` | Corrected | Defaults confirmed; "source-read" dropped. Added that `poolOptions` applies only to a pool the client creates from `url` (`postgres.ts:132-135`). |
| 31 | `postgres(options)` does not connect; "call `connect()` to acquire a runtime" | `postgres.ts:222-262` (`getRuntime()` connects lazily); `packages/3-extensions/postgres/test/postgres-close.test.ts:146-154` calls `db.runtime()` with no `connect()` | Corrected | "The client opens one on first use, so `connect()` is optional: call it to open the connection up front and fail early." |
| 35–42 | `postgres` options table | `postgres.ts:76-109` | Corrected | Added `verifyMarker` (`'onFirstUse'` or `false`, default `'onFirstUse'`; `packages/2-sql/5-runtime/src/runtime-spi.ts:26-43`). Reworded `poolOptions`. `binding` covered in the Remarks instead of a table row, to hold the line count. |
| 48 | `PostgresClient` exposes `.orm`, `.sql`, `.enums`, `connect`, `runtime`, `transaction`, `prepare`, `close` | `postgres.ts:56-74` | Corrected | Added `.raw`, `.nativeEnums`, `.contract`, `.context`. |
| 81 | `connect()` returns `Promise<Runtime>`; runtime runs queries, opens connections, prepares | `postgres.ts:289-324`; `packages/2-sql/5-runtime/src/sql-runtime.ts:100-113` | Corrected | Added `runtime.telemetry()` to the list, plus the optional binding argument (`postgres.ts:305-307`). |
| 82 | `connect()` after close rejects `DRIVER.NOT_CONNECTED` (`Postgres client is closed`) | `postgres.ts:291-295`; `postgres-close.test.ts:140-144` | Confirmed | — |
| new | `connect()` twice rejects `DRIVER.ALREADY_CONNECTED` | `postgres.ts:298-303` | Corrected (added) | Stated in `connect()` Remarks; the page previously only implied it from the MongoDB section. |
| 105 | PostgreSQL `runtime()` is synchronous | `postgres.ts:66, 326-328` | Confirmed | — |
| 128 | After `close()`, `connect()` rejects `DRIVER.NOT_CONNECTED` | `postgres.ts:223-229, 291-295`; `postgres-close.test.ts:134-144` | Corrected | Now also names `runtime()`, which throws the same code. |
| 129 | You close your own `pg` instance | `postgres.ts:199-207, 374-379` (only a `url` binding sets `ownedDispose`) | Confirmed | — |
| 150–156 | `Symbol.asyncDispose`, disposal at end of block, closed afterwards | `postgres.ts:381-383`; `postgres-close.test.ts:146-154` | Confirmed | Error-code wording normalised. |
| 156 | `await using` needs `@types/node` or a `lib` declaring the symbol | — | **Q** | See section 2. |
| 181 | `mongo()` binds "in one of three ways" | `packages/3-extensions/mongo/src/runtime/binding.ts:13-41, 82-95` | Corrected | "one of four ways", adding the `binding` object. |
| 182 | Client ownership, "source-read from `binding.ts` / `mongo-driver.ts`" | `.../runtime/mongo.ts:131-145, 220-235` | Corrected | Fact confirmed; "source-read" dropped. |
| 183 | `mongo()` does not connect; runtime built lazily | `mongo.ts:147-169` | Confirmed | — |
| 187–193 | `mongo` options table | `mongo.ts:43-57` | Corrected | Added `mode` (`'strict'` / `'permissive'`, default `'strict'`; `packages/2-mongo-family/7-runtime/src/mongo-runtime.ts:120`). `binding` covered in Remarks. |
| 199 | `MongoClient` exposes `.orm`, `.query`, `.raw`, `.contract`, `.enums`, `.context`, `connect`, `runtime`, `close` | `mongo.ts:28-41` | Confirmed | — |
| 233 | Second `connect()` rejects `DRIVER.ALREADY_CONNECTED`; first connection can be implicit | `mongo.ts:197-214`; `packages/3-extensions/mongo/test/mongo.test.ts:229-243` | Confirmed | Error wording normalised; added that `connect()` accepts a binding (`mongo.test.ts:236-243`). |
| 234 | After close, `connect()` rejects `DRIVER.NOT_CONNECTED` (`Mongo client is closed`) | `mongo.ts:198-199`; `mongo.test.ts:414-422` | Confirmed | — |
| 257 | MongoDB `runtime()` returns a promise | `mongo.ts:38, 216-218` | Confirmed | The duplicate `:::note` was folded into the bullet (same facts, two fewer lines). |
| 263 | `MongoRuntime` has `query`, `execute`, `close` only | `packages/2-mongo-family/7-runtime/src/mongo-runtime.ts:76-101` | Confirmed | — |
| 285–301 | `(await db.runtime()).query(...)`; client has no `execute()`; `db.query.from('posts').build()` | `mongo.ts:28-41`; `packages/2-mongo-family/5-query-builders/query-builder/src/query.ts:27-29`; `.../state-classes.ts:99-108` | Confirmed | Example variable renamed `plan` → `built` per the conventions. |
| 311 | After close, `db.runtime()` and ORM access reject `DRIVER.NOT_CONNECTED` | `mongo.ts:147-150, 171-182`; `mongo.test.ts:405-412` | Confirmed | Wording normalised ("rejects", not "throws"). |
| 360 | `tx` offers `orm`, `sql`, `query`, `execute`, `enums`; parenthetical about what the test suite verifies | `postgres.ts:48-54, 341-372`; `packages/2-sql/5-runtime/src/sql-runtime.ts:139-141` | Corrected | Parenthetical removed; `tx.nativeEnums` added. `tx.raw` does **not** exist, and the page never claimed it. |
| new | No `isolationLevel` / `timeout` / `maxWait`; no nested transactions | `test/integration/test/ports/prisma/functional/interactive-transactions/interactive-transactions.test.ts:13-16` and its disposition list | Corrected (added) | One bullet added; the page had no such statement. |
| 362 | `tx.sql` keyed like `db.sql` | `postgres.ts:344-347` | Confirmed | — |
| 363–364 | Reads see own uncommitted writes; return value passes through | `sql-runtime.ts:961-1078` | Confirmed | — |
| 365, 424 | Escaped `AsyncIterableResult` rejects `RUNTIME.TRANSACTION_CLOSED` before any row | `sql-runtime.ts:968-982, 989-996, 948-953` | Confirmed | Error wording normalised. |
| 383–421 | Commit / rollback-on-throw / read-your-writes / `tx.execute` examples | `interactive-transactions.test.ts` ("basic", "rollback throw", "rollback query") | Confirmed | API shapes all exist; the `Tag { label }` model is the page's own example schema, not a repo fixture. |
| 437–451 | Prisma ORM 7 `$transaction([...])` becomes a callback | `interactive-transactions.test.ts:9-12` | Confirmed | — |
| 459 | `withTransaction` imported from `@prisma/orm-postgres/family-runtime` | `packages/9-public/@prisma/orm-postgres/package.json:113`; `.../test/facade-tarball.test.ts:188` | Confirmed | — |
| 460–461 | `withTransaction(runtime, cb)`; `tx` has `query` and `execute` only; commits on return, rolls back on throw | `sql-runtime.ts:961-1078` | Confirmed | — |
| 511 | `runtime.connection()` / `connection.transaction()` / `commit()` / `rollback()` / `release()` | `sql-runtime.ts:100-133` | Confirmed | — |
| 513 | `destroy(reason)` "source-read from `postgres-driver.ts`"; evicts one connection; runtime opens a replacement | `packages/3-targets/7-drivers/postgres/src/postgres-driver.ts:545-570`; `sql-runtime.ts:114-127` | Corrected | "source-read" dropped; added that `reason` is optional and advisory. |
| 523 | `destroy(reason)` type `Error`, required | `sql-runtime.ts:126` (`destroy(reason?: unknown)`) | Corrected | Now "`Error`, optional". |
| 562 | MongoDB has no `db.transaction`; runtime has no `connection()`/`prepare()`/`telemetry()`; "probing returns `undefined`, calling throws `TypeError`" | `mongo.ts:28-41`; `mongo-runtime.ts:76-101` | Corrected | Fact kept; the probe sentence replaced with "it has `query`, `execute`, and `close` and nothing else", per page-conventions. |
| 567 | Planned MongoDB transactions: `db.transaction(fn)` with `tx.orm` and `tx.query`, driver session, replica set required, must not degrade silently | `projects/sqlite-mongo-transactions/spec.md:113-131` (present in the rc.10 tree) | Confirmed | Banned phrase "source-read from an internal design document" was already gone; trimmed the trailing note about the page itself. |
| 579 | Declaration maps parameter name to a type id | `packages/2-sql/5-runtime/src/prepared/types.ts:20-30` | Confirmed | — |
| 580 | `runtime.prepare` callback takes one argument | `sql-runtime.ts:549-552`; `prepared/types.ts:51` | Confirmed | — |
| 581 | Unused declared parameter rejected at prepare time, `details.unused` | `sql-runtime.ts:568-573`; `packages/2-sql/5-runtime/test/prepared.test.ts:193-205` | Confirmed | Error wording normalised. |
| 634 | `db.prepare` callback takes `(sql, params)` | `postgres.ts:330-339` | Confirmed | — |
| 635 | `prepare()` starts the connection, so a later `db.connect()` fails `DRIVER.ALREADY_CONNECTED` | `postgres.ts:249-250, 298-303` | Confirmed | Wording normalised. |
| 672 | "A query ending with `.affectedCount()` prepares into a `PreparedExecution`" | `sql-runtime.ts:602-605` (needs `ast.kind === 'raw-query'`); `packages/2-sql/4-lanes/sql-builder/src/types/raw-query.ts:142` | Corrected | Now "A **raw** query ending with `.affectedCount()`". |
| 673–674 | `target` can be runtime, connection, or transaction; one statement runs against any | `prepared/types.ts:53-65`; `sql-runtime.ts:766-880, 986-1028` | Confirmed | — |
| 716 | `RuntimeExecuteOptions` is the second argument to every `query`/`execute` | `packages/1-framework/1-core/framework-components/src/execution/runtime-middleware.ts:352-359` | Confirmed | — |
| 724 | Pre-aborted signal rejects `RUNTIME.ABORTED`, `details.phase` `'stream'` | `.../execution/runtime-core.ts:118-148`; `.../execution/runtime-error.ts:36-46` | Confirmed | Added that `cause` is the signal's reason verbatim (`runtime-error.ts:41-46`), which the page did not state. |
| 725 | "Aborting mid-stream is not separately verified in the validation harness" | `runtime-core.ts:123, 148`; `runtime-error.ts:7-21` | Corrected | Replaced with the fact: the signal is checked between rows, and a mid-stream abort ends the stream with `RUNTIME.ABORTED` and a phase of `'stream'`, `'encode'`, or `'decode'`. |
| 726 | "`scope` selects the execution scope for the query" | `runtime-middleware.ts:60-81`; `sql-runtime.ts:428-441` | **Corrected (real error)** | `scope` is only the label middleware reads. The runtime sets it per scope; setting it yourself changes the label, not where the query runs. The options-table row was corrected too. |
| 755 | MongoDB runtime has no `telemetry()` | `mongo-runtime.ts:76-101` | Confirmed | Probe sentence removed. |
| 756 | `telemetry()` is `null` before any query | `sql-runtime.ts:217` | Confirmed | — |
| 757 | Shape `{ lane, target: 'postgres', fingerprint, outcome: 'success', durationMs? }` | `runtime-spi.ts:45-52`; `sql-runtime.ts:932-944` | Corrected | `outcome` is `'success'` or `'runtime-error'`; the shape line no longer pins it to `'success'`. |
| 780 | `AsyncIterableResult`: one consumption per mode; re-`await` safe; mode switch throws `RUNTIME.ITERATOR_CONSUMED` | `.../execution/async-iterable-result.ts:13-61` | Confirmed | Wording normalised. |
| new | rc.10: buffered PostgreSQL queries release the pooled connection before rows are read | `docs/releases/v8.0.0-rc.10.md` (Fixes, #30259); `postgres-driver.ts:296-333, 449-473`; `postgres.ts:245-247` | Corrected (added) | Two sentences added to the `AsyncIterableResult` section. I wrote it as "a query run through the client", because `postgres()` builds its driver with `cursor: { disabled: true }`, so every client query takes the buffered path; I did not claim cursor-stream behaviour the client cannot reach. |

## 2. Q list (unverifiable)

**`await using` requires `@types/node` (which augments `SymbolConstructor` with `asyncDispose`) or a `lib` that declares the symbol.** This is a TypeScript toolchain fact, not a Prisma ORM one, and nothing in the tree states it. Left as written.
Searches run: `grep -rn "asyncDispose" packages --include='*.ts'` (only the two client implementations and their tests); `grep -rn "await using" --include='*.ts' packages test`; `grep -rn "esnext.disposable\|ESNext.Disposable" -ri .`; checked `packages/9-public/@prisma/orm-postgres/package.json` (it does depend on `@types/node`, but nothing says `await using` requires it).

## 3. Page-conventions last bullet

The last bullet says the error-reference page is generated upstream and out of scope. My slice does not link to or restate the error-reference page, so nothing applied.

## 4. Line count

Before: 782. After: 782.

Notes for the operator:
- The example schema on this page (`Tag` with a `label` column) does not match any fixture in the rc.10 tree. The API shapes in every example are confirmed, but the claim that the examples were transcribed from a live test suite is not supportable from this source, so I removed it rather than restating it.
- The one substantive behaviour error found was the `scope` option, which the page described as choosing where a query runs. It does not.