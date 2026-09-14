Done. 173 lines (was 167), budget 175. `check-plain.sh` clean, no em-dashes, no page-conventions banned words.

## What I did with each mark

**Sentences the reader could not restate**

- **Line 87, pipeline builder / embedded filters.** Split into two plain facts and named the thing on first use: "`.where()` filters on top-level model fields only. To match on a field inside an embedded document, use the pipeline builder, the API for MongoDB aggregation pipelines, with a path such as `address.city`."
- **Line 118, `$lookup` denormalization paragraph.** Cut `$lookup` entirely and reduced the paragraph to two sentences with no sync pattern: "Resolving a reference costs a second read. If a read runs constantly, you can copy the few fields it needs into the parent document, such as a comment storing its author's name."
- **Line 150, unexplained `db`.** `db` now first appears in the `_id` section with the conventions wording: "`db` is the client you create once in `src/prisma/db.ts`, and `prisma orm init` writes that file. `db.orm` holds your models, and on MongoDB the accessor is the collection name, so `db.orm.users`." Plus the clause "The values go straight in, without the `data:` wrapper Prisma ORM 7 used."
- **Line 152, colon construction.** Now: "Use one collection when you almost always query the variants together, for example email, SMS, and push notifications that you read as a single feed."

**Words guessed at**

- **`ObjectId`**: "`ObjectId` is the type of the field. There is no `@default(auto())` and no `@db.ObjectId`."
- **pipeline builder**: defined on first use (above).
- **`@@discriminator(kind)`**: "takes the name of the field that records each document's variant, so write `kind` and not `"kind"`."
- **`@@base(...)`**: explanation now follows directly after the block, together with the new inheritance sentence.
- **`.include(...)`**: explained where it first appears, with a one-line example: "chain `.include("author")`, which adds the related record to every row you get back".
- **`prisma-8` skill**: now "the Prisma ORM skills, instruction files for coding agents".
- **discriminator field**: defined inline, "a field whose value says which kind each document is".
- **"no independent life" / "own life" metaphors**: both cut for the page's literal wording ("you cannot read embedded data without its parent"; "each record stands on its own").
- **`@@map` optional but always used**: added the consequence, "and you reach it in code as `db.orm.user`".

**"So what do I type"**

1. `_id` generation: one-line `create` with `id` omitted, plus the sentence that MongoDB assigns it.
2. Create with an embedded value: two-line example passing a plain nested object.
3. Update one field inside an embedded value: `u("address.city").set("Hamburg")`.
4. Filter on an embedded field: stated plainly plus the pipeline-builder link.
5. Create a polymorphic document: `db.orm.posts.variant("Article").create({...})`, plus "Creating through a variant fills in `kind` for you" and "A variant has every field of its base plus its own, so an `Article` has `id`, `title`, `kind`, and `summary`". Also stated `.variant()` takes the model name, not the discriminator value.
6. Applying the schema: one sentence naming `npx prisma contract emit`, then `npx prisma migration plan` / `npx prisma db migrate`, with a link.
7. Indexes: "Indexes are declared on the model with `@@index([authorId])`", linked to PSL syntax.
8. Keeping the copy in sync: the paragraph no longer raises maintenance; it is two sentences and stops.

**Mechanism cut**

- `$lookup` gone.
- "Prisma ORM models this with a base model plus variant models" is now the first sentence of the polymorphic section, ahead of the MongoDB-shape sentence.
- 16 MB limit kept (converted from a `:::warning` block to a plain paragraph to reclaim lines).

**Cuts made for the line budget:** the `Cart`/`CartItem` PSL block (folded into one sentence mentioning `items CartItem[]`), the duplicate "`Cart.items` is stored inside the cart document" paragraph, the `zip` field, the warning directive, and several paragraph merges.

## Facts looked up (all in `wip/prisma-src/`)

- Embedded value on `create` as a plain nested object, and dot-path update: `packages/2-mongo-family/5-query-builders/orm/test/integration/orm-ergonomics.test.ts:171-177` (`homeAddress: { city: 'SF', country: 'US' }`, then `u('homeAddress.city').set('NYC')`).
- Variant create fills in the discriminator: `packages/2-mongo-family/5-query-builders/orm/src/collection.ts:358` (`#injectDiscriminator`) and `.../test/integration/polymorphism.test.ts:133-153` ("variant create injects discriminator and persists it").
- `.variant()` takes the model name: `.../test/integration/polymorphism.test.ts:100,143` (`variant('Bug')` against discriminator value `'bug'`).
- `.where()` is keyed on model fields only: `packages/2-mongo-family/5-query-builders/orm/src/types.ts:188-201`.
- `.include(relationName)` for reference relations: `collection.ts:98-101`.
- MongoDB migrations exist and `db migrate` runs `createCollection` / `createIndex`: `skills/prisma-8/references/migrations.md:14,34,48`.

## Q list

None.