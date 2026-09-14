Done. Edited only `wip/c21/dm/r4/mongodb.mdx`.

## Marks and what I did

**Sentences the reader could not restate**

1. **Line 13, three new things in three sentences.** Reordered: models in the contract first, then the connection. "There is no `datasource` block on MongoDB." is now a trailing sentence. Added "That page shows the config file." after the `/orm/contract-authoring/the-data-contract` link. No `prisma.config.ts` snippet, per the brief.
2. **Line 24, eight-sentence paragraph.** Split into three: `_id` naming plus what `@map`/`@@map` do; the key type and the two removed syntaxes; how ids get assigned.
3. **"sets the name on both sides".** Now: "In the contract you call the field `id`. In TypeScript it is always `_id`, never `id`. `@map("_id")` sets the name in the database and in your code, so you write `user._id` and `where({ _id })`."
4. **`ObjectId` type vs string value.** Now: "`ObjectId` is the contract type. In TypeScript ids are plain strings, so there is no `ObjectId` to construct."
5. **`u` unexplained, array unexplained, two forms.** Now: "`update` takes a callback that returns an array, so several changes go in one call. Use `u.fieldName` to change a top-level field. Use `u("path.to.field")` for a field inside an embedded document, written as a string because a dotted path is not a property name."
6. **Pipeline builder not actionable.** Variable renamed `berliners` → `query`, and: "`build()` returns the query, not the rows. See [the pipeline builder](...) for how to run it and what comes back."
7. **"goes stale on its own".** Now: "If the original changes, the copy does not. You update it yourself."

**Guessed words**

- "your contract", "pipeline builder", "variant", "discriminator field", `@@base` — defined elsewhere in the section or already defined well by example; unchanged.
- "contract emit" — now said once, in the Next steps bullet, with "which checks your contract and regenerates your types". Removed from the removed-syntax sentence.
- `db.orm` — now: "`db.orm` is the ORM client, one of the query APIs on `db`. See [the ORM reference](/orm/reference)."

**"So what do I actually type?"**

1. `prisma.config.ts` — link plus "That page shows the config file". No snippet, per the brief.
2. Import — `import { db } from "./prisma/db";` added once, in the first TypeScript example.
3. Running the pipeline — fixed by the rename and the `build()` clause.
4. Command order — Next steps bullet is now the ordered sequence: `npm create prisma@latest -- my-app` or `npx prisma orm init`, then `contract emit`, `migration plan --name <name>`, `db migrate`. The scattered mentions are cut (`orm init` in the `db` paragraph, `contract emit` in the removed-syntax sentence).
5. Unique index — `email String @unique` added to the first model, plus "`@unique` on `email` becomes a unique index when you migrate."
6. Variant's own fields — nothing added; see the lookup below.
7. `references: [id]` vs `_id` — "In `references: [id]` you write the field's contract-side name, `id`, not `_id`."
8. Reading the other direction — "`.include("posts")` on `db.orm.users` works the other way and gives each user an array of their posts."

**Internals**

- Product history on line 13 — kept the section's mandated first-use phrasing, but it is no longer the first clause carrying the connection story.
- "fail at `npx prisma contract emit`" — cut; the sentence is now "The old `String @db.ObjectId` and `@default(auto())` are no longer allowed."

## Facts looked up

- `@unique` on a MongoDB field creates a unique index: `wip/prisma-src/packages/2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:908-912` builds `new MongoIndex({ keys: [...], unique: true })`; `wip/prisma-src/packages/2-mongo-family/9-family/src/core/contract-to-schema.ts:17-20` carries `unique` into the schema the migration applies. Spec at `.../contract-psl/src/mongo-attribute-specs.ts:146`.
- `.include` on the one-to-many list side works and returns an array: `.../5-query-builders/orm/src/collection.ts:98` accepts any `ReferenceRelationKeys`; `.../orm/src/types.ts:20-30` includes list-side reference relations; unit test `.../orm/test/collection.test.ts:492` (`User`.include('tasks')) and integration test `.../orm/test/integration/orm-ergonomics.test.ts:231-262` ("include() on 1:N relation returns array of related documents").
- Variant rows do **not** carry the variant's own fields typed: `.../orm/test/integration/polymorphism.test.ts` only reads base fields (`type`, `title`) off variant rows and casts to `Record<string, unknown>` at line 149 to read the discriminator off a create result. The collection row type is keyed on the base model name (`collection.ts:78-80`, `all()` at line 109). So I said nothing about `summary` on a variant read.

## Q list

None.

## Line count

173 before, 172 after. `check-plain.sh` is clean; no em-dashes, no semicolons joining clauses, no page-conventions banned words.