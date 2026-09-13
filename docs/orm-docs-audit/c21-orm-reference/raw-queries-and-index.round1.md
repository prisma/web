# Reader review, round 1: index.mdx and raw-queries.mdx

## index.mdx

### Sentences I could not restate

1. "Prisma ORM has three query surfaces." "Query surface" is not a word I know; I guessed "three different APIs for writing queries". Say that.
2. "The pipeline builder gives you a typed way to build MongoDB aggregation pipelines through `db.query`." `db.query` appears here and nowhere else; the other two are named after the property (`db.orm`, `db.sql`), so I expected `db.pipeline`. Plainest: "The pipeline builder builds MongoDB aggregation pipelines. You reach it at `db.query`."
3. "The method reference pages document each method with the classic Remarks / Options / Return type / Examples structure (the raw queries page is deliberately more narrative)." "Classic" to whom? "More narrative": guessed "prose instead of tables". Why am I told this before reading anything?
4. "When a method's behavior differs between PostgreSQL and MongoDB, exists on only one database, or is type-checked but not enforced at runtime, the method's own Remarks call that out inline." Three conditions plus a promise. "Type-checked but not enforced at runtime" stopped me. Plainest: "If a method works differently on PostgreSQL and MongoDB, or exists on only one of them, its Remarks say so."

### Words guessed
- "query surfaces": three separate query APIs.
- "model-level methods like `where()`, `create()`, and `include()`": in Prisma 7 these were arguments, not methods. Guessed they are chained calls now. The page never says this changed, and it is the biggest difference.
- "client lifecycle": connecting and disconnecting.
- "raw escape hatches": the way out when the typed API cannot do it.

### So what do I type?
The whole page: not one line of code. One three-line snippet showing the same query in the ORM client and the SQL query builder would answer the page's own question.

### Contradiction
"Reach for the SQL query builder when you need a join", but the ORM client has `include()`, which is how I did joins in Prisma 7. Which do I use?

### Could I do what the page is for?
Partly: I can pick which page to open. I cannot tell whether my Prisma 7 queries map to the ORM client or the SQL query builder, and I do not know what `db.query` is.

## raw-queries.mdx

### Sentences I could not restate

1. The page-level warning (lines 13 to 15): one block, six claims, `codecId` used four times before it is defined. "`.returnsRow(spec)` names a `codecId` for every column, so its rows are converted just like a builder query's." What is a codec, what does "converted" mean, what does a builder query's row look like? Plainest: "A `codecId` such as `pg/text@1` tells Prisma how to turn the database's bytes into a JavaScript value. `.returnsRow()` needs one per column, so you get real JavaScript values back." "A `fns.raw` fragment's `.returns(codecId)` only tells TypeScript what type to expect, so the value is whatever the driver returns." What is whatever the driver returns? The first example then shows `upperEmail: 'ALICE@EXAMPLE.COM'`, a normal string, so the warning scared me and the example contradicted it.
2. Line 23: "A whole raw statement is a complete SQL statement written with `db.raw.sql`, which you terminate with `.returnsRow(spec).build()` for a plan `runtime.query(...)` streams rows from, or `.affectedCount().build()` for a plan `runtime.execute(...)` reports statistics for. Both sizes end in a plan, so both go through the same middleware and the same runtime." Too much: two APIs, two terminators, two runtime methods, "plan" and "middleware" both new. "Streams rows from" made me expect an iterator; the example awaits an array. Plainest: "Write the statement with `db.raw.sql`. If it returns rows, end with `.returnsRow(spec).build()` and run it with `runtime.query(plan)`. If it does not, end with `.affectedCount().build()` and run it with `runtime.execute(plan)`."
3. Line 67: "Interpolating another `Expression` ... splices that expression's AST into the fragment. It is not a string concatenation of rendered SQL: the interpolated expression lowers to its own AST node, so it stays parameterized and type-checked." Internals. Needed: "Interpolated values are always sent as query parameters, never pasted into the SQL string."
4. Line 84: "A bare JavaScript value can be interpolated directly, and the adapter picks a `codecId` for it from its JavaScript type: `number` becomes `pg/int4@1`, `pg/int8number@1`, or `pg/float8@1` depending on its range". "The adapter": first mention. "Depending on its range" gives no ranges. If I pass 3000000000, which do I get?
5. Line 118: "`db.raw` is the client's raw SQL API ... Its one key, `sql`, is the same tagged template as `fns.raw`." Wrong by the page's own account: line 212 uses `db.raw.collection(...)`.
6. Line 171: "A row-returning raw query composes: interpolate one into another template and its SQL and its parameters are spliced into the outer statement, in order, which is how you build a subquery or a CTE. The outer template declares its own row spec, and a column the inner query already declared can be inherited from its `.returns` record rather than restated." Four ideas. Also `.returns` is now a property holding a record, after being a method in five earlier examples.
7. Line 198: "A statement terminated with `.affectedCount()` is a plan handle, not a row source, so it cannot be interpolated." Invented terms. Plainest: "You cannot interpolate an `.affectedCount()` statement, because it produces no rows. You can interpolate an `UPDATE ... RETURNING`, because it does."
8. Lines 202 to 208: "Interpolating anything else, such as a `Date`, throws synchronously with code `RUNTIME.RAW_SQL_UNSUPPORTED_INTERPOLATION`" then "TypeScript already rejects an unsupported value at compile time." If TypeScript rejects it, when does the runtime error fire? The quoted message has literal ellipses, so I cannot match it.
9. Line 313, `findOneAndUpdate()`: "The MongoDB command AST carries `sort` and `returnDocument` fields, but the public wrapper does not expose them ... a value that reaches the call untyped is dropped without a run-time error." Internals. Needed: "`findOneAndUpdate()` accepts only `{ upsert }`. To sort, or to get the document after the update, do X." It then names `new RawFindOneAndUpdateCommand(...)` with no code and no import.
10. Line 346: "runs a raw MongoDB aggregate command through the pipeline builder, bypassing the typed AST. Its rows come back as `unknown`; you type them yourself." How? `aggregate<Row>()` took a type parameter; does this?

### Words guessed
"raw driver values" (values with no Prisma conversion); `codecId`; "a plan" (a prepared object you hand to the runtime); "middleware" (mentioned once, never explained); "a function bag `fns`"; "the adapter" (the PostgreSQL driver layer); `Expression`; "contract column" (`user.columns.id`); "the contract's lowercase plural root" (the collection name); "buildable command"; "return an image of it"; "row source" / "plan handle".

### So what do I type?
1. Two ways to get a runtime, both unexplained: PostgreSQL `const runtime = await db.connect()`, MongoDB `(await db.runtime()).query(plan)`. How do they relate? Which do I use?
2. Where is the list of `codecId` values? I see eight; `pg/timestamptz-temporal@1` appears once, unexplained. For a uuid, jsonb, or numeric I have no idea and no link.
3. `new RawFindOneAndUpdateCommand(...)`: the only way to sort or get the post-update document, with no signature, import, or example.
4. Filtering by `_id` in a raw pipeline: line 356 says `rawCommand()` exists partly for `_id` equality filters and then sends me to another page. Four lines of code would do.
5. Undeclared variables in every example: `aliceId`, `bobId`, `limit`, `kind`, `minPosts`. On MongoDB `aliceId` is a hex string (`new ObjectId(aliceId)`); on PostgreSQL presumably a UUID. Never said.
6. Is `fns.raw` safe with user input? "Stays parameterized" is buried under AST language, and nothing is said about interpolating a column or table name from user input, which is the real danger.
7. Two forms of `select()` with no bridge: `.select('upperEmail', (f, fns) => ...)` and `.select((f) => ({ id: f.id, serverNow }))`.
8. MongoDB writes go through `query()`, not `execute()`, destructured out of an array; PostgreSQL writes go to `execute`. Never pointed out.
9. Can I run a raw query inside a transaction? Nothing.

### Internals instead of instructions
Line 67 (AST); line 23 (middleware, plans); line 313 (command AST, wrapper); line 346 (typed AST); line 263 "`insertMany()`'s `insertedIds` is a plain array of `ObjectId`, reshaped from the native driver's index-keyed map".

### Smaller things
`.returnsRow(spec)` is singular but returns many rows. Line 137's SQL writes `FROM "user"` with no schema while the page insists tables live under `db.sql.public`. The MongoDB section says `'users'`, `'posts'`, `db.orm.users`, while elsewhere models are `db.orm.public.User`; no sentence explains that MongoDB has no schema segment.

### Could I do what the page is for?
PostgreSQL raw SQL: mostly yes. Still unknown: which `codecId` for types not in the short list; whether a fragment's value comes back usable; whether interpolating user input is safe. MongoDB raw commands: no for the two cases I would hit: sorting or post-update document from `findOneAndUpdate`, and filtering by `_id` in a `rawCommand`.
