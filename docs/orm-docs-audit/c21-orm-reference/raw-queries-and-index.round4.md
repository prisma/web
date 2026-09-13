I read both pages once, top to bottom, as a Prisma ORM 7 user who has never seen version 8.

# Page 1 — `index.mdx` (reference landing page)

## Sentences I could not restate after one reading

**1. The whole of line 15.** This is one paragraph carrying eight separate ideas:

> "Plus raw SQL and raw commands when none of them fits. See [Raw queries]... For connecting and disconnecting the client, transactions, and prepared statements, see [Transactions and runtime]... In the example below, `db.runtime()` returns the connection that runs a built query. Create it once and reuse it. `.all()` runs the query and returns every row. It is what replaced `findMany`. The ORM client runs when you `await` it. The SQL query builder and the pipeline builder do not run on their own. Each produces a built query with `.build()`, which you then run with `runtime.query(...)`. Watch the casing: `User` is the model name and `user` is the table name."

What stopped me: two link paragraphs, a definition of `runtime`, a definition of `.all()`, a migration note, an execution-model rule, and a naming warning are all in one block with no headings. I had to re-read it three times to find the one rule that matters, which is "the ORM client runs on `await`, the two builders need `.build()` then `runtime.query()`."

Plainer: split it. One short paragraph for "when to use raw queries and transactions, with links." Then a small section titled "How a query runs" containing only: the ORM client runs when you `await` it; the SQL query builder and pipeline builder return a built query from `.build()`, which you run with `runtime.query(...)`; get `runtime` from `db.runtime()` once and reuse it. Then a one-line callout for the casing rule.

**2.** > "it returns results that are not model rows, such as an aggregate over a join."

"Model rows" is not defined anywhere on this page. I guessed it means "objects shaped like your model, the kind `db.orm` gives back." Plainer: "it returns whatever shape your `select()` asks for, not objects shaped like your models."

**3.** > "`db.query` builds MongoDB pipelines. The separate `runtime.query()` method is what runs any built query."

The word "separate" told me these two are being confused on purpose, but it did not tell me why I should care. I could not restate what problem this sentence is solving. Plainer: "Two different things are both named `query`. `db.query` builds a MongoDB pipeline. `runtime.query(...)` runs a query that has already been built."

## Words and phrases I had to guess

- **"built query"** — used three times before anything defines it. I guessed it means a plain object describing the query that has not been sent to the database yet.
- **`plan`** — the code names the variable `plan`, but the prose only ever says "built query." I guessed they are the same thing. The page never says so.
- **"the connection that runs a built query"** — is `runtime` a database connection, a connection pool, or a wrapper? "Create it once and reuse it" implies it is expensive, which implies a pool. I guessed pool.
- **`(u) => u.kind.eq('admin')` versus `(f, fns) => fns.eq(f.kind, 'admin')`** — two callback styles appear on consecutive lines in the same code block, and the page does not mention that they differ. I guessed the ORM client puts the comparison on the column and the SQL builder puts it in a helper object. I would not have been able to write either one from memory.
- **"typed"** in "three typed ways to write a query" — I guessed it means TypeScript checks the column names and result types.

## Places I asked "so what do I actually type?"

- **MongoDB.** The page says the SQL query builder is "PostgreSQL only" and that `db.query` "builds MongoDB aggregation pipelines," but the only code block is PostgreSQL. `const runtime = db.runtime();` is shown with no `await`. On MongoDB that line is wrong — I only found that out on the raw-queries page, at line 25. If I were a MongoDB user, I would have copied the broken line from the landing page.
- **Is `db.query` available on PostgreSQL?** The page says what it builds. It never says it does not exist on PostgreSQL, the way it does for `db.sql`. I do not know what happens if I type it.
- **`runtime.execute`** is never mentioned. The landing page implies `runtime.query(...)` runs everything. The raw-queries page then reveals a second method for statements that return no rows. The landing page's model of "how a query runs" is incomplete, and I did not know that until the next page.
- **`.all()`.** It is introduced as what replaced `findMany`. Do the SQL query builder and pipeline builder have `.all()` too? The example uses `.build()` for those instead, so I guessed no, but the page does not say.

## Places it explains internals when I wanted instructions

Only one, and it is mild: "The SQL query builder and the pipeline builder do not run on their own." That is a fact about the design. The instruction I needed is "call `.build()`, then `runtime.query(...)`," which arrives in the same sentence but second.

## Could I do what the page is for, after one reading?

Mostly. Its job is to send me to the right sub-page, and I can do that: everyday reads and writes go to `db.orm`, PostgreSQL joins and aggregates to `db.sql`, MongoDB pipelines to `db.query`. What I would still not know: how to get a `runtime` on MongoDB, that `runtime.execute` exists, and how to write either callback style without copying the example.

# Page 2 — `raw-queries.mdx`

## Sentences I could not restate after one reading

**1.** > "A type id such as `pg/text@1` tells Prisma ORM what JavaScript type a column should become. In code, the property is called `codecId`."

Two names for one thing, introduced in consecutive sentences, with no reason given. I still do not know what a "codec" is here or why the property is not called `typeId`. Plainer: pick one name and use it everywhere; if the property really is `codecId`, say "the property is named `codecId` for historical reasons" or just call the thing a codec id throughout.

**2.** > "A date column arrives as whatever the `pg` package produces for it, with no conversion by Prisma ORM."

This is the sentence I most needed an answer from, and it refuses to give one. I do not know what I get. A `Date`? A string? The page tells me to go read another project's documentation to find out. Plainer: say the actual type, for example "a `timestamptz` column arrives as a JavaScript `Date` in local time."

**3.** > "Never put user input into the SQL text itself, because a column or table name cannot be a parameter."

The reason does not support the rule. User input should never go into SQL text because of SQL injection. The fact that identifiers cannot be parameters is a *different* fact, and it is the reason you might be tempted to. Reading this once, I thought the page was saying user input is fine as long as it is not a column name. Plainer: "Interpolated values are sent as query parameters, so they are safe. Column and table names cannot be parameters, so they would be pasted into the SQL text. Never build an identifier from user input."

**4.** > "A type id is the PostgreSQL type name plus a version, always `@1` today."

This contradicts the table directly above it. `pg/int8number@1` and `pg/timestamptz-temporal@1` are not PostgreSQL type names. I could not restate the rule because the rule is wrong. Plainer: "A type id is `pg/`, a name, and a version. The name is usually the PostgreSQL type, sometimes with a suffix saying which JavaScript type you get back."

**5.** > "You can nest a `.returnsRow()` query inside another. That is how you write a subquery or a CTE. Interpolate it before `.build()`, and call `.build()` on the outer one only. Its `.returns` property holds its declared columns, so `outer.returnsRow({ postCount: inner.returns.postCount })` reuses a declaration. Three names look alike. `.returns(typeId)` is a method on a fragment, `.returnsRow(spec)` is a method on a statement, and `.returns` is a property on the object `.returnsRow()` gives you. You cannot nest a statement that ends with `.affectedCount()`, because it produces no rows. You can nest an `UPDATE ... RETURNING`, because it does."

Six unrelated rules in one paragraph. The "three names look alike" list is genuinely useful and is buried in the middle of it. "CTE" is never expanded. Plainer: make the three-names list its own callout, and give nesting its own short paragraph.

**6.** > "Each of these nine methods builds a command. Call `.build()` on it, then run it with `runtime.query(built)`, the inserts, updates, and deletes included."

The trailing clause reads like an afterthought and carries the surprise. On PostgreSQL the page just told me that statements returning no rows go through `runtime.execute(...)`. Here, deletes go through `runtime.query(...)`. Nothing explains why the rule flips. Plainer: "Run every one of these with `runtime.query(...)`, including the writes. `runtime.execute(...)` is PostgreSQL only."

**7.** > "The write methods give you its own result objects, `{ insertedId }`, ... and you read those keys directly."

"its" points back to "the `mongodb` package" two sentences earlier. On one reading I read "its" as pointing to "the write methods" and stalled.

**8.** > "The **first** call to an upsert counter returns an **empty** result, because there is no earlier version. Read the counter value on the second call and later ones, each of which returns the version before its own increment."

I had to read this three times. The behavior is simple but the wording is not. Plainer: "`findOneAndUpdate` returns the document as it was *before* your update. The first call creates the document, so there is nothing to return and you get `[]`. The second call returns `count: 1`, which is the value before that call added one."

Also, the example undercuts itself: > "The example schema has no counter collection, so `users` stands in for one here, with the plain string `'pageViews'` as its `_id`." The warning two sections earlier told me to build ids with `ObjectId`. Now the example uses a plain string as `_id` with no comment. I could not tell whether that was allowed on purpose or an artifact of the stand-in.

## Words and phrases I had to guess

- **"spec"** in `.returnsRow(spec).build()` (line 19). Introduced with no definition. It is defined at line 136, over 100 lines later. On first reading I guessed it was a schema object.
- **"projection"** in the heading "`fns.raw` in a projection". Never used again on the page. I guessed it means the `select()` list.
- **`Contract`, `contract.d`, `contract.json`** — the code imports all three. I know what a contract is, but not that it compiles into two generated files, nor where they come from. I guessed a code-generation step I have not been shown.
- **`Temporal.Instant`** — described as "the standard JavaScript object for a point in time." It is used at line 99 with no import and no note about runtime support. I guessed my Node version has it. That guess may well be wrong, and the page gives me nothing to check against.
- **"codec"** — see above. Guessed: the thing that converts between a PostgreSQL wire value and a JavaScript value.
- **"CTE"** — I know it, but it is never expanded, and it is the only unexpanded acronym on the page.
- **"native BSON values"** — guessed: the raw objects the MongoDB driver produces, without any Prisma conversion.
- **`pg/int8number@1` versus `pg/int8@1`** — one reads back as `number`, the other as `bigint`. I guessed I choose based on whether I want to risk precision loss. The page never says when to pick which.

## Places I asked "so what do I actually type?"

1. **Finding a type id for a column that has no contract match.** > "The ids your contract uses are in `contract.json`." Where in it? What key? There is no path, no example fragment, no shape. This is the single most likely thing I will need, and the page points at a file and walks away. `db.sql.public.<table>.columns.<column>.codecId` is given for columns I *do* have, which is the easier case.

2. **`Temporal`.** Do I import it? Enable a flag? Install a polyfill? The `param` and `ObjectId` imports are both spelled out. `Temporal` is not.

3. **Reading documents raw on MongoDB.** There are nine methods and none of them is `find` or `findOne`. I wanted a plain raw read. I eventually worked out that `aggregate<Row>()` with a `$match` is the answer, but the page never says "there is no raw `find`; use `aggregate`."

4. **What happens when a raw query fails.** The page documents exactly one error, `RUNTIME.RAW_SQL_UNSUPPORTED_INTERPOLATION`. Nothing about a SQL syntax error, a constraint violation, or a `.returnsRow()` spec that does not match the real columns. If my spec is wrong, do I get a run-time error or silently wrong values? I do not know.

5. **Transactions on MongoDB.** PostgreSQL gets `tx.query(...)` and `tx.execute(...)` at line 157. The MongoDB half says nothing. I do not know whether raw MongoDB commands can run inside a transaction.

6. **`.returnsRow()` when a column can be null.** Fragments get `{ codecId, nullable }` with its own section. For a whole statement's spec, entries are "either a column from your contract or a type id." A bare type id has no nullability. What do I type for a nullable column with no contract match, such as a `LEFT JOIN` column? Not covered.

## Places it explains internals when I only wanted to know what to do

1. > "If you get past the type check, say by casting the object to `any`, those keys are ignored at run time with no error." (line 289)

This tells me how the implementation behaves when I defeat its own type checking. I did not want to know. The instruction I wanted was the next sentence: use `RawFindOneAndUpdateCommand`.

2. > "runs a raw MongoDB aggregate command through the [pipeline builder], with no translation of the command you pass." (line 335)

"Through the pipeline builder, with no translation" is about plumbing. What I need is the three practical facts, which are in the *rest* of the paragraph: it is already built so do not call `.build()`, rows come back as `unknown`, and you cast them.

3. **`RawFindOneAndUpdateCommand` in general.** Being sent to `@prisma/orm-mongo/query-ast/execution` to hand-build a command object with six positional arguments, because the friendly method deliberately refuses `sort` and `returnDocument`, is the tool's internal shape showing through. The page even needs a `// collection, filter, update, upsert, sort, returnDocument` comment above the call so I can read my own code. I do not know whether that import path is supported or will break on the next release.

4. > "`.returns(...)` only tells TypeScript what to expect. It does not cast the value in SQL and it does not change how the `pg` package reads it."

Three sentences about what a method does *not* do, and no sentence about what to type when I actually want the conversion. The answer, use `.returnsRow()` instead, is somewhere else.

5. > "`rawCommand()` is the way out when the typed pipeline builder can't express a query, such as filtering by `_id` equality."

A significant limitation of a different API is disclosed in a subordinate clause on this page. If the pipeline builder cannot filter by `_id` equality, I want to know that in bold, on the pipeline builder page, not as an example here.

## Could I do what the page is for, after one reading?

**PostgreSQL: yes, for the common cases.** I could write a `fns.raw` fragment in a `select()`, use one as a `where()` predicate, and run a whole `db.raw.sql` statement with `.returnsRow()`. The examples are complete and I could copy them.

**What I would still not know on PostgreSQL:**
- What JavaScript value I actually get for a date, a `numeric`, or a `json` column from a fragment's `.returns()`. The page tells me it does not convert and names no types.
- How to find a type id for a column my contract has no match for. I was pointed at `contract.json` with no instructions.
- Whether `Temporal` works in my runtime or needs anything installed.
- What happens when a `.returnsRow()` spec does not match the real result columns.
- How to declare a nullable column inside a `.returnsRow()` spec.

**MongoDB: partly.** I could copy the insert, update, and delete examples and they would probably work. But I would not know:
- That there is no raw `find`, and that `aggregate` is the substitute.
- Why writes go through `runtime.query` here when they go through `runtime.execute` on PostgreSQL.
- Whether raw commands work inside a transaction.
- Whether a plain string `_id` is genuinely allowed, or just an artifact of the counter example borrowing the `users` collection.

The two biggest structural problems, in order: the type-id system is introduced through its restrictions and its two names rather than through a straight answer to "what type do I get back," and the landing page's line 15 buries the one execution rule a reader needs under seven other ideas.