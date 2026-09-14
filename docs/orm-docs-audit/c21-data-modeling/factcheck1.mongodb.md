Done. Page: `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/apps/docs/content/docs/orm/data-modeling/mongodb.mdx`

## 1. Wording replacements

| Line | Old | New |
| --- | --- | --- |
| 11 | "…is the core of MongoDB data modeling, and it is what this page focuses on." | "…is the core of MongoDB data modeling." (commentary about the docs cut) |
| 15 | "`ObjectId` is the idiomatic type for it" | "`ObjectId` is the type MongoDB expects for it" |
| 32 | "You cannot query it on its own, and it rides along on every read of the parent." | "You cannot read it without its parent, and it comes back on every read of the parent." |
| 51 | semicolon joining two clauses | split into two sentences |
| 85 | "`Cart.items` lives inside the cart document… items; every read" | "`Cart.items` is stored inside the cart document… items. Every read" |
| 118 | "a real cost on hot paths, so document models often denormalize: embed a small copy…" | "a real cost on reads that run often, so document models often keep a small copy of the fields a read needs inside the parent. A comment stores its author's name, while the full author record stays in its own collection." |
| 122 | "so it is idiomatic to store documents of different kinds…" | "The usual choice is to store documents of different kinds…" |
| 150 | "you can narrow to one variant in queries" | "`db.orm.posts.variant(\"Article\")` limits the query to one variant." |
| 156 | "Projects scaffolded with `create-prisma@latest` install…" | "Projects created with `npm create prisma@latest` include the [Prisma ORM skills](…) for your coding agent. In an existing project, run `npx prisma skills sync`." |

No headings renamed, no anchors changed.

## 2. Claims checked

| Line | Claim | Source | Verdict |
| --- | --- | --- | --- |
| 15–24 | PSL example needs no `// use prisma-8` or provider marker | `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:16,60` puts the marker only on the two full-contract tab examples, not on fragments | Confirmed |
| 19 | `id ObjectId @id @map("_id")` | `wip/prisma-src/examples/mongo-demo/src/contract.prisma`; `psl-syntax.mdx:157-165` | Confirmed |
| 22 | `@@map("users")` names the collection | `2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:240-254` | Confirmed |
| 26 | `@@map` requirement / default collection name | same, `return name ?? lowerFirst(model.name)`; `psl-helpers.ts:6-9` | **Corrected** — now says "`@@map` is optional. Without it the collection takes the model name with a lowercase first letter, so `user`." |
| 32 | embedded data cannot be read on its own | see line 87 evidence | Corrected (wording; see below) |
| 51–67 | `type Address` used as `address Address?` | `examples/mongo-demo/src/contract.prisma`, identical model | Confirmed |
| 71–83 | `type CartItem` used as `items CartItem[]` | `contract-psl/test/derive-json-schema.test.ts` "handles value object array field"; `mongo-attribute-specs.ts` allows list value-object fields | Confirmed |
| 87 | "An embedded `Address` has no `_id` and cannot be queried on its own" | no `_id`: `derive-json-schema.test.ts:373` asserts `expect(nestedProps).not.toHaveProperty('_id')`. Filtering: the pipeline builder **does** accept paths into embedded documents — `5-query-builders/query-builder/test/field-accessor.test-d.ts:70,108,216` (`f('address.city').eq('London')`); the ORM `.where()` object form keys are top-level model fields only (`orm/src/types.ts:188-202`) | **Corrected** — "has no `_id` and no collection of its own, so you cannot read it without its parent… You can still match on its fields through the parent, with a path such as `address.city` in the pipeline builder." |
| 91 | 16 MB document limit | general MongoDB fact, attributed to MongoDB not Prisma ORM | Confirmed (kept) |
| 97, 111 | `@relation(fields:, references:)` on MongoDB | `2-mongo-family/2-authoring/contract-psl/src/mongo-attribute-specs.ts:148-156` | Confirmed |
| 100–113 | `authorId ObjectId`, `posts Post[]` back-relation | `examples/mongo-blog-leaderboard/src/contract.prisma` — same models, same field names | Confirmed |
| 116 | include resolves with `$lookup` | `2-mongo-family/5-query-builders/orm/src/collection.ts:97` ("Adds a `$lookup` for a reference relation"); `skills/prisma-8/references/queries-mongo.md:21` | Confirmed |
| 118 | denormalization advice | general advice; does not contradict the ORM | Confirmed (reworded only) |
| 127–148 | `@@discriminator(kind)`, `@@base(Post, "article")`, `kind String` on the base | `examples/mongo-blog-leaderboard/src/contract.prisma` and `mongo-demo` carry exactly this shape | Confirmed |
| 124, 150 | all variants share one collection | `interpreter.ts:472-482` sets each variant's `storage.collection` to the base's; `interpreter.ts:462-468` rejects a variant `@@map` naming a different collection with `PSL_MONGO_VARIANT_SEPARATE_COLLECTION` | Confirmed |
| 150 | a base query returns all variants | `collection.ts:203-232` — the discriminator filter is added only by `.variant()`, never by the base collection | Confirmed |
| 150 | `.variant(...)` exists, takes the variant **model name** | `collection.ts:83-86,203-232`; `orm/test/integration/polymorphism.test.ts:100` (`orm.tasks.variant('Bug').all()`); `queries-mongo.md:57` (`db.orm.posts.variant('Article').all()`) | Confirmed |
| — | does `@@map` on a variant mean anything on MongoDB | `interpreter.ts:462-468` — only permitted if it names the base's collection, otherwise an error. The page's variants carry no `@@map`, matching the real contracts | Confirmed (no page change needed) |
| 156 | `create-prisma@latest` and the skills link | `conventions.md` scaffold command; `apps/docs/content/docs/ai/tools/skills.mdx:100` pinned anchor `[#available-skills-for-prisma-8]` | **Corrected** — scaffold command and first sentence per page-conventions |
| 156 | "the `prisma-8` skill covers document modeling" | `skills/prisma-8/references/queries-mongo.md`, `contract.md` | Confirmed |
| 165–167 | link targets | all files exist: `orm/data-modeling/index.mdx`, `fundamentals/relations-and-joins.mdx`, `fundamentals/reading-data.mdx`, `fundamentals/advanced-queries.mdx` (heading `## MongoDB: Pipeline builder` → `#mongodb-pipeline-builder`), `data-modeling/relational-databases.mdx` | Confirmed |

## 3. Q list

None. Every claim resolved against the source.

## 4. Line count

167 before, 167 after.

`check-plain.sh` prints "clean". The extra page-conventions word grep is clear (the single hit is "Aggregate", a false positive on the `gate` substring).