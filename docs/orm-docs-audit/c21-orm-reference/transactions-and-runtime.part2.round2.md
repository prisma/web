Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**1. Line 3 + line 109 + line 114 — a direct contradiction.**
> "Use `withTransaction(...)` when you hold a runtime but no client."

then

> "Build queries with the client's `db.sql` and run them through `tx.query(...)`"

Both examples use `db.sql`. So the case the section tells me it is for — no client — is the one case the examples show is impossible. I do not know when I would ever be holding a runtime and no `db`. Plainest version I would have understood: say the actual situation (a helper that receives a runtime as an argument?) and show it without `db`, or drop the claim.

**2. Line 11 — too many ideas in one bullet.**
> "`tx.enums` holds the members of the enums declared in your contract, and `tx.nativeEnums` holds the members of the PostgreSQL enum types in your database."

Two new APIs, never shown, never used again. I do not know what "holds the members" gives me — an array? an object of string constants? Why two, and which one do I want? No example anywhere on the page.

**3. Line 14.**
> "When a function you call opens its own transaction today, pass `tx` down to that function instead."

"today" made me stop — today as in "in your current Prisma 7 code"? Plainest: "If a helper you call starts its own transaction, change it to take `tx` as a parameter instead." And then the obvious follow-on is missing: what TypeScript type do I annotate that parameter with? Not stated.

**4. Line 232.**
> "A type id is the `codecId` your contract gives that column, so read the ids out of your `contract.json`."

Three stops. "codecId" is a word I have never seen. Part 1 told me the contract is `contract.prisma`; this says `contract.json` — I do not know what that file is, where it comes from, or whether I wrote it. And "read the ids out of" is not an instruction I can follow without seeing one line of that file.

**5. Line 371.**
> "A signal that is **already aborted** ... rejecting with an error whose `code` is `RUNTIME.ABORTED` and whose `details.phase` is `'stream'`."

If it "short-circuits before any query runs", why is the phase `'stream'`? That reads like a bug or an internal quirk, and I could not restate why.

**6. Line 429.**
> "a query run through the client loads every row into memory first and hands its connection back before you read them"

I can parse it, but it contradicts what I thought `for await` was for. If every row is already in memory, streaming buys me nothing on PostgreSQL. The page never says that plainly, and never warns me about large result sets.

**7. Line 431.**
> "Each result is read once, one way. Re-`await`ing a result you already awaited is safe and returns the same array."

First sentence says once; second says twice is fine. I had to read it three times to work out the rule is really "pick `await` or `for await` and never mix".

## Words and phrases I had to guess

- **`family-runtime`** (line 113, import path) — guessed it is just a subpath name with no meaning I need. Nothing tells me.
- **`SqlQueryPlan`** (lines 242, 288) — guessed this is the type of what `.build()` returns, i.e. "the built query". The page uses two names for one thing and never links them.
- **`R`** in `(tx) => Promise<R>` (line 24) — guessed "whatever type your callback returns".
- **`kind: 'user'`** (line 99) — appears only in the migration diff, with no counterpart in the Prisma 7 code above it. Guessed it is a required column in some example model. It made me think the new API required a field I did not have.
- **`(f, fns)`** in `where((f, fns) => fns.eq(f.label, params.label))` — guessed fields and functions. Never said on this page.
- **`db.raw.sql`** and **`.affectedCount()`** (line 318) — guessed raw SQL, and that `.affectedCount()` marks it as a write. Both appear for the first time inside a code sample.
- **`all()` / `createAll()`** (line 427) — guessed model methods from the ORM page. They arrive with no introduction.
- **`lane`** (line 404) — guessed it means "which of the several query APIs you used".

## Where I asked "so what do I actually type?"

1. **The type id.** `'pg/text@1'` is the only one on the page. I have an `int`, a `timestamptz`, a `boolean`, a `uuid`. I cannot guess their ids and the page points me at a file it never shows.
2. **`db.connect()` vs `db.runtime()`.** Line 137 does `const runtime = await db.connect()`; line 184 does `const runtime = db.runtime()`. Line 281 says calling `connect()` after `prepare()` fails. Nowhere does the page say which one I should write in my own code, or why.
3. **Bounding a transaction with a timeout.** Line 13 tells me to pass a `signal` to every `tx.query` and `tx.execute`. No example on the page does it. I wanted one line showing `AbortSignal.timeout(...)` inside a `db.transaction`.
4. **Isolation level.** Line 12 says the options are gone. It does not say whether I can get `SERIALIZABLE` at all — e.g. by running `SET TRANSACTION ISOLATION LEVEL` as the first statement. I have production code that needs it and the page leaves me stuck.
5. **Passing `tx` to a helper.** Told to do it (line 14), never shown, and no type given.
6. **MongoDB.** Line 220: "share one `MongoClient` between Prisma ORM and your driver code and use a driver session". No code, and no hint how a `MongoClient` gets shared with the Prisma client.
7. **`tx.enums` / `tx.nativeEnums`.** Mentioned, never typed out.
8. **Line 146 example** uses `runtime` that is not declared in that snippet. I would have copied it and got an undefined variable.
9. **Retrying.** "call `db.transaction(...)` again yourself" — on which error codes? A serialization failure has a code; the page does not say which one, so I cannot write the retry it tells me to write.

## Where it explains the insides when I only wanted to know what to do

- **Line 167:** "`reason` is optional and the pool never reads its value, so plain `destroy()` is enough." Then the parameter should not be in the table (line 177) at all. Telling me an argument is ignored is internals.
- **Line 373 / 380:** `scope` is documented as an option, with a type, in the options table — and then "the runtime sets it for you, so do not set it yourself." If I must not pass it, it is not an option.
- **Line 404:** `fingerprint` is "a hash of the query text with the literal values replaced". That is how it is built, not what I do with it. Nothing on the page tells me why I would read telemetry at all, or when `durationMs` is missing.
- **Line 429:** the pooling/buffering explanation, above.
- **Line 372:** `details.phase` of `'encode'` / `'decode'` tells me where inside the driver the abort landed. I cannot act differently on any of them.

## Could I do what the page is for, after one reading?

Partly. I could write `db.transaction(async (tx) => ...)` and port a `$transaction([...])` array — the diff at line 93 is the clearest thing on the page, and line 105 explains the payoff well.

I could not:

- Write a prepared statement, because I cannot find a type id for any column I actually have.
- Decide whether to use `db.connect()` or `db.runtime()`.
- Port any transaction that relied on `isolationLevel` or `timeout`, which is most of mine.
- Write the retry loop the page tells me to write, because it never names the error code to retry on.
- Use `withTransaction` with any confidence, because its stated purpose contradicts both its examples.
- Use `tx.enums`, `tx.nativeEnums`, or `telemetry()` for anything, having been told they exist and nothing else.

The single biggest hole is the type id. It is the one input I cannot invent, and the page answers it by naming a file it never shows.