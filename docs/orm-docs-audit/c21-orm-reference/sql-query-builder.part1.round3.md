I read the file once, straight through, as a Prisma 7 user who has never seen this version.

## Sentences I could not restate after one reading

**1.** "Before you can build queries, run `npx prisma contract emit`. It reads your contract, the `contract.prisma` file that replaced `schema.prisma`, and writes `contract.json` and `contract.d.ts` next to it."

What stopped me: "your contract" is used as if I know what a contract is. I know what `schema.prisma` is. The sentence tells me a file was renamed but not what changed inside it, and "contract" then reappears everywhere (`contract emit`, `contract.json`, `Contract` type, "contract features", "Contract authoring") as a load-bearing concept I was never given. Plainest wording I'd have understood: "In Prisma 8 your `schema.prisma` is called `contract.prisma`. Run `npx prisma contract emit` to generate `contract.json` and `contract.d.ts` beside it; the examples import both." That at least stops "contract" from sounding like a new abstraction.

**2.** "The `types` block, `@@type`, `@@discriminator`, and `@@base` are contract features documented under Contract authoring, and no example on this page uses them."

Four unexplained names plus an unexplained category ("contract features") in one sentence, telling me to ignore all of it. I stopped and re-read to check I wasn't meant to do something.

**3.** "`db.runtime()` returns the connection that runs a built query. Do not `await` it. Only `runtime.query()` is awaited."

"Do not `await` it" reads as a rule with a reason I'm not given. I could not tell if awaiting it breaks, or is merely pointless. Plainer: "`db.runtime()` is synchronous — it returns immediately."

**4.** "`db.sql` is ready to use as soon as you have a client, so most code needs nothing more. If you wrap your own database client, the `sql(...)` function from `@prisma/orm-postgres/builder/runtime` builds the same query builder around that client."

"wrap your own database client" — I don't know what this means or when I'd be doing it. There's no example and no link. After one reading I could not tell whether this concerns me.

**5.** "Not available on SQLite, where the call does not compile. Called from plain JavaScript, or after a cast, it throws an error whose `code` is `ORM.CAPABILITY_MISSING` at the moment you call `lateralJoin()`."

Three situations packed together, and "after a cast" assumes I know why anyone would cast. This is describing how the type system fails to protect you rather than telling me what to do. Plainer: "PostgreSQL only. On SQLite TypeScript rejects the call; if you get past the types, it throws `ORM.CAPABILITY_MISSING`."

**6.** "A computed expression's result type comes from `.returns(...)` on `fns.raw`, or from the operation's own declared return type."

"the operation's own declared return type" — which operation? The `fns.*` helper? Something I declared? I could not resolve it.

**7.** "A type id is the PostgreSQL type name plus `@1`."

The rule is immediately broken by its own list: `pg/timestamptz-temporal@1` is not a PostgreSQL type name, and the real prefix `pg/` is not mentioned in the rule at all. I could not derive the type id for `numeric` or `jsonb` from this sentence, which is the only reason the sentence exists.

**8.** "or read the id itself from `db.sql.public.user.columns.id.codecId`."

"codec" appears once, undefined. I guessed it means the thing that converts a database value to a JavaScript value, but the page never says.

**9.** "After the join, a column name that both tables have must be written under its table, such as `f.post.id` or `f.post.createdAt`. A bare `select('id')` or `orderBy((f) => f.createdAt, ...)` throws, because a name both tables have is not in the query's scope on its own."

This is in `lateralJoin()`'s Remarks, but the example joins `user` to an alias called `latestPost`, so "both tables" and `f.post.*` don't match the example above it. I could not work out whether `f.post` or `f.latestPost` is correct after the join. The example uses `f.latestPost.id` outside and `f.post.id` inside, which I only spotted on a second pass.

**10.** "Put the `distinctOn()` columns first in `orderBy()`, then the column that decides which row wins. Nothing checks this for you, and without it you cannot predict which row you get."

Two rules and a warning in one breath. I had to look at the example to understand the ordering rule at all.

**11.** "TypeScript also accepts a `nulls` option, but the builder ignores it and no `NULLS FIRST` or `NULLS LAST` reaches the SQL. Do not use it."

I understood the sentence. What I could not restate is what I'm supposed to do instead — I sort by a nullable column fairly often.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the schema, plus whatever is generated from it.
- **"facet"**, in the anchor `#the-dbsql-facet` — the word never appears in the text. Guessed: "the `sql` part of `db`".
- **"after a cast"** — guessed: `as any` to get past TypeScript.
- **"codec"** — guessed: the value-conversion layer; `codecId` is the type id string.
- **"type id"** / `'pg/int4@1'` — guessed `@1` is a version number for the encoding, but I don't know what changes at `@2`.
- **"plan"** — the page says "The examples name the built query `plan`", so I read it as just a variable name, but "plan" is suggestive enough that I wondered if it was a query plan in the database sense.
- **"scope"** — defined, and the definition held up. This one worked.
- **`pgvector.Vector(1536)`** and `Embedding1536` — guessed: pgvector extension type; unused here.
- **"numeric expression"** in `limit(n)` — guessed: something built from `fns`, but I have no idea what it looks like.

## Places I asked "so what do I actually type?"

1. **Getting a contract at all.** The page says `contract.prisma` "replaced `schema.prisma`". Do I rename mine? Does something convert it? "Coming from Prisma ORM 7" is linked once, for "the rest of the setup steps", after the `contract emit` instruction — so I don't know whether the migration is before or after the command I was just told to run.
2. **Every example variable.** `aliceId`, `carolId`, `helloWorldId`, `untaggedPostId`, `newestPostId` are used in nine examples and defined nowhere. I can infer they're UUIDs I'd have on hand, but no example is copy-runnable.
3. **`import type { Contract } from './contract.d'`** — importing from a path ending `.d` looked wrong to me. I'd have typed `'./contract.js'` and guessed.
4. **A schema that isn't `public`.** "`public` is the PostgreSQL schema your tables are in." Mine is `app`. Is it `db.sql.app.user`? The page never says whether the key is my actual schema name.
5. **`limit()` with an expression.** "or a numeric expression" with no example.
6. **Wrapping my own client** — `sql(...)` is named, with no signature and no example.
7. **`.returns()` when omitted.** Is it required on every `fns.raw`? What is the type if I skip it? Not stated.
8. **Chain order.** Examples show `select().where()`, `innerJoin().select().where()`, and `select().orderBy().distinctOn()`. The only statement about order is that `distinctOn()` and `orderBy()` are order-independent — which made me assume order matters everywhere else, and nothing tells me the rules.
9. **What `runtime.query()` returns and what I do with `runtime` afterwards.** Nothing about closing, pooling, or reuse. `db.runtime()` is created once at the top of the entry-points example and never mentioned again.
10. **Seeing the SQL.** The opening paragraph sells "direct control over the generated SQL", and the page never shows how to look at the SQL. (I accept this may be in the half I don't have.)
11. **Enum values.** The schema declares `Priority { Low = "low" ... }` and examples write `fns.eq(f.priority, 'high')`. So I pass the mapped string, not `Priority.High`. I guessed that; the page doesn't say.

## Places that explain the tool's insides when I only wanted to know what to do

- **The example-schema paragraph:** "They are here only so that this schema matches the one on the ORM client reference, and you can ignore them." That's an explanation of how the documentation was assembled. It cost me a paragraph to learn that four models don't matter.
- **`ORM.COLUMN_UNKNOWN` "at the moment you call `select()`"** and the same "at the moment you call" construction for `ORM.CAPABILITY_MISSING`. Twice I was told *when in the builder's lifecycle* an error fires. I only wanted to know the call is invalid.
- **"Not available on SQLite, where the call does not compile. Called from plain JavaScript, or after a cast..."** — this describes the layers of the type system rather than the rule, which is just "PostgreSQL only".
- **The `nulls` option paragraph** — a description of a defect in the builder. Useful as a warning, but it tells me what the builder does internally with my input rather than what to write.
- **"`SelectQuery` in the tables below is the type they return. You never import it."** — the second sentence is about the type system, and I'd already assumed it.

## Could I do what the page is for, after one reading?

Partly. I could write a `select`, a `where` with `fns.and`/`fns.or`, an `innerJoin`, an `orderBy`, a `limit`/`offset`, and a `.as()` subquery. The chaining shape is clear and the examples for those are good.

What I would still not know:

- How to get from my Prisma 7 project to a working `contract.prisma` and `contract.json`. This is the first instruction on the page and it is the one I'd be stuck on. Everything downstream depends on it.
- What "contract" means, which matters because the word is in the command, the file names, the type parameter, and a linked section.
- What to pass to `.returns()` for any type outside the seven listed, because the stated rule for building a type id contradicts its own examples.
- Whether my non-`public` schema works, and what to type if it does.
- Where the example variables come from, so I could not run a single example as written.
- After a `lateralJoin`, whether my columns are under `f.post` or `f.latestPost` — the Remarks and the example disagree on the face of it.
- How to sort nulls last, which the page tells me I cannot do but does not tell me how to work around.
- Whether chain order matters anywhere other than `distinctOn`/`orderBy`.