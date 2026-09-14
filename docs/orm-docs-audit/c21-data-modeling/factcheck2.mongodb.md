Done. Report below.

## Claims checked

| Line | Claim | Source that decides it | Verdict |
|---|---|---|---|
| 13 | Contract is `contract.prisma`; a model maps to a collection, a record is a document | `examples/mongo-demo/src/contract.prisma`; `prisma.config.ts` `contract: './src/contract.prisma'` | Confirmed |
| 13 | Connection string in `prisma.config.ts`, passed to `defineConfig` from `@prisma/orm-mongo/config` | `examples/mongo-demo/prisma.config.ts` lines 1-11 (and `mongo-blog-leaderboard/prisma.config.ts`) | Confirmed |
| 13 | No `datasource` block on MongoDB | No `datasource` token anywhere in `packages/1-framework/2-authoring/psl-parser/src/` or `packages/2-mongo-family/2-authoring/` | Confirmed |
| 13 | The data contract page shows the config file | `apps/docs/content/docs/orm/contract-authoring/the-data-contract.mdx:53-55` | Confirmed |
| 16-21 | `id ObjectId @id @map("_id")`, `email String @unique`, `@@map("users")` all valid | `packages/1-framework/3-tooling/cli/src/commands/init/templates/code-templates.ts:196-206` (the mongo starter contract is character-for-character this shape) | Confirmed |
| 24 | In TypeScript the key is always `_id` | `examples/mongo-demo/src/contract.d.ts` `FieldOutputTypes`/`FieldInputTypes`: `User._id`, `Post._id` | Confirmed |
| 24 | `@map("_id")` sets the name in the database and in code | same, plus `contract.json` relation `targetFields: ["_id"]` | Confirmed |
| 24 | `@@map` optional; default is the model name with a lowercase first letter | `packages/2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:254` (`return name ?? lowerFirst(model.name)`), `psl-helpers.ts:6-8` | Confirmed |
| 24 | `@unique` becomes a unique index when you migrate | `interpreter.ts:894-915` builds a `MongoIndex({ unique: true })` per `@unique` field; `examples/mongo-demo/migrations/app/20260409T1030_migration/migration.ts:11` `createIndex('users', [{field:'email'}], { unique: true })` | Confirmed |
| 26 | `ObjectId` is the contract type; ids are plain strings in TypeScript | `packages/3-mongo-target/1-mongo-target/src/core/codec-types.ts:2` — `'mongo/objectId@1': { input: string; output: string }` | Confirmed |
| 26 | `String @db.ObjectId` no longer allowed | `packages/2-mongo-family/2-authoring/contract-psl/test/interpreter.attribute-specs.test.ts:105-118` — `PSL_UNSUPPORTED_FIELD_ATTRIBUTE`, `"@db.ObjectId"` | Confirmed |
| 26 | `@default(auto())` no longer allowed | same file lines 92-98 — `Field "Item.createdAt" uses unsupported attribute "@default"`; `mongo-attribute-specs.ts:249-262` has no `default` in the field namespace | Confirmed |
| 28 | Omit `id` in `create`, MongoDB assigns it | `packages/2-mongo-family/5-query-builders/orm/src/types.ts:223-232` (`Omit<..., '_id'> & Partial<Pick<..., '_id'>>`); `collection.ts:113` doc comment "Returns the input data with the server-assigned `_id`" | Confirmed |
| 28, 31 | `npx prisma orm init` writes `src/prisma/db.ts`; `import { db } from "./prisma/db"` | `packages/1-framework/3-tooling/cli/test/orm/init-scaffold.test.ts:234`; `skills/prisma-8/references/quickstart.md:36,73,84` | Confirmed |
| 28 | `db.orm` is the ORM client, one of the query APIs on `db` | `packages/3-extensions/mongo/src/runtime/mongo.ts:31-32,190-191` (`orm` and `query`) | Confirmed |
| 32-33 | `create({...})` then `.where({ _id }).first()` | `collection.ts:112-116`; `test/integration/orm-ergonomics.test.ts` uses exactly this shape | Confirmed |
| 36 | The name after `db.orm.` is the collection name | `mongo-orm.ts:20-25` keys the client by `TContract['roots']`; `interpreter.ts:1361` `roots[collectionName] = ...`; `examples/mongo-demo/src/contract.json` roots are `users`, `posts` | Confirmed |
| 36 | No `data:` wrapper (Prisma ORM 7 had one) | `create` takes the row directly — confirmed. The Prisma ORM 7 half is not in this tree — see Q1 | Confirmed / Q1 |
| 36 | `.first()` returns one document or `null`; `.all()` returns every matching document | `collection.ts:110-113`; `framework-components/src/execution/async-iterable-result.ts:3` (`PromiseLike<Row[]>`, so `await` gives an array) | Confirmed |
| 40, 42 | Embed vs reference trade-offs, decision table, comments example | General MongoDB modeling advice, nothing in the source contradicts it | Confirmed (not a source claim) |
| 57 | `type` block for embedded data; embedded value has no `_id` and no collection | `interpreter.ts:1364-1380` builds `valueObjects`; `examples/mongo-demo/src/contract.d.ts` `AddressOutput` has no `_id` | Confirmed |
| 74 | `addresses Address[]` stores every address inside the user document | `contract-psl/test/interpreter.test.ts:943-965` "emits many: true for value object array fields" | Confirmed |
| 74, 77-78 | Embedded value passed to `create` as a plain nested object | `orm/test/integration/orm-ergonomics.test.ts:173` `homeAddress: { city: 'SF', country: 'US' }` | **Corrected** |
| 81 | `update` takes a callback returning an array; `u.fieldName` for a top-level field | `collection.ts:130-133`, `field-accessor.ts:222-236`; `orm-ergonomics.test.ts:189` `[u.tags.push('admin'), u.loginCount.inc(5)]` | Confirmed |
| 81 | `u("path.to.field")` for a field inside an embedded document | `field-accessor.ts` `DotPath` (call signature); `orm-ergonomics.test.ts:177` `u('homeAddress.city').set('NYC')` | Confirmed |
| 84-85 | `u("address.city").set(...)`, `u.tags.push(...)`, `u.tags.pull(...)` | `orm-ergonomics.test.ts:141,152,177` | Confirmed |
| 88 | Replace / remove a whole embedded value | `field-accessor.ts` `DotPath` only yields `address.<sub>` paths, never bare `address`; whole-value writes go through property access — `orm/test/collection.test.ts:798` `u.homeAddress.set({...})`, `:758` `u.name.unset()` | **Corrected** |
| 88 | `u.addresses.set([ ... ])` replaces a list of embedded values | `field-accessor.ts` `FieldAccessor` includes `ValueObjectFieldKeys` with `FieldExpression.set(value: T)` where `T` is the array | Confirmed |
| 88 | `.where()` filters on top-level model fields only | `orm/src/types.ts:188-201` — `MongoWhereFilter` is keyed by `[ModelName]['fields']`, no dotted paths | Confirmed |
| 91 | `db.query.from("users").match((f) => f("address.city").eq("Berlin")).build()` | `query-builder/src/state-classes.ts:632-650` (`from` takes a root name = collection name); `query-builder/test/builder.test.ts:79` `f('address.city').eq('NYC')`; `builder.ts:817` `build()` | Confirmed |
| 94 | `build()` returns the query, not the rows | `builder.ts:817-840` returns a `MongoQueryPlan`; `skills/prisma-8/references/queries-mongo.md:12,147` "run via `(await db.runtime()).query(plan)`" | Confirmed |
| 94 | 16 MB limit, a write that exceeds it fails | General MongoDB; nothing in the source contradicts it | Confirmed (kept per brief) |
| 100-114 | Reference example: `authorId ObjectId`, `@relation(fields: [authorId], references: [id])`, `posts Post[]` | `examples/mongo-demo/src/contract.prisma` and `mongo-blog-leaderboard/src/contract.prisma` use exactly this | Confirmed |
| 116 | There are no nested writes on MongoDB | `orm/src/types.ts:223-232` — the create input is built from `FieldInputTypes` only; `examples/mongo-demo/src/contract.d.ts` `Post` input has `authorId` and no `author` key | Confirmed |
| 116 | `references: [id]` uses the contract-side name, not `_id` | `examples/mongo-demo/src/contract.prisma` writes `references: [id]`; the emitted `contract.json` relation is `targetFields: ["_id"]` | Confirmed |
| 116, 120 | `.include("author")` adds the related record to every row | `collection.ts:256-322` (reference relations only; embed relations throw `ORM.INCLUDE_UNSUPPORTED`) | Confirmed |
| 119 | `db.orm.posts.create({ title, authorId: user._id })` | Post's input fields in that code block are `title` and `authorId`; matches `CreateInput` | Confirmed |
| 123 | `.include("posts")` on `db.orm.users` gives each user an array of their posts | `examples/mongo-demo/src/contract.json` — `User.relations.posts` is `cardinality: "1:N"` with an `on` clause, so it is includable | Confirmed |
| 123 | Resolving a reference costs a second read; copying fields is a manual trade-off | `skills/prisma-8/references/queries-mongo.md:21` (`.include` lowers to `$lookup`); the rest is general advice | Confirmed |
| 129-146 | Polymorphic contract: `@@discriminator(kind)`, `@@base(Post, "article")` | `examples/mongo-demo/src/contract.prisma`; `mongo-attribute-specs.ts:157-166` — `discriminator` positional is `fieldRef()` (unquoted), `base` is `entityRef()` plus `str()` | Confirmed |
| 148 | `@@discriminator(kind)` takes the field name unquoted | `mongo-attribute-specs.ts:157-159` `fieldRef()` | Confirmed |
| 148 | A variant declares only its own fields | `examples/mongo-demo/src/contract.d.ts` — `Article` carries only `summary` | Confirmed |
| 148 | A variant has no `@@map` of its own | `interpreter.ts:460-470` — a variant *may* carry `@@map`, but only if it names the base's collection; a different one is `PSL_MONGO_VARIANT_SEPARATE_COLLECTION` | **Corrected** |
| 150 | A base query returns all variants; `.variant("Article")` limits to one | `orm/test/integration/polymorphism.test.ts:79-135`; `collection.ts:203-232` | Confirmed |
| 150 | `.variant()` takes the model name, not the discriminator value | `collection.ts:216-229` looks up `model.variants[variantName]` and filters on `variantEntry.value`; `contract.json` `variants: { Article: { value: "article" } }` | Confirmed |
| 150 | All variants sit in one collection | `interpreter.ts:463-468` "Mongo only supports single-collection polymorphism" | Confirmed |
| 150, 153 | Creating through a variant fills in `kind` | `orm/src/types.ts:247-260` (`VariantCreateInput` omits the discriminator field); `polymorphism.test.ts:143-155` asserts the stored doc has `type: 'bug'` | Confirmed |
| 160 | `npx prisma skills sync` exists | `skills/prisma-8/SKILL.md:33,36` | Confirmed |
| 160 | `npm create prisma@latest` projects include the ORM skills | `wip/prisma-src/README.md:37-40` "the agent skills already installed" | Confirmed |
| 169 | `npx prisma contract emit` checks the contract and regenerates types | `templates/quick-reference-mongo.md:71` "Update contract.json and contract.d.ts" | Confirmed |
| 169 | `npx prisma migration plan --name <name>`, `npx prisma db migrate` | `cli/test/orm/migration-plan.test.ts:81`; `examples/mongo-demo/package.json` scripts `"migration:plan": "prisma migration plan"`, `"migration:apply": "prisma db migrate"` | Confirmed |
| 169 | Migrating creates the collections and indexes | `packages/3-mongo-target/1-mongo-target/src/core/migration-factories.ts:212` `createCollection`, `:357`; `examples/mongo-demo/migrations/app/*/migration.ts` `createIndex(...)` | Confirmed |
| 169 | `npm create prisma@latest -- my-app` (the `-- my-app` argument) | Not in the tree — see Q2 | Q |
| 9, 94, 123, 169-172 | All link targets and anchors | Every path resolves under `apps/docs/content/docs/`; `orm/fundamentals/advanced-queries.mdx:292` `## MongoDB: Pipeline builder` → `#mongodb-pipeline-builder`; `ai/tools/skills.mdx:100` pins `[#available-skills-for-prisma-8]` | Confirmed |

## Corrections made (3)

1. **Line 88** — `u("address").set({ ... })` / `u("address").unset()` → **`u.address.set({ ... })` / `u.address.unset()`**. The callable form of the field accessor is typed by `DotPath`, which only produces paths *into* an embedded value (`address.city`), never the bare field name. Whole-value writes go through property access, which is what every test uses.
2. **Line 78** — `create({ name: "Ada", address })` → **`create({ name: "Ada", tags: [], address })`**. The create input is `Omit<ResolvedInputRow, '_id'>` with no `Partial`, so every non-`_id` field is a required key. The `tags String[]` field added to that code block's model in an earlier round made the example a type error.
3. **Line 148** — "A variant declares no `@@map` of its own and uses its base's collection." → **"A variant uses its base's collection, so it needs no `@@map` of its own."** A variant may carry `@@map`; it is only rejected when it names a *different* collection than the base.

## Q list

- **Q1 (line 36)**: "without the `data:` wrapper Prisma ORM 7 used". The Prisma ORM 8 half is confirmed. Nothing in the rc.10 export describes Prisma ORM 7's client shape. Searches: `grep -rn "data: {" skills/`, `grep -rn "prisma 7|Prisma 7" -i skills/prisma-8/references/upgrade-app.md`, `grep -n "data:" skills/prisma-8/references/upgrade-app.md` — all empty. Left as-is.
- **Q2 (line 169)**: the `-- my-app` argument in `npm create prisma@latest -- my-app`. `wip/prisma-src/README.md:37` shows `npm create prisma` with no argument, and `create-prisma` is a separate repo (`projects/consolidate-clis/current-state.md:13` says so explicitly). Searches: `grep -rn "npm create prisma@latest" .`, `grep -rn "create prisma|create-prisma" --include='*.md' --include='*.ts' --include='*.json' .`. Left as-is.

## No test coverage noted

- The "no nested writes on MongoDB" claim rests on the create-input type (`orm/src/types.ts:223-232`) and the emitted `contract.d.ts`, not on a test that asserts a rejection.

## Line count

`wip/c21/dm/fc2/mongodb.mdx`: **172 before, 172 after**. Plain-language check prints `clean`; the extra banned-word grep is clear (the one hit is "Aggregate" matching `gate`).