Read once, top to bottom, as someone coming from Prisma 6.

## Sentences I could not restate after one reading

**1.** "Prisma ORM 8 replaces `schema.prisma` with [a contract](/orm/contract-authoring/the-data-contract)."
Stopped by: "a contract" is a new word and the page never says what it is. I only learn it is a file that emits two other files. Plainer: "Instead of `schema.prisma`, Prisma 8 reads a single file called the contract, which describes your models."

**2.** "[`npx prisma contract emit`](/cli/contract-emit) writes `contract.json` and `contract.d.ts` beside the source, and both forms produce those same two files."
Stopped by: "beside the source" — beside which source? I guessed `src/prisma/`. Also three ideas in one sentence. Plainer: "Run `npx prisma contract emit`. It writes `contract.json` and `contract.d.ts` into the same folder as your contract file."

**3.** "Its one argument gives you `field`, `model`, `rel`, and `type`. Those four come from the argument, not from imports."
This contradicts the example directly above it. The example destructures only three — `({ field, model, type })` — and imports `rel` from `@prisma/orm-postgres/contract-builder`. So which is right for `rel`? I could not tell, and this is the kind of thing that makes the file not compile. Same for `enumType` and `member`, which are imported and never mentioned in this list.

**4.** "`constraints.index` takes one column for a plain index and a list for a multi-column index."
The example right above passes a list in both cases: `constraints.index([cols.userId])`. So do I type `cols.userId` or `[cols.userId]` for one column? The sentence and the code disagree.

**5.** "`codecId` is the type id, which is the PostgreSQL type plus a version, always `@1` today."
"pg/text@1" is not "the PostgreSQL type plus a version" — there is a `pg/` prefix the sentence does not account for. And "codec" is never defined. Plainer: "`codecId` is a string of the form `pg/<postgres type>@1`."

**6.** "A primary key made of two fields is a model attribute rather than storage mapping."
Stopped by: this is a category distinction internal to Prisma. As a reader I do not know what "model attribute" means or why I should care. Plainer: "For a primary key made of two fields, use `.attributes(...)` instead of `.sql(...)`."

**7.** "`.relations(...)`, `.attributes(...)`, and `.sql(...)` are independent."
"Independent" of what? Can I call them in any order? Can I call `.sql(...)` twice? Can I chain all three? The example only ever shows `.relations().sql()`. Plainer: "You can chain any of these three, in any order, and you can skip any of them."

**8.** "`prisma contract emit` writes the contract to JSON in a fixed key order and hashes it. A contract that changes per machine or per run breaks that hash and the checks that rely on it."
Two problems. "the checks that rely on it" — which checks? Never named, so I cannot judge how bad this is. And the hashing detail is machinery I did not ask about. Plainer: "Do not read `process.env`, the clock, or random values in the contract file. Prisma compares a hash of the contract across runs, and a contract that changes every run fails that comparison."

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the schema.
- **"PSL"** — expanded on first use, good, but I guessed it is basically the old `schema.prisma` language.
- **"codec"** in `codecId` — guessed: a rule for converting between the database value and the JavaScript value.
- **"extension pack"** / **"pack"** — guessed: an npm package that adds column types, like pgvector.
- **`/pack` vs `/control` exports** — guessed: two entry points of the same package, one for the contract and one for the config. I do not know why, but the page tells me which goes where, which is enough.
- **`ulid`, `nanoid`, `cuid2`, `ksuid`** — guessed: ID string formats. I do not know how to choose between them and the page does not link anywhere.
- **`field.uuidNative()` vs `field.uuidString()`** — guessed from the table: one makes a `uuid` column, one a text column.
- **"emitted files"** (description) / "the two files" — guessed: `contract.json` and `contract.d.ts`.
- **`Model.refs` vs `Model.ref("_id")`** — the page uses `User.refs.id` for PostgreSQL and `User.ref("_id")` for MongoDB. I guessed these are two different APIs for the two databases. Never stated.
- **`cols` vs `fields`** — `.sql(({ cols, constraints }) => ...)` and `.attributes(({ fields, constraints }) => ...)`. I guessed they are the same thing under two names. Never stated.

## "So what do I actually type?" — not answered

1. **How do I create the contract file in the first place?** The page shows a finished file and a config pointing at it, but never says whether `npx prisma init` makes it or whether I create `src/prisma/contract.ts` by hand. The only creation advice is in "Parity with PSL," and only for converting an existing project.

2. **A date without a time.** "There is no helper for a date without a time, or a time without a date." So what do I type? A `field.dateTime()` with `.column()`? A codec? The page names the gap and then stops.

3. **Where does `.sql({ fk: ... })` go on a relation?** "Chain `.sql({ fk: { name: "post_userId_fkey" } })` on the relation." Chain it onto what expression — `rel.belongsTo(User, {...}).sql({...})`, inside the `.relations({ ... })` object? No code sample for this form, while the other form gets a full one.

4. **A non-text enum.** "Members are stored in whatever column type you name here." If I want integers, what `codecId` and `nativeType` do I type? I am sent to the raw-queries page to hunt for it.

5. **The `native_enum` block in PSL.** "To get a PostgreSQL `enum` type, write the contract in PSL and use a `native_enum` block." No syntax, no link to that block.

6. **The key in `.attributes(...)`.** `id: constraints.id([fields.userId, fields.teamId])` — is `id` a required key name, or any label I pick? If I also add `constraints.unique(...)` "in the same block," what key do I give it?

7. **Does the foreign-key field type have to match the key it points at?** `id: field.id.uuidv4String()` and `userId: field.uuidString()` in the example. I noticed the pairing but the page never states the rule, so I do not know if `field.text()` would also work.

8. **Does `.relations()` change `User`, or return a new object?** In the example, `Post`'s `belongsTo(User, ...)` references the bare `User` from `model(...)`, while `models.User` is `User.relations(...).sql(...)`. If these are different objects, which one do relations have to point at?

9. **MongoDB's limits.** The page says the MongoDB builder differs in five ways, then: "The rest of this page uses the PostgreSQL builder." So do enums, `enumType`, extension packs, `.attributes(...)`, and indexes work on MongoDB at all? I am left with a full page of material and no idea how much of it applies to me.

## Places the page explains the machinery when I only wanted instructions

- **The whole "How `defineContract` works" section.** The title promises internals, and some of it is internals ("You never pass the name of your database. It comes from the package you import."). But it is also the only place the argument list and the MongoDB differences are written down, so I cannot skip it. The useful parts are buried under a how-it-works heading.
- "`prisma contract emit` writes the contract to JSON in a fixed key order and hashes it." — I want the rule, not the hashing scheme.
- "`prisma contract emit` imports the file and reads its `default` or `contract` export, and nothing else. It runs the file, but it does not type-check it." — the second half is useful (type errors will not stop emit). The first half repeats what the "A complete contract" section already told me.
- "`as const` keeps both strings as literal types so the builder can check them." — borderline. I would have accepted "write `as const` after the object."

## Could I do this after one reading?

For the narrow case the example covers — PostgreSQL, a few models with text, UUID, JSON and timestamp fields, one-to-many and belongs-to relations, table renames, one named foreign key — yes. The full example is good and I could copy it.

Outside that, no. After one reading I would still not know:

- whether to import `rel` or take it from the callback argument (the page and its own example disagree)
- whether `constraints.index` wants a bare column or a list for one column (same problem)
- what to type for a date-only column
- what `codecId` to use for anything other than text
- where `.sql({ fk: ... })` attaches on a relation
- how much of the page applies if I use MongoDB
- how to create the contract file for a brand-new project

The two contradictions between the prose and the code samples are the worst of it. Both are in areas where I would be typing code straight from the page, and both would fail to compile with no hint from the page about which version is right.