Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**Line 19** — "No example uses `Address`, `Task`, `Bug`, or `Feature`. No example on this page uses `types`, `@@type`, `@@discriminator`, or `@@base`."
What stopped me: not a word, but the point. You gave me a schema containing five things, then told me none of them are used. So why are they there? I spent time reading `types { Embedding1536 = pgvector.Vector(1536) }`, `@@discriminator(type)`, and `@@base(Task, "bug")` — all new to me — before being told to ignore them. Plainest version: cut the unused models from the example schema. If they must stay, say "the schema below is the full example schema used across the reference pages; this page only uses `user`, `post`, `post_tag`, and `tag`."

**Line 137** — "`db.runtime()` returns the connection that runs a built query. `db.runtime()` is synchronous and returns immediately. Only `runtime.query()` is awaited. Hold the connection in a variable and reuse it. Write the type import path as `./contract.d`, exactly like that."
Five unrelated facts in five sentences, under a heading that says "The `db.sql` builder" but which is mostly about `db.runtime()`. "Write the type import path as `./contract.d`, exactly like that" told me *what* to type but gave me no reason, so I could not tell whether it is a real rule or a typo I should fix. Plainest version: split this into a short "connect and run" paragraph and a separate "build a query" paragraph.

**Line 137** — "Finish it with [`build()`](#build), which returns the built query."
Circular. `build()` returns the built query. I still do not know what a built query *is* — an object? SQL text? Is it sent to the database at `build()` time or at `query()` time? Plainest version: "`build()` turns the chain into a query object. Nothing touches the database until you pass it to `runtime.query()`."

**Line 172** — "Chain the methods in any order, except that a join must come before any call that names the joined table's columns, and `distinctOn()` needs its columns first in `orderBy()`."
Three rules in one sentence, and the third one I could not parse. "needs its columns first in `orderBy()`" — first in what sense? Does `distinctOn('userId')` have to be called before `orderBy`, or does `'userId'` have to be the leading `orderBy` key? I only worked it out from the example at line 465, where `distinctOn()` is called *last*. Plainest version: "The columns you pass to `distinctOn()` must be the first sort keys in `orderBy()`."

**Line 176** — "After a join, a column name that both tables have is on `f` only under its table name, such as `f.post.id`."
I believed this, then the `innerJoin` example at line 305 writes `f.user.email`, and `email` exists only on `user`. Line 283 says a name only one table has "stays on `f` directly." So which is it — is `f.user.email` also legal, or is the example wrong? The page never says both forms work. This is the single thing I was least sure about, and it affects every joined query I would write.

**Line 176** — "For an enum column you pass the value stored in the database, the string after `=` in the enum, so `High = \"high\"` is matched by `fns.eq(f.priority, 'high')`."
Works for `Priority`. But the schema's other enum, `user_type`, has no `=` at all — its members are bare `admin` and `user`. So what do I pass for `f.kind`? The rule as written has no answer.

**Line 340** — "On SQLite TypeScript rejects the call. If you get past the types, it throws an error whose `code` is `ORM.CAPABILITY_MISSING`."
"If you get past the types" — I had to guess this means "if you cast to `any` or ignore the error." Say that.

**Line 392** — "TypeScript also accepts a `nulls` option, but the builder ignores it and no `NULLS FIRST` or `NULLS LAST` reaches the SQL. Do not use it. To put nulls last, sort first by a computed value: an `fns.raw` fragment of the form `CASE WHEN <column> IS NULL THEN 1 ELSE 0 END` that returns `pg/int4@1`. Then call `orderBy()` again for the column itself."
I understood that `nulls` is broken. I could not reliably reconstruct the workaround from prose. This is the one place on the page that describes a multi-step code change with no code block, and it is also the one place where I am most likely to get it wrong.

## Words and phrases I had to guess

- **"facet"** (line 135, in the anchor `#the-dbsql-facet`) — appears nowhere in the prose. I guessed it means "the `db.sql` part of the client." If the word is not in the text, it should not be in the anchor.
- **"caveat that shows up only when the query runs"** (line 11) — guessed: "fails at runtime, not at compile time."
- **"SQL-family builder"** (line 13) — guessed: "the builder for SQL databases, as opposed to MongoDB."
- **"finished `SELECT` query"** (line 164) — guessed: a chain you have stopped adding to but have *not* called `build()` on. The page uses "finished" and "built" for different things and never says so. Line 520 ("You cannot call `build()` on it") is what finally told me.
- **"contract"** (line 131) — guessed: the new name for the schema. The page says the file is renamed but never says what the word means or what `contract.json` and `contract.d.ts` each contain.
- **"`Uuid`"** as a field type (line 51) — guessed: a new built-in scalar replacing v7's `String @db.Uuid`.
- **"`@1`"** in `pg/int4@1` (line 194) — guessed: a version number on the type id. Never stated.
- **"codec"**, in `.codecId` (line 194) — guessed: the thing that converts between the database type and the JS value. Never defined.
- **"plan"** (line 137) — I guessed this is just the examples' variable name, not a Prisma concept. The page does say "The examples name the built query `plan`," which helped, but `plan` also reads like a query plan, which it is not.
- **"top-N-per-group"** (line 336) — I know this one, but it is SQL-blog jargon, not plain English.
- **"scope"** (line 174) — this one you actually defined, and I used the definition throughout. Keep it.

## Where I asked "so what do I actually type?"

1. **Line 131, "Install `@prisma/orm-postgres`."** No command. Every other instruction on this page is a literal command (`npx prisma contract emit`). Give me `npm install @prisma/orm-postgres`.
2. **Line 142, `import contractJson from './contract.json' with { type: 'json' };`** Import attributes need specific `tsconfig.json` and Node settings. The page shows the line and says nothing about what has to be true for it to compile. I have never typed `with { type: 'json' }` in a v7 project.
3. **Line 131, where do these files live?** "beside it" — beside `contract.prisma`. But my source is in `src/`. The import is `'./contract.d'`, so the emitted files must sit next to my TypeScript. The page never reconciles these.
4. **Line 392, the nulls-last workaround.** Described in words only. I wanted the five-line code block.
5. **Line 192, "To return fewer columns, start a new query instead."** No example of what that looks like. I understand the concept; I wanted to see the two-query version so I know there is no `reselect()` I am missing.
6. **Line 194, type ids.** "A few use a longer name, such as `pg/timestamptz-temporal@1` for `DateTime`." Which few? Where is the full list? If my `fns.raw` returns a `numeric` or a `jsonb`, I have to guess the id, and the page's rule ("`pg/` plus the PostgreSQL type name plus `@1`") has just told me the rule has exceptions it will not enumerate.
7. **Closing the connection.** "Hold the connection in a variable and reuse it." Do I ever close it? In v7 I called `$disconnect()`. The page does not say, and this is the entry-points section.
8. **`outerLateralJoin()`** is named three times (lines 151, 340) and has no section, no signature, and no example. Line 340 says "same arguments, same availability," which is something, but it is buried in another method's Remarks.

## Where the page explains the internals when I only wanted to know what to do

1. **Line 133** — "`public` is the PostgreSQL schema your tables are in, and Prisma ORM 8 puts every table in `public` today." If every table is always in `public`, telling me why does not help me type anything. I only need "type `db.sql.public.<table>`."
2. **Line 137** — "`db.runtime()` is synchronous and returns immediately. Only `runtime.query()` is awaited." This is a fact about the implementation. The example at line 145 already shows me `const runtime = db.runtime()` with no `await`, which is all I needed.
3. **Line 392** — explaining that TypeScript accepts `nulls` but the builder drops it, and that "no `NULLS FIRST` or `NULLS LAST` reaches the SQL," is an explanation of a bug's mechanism. "The `nulls` option does nothing. Do this instead: [code]" is what I needed.
4. **Line 343** — "because a name both tables have is not in the query's scope on its own" is the reason. The rule in the sentence before it was enough.

## Could I do what the page is for, after one reading?

Partly. I could write a single-table `select().where().orderBy().limit().build()` and run it. The chain shape is clear, the examples are runnable, and the `f`/`fns` split made sense on the first pass.

What I still would not know:

- **Whether my join code compiles.** The `f.user.email` contradiction means I do not know if I must qualify every column after a join or only the ambiguous ones. This blocks the main reason I would reach for this builder at all.
- **How to get from my working v7 project to the first line of this page's code.** The Entry points section assumes `contract.prisma` already exists, points at a migration page I have not read, and does not say where the emitted files go relative to my source.
- **What to pass for an enum with no `=` values**, such as `kind`.
- **What type id to use** for any Postgres type not in the seven-item list.
- **How to sort nulls last**, concretely.
- **What `outerLateralJoin()` looks like when typed out.**
- **Whether I ever close the connection.**

One more thing that cost me confidence rather than comprehension: the schema declares `posts Post[]` on `Tag` and `tags Tag[]` on `Post`, *and* a separate explicit `PostTag` model. In v7 those are two different ways to model many-to-many and you pick one. The page then calls `post_tag` "the model for the `Post`/`Tag` join table" without explaining why both exist. I could not tell whether this is new v8 behaviour I need to learn or an error in the example schema.