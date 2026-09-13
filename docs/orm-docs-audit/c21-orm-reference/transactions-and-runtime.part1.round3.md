Read once, top to bottom, as a Prisma 7 user. Report below.

## Sentences I could not restate after one reading

1. **Line 9:** "Prisma ORM 8 replaces `schema.prisma` with `contract.prisma`. Run `npx prisma contract emit` to compile that file into `contract.json`, which your app reads at run time, and `contract.d.ts`, which TypeScript reads."
   Four new things in two sentences: a renamed schema file, a new command, and two generated files with different consumers. I had to re-read to work out which file goes where. Plainer: "Prisma ORM 8 renames `schema.prisma` to `contract.prisma`. Run `npx prisma contract emit`. It writes two files next to it: `contract.json`, which your app imports, and `contract.d.ts`, which gives you the TypeScript types."

2. **Line 11:** "The runtime is the connected object you run queries on. `db.runtime()` returns it."
   `db` has not appeared yet. I do not know what `db` is at this point in the page. I guessed it was a client, which turned out right nine paragraphs later.

3. **Line 13:** "Availability is stated per method: where the two databases differ, or where a method exists on only one of them, the Remarks say so."
   "the Remarks" is capitalised as if it is a thing I already know. I have not seen a Remarks section yet. Plainer: "Each method below has a Remarks list. If a method behaves differently on PostgreSQL and MongoDB, or only exists on one, that list says so."

4. **Line 13:** "To run one there, share one `MongoClient` between Prisma ORM and your own `mongodb` driver code and use a driver session."
   Three instructions compressed into one sentence, and I cannot act on any of them. What is "a driver session"? How do I "share" a client — is that the `mongoClient` option? The page does not say here, and the link goes to a section I do not have.

5. **Line 27:** "Pass `contract` instead only when you already hold a contract object in your own code, because Prisma ORM converts it to the same JSON."
   I do not know what "a contract object" is or how I would come to hold one. Nothing on the page produces one. I could not restate this except as "ignore this option."

6. **Line 59:** "In `.nativeEnums` each member's name is its own value, because a PostgreSQL enum type has values and no separate names."
   I read this three times. "each member's name is its own value" is circular phrasing. Plainer: "`.nativeEnums` maps each value to itself — `db.nativeEnums.public.AalLevel.aal1` is `'aal1'` — because PostgreSQL enums have no separate names."

7. **Line 140:** "It waits for a connection already being opened, then releases the pool it created. After `close()`, `connect()` rejects and `runtime()` throws an error whose `code` is `DRIVER.NOT_CONNECTED` (`Postgres client is closed`). When you bound the client with `pg` (your own pool or client), close that instance yourself, because the client only owns pools it created from a `url`."
   One bullet carrying four separate facts: in-flight connect handling, post-close behaviour of two different methods, and ownership rules. "waits for a connection already being opened" is also the only mention of a race I did not know existed, and it is buried mid-sentence.

8. **Line 208:** "`mode` | `'strict'` or `'permissive'` | No built-in behaviour. Your own middleware can read it."
   I could not restate the point of this option. If it does nothing, why is it in the table, and how does middleware read it? Neither is answered.

9. **Line 252:** "Running any query connects the client too, so if you then call `connect()`, it fails for the same reason. PostgreSQL raises the same code from the same situation."
   The second sentence contradicts what I took from line 34 ("`connect()` is optional: call it to open the connection up front and fail early"). Now I learn that on PostgreSQL too, a query followed by `connect()` throws. That is a trap, stated as an aside in the MongoDB section, in a page where the PostgreSQL section came first.

10. **Line 309:** "`runtime.close()` closes only the connection Prisma ORM opened and does not mark the client closed, so the client then looks usable and is not."
    Useful warning, badly phrased. "looks usable and is not" made me stop. Plainer: "After `runtime.close()` the client will accept further calls and then fail."

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the schema, and also for the compiled artefact, and also for a TypeScript type (`<Contract>`), and also for a runtime object (`.contract`, `contract:` option). Four uses of one word, never distinguished.
- **"runtime"** — guessed: a connection handle. The word also names the import path (`@prisma/orm-postgres/runtime`), which is not the same thing and is never flagged.
- **"binding"** — guessed: a wrapper object so you can pick the connection source with an `if`. The word itself told me nothing.
- **"marker"** in `verifyMarker` — guessed: the row the migration writes. The option name only makes sense after reading the internals note.
- **"built query" / `.build()`** — guessed: a builder produces a plain object you hand to `runtime.query()`. Line 95 defines it, but it is used at line 95 before I have ever seen a builder chain.
- **"middleware"** — guessed from Express. The page says "an object with a name and one or more hooks" but never lists which hooks exist. I know `beforeQuery` only because it is in the example.
- **"telemetry"** — guessed: timings? Row counts? "reports how the most recent query went" is not a definition.
- **"extension packages"** — guessed: npm packages you import and pass in an array. The pgvector example carried this, not the table row.
- **`Symbol.asyncDispose` / `await using`** — I have not used these. The page assumes I have.
- **`AsyncIterableResult`** — guessed from the name; the definition is in the half I do not have.

## Places I asked "so what do I actually type?"

- **Line 9, "what replaces `prisma.user.findMany()`"** — the page raises the exact question I came with and sends me elsewhere. One line showing the new call would have answered it.
- **Line 27, the `contract` option** — no example anywhere on the page. If I have a contract object, what does the call look like, and where do I get `Contract` from without a `.d.ts`?
- **Line 33, "so run them"** — which command? `npx prisma migrate dev` still? Prisma 8 renamed the schema file, so I do not assume the migrate commands survived.
- **Line 32, middleware** — `isForbidden` is undefined, `query` has no shape, and no hook besides `beforeQuery` is named. I cannot write a middleware from this.
- **Line 46, `poolOptions`** — no example. I can guess from the type, but it is the one option with defaults worth seeing in context.
- **Line 13, MongoDB transactions** — no code at all. This is the loudest gap on the page: it tells me transactions are unavailable, tells me there is a workaround, and shows me none of it.
- **Line 70, `import contractJson from './contract.json' with { type: 'json' }`** — this syntax fails in most setups I have. What `module`/`target` in `tsconfig.json`, what Node version? Not said, while the far less risky `await using` does get a tsconfig note.
- **Line 69, `from './contract.d'`** — importing from a path ending in `.d` looks wrong. Is it? The page never says.
- **Line 72 vs line 241** — `url: process.env.DATABASE_URL` with no `!`, but `new MongoClient(process.env.MONGODB_URL!)` with one. One of these does not typecheck. Which?
- **Line 9 says the files live in `src/prisma/`, every example imports `./contract.json`** — so what is the real import path from my `src/index.ts`?
- **Line 97, `runtime.connection()`** — "Call `connection.release()` when you are done." No example, and the link points into the half I do not have.
- **PostgreSQL `runtime.execute()`** — mentioned at line 96, never shown. Every PostgreSQL example is a read.
- **Line 117, `db.sql.public.tag`** — line 58 told me `.sql` is "keyed by table name". It is not; there is a schema segment first. The schema segment appears only in a code comment. Same for `db.nativeEnums.public['AalLevel']` — bracket notation here, dot notation for `.enums.public.Role`, with no explanation of why.
- **Line 61 vs line 98** — line 61 lists `prepare()` as a member of the *client*; line 98 describes `runtime.prepare(...)`. Which object do I call it on?
- **Line 95 links to `#runtimequery`** — the only `runtime.query()` section on this page is under MongoDB. Following that link from the PostgreSQL section lands me on MongoDB documentation.
- **Line 101, "Every error has a `code` property"** — where is the list of codes? I see three.
- **Line 216** — "The [example schema] sets `@@map("users")` on `User`, which is why the key here is `users`." I cannot see that schema, so the sentence explains nothing to me.

## Places explaining internals when I wanted instructions

- **Line 33, `verifyMarker`:** "Your migrations write a row into your database recording which contract that database matches. With `verifyMarker: 'onFirstUse'`, the default, the first query compares that row with your contract, logs a warning if the row is missing or does not match, and runs the query anyway." I wanted: leave this alone; if you see the warning, run your migrations. The row, the comparison, and the timing are machinery.
- **Line 27:** "because Prisma ORM converts it to the same JSON" — internal detail justifying a recommendation I would have taken anyway.
- **Line 29 and 189:** "because it is one object instead of three separate option names" — that is a description of the API shape, not a reason to pick it.
- **Line 309:** the explanation of *why* `runtime.close()` is wrong ("does not mark the client closed") is longer than the instruction ("Call `db.close()`, not `runtime.close()`").
- **Line 214:** "Prisma ORM's `MongoClient` type, not the driver's." True and important, but it reads as an implementation note where I expected to be told what to do about the name clash.

## Could I do what the page is for?

Partly. After one reading I could create a PostgreSQL client from a connection string, run a read query, and close it, because that exact path is shown three times. The same is true for creating a MongoDB client.

What I would still not know:

- How to write anything to either database. There is no `execute()` example on the page.
- How to run a transaction on MongoDB, which line 13 promises and never delivers.
- Whether to call `connect()` at all. Line 34 says it is optional; line 252 says calling it after a query throws. I do not know the safe pattern.
- How to write a middleware, or which hooks exist.
- What `mode` does.
- What `telemetry()` returns.
- Whether `db.sql` is keyed by table or by schema-then-table. The prose and the examples disagree.
- Whether `prepare()` is on the client or the runtime.
- What tsconfig I need for the JSON import in every single example.
- What `prisma.user.findMany()` becomes — the question the page opens with and never answers.

The biggest structural problem: the page defines `runtime`, `built query`, `contract object`, and `Remarks` *after* it first uses them, and it puts the PostgreSQL/MongoDB `connect()` contradiction in the second section only.