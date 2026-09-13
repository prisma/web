Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**1.** "Use `withTransaction(...)` in a helper or a library that is handed a runtime rather than a client."
Stopped by: I do not know why anything would be handed a runtime instead of the client, or how that happens. The page never shows a helper receiving one. Plainer: "If you are writing a function that takes a runtime as a parameter instead of the client, use `withTransaction(...)`." And then show that function signature.

**2.** "Open a connection and drive the transaction yourself when you need the same connection between statements."
Stopped by: this contradicts the next section. Remark 1 under `db.transaction` says "Every call on `tx` uses the same transaction connection." So `db.transaction` already gives me the same connection between statements. I cannot tell what the manual path actually buys me. The same sentence repeats at line 164, so the contradiction is doubled, not clarified.

**3.** "Nothing retries a failed transaction for you, so when PostgreSQL reports a serialization failure, call `db.transaction(...)` again yourself."
Stopped by: two ideas fighting. The sentence before says there is "no way to set the isolation level." Serialization failures are a serializable-isolation thing. So either the default isolation can produce them and the page should say so, or this advice is unreachable. I also do not know what error code a serialization failure arrives as — the page tells me to compare `error.code` with a string everywhere else, but not here.

**4.** "Annotate that parameter with `TransactionContext`, imported from `@prisma/orm-postgres/family-runtime`, which covers `query` and `execute`."
Stopped by: "covers" — covers what? I assume it means the type only has those two methods, but that contradicts the `tx` I get from `db.transaction`, which has `orm` and `sql` too. So if I annotate my helper's parameter with `TransactionContext` and pass it my `tx`, do I lose `tx.orm` inside the helper? The page does not say. No code example.

**5.** "`for await` does not save memory on PostgreSQL: every row is loaded first."
Stopped by: this tells me the one reason I would reach for `for await` does not apply, then gives a different upside about pooled connections that I cannot map to a decision. After one reading I do not know which one to use.

**6.** "Same result as `runtime.prepare(...)`, but off the client the SQL builder is handed to you as the first argument."
Stopped by: "off the client" used as a preposition twice on the page ("Prepare a statement off a runtime", line 230) and I had to guess it means "from". Plainer: "`db.prepare(...)` does the same thing, but it passes you a SQL builder as the callback's first argument, so you do not need `db.sql`."

**7.** "`prepare()` starts the connection itself, so calling `db.connect()` afterwards rejects with an error whose `code` is `DRIVER.ALREADY_CONNECTED`. Reach for the runtime with `db.runtime()` instead, which returns the one `prepare()` already built."
Stopped by: three ideas in two sentences, and "the one `prepare()` already built" has no antecedent I can resolve — the one *what*? The runtime? The connection? I think it means `db.runtime()` returns the already-connected runtime, but I am guessing.

**8.** "A signal that is **already aborted** when you call `query(...)` rejects before any row is fetched, with an error whose `code` is `RUNTIME.ABORTED` and whose `details.phase` is `'stream'`."
Stopped by: the phase says `'stream'` but nothing streamed. If `'stream'` is the value even when zero rows were fetched, what other values exist? The next line says "`details.phase` says where the abort landed" without listing the possible values. Useless to me as written — I cannot branch on it.

**9.** "`lane` names which API built the query, such as `orm-client` for `db.orm` or `raw` for `db.raw.sql`."
Stopped by: "lane" is a word I have never seen used this way. The examples rescue it, but I had to read it twice. Plainer: call the field what it is, or say "`lane` is the name of the API you used."

**10.** "`durationMs` is how long the query took, and the runtime records it for every query it times."
Stopped by: circular. It records the duration for every query it times — which queries does it not time? The type is written `durationMs?`, so it is sometimes absent, and this sentence is exactly the sentence that should tell me when, and does not.

**11.** "Multi-document transactions for MongoDB are planned, but nothing on this page works on MongoDB today."
Stopped by: flatly contradicted by the last line of the page: "the full rules on reading a result, shared identically by PostgreSQL and MongoDB." The `AsyncIterableResult` section is on this page and does work on MongoDB. It also repeats the callout directly above it almost word for word.

## Words and phrases I had to guess

- **`family-runtime`** in `@prisma/orm-postgres/family-runtime`. I have no idea what "family" means. I guessed it is just an import path I copy and never think about. If that is true, fine, but it reads like it means something.
- **`@1` in `pg/text@1`.** I guessed a version number for the encoding. Never explained.
- **`pg/timestamptz-temporal@1`.** I guessed "temporal" means it maps to the TC39 Temporal API rather than `Date`. Pure guess, and if I guessed wrong my column types are wrong.
- **`codecId`** ("It is called `codecId` in code"). Guessed: the internal name of the same string. I do not know why I was told.
- **`SqlQueryPlan`.** Introduced only as "what the tables below call `SqlQueryPlan`". I guessed it is the return type of `.build()`, the thing part 1 called "the built query". Two names for one thing.
- **"plan"** in the anchor `#run-a-sql-builder-plan-with-txsql-and-txexecute` while the visible heading says "query". I guessed they are the same and the anchor is stale.
- **"bound the queries"** (line 13). Guessed: put a time limit on them.
- **"The `target` is explicit"** (line 326). Explicit as opposed to what? I guessed it means "you must pass it, it is not inferred."
- **`toArray()`** in the warning example (line 90). Nowhere defined. The `AsyncIterableResult` section says `await` the result or `for await` it — `toArray()` is a third thing that appears once, in the one example I most need to trust.
- **"Evict"** in `connection.destroy()`. Guessed: remove from the pool permanently. The Remarks say "throws that connection away", the table says "Evict" — pick one word.

## Places I asked "so what do I actually type?"

1. **`TransactionContext`.** "Annotate that parameter" — show me the function. `async function addTag(tx: TransactionContext) { ... }`. This is the recommended fix for nested transactions and it has zero code.
2. **Getting a type id from a column.** "To take one straight from a column, read `db.sql.public.user.columns.id`." Read it and do what with it? Does it *return* `'pg/uuid@1'`? Can I write `prepare({ id: db.sql.public.user.columns.id }, ...)`? One line of code would settle it.
3. **The full list of type ids.** I get four examples plus "the PostgreSQL type plus `@1`". Is it literally `pg/` + the PostgreSQL type name + `@1`? Then what is `timestamptz-temporal`? That is not a PostgreSQL type name. I cannot construct one for `jsonb` or `numeric` with confidence.
4. **MongoDB transactions.** "share one `MongoClient` between Prisma ORM and your driver code and use a driver session." No code at all. This is the only thing a MongoDB reader came to this section for, and it is one sentence and a link.
5. **Cleaning up a manual connection when something throws.** Both manual examples are happy-path straight lines. If `transaction.execute(...)` throws, `connection.release()` never runs and I have leaked a pooled connection. The page tells me "Always `release()` the connection when done" but shows no `try`/`finally`. Show the `try`/`finally`.
6. **Does `release()` after `rollback()` differ from after `commit()`?** And what happens if I release without committing — implicit rollback, or an error? Not stated.
7. **Preparing a write from the SQL builder.** Line 316 says a `PreparedExecution` comes from "raw SQL with `db.raw.sql` and ending in `.affectedCount()`". Can I prepare `db.sql.public.tag.insert([...])`? The section on `db.transaction` uses exactly that shape with `tx.execute`. Unanswered.
8. **What `prepare` does with parameters in the raw example.** `db.raw.sql\`... label = ${'archived'} ...\`` with `prepare({}, ...)` — the values are baked into the statement and the declaration is empty. So how do I write a prepared *execution* that takes parameters? The one example shows the case where I would not need prepare at all.
9. **Disposing a prepared statement.** Is there a `close()`? Do they leak? Do I keep one per process? Nothing.
10. **Does `signal` abort the transaction or only the statement?** Line 13 tells me to pass a signal to each call inside `db.transaction`. If one statement aborts mid-transaction, does the transaction roll back? I assume yes because the callback throws — but "assume" is the word.
11. **Transaction timeouts.** "There are no `isolationLevel`, `timeout`, or `maxWait` options." Coming from Prisma 7, where `timeout` defaults to 5 seconds, my first question is: does a transaction now run forever? Not answered.

## Places the page explains internals when I only wanted to know what to do

- **"It is called `codecId` in code."** I do not read the source. Delete it.
- **"`db.transaction(...)` is built on it."** (line 112) True but irrelevant to choosing between them.
- **The whole `scope` remark** (line 375). Three lines to introduce an option, explain that middleware consumes it, and then tell me "Do not pass it yourself." If I must not pass it, it does not belong in a reference of options I pass. One sentence under the table would do: "`scope` is set for you; do not pass it."
- **"`for await` does not save memory on PostgreSQL: every row is loaded first. The upside is that a result you hold or read slowly does not keep a pooled connection checked out, because the client hands the connection back before you read the rows."** This is connection-pool mechanics. What I need is the rule: use `await`; use `for await` when X.
- **"An `AsyncIterableResult` is tied to the transaction connection."** (line 82) The rule that matters is "collect rows inside the callback." The reason is fine as a half-clause; it currently opens the callout.

## Broken or mislabeled references

- **"(see the Remark below)"** at line 18. The thing below is a `:::warning` callout, not a Remark, and it sits after the Examples. I scrolled looking for a bullet.
- **"See [`postgres(options)`](#postgresoptions)"** in the return-type table for `tx.enums`. That anchor is on the half of the page I do not have, and the link text tells me nothing about why I would follow it.
- **The `tx.enums` / `tx.nativeEnums` row is in a table headed "Return type".** They are not return types of `db.transaction`. It confused me into thinking `db.transaction` returns them.
- **The manual-control table is headed "Options"** but its columns are `Method | Type | Description` and every Type cell says "none". It is a method list wearing an options heading.
- **`#run-a-sql-builder-plan-with-txsql-and-txexecute`** — anchor says "plan", heading says "query".

## Could I do what this page is for, after one reading?

Partly. I could write `db.transaction(async (tx) => ...)` with `tx.orm` and `tx.execute`, and I could port my `$transaction([...])` array. The migration diff at line 96 is the single most useful thing on the page — it is the only place that connects what I already know to what I now type.

Beyond that, no.

What I still would not know:

- **When to use the manual connection path.** The stated reason ("the same connection between statements") is the same thing `db.transaction` already gives me. I would use `db.transaction` for everything and never find out what I was missing.
- **How to write a helper that takes a transaction.** The page tells me to do this to avoid nesting and then shows no code and leaves me unsure whether the helper can still use `tx.orm`.
- **How to build a type id for any column that is not `text`, `int4`, `uuid`, or `bool`.** So I could not prepare a statement against my own schema.
- **How to prepare anything parameterized that writes.** The only `PreparedExecution` example hard-codes both its values.
- **Whether my transactions can hang.** No timeout, no default stated.
- **What to catch and retry.** I am told to retry serialization failures and given no code to compare against, on a page where every other error hands me an exact string.
- **How to clean up safely.** Every manual example leaks the connection if a statement throws.
- **Anything about MongoDB transactions** beyond "not yet", stated three times.

One correctness problem worth checking with the author: `escaped.rows.toArray()` at line 90. `toArray()` appears exactly once on this page and is absent from the `AsyncIterableResult` section that claims to give the reading rules. Either that section is missing a method or the example is wrong.