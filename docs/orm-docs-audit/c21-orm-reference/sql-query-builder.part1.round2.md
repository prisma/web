Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**1. Line 131 (the whole "Entry points" paragraph).** It is one block of ~10 sentences that switches topic four times: how to build a query, what a contract is, what `prisma contract emit` produces, how table names are derived, and what `public` means. Quoting the worst of it:

> "The client reads your contract, the `contract.prisma` file that replaced `schema.prisma`. Running `npx prisma contract emit` compiles the contract into the two files every example here imports: `contract.json`, read when your app runs, and `contract.d.ts`, read by TypeScript."

What stopped me: "contract" is a brand-new word introduced mid-paragraph with no heading of its own, and the sentence explains what each file is *for internally* when all I need is "run this command before you build queries." Plainer: "Before you can build queries, run `npx prisma contract emit`. It writes `contract.json` and `contract.d.ts`, which the examples below import."

**2. Line 131, last sentence.**

> "`public` is the PostgreSQL schema, the namespace your tables live in unless you set another one."

I can restate it, but "unless you set another one" is a dead end — the page never says where you set it or what you write instead. Plainer: name the frontmatter/schema setting, or drop the clause.

**3. Line 135.**

> "`db.runtime()` is the connection that runs a built query. On PostgreSQL it is synchronous, so do not await it."

Two ideas, and the second is about the tool's internals. Then three lines later the examples `await runtime.query(plan)`. After one reading I was unsure whether "do not await" applied to `query()` too. Plainer: "`db.runtime()` returns the connection. Do not `await` it — only `runtime.query()` is awaited."

**4. Lines 149–155.**

> "The `sql(...)` function from `@prisma/orm-postgres/builder/runtime` builds the same query builder around your own database client instead, from that client's `db.context`"

Three unexplained things in one sentence: what "your own database client" means when the example still passes `db.context` (so it *is* the Prisma client?), what `db.context` is, and `rawCodecInferer: { inferCodec: () => 'pg/text@1' }` — which appears in code and is never mentioned in prose at all. I could not restate any of this. I would cut the whole block or give it a section that says who needs it and why.

**5. Line 187–189.**

> "The first is `f`, which has one property per column the query can name at that point."

"at that point" is doing a lot of work and the thing it refers to ("scope") is defined in the *next* paragraph. Plainer: put line 189 first, then define `f` in terms of it.

**6. Line 207.**

> "A computed expression's result type comes from `.returns(...)` on `fns.raw`, or from the operation's own declared return type. A type id such as `pg/int4@1` is the PostgreSQL type plus a version, always `@1` today. [Raw queries] shows the ones a bare JavaScript value gets, and you can take one from a column: `db.sql.public.user.columns.id`."

Three sentences, four ideas, and the third one I genuinely could not parse. "shows the ones a bare JavaScript value gets" — the ones *what*? Type ids, presumably, but "a bare JavaScript value gets" a type id is backwards from how I think about it. And "you can take one from a column" — take a *type id* from a column? Does `db.sql.public.user.columns.id` evaluate to the string `'pg/uuid@1'`, or to something else I pass to `.returns()`? Unresolved.

**7. Line 346.**

> "After the join, a column name that both tables have must be written under its table, such as `f.post.id` or `f.post.createdAt`. A bare `select('id')` or `orderBy((f) => f.createdAt, ...)` throws, because a name both tables have is not in the query's scope on its own."

The second sentence restates the first and then adds a reason that contradicts line 286, which told me that after *any* join I address columns by table name. So: is table-prefixing always required after a join, or only for names both tables share? The page says both.

**8. Line 343.**

> "Not available on SQLite, where the call does not compile. If you reach it anyway, it throws an error whose `code` is `ORM.CAPABILITY_MISSING`"

"If you reach it anyway" — how? If it does not compile, what is the path where it runs? I guessed "if you ignore the TypeScript error or use JavaScript," but the page does not say. Same wording at line 448.

## Words and phrases I had to guess

- **"table-level, SQL-shaped methods"** (line 9) — guessed: "methods that look like SQL clauses and start from a table rather than a model."
- **"facet"** — in the anchor `[#the-dbsql-facet]` (line 133). The word appears nowhere in the prose. Guessed it is leftover internal vocabulary; it will show up in the URL people share.
- **"plan"** (line 145) — the variable name. `build()` is described as returning "the built query," but the variable is called `plan` everywhere. I guessed they are the same thing. `build()` itself is only defined in part 2, and I am told to call it ~20 times before that.
- **"Project a row down to"** (line 193) — guessed "reduce each row to."
- **"scope"** (line 189) — I guessed "the set of column names TypeScript will let you write," but I did not know whether violating it is a compile error or a runtime error until line 201 told me it is neither, it is a throw at call time.
- **`outerLeftJoin`** — guessed it is SQL's `LEFT OUTER JOIN`. The name is reversed from SQL, and the page never says so.
- **`rawCodecInferer` / `inferCodec`** (line 154) — no guess. I do not know what a codec is here.
- **`db.context`** (line 154) — guessed "some internal handle on the connection."
- **`SelectQuery`** — guessed it is a type name I never import, only see in tables.
- **`lateral`** (line 344) — "The callback receives a `lateral` builder." I guessed it is a table-less starting point that you point at a table with `.from()`.

## Places I asked "so what do I actually type?"

1. **Installing and importing.** Line 131 sends me to "Coming from Prisma ORM 7" for "the packages to install and the commands to run." On a reference page that opens with `import postgres from '@prisma/orm-postgres/runtime'`, I wanted one line naming the package.
2. **`import type { Contract } from './contract.d'`** — where do `contract.json` and `contract.d.ts` land relative to my source? The import path `'./contract.d'` (with the `.d`, no extension) is unusual enough that I would have copied it wrong.
3. **Setting a schema other than `public`.** Told it is possible, not told how.
4. **Getting a type id for `.returns()`.** I need `pg/int4@1` for every `fns.raw`. There is no list on this page and the pointer to it (line 207) is a sentence I could not parse.
5. **Ordering nulls.** Line 395 tells me `nulls` is accepted by TypeScript and silently does nothing. It does not tell me what to do instead — presumably `fns.raw` in `orderBy`, but the page does not say.
6. **`select()` replacing columns.** "Calling `select()` a second time never replaces the first call's columns." So how do I drop a column I already selected? Not answered.
7. **`db.sql.public.tag.insert([{ id, label: 'typescript' }])`** (line 165) — `id` is an undeclared variable. The `Uuid @id @default(uuid())` in the schema made me expect I could omit it. Do I have to generate ids myself with `db.sql`?
8. **Inside `lateralJoin`, where does `f.user.id` come from?** The example (line 371) uses `f.post.userId` and `f.user.id` in the same callback. The Remarks say "The subquery can filter on the outer row's columns," but never say that the outer table's columns appear on the same `f` under its own table name. I inferred it from the example, not the prose.
9. **Is a built query reusable?** Can I hold `plan` and run it twice, or with different parameters? Not addressed.

## Places explaining internals when I wanted instructions

- **Line 345:** "a chain with `.as(...)` on the end throws `subquery.getRowFields is not a function`." That is a JavaScript stack trace from inside the library. I only needed "do not call `.as()` here" — which the sentence already said twice before this.
- **Line 207:** "A type id such as `pg/int4@1` is the PostgreSQL type plus a version, always `@1` today." Tells me how the identifier is constructed; does not tell me where to get the right one.
- **Line 131:** the `contract.json` / `contract.d.ts` split — "read when your app runs" vs "read by TypeScript" is the library's internal division of labour. I need to run one command.
- **Line 448:** "`DISTINCT ON` is a PostgreSQL extension to SQL." True, and irrelevant to what I do.
- **Line 19:** the schema block carries `types { Embedding1536 = pgvector.Vector(1536) }`, `@@type("pg/text@1")`, `@@discriminator(type)`, and `@@base(Task, "bug")` — four features I have never seen, in the first code block, none of which any example uses. The page tells me to ignore `Address`, `Task`, `Bug`, and `Feature`, but not the syntax around them.

## Could I do what the page is for, after one reading?

Partly. I could write a `select` with `where`, `orderBy`, `limit`, `offset`, an `innerJoin`, an `outerLeftJoin`, and a `.as()` subquery, by copying the examples and changing table and column names. Those sections are clear and each has a runnable example.

What I would still not know:

- **How to get to a working `db` at all.** Everything on the page hangs off `db.sql.public`, and the one paragraph that creates `db` sends the install and setup steps to another page while spending its own words on what the two generated files are for. I would have stopped at line 131 and gone looking elsewhere.
- **What `build()` actually returns and whether I can reuse it.** The page's central verb is defined in a half I do not have.
- **How to write any `fns.raw` expression**, because I cannot get a type id for `.returns()` and every computed-column example needs one.
- **Whether table-prefixing after a join is always required or only for ambiguous names.** Lines 286 and 346 disagree.
- **What the second entry point (`sql(...)`, `rawCodecInferer`) is for,** or whether I am supposed to care.
- **The SQLite story.** The note promises SQLite is supported, one sentence says drop `public`, and then every example and two "PostgreSQL only" remarks are Postgres. I would not know which of the SELECT methods I can use on SQLite without testing each one.