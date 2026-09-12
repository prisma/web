I read `part1.mdx` once, top to bottom, as someone coming from Prisma ORM 7.

## Sentences I could not restate after one reading

**Line 17** — "Write this schema in `contract.prisma`, the file that replaces `schema.prisma` from Prisma ORM 7. This page calls that file your contract."
Stopped by: "contract" is a new word introduced by renaming, and the page never says what it *is* beyond "the new name for schema.prisma". Then `contract.json` and `contract.d.ts` appear, and I now have three "contract" things. Plainest wording I'd have understood: "Your schema now lives in `contract.prisma`. Running `npx prisma contract emit` compiles it into two generated files: `contract.json` (read at runtime) and `contract.d.ts` (read by TypeScript). You import both."

**Line 185** — "The name inside is a PostgreSQL type plus a version, and the version is always `@1` today."
Stopped by: if the version is always `@1`, why am I typing it? The sentence tells me a fact about the tool's future, not what to do. I'd have written: "Always write `@@type(\"pg/text@1\")`. Other versions do not exist yet."

**Line 186** — "A `native_enum` block stores the same members as a real PostgreSQL enum type instead."
Stopped by: "the same members" — the same as what? The example schema has no `native_enum` block, so I have nothing to compare against. And there is no `native_enum` code sample anywhere on the page. I would have needed three lines of actual `native_enum Priority { ... }` code.

**Line 189** — "`Post.tags Tag[]` and `Tag.posts Post[]` are joined through `PostTag` because `PostTag` has a foreign key to each of the two models and its `@@id` lists exactly those two foreign key columns."
Stopped by: too many ideas in one sentence, and the mechanism is implicit. Nothing on `Post` or `Tag` mentions `PostTag`. So the rule is "the tool scans for a model shaped like this and wires it up silently." I had to read this three times. Plainer: "Write a third model with one foreign key to each side and an `@@id` of exactly those two columns. Prisma finds it automatically — you do not reference it from `Post` or `Tag`."

**Line 194** — "The same `db` also has a query builder, `db.sql` on PostgreSQL and `db.query` on MongoDB, and `db.raw`, which this page does not cover."
Stopped by: I cannot tell whether "which this page does not cover" applies to `db.raw` alone or to all three. Split it into two sentences.

**Line 242** — "On MongoDB the accessor name is also the name of the database collection the documents are in, which is why `db.orm.users` reads the way it does."
Stopped by: "reads the way it does" explains nothing. The paragraph has just told me "collection" means a query object, then immediately uses "collection" to mean a MongoDB collection. I finished the paragraph less sure what the word means than when I started.

**Line 406** — "The heading calls that callback a refinement."
Stopped by: which heading? A sentence about the page's own headings is not a sentence about the tool. Say "This page calls that callback a refinement," or just call it one and move on.

**Line 418** — "Build every value from the collection the callback was given, which is `posts` in the example below. A value that is `posts` with more methods chained on it comes back as an array of rows."
Stopped by: in the example, `combine` is called *on* `posts` and `posts` is also used *inside* the object. I could not work out whether the inner `posts` is the same object, a copy, or something rebuilt each time. The rule "a value that is X with more methods chained on it" is a description of syntax, not of what I should write.

**Line 624** — "TypeScript rejects the call if you do not. Nothing checks this while the query runs, so a cursor on an unordered query is ignored and every row comes back with no error."
Stopped by: these two sentences contradict each other on first read. If TypeScript rejects it, how do I ever reach the runtime case? (I eventually guessed: plain JavaScript, or a `any` cast.) Say that.

**Line 722** — "a variant that sets its own `@@map`, as `Bug` and `Feature` do, is stored in a second table beside the base model's table. A variant without `@@map` is stored in the base model's table."
Stopped by: too many ideas, and I cannot act on any of them here. It also forward-references two methods I do not have yet.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the schema file, plus the generated files next to it.
- **"emit"** (`prisma contract emit`) — guessed: generate/compile. It is not a word I associate with running a schema step; `generate` was the ORM 7 word and the page never connects the two.
- **"variant"** — guessed: subclass / single-table inheritance. Line 188 defines it as "a model that reuses another model's fields and rows", which I only half-understood until the `Bug` example.
- **"discriminator"** — guessed from Java/ORM background. The page never says what value goes in the column; I guessed it is the string in `@@base(Task, "bug")`, i.e. `"bug"`. The page explicitly tells me *not* to pass that string to `variant()` but never says what it is for.
- **`@@base(Task, "bug")`** — guessed the second argument is the stored discriminator value.
- **"text-backed enum"** vs **"native enum"** — guessed: stored as a `text` column vs a real PostgreSQL `ENUM` type. The page does say this; my problem was that `Priority` is used as the example of both (line 186/514 describe `native_enum Priority`, but the schema declares `Priority` as a text-backed enum, and line 549 says so). Same name, two different declarations, no code for one of them.
- **`Expression`** (line 272) — guessed: whatever `u.email.eq(...)` returns. Not defined or linked.
- **`aggregate`** in `(relation: Collection) => Collection | aggregate` (line 371) — lowercase, so not a TypeScript type. Guessed it means "or one of the aggregate methods".
- **`@prisma/orm-mongo/query-ast/execution`** (line 244) — "query-ast" reads like an internal package path. Guessed AST = abstract syntax tree. I have no idea why a user-facing filter class lives behind that path, and it makes me think I am importing something private.
- **`types { Embedding1536 = pgvector.Vector(1536) }`** (line 24) — guessed: a type alias block. Never explained. Line 190 only tells me where `Embedding1536` comes from, not what the `types` block is or that I must write one.
- **"refinement"** — guessed: the callback passed to `include()`.
- **"which rounds"** (line 416) — guessed: returns an integer. To what precision? Unknown.

## Places I asked "so what do I actually type?" and got no answer

1. **Installing anything.** The page imports `@prisma/orm-postgres/runtime`, `@prisma/orm-mongo/runtime`, `@prisma/orm-extension-pgvector/runtime`, and `temporal-polyfill`. There is no `npm install` line anywhere. Line 11 says the migration page "lists the packages to install", but I am on the reference page with a code sample in front of me and I cannot run it.
2. **Getting from zero to `contract.prisma`.** Is there an `init` command? Does `src/prisma/` have to be created by hand? Line 17 says "A new project keeps all three files in `src/prisma/`" — is that a rule the tool enforces, a default I can change, or just a convention?
3. **Creating the tables.** `contract emit` writes `contract.json` and `contract.d.ts`. Nothing creates the `user` table. I came from `prisma migrate` and the page does not say what replaces it or link to it.
4. **tsconfig.** Two things in the first code sample need specific compiler settings and neither is mentioned: `import contractJson from './contract.json' with { type: 'json' }` (import attributes) and `from './contract.d'` (line 198 tells me to write it "exactly like that" but not what makes that resolve). If it needs `"module": "nodenext"` or `resolveJsonModule`, say so.
5. **Counting rows on a top-level query.** Line 411: `count`, `sum`, `avg`, `min`, `max` "are only callable **inside** an `include()` callback." So how do I count all users? This is the most basic thing I do every day in ORM 7 (`prisma.user.count()`) and the page tells me the method exists but I may not call it. Even a pointer ("see [Aggregates](#…)") would do.
6. **Getting correct types out of `select()` on MongoDB.** Line 328 tells me the type is wrong and to ignore it. It does not tell me what to write instead — a cast? `Pick<>`? Nothing.
7. **Writing a `native_enum`.** Described at line 186 and 514, recommended at 514 ("Declare the enum as a `native_enum` block when the sort order matters"), never shown.
8. **`interval` and `Time` columns** (line 412). Neither appears in the example schema and neither is a type I know how to declare. What do I write in `contract.prisma`?
9. **The `Customer` / `Order` schema.** Lines 462 and 465 run examples against models I cannot see, pointing at a section further down. Same for `acmeId` and `emptyCustomerId` at lines 252–253.
10. **Where the example rows come from.** Line 246: "these ids, which stand for rows inserted before the query runs." Inserted how? There is no seed snippet, so I cannot reproduce a single example on this page.
11. **Multi-column cursors.** Line 625 says the cursor object "must name every column the `orderBy()` sorts on", but the only example uses one column. With two columns, what does the object look like, and does it compare them as a tuple?
12. **`distinctOn` ordering.** Line 689 says call `orderBy()` first. In PostgreSQL, `DISTINCT ON` requires the leading `ORDER BY` columns to match the distinct columns. The example (line 708) obeys that, but the page never says it is a rule, so I would have written a broken query and not known why.
13. **`distinct()` with no `select()`.** Line 678 chains `select('priority').distinct('priority')`. Do I need the `select()`? The page does not say.
14. **The `Temporal` polyfill** (line 500). It shows `import 'temporal-polyfill/full/global'` but not the install command or where the import goes.
15. **Custom `Collection` subclass** (line 222): "create the client with `orm(...)` ... instead of `postgres(...)`". Does `orm()` take the same `{ contractJson, url }` object? Does it still connect to Postgres? Unanswered here.

## Places that explain internals when I only wanted to know what to do

- **Line 722** — variants with `@@map` go "in a second table beside the base model's table", without `@@map` in the base table. That is storage layout. What I want to know is which one to pick and what breaks.
- **Line 189** — the whole explanation of why `PostTag` is detected (foreign keys, `@@id` contents). I want the rule as an instruction, not as a description of the detection algorithm.
- **Line 185** — "The name inside is a PostgreSQL type plus a version, and the version is always `@1` today." Internal format of a string I am told to copy verbatim.
- **Line 502** — "TypeScript rejects `'createdAt'`, because PostgreSQL has no `SUM` or `AVG` over a date or a timestamp." The reason is fine, but it is the third sentence in a row about why the type system says no, when the actionable content is one sentence.
- **Line 244** — `@prisma/orm-mongo/query-ast/execution` exposes the tool's internal module layout in an import path I am told to type.
- **Line 328 and 363** — both are honest descriptions of bugs or leaks in the MongoDB layer (`select()` lies about types; related `_id` is an `ObjectId` instead of a string). I understand them, but both stop at describing the leak instead of telling me the workaround. Line 363 at least gives me `String(...)`; line 328 gives me nothing.

## Could I do what the page is for, after one reading?

Partly. I could write query chains: `where`, `select`, `orderBy`, `limit`, `offset`, `distinct`, `variant`. The method sections are consistent and the Remarks/Options/Return type/Examples shape is easy to scan. The PostgreSQL-vs-MongoDB differences are called out where they matter.

I could not get to the point of running one. After one reading I still would not know:

- What to install. No package names in a command anywhere on the page.
- How to create `contract.prisma` in a new project, or whether `src/prisma/` is required.
- How the tables get created. Nothing replaces `prisma migrate` here, and nothing links to it.
- What tsconfig settings the first code sample needs.
- How to count, sum, or average anything that is not inside an `include()` callback.
- How to write a `native_enum`, an `interval` column, or a `Time` column, all three of which the page tells me to use.
- What the second argument to `@@base("bug")` is for.
- How to reproduce any example, because the rows the examples query are never inserted anywhere on the page.

The biggest single problem is the gap between line 17 ("Write this schema in `contract.prisma`... run `npx prisma contract emit`") and line 200 (a code sample importing three packages I have never installed). Everything between those two points is missing, and the page reads as if I had already done it.