Read once, top to bottom, as a Prisma ORM 7 user who has never seen version 8.

## Sentences I could not restate after one reading

**Line 11** — "This page assumes a project where `prisma orm init` has already run and your tables exist: [Coming from Prisma ORM 7](/orm/coming-from-prisma-orm-7) has the packages to install, `prisma orm init`, and `prisma db update`, which replaces `prisma migrate`, and [How migrations work](/orm/migrations/how-migrations-work) creates the tables."

Too many ideas in one sentence, and the grammar breaks at the end. The last clause reads as if the *page* creates my tables. I also can't tell whether `prisma db update` is the thing that creates tables or something else. Plainer: "This page assumes your tables already exist. To install the packages and run `prisma orm init`, see Coming from Prisma ORM 7. `prisma db update` replaces `prisma migrate`; see How migrations work."

**Line 15** — "Your schema now lives in `contract.prisma`, the contract, which replaces `schema.prisma` from Prisma ORM 7."

The floating appositive "the contract" stopped me. Is "the contract" the file, the concept, or a product name? I read it three times. Plainer: "`contract.prisma` replaces `schema.prisma`. This page calls it the contract."

**Line 229** — "You still create the client with `postgres(...)`, and `orm(...)` takes two things from that client."

Which two things? The sentence deliberately withholds the answer and sends me to a section I don't have. This is the single most frustrating sentence on the page — it tells me a fact exists without telling me the fact.

**Line 249** — "On this page, a collection is the query object you chain more methods on… On MongoDB, `users` in `db.orm.users` is also the name of the database collection."

Two different meanings for "collection", one paragraph apart. After one reading I could not say which meaning applies when the page later says "`distinct()` does not exist on a MongoDB collection" — the query object, or the database collection?

**Line 424** — "Call `posts.combine({ ... })`, and inside the object write `posts` again for each value. It is the same object every time."

"It is the same object every time" is the sentence I could not restate at all. Same as what? I guessed it means the `posts` you write inside the object is the same collection the callback received, so reusing it does not accumulate earlier chaining. The page should say that literally.

**Line 511** — "On PostgreSQL, a native enum column sorts in the order its members are declared, not alphabetically. The example schema declares `Priority` text-backed, so it sorts by its stored text."

The bullet starts on native enums and switches to text-backed enums mid-bullet, so the first sentence looks like it describes the example and then does not. I had to reread to work out these are two different cases.

**Line 622** — "The rows are compared as a pair, so you get the rows past the first column's value, plus the rows with that same first value and past the second."

Dense. I think it means the cursor compares sort keys as a tuple, but I could not restate it cleanly on one reading.

**Line 334** — "The type still lists every field on the model, so read only the fields you named from each returned document and treat the rest as absent."

I understand the instruction. I do not know what actually happens if I read one anyway — `undefined`? a crash? The page tells me the rule but not the consequence.

## Words and phrases I had to guess

- **"the contract"** — guessed: the new name for the schema file and everything generated from it.
- **`prisma contract emit`** — guessed: the replacement for `prisma generate`. The page never says so, and that is the one comparison a version-7 user needs.
- **`@@type("pg/text@1")`** — guessed the `@1` is a format version I must not change, because the page says "Other versions do not exist yet." I do not know what a version of a storage format is.
- **`types { Embedding1536 = pgvector.Vector(1536) }`** — guessed `pgvector.` is a namespace from an installed extension package. Explained 175 lines later at line 197, long after I hit it.
- **"variant"** — guessed: single-table inheritance. The word is new and the explanation at line 195 arrives before "collection" is defined, so "`variant('Bug')` narrows a collection to that variant" was meaningless where I read it.
- **"refinement"** (line 412) — guessed: the callback. The page names it and then never uses the name again, so naming it served no purpose.
- **`Time` column** (line 418) — guessed: a time-of-day type. Not in the example schema, not defined anywhere on the page. I do not know how to declare one.
- **"native enum"** vs **"text-backed enum"** — guessed correctly, but the example schema uses the text-backed form while the advice at line 511 pushes me to the native form, so I could not tell which the page recommends.
- **`dbName: 'app'`** (line 240) — guessed: the MongoDB database name. Never stated.
- **`db.sql`, `db.query`, `db.raw`** (line 201) — guessed from the names. The page says "This page covers none of those three" and gives no link, so the mention is a dead end.
- **`all()` and `first()`** — used in every example from line 214 onward; the definition is in a section I do not have. I guessed "run it and return an array" and "run it and return one row or null".

## Places I asked "so what do I actually type?"

1. **Where do I run `prisma contract emit` from, and where does it write?** Line 15 says "A new project keeps all three files in `src/prisma/`" but never says whether `emit` puts them there or I configure a path.
2. **What is the real import path?** Every example is `from './contract.d'`. If my code is in `src/routes/`, do I write `'../prisma/contract.d'`? The page insists the path is "written exactly like that", which made me think the literal string matters.
3. **Which package do I install?** Imports come from `@prisma/orm-postgres/runtime`, `@prisma/orm-postgres/orm-client`, `@prisma/orm-mongo/runtime`, `@prisma/orm-mongo/query-ast/execution`, and `@prisma/orm-extension-pgvector/runtime`. I cannot tell how many npm packages that is.
4. **`orm(...)` at line 229** — I want the two lines of code and get a forward reference.
5. **The Temporal polyfill (line 497)** — "add a polyfill: `import 'temporal-polyfill/full/global'`". Do I `npm install temporal-polyfill` first? Not said.
6. **What type is `createdAt` in a result?** The cursor example passes `last.createdAt` straight back in, the MongoDB filter passes `new Date(...)`, and `min('createdAt')` returns a `Temporal.Instant`. Three shapes, no statement of which one a plain row field is.
7. **Options tables call the argument `filter` (line 278) and `filter / orderBy / limit / offset` (line 430)**, but the methods are `where()`, `orderBy()`, `limit()`, `offset()`. There is no method called `filter`. I do not know what to type.
8. **`distinct()` (line 657)** — "keeps one whole row per distinct `priority` value". Which row? The example then uses `select('priority')` anyway, contradicting the advice that I don't need it.
9. **`Customer` / `Order` (line 471)** — the sum and avg examples use models whose schema is not on this part of the page, so I cannot run them.
10. **MongoDB `variant()` (line 745)** — `db.orm.posts.variant('Tutorial')`, but MongoDB models are addressed by collection name everywhere else. Is `'Tutorial'` the model name even though `Post` is addressed as `posts`? The page says "Pass the variant's model name", which contradicts the collection-name rule at line 233 and left me unsure.

## Places explaining internals when I wanted instructions

- **Line 205** — "The import path `./contract.d` is written exactly like that, with no `.ts` on the end, and it resolves to the emitted `contract.d.ts`." I only needed the line of code.
- **Line 621** — "The library does not check this while the query runs, so code that skips TypeScript, such as plain JavaScript or a cast, gets no error." This is about the library's implementation. The instruction is "always call `orderBy()` before `cursor()`."
- **Line 688** — "PostgreSQL rejects a query whose `ORDER BY` does not begin with the `DISTINCT ON` columns. The library does not check this, so a mismatch fails in the database." I am told the generated SQL and where validation is missing. I wanted: "start the `orderBy()` with the same columns."
- **Line 721** — "a variant that sets its own `@@map`… gets its own table. That changes how some writes behave; see `createAndCount()` and `upsert()`." Storage layout plus two forward references, and no statement of what I should do.
- **Line 369** — the `_id` hex-string versus `ObjectId` split. Actionable in the end, but it is a description of a leaked implementation detail rather than a rule.
- **Line 499** — "PostgreSQL has no `SUM` or `AVG` over a date or a timestamp." Fine as a footnote, but it explains the database's limits when "these do not compile" already covered it.

## Could I do what the page is for after one reading?

Partly. I could write `where()`, `select()`, `orderBy()`, `limit()`, `offset()`, `distinct()`, and `variant()` calls by copying the examples, and I could tell PostgreSQL and MongoDB apart. Two things I could not do.

**I could not get to the first line of working code.** The setup section assumes `contract.json` and `contract.d.ts` already sit next to my source file. I do not know which packages to install, where the emitted files land, what import path to write from my own directory, or whether `prisma contract emit` is the thing I run instead of `prisma generate`. For a version-7 user, that is the whole migration question and the page skips it.

**I could not use `combine()`, or `orm(...)` for custom methods.** `combine()` because "It is the same object every time" never resolved. `orm(...)` because the page tells me it takes two things from the client and refuses to say which.

Smaller gaps that would still stop me: what a `Time` column is, whether I should use `enum` or `native_enum` in a new schema, and what type a `DateTime` field actually holds when it comes back from a query.