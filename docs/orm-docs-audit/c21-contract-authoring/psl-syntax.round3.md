## Sentences I could not restate after one reading

**1.** "named types: one name for a type and the database column type it uses."
Stopped me: this promises two things bound together, but the only example, `ShortName = VarChar(35)`, shows one thing. I could not tell which half of `VarChar(35)` is "the type" and which is "the database column type." Plainer: "named types: give a database column type a name you can reuse on many fields."

**2.** "base models and variants: a variant model adds fields to a base model, and one field's value says which variant a row is."
Stopped me: three ideas in one sentence, and I did not yet know the word "variant" in this product. Plainer: "base models and variants: you can store several kinds of record in one table. A base model holds the shared fields; each variant adds its own. One column says which kind each row is."

**3.** "A `.prisma` extension selects PSL authoring."
Stopped me: I could not work out what "selects" means here — does the file extension switch Prisma into a mode? What is the other mode, and what extension picks it? Plainer: "If the path ends in `.prisma`, Prisma reads it as PSL. If it ends in `.ts`, Prisma reads it as a TypeScript schema."

**4.** "A native PostgreSQL type such as `VarChar(35)` or `Timestamptz` is written in the same position as one of those."
Stopped me: "in the same position as one of those" made me re-read to find the antecedent. Plainer: "You can write a PostgreSQL type such as `VarChar(35)` or `Timestamptz` wherever you would write `String` or `DateTime`."

**5.** "`@updatedAt` no longer exists. Write the call where the type would go:"
Stopped me: "the call" — a call to what? And the example field has no type at all, which contradicts every other field on the page. Plainer: "`@updatedAt` is gone. Instead of a type, write `temporal.updatedAt()` as the field's type."

**6.** "An alias binds a type and its database column type under one name."
Same problem as (1). The example does not show two things being bound.

**7.** "Write the `@1` as shown, because there is no other version yet."
Stopped me: a version of *what*? The encoding? The PostgreSQL type? The Prisma package? The sentence tells me to copy it without telling me what it is. Plainer: "`@1` is the version of the storage format. Only version 1 exists, so always write `@1`."

**8.** "That model must follow two rules. It holds a foreign key to each side, and each foreign key references that side's full `@id`."
Stopped me: "full `@id`" — I guessed this means "every field of a composite primary key, not just one of them," but the page never says so, and the example only shows single-field keys.

**9.** "Break either rule and `npx prisma contract emit` throws an error whose `code` is `PSL_JUNCTION_ID_NOT_FK_COVERING` when the `@@id` lists anything other than the two foreign-key fields, or `PSL_JUNCTION_TARGET_FK_NOT_ID` when a foreign key does not reference the other side's `@id`. The message names the list field it could not match."
Stopped me: one sentence, two error codes, two conditions, and a nested clause. I had to read it three times. Split it into two sentences or a two-row table.

**10.** "On PostgreSQL you choose where a variant's own fields are stored, and the variant's `@@map` is the choice."
Stopped me: "the `@@map` is the choice" is not a statement I can act on. The real rule is hidden in the next sentence. Plainer: "On PostgreSQL, whether you write `@@map` on the variant decides where its fields live."

**11.** "Rows with `type = "bug"` are `Bug` records."
Minor, but `type` here is a field name I just read as a PSL keyword three sections earlier (`type Address`). I stalled on which one it meant.

## Words and phrases I had to guess

- **"contract"** — I guessed it is what I used to call the schema. The page also calls it "the schema" at the end ("don't write the schema by hand"), which made me doubt my guess.
- **"discriminator"** — I guessed: the column whose value says which kind of row this is. The page never defines it; it only uses it in `@@discriminator(type)`.
- **"variant"** — I guessed: a subclass.
- **"value object"** — I guessed: a nested object with no table of its own. The page does define it, which helped.
- **"extension pack"** — I guessed: a plugin npm package.
- **"`pg/text@1`"** — I guessed `pg` = PostgreSQL, `text` = column type. The page confirmed both. `@1` I still cannot explain.
- **"`db.orm.public.Task`"** — I guessed `db.orm` is a namespace and `public` is a schema. The page confirms `public` only.
- **"full `@id`"** — guessed: all fields of a composite key.
- **"`temporal`"** — guessed: a built-in namespace of date/time helpers. The page says it is built in but not what else is in it.

## Places I asked "so what do I actually type?" and got no answer

**1. The many-to-many example does not connect.** You show:
```prisma
model Post { tags Tag[] }
model Tag  { posts Post[] }
model PostTag { ... }
```
Nothing in `Post` or `Tag` mentions `PostTag`. How does Prisma know `tags Tag[]` goes through `PostTag` and not some other join model? If two join models exist between the same pair, what do I type? Also, neither `Post` nor `Tag` has an `id` in this snippet, yet `PostTag` references `[id]` on both.

**2. `temporal.updatedAt()` — what is the field's TypeScript type?** Is it a `DateTime`? Can it be `?`. Can I set it by hand on a write? Are there other `temporal.*` calls? Nothing.

**3. Plain `String` — what column do I get?** The page explains `VarChar(35)` and says "The `@db.` attributes are gone," but never says what plain `String`, `Int`, or `DateTime` map to on PostgreSQL. That is the first thing I need, because most of my fields are plain `String`.

**4. One-to-one has no code.** "make the other side singular instead of a list, and put `@unique` on the foreign-key field" — every other relation shape gets a snippet; this one is the easiest to get wrong and gets prose only.

**5. `native_enum` has loose ends.** Can I write `@default(...)` on a `pg.enum(Role)` field? Do I write the member name or the quoted value? Is `Role` usable as a named type in `types`? Is there a `mongo.enum`?

**6. Lists of value objects on PostgreSQL.** You say "a value object field is stored in a single `jsonb` column." Is `addresses Address[]` also one `jsonb` column holding an array? You show the field in the example and then do not cover it.

**7. Variants on MongoDB and the `variant()` call.** `db.orm.public.Task.variant('Bug')` — `public` is the PostgreSQL schema. On MongoDB, what goes in that slot? I am left unable to type the MongoDB version of the line you just showed me.

**8. Where does `// use prisma-8` have to be?** "Keep the first line" — must it be line 1 exactly? What if I want a licence comment above it? And this is explained 80 lines *after* the first time it appears in code.

**9. Adding an extension pack.** The config snippet shows `extensions: [pgvector]`, but not the `npm install` line. The page says "Using extensions covers installing a pack" — but I am already here, mid-task, and cannot finish without leaving.

**10. `types` versus `type`.** `types { ... }` declares aliases; `type X { ... }` declares a value object. Those are one character apart and mean entirely different things, and the page never points that out. I will type the wrong one.

## Places that explain the internals when I only wanted to know what to do

- "Generated defaults such as `@default(uuid())` are produced by Prisma ORM before each write, not by the database." Tell me the consequence I care about: a row inserted by raw SQL or another application will not get a value.
- "`npx prisma contract emit` resolves extension types through the packs listed in the config, so list the pack before using its types." The first clause is machinery. Only "list the pack before using its types" is an instruction.
- The two `PSL_JUNCTION_*` error codes. Useful if I am already broken, but they sit in the middle of the how-to, ahead of the sentence that tells me which relation shape to pick.
- "In `pg/text@1`, `pg` is PostgreSQL and `text` is the column type, so the values are stored as `text`." Fine, but it is the decoding of a string I was going to copy anyway.

## Could I do what the page is for, after one reading?

Partly. I could write a plain model with fields, IDs, `@map`, `@@map`, `@unique`, `@@index`, and a one-to-many relation, and I could write the config file. That is the majority of what I need, and I got it.

I could **not** do these without a second pass or a guess:

- A many-to-many relation. The example does not show how the two list fields find the join model, so I would type it and hope.
- A one-to-one relation. No code shown.
- `temporal.updatedAt()`. I do not know the resulting type or whether I can write to the field.
- Any base model and variant on MongoDB, or the `variant()` query on MongoDB.
- Choosing a column type for ordinary fields, because the page never says what plain `String` becomes.
- A `native_enum` with a default.

I also finished unsure of two words the page leans on the whole way through: what exactly a "contract" is as opposed to a schema, and what a "discriminator" is. Both are used before they are explained, and "discriminator" is never explained at all.

Page read: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx`