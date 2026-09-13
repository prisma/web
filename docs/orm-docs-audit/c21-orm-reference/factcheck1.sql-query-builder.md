Done. Report below.

## 1. Claims checked

| Line | Claim | Source that decides it | Verdict | Now says |
|---|---|---|---|---|
| 14 | SQL builder targets PostgreSQL and SQLite; MongoDB has none | `packages/3-targets/6-adapters/{postgres,sqlite}/src/core/adapter.ts`; no SQL builder under `2-mongo-family` | Confirmed | — |
| 19 | "every example is transcribed from an executable test suite that runs against a live PostgreSQL database" | `test/integration/test/sql-builder/setup.ts:41-95` seeds `users`/`posts`/`comments`/`profiles` with `int4` ids, not the page's `user`/`post`/`tag`/`post_tag` | **Corrected** | The test-suite claim is removed. Now: "All examples on this page run against the following schema." |
| 25-125 | Example schema | Matches `examples/prisma-8-demo/src/prisma/contract.prisma` except `Priority`, which is `pg/int4@1` with numeric values there. The page's text form matches the finished orm-client page's schema exactly, so the page is self-consistent | Confirmed (as the page's own schema) | — |
| 131 | Table accessors use "mapped table names (snake_case)" | `packages/2-sql/2-authoring/contract-psl/src/psl-attribute-parsing.ts:8` `lowerFirst`; used at `psl-field-resolution.ts:727` | **Corrected** | Default table name is the model name with a lowercase first letter unless `@@map`; column names are field names unless `@map`; `public` is the PostgreSQL schema |
| 135, 143 | Runtime comes from `await db.connect()` | `packages/3-extensions/postgres/src/runtime/postgres.ts:65-66, 289-328`. `connect()` exists but throws `DRIVER.ALREADY_CONNECTED` on a second call; `runtime()` is synchronous and is what the finished orm-client page uses | **Corrected** | "take a runtime from `db.runtime()` ... On PostgreSQL `db.runtime()` is synchronous, so there is nothing to await"; code uses `const runtime = db.runtime();` |
| 149-155 | `db.sql` is the result of `sql({ context, rawCodecInferer })`, importable from `@prisma/orm-postgres/builder/runtime` | `packages/2-sql/4-lanes/sql-builder/src/runtime/sql.ts:11-19`; `runtime/index.ts` exports `sql`; `@internal/sql-builder` exports `./runtime`; `orm-postgres/package.json` exports `./builder/runtime` | Confirmed (see note 3) | — |
| 154 | `inferCodec: () => 'pg/text'` | `packages/3-targets/3-targets/postgres/src/core/codec-ids.ts:8` (`pg/text@1`); `packages/3-targets/6-adapters/postgres/src/core/adapter.ts:129` | **Corrected** | `'pg/text@1'` |
| 187 | `f` is one property per column; joined columns under the table name; `fns` is the second argument | `runtime/field-proxy.ts` (whole file) | Confirmed | — |
| 195-201 | Three `select()` forms | `src/types/shared.ts` `WithSelect` | Confirmed | — |
| 199 | Unknown column name error | `runtime/builder-base.ts:310` throws `ORM.COLUMN_UNKNOWN`, message `Column "x" not found in scope` | **Corrected** | "throws an error whose `code` is `ORM.COLUMN_UNKNOWN`" |
| 255 | `where(predicate)` | `src/types/select-query.ts:38` | Confirmed | — |
| 288-296 | `innerJoin(other, on)`, other may be a table or an aliased subquery | `src/types/shared.ts` `WithJoin`; `runtime/joined-tables-impl.ts:168-190` | Confirmed | — |
| 313-317 | `outerLeftJoin`/`outerRightJoin`/`outerFullJoin` null semantics | `WithJoin` + `NullableScope` in `src/scope.ts:69-77` | Confirmed | — |
| 339 | "An adapter that does not has no `lateralJoin()` method" | `src/scope.ts:31` `GatedMethod` is type-level only; `runtime/builder-base.ts:280-293` throws `ORM.CAPABILITY_MISSING`; `test/e2e/framework/test/sqlite/sql-builder.test.ts:335-342` | **Corrected** | PostgreSQL only; on SQLite TypeScript types it `never`, and calling it anyway throws an error whose `code` is `ORM.CAPABILITY_MISSING`. Also added one sentence naming `outerLateralJoin()`, which the page had omitted |
| 340 | `lateral.from(otherTable)` then the usual SELECT chain | `src/types/shared.ts` `LateralBuilder`; `joined-tables-impl.ts:192-210` | Confirmed | — |
| 341 | `.as()` inside the callback throws `subquery.getRowFields is not a function` | `joined-tables-impl.ts:213` calls `subquery.getRowFields()`; `runtime/query-impl.ts:142-158` shows `.as()` returns only `getJoinOuterScope`/`buildAst` | Confirmed | — |
| 342 | Ambiguous names are dropped from the bare scope | `runtime/builder-base.ts:235-247`; `MergeScopes` in `src/scope.ts:56-61` | Confirmed | — |
| 388-390 | `orderBy` options `direction` and `nulls` | `src/expression.ts:46-49` declares both, but `runtime/builder-base.ts:357-390` reads only `options?.direction`. `OrderByItem` (`relational-core/src/ast/types.ts:1080-1098`) carries no null placement, and no renderer emits `NULLS FIRST`/`NULLS LAST` (grep over all of `packages` finds the strings nowhere) | **Corrected** | The `nulls` row now says TypeScript accepts it but nothing reads it, so no `NULLS FIRST`/`NULLS LAST` reaches the SQL and the database's own null ordering applies. The example keeps its heading and code, with a trailing comment saying `nulls` adds nothing to the SQL |
| 435, 466 | `distinct()` and `distinctOn()` return types | `src/types/shared.ts` `WithDistinct`; `src/types/select-query.ts:63-78` | Confirmed | — |
| 453 | `distinctOn()` availability wording | `select-query.ts:64` gates on `{ postgres: { distinctOn: true } }`; SQLite adapter has no `postgres` group (`adapters/sqlite/src/core/adapter.ts:76-85`); `sqlite/sql-builder.test.ts:344-352` | **Corrected** | PostgreSQL only; `DISTINCT ON` is a PostgreSQL extension to SQL; on SQLite it does not compile and throws `ORM.CAPABILITY_MISSING` if called |
| 454 | `distinctOn` ordering is not type-enforced | `runtime/builder-base.ts:418-446` does no order check | Confirmed | — |
| 491-492 | `limit(n)`/`offset(n)` take `number` | `src/types/shared.ts` `PaginationValue` = `number \| TraitExpression<['numeric']>` | **Corrected** | "`number`, or a numeric expression" |
| 516-528 | `.as(alias)` gives a join source, not a buildable query | `runtime/query-impl.ts:142-158` | Confirmed | — |
| 549-550, 693 | `GroupedQuery` has `having()`, aggregates, `orderBy`, `limit`, `offset`, `distinct`, `distinctOn` | `src/types/grouped-query.ts` | Confirmed | — |
| 584 | Aggregate decode note: `count`/integer `sum`/integer `avg` give `number`; out-of-range raises `RUNTIME.DECODE_FAILED`; `avg` is `float8` and unguarded; `countBigInt`/`sumBigInt`/`avgDecimal` | `postgres/src/core/aggregates.ts:5-6, 160-215`; `codec-helpers.ts:152-197` | Confirmed | — |
| 593-596 | `groupBy` forms | `src/types/select-query.ts:52-62`; `builder-base.ts:394-416` | Confirmed | — |
| 629 | `EXTRACT` result is a string because a raw expression is not converted | `builder-base.ts:317-334` passes `field.codec`, which a `.returns()` result does not carry (`relational-core/src/expression.ts:443-448`) | Confirmed (reworded only, to drop a banned term) | "Prisma ORM does not convert what a raw expression returns" |
| 634-638 | `having()` builds from aggregates and compares against a JavaScript literal, evaluated server-side | `grouped-query.ts:53-58`; `functions.ts:126-148` comment; `PgInt8NumberCodec.encode(value: number)` at `codecs.ts:707-716` | Confirmed | — |
| 721-722 | `insert()` always takes an array; multiple rows in one statement | `src/types/table-proxy.ts` `insert(rows: ReadonlyArray<...>)`; `adapters/postgres/src/core/sql-renderer.ts:913` | Confirmed | — |
| 728 | Insert values are sent as query parameters | `relational-core/src/expression.ts:336-360` | Confirmed | — |
| 763 | `returning()` availability | `src/types/mutation-query.ts:12` gates on `{ sql: { returning: true } }`; SQLite sets `returning: true` (`adapters/sqlite/src/core/adapter.ts:82`); `sqlite/sql-builder.test.ts:354-360` asserts it is **not** `never` | **Corrected** | "PostgreSQL and SQLite. Both support SQL's `RETURNING`." Plus the `never`/`ORM.CAPABILITY_MISSING` behaviour for an adapter without it |
| 796-799 | `update()` values-object and callback forms; `where()` on update/delete; no `where()` on insert | `src/types/table-proxy.ts`; `src/types/mutation-query.ts` | Confirmed | — |
| 841 | `delete()` returns a `DeleteQuery` | `src/types/table-proxy.ts` | Confirmed | — |
| 863-872 | `param(value, { codecId })` returns a `ParamRef`, imported from `@prisma/orm-postgres/relational-core/expression` | `relational-core/src/expression.ts:132-134`; `src/exports/expression.ts`; `orm-postgres/package.json` exports `./relational-core/expression` | Confirmed | — |
| 865 | Comparison values are parameterized from the neighbouring column | `runtime/functions.ts:46-96` (`resolveOperand` threads the column's type) | Confirmed | — |
| 866, 975 | No `build({ params })`; `build()` takes zero arguments everywhere | `src/types/shared.ts` `WithBuild`; `mutation-query.ts` `build()` | Confirmed | — |
| 906-910 | Built-in function list: `eq ne gt gte lt lte`, `in notIn`, `and or`, `exists notExists`, `raw` | `runtime/functions.ts:203-228` `createBuiltinFunctions` — exactly these thirteen | Confirmed | — |
| 912 | Aggregates come from the contract's aggregate map; PostgreSQL contributes eight | `postgres/src/core/aggregates.ts:157-227`; `runtime/sql.ts:21-30` | Confirmed | — |
| 916-923 | Per-aggregate return types | Same file | **Corrected** (two rows) | `sum(field)`: "`number` over an integer column; over any other column, the type PostgreSQL's own `sum` produces for it" (the old wording missed `time`/`interval` → `interval`). `min`/`max`: added "a `varchar` column widens to `text`" (`aggregates.ts:137-152`) |
| 925 | `ilike` from the Postgres adapter for textual columns; `cosineDistance` from pgvector | `adapters/postgres/src/core/descriptor-meta.ts:153-169`; `extensions/pgvector/src/core/descriptor-meta.ts:19` | Confirmed | — |
| 927-929 | No `fns.coalesce` or `fns.cast` | `runtime/functions.ts:203-228` | Confirmed | — |
| 933 | `fns.raw` parameterizes each interpolation; bare values get a type from their JavaScript type; `.returns(codecId)` declares the result type | `relational-core/src/expression.ts:336-360, 420-448` | Confirmed | — |
| 944 | `.returns()` is a type annotation only, no SQL cast, no conversion on read | `expression.ts:443-448` returns `{ returnType: { codecId, nullable } }` with no codec instance; `builder-base.ts:317-334` | Confirmed | — |
| 985 | `runtime.query` returns an `AsyncIterableResult`; `runtime.execute` resolves to `{ affectedRows }` | `relational-core/src/runtime-scope.ts:23-26`; `ast/driver-types.ts:24-26`; `mutation.test.ts:109` asserts `{ affectedRows: 1 }` | Confirmed (the `db.connect()` aside was corrected, see line 135) | — |
| 998-1000 | `ResultType` import path; one row not an array | `orm-postgres/package.json` `./components/runtime`; matches the finished orm-client page | Confirmed | — |
| 1001 | Since rc.10 `ResultType` also works on ORM queries | `docs/releases/v8.0.0-rc.10.md:27` | Confirmed | — |
| 1017 | Streaming versus collecting | `runtime-scope.ts:24`; `docs/releases/v8.0.0-rc.10.md:47` | **Corrected** | Now says to loop the same result with `for await`, that a result is read once one way, and records the rc.10 change: a buffered query hands its pooled connection back before the rows are read; a cursor stream keeps its connection until it finishes |

## 2. Q (unverifiable)

- **Line 244** `// rows === [{ id: aliceId, upperEmail: 'ALICE@EXAMPLE.COM', emailLength: 17 }]` and the other result comments (lines 308, 330, 375, 444, 480, 664, 687-688, 708, 785, 818, 830, 854). Searched `test/integration/test/sql-builder/*.test.ts` for these values and for the page's table names (`grep -rn "post_tag\|displayName\|'hp'\|latestPost" test/integration/test/sql-builder`). Nothing matches: those tests use a different fixture. The comments are arithmetically consistent with the page's own schema and seed values, so I left them, but nothing in prisma/orm confirms them.
- **Line 687** `avgDecimal(f.amount) would give the exact '300.0000000000000000'`. The type is confirmed (numeric decodes to a string, `codecs.ts:896-906`), the exact digit count is not. Searched `grep -rn "avgDecimal" packages test` — no test asserts a scale for an `avg` over `int4`.
- **Line 444** `// distinct priorities: ['high', 'low', 'urgent']` depends on the page's own seed data, which does not exist in the source.

## 3. What page-conventions asked for

- **`db.sql` keyed by table name, said once where `db.sql` first appears**: done at line 131, and corrected from "snake_case" to "the model name with a lowercase first letter unless `@@map`".
- **`db.runtime()` stated where it first appears**: done at line 135.
- **`sql({ context, rawCodecInferer })` paragraph (lines 149-157)**: every name is real and every one is publicly exported. `sql` and `SqlOptions` come from `@internal/sql-builder/runtime`, which the public `@prisma/orm-postgres` package republishes at `./builder/runtime`; `context` is `db.context` on the client (`PostgresClient.context`, `postgres.ts:61`); `RawCodecInferer` is `{ inferCodec(value): string }`. So nothing here is private API. It is still a low-level assembly path that no test or example in prisma/orm uses outside the test harness itself, and the paragraph is the densest on the page. **Recommendation for the reader round: cut lines 149-157 down to one sentence, or drop them.** I left them in place because the facts hold.
- **Banned terms**: `check-plain.sh` reports clean. The only remaining hits for the extra list are the pinned anchor `[#the-dbsql-facet]` (kept, as required) and `plan` as a variable name inside code blocks (prose says "the built query").
- **Headings and anchors**: none renamed, renumbered, or reordered. No new sections.

## 4. Line count

Before: 1,017. After: 1,017.