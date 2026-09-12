Read once, cold, as a Prisma ORM 7 user. Findings below.

---

## Sentences I could not restate after one reading

**Line 19 — "You write this schema in your contract, the `contract.prisma` file that replaced `schema.prisma`."**
Stopped by "contract". The sentence uses the word three ways in one line: a thing you write in, a file name, and later a `.json` and a `.d.ts`. I don't know whether "contract" is a file, a concept, or a directory. Plainer: "Write your schema in `contract.prisma`. This file replaces `schema.prisma` from ORM 7."

**Line 19–20 — "run `npx prisma contract emit`. That command writes `contract.json` and `contract.d.ts`, the two files the examples below import."**
Writes them *where*? Next to `contract.prisma`? In my source folder? The examples import `'./contract.json'`, so apparently next to my code, but the page never says.

**Line 187 — "`@@type("pg/text@1")` on an `enum` block stores the enum as a text column, with a check constraint that allows only the declared values."**
I cannot decode `pg/text@1`. Is `@1` a version? Are there other values (`pg/text@2`)? The MongoDB schema has `mongo/string@1`, which makes me think it's a registry of names I've never seen and the page doesn't list.

**Line 188 — "A `native_enum` block is the other kind."**
"The other kind" of what — enum declaration syntax? And `native_enum` appears nowhere in the example schema, so I can't see what one looks like. This is the first of two places where the page names a thing and never shows it.

**Line 190 — "`@@base(Task, "bug")` makes `Bug` a variant of `Task`: a model stored together with the model it is based on."**
Too many new ideas at once: `@@base`, "variant", "@@discriminator", and `variant('Bug')` all land in one bullet. I got roughly "subclassing", but I could not restate what is stored where until I read line 722, 500 lines later, which says a variant with `@@map` uses a second table. Those two facts belong together.

**Line 367 — "the `_id` of a loaded related document comes back as a driver `ObjectId`, not as the hex string a document's own id field comes back as."**
Three clauses and two different `_id`s. Plainer: "A document's own `_id` comes back as a hex string. An `_id` on a related document loaded by `include()` comes back as an `ObjectId` object instead."

**Line 416 — "They do not take a date or a timestamp: TypeScript rejects the field name, because the fields these two accept leave those columns out."**
The clause after "because" restates the clause before it and adds nothing I can use. Plainer: "TypeScript rejects a date or timestamp field name here."

**Line 422 — "Each value must start from the collection the callback was given, which is why the example below writes `posts` inside its own callback."**
I could not restate this. "Start from the collection the callback was given" is abstract, and "writes `posts` inside its own callback" describes the example rather than the rule. Looking at the code, `posts.combine({ recent: posts.orderBy(...), total: posts.count() })` — `posts` referring to itself inside its own argument is genuinely confusing, and the prose made it worse, not better.

**Line 504 — the whole `Temporal` note.**
One sentence carries: the return type, what `Temporal.Instant` is, a polyfill import, a global check, plus two methods that don't compile and why. Four separate facts. I stopped at "if your runtime has no global `Temporal`" — how do I know whether mine does?

**Line 516 — "To sort a text-backed enum by meaning, store numbers rather than words, or write your own ranking expression."**
"Store numbers rather than words" — in the enum's `= "..."` values? Then `.eq('urgent')` becomes `.eq('3')`? The page told me on line 189 that the `=` string is what I pass to `.eq()`, so this advice silently breaks every other example. And "write your own ranking expression" is given no syntax at all.

**Line 626 — "TypeScript rejects the call if you do not, but nothing checks at runtime. If you get past the type system, the cursor value is ignored and you get every row back, with no error."**
I understood the words but not why I am being told. I am not planning to get past the type system. The same construction appears three times (lines 368, 626, 690), and each time it reads as a note to the maintainers.

---

## Words and phrases I had to guess at

- **"collection"** — used constantly from line 246 on, never defined. I guessed "the chainable query object", but on MongoDB "collection" also means the actual Mongo collection (line 228, 723), so I was guessing which one was meant every time.
- **"contract"** — guessed: the new name for the schema plus its generated output.
- **"terminals"**, in the link `#read-terminals` — guessed: methods that end a chain and run the query. The visible text says "read method", so the anchor uses a word the page never does.
- **"`db.orm`"** — guessed that `orm` is a namespace on the client and that `db` has other namespaces. Never said.
- **"Refinements"** (line 408 heading) — guessed: the callback passed to `include()`.
- **"variant"** — guessed: subclass. Mostly right.
- **"text-backed enum"** / **"native enum"** — I worked these out from lines 187–188, but only because they are defined there. They are then used hundreds of lines later with no reminder.
- **"Project a row down to"** (line 325) — guessed "select fewer fields".
- **"`Uuid`"** — guessed it replaces `String @db.Uuid`. The page says it's "the type for a PostgreSQL `uuid` column", which does not tell me it's a new built-in scalar rather than something I import.
- **"`./contract.d`"** (lines 204, 232) — I assumed this is a typo for `./contract`. I have never imported from a path ending in `.d` and I would have spent time on this.
- **"`@prisma/orm-mongo/query-ast/execution`"** (line 312) — "query-ast/execution" reads like an internal module path that leaked into a public import. I would not trust it to be stable.

---

## Places I asked "so what do I actually type?"

1. **Installing anything.** The page imports `@prisma/orm-postgres/runtime`, `@prisma/orm-mongo/runtime`, and `@prisma/orm-extension-pgvector/runtime`, and runs `npx prisma contract emit`. There is no `npm install` line anywhere. As a v7 user I have `@prisma/client` installed; I don't know what to remove or add.
2. **Where `contract.prisma` lives and where the emitted files land.** Covered above.
3. **What happened to my v7 code.** I have two years of `prisma.user.findMany({ where: ... })`. The page never says `findMany` is now `.where(...).all()`, or that `PrismaClient` is now `postgres(...)`. One mapping table, or even one sentence, would have oriented me. Line 13 sends me to "Fundamentals guides" instead.
4. **Closing the client.** No `$disconnect` equivalent, no statement about whether `db` is a singleton I create once per process.
5. **A `native_enum` block.** Named on line 188, never shown.
6. **Any Postgres operator other than `.eq()`.** Line 267 says `where()` takes "a callback that calls an operator on a column". The only operator shown in this entire part is `.eq()`. Line 248 points at a section I don't have.
7. **Any MongoFieldFilter operator list.** I get `.eq` and `.gte`. Line 268 says "For anything else, such as greater-than, use `MongoFieldFilter`" — so what else is there?
8. **How the `PostTag` model connects.** Line 191 says "`PostTag` is required. A many-to-many needs the model for the join table, and a pair of list fields with no such model is rejected." But in the schema, `Post` has `tags Tag[]` and `Tag` has `posts Post[]`, and neither mentions `PostTag`. Nothing I can see links them. If I were writing my own many-to-many, I would not know what to type.
9. **`Customer` and `Order`.** Lines 466, 469, 474, 483 run examples against models the page explicitly says are shown somewhere else. I cannot run the `sum()`/`avg()` examples as written. Line 17 warns me, which does not help.
10. **What to do about MongoDB `select()`.** Line 331: "changes what the database returns but not the TypeScript type." So my type says `bio` exists and at runtime it does not. What am I supposed to do — cast? Pick fields by hand? The page states the problem and stops.
11. **`avgDecimal(field)` returns "the exact average ... as a decimal string."** Do I `Number(...)` it? Feed it to a decimal library? Which one?
12. **Custom `Collection` subclass** (line 224): "subclass `Collection` and register the subclass with the `orm(...)` function instead of calling `postgres(...)`." So I give up `postgres(...)` — do I still pass `url` and `contractJson`? Where does `Collection` come from? Deferred to a section I don't have, but the deferral is placed in the setup section where I'm actively trying to create a client.
13. **`distinct()` vs `distinctOn()`.** Both examples produce a value with no comment showing what came back. Every aggregate example has a `// result is ...` comment; these two don't, and they're the two I'd most need it for.

---

## Places explaining internals when I only wanted to know what to do

- Line 187: "with a check constraint that allows only the declared values."
- Line 188: "It creates a real PostgreSQL enum type with `CREATE TYPE ... AS ENUM`."
- Line 414, 625, 661, 689: "Calling one throws a `TypeError`." Told four times. I am not going to call a method that doesn't exist; telling me the JavaScript error class is for someone debugging the runtime.
- Line 416: "because the fields these two accept leave those columns out."
- Line 419: "Past ±(2^53 − 1) a `number` cannot hold the total." I know what a float is. The actionable half is "use `sumBigInt`".
- Lines 368, 626, 690: the three "if you get past the type system" notes.
- Line 722: "keeps its own fields in a second table alongside the base model's table." Storage layout, when the thing I wanted was "call `variant('Bug')`".
- Line 312: `query-ast/execution` in a public import path.

---

## Could I do what the page is for, after one reading?

Partly. I could chain `where`, `select`, `orderBy`, `limit`, `offset`, `distinct`, and `variant` on Postgres and produce a query that looks right, because the examples are concrete and the Postgres and MongoDB forms are clearly separated. The per-method structure (Remarks / Options / Return type / Examples) is easy to skim.

What I would still not know:

- **How to get to the point where any of this runs.** No install step, no file locations, no statement of what replaces my existing `PrismaClient` setup. I would be stuck before the first example.
- **Whether `./contract.d` is literally what I type.**
- **Any filter operator beyond `.eq()` on Postgres.** That is the single most common thing I do, and this part of the page cannot answer it.
- **How to declare a many-to-many**, because `PostTag` is asserted to be required and is not wired to anything visible.
- **What `combine()` actually requires.** I could copy the example. I could not write a different one.
- **What a `native_enum` block looks like**, despite the page using the native-vs-text distinction to explain sort order.
- **Whether "collection" means the query builder or the Mongo collection** at any given mention.

The page assumes I already know what a "contract" and a "collection" are. It defines the schema attributes carefully on lines 184–192 and then never gives the same treatment to the two words it leans on hardest.