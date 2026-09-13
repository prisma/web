I read it once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**Line 11:** "`db` is the client `postgres(...)` or `mongo(...)` returns. The runtime is the connected object you run queries on, and `db.runtime()` returns it. The import path `@prisma/orm-postgres/runtime` is a package name and is not that object."

Three different things called "runtime" in three sentences, and the third one is a warning about a confusion I did not yet have. It made me think I had missed something. Plainer: "`db` is the client. `db.runtime()` gives you the object that actually runs queries. (The `/runtime` in the import path is unrelated — it is just where the package lives.)"

**Line 13:** The whole paragraph. It is one block containing: what the page covers, that each method has a Remarks list, that Remarks note database differences, that transactions work on Postgres, that they do not work on Mongo, the workaround for Mongo, and four outbound links. I cannot hold that. Split it: a sentence on scope, a sentence on how to read the Remarks lists, then a short "Transactions are PostgreSQL-only" note.

**Line 26:** "The `<Contract>` type argument is what types `db.orm` and `db.sql`. Pass it yourself whenever you pass `contractJson`, because TypeScript cannot read a type out of a JSON file. It is inferred only on the `contract` path."

"the `contract` path" — I had to reread twice to work out this means "when you use the `contract` option instead of `contractJson`". I first read "path" as a file path, which is exactly the wrong reading on a line about JSON files. Say "It is inferred only when you use the `contract` option."

**Line 27:** "A `binding` is one object that names the source and carries it: `{ kind: 'url', url }`, `{ kind: 'pgPool', pool }`, or `{ kind: 'pgClient', client }`."

"names the source and carries it" is a riddle. I understood it only from the code. Plainer: "A `binding` wraps any of the three choices in one object, with a `kind` field saying which it is."

**Line 31:** "`verifyMarker: 'onFirstUse'`, the default, makes the first query check that the database was set up for your contract."

"marker" is never explained. I do not know what a marker is, where it lives, or how it got there. I can guess it is a row or table Prisma writes during migration, but the page never says. Also the option name says "verify marker" while the description says "check that the database was set up" — those do not obviously connect.

**Line 57:** "A PostgreSQL enum type has values and no separate names, so each value is its own name: `db.nativeEnums.public['AalLevel'].nameOf('aal1')` is `'aal1'`."

This documents a method whose entire purpose is to return its own argument. After one reading I could not tell why it exists or when I would call it. If it is only there for API symmetry with `.enums`, say that.

**Line 72:** "The line `import contractJson from './contract.json' with { type: 'json' }` is what `prisma orm init` writes, and it needs Node.js 22.18 or newer and TypeScript set up as `prisma orm init` sets it up."

"TypeScript set up as `prisma orm init` sets it up" tells me nothing actionable. I have an existing project; `prisma orm init` already ran, or did not. I do not know which `tsconfig.json` settings are required. Name the settings.

**Line 208:** "`mode` | `'strict'` or `'permissive'` | No | Defaults to `'strict'`. Only your own middleware reads it."

I stopped dead. If only my own middleware reads it, what does Prisma do with it, and what do the two words mean? This reads like an option that does nothing, which cannot be right. Plainer: "Prisma ignores this value. It is passed through to your middleware so your own code can branch on it."

**Line 309:** "Call `db.close()`, not `runtime.close()`. `db.close()` marks the client closed and then closes the `MongoClient` Prisma ORM created. After `runtime.close()` the client still accepts calls and then fails."

Two ideas jammed together: an instruction, and an explanation of internal bookkeeping. The last sentence describes a bug-shaped behaviour without telling me what to do about it. "Always call `db.close()`. `runtime.close()` leaves the client looking open, and later calls fail." would be enough.

## Words and phrases I had to guess

- **"contract"** — I guessed it is what `schema.prisma` used to be, renamed. The page tells me the file was renamed but never says what a contract *is*.
- **"marker"** (line 31) — guessed: something Prisma writes into the database during migration to record which schema version is applied.
- **"binding"** — guessed: a discriminated union wrapping the connection-source options.
- **"middleware"** — line 30 gives an example, so I got the shape. I guessed the eight hook names from their words alone. I do not know when `beforeCompile` fires versus `beforeQuery`, what `interceptQuery` intercepts, or whether `onRow` runs per row (I assume yes).
- **"built query"** (line 94) — guessed: the object `.build()` returns. The page does say this, but the link text next to it says "Running a built query" while the anchor is `#executing-a-plan`, and the Mongo heading anchor is `[#run-a-pipeline-builder-plan]`. So "built query" and "plan" appear to be the same thing under two names, and I had to guess that.
- **"the `contract` path"** — guessed: "the `contract` option".
- **"`.context` is internal"** (lines 58, 218) — guessed: do not touch. Then why list it?
- **"`AsyncIterableResult`"** (line 284) — guessed from the name plus the sentence. The link goes to part 2, which I do not have.

## Places I asked "so what do I actually type?"

1. **`runtime.connection()`** (line 96). "Call `connection.release()` when you are done" — I have no code shape. Do I `const connection = await runtime.connection()`? Does it return a promise? Do I run queries on `connection.query(...)`? The link points to a section in the half I do not have, but this is the only lifecycle call on the page with no example and an unknown signature.
2. **`runtime.prepare(...)`** (line 97). Literally written with an ellipsis. I do not know what goes inside.
3. **A plain read.** Line 9 promises `db.orm.public.User.where(...).all()`, and then every single example on the page uses `db.sql.public.tag.select(...).build()`. Not one example uses `.orm`. After reading the whole client-lifecycle section I still cannot write the Prisma 7 `findMany` I came for.
4. **The `Contract` type.** Examples write `import type { Contract } from './contract.d'`. The page never says `contract.d.ts` exports a type named `Contract`, so I do not know whether that name is fixed, configurable, or my own alias.
5. **Closing a pool you supplied.** Lines 28, 84, 141 all tell me I close it myself. No example shows the order — do I call `db.close()` first, then `pool.end()`? Does `db.close()` on a supplied pool even do anything? Same gap on Mongo (lines 193, 243).
6. **Running a Mongo write.** Line 285 says use `runtime.execute(built)` and that there is no `execute()` on the client. No example.
7. **The `tsconfig.json` for `await using`** (line 166). "`@types/node` installed, **or** `"lib": ["esnext.disposable"]`" — I cannot tell if the second replaces my existing `lib` array or adds to it.
8. **Extensions** (line 29, 45). The remark says import from `@prisma/orm-extension-pgvector/runtime` and pass `extensions: [pgvector]`. The table calls the type "Array of extension packages". So do I pass the package, or the thing its `/runtime` subpath default-exports? Those are different, and the table contradicts the example.

## Places that explain the internals when I only wanted to know what to do

- **Line 11**, the whole "the import path is a package name and is not that object" aside.
- **Line 31**, "Prisma ORM logs a warning and runs the query anyway" — plus the concept of a marker at all, when what I need is "run `npx prisma db update`".
- **Line 57**, `nameOf` returning its own argument, and the reasoning about PostgreSQL enums having no separate names.
- **Lines 58 and 218**, "`.context` is internal." Do not document it, then.
- **Line 139**, "If a connection is being opened when you call it, `close()` waits for that to finish, then releases the pool it created." I only needed "`close()` is safe to call at any time."
- **Line 309**, "marks the client closed and then closes the `MongoClient` Prisma ORM created."
- **Line 192**, "That is the only difference between `uri` and `url`." The page spends a long remark on a distinction that reads like a historical accident. What I want is a one-line rule: "Use `url`. Use `uri` only if you must pass `dbName` separately."

## Could I do what the page is for, after one reading?

Partly. I could create a Postgres client from a connection string, connect it, close it, and use `await using`. The Postgres examples are concrete and I could copy them.

What I still could not do:

- **Write an actual query.** Every example builds a SQL builder query and calls `.build()`. The page never shows a completed read through `db.orm`, which is the thing line 9 told me I came for.
- **Use a pooled connection or a prepared statement.** Both are listed as runtime calls with no signature I can type.
- **Run a Mongo write**, or a Mongo transaction. Line 13 tells me to "pass your own `MongoClient` with the `mongoClient` option and use the driver's `session.withTransaction(...)`" and sends me elsewhere for the code. That is the single most likely reason a Mongo user opens a page called "Transactions and runtime", and it is a link.
- **Decide about `verifyMarker` or `mode`,** because I do not know what either one controls.
- **Set up a new project.** The page assumes `prisma orm init` already ran and refers to its output three times ("what `prisma orm init` writes", "TypeScript set up as `prisma orm init` sets it up", "the same way `prisma orm init` does") without saying what any of it is. That is fair for a reference page, but then it should link to the setup page from line 72, not just name the command.

One more thing. The heading structure repeats — `connect()`, `runtime()`, `close()`, and `await using` all appear twice, once per database — and the only way I can tell which one a link points at is a trailing `-1` in the anchor (`#connect-1`, `#runtime-1`, `#close-1`). Clicking `[Transactions (MongoDB)](#transactions-mongodb)` from line 269 is fine, but `#connect-1` gives me no clue it means the MongoDB one.