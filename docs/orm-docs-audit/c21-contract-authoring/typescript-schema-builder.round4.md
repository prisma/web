Read once, top to bottom, as a Prisma 6/7 user who has never seen version 8.

## Sentences I could not restate after one reading

**1. Line 9 — "Prisma ORM 8 reads a single file called [the contract](...), which describes your models."**
Stopped me: "the contract" is a new term used as if I know it. The page never says what a contract *is* beyond "describes your models" — is it my old schema under a new name, or something more? Plainest wording I'd have understood: "In Prisma 8, `schema.prisma` is replaced by a file called the contract. It holds the same model definitions you used to write in `schema.prisma`."

**2. Line 57 — `const pgText = { codecId: "pg/text@1", nativeType: "text" } as const;`**
Stopped me in the very first example: `codecId` is a word I have never seen, it appears before any explanation (the explanation is 120 lines later at line 177), and `pg/text@1` looks like a package version. I could not restate this line. It should be explained where it first appears, or the first example should not use it.

**3. Line 126 — "You never name your database, because the package you import carries it."**
Too compressed, and it answers a question I had not asked yet. Plainer: "You do not set a `provider` anywhere. Importing `@prisma/orm-postgres/contract-builder` is what selects PostgreSQL."

**4. Line 128 — "Take `field`, `model`, `rel`, and `type` from the function's one argument. Import `defineContract`, `enumType`, and `member` from the package, because you use them outside the function."**
Two rules with a "because" that does not hold up. Why can't I import `field` from the package too? The page then does exactly that at line 184 (`import { field, model, nativeEnum, pg } from "@prisma/orm-postgres/contract-builder"`) with no comment. After one reading I did not know which import style is correct on PostgreSQL. This is a straight contradiction inside the page.

**5. Line 135 — "a field on another model is written `User.ref("_id")` where PostgreSQL writes `User.refs.id`."**
I can parse it, but I cannot use it: the PostgreSQL form `User.refs.id` never appears in any PostgreSQL example on the page. It reappears alone at line 245 with no surrounding code. I still do not know where in a PostgreSQL contract I would type `User.refs.id`.

**6. Line 136 — "`indexes: [index({ email: 1 }, { unique: true })]`"**
What is `1`? Nothing on the page says. I guessed "ascending, the MongoDB convention" from memory of MongoDB, not from this page.

**7. Line 160 — "`field.column(...)` and the chained `.column(...)` below are different calls: `field.column(descriptor)` builds a field from a type description, and `.column(name)` on an existing field sets its column name."**
I understood it only because the sentence explicitly warns me. The fact that a sentence this defensive is needed means the API reuses one name for two unrelated things. Not something the page can fix, but the sentence itself needed two readings.

**8. Line 177 — "`codecId` names the PostgreSQL type plus a version, always `@1` today."**
This contradicts the code beside it. In `{ codecId: "pg/text@1", nativeType: "text" }`, the thing that "names the PostgreSQL type" is plainly `nativeType`. So what does `codecId` actually name, and why do I need both? After one reading I could not say. Plainer, if my guess is right: "`codecId` picks how Prisma converts the value between TypeScript and the database. `nativeType` is the column type the database gets. They usually pair up."

**9. Line 177 — "[Raw queries](/orm/reference/raw-queries#binding-a-bare-value-with-param) lists more type ids."**
A reference I cannot resolve while reading. I am authoring a schema; why would the complete list of type ids live on the raw-query page? If that is where it is, say why, or put the list here.

**10. Line 229 — "You can pass `User` to `rel.belongsTo(User, ...)` before chaining `.sql()` onto it."**
I read this twice and still am not sure what is being promised. Is `.sql()` mutating `User`, or returning a new object that the earlier `rel.belongsTo(User)` somehow also sees? Plainer: "The model object you get from `model(...)` keeps its identity. Passing it to a relation before you call `.sql()` on it is safe; the relation picks up the table name you set later."

**11. Line 255 — "`cols` in `.sql(...)` and `fields` in `.attributes(...)` are the same model fields under two names."**
I can restate the words, but not the reason. Why does the same thing have two names in two callbacks on the same object? The page states the oddity without resolving it.

**12. Line 274 — "The key on `type.pgvector` is the pack's own name, not the name you gave the import."**
Understood the rule; cannot apply it. Where do I find "the pack's own name"? The page does not say (package README? a field in the pack?). This is the exact sentence that will make me guess wrong.

## Words and phrases I had to guess at

- **"contract"** — guessed: the new name for `schema.prisma`.
- **"PSL"** — expanded on first use, good, but "the preferred way" (line 13) is asserted with no reason until line 18.
- **"codecId"** — guessed: an identifier for the code that converts values between TypeScript and the database column.
- **"`pg/text@1`" / "`@1`"** — guessed: a version number for that converter, not a package version.
- **"`nativeType`"** — guessed: the literal SQL column type.
- **"extension pack"** — line 259 defines it ("an npm package that adds column types"), but line 126 uses it 130 lines earlier with no definition.
- **"`as const`"** — I know the TypeScript keyword; I guessed the *reason* here is that the builder needs the exact string literal types, which the page never says. Line 177 just orders me: "Write `as const` after the object."
- **"the two files"** (used four times, lines 13, 179, 274) — guessed: `contract.json` and `contract.d.ts`. Fine on first use, tiring by the fourth.
- **"artifact"** — never in prose, only in the link text `/the-contract-artifact`.
- **"`contract infer`"** (line 18) — guessed: something that reads an existing database and writes a contract. Never explained here.
- **"`{ email: 1 }`"** — guessed: ascending index direction.
- **"`Model.refs`"** — guessed: an object of typed handles to that model's fields.
- **"`through`"** (line 203) — guessed: the join-table model. `from` and `to` in that call I guessed as "the join table's column pointing at me" and "the one pointing at the other model." The page does not say which is which.
- **"storage mapping"** (section title, line 225) — guessed: naming tables, columns, and indexes.

## Places I asked "so what do I actually type?" and got no answer

1. **`fk` options.** Line 219: "`fk` takes `name`, `onDelete`, and `onUpdate`." What are the legal values? `"cascade"`? `"Cascade"`? `"CASCADE"`? `"SetNull"`? This is the single most common thing I do with a foreign key and the page stops one word short.
2. **An auto-incrementing integer primary key.** Line 170 says `.id()` is "for a key that is not generated, such as an integer you set yourself." I have `serial`/`identity` columns in my existing database. Nothing on the page tells me how to declare one. `field.int().id()` plus something? The page does not say there is a way, and does not say there is not.
3. **A database-generated UUID.** All six `field.id.*` helpers "generate the ID in your app." If I want `gen_random_uuid()` in the database, do I write `field.uuidNative().defaultSql("gen_random_uuid()").id()`? I am guessing. Say it.
4. **`onDelete` on the `hasMany` side.** `.sql({ fk })` is shown only on `belongsTo`. I do not know whether that is the only place it is allowed.
5. **The list of `codecId` values.** Line 160 hands me `"pg/date-temporal@1"` out of nowhere for a date-only column. I need a date-only column, a `time` column, `numeric(10,2)`, `text[]`, and `citext`. The page gives me one of those by example and points at a raw-queries page for the rest.
6. **How to run `contract.ts`.** Line 297 says "`npx prisma contract emit` runs the file." With what? Does my contract file get to `import` from other files in my project — which is the entire stated reason to use TypeScript (line 15, "split, composed, or reused across ordinary TypeScript modules or packages")? Does that work with path aliases, ESM, a build step? The page sells this as the main benefit and never shows a single multi-file example.
7. **Enums, types, and indexes on MongoDB.** Line 121 shows `defineContract({ models: { User, Post } })` — one object, models only. Line 138 says enums work on MongoDB too. So where does the enums map go on MongoDB? `{ models, enums }`? Not shown.
8. **`hasMany` on MongoDB vs PostgreSQL.** PostgreSQL: `rel.hasMany(Post, { by: "userId" })`. MongoDB: `rel.hasMany("Post", { from: "_id", to: "authorId" })`. The page lists the MongoDB differences but not this one, so on MongoDB I do not know whether `by` also works, or on PostgreSQL whether `from`/`to` also works.
9. **String vs ref, in the same MongoDB example.** Line 104 writes `to: "authorId"`; line 117 writes `to: User.ref("_id")`. Same option name, two different shapes, ten lines apart, no comment. I would have asked which one to use.
10. **`extensions` shape.** Contract file: `defineContract({ extensions: { pgvector } }, ...)` — an object. Config file: `ormConfig({ extensions: [pgvector] })` — an array. Same word, two shapes, and the imports differ too (`/pack` vs `/control`). The page states this at line 276 but does not say why, so I will get it backwards.
11. **`field.temporal.updatedAt()`.** Line 164: "fills it on every create and every update." Does the client do this, or does emit create a database trigger? It matters — I write to this database from a second service. Not said.
12. **Where `types` goes in the return for MongoDB, and whether `type` is available at all there.** Line 128 lists `type` among the callback's arguments; MongoDB has no callback.

## Places that explain the machinery when I only wanted the instruction

Honestly, few — the page is mostly task-shaped. The ones that hit:

- **Line 124, "## How `defineContract` works".** The heading promises internals. What I wanted was "how to write the top of the file." The section is actually useful, but the first paragraph (line 126) spends its opening on why you never name your database, which is machinery.
- **Line 160**, the `field.column` vs `.column` disambiguation, is a description of a naming collision in the API rather than an instruction. Necessary, but it is the API's problem being handed to me.
- **Line 223** — "Pass the model object, as above, and a typo is a compile error. Pass a string and the typo is reported when `prisma contract emit` builds the contract." This is about when validation runs. Just tell me to pass the object.
- **Line 298** — "`npx prisma contract emit` runs the file but does not type-check it." Internals, but this one earns its place; it explains a real surprise.

## After reading once, could I do what the page is for?

Partly. I could copy the PostgreSQL example, change the model and field names, add `.optional()` and `.unique()`, set table names with `.sql({ table })`, add an index, and run `prisma contract emit`. For a plain project of text/int/boolean/timestamp columns with app-generated UUID keys, yes.

What I would still not know:

- How to declare an auto-incrementing integer primary key, or any database-generated key. This alone blocks me from porting my existing application.
- What values `onDelete` and `onUpdate` accept.
- What a `codecId` is, or how to find the right one for any column type not in the eleven-row table.
- Whether to import `field`/`model` from the package or take them from the callback, because the page does both and only explains one.
- How to split the contract across files — the stated reason to use TypeScript at all (line 15), shown nowhere.
- On MongoDB: where enums, types, and the `index` import belong in the returned object, and whether `hasMany` takes `by` or `from`/`to`.
- How to find an extension pack's "own name" for the `type.*` key.

The MongoDB content is the weakest part. It is a five-bullet diff list against a PostgreSQL API, plus one example that contradicts itself on `to:`. A MongoDB-only reader has no complete page here.

The single sentence I would fix first is line 128's import rule, because line 184 breaks it in the same page.