Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

1. `"- Inside the callback, query through the `tx` handle, not `db`: `tx.orm` for models, `tx.sql` with `tx.query(...)` (rows) or `tx.execute(...)` (writes that return none) for queries built with the SQL builder, and `tx.enums` and `tx.nativeEnums` for enum members."`
   Five ideas in one sentence, and it introduces `tx.enums` and `tx.nativeEnums` with no explanation of what either is or how they differ. "writes that return none" made me stop: none of what? Plainer: "Query through `tx`, not `db`. `tx.orm` holds your models. Build SQL with `tx.sql`, then run it with `tx.query(...)` to get rows back, or `tx.execute(...)` when the write returns no rows." Then define the enum properties separately, or drop them.

2. `"`connection.destroy(reason)` evicts that one connection from the pool instead of reusing it: Prisma ORM passes a truthy error to `pg`'s `PoolClient.release(err)`, which tells the pool to drop the client."`
   I wanted to know what `destroy` does to me. Instead I got the node-postgres call Prisma makes internally. Plainer: "`destroy(reason)` throws the connection away instead of returning it to the pool."

3. `"`reason` is optional and advisory: the pool only reads whether it is set."`
   I read this three times. I think it means the error I pass is never looked at, only its presence. But then why does the example pass `new Error('connection no longer trusted')`? So what do I actually type — `destroy()` or `destroy(someError)`?

4. `"As designed, it will require a MongoDB replica set and must not silently degrade to non-transactional execution on a standalone server."`
   "must not silently degrade" is a requirement written for whoever builds this, not for me. I cannot act on it. The whole paragraph at line 219 describes software that does not exist; the note above it already told me that.

5. `"Same result as `runtime.prepare(...)`, but the callback receives **two** arguments, `(sql, params)`, because the client has no closed-over SQL builder for you to reach for."`
   "closed-over" is a compiler word explaining why the API is shaped this way. I only needed: "off the client, the SQL builder is handed to you as the first argument."

6. `"A raw query ending with `.affectedCount()` prepares into a `PreparedExecution` instead, consumed with `execute(target, params)`, which resolves the statement's statistics."`
   Three undefined things at once: "raw query", `.affectedCount()`, and "the statement's statistics". What statistics? A row count? There is no example, no options table, and no return type for `PreparedExecution` anywhere on the page.

7. `"The runtime also checks the signal between rows, and passes it into the calls that read each value."`
   Internals. And the next clause tells me the phase can be `'stream'`, `'encode'`, or `'decode'` "depending on where it landed", but never says which is which. If I have to branch on `details.phase`, I still cannot.

8. `"It is the label middleware reads to tell a top-level query from one inside a dedicated connection or a transaction."`
   "middleware" appears here and in the options table and nowhere else on the page. I do not know what middleware is in this product, how to write one, or how it gets this label. Nothing tells me why I would ever set `scope` myself, and the sentence after says setting it does nothing except change the label.

9. `"After a query, it returns an object of the shape `{ lane, target: 'postgres', fingerprint, outcome, durationMs? }`"`
   `lane` and `fingerprint` are never explained, and they are two of the five fields. I cannot use this object.

10. `"A result is consumed once per mode."`
    "mode" is undefined. From the next clause I worked out that the two modes are `await` and `for await`, but the sentence alone told me nothing.

11. `"On PostgreSQL, a query run through the client buffers its rows and hands its pooled connection back before you read them, so a result you hold or iterate slowly no longer keeps a connection checked out."`
    One long sentence about pool mechanics. The part I care about is the last clause. "no longer" also implies a change from version 7 without saying so.

## Words and phrases I had to guess

- `pg/text@1`, `pg/int4@1` — I guessed these are Postgres type names with a version number. I have no idea what the id is for uuid, timestamp, numeric, or an array, and the page never links a list.
- "type id" — guessed it means a string naming a column type.
- `@prisma/orm-postgres/family-runtime` — "family-runtime" means nothing to me. Guessed it is just where lower-level helpers live.
- "a bare transaction context" — guessed: an object with only `query` and `execute`.
- "or a standalone SQL builder" — guessed there is some way to make a SQL builder without a client. The page never says how.
- `Promise<R>` — guessed `R` is whatever my callback returns.
- "plan" — the anchor `#run-a-sql-builder-plan-with-txsql-and-txexecute`, `SqlQueryPlan`, and `(params) => plan` all say "plan", while the prose says "a built query". I guessed they are the same thing. Pick one word.
- `db.connect()` — appears at line 135 with no introduction. I already know `db.runtime()` from the first half. I guessed `connect()` opens the connection and returns the same runtime, mostly because line 287 says calling both is an error.
- "lane", "fingerprint" — no guess. I have nothing.
- `all()` and `createAll()` — assumed these came from the first half. `createAll()` being listed under "the calls that run a read query" still looks wrong to me.

## Where I asked "so what do I actually type?"

- **Isolation levels.** `"There are no `isolationLevel`, `timeout`, or `maxWait` options"`. In version 7 I set `isolationLevel: 'Serializable'` on a transaction. The page tells me the option is gone and then stops. Do I run `SET TRANSACTION ISOLATION LEVEL` myself through `tx.execute`? Through the manual connection? It does not say.
- **Timeouts.** Same sentence removes `timeout` and `maxWait`. Is `signal` the replacement? The page never connects them.
- **Where `runtime` comes from** in "Manual connection and transaction control". Line 182 starts `const connection = await runtime.connection();` with no preceding line defining `runtime`. Same in the `runtime.prepare` examples.
- **Type ids.** I cannot prepare a statement on anything but text without knowing the id, and there is no list or link.
- **`PreparedExecution`.** No example. I do not know what `execute(target, params)` resolves to, so I cannot write the line after it.
- **Nested transactions.** `"transactions do not nest"`. My version 7 code calls a service function that opens its own transaction. What do I do instead — pass `tx` down? The page names the limit and offers nothing.
- **Retries.** No mention of what to do when a transaction fails and should be retried.
- **`RuntimeExecuteOptions` reach.** `"Every runtime `query(...)` and `execute(...)` call accepts a `RuntimeExecuteOptions` object as its second argument."` Does `tx.query` take it? `connection.query`? `ps.query`'s second argument is already `params`, so how do I cancel a prepared statement?
- **Which transaction API to pick.** Three levels are announced, but nothing says when `withTransaction` beats `db.transaction`, or when manual control beats either. "A lower-level transaction helper you import directly" is not a reason to use it.
- **Error codes.** `RUNTIME.TRANSACTION_CLOSED`, `RUNTIME.PREPARE_UNUSED_PARAM`, `RUNTIME.ABORTED`, `RUNTIME.ITERATOR_CONSUMED`, `DRIVER.ALREADY_CONNECTED` all appear as bare strings. Nothing shows me how to read `code` off a caught error, and there is no link to a code list.

## Where it explains the inside when I wanted the outside

- The `pg` / `PoolClient.release(err)` explanation in `destroy`.
- "the client has no closed-over SQL builder for you to reach for".
- "The runtime also checks the signal between rows, and passes it into the calls that read each value."
- The buffering paragraph at line 434.
- The whole MongoDB planned-design paragraph at line 219.

## Two things that look like mistakes

- The heading `##### Run a SQL builder query with `tx.sql` and `tx.execute`` carries the anchor `#run-a-sql-builder-plan-with-txsql-and-txexecute`. Text and anchor disagree.
- The "Options" tables under "Manual connection and transaction control" list method names in a Name/Type/Required table with `—` in Required for every row. Those are not options, and the table gives me no information.
- The return type table says `ps.query` returns `AsyncIterableResult<Row>`, but the example does `await ps.query(...)` and then `inTx[0]!.id`. So an awaited result is an array. Nothing states that plainly.

## Could I do what the page is for, after one reading?

Partly.

I could write a `db.transaction(async (tx) => ...)` and port my version 7 `$transaction([...])` array. The diff at line 91 is the clearest thing on the page and it told me exactly what to do.

I could not:

- Set an isolation level or a timeout. Version 7 code of mine does both.
- Restructure the nested transactions my service layer has today.
- Prepare a statement for any parameter type other than text.
- Use `PreparedExecution` at all.
- Do anything with `scope`, or with the telemetry object's `lane` and `fingerprint`.
- Decide between `db.transaction`, `withTransaction`, and manual connections.
- Handle the abort phases, because I cannot tell `'encode'` from `'decode'`.