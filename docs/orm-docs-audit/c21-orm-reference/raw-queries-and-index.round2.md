# Reader review: `index.mdx` and `raw-queries.mdx`

I read both once, top to bottom, as a Prisma 7 user with no knowledge of this version.

---

## Page 1: `/orm/reference/index.mdx`

### Sentences I could not restate after one reading

**1.** "The **pipeline builder** is at `db.query`. It builds MongoDB aggregation pipelines."

What stopped me: the name. `db.query` sounds like "run a query." Two lines later the page writes `runtime.query(plan)`, which is a *different* `query`. I now have `db.query` (build a pipeline) and `runtime.query` (run a plan) and the page never says they are unrelated. I guessed they were the same thing.

Plainer: "The pipeline builder is at `db.query`. It builds MongoDB aggregation pipelines. It is not the same as `runtime.query()`, which runs a built query."

**2.** "In Prisma ORM 7 you passed `findMany({ where, include })` arguments; those arguments are chained methods now, and [Coming from Prisma ORM 7] maps each one."

What stopped me: "those arguments are chained methods now" compresses the single biggest change in the product into half a sentence, buried at the end of a six-sentence paragraph. This is the sentence I most needed and it is the one I nearly skipped.

Plainer: "In Prisma ORM 7 you wrote `findMany({ where, include })`. Now each of those arguments is a method you chain: `.where(...).include(...)`. See [Coming from Prisma ORM 7]."

**3.** "The raw queries page uses prose instead."

Could not restate: "prose instead" of what, exactly — instead of all four parts, or instead of the headings? It also turns out to be wrong: the raw queries page *does* have a `Remarks` heading under `findOneAndUpdate()`. One page contradicting the other on my second click is bad.

### Words I had to guess

- **"a projection across two tables"** — I guessed "picking some columns from a join." The page uses "projection" as if I already write SQL that way.
- **"today it works on PostgreSQL only"** — I guessed "MongoDB support is planned." "Today" is doing work a plain "currently, PostgreSQL only" would do without the wink.
- **`db.orm.public.User`** vs **`db.sql.public.user`** — capital `User`, lowercase `user`, in two adjacent lines of the same code block. I guessed one is the model and one is the table. The page never flags the casing difference, and this is exactly the kind of thing that costs a reader twenty minutes.

### "So what do I actually type?"

**The code block does not run.**

```ts
const rows = await runtime.query(plan);
```

`runtime` is never created. Nothing above it produces a `runtime`. I know `db.runtime()` exists, but the page does not use it, so I do not know whether to write `const runtime = db.runtime()`, `await db.runtime()`, or something else. This is the first code on the first page of the section and I cannot copy it.

**Why does one line need `.build()` and the other does not?**

```ts
const admins = await db.orm.public.User.where(...).all();
const plan = db.sql.public.user.select(...).build();
const rows = await runtime.query(plan);
```

The ORM client is awaited directly. The SQL builder needs `.build()` and then a separate run step. That is a large, load-bearing difference between the two APIs and the page shows it without naming it. I was left guessing whether `.build()` is optional.

### Internals where I wanted instructions

Nothing serious. This page mostly stays on "what to do."

### Could I do what the page is for?

Partly. I can pick which of the three APIs to use — that part works, and it is the page's main job. I could not copy the example and run it, and I would not know how to get a `runtime`.

---

## Page 2: `/orm/reference/raw-queries.mdx`

### Sentences I could not restate after one reading

**1. The warning block (line 14).** This is one paragraph of twelve sentences covering: what a type id is, which API converts values, what `.returnsRow` does, what `.returns` does not do, why `numeric` is a string, why dates are not, and then the entire MongoDB BSON story. I read it before I knew what `fns.raw`, `db.raw.sql`, `.returns()`, or `.returnsRow()` were, because the page has not introduced any of them yet.

I could restate no part of it after one reading. It also forward-references: "which is why the `upperEmail` example below is a plain string" — I have not seen `upperEmail`.

This should be two short warnings, each placed next to the thing it warns about: one in the PostgreSQL section, one in the MongoDB section.

**2.** "A type id such as `pg/text@1` tells Prisma ORM how to turn the database's bytes into a JavaScript value."

Then later: `.returns(codecId)`, `param(value, { codecId })`, `'pg/text@1'`, and "codec" in the error message. **The page calls the same thing three names — "type id", "codecId", "codec" — and never says they are the same thing.** I guessed they were, but only because the values looked identical. Pick one word.

**3.** "On a built raw query, `.returns` is a property: a record of the columns that query declared. That is a different thing from the `.returns(codecId)` method you call on a fragment."

This contradicts its own example. In the code, `authorsWithPosts` ends at `.returnsRow({...})` — there is **no `.build()`** — and then `authorsWithPosts.returns.postCount` is read off it. So `.returns` is a property on something that is *not* built. Either the sentence is wrong or the example is. I could not tell which.

**4.** "`where()`'s callback returns a boolean expression, the same thing the comparison helpers such as `fns.eq(...)` return. A raw fragment declared `.returns('pg/bool@1')` is one, so it satisfies `where()` on its own, with no `fns.eq(...)` wrapper."

"is one" — one *what*? I had to go back two clauses to find "a boolean expression."

Plainer: "A raw fragment that declares `.returns('pg/bool@1')` is itself a boolean expression, so you can pass it straight to `where()` without wrapping it in `fns.eq(...)`."

**5.** "`select()` has three forms, and the two used on this page are the aliased form below and the object form further down."

This tells me a count and two names, defines neither, and points at code I have not read. It is navigation instructions, not information. I would cut it and just link `select()`.

**6.** "TypeScript rejects an options object that names `sort` or `returnDocument`, and an untyped value that names either is dropped with no error at run time."

Two failure modes in one sentence, and "an untyped value" is not a thing I recognise. I guessed it means "an options object typed as `any`."

Plainer: "TypeScript rejects `sort` or `returnDocument` in the options object. If you get past the type check — say, by casting to `any` — those keys are silently ignored at run time."

**7.** "Two of those are `_id` equality filters and `$redact` with `$$KEEP` / `$$PRUNE`."

"Two of those" — of what? The antecedent is "anything the typed pipeline builder can't express," two sentences back and phrased as a mass noun. Plainer: "Two examples: filtering by `_id` equality, and `$redact` with `$$KEEP` / `$$PRUNE`."

### Words and phrases I had to guess

- **"escape hatch"** — guessed: "the way out when the normal API can't do it." Used three times and never defined. It is jargon, but survivable.
- **"the short list below"** (line 52) — guessed it meant the list of inferred types in the `param()` section, which is *four sections later* and is about something else (what Prisma picks automatically), not a list of type ids I may write.
- **"relational-core"** in `@prisma/orm-postgres/relational-core/expression` — guessed this is an internal package name I just have to type. Same for **"query-ast"** in `@prisma/orm-mongo/query-ast/execution`. Both read like directories someone forgot to hide.
- **"a raw collection with nine methods"** — guessed "an object." I counted the nine myself to check.
- **"a write yields a single result object as its one row"** — guessed: "the result comes back wrapped in an array of length 1." Only the `const [result] = ...` in the example made this click.

### "So what do I actually type?"

**1. Where is the list of type ids?** The page shows me `pg/text@1`, `pg/bool@1`, `pg/int8@1`, and `pg/timestamptz-temporal@1`. That last one appears at line 125 with no introduction. There is no link to a complete list. When I need `numeric`, or `jsonb`, or `uuid`, I have nowhere to look. This is the single biggest gap on the page.

**2. `.returns()` with a column instead of a string.** "For a type id that is not in the short list below, take the type from the column instead: `db.sql.public.user.columns.id`." Do I write `.returns(db.sql.public.user.columns.id)`? The page never shows it. `.returnsRow()` takes columns, so I assume `.returns()` does too — but I am guessing at a compile error.

**3. How do I create `db` for MongoDB?** PostgreSQL gets a full setup block: import, `postgres<Contract>({...})`, `await db.connect()`. The MongoDB half of the page gets nothing. I do not know the import path, the constructor call, or the options. Half the page is unrunnable.

**4. `db.connect()` vs `db.runtime()`.** "On PostgreSQL you get the runtime from `await db.connect()`. On MongoDB you get it from `await db.runtime()` instead." So does `db.runtime()` work on PostgreSQL or not? Does `db.connect()` exist on MongoDB? The word "instead" implies they are alternatives for the same job, which means I now have two names for one thing and no rule for choosing.

**5. Does `execute()` return a number or an object?** Line 158: "`runtime.execute(...)`, which answers with the number of rows the statement changed." Line 170: `// stats.affectedRows`. Those are two different return types. I cannot tell whether to write `if (stats > 0)` or `if (stats.affectedRows > 0)`.

**6. Do I interpolate the built query or the unbuilt one?** "A raw query that returns rows can go inside another one." The example interpolates `authorsWithPosts`, which stops at `.returnsRow()`. Everywhere else on the page I am told to call `.build()` before using something. So: `${authorsWithPosts}` or `${authorsWithPosts.build()}`? The example says the former; the surrounding prose implies the latter.

**7. What do I do when I need a dynamic column name?** "Do not build a column or table name from user input with a template; `fns.raw` cannot parameterize an identifier." Correct and important — and then the page stops. I have a real query with a user-chosen sort column. The page tells me what is forbidden and offers no alternative.

**8. Are `RawFindOneAndUpdateCommand`'s trailing arguments optional?** `new RawFindOneAndUpdateCommand('users', filter, update, true, { count: -1 }, 'after')` is six positional arguments with a bare `true` in the middle. If I only want `returnDocument: 'after'` and no sort, do I pass `undefined` for sort? `null`? The page shows one call and no signature.

**9. `tx` is undefined.** "You can also run a built raw query inside a transaction: `tx.query(...)` and `tx.execute(...)`." Where does `tx` come from? No example, no link on that sentence.

**10. The upsert counter contradicts the MongoDB rule.** Line 216 says "Raw filters hold native BSON values, so the examples below build ids with the driver's `ObjectId` class." Then the counter example writes `const filter = { _id: 'pageViews' }` — a plain string `_id`, no `ObjectId`. Is that allowed, or a mistake? I could not tell. (The same example also names a page-view counter `db.raw.collection('users')`, which made me reread it twice looking for the point.)

**11. Why does `_id` filtering need `rawCommand()`?** "Filtering by `_id` works here because a real `ObjectId` in a raw pipeline document matches." But `aggregate<Row>()` also takes raw pipeline documents. So why can't I filter `_id` there? The page implies a difference and does not name it.

### Places the page explains internals when I wanted instructions

**1. The whole type-inference paragraph (line 86).**

> "A whole `number` within the 32-bit signed range, `-2147483648` to `2147483647`, becomes `pg/int4@1`. A larger whole number becomes `pg/int8number@1`, up to JavaScript's safe integer limit of `9007199254740991`. Every other number, including any fractional one, becomes `pg/float8@1`. A `bigint` becomes `pg/int8@1`, a `string` becomes `pg/text@1`, a `boolean` becomes `pg/bool@1`, and a `Uint8Array` becomes `pg/bytea@1`."

Seven mappings and two magic constants in one prose block. This is a table, not a paragraph. And what I actually came for is one sentence: *"Interpolate plain numbers, strings, booleans, bigints, and `Uint8Array` directly. For anything else — a `Date`, a decimal you need as `numeric` — wrap it in `param(value, { codecId })`."* Give me that first, then the table for when I need it.

**2.** "Writing `FROM "user"` with no schema works because PostgreSQL resolves the name through its search path; `public."user"` is the explicit form."

This explains PostgreSQL to me, in the middle of an example about `.returnsRow()`. I did not ask.

**3.** "Every example is transcribed from an executable test suite that runs against a live database."

This is about how the docs are produced. It tells me nothing I can act on. Cut it.

**4.** "Because `returnDocument` is never sent, the driver applies its own default, which is the document as it was before the update."

I am being told the mechanism of a limitation. What I need is the rule: "`findOneAndUpdate()` always returns the document as it was *before* the update. To get the version after, use `db.query.rawCommand(...)`." The page does say this, just after two sentences of plumbing.

**5.** "In plain JavaScript there is nothing to reject it, so the tagged template throws as soon as you call it."

Borderline. The error code and message are useful. The explanation of *why* TypeScript can't help is not.

### Could I do what the page is for?

**PostgreSQL: mostly yes.** After one reading I could write a `fns.raw` fragment in a `select()`, use one as a `where()` predicate, and run a whole `db.raw.sql` statement with `.returnsRow()`. The examples are concrete and the shapes are clear.

What I would still not know:
- Which type id to write for any column type the page did not happen to show.
- Whether `runtime.execute()` gives me a number or an object.
- Whether to `.build()` a subquery before interpolating it.
- What to do about a dynamic column name.

**MongoDB: no.** I cannot create the client — the page never shows how. Every MongoDB example starts from a `db` that does not exist on this page. I could read the nine method signatures and understand what each does, but I could not run one.

**The one thing that would help most:** the page assumes I read it in order, then repeatedly forward-references ("the short list below", "the counter below shows what that costs you", "the object form further down"). Reference pages get read by jumping to a heading. Every section should stand on its own.