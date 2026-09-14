I read the page once, start to finish, as a Prisma 6 user.

## Sentences I could not restate after one reading

1. Line 9 — "PSL is the preferred way to author [your contract](...), the `contract.prisma` file that replaced `schema.prisma`."
   Stopped by: "PSL" is never expanded anywhere in the body, and "contract" is never defined. Line 11 says "the Prisma schema language" but never joins the two. I guessed PSL = Prisma Schema Language from the meta description in the frontmatter, which readers do not see.
   Plainer: "PSL (Prisma Schema Language) is the schema language you already use. In Prisma 8 the schema file is called `contract.prisma` instead of `schema.prisma`."

2. Line 11 — "The Prisma ORM 8 additions are named types, typed enums, value objects, base models with variants, and extension types."
   Stopped by: five invented-sounding terms in one sentence, none defined yet. "typed enums" is worse than the rest, because I already have enums in v6 and the page never says what the "typed" part changes. The section heading later is just "Enums", so I could not match the promise to the section.

3. Line 138 — "Generated defaults such as `@default(uuid())` are applied by Prisma ORM before each write. They appear in the contract's `execution` section rather than as a column default."
   Stopped by: "the contract's `execution` section" — a thing I have never seen and the page never shows. I only wanted to know whether `@default(uuid())` still works.
   Plainer: drop the second sentence.

4. Line 181 — "Native PostgreSQL types are written as the type, so a field can also use `VarChar(35)`, `Uuid`, or `Timestamptz` directly without an alias."
   Stopped by: "written as the type" is not English I can parse. More importantly, this is the page's only hint that `@db.VarChar(35)` — the syntax I have typed for two years — is gone. It never says so.
   Plainer: "In Prisma 8 you write the native type as the field's type. `String @db.VarChar(35)` in Prisma 6 becomes `VarChar(35)`."

5. Line 196 — "That name is the PostgreSQL type plus a version, always `@1` today."
   Stopped by: I do not know what the version is for, why it exists if it is always `@1`, or what changes when it is not.

6. Line 196 — "Leave `@@type` out and Prisma ORM infers it from the member values."
   Stopped by: this contradicts line 185, "An enum declares how its values are stored with `@@type`." Is `@@type` required or not? And infers it to what — `text`? I do not know.

7. Line 233 — "Many-to-many relations go through an explicit model for the join table. Its primary key must cover both foreign keys. The list fields on both sides then resolve through it."
   Stopped by: "resolve through it". In the example, `Post.tags` and `Tag.posts` carry no `@relation` and never name `PostTag`. I cannot tell how Prisma connects them. Is it because `PostTag` is the only model holding both foreign keys? The page does not say.

8. Line 283 — "On PostgreSQL, the variant's `@@map` picks its storage layout: with its own `@@map`, as here, the variant's fields live in their own table sharing the base model's primary key. Without one, they live in the base table as nullable columns."
   Stopped by: too many ideas in one sentence, and a surprise. `@@map` has always been a naming attribute. Here its presence or absence silently switches the whole storage strategy. I read it three times.

9. Line 287 — "Extension packs contribute types through constructor calls in the `types` block."
   Stopped by: "extension packs" is undefined, and "constructor calls" is TypeScript vocabulary used to describe something in a `.prisma` file. I could not picture it until I read the code block.

## Words and phrases I had to guess

- **"PSL"** — guessed Prisma Schema Language.
- **"contract"** — guessed it is just the new word for the schema. Still not sure whether it means more than that.
- **"emit"** in `prisma contract emit` — guessed "generate".
- **"named types"** — guessed "type aliases", confirmed two sections later.
- **"value object"** — guessed "embedded/inline struct". The page confirms it, but only after using the term in the intro.
- **"base models with variants"** — guessed single-table inheritance, from other ORMs. "variant" is never defined; it is only used.
- **"extension types"** and **"extension packs"** — guessed npm packages that add custom column types.
- **"the `prisma-8` skill"** (line 321) — guessed some agent instruction file. I do not know what a "skill" is here.
- **`// use prisma-8`** (lines 16, 60) — guessed a required pragma, not a comment. See below.

## Places I asked "so what do I actually type?" and got no answer

1. **`// use prisma-8` at the top of every contract file.** It appears in both complete examples and is never mentioned in prose. It is spelled like a comment but reads like a directive. Is it required? What happens without it? And the extension-types example at line 302 omits it, so I now think it is optional, or I think the example is wrong. I cannot tell which.

2. **Where do `datasource db` and `generator client` go?** Every schema I have written for two years starts with both. Neither appears in either complete example, and the page never says they are gone. So: where does my connection URL live now? How do I choose the client output path? The config file at line 108 sets only `contract`. I do not know how Prisma reaches my database.

3. **How the provider is chosen.** I inferred it from `@prisma/orm-postgres/config` versus `@prisma/orm-mongo/config`. The page never states that the import picks the database.

4. **`@@unique`.** The attribute list at lines 134–139 covers `@id`, `@@id`, `@unique`, `@@index`, `@default`, `@map`, `@@map`. It omits `@@unique`. Then line 325 tells me to ask my agent for "a composite unique constraint on userId and title" — a thing the page never shows me how to write.

5. **Valid `@@type` names.** I have `"pg/text@1"` and `"mongo/string@1"`. What do I write for an enum stored as an integer, or as a real PostgreSQL `enum` type? Is the native PG `CREATE TYPE` enum still available at all? No list, no link.

6. **Where the name `pgvector` in `pgvector.Vector(1536)` comes from.** Is it the default import identifier I chose in `prisma.config.ts`, or a fixed name the pack declares? If I write `import pgv from ...`, do I then write `pgv.Vector(1536)`? The page does not say, and this is the exact thing I would get wrong.

7. **What a variant model inherits.** `model Bug` has no `id` and no `title`. Does `Bug` have them? Do I query `prisma.bug.findMany()` or `prisma.task.findMany()` and narrow? Neither is stated.

8. **`@updatedAt`, `onDelete`, `onUpdate`, one-to-one relations.** All routine in v6, none mentioned. I do not know whether they survived.

9. **Multi-file schemas.** Line 106 says the config "names the one file Prisma ORM reads". I use `prismaSchemaFolder` today. That reads like a removal, but the page never confirms it.

10. **How I use `contract.d.ts`.** It is produced twice in the page and never used. Do I import from it? Does the client pick it up automatically?

## Places explaining the internals when I only wanted to know what to do

- Line 138 — "They appear in the contract's `execution` section rather than as a column default."
- Line 196 — "In the database, Prisma ORM enforces the allowed values with a `CHECK` constraint on each column that uses the enum."
- Line 256 — "`contract.json` records the relation as `N:M` with the join table's columns, so queries can traverse `post.tags` directly."
- Line 216 — "On PostgreSQL a value object field is stored in a single `jsonb` column." This one earns its place; it changes how I would query. The other three do not.

## Two smaller inconsistencies

- Line 130 says `npm create prisma@latest -- my-app`; line 321 says `npm create prisma@latest`. Same command, two spellings.
- Line 102 and 313 say `npx prisma contract emit`; line 313's first sentence and line 9 say `prisma contract emit`.

## Could I do what the page is for, after one reading?

Partly. I could write a model with fields, ids, defaults, maps, a one-to-many relation, an enum, and a value object, by copying the complete contract at the top and editing it. That part works.

I could not ship a working project, because after one reading I still do not know:

- where my database connection URL goes, now that `datasource` has vanished from the examples;
- whether `// use prisma-8` is required or decorative;
- whether `@db.VarChar(35)` still works, or how to convert my existing native-type annotations;
- how to write `@@unique`;
- which `@@type` strings are legal beyond the two shown;
- whether implicit many-to-many (`Post[]`/`Tag[]` with no join model) still exists, or whether I must now write the join model by hand for every one of them;
- what a variant model inherits, or how to query one.

The biggest single gap is the silent disappearance of `datasource` and `generator`. For a reader upgrading from v6, that is the first thing they will notice and the page acts as if it never existed.