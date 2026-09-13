I read `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/ref/r4/transactions-and-runtime.part2.mdx` top to bottom, once.

# Sentences I could not restate after one reading

**Line 3.** "Open a connection and drive the transaction yourself when you need statements on one connection outside a transaction, such as a `SET` before you begin."
Stopped by: "drive the transaction yourself" names no method, and "statements on one connection outside a transaction" is three ideas stacked. I did not know what "open a connection" meant in this API until line 156 told me it is `runtime.connection()`. Plainer: "If you need to run a statement like `SET` on the same connection before the transaction starts, get a connection with `runtime.connection()` and call `commit()` or `rollback()` yourself."

**Line 14.** "To pass the full `tx`, take its type from the client: `type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]`."
Stopped by: nested `Parameters<...>` with two index accesses. I can decode it given a minute, but not in one reading, and the page does not say why no exported type exists. Plainer: add "There is no exported type for the full `tx`, so derive it:" before the code.

**Line 19.** "Do not let an `AsyncIterableResult` escape the callback unread."
Stopped by: `AsyncIterableResult` is not defined until line 423, the last section of the page. On first reading it is a word I have never seen. "escape ... unread" is a metaphor. Plainer: "`tx.query(...)` returns a result object that only works while the transaction is open. Read it inside the callback."

**Line 116.** "That path holds the SQL runtime API, the same one for every SQL database."
Stopped by: I do not know what "the SQL runtime API" is as a thing, and "the same one for every SQL database" tells me about Prisma's internal layering, not about what I do. Also the import path contains `family-runtime` and the page never says what a "family" is.

**Line 310.** "A statement written as raw SQL with `db.raw.sql` and ending in `.affectedCount()`, which asks for a row count instead of rows, prepares into a `PreparedExecution` instead."
Stopped by: four ideas in one sentence (raw SQL, `.affectedCount()`, what it means, the resulting type). Plainer: "Some queries return a row count instead of rows. End the query with `.affectedCount()`. Preparing one gives you a `PreparedExecution`, which you run with `execute(target, params)`. It resolves to `{ affectedRows }`."

**Line 368.** "A signal that is already aborted when you call `query(...)` rejects before any row is fetched, with an error whose `code` is `RUNTIME.ABORTED` and whose `details.phase` is `'stream'`."
Stopped by: the phase is `'stream'` for a query that never streamed anything. That reads like a contradiction, and nothing explains it.

**Line 400.** "`durationMs` is how long the query took, and it is present for every query the runtime ran."
Stopped by: the type is written `durationMs?` twice (line 400 and the example comment on line 418). Optional in the type, always present in the prose. I could not tell which to trust or whether I need a null check.

**Line 400.** "`lane` is the name of the API you used, such as `orm-client` for `db.orm` or `raw` for `db.raw.sql`."
Stopped by: "lane". I only understood it because of the examples. The word carries no meaning on its own.

**Line 425.** "`for await` does not reduce memory on PostgreSQL: every row is loaded first."
Stopped by: this removes the only reason I would have used `for await`, and the page does not say whether it is different on MongoDB or why I would ever pick it. Line 423 offers it as an equal option and line 425 says it is pointless. I could not tell what the page wants me to do.

# Words and phrases I had to guess

- **"family-runtime"** (lines 14, 116, 138, 342) — I guessed a "family" is a group of databases that share a runtime, so PostgreSQL/MySQL/SQLite. The page never says.
- **"SqlQueryPlan"** (lines 229, 238, 284) — I guessed this is just the type of what `.build()` returns. Line 229 says so, but the name "plan" made me expect something I had to inspect or execute differently.
- **"codecId"** (line 228) — I guessed "codec" means the encoder/decoder for a column's type, and `codecId` gives me the same string as `'pg/text@1'`.
- **"type id"** / **"`pg/text@1`"** (line 228) — I guessed these are Prisma's own names for PostgreSQL types. I could not guess which id to use for a `String` column vs a `DateTime` beyond the two examples given.
- **"`pg/timestamptz-temporal@1`"** (line 228) — I guessed "temporal" refers to the JS Temporal API. Not stated.
- **"fingerprint"** (line 400) — I guessed a hash of the query text. The page says what it is for, which was enough.
- **"scope"** (line 371) — I guessed it is an internal tracing field. Guessing was forced: the page names it, tells me not to pass it, and never says what it is.
- **"lane"** (line 400) — guessed above.
- **"target"** (line 320) — I guessed "the thing that owns the connection the statement runs on." The word alone told me nothing.
- **"the offending names"** (line 230) — I guessed this means the parameter names I declared but never used.

# "So what do I actually type?" — unanswered

1. **Line 12: the transaction timeout.** "To set one, set PostgreSQL's `idle_in_transaction_session_timeout` on the connection." This is the one concrete way to bound a transaction and there is no code. I do not know whether that is a connection-string parameter, a `SET` I run via `connection.execute`, or server config. This is the first thing a Prisma 7 user will look for, because `$transaction` had `timeout` and `maxWait`.
2. **Lines 3 and 152: the `SET` before the transaction.** Both sentences say the entire reason to use manual control is running a `SET` first — and neither of the two manual examples (lines 175 and 191) contains a `SET`. `connection.execute(...)` appears to take a built query, and I cannot build `SET` with `db.sql.public.<table>`, so I would have to guess `db.raw.sql`. The page names the use case three times and never shows it.
3. **Line 117: `withTransaction` without a client.** The section exists for "a function that takes a runtime as a parameter instead of the client", then tells me to build queries "with a SQL builder you already hold, such as the client's `db.sql`" — and the example on line 142 reaches out to a module-scope `db`. If my function only has a runtime, I still do not know where a SQL builder comes from. The example does not demonstrate the situation the section is written for.
4. **Line 215: MongoDB transactions.** "share one `MongoClient` between Prisma ORM and your driver code" — no code, no indication of how a `MongoClient` is handed to the Prisma client. The link may cover it, but the reference gives me nothing.
5. **What `tx.execute(...)` returns.** Line 11 says use it "when the write returns no rows". Every example throws the result away. `{ affectedRows }` is only ever mentioned for `PreparedExecution` (line 310). I do not know if `tx.execute` gives me a row count.
6. **Line 228: which type id for my column.** Four ids are listed. My contract has `String`, `Int`, `DateTime`, `Boolean`, `Json`, enums. I would have to follow a link for the mapping, or use `codecId`, and the page does not say "use `codecId` and skip the table", which is what I actually want.
7. **Line 369: the phase list.** Six values, no meaning for any of them. If I catch `RUNTIME.ABORTED`, I cannot tell what I should do differently for `'encode'` vs `'afterQuery'`.
8. **Retrying.** Line 12 says "Nothing retries a failed transaction for you." A serialization or deadlock failure is the normal reason to retry, and the page never says which `code` to catch or that I should write the loop myself.

# Places that explain the internals when I only wanted to know what to do

- **Line 116:** "That path holds the SQL runtime API, the same one for every SQL database." Package layout, not my problem.
- **Line 371:** "`scope` is set for you. Do not pass it." Telling me a field exists purely so I can avoid it. If I must not pass it, do not name it.
- **Line 228:** "A type id is the PostgreSQL type plus a version, always `@1` today." The versioning scheme is Prisma's business. I need the id string.
- **Line 157:** "It does not close the pool or the runtime, and the runtime opens a replacement connection on the next query." Reassuring, but it is pool mechanics; the actionable half is the last sentence, "Use `destroy()` only for a connection you no longer trust."
- **Line 400:** "Every run of the same query text shares one `fingerprint`, whatever values you pass" — this one earns its place, but it sits in a paragraph that also defines `lane`, `outcome`, `durationMs`, and the "most recent query only" rule. Five facts in one bullet.

# Could I do what the page is for after one reading?

Partly.

I could write a normal transaction. Lines 3–108 are clear, the `tx` vs `db` warning on line 11 is exactly what a Prisma 7 user needs, and the diff on line 96 answered my first question — where did `$transaction([...])` go — better than anything else on the page.

What I would still not know:

- How to put a time limit on a transaction. The page names `idle_in_transaction_session_timeout` and stops.
- How to run the `SET` that is the page's own stated reason for manual connection control.
- How to use `withTransaction` in the situation it was written for, since the example uses an outer-scope `db`.
- What to do when a transaction fails on a conflict — which code, and that I write the retry loop myself.
- Which type id my columns need, beyond `codecId`.
- Whether `durationMs` can be missing.
- Whether I should ever use `for await`.
- What `tx.execute(...)` returns.

The prepared statements section is the strongest part: line 252 and line 297 gave me two working shapes and the difference between them is stated plainly on line 276.