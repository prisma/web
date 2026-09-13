Done. Report below.

## Corrections made (page: `apps/docs/content/docs/orm/reference/pipeline-builder.mdx`)

| Line (new) | Claim | Source that decides it | Verdict | What the page now says |
|---|---|---|---|---|
| 95 | `from()` takes "the lowercase plural collection name" | `query-builder/src/state-classes.ts:createCollectionHandle`; `contract-psl/src/interpreter.ts:1361` (`roots[collectionName]`) | Corrected | Takes the collection name from the `roots` map: the model's `@@map`, else the model name with a lowercase first letter |
| 96 | Unknown root error | `state-classes.ts` `ormError('ORM.MODEL_UNKNOWN', 'Unknown root: ...')`; `test/structured-error-codes.test.ts:53` | Corrected (wording only) | "throws right away, with an error whose `code` is `ORM.MODEL_UNKNOWN`" |
| 97 | Three builder states, root writes only before stages | `state-classes.ts` (CollectionHandle / FilteredCollection / PipelineChain) | Confirmed | — |
| 126 | `db.runtime()` returns a promise; `AsyncIterableResult`; no `db.execute` | `extensions/mongo/src/runtime/mongo.ts:38`; `framework-components/src/execution/async-iterable-result.ts:3` | Confirmed | — |
| 127–128 | "Read results are decoded"; only lookup sub-documents undecoded | `query-builder/src/pipeline-result-shape.ts:14,80`; `7-runtime/src/codecs/decoding.ts:53`; `mongo-runtime.ts:251` | **Corrected** | Decoding survives only `match`, `sort`, `limit`, `skip`, `sample`, `project`, `addFields`, `vectorSearch`. Every other stage (including `lookup()` and `group()`) drops the result shape and the **whole row**, top-level `_id` included, comes back raw |
| 150 | Filter values "not encoded to the stored type" | `2-mongo-adapter/src/resolve-value.ts:46-93` (only `MongoParamRef` with a codecId is encoded); ORM client wraps values in `MongoParamRef` (`orm/src/collection.ts:744`) | Confirmed | — |
| 151 | Filter operator list `eq ne gt gte lt lte in nin exists type` | `query-builder/src/field-accessor.ts:49-73` | Confirmed (exact match) | — |
| 190–193 | `_id` equality never matches; `ObjectId` walked as a plain object; `rawCommand` / ORM client are the escape hatches | `resolve-value.ts:73-93`; `orm/src/collection.ts:744` | Confirmed, still true at rc.10 | — |
| 202, 231, 237, 262, 287 | `sort`/`limit`/`skip`/`sample` signatures | `builder.ts:199-238` | Confirmed | — |
| 310, 344, 384–385 | `addFields`, `lookup(from().on().as())`, `project` two forms, implicit `_id` | `builder.ts:251,285,326`; `lookup-builder.ts` | Confirmed | — |
| 428–429 | `unwind()` "not exercised, verify it yourself" | `test/integration/test/mongo/query-builder.test.ts:395` runs `unwind('tags')` live | **Corrected** | Caveat removed; states the behaviour instead |
| 450–453 | `group()` single-argument callback; `acc` namespace; non-accumulator is "a compile error … throws at build time" | `builder.ts:395-430`; `types.ts:181` (the index signature allows a plain expression); `test/builder.test.ts:206` | **Corrected** | Throws when you call `group()`, `code` `ORM.ARGUMENT_INVALID`, exact message given; `null` for a non-`_id` key throws the same way. The "compile error" claim was dropped |
| 513 | `replaceRoot` rejects a bare scalar | MongoDB server message, not in the tree | **Q** | unchanged |
| 581 | `sortByCount` emits `{ _id, count }` sorted descending | `builder.ts:455`; integration test:514 | Confirmed | — |
| 612–616 | `redact()`: `fn.literal` fails; "no supported public pattern" for `$$KEEP` | `lowering.ts:37` (`fieldRef` → `'$'+path`), `:124` (`needsLiteralWrap`); `field-accessor.ts` `rawPath`; integration test:620 | **Corrected** | `fn.literal('KEEP')` emits the plain string and `fn.literal('$$KEEP')` is wrapped in `$literal`; both are rejected. The working route is `f.rawPath('$KEEP')` / `f.rawPath('$PRUNE')` inside `fn.cond(...)` |
| 624 | "The following stages take an options object: `unionWith` … `facet` …" | `builder.ts:535` (`unionWith(collection, pipeline?)`), `:588` (`facet(record)`) | **Corrected** | `unionWith` takes a collection name plus optional raw stages; `facet` takes a map of named raw sub-pipelines; the other seven take options objects |
| 625 | `bucketAuto`, `facet`, `setWindowFields` "not exercised" | integration test:447 (facet), :580 (bucketAuto), :666 (setWindowFields) | **Corrected** | Only `geoNear`, `densify`, `fill` are signature-only; the rest run live in Prisma ORM's test suite |
| 626 | Opaque expression fields | `builder.ts:546-645` (`MongoAggExpr` slots) | Confirmed; added where the classes are imported from | — |
| 643–650 | Atlas stages; `search(spec)`, `vectorSearch(spec)` | `builder.ts:646,655,664` | Corrected (additions) | `search`/`searchMeta` also take an optional index name; `vectorSearch` also takes `filter`; nothing in the builder refuses the stages off Atlas |
| 663 | "all nineteen MongoDB accumulators" | `accumulator-helpers.ts` — 19 exported, but MongoDB has more (`$mergeObjects`, `$accumulator`, `$percentile`, `$median`) | Corrected | "nineteen accumulators" |
| 665–685 | The 19 names and signatures | `accumulator-helpers.ts` | Confirmed (exact match, none missing, none extra) | Added that `sortBy` is a plain object and `n` is an expression |
| 774 | "`fn.*` mirrors MongoDB's operators; each is the camelCase name without `$`" | `expression-helpers.ts:139-519` | **Corrected** | 73 helpers, not all of MongoDB's; no `and/or/not/switch/ifNull/map/reduce/filter`; arithmetic stops at four; five are renamed (`firstElem`, `lastElem`, `isIn`, `typeOf`, `toString_`) |
| 789 | Named-argument helpers | `expression-helpers.ts:216,284,311,465` | Added | one new bullet |
| 790 | `fn.cond` condition must be `.node` | `expression-helpers.ts:180` (`condition: MongoAggExpr`); `filter-expressions.ts:217` (`visitor.expr`) | Confirmed | — |
| 792 | `fn.toObjectId(fn.literal(x))` throws `…reading 'codecId'` | `expression-helpers.ts:98` (`docUnaryExpr` reads `arg._field.codecId`), `:130` (`literal` sets `_field: undefined`) | Confirmed exactly | — |
| 860–861 | `pipe()` "not exercised"; "collapses the row shape" | integration test:713, 625 use `.pipe(...)` live; `builder.ts:679-687` (first overload keeps `Shape`) | **Corrected** | `pipe(stage)` keeps the current row type; `pipe<NewShape>` declares a new one; at run time the rows stop being decoded |
| 874–877 | `aggregate()` is an alias of `build()` | `builder.ts:849` (`return this.build()`) | Confirmed | — |
| 899–902 | Updater array rules and the three error strings | `update-ops.ts:199-227` | Confirmed; error codes added | Codes `ORM.MUTATION_DATA_MISSING` / `ORM.ARGUMENT_INVALID`; "as soon as you call the write method" instead of "at build time"; added the `Update spec collision` error |
| 908 | Root writes: `insertOne`, `insertMany`, `updateAll`, `deleteAll`, `upsertOne` | `state-classes.ts` `CollectionHandle` | Confirmed (exact) | — |
| 913 | Write result objects | `query-ast/src/result-types.ts`; `3-mongo-driver/src/mongo-driver.ts:117-175` | **Corrected** | Per-method shapes spelled out, including `insertedCount` and `matchedCount`/`upsertedCount` |
| 936 | `// { insertedIds: { '0': …, '1': … } }` | `mongo-driver.ts:144` (`Object.values(result.insertedIds)`) | **Corrected** | `// { insertedIds: [<ObjectId>, <ObjectId>], insertedCount: 2 }` |
| 969 | Writes after `match()`: the seven methods | `state-classes.ts` `FilteredCollection` | Confirmed (exact) | — |
| 974 | `updateOne`/`deleteOne` at most one | `state-classes.ts` | Confirmed; added that the driver picks which, and that `findOneAndUpdate` after `sort()` is the ordered form | — |
| 975 | `findOneAndUpdate`/`findOneAndDelete` return values | `state-classes.ts` (plans carry no `resultShape`); `mongo-runtime.ts:251` | Added | The returned document is undecoded, so `_id` is a raw `ObjectId`; both vanish from the type after `skip()` and throw `ORM.OPERATION_UNSUPPORTED` if forced |
| 1018 | `returnDocument` default `'after'`; `returnNewDocument` invalid | `state-classes.ts` (`opts.returnDocument ?? 'after'`, excess-property check) | Confirmed; added the `upsert` option (default `false`) | — |
| 1058–1060 | Operator-form operator list (14 names) | `field-accessor.ts:74-92` | Confirmed (exact match) | — |
| 1059 | Pipeline form `f.stage.*` | `field-accessor.ts:139-146` | Confirmed; added the four emitters `set`, `unset`, `replaceRoot`, `replaceWith` | — |
| 1090–1092 | `out(collection)`, `merge({ into })` | `builder.ts:503,513` | Corrected (additions) | `out` takes an optional database name; `merge` takes `into` as a name or `{ db, coll }`, plus `on`, `whenMatched`, `whenNotMatched` |
| 1117 | `rawCommand()` takes a raw command, rows are `unknown` | `query.ts:29-59`; `test/raw-command.test.ts` | Corrected (wording) | It takes any command node, typed or raw, and does not translate it |
| 1126 | `RawAggregateCommand` import path | `9-public/@prisma/orm-mongo/package.json` exports `./query-ast/execution` | Confirmed | — |
| 9, 11, 17 | MongoDB only; no `find`/`distinct`; PostgreSQL has no `db.query` | `extensions/postgres/src/runtime/postgres.ts:50-61` (no `query`); no `find`/`distinct` on the builder | Confirmed | — |

## Q list (unverifiable against `wip/prisma-src`)

1. **"Every example is transcribed from an executable test suite that runs against a live MongoDB database" and the whole example schema (`User` / `Post` / `Article` / `Tutorial`).** The source's own pipeline-builder integration test uses a different fixture, `Product` / `Order` (`test/integration/test/mongo/query-builder.test.ts:36-130`). The page's harness is external to this checkout, so I cannot confirm or refute the provenance. What I could check does hold: root names are collection names, and a discriminated variant's root collapses into the base model's root (`contract-psl/src/interpreter.ts:487-493`), so `from('posts')` is the right call for that schema. Searches: `grep -rn "Tutorial\|Article\|@@discriminator" test/integration packages --include='*.ts'`, `ls test/integration/test/mongo/`.
2. **The "not exercised by the validation harness" and "verified empirically" statements** generally. These describe the docs team's own harness. I left them where the source also has no live test (`geoNear`, `densify`, `fill`, the Atlas stages) and removed them where the source does run the code live.
3. **`replaceRoot()`'s error text `'newRoot' expression must evaluate to an object`.** That string comes from the MongoDB server. Searches: `grep -rn "newRoot" packages --include='*.ts'`.
4. **`sortByCount()` "order of tied counts is not guaranteed".** MongoDB behaviour; the source test says the same in a comment (`query-builder.test.ts:524`) but does not prove it.

## Things the source has that the page does not document

Reported, not added, to keep the page at its original length:

- `f('address.city')`, the callable form of the `f` argument for dot-paths into value objects, and `f.rawPath(...)` beyond the `redact()` use (`field-accessor.ts:160-210`).
- The no-argument `updateMany()` / `updateOne()` forms on a pipeline chain. The source says they are unreachable from user code (`builder.ts:711` comment), so leaving them out is right.
- `ObjectExpression`, the reduced operator set on a value-object path: `exists`, `eq(null)`, `ne(null)`, `set`, `unset` (`field-accessor.ts:104-113`).

## Page-conventions last bullet

It says the error-reference page is generated and out of scope. My slice does not touch it.

## Line count

Before: 1147. After: 1147. `check-plain.sh`: clean. `pnpm lint:links`: 0 errors.