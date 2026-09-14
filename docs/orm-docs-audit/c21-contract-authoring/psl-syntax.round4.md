I read the page once, top to bottom, as a Prisma 7 user who has never seen version 8.

## Sentences I could not restate after one reading

**Line 14** — "base models and variants: store several kinds of record in one table. A base model holds the shared fields, each variant adds its own, and one column says which kind each row is."
Three new ideas in one bullet, and "variant" is a word this page invents without warning. Plainer: "Base models and variants: one table can hold more than one kind of record. Put the shared fields in a base model, put the differences in each variant, and Prisma uses one column to tell them apart."

**Line 137** — "`@updatedAt` is gone. Instead of a type, write `temporal.updatedAt()` as the field's type."
This contradicts itself in one sentence: "instead of a type" and "as the field's type." I had to read it three times. Plainer: "`@updatedAt` is gone. Write `temporal.updatedAt()` where the field's type would go."

**Line 145** — "The other member is `temporal.createdAt()`."
"Member" of what? I guessed `temporal` is a namespace with exactly two entries. The sentence also never tells me what `temporal.createdAt()` does or how it differs from `createdAt DateTime @default(now())`, which the page's own example on line 45 uses.

**Line 188** — "In `pg/text@1`, `pg` is PostgreSQL, `text` is the column type, and `@1` is the version, always `@1` today."
Version of *what*? The encoding? The type? The package? I still do not know, and "always `@1` today" tells me it will change without telling me what changes.

**Line 190** — "Leave it out and Prisma ORM picks the type from the member values: bare member names and string values give the database's text type, and integer values give its integer type."
Two rules compressed into one clause, and it does not say what happens if I mix string and integer values, which the sentence structure invites me to try.

**Line 252** — "Each foreign key references every field of that side's `@id`, and its own `@@id([...])` lists exactly those two foreign-key fields."
"Every field of that side's `@id`" made me stop. I think it means composite primary keys, but "each foreign key" is singular-plural in the same breath. Plainer: "If a side has a composite primary key, the join model must have one foreign-key field for each part of it. The join model's `@@id([...])` must list exactly the foreign-key fields, and nothing else."

**Line 275** — "Put the same `@relation("name")` on the list field and on `PostTag`'s field that points back at it."
`PostTag` has two relation fields, `post` and `tag`. "The field that points back at it" does not tell me which one, and "it" could be the list field or the model. No example is shown for the fix, only for the thing that breaks.

**Line 306** — "On PostgreSQL, whether you write `@@map` on the variant decides where its fields are stored."
I could restate the words, but I did not believe them. `@@map` is a naming attribute everywhere else on this page. Here its presence or absence silently changes the physical storage layout. That is a large consequence hidden behind a rename attribute, and the page states it as if it were obvious.

## Words and phrases I had to guess

- **"named types"** (line 11) — guessed: a type alias. Confirmed later at line 165, but the `types { ... }` block appears in the example at line 24 before anything explains it.
- **"value object"** (line 13) — guessed: an embedded struct. The page explains it, but the term itself is not one I brought with me.
- **"variant"** — guessed: subclass.
- **"discriminator"** (line 281) — I know this term from ORMs, but the page defines it inline, which was fine.
- **"extension pack"** (line 312) — guessed: a plugin. The page says "npm package that adds field types," which helped.
- **`// use prisma-8`** (line 22) — on first sight I guessed this was a required directive that the parser reads. The explanation is 80 lines later at line 104, and says it is only for the editor extension. By then I had already assumed it was mandatory.
- **`Uuid`** (line 43) — guessed a built-in type. It is never introduced. It just appears in the first example and is used everywhere after. Line 173 mentions it in passing as a "native PostgreSQL type."
- **`db.orm.public.Task`** (line 304) — guessed `db.orm` is the generated client and `public` is a schema segment. The page explains `public` and nothing else.
- **`/control`** in `@prisma/orm-extension-pgvector/control` (line 320) — no guess. I do not know why it is not the package root.
- **"the two files"** (line 104) — guessed `contract.json` and `contract.d.ts`.

## Places I asked "so what do I actually type?" and got no answer

1. **How does `temporal.updatedAt()` actually behave?** The page never says the field updates automatically on every write. It only says "you can still set the field yourself on a write." It assumes I already know what `@updatedAt` did. Can I write `temporal.updatedAt()?`? Can I add `@map`? No example shows either.
2. **Which native types can I write?** Line 129 says "a PostgreSQL type such as `VarChar(35)` or `Timestamptz`." Such as which others? There is no list and no link to one. I do not know if `Numeric(10,2)` or `Inet` work.
3. **How do I insert a variant row?** Line 304 shows how to read `Bug` rows. It never shows how to create one. That is the first thing I would try.
4. **What does a variant with no `@@map` look like?** Line 306 describes it in prose; the only example given has `@@map`.
5. **The ambiguous-relation fix.** As above: no code for the `@relation("name")` resolution, only for the failure.
6. **The second `prisma.config.ts`** (line 318) has `extensions` but no `db` key, and no `import 'dotenv/config'`. Am I replacing my config or adding a line to it? I would have guessed wrong.
7. **Does `native_enum` create the PostgreSQL type for me?** Line 192 to 205 tells me how to declare it and how to type the field. It never says whether `db init` or `migration plan` will run `CREATE TYPE`, or whether I must make it myself first.
8. **Is `types { }` available on MongoDB?** The PostgreSQL tab has one, the MongoDB tab does not, and nothing says whether that is a limitation or just a shorter example.
9. **Can `types { }` appear more than once, and does declaration order matter?** Not addressed.
10. **What replaces `datasource`'s other settings?** Line 17 says the block is gone and points at a migration page. Fine as a pointer, but `provider`, `shadowDatabaseUrl`, and `relationMode` all vanish with no local hint.
11. **How do I get any of this into a database?** The answer is the last bullet on the page, line 360. After writing a contract I ran `contract emit` and had nothing in Postgres.

## Places the page explains internals when I wanted instructions

- **Line 134** — "Generated defaults such as `@default(uuid())` are produced by Prisma ORM before each write, so a row written by raw SQL or another application gets no value." The consequence is worth knowing. "Produced by Prisma ORM before each write" is how it works inside; "the database will not fill this in for you" is what I needed.
- **Line 226** — "On PostgreSQL a value object field is stored in a single `jsonb` column, and a list such as `addresses Address[]` is one `jsonb` column holding an array. On MongoDB it is an embedded document." Three storage details when my question was "can I put a struct on a model, yes or no."
- **Line 252** — "Prisma ORM matches a list field such as `tags Tag[]` to the one model that holds a foreign key to each side." This is the matching algorithm. What I wanted was: "write the join model like this, and here are the two rules it must follow." The rules do follow, but the algorithm comes first.
- **Line 104** — "The Prisma editor extension reads it to tell that the file is a Prisma ORM 8 contract." Tooling internals. "Keep this line at the top" would have done, and would have answered it at line 22 where I first asked.

## Could I do what the page is for, after one reading?

Partly. I could write a contract file with models, fields, IDs, an enum, a value object, a one-to-many, and a one-to-one, and I could point `prisma.config.ts` at it. That much the page teaches cleanly, and the two-tab PostgreSQL/MongoDB examples are the best part of it.

What I would still not know:

- Whether `temporal.updatedAt()` updates the field by itself. This is the single worst gap, because the page treats the behavior as already known and only documents the syntax change.
- Which native column types I am allowed to write. I have two examples and no list.
- How to create or write a variant record, only how to read one.
- Whether `native_enum` produces the PostgreSQL type or expects me to.
- How to fix `PSL_AMBIGUOUS_BACKRELATION`, because the instruction names a field I cannot identify.
- What the `@1` in `pg/text@1` versions, and when it would become `@2`.
- Whether the extension config example replaces my config or adds to it.
- That I need `db init` to see a table, until the last line of the page.

Two smaller things. Line 9 says "Prisma ORM 8 adds five things," then the second bullet is "enums: unchanged, except that an enum can now say how its values are stored" — an unchanged feature is not an addition, and it made me wonder if I had misread the list. And the first code block uses `types { }`, `@@type("pg/text@1")`, `Uuid`, and `// use prisma-8` before any of the four is explained, so my first read of the page's centerpiece example was mostly guessing.