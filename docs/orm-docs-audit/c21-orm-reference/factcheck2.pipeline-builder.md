Checks complete. Report below.

## 1. Claims checked

Line numbers are in the corrected slice (`wip/c21/ref/fc2/pipeline-builder.mdx`). Source paths are relative to `wip/prisma-src/`. `qb/` = `packages/2-mongo-family/5-query-builders/query-builder/src/`, `ast/` = `packages/2-mongo-family/4-query/query-ast/src/`.

| Line | Claim | Source | Verdict | Now says |
|---|---|---|---|---|
| 9-11 | Aggregation only, no `find()`/`distinct()`, `limit(1)` for one document | qb/builder.ts, qb/query.ts (no such methods) | Confirmed | |
| 19 | Example schema is the same as the ORM client page | `apps/docs/.../orm-client.mdx` | Confirmed | |
| 26-75 | Schema block fields (`_id`, `kind`, `authorId`, `createdAt`, `duration`) | same | Confirmed | |
| 84 | `mongo(...)` client, `dbName` option | packages/3-extensions/mongo/src/runtime/mongo.ts:55 | Confirmed | |
| 84 | "Three import paths appear on this page" | page also imports `ObjectId` from `mongodb` (line 1233) | Corrected | "Three Prisma ORM import paths appear on this page" |
| 84 | `/runtime`, `/query-builder`, `/query-ast/execution` exist and hold those names | packages/9-public/@prisma/orm-mongo/package.json; qb/exports/*.ts; ast/exports/execution.ts | Confirmed | |
| 86 | `prisma contract emit` writes `contract.json` and `contract.d.ts` | cli/src/commands/init/hygiene-gitattributes.ts:8,35 | Confirmed | |
| 86 | `with { type: 'json' }` works with the settings `prisma orm init` writes | cli/src/commands/init/templates/tsconfig.ts:23-27 (`module: 'preserve'`, `moduleResolution: 'bundler'`, `resolveJsonModule: true`) | Confirmed | |
| 94 | `from()` takes the collection name from the roots map | qb/query.ts:29; qb/state-classes.ts:640-660 | Confirmed | |
| 95 | `ORM.MODEL_UNKNOWN`, message `Unknown root: "<name>". Valid roots: ...` | qb/state-classes.ts:648 | Confirmed | |
| 96 | `insertOne()`/`insertMany()` on `from()` only, before any stage | qb/state-classes.ts (on `CollectionHandle`, absent from `FilteredCollection`) | Confirmed | |
| 97 | `mongoQuery({ contractJson }).from(...)` builds only, never runs | qb/query.ts:33-60 | Confirmed | |
| 116-124 | Entry example: default `mongo` import, `contract.d`, `contract.json` | cli/.../code-templates.ts:336-345 | Confirmed | |
| 129-135 | `build()` returns the built query; `db.runtime()` is a promise; no `db.execute` | qb/builder.ts `build()`; mongo.ts:38, `MongoClient` interface has no `execute` | Confirmed | |
| 136 | Decoding: the eight stages keep the shape, anything else makes every document raw; `_id` hex string vs `ObjectId` | qb/pipeline-result-shape.ts:14, 68-89 | Confirmed | |
| 136 | A `DateTime` field is a `Date` either way | `mongo/date@1` output is `Date`; raw driver returns `Date` | Confirmed | |
| 157-158 | `match()` callback; scalar operators `eq, ne, gt, gte, lt, lte, in, nin, exists, type` | qb/field-accessor.ts:51-67 | Confirmed | |
| 159 | `expr(fn.gt(...))` form for computed comparisons | qb/field-accessor.ts:222 | Confirmed | |
| 165-166 | `.node` table under `match()` listed `redact()` as needing `.node` | qb/builder.ts `redact()` takes the callback's value and reads `.node` itself | **Corrected** | `redact()` moved to the "the `fn.*` value itself" row; the `.node` row now reads "The condition argument of `fn.cond()`, and the stages that take an options object" |
| 206-213 | `_id` equality in `match()` never matches; `db.orm.posts.where({ _id }).first()` works | pipeline builder sends a bare `MongoFieldFilter` with no codec (ast/filter-expressions.ts:51); ORM client wraps values in `MongoParamRef(value, { codecId })` (orm/src/collection.ts:744) | Confirmed | |
| 222 | `sort()` spec `{ field: 1 \| -1 }` | qb/builder.ts `sort()` | Confirmed | |
| 251-322 | `limit`, `skip`, `sample` signatures | qb/builder.ts | Confirmed | |
| 330 | `addFields()` callback returns new fields, existing fields preserved | qb/builder.ts `addFields()`; qb/pipeline-result-shape.ts:56-66 | Confirmed | |
| 364-365 | `lookup()` shape; `on()` returns fixed `local`/`foreign` keys | qb/lookup-builder.ts:36-37, 195-200 | Confirmed | |
| 366 | No match gives an empty array | MongoDB `$lookup` behaviour; no source test | **Q** | |
| 367 | Both `_id`s are `ObjectId`; `String(post.author[0]._id) === String(post.authorId)` | qb/pipeline-result-shape.ts (lookup drops the shape) | Confirmed | |
| 404 | Key-list form; `_id` retained implicitly | qb/builder.ts `project()` overload 1 (`Pick<Shape, K \| '_id'>`); test/integration/.../query-builder.test.ts:370 | Confirmed | |
| 405, 412, 436 | Callback form accepts `0` to drop a field; example used `_id: 0` | qb/builder.ts `project()` spec type is `Record<string, 1 \| TypedAggExpr>`, and the body does `val === 1 ? 1 : val.node` | **Corrected** | "Write `1` to keep a field, or an expression to compute it. There is no `0` form here: the callback form cannot drop a field." Options row is now `1 \| Expression`; `_id: 0` removed from the example |
| 447 | "The named field must hold an array" | qb/builder.ts `unwind<K extends keyof Shape & string>`; qb/types.ts:211 `UnwoundShape` has no array constraint | **Corrected** | "Name the field holding the array. TypeScript accepts any field of the document; nothing checks that it holds an array." |
| 454 | `preserveNullAndEmptyArrays` defaults to `false` | qb/builder.ts (`?? false`) | Confirmed | |
| 484-485 | `group()` takes one callback argument; `acc` is imported, not a second argument | qb/builder.ts `group()`; qb/accumulator-helpers.ts | Confirmed | |
| 487 | Non-accumulator message and `ORM.ARGUMENT_INVALID`; "a `null` value throws the same way" | qb/builder.ts (two distinct messages) | **Corrected** | The null case now quotes its own message: `group() field "<name>" must not be null. Only _id can be null.` |
| 546 | `replaceRoot()` callback returns an object-valued expression; MongoDB's `'newRoot' expression must evaluate to an object` | qb/builder.ts `replaceRoot()` confirmed; the MongoDB message is not in the source | Confirmed / **Q** on the message text | |
| 583 | `count()` stage is not `acc.count()` | qb/builder.ts `count()`; qb/accumulator-helpers.ts `count()` | Confirmed | |
| 612 | `sortByCount()` emits `{ _id, count }` sorted descending | qb/builder.ts `sortByCount()` return type; integration test line 750 | Confirmed | |
| 644-645 | `redact()` needs `$$KEEP`/`$$DESCEND`/`$$PRUNE`; `f.rawPath` prefixes `$` | qb/field-accessor.ts `rawPath`; packages/3-mongo-target/2-mongo-adapter/src/lowering.ts:37 (`` `$${expr.path}` ``); integration test lines 620-626 | Confirmed | |
| 682 | `bucket({ groupBy, boundaries, default_?, output? })` | qb/builder.ts | Confirmed | |
| 683 | `bucketAuto({ groupBy, buckets, output?, granularity? })`, `granularity` a plain string passed through | qb/builder.ts (`granularity?: string`) | Confirmed; "MongoDB rejects the ones it does not know" is **Q** | |
| 684 | `geoNear` options; "`near` is a raw expression" | qb/builder.ts types `near: unknown`, not `MongoAggExpr` | **Corrected** | "`near` is the point to measure from, and Prisma ORM passes it through to MongoDB unchanged." |
| 685 | `graphLookup({ from, startWith, connectFromField, connectToField, as, maxDepth?, depthField?, restrictSearchWithMatch? })`, `startWith` raw | qb/builder.ts | Confirmed | |
| 686 | `setWindowFields` options and the `output` example | qb/builder.ts; ast/stages.ts:777-783; integration test lines 666-681 | Confirmed | |
| 687 | `densify({ field, partitionByFields?, range })`, `range` `{ step, unit?, bounds }` | ast/stages.ts:825-829 | Confirmed | |
| 688 | `fill` options; `output` is `{ method }` or `{ value }`; `method` a plain string | ast/stages.ts:860-863 | Confirmed | |
| 689-691 | `facet(facets)`, `unionWith(collection, pipeline?)`, `Mongo*Stage` classes from `/query-ast/execution` | qb/builder.ts; ast/exports/execution.ts | Confirmed | |
| 704-740 | `facet()` and `bucket()` examples and their result comments | integration test lines 446-490 (same call shapes; `_id` is the lower boundary, rows are `{ _id, count }`) | Confirmed | |
| 749-752 | Atlas stages build anywhere, `search(config, index?)`, `searchMeta(config, index?)`, `vectorSearch({...})` | qb/builder.ts | Confirmed; "the error only appears when you run the query" is **Q** | |
| 768-790 | Nineteen accumulators and their signatures | qb/accumulator-helpers.ts (19 exported) | Confirmed | |
| 792-795 | `{ input, n }`; `top`/`bottom` `{ output, sortBy }`; `topN`/`bottomN` add `n`; `sortBy` plain object; `n: fn.literal(2)` | qb/accumulator-helpers.ts:75-165 | Confirmed | |
| 797 | `sort()` before `group()` for `first`/`last` | integration test lines 800-810 sorts first; MongoDB `$first` is order-dependent | Confirmed | |
| 860-869 | Renames `isIn`, `typeOf`, `toString_`, `firstElem`, `lastElem` | qb/expression-helpers.ts | Confirmed | |
| 871-884 | The full helper list; no `and`/`or`/`not`/`switch`/`ifNull`/`map`/`reduce`/`filter` | qb/expression-helpers.ts (76 helpers, every group name matched one by one) | Confirmed | |
| 886 | `expr(...)` where `.node` is expected throws a `TypeError` | `MongoExprFilter.accept` calls `visitor.expr`, which the aggregation lowering visitor does not define (lowering.ts:36-56) | Confirmed from code; **no test covers it** | |
| 890-894 | The `.node` table; `redact()` listed as needing `.node` | as above | **Corrected** | `redact()` moved to the value row; the options-object row no longer names `redact()` |
| 892 | `f.stage.set()`, `replaceRoot()`, `replaceWith()` take `.node`; `unset()` is not listed | qb/field-accessor.ts:140-145 (`unset(...paths: string[])`) | Confirmed | |
| 907-921 | `MongoOrExpr.of([...])`, `MongoAndExpr.of([...])`, `.not()`; `MongoFieldFilter` has `eq, neq, gt, gte, lt, lte, in, nin, isNull, isNotNull` | ast/filter-expressions.ts:17, 51-89, 113, 140 | Confirmed | |
| 922 | `MongoFieldFilter.neq` versus `fn.ne` | ast/filter-expressions.ts:55; qb/expression-helpers.ts `ne` | Confirmed | |
| 924 | `fn.slice` and `fn.range` positional, and so is every helper not in the table | qb/expression-helpers.ts — seven more named-args helpers were missing from the table | **Corrected** via the table (below); the sentence is now true |
| 925 | `fn.toObjectId(fn.literal(id))` throws a `TypeError` | qb/expression-helpers.ts:96-101 `docUnaryExpr` reads `arg._field.codecId`, and `literal()` sets `_field: undefined as never` | Confirmed from code; **no test covers it** | |
| 931-941 | The named-argument helper table | qb/expression-helpers.ts | **Corrected** | `fn.dateToString` → `{ date, format?, timezone?, onNull? }`; `fn.trim` → `{ input, chars? }` grouped with `ltrim`/`rtrim`; `fn.regexMatch` → `{ input, regex, options? }` grouped with `regexFind`/`regexFindAll`; added `fn.dateFromString` and `fn.replaceOne`/`fn.replaceAll` |
| 943 | `fn.convert`'s `to` takes a type name as an expression | qb/expression-helpers.ts `convert` | Confirmed | |
| 951-971 | Arithmetic, string and `cond()` examples, including `.node` on the condition | qb/expression-helpers.ts `cond(condition: MongoAggExpr, ...)`; integration test lines 780-795 | Confirmed | |
| 979-982 | `pipe(stage)` / `pipe<NewShape>(stage)`; naming rule; rows undecoded after it | qb/builder.ts `pipe` overloads; qb/pipeline-result-shape.ts | Confirmed | |
| 1009 | `aggregate()` is another name for `build()` | qb/builder.ts `aggregate() { return this.build(); }` | Confirmed | |
| 1015-1020 | Updater array rule; bare operation throws; `ORM.MUTATION_DATA_MISSING`; `Cannot mix ...`; `Update spec collision: ...` | qb/update-ops.ts:185-225, 130-140 | Confirmed | |
| 1024 | `insertOne`, `insertMany`, `updateAll`, `deleteAll`, `upsertOne` on the root only | qb/state-classes.ts | Confirmed | |
| 1031 | Write result shapes; "`{ matchedCount, modifiedCount, upsertedCount, upsertedId }`" | ast/result-types.ts:26-31 — the last two are optional | **Corrected** | "…give `{ matchedCount, modifiedCount }`, plus `upsertedCount` and `upsertedId` when an upsert inserted a document" |
| 1032 | `insertOne` takes any record, no contract check | qb/state-classes.ts:173 (`Record<string, MongoValue>`) | Confirmed | |
| 1033 | `_id` may be left out | same, plus `InsertOneResult.insertedId` | Confirmed | |
| 1034 | Values stored exactly as passed | packages/3-mongo-target/2-mongo-adapter/src/mongo-adapter.ts:94-95 passes the document through | Confirmed | |
| 1036 | `insertMany([])` throws `ORM.MUTATION_DATA_MISSING` | qb/state-classes.ts:201 | Confirmed | |
| 1066 | `upsertOne(filterCallback, updaterCallback)` on the root | qb/state-classes.ts:265 | Confirmed | |
| 1082 | After `match()`, `upsertOne()` takes the updater only | qb/state-classes.ts:516 | Confirmed | |
| 1083 | "put a `sort()` between the `match()` and the write and use `findOneAndUpdate()`" | `FilteredCollection` starts `F = 'fam-cleared'`; `sort()` keeps it cleared, so TypeScript withdraws `findOneAndUpdate`. Test asserts exactly this: qb test/state-machine-surface.test-d.ts:46-60 (`@ts-expect-error — sort-past-FilteredCollection keeps F = 'fam-cleared'`) | **Corrected** | "Which one they pick is up to the driver, and the typed builder gives you no way to order that choice." |
| 1084 | `findOneAndUpdate`/`findOneAndDelete` return the driver's document, `_id` an `ObjectId` | qb/state-classes.ts (no `resultShape` on those plans) | Confirmed | |
| 1085 | Only `skip()` withdraws them | same test file, lines 62-112: `group`, `limit`, `addFields`, `project`, `unwind`, `skip`, and `sort` all clear the marker | **Corrected** | "offered straight after `match()` and nowhere else. TypeScript withdraws them after every other stage, `sort()` and `skip()` included. If a cast gets one past TypeScript after a `skip()`, it throws an error whose `code` is `ORM.OPERATION_UNSUPPORTED`." |
| 1116 | `findOneAndUpdate()`'s second argument optional, `returnDocument` default `'after'`, `upsert` default `false` | qb/state-classes.ts:545-575 (`opts … = {}`, `?? 'after'`, `?? false`) | Confirmed | |
| 1125-1127 | `returnNewDocument` is not a valid option; unknown key ignored | the options type admits only `upsert` and `returnDocument`, and the constructor reads only those | Confirmed | |
| 1139-1140 | Operator form has fourteen operators; pipeline form has `set`, `unset`, `replaceRoot`, `replaceWith` | qb/field-accessor.ts:70-90 (14 operators); `StageEmitters` (4) | Confirmed | |
| 1145-1160 | The operator argument table, including `pop(direction)` defaulting to `1` | qb/field-accessor.ts:262 (`pop: (direction = 1)`); qb/update-ops.ts | Confirmed | |
| 1160 | `setOnInsert` does nothing outside `upsertOne()` | qb/update-ops.ts emits `$setOnInsert`; MongoDB applies it only on upsert insert | Confirmed | |
| 1189 | `out(collection, db?)` | qb/builder.ts `out(collection: string, db?: string)` | Confirmed | |
| 1190-1191 | `merge({ into, on, whenMatched, whenNotMatched })`; `whenMatched` also takes `MongoAddFieldsStage`/`MongoProjectStage`/`MongoReplaceRootStage` | qb/builder.ts `merge()`; `MongoUpdatePipelineStage` union | Confirmed | |
| 1192 | Both return an empty array | `#writeTerminal` returns `MongoQueryPlan<unknown, …>`; `$out`/`$merge` emit no documents | Confirmed | |
| 1214 | `rawCommand()` takes `RawAggregateCommand(collection, pipeline)`, rows `unknown` | qb/query.ts:30, 41-59; ast/raw-commands.ts:4-15 | Confirmed | |

## 2. Q list (left as written)

| Claim | Searches run |
|---|---|
| `lookup()` with no match gives an empty array (line 366) | `grep -rn "lookup" test/integration/test/mongo/query-builder.test.ts`; qb test dir; only the matching case is tested |
| `replaceRoot()` message `'newRoot' expression must evaluate to an object` (line 546) | `grep -rn "newRoot" packages/ test/` — the string is nowhere in the tree; it is MongoDB's own |
| `bucketAuto`'s "MongoDB rejects the ones it does not know" about `granularity` (line 683) | `grep -rn "granularity" packages/` — only the pass-through `granularity?: string` |
| Atlas stages: "the error only appears when you run the query" (line 749) | `grep -rn "Atlas\|mongot\|\$search" packages/2-mongo-family packages/3-mongo-target` — nothing checks for Atlas; the builder appends the stage and sends it. Nothing in the tree runs one |
| The result comments `// { total: 2, counted: 2 }`, `// { firstTitle: 'Hello world', lastTitle: 'Tutorial one' }`, `// [{ total: 2 }]`, `// { earliest: <Date>, avgYear: 2024 }` | The integration suite uses a different fixture (Products/Orders, five documents), so no test seeds this page's `posts`. The numbers are internally consistent with a two-document `posts` collection and match the ORM client page's data, but no source file decides them |

Two claims the code supports but **no test covers**: `fn.toObjectId(fn.literal(...))` throwing a `TypeError` (line 925) and `expr(...)` in a `.node` slot throwing a `TypeError` (line 886). Both follow directly from the code, so I left them stated as facts.

## 3. Page-conventions bullets

- The rc.10 bullet: the one rc.10 change named in the brief (buffered PostgreSQL queries releasing their pooled connection early) is PostgreSQL-only. This page is MongoDB-only and says nothing about connection release, so nothing to change.
- The last bullet (the generated error-reference page is out of scope): nothing in this slice touches it. The page links to `/orm/reference/raw-queries`, `/orm/reference/orm-client`, `/orm/reference/sql-query-builder`, `/orm/reference/transactions-and-runtime` and `/orm/coming-from-prisma-orm-7`, none of them the error reference.
- Anchors: no heading text, numbering, order, or pinned anchor (`[#read-terminals]`, `[#pipeline-write-terminals-out-and-merge]`) was changed.
- `bash .claude/skills/docs-reader-review/scripts/check-plain.sh wip/c21/ref/fc2/pipeline-builder.mdx` → `plain-language check: clean`.

## 4. Line count

Before: 1238. After: 1240. The two extra lines are rows in the named-argument helper table for helpers that were missing from it, which the sentence above the table asserted were positional.