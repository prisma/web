Done. The page is at 215 lines (was 216), plain-language check clean, no em-dashes.

## Marks and what I did

**Line 27, four new things at once** — rewritten in the ordered sequence: contract definition first ("Your contract is the `contract.prisma` file that replaced `schema.prisma`"), then "After every change to it, run `npx prisma contract emit`. That command checks the contract and regenerates your types. It only updates your code." Then "To change the database, run `npx prisma migration plan --name add-posts`, which writes a migration file, and then `npx prisma db migrate`, which applies that file." Cut the `contract.json` / `contract.d.ts` clause.

**Line 15, "stores the connection"** — now "The model whose table gets the foreign key column declares two fields."

**Line 25, garbled clause and "shapes"** — "Deciding which side that is is the main choice in each of the relation kinds below." "Shapes" replaced with "kinds" everywhere.

**Line 54, "mirror field" arrives cold, v7 contradiction** — "`posts Post[]` on `User` is the mirror field, the field on the other side of the relation, which stores nothing in the database. Declaring it is optional. Prisma ORM 7 required this field; Prisma ORM 8 does not." The "emit matches it to the foreign key" clause is cut.

**Line 91, "bare field" plus five unordered rules** — now numbered in application order: "Three rules, in the order you apply them. First, add the field: `profile Profile?` on `User`, with a type and nothing else, because it needs no `@relation` of its own. Second, make it optional... Third, make the foreign key it mirrors `@unique`, or `npx prisma contract emit` reports an error whose `code` is `PSL_NON_UNIQUE_BACKRELATION`."

**Line 109, "the model for the join table" repeated four times** — kept as the first-use name (page-conventions requires it), then `PostTag` or "the join table" afterwards. Repeats at old lines 134 and 152 are gone.

**Line 134, "name the far side"** — "Note that `Post.tags` is typed `Tag[]`, not `PostTag[]`: you name the model at the other end, and Prisma ORM works out the join through `PostTag`." The emit-matching clause is cut.

**Line 136, "pick one per pair"** — cut, along with the second code block. The alternative is now one inline clause: "You can also write the same row yourself with `db.orm.public.PostTag.create({ postId: post.id, tagId: tag.id })`."

**Line 148, `t.create` / `connect` / `disconnect` named but not explained** — "`t.create([...])` makes new related records and links them, `t.connect([...])` links existing ones, and `t.disconnect([...])` removes the link." Only the `connect` example remains.

**Line 184, variant has no `@id`** — unchanged; the sentence already answers it and the reader could restate it.

**Line 186, two nearly identical strings** — now says what goes wrong: "it takes the variant's model name, `"Bug"`. Passing the discriminator value `"bug"` is a TypeScript error, because the only names it accepts are the model names of the base model's variants."

**Line 216, five definitions in one run, and no default** — the bullet now states the two clauses it produces, then what happens when you write neither, then a five-item sub-list with one action per line.

**"contract" / "PSL" / "`data:` wrapper" guesses** — contract defined at first use; "`PSL` is the Prisma Schema Language, the language `contract.prisma` is written in" added at the first error code; the `data:` wrapper sentence cut.

**"Where does `db` come from?" and undefined `user`** — "`db` is the client you create once in `src/prisma/db.ts`, the file `npx prisma orm init` writes... Here `user` is a user record you read earlier."

**"What is `public` and how do I change it?"** — "`public` is the PostgreSQL schema your tables live in, unless your contract puts the model in another schema with a [`namespace` block](/orm/contract-authoring/psl-syntax)."

**"How do I read a relation?"** — added a one-line `.include("author")` example under one-to-many, paid for by the cuts above.

**"What does an unfiltered `Task` query return?"** — "A query on `Task` with no `.variant(...)` returns every variant, and each row carries the base fields plus only its own variant's fields, with the discriminator field holding that variant's value, such as `"bug"`."

**"Is there a `Bug` accessor?"** — left as "Read and write variants through the base model", no claim either way, per the brief.

**`PSL_ORPHANED_BACKRELATION` reads as unhelpful** — the instruction now comes first ("Declare the model for the join table yourself"), the error code follows in one short sentence.

## Facts looked up

- Un-filtered base read: `wip/prisma-src/test/integration/test/sql-orm-client/polymorphism.test.ts:74-128`. Rows carry base fields plus only their own variant's field, with the discriminator holding `'bug'` / `'feature'`.
- Referential actions: `wip/prisma-src/packages/2-sql/2-authoring/contract-psl/src/psl-relation-resolution.ts:24-34` maps only the five names; no default is applied. The DDL builder at `wip/prisma-src/packages/3-targets/3-targets/postgres/src/core/migrations/operations/constraints.ts:31-45` emits `ON DELETE` / `ON UPDATE` only when the value is defined, so writing neither produces a foreign key with neither clause.
- Schemas: `namespace <name> { … }` blocks exist and Postgres accepts explicit blocks (`wip/prisma-src/packages/2-sql/2-authoring/contract-psl/src/interpreter.ts:197-231`), so the "another schema" wording stays, linked to `/orm/contract-authoring/psl-syntax`.

## Q list

- **Q1**: the reader asked what the default `onDelete` is. The source shows Prisma ORM writes no `ON DELETE` / `ON UPDATE` clause when you write neither, so the page says exactly that and stops at "the database decides what happens". I did not find a Prisma-level default in `REFERENTIAL_ACTION_MAP` or the DDL builder, and I did not assert PostgreSQL's own `NO ACTION` default because that is not in this source. If you want the page to name `NO ACTION`, that needs your call.
- **Q2**: `/orm/contract-authoring/psl-syntax` does not currently document `namespace` blocks (only `the-contract-artifact.mdx` mentions namespaces, in the JSON). The link I added points at the right page for contract syntax but the reader will not find the block documented there yet.

Line count: 216 before, 215 after.