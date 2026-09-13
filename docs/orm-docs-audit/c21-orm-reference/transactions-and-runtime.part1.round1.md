Read once, top to bottom, as a Prisma 7 user. Blunt notes.

## Sentences I could not restate after one reading

1. **"Pass the contract with `contractJson` (a JSON contract you import) or `contract` (a contract value). Supply exactly one."** (line 23)
   What stopped me: I do not know what a contract is. In Prisma 7 I had a schema and a generated client. The page never says what a contract is, where `./contract.json` and `./contract.d` come from, or what generates them. "A JSON contract you import" defines the word with the word. And I cannot tell when I would use `contract` instead of `contractJson` — the page gives the choice and no reason to pick.
   Plainest wording I would have understood: "A contract is the generated description of your database shape. `prisma generate` writes `contract.json` and `contract.d.ts` into X. Import the JSON and pass it as `contractJson`. Pass `contract` instead only if Y."

2. **"`verifyMarker` | `'onFirstUse'` or `false` | Whether the runtime reads the contract marker row on the first query and warns when it does not match."** (line 39)
   What stopped me: "contract marker row". I have never heard of it. Which table is it in? Who writes it? What does "does not match" mean, and what do I do when I see the warning? This is the only mention on the page.

3. **"If your contract uses types from an extension pack, pass the pack in `extensions` (for example `extensions: [pgvector]`)."** (line 26)
   What stopped me: "extension pack" is undefined, and I do not know how to tell whether my contract uses one. `pgvector` is shown as a bare identifier with no import line. Where does it come from — `@prisma/...`? The `pgvector` npm package?

4. **"`middleware` | Array of middleware | Middleware applied to every execution."** (line 38)
   What stopped me: circular. It tells me middleware is middleware. No shape, no signature, no example, no link. "every execution" — execution of what, a query?

5. **"`mode` | `'strict'` or `'permissive'` | The mode middleware reads on every execution. Defaults to `'strict'`."** (line 193)
   What stopped me: this is the one MongoDB option that sounds like it changes behaviour, and the description explains it in terms of an internal mechanism ("the mode middleware reads") rather than telling me what strict does differently from permissive. After one reading I have no idea what setting this to `'permissive'` would let me do.

6. **"Transactions are fully supported on PostgreSQL and not shipped on MongoDB."** (line 9) versus **"(see [Transactions (MongoDB)](#transactions-mongodb) ...)"** (line 260)
   What stopped me: the intro says there are no MongoDB transactions, then a link points to a MongoDB transactions section. One of these is wrong, and I cannot tell which from here. Also "not shipped" — does that mean not yet, or never? I would say "MongoDB transactions are not supported in this release."

7. **"Returns a `Promise<Runtime>`. The runtime is what runs built queries directly (`runtime.query(...)` for rows, `runtime.execute(...)` for writes that return none), opens connections (`runtime.connection()`), prepares statements (`runtime.prepare(...)`), and reports telemetry (`runtime.telemetry()`)."** (line 78)
   What stopped me: five new APIs in one sentence, none of them explained or linked, plus "built queries" which is undefined at this point in the page. "opens connections (`runtime.connection()`)" is the worst of it — I just connected; what further connection is this and why would I want one? Split it into a list with a link per item.

8. **"The first connection can happen implicitly, the moment any query builds the runtime, so a later explicit `connect()` collides the same way."** (line 233)
   What stopped me: "the moment any query builds the runtime" reads backwards — I thought the runtime runs queries, not that queries build the runtime. Plainer: "Running any query connects the client. If you then call `connect()`, it fails, because the client is already connected."

9. **"`connect()` accepts a binding, so you can defer the choice of database: `mongo<Contract>({ contractJson })` then `await db.connect({ url, dbName })`."** (line 234)
   What stopped me: "defer the choice of database" — why would I want to? No situation is given. Also this contradicts the `mongo(options)` Options table, which marks a binding as required ("One binding").

10. **"Returns an [`AsyncIterableResult`](#asynciterableresult): `await` it for an array, or `for await` to stream rows."** (line 283)
    What stopped me: the type name. The link goes to part two, which I do not have, so at this point the page defines it only by how you consume it. I could guess, but I could not restate what it actually is.

11. **"`runtime.execute(built)` is the sibling call for writes that return no rows; it resolves the statement's statistics."** (line 284)
    What stopped me: "resolves the statement's statistics". What statistics? Row count? I would write "returns the number of rows affected" if that is what it is.

12. **"`await using` requires `@types/node` (which augments `SymbolConstructor` with `asyncDispose`) or a `lib` that declares the symbol."** (line 155)
    What stopped me: the parenthetical is TypeScript internals I do not need. And "or a `lib` that declares the symbol" does not tell me which lib value to set. Plainer: "`await using` needs `@types/node` installed, or `"lib": ["esnext.disposable"]` in your tsconfig."

13. **"This is what lets you share one `MongoClient` between Prisma ORM and driver-level code."** (line 181)
    What stopped me: "driver-level code" — I guessed it means code I write against the `mongodb` package directly, but the page never says so.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the generated schema/client types.
- **"binding"** — guessed: the way you tell the client which database to talk to. The page uses it as a noun ("One binding" in the Required column) before defining it, and I had to read line 24 to work out that "Required: One binding" means "pass exactly one of these three rows".
- **"runtime"** — guessed: the connected thing that actually talks to the database, as opposed to the client object.
- **"built query" / "a built query" / `built`** — guessed: the object a builder returns when you call `.build()`. Never stated.
- **"extension pack"** — guessed: a plugin that adds support for a Postgres extension's types.
- **"contract marker row"** — guessed: a row Prisma writes somewhere to check the deployed database matches the contract. No idea if that is right.
- **"telemetry"** — guessed: query timings/metrics.
- **"pipeline builder"** — guessed: a MongoDB aggregation-pipeline API. Only appears as a link.
- **"`db.sql.public.tag`"** (line 95) — guessed: schema `public`, table `tag`. Never explained; it just appears mid-example.
- **"`.orm`, `.sql`, `.raw`, `.enums`, `.nativeEnums`, `.contract`, `.context`"** (line 45) — guessed at most of these. `.nativeEnums` versus `.enums` I could not guess at all. `.context` I could not guess at all.
- **"not shipped"** — guessed: not implemented in this release.
- **"no-op"** (line 181) — fine for me, but it is jargon sitting in the middle of the one paragraph about who closes what.

## Places I asked "so what do I actually type?"

1. **Where `contract.json` and `contract.d` come from.** Every example imports them. No example shows the command that produces them, and no link is offered. This is the first thing I would need and the page never says it.
2. **How to install.** `import postgres from '@prisma/orm-postgres/runtime'` — is that a package I install, and with what? Same for `@prisma/orm-mongo/runtime`.
3. **`middleware`.** I cannot write one. No signature, no example, no link.
4. **`extensions: [pgvector]`.** Where do I import `pgvector` from?
5. **`contract` (the non-JSON form).** No example anywhere on the page shows it being used.
6. **`runtime.connection()`, `runtime.prepare()`, `runtime.telemetry()`.** Named once in a sentence with no example and no link.
7. **`binding` as an object.** `{ kind: 'url' | 'pgPool' | 'pgClient', ... }` — the `...` is the part I need. What are the other fields for each kind? Same for MongoDB, where the page says "a `binding` object that names its kind" and never even lists the kinds.
8. **When to call `connect()` on PostgreSQL at all.** Line 27 says it is optional; line 94's example calls it. I do not know which one I should do.
9. **Can I call `db.runtime()` on PostgreSQL before connecting?** It is synchronous and the client connects lazily, so this is the obvious question. The page only tells me what happens after `close()`.
10. **What `close()` does to in-flight queries.** "Close the client and release its pool" — does it wait for running queries?
11. **`uri` versus `url` on MongoDB.** Both are connection strings. The only stated difference is that `dbName` is optional with one and required with the other. I would not know which to type, or why both exist.
12. **Catching the errors.** The page repeatedly says things reject "with an error whose `code` is `DRIVER.NOT_CONNECTED`". It never shows the import or the shape, so I cannot write the `catch` block. Is `DRIVER.NOT_CONNECTED` a string I compare against, or a constant I import?
13. **The MongoDB example's `db.query.from('posts')`** (line 297) — `'posts'` is a bare string with no explanation of where the name comes from, and `db.query` is described in the return table only as `.query`.

## Places that explain the internals when I only wanted to know what to do

- **"Whether the runtime reads the contract marker row on the first query"** (line 39) — tells me the mechanism, not whether I should ever turn it off.
- **"The mode middleware reads on every execution"** (line 193) — describes plumbing instead of the behaviour I would observe.
- **"which augments `SymbolConstructor` with `asyncDispose`"** (line 155) — compiler internals in place of the tsconfig line I need.
- **"The underlying driver connection is built lazily and asynchronously on first use."** (line 258) — this one earns its place, because it explains why I must `await`. But it is immediately followed by a repeat of the same point, and the whole remark says the PostgreSQL/MongoDB difference three times in one paragraph (line 258) after already saying it at line 104 and line 171.
- **"the moment any query builds the runtime"** (line 233) — internal ordering, where what I need is "running a query connects you".

## Could I do what the page is for, after one reading?

Partly. I could create a PostgreSQL client from a connection string, connect it, close it, and use `await using` — those four have clear examples. I could do the same on MongoDB, and I understood the ownership rule (if I pass my own pool or `MongoClient`, I close it; if I pass a URL, Prisma closes it). That rule is the clearest thing on the page.

What I would still not know:

- **What a contract is or how to get one.** This blocks every example. I cannot run a single code block on this page without already having `contract.json`, and the page does not tell me how to get it or link anywhere that does. The intro says the page "assumes a project that already exists", but a Prisma 7 project does not have a contract, and I am the exact reader who is upgrading.
- **How to run a query.** The only PostgreSQL query example is one line, `db.sql.public.tag.select('id', 'label').build()`, with no explanation of any part of it. I would not know whether to reach for `db.orm`, `db.sql`, `db.raw`, or `runtime.query`.
- **Whether MongoDB has transactions.** The page tells me both.
- **What `mode: 'permissive'` does.**
- **How to handle a connection error**, because I cannot write the check against `DRIVER.NOT_CONNECTED`.
- **What most of the client surface is.** Line 45 lists eleven members; the page documents five.

One more thing that tripped me up specifically as a reader of both halves: the MongoDB **Return type is `MongoClient`** (line 199), and two lines below, an example imports a completely different `MongoClient` from the `mongodb` package (line 217). Two different things with the same name on the same screen. I read line 199 as "this returns the driver's client" and had to back up.