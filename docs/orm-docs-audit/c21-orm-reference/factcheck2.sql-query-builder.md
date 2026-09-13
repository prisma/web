Fact re-check done on `wip/c21/ref/fc2/sql-query-builder.mdx`. Five corrections, 1008 lines before and after.

## Claims checked

| Line | Claim | Deciding source | Verdict |
|---|---|---|---|
| 131 | `npm install @prisma/orm-postgres`; `contract emit` writes `contract.json` + `contract.d.ts`; files in `src/prisma/`; type import `./contract.d` | `packages/9-public/@prisma/orm-postgres/package.json:2`; `packages/1-framework/3-tooling/cli/test/control-api/contract-emit.test.ts:282-283`; `packages/3-extensions/postgres/README.md:33-38` | Confirmed |
| 133 | `public` is the PostgreSQL schema | `packages/3-targets/6-adapters/postgres/.../contract.ts` default namespace `public`; `packages/2-sql/2-authoring/contract-psl/src/interpreter.ts:1172` | Confirmed |
| 133 | "Prisma ORM 8 puts every table in `public`" | `packages/1-framework/2-authoring/psl-parser/src/parse.ts:519` (`namespace` blocks); `test/integration/test/authoring/parity/native-enum/schema.prisma:3,15` (`public` and `auth`); `interpreter.ts:1172` (default only) | **Corrected** → "A model goes in `public` unless your contract puts it in a `namespace` block." |
| 133 | Table accessor keyed by table name; `@@map`; `@map` columns | `sql-builder/src/runtime/sql.ts:38-55`, `table-proxy-impl.ts` | Confirmed |
| 137 | `db.runtime()`; `db.close()` | `packages/3-extensions/postgres/src/runtime/postgres.ts:66,72,374` | Confirmed |
| 139, 146-150 | `postgres<Contract>({ contractJson, url })`; synchronous `runtime()`; build then `query` | `postgres.ts:86-105,266`; `builder-base.ts:buildPlan` | Confirmed |
| 139 | A built query can run more than once | plan is a frozen data object; `query()` returns a new `AsyncIterableResult` each call (`runtime-scope.ts:24`) | Confirmed |
| 153 | SQLite: `sqlite(...)` from `@prisma/orm-sqlite/runtime`; no `public` segment; `lateralJoin`/`outerLateralJoin`/`distinctOn` absent, everything else present | `packages/9-public/@prisma/orm-sqlite/README.md:24`; `packages/3-extensions/sqlite/src/static/sqlite-static.ts:33-38` (unbound namespace); `packages/3-targets/6-adapters/sqlite/src/core/adapter.ts:76-84` (`lateral: false`, no `postgres` namespace, `returning: true`) | Confirmed |
| 166, 505-519 | `.as()` before `build()`; join source; not inside `lateralJoin`; not buildable; SELECT and grouped only | `query-impl.ts:150-168` (`as()` returns only `getJoinOuterScope`/`buildAst`); `types/shared.ts` `WithAlias` on SelectQuery/GroupedQuery, absent on Insert/Update/Delete | Confirmed |
| 170 | Join must precede calls naming joined columns | scope grows only at join (`joined-tables-impl.ts:#addJoin`) | Confirmed |
| 170, 445 | `distinctOn()` columns must be the first `orderBy()` keys; later keys pick the kept row | nothing in the builder checks it (`builder-base.ts:resolveDistinctOn`) | **Q** (PostgreSQL rule, see Q list) |
| 172-174 | Scope; `f` per column; after a join columns under table name, unique names also bare | `scope.ts:MergeScopes`, `builder-base.ts:mergeScopes`, `field-proxy.ts` | Confirmed |
| 174 | Enum: pass the stored value; `High = "high"` → `'high'`; bare `admin` → `'admin'` | `contract-psl/test/interpreter.enum.test.ts:126-133` and `:624-648` (bare members store their names) | Confirmed |
| 186 | Unknown `select()` name throws `ORM.COLUMN_UNKNOWN` | `builder-base.ts:resolveSelectArgs`; `test/runtime/structured-errors.test.ts:59-68` | Confirmed |
| 187-188 | Aliased-expression and object forms | `types/shared.ts:WithSelect` | Confirmed |
| 190 | `select()` adds, never replaces | `query-impl.ts:select` (`rowFields: {...old, ...new}`, projections appended) | Confirmed |
| 192 | Type ids `pg/text@1`, `pg/int4@1`, `pg/int8@1`, `pg/float8@1`, `pg/bool@1`, `pg/uuid@1`, `pg/timestamptz-temporal@1`; `DateTime` → timestamptz-temporal; read from `.columns.<column>.codecId` | `postgres/src/core/codec-ids.ts:8-40`; `contract-psl/test/ts-psl-parity.test.ts:217`; `table-proxy-impl.ts:get columns` | Confirmed |
| 281 | `innerJoin()` scope wording | as line 172-174 | Confirmed |
| 312 | `outerLeftJoin`/`outerRightJoin`/`outerFullJoin` = LEFT/RIGHT/FULL OUTER JOIN | `joined-tables-impl.ts` join types; `postgres/src/core/sql-renderer.ts:804-809` renders `LEFT JOIN` (SQL synonym of `LEFT OUTER JOIN`) | Confirmed |
| 334, 444 | SQLite rejects `lateralJoin`/`distinctOn` in TypeScript; a cast call throws `ORM.CAPABILITY_MISSING` | `scope.ts:GatedMethod`; `builder-base.ts:assertCapability`; `test/runtime/structured-errors.test.ts:83-96`; `builders.test.ts:365-401` | Confirmed |
| 335-337, 357-371 | `lateral.from(...)`, return the chain directly, alias scoping, ambiguous bare names throw | `joined-tables-impl.ts:#buildLateral`; `builders.test.ts:373-389` | Confirmed |
| 338 | `outerLateralJoin(alias, callback)` is `LEFT JOIN LATERAL` | `joined-tables-impl.ts` (`'left'` + lateral); `sql-renderer.ts:804-809` | Confirmed |
| 385-391 | `nulls` accepted by TypeScript, never reaches the SQL; CASE-fragment workaround | `expression.ts:OrderByOptions`; `builder-base.ts:resolveOrderBy` (only `asc`/`desc`); no `NULLS` string anywhere in `packages` | Confirmed |
| 420, 433 | `distinct()` is `SELECT DISTINCT` | `sql-renderer.ts:204,286-291` | Confirmed |
| 482-483 | `limit(n)` / `offset(n)` take `number` only | `types/shared.ts:PaginationValue` = `number` \| numeric `TraitExpression`; `query-impl.ts:limit/offset` | **Corrected** → "`number`, or a numeric expression" (restores the pre-round wording) |
| 540 | Aggregates in `select()` first, then `groupBy()` | `types/grouped-query.ts` has no `select()` | Confirmed |
| 583-587 | `fns.count(f.id)` grouped example | `test/integration/test/sql-builder/group-by.test.ts:8-36` | Confirmed |
| 591 | `count()`/integer `sum()` past 2^53-1 throws `RUNTIME.DECODE_FAILED` | `postgres/src/core/codec-helpers.ts:152-196` | Confirmed |
| 592 | `avg()` is float8, `avgDecimal` exact | `postgres/src/core/aggregates.ts` (`avg` → float8 via cast; `avgDecimal` → numeric) | Confirmed |
| 593, 597-599 | Errors are `Error` with `code` | `utils/structured-error`, `postgres/src/core/errors.ts` | Confirmed |
| 606-617 | `EXTRACT` typed `pg/numeric@1` arrives as a string; `groupBy` by alias; repeat the fragment to group by the expression | `expression.ts:RawSqlBuilderImpl.returns` (no codec on the projection, so no decode); `codecs.ts:896-907` (numeric decodes to string); `builder-base.ts:resolveGroupBy` (alias in scope via `orderByScopeOf`) | Confirmed |
| 620 | Unknown `groupBy` name throws `ORM.COLUMN_UNKNOWN` at call; ungrouped column fails at run time with PostgreSQL's own error | `resolveGroupBy`; nothing validates grouping | Confirmed |
| 628 | `count()` vs `1n` → `RUNTIME.ENCODE_FAILED`; `countBigInt()` compares against `1n` | `codec-helpers.ts:77-84,174-176`; aggregate output codecs `pg/int8number@1` vs `pg/int8@1` | Confirmed |
| 629 | Selected alias in `having()` accepted by TypeScript, rejected by PostgreSQL | `grouped-query.ts:having` takes `OrderByScope` (aliases included); rejection is PostgreSQL's | Partly Q (see Q list) |
| 652, 667 | `having` with `fns.gt(fns.sum(...), 1000)` / `fns.gt(fns.count(), 1)` | `group-by.test.ts:38-50` | Confirmed |
| 674 | "The alias must be one you selected. Any other name throws `ORM.COLUMN_UNKNOWN`" | `builder-base.ts:resolveOrderBy` also accepts any base-table column in scope | **Corrected** → "A name that is neither a column of the table you started from nor an alias you selected throws…" (matches the `groupBy()` wording at line 620) |
| 693-694 | `where()` optional on `update()`/`delete()` | `mutation-query.ts` (`where` optional in the chain) | Confirmed |
| 697 | `execute` → `{ affectedRows }`, `query` with `returning()` | `relational-core/src/runtime-scope.ts:24-25`; `mutation.test.ts:103-109` (`toEqual({ affectedRows: 1 })`) | Confirmed |
| 705 | `insert()` always takes an array; empty array → `ORM.MUTATION_DATA_MISSING` | `mutation-impl.ts:254-260` (thrown at `build()`) | Confirmed |
| 706 | Defaults applied at `build()`; re-running inserts the same id | `mutation-impl.ts:253-270` (`buildParamValues` inside `build()`); `mutation-defaults.test.ts:8-22` | Confirmed |
| 707 | No `ON CONFLICT`, no upsert | no `conflict` handling in `mutation-impl.ts` or `InsertAst` | Confirmed |
| 713-715 | Every column optional in TypeScript; PostgreSQL still rejects a missing required column | `mutation-query.ts:InsertValues` (all optional) | Confirmed / database side Q |
| 745-746 | `returning()` on PostgreSQL and SQLite; column names only, no `'*'`, no expression | `mutation-query.ts:ReturningCapability`; both adapters set `sql.returning: true`; `mutation-impl.ts:202-226` (names resolved against scope) | Confirmed |
| 775-782 | `update()` object form or callback, cannot mix; callback values must be expressions; `fns.raw` for a fixed value | `table-proxy.ts:update` overloads; `table-proxy-impl.ts:update`; `mutation-impl.ts:evaluateUpdateCallback` | Confirmed |
| 819 | `delete()` takes no arguments | `table-proxy.ts:delete(): DeleteQuery` | Confirmed |
| 846 | `param` from `@prisma/orm-postgres/relational-core/expression` | export map `./relational-core/expression`; `relational-core/src/expression.ts:132` | Confirmed |
| 847 | "A bare string becomes `pg/text@1`, so a value going into a `uuid` column needs `param(...)`" | `functions.ts:binaryWithSharedCodec` threads the column codec, so a comparison needs no `param()`; only `fns.raw` interpolation infers `pg/text@1` (`expression.ts:336-354`, `postgres adapter.ts:121-140`) | **Corrected** → scoped to "Inside `fns.raw` no column lends its type, so …" |
| 847 | `Temporal.Instant` cannot be interpolated bare | `postgres/src/core/adapter.ts:132-139` (`RUNTIME.RAW_SQL_UNSUPPORTED_INTERPOLATION`) | Confirmed |
| 855, 861, 870 | `param(value, { codecId })` → `ParamRef`, usable in `fns.raw` | `expression.ts:132-134` | Confirmed |
| 888-894, 896-911 | Comparison/membership/boolean/existence signatures; `in`/`notIn` take an array or an unbuilt subquery; `exists`/`notExists` an unbuilt subquery | `expression.ts:BuiltinFunctions`; `functions.ts:inOrNotIn`; `test/integration/test/sql-builder/subquery.test.ts:6-47` | Confirmed |
| 917-924 | Aggregate table: `count` number, `countBigInt` bigint, `sum` number over int4/int8, string over numeric, number over float8, `sumBigInt` bigint, `avg` number, `avgDecimal` exact string, `min`/`max` input type with `VarChar` → `text` | `postgres/src/core/aggregates.ts:152-228`; `codecs.ts:896-907` (numeric → string); `control-mutation-defaults.ts:163-206,275` (Int/BigInt/Float/Decimal/Numeric/Uuid mappings) | Confirmed |
| 926 | `ilike(expr, pattern)` on text; `cosineDistance(a, b)` → number, pgvector only | `postgres/src/core/descriptor-meta.ts:155-168`; `pgvector/src/core/descriptor-meta.ts:19-36` (float8) | Confirmed |
| 930, 941-943 | `fns.raw` interpolation; `.returns()` always required; annotation only, no conversion; no `fns.coalesce`/`fns.cast` | `expression.ts:RawSqlBuilderImpl` (the Expression exists only after `.returns()`, and carries no codec); `BuiltinFunctions` has no coalesce/cast | Confirmed |
| 937 | `.returns(typeId)` type is `string` | `expression.ts:RawSqlBuilder` also takes `{ codecId, nullable }`; raw-queries.mdx:50 says so | **Corrected** → "`string`, or `{ codecId, nullable }`" |
| 963 | `build()` takes zero arguments on every query type | `types/shared.ts:WithBuild`, `mutation-query.ts` `build()` | Confirmed |
| 977-979 | `query` → rows (await or `for await`), `execute` → `{ affectedRows }`, which to use | `runtime-scope.ts:23-26` | Confirmed |
| 987-989 | `ResultType` from `@prisma/orm-postgres/components/runtime`; one row; works on ORM queries | `framework-components/src/exports/runtime.ts:14`, `execution/query-plan.ts:49`; `sql-orm-client/src/collection.ts:225` (`_row`); `docs/releases/v8.0.0-rc.10.md:27` | Confirmed |
| 1006 | `for await` gives no memory benefit on PostgreSQL; "use `await`" | `postgres.ts:246` (`cursor: { disabled: true }`) | Confirmed |
| 1008 | Re-awaiting is safe; mixing modes or looping twice throws `RUNTIME.ITERATOR_CONSUMED` | `framework-components/src/execution/async-iterable-result.ts:13-60` | Confirmed |

## Q list (unverifiable from the source)

These are PostgreSQL server behaviours the Prisma source neither implements nor tests. Page text left alone.

1. `distinctOn()` columns must be the leftmost `orderBy()` keys, and later keys decide the kept row (lines 170, 445). Searches: `grep -rn "distinctOn" packages --include='*.ts'`, `grep -rn "DISTINCT ON" packages`, read `builder-base.ts:resolveDistinctOn` and `sql-renderer.ts:286-291`. Nothing validates or documents the ordering rule; the builder renders whatever you give it.
2. PostgreSQL rejects a selected alias inside `HAVING` (line 629). Searches: `grep -rn "having" packages/2-sql --include='*.ts'`, `group-by.test.ts`. No test uses an alias in `having()`; the type surface allows it.
3. PostgreSQL rejects an insert that omits a required column with no default (line 715). Searches: `grep -rn "MUTATION_DATA_MISSING\|NOT NULL" packages --include='*.ts'`. No Prisma-side check; it is the database's error.

## Notes

- The examples on this page are not copies of the SQL-builder integration tests: those run against a different fixture (`test/integration/test/sql-builder/fixtures/contract.ts` — `users`/`posts`/`comments` with `int4` ids). The page uses the shared reference example schema instead. I checked every example for call shape and argument type against the source rather than against fixture data. The page makes no claim of being copied from a test suite, so no change.
- Two accurate-but-incomplete spots I left alone because fixing them would lengthen the page: `distinctOn()`'s Options table lists column names only, while the source (`select-query.ts`) also accepts an expression callback; and `orderBy()`'s `nulls` option is described in prose only.
- The page no longer states that `db.runtime()` is synchronous on PostgreSQL (a round removed it). The `page-conventions.md` bullet asks for that sentence where `runtime()` first appears. The example at line 147 does not `await` it, so nothing is wrong, but the operator may want the sentence back.