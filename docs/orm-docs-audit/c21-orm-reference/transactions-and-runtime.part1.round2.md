I read the page once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**Line 23** — "Your contract is the `contract.prisma` file that replaced `schema.prisma`. Running `npx prisma contract emit` compiles it into two files: `contract.json`, read at run time, and `contract.d.ts`, read by TypeScript."

This is the single most important fact on the page and it is buried in a bullet under `postgres(options)`. I stopped at "Your contract is" — the page says "the contract" seven times before this and never says what a contract is. Plainer: put this before the first heading, as its own short section: "Prisma 8 replaces `schema.prisma` with `contract.prisma`. Run `npx prisma contract emit` to generate `contract.json` and `contract.d.ts` in `src/prisma/`. Every client you create needs `contract.json`."

**Line 25** — "A binding tells the client which database to use. Pass exactly one of `url`, `pg`, and `binding`, or leave all three out and pass one to [`connect()`](#connect). The `binding` form is the same three choices in one object: `{ kind: 'url', url }`, `{ kind: 'pgPool', pool }`, or `{ kind: 'pgClient', client }`."

Three ideas in one bullet: what a binding is, when you may omit it, and a fourth option that repeats the first three. I could not work out why `binding` exists at all if `url` and `pg` already do the job. Plainer: "Tell the client which database to use in one of three ways: `url`, `pg`, or `binding`. Use `binding` when your code chooses between them at run time, because it is one object instead of three separate option names."

**Line 28** — "Prisma ORM keeps a record in your database of which contract the database was set up for. With `verifyMarker: 'onFirstUse'`, the default, the first query checks that record, logs a warning if it is missing or does not match, and runs the query anyway."

I do not know what "a record" is, where it lives, or what "the database was set up for" means. "Marker" appears only in the option name, never in the prose, so I cannot connect `verifyMarker` to "a record". The behaviour is also self-cancelling: it checks, warns, and runs anyway. So what do I do when I see the warning? Plainer: "Migrations write a marker row into your database recording which contract it matches. By default the first query compares that marker with your contract and logs a warning on a mismatch, then runs anyway. A warning usually means you have not run your migrations."

**Line 96** — "Every error carries a `code`: to handle one, catch the error and compare `error.code` with the code's string."

"the code's string" stopped me. Which string? Compare with what? Plainer: "Every error has a `code` property. Catch the error and compare `error.code` with the value shown here, for example `if (error.code === 'DRIVER.NOT_CONNECTED')`." Show the line of code.

**Line 270** — "On MongoDB, `runtime()` returns a **`Promise<MongoRuntime>`**: you must `await` it. The connection to MongoDB is opened on first use, which is why this call is asynchronous."

The reason does not hold. Line 29 says PostgreSQL also opens its connection on first use, and line 121 says PostgreSQL's `runtime()` is synchronous anyway. So the stated reason explains nothing, and I now distrust both sentences. Either give the real reason or drop it and just state the difference.

**Line 285** — "`(await db.runtime()).query(built)` runs any built MongoDB query, including one built by the [pipeline builder](/orm/reference/pipeline-builder) (`db.query`). The client itself has no `execute()` method."

Two unrelated facts. The second one names something that does not exist, without saying what to use instead in the same sentence. I had to read line 287 to learn `runtime.execute` is the answer.

**Line 187** — "That is what lets you use one `MongoClient` both through Prisma ORM and in code you write against the `mongodb` package directly."

Follows three sentences about who closes what. By the time I reached "That is what lets you", I had lost which fact "that" points back to.

## Words and phrases I had to guess

- **"runtime"** — I guessed "the connected object you actually run queries on". The page confirms this at line 89, which is after the word has been used eleven times including in the page title. Define it in the intro.
- **"binding"** — I guessed "the database connection details". Never stated plainly.
- **"built query"** / **"`.build()`"** (line 90) — I guessed you chain builder calls and finish with `.build()` to get a plain object. No example of a chain appears before it is used at line 112.
- **"`postgres<Contract>`"** — I guessed `Contract` is the exported type from `contract.d` and the generic is what makes `db.sql.public.tag` typed. The page never says the generic is required or what happens if you leave it out.
- **"`.nativeEnums` holds the enum types defined in PostgreSQL itself"** (line 54) — I could not guess how this differs from `.enums`, or when I would use it. No example.
- **"`.context` is internal: the query builders read it, and you do not call it"** — I guessed it is an implementation detail I should ignore. Then why is it in a reference list I am reading?
- **"`mode`: `'strict'` or `'permissive'`. Passed through to your middleware, which decides what to do with it"** (line 202) — I guessed nothing. This option does literally nothing on its own and the description says so. It tells me neither what to pass nor why.
- **"`middleware`: Array of middleware"** (lines 43, 201) — the type restates the name. I still do not know the shape of one item.
- **"marker"** — see above.
- **"`.sql` is the SQL query builder, keyed by table name"** vs **"`.orm` holds your models by model name"** — I guessed `Tag` the model becomes `tag` the table. Only a code comment at line 111 tells me. On MongoDB the same rule is in another code comment at line 300. A naming rule this important should not live in comments.

## Where I asked "so what do I actually type?"

1. **`connect()` with a binding.** Lines 95 and 246 both say "`connect()` accepts a binding, so a client you created without one can be given its database here." There is no example anywhere on the page. Is it `db.connect({ url })` or `db.connect({ kind: 'url', url })`? This is the only way to use the documented "leave all three out" path, and it is never shown.
2. **Middleware.** Both `middleware` rows link away. One two-line example of a middleware function would cost less than the link.
3. **`mode`.** No example, no meaning, no guidance.
4. **`binding` on MongoDB.** Line 184 says the choices are `{ kind: 'url', url, dbName }` or `{ kind: 'mongoClient', client, dbName }`, but the text right above offers `uri` as a separate option. If I am on the `uri` path, what do I put in `binding`? Unanswerable from the page.
5. **`url` plus `dbName` on MongoDB.** Line 192 says "Pass exactly one of `url`, `uri` plus `dbName`, `mongoClient` plus `dbName`, and `binding`." The very next example (line 223) passes `url` **and** `dbName`. I read the rule as forbidding that. Line 185 explains the override, but the rule and the example contradict each other on the page as written.
6. **`extensions`.** Line 27 shows the import and the array. It does not say to run `npm install @prisma/orm-extension-pgvector` first. I would have hit a missing-module error.
7. **Closing the Mongo runtime.** Line 253 says `MongoRuntime` is "(`query`, `execute`, and `close` only)". The PostgreSQL runtime has five calls and none is `close`. So on MongoDB I have `db.close()` and `runtime.close()` and the page never says which one I should call, or what the other does.
8. **`runtime.connection()`.** Line 92 says it "takes one connection out of the pool". It does not say how I give it back, or whether it does that for me. The link points to a section I do not have, but the one-line summary invites the question and leaves it open.
9. **What replaces `prisma.user.findMany()`.** As a v7 user this is my first question on any v8 page. The link at line 23 is the right answer, but it sits at the end of a bullet about file names. Put it in the intro.

## Where the page explains the machinery when I only wanted to know what to do

- **Line 28, `verifyMarker`.** I do not need to know Prisma writes a record in my database. I need to know: leave the default on, and if you see the warning, run your migrations.
- **Line 55, `.context` is internal: the query builders read it, and you do not call it.** Telling me how the builders talk to each other. Cut it, or cut the whole entry.
- **Line 270, "which is why this call is asynchronous."** An internal reason that contradicts line 29 and line 121.
- **Line 208, "Prisma ORM's `MongoClient` type, not the driver's."** This is a real trap, so it belongs somewhere — but the example at lines 228 to 235 imports the driver's `MongoClient` and assigns Prisma's to `db`, with both names live in one ten-line file, and never comments on it. Either name the type differently or warn me in the example.
- **Line 26, pool defaults.** "The pool it creates uses `connectionTimeoutMillis: 20000` and `idleTimeoutMillis: 30000`." The numbers are useful in the options table, where they already are. In the prose they are just internals.

## Other things I noticed

- **Line 297.** The heading is "Run a query built by the pipeline builder" but the anchor is `#run-a-pipeline-builder-plan`. The word "plan" does not appear anywhere on the page. Anyone who lands on that link expects a different section.
- **Line 210 vs line 300.** Line 210 says `.orm` "holds your models by model name" and shows `db.orm.users`. Line 300 says the collection name is "your model name with a lowercase first letter". If my model is `User`, is the ORM key `user` or `users`? The example says `users`, the rule says `user`. One of these is wrong, and I cannot tell which.
- **Line 9.** "Transactions are fully supported on PostgreSQL. They are not available on MongoDB." As a v7 user who uses `$transaction` on MongoDB today, this is alarming and the page defers the whole answer to a section I do not have. One sentence naming the replacement would stop me panicking.

## Could I do what the page is for, after one reading?

Partly.

**I could:** create a PostgreSQL client from a connection string, run one `select`, and close it. The four examples at lines 62, 109, 147 and 166 are clear, complete, and copy-pasteable. Same for the basic MongoDB client. This is the page's main job and it does it.

**I could not:**

- Create a client without a binding and supply the database later at `connect()`. No example exists.
- Write a middleware, or decide anything about `mode`.
- Work out whether `db.orm` keys are singular or plural, because the page says both.
- Decide whether to call `runtime.close()` or `db.close()` on MongoDB.
- Work out what `binding` is for on MongoDB when I am using `uri`.
- Know whether `postgres<Contract>` is required or optional.
- Know what to do when the `verifyMarker` warning fires.
- Know how `.nativeEnums` differs from `.enums` in practice.

The largest single fix is moving the contract explanation from line 23 into the introduction. Everything on the page depends on `contractJson`, and a reader who does not already know what a contract is spends the whole first section not understanding the first argument of the first function.