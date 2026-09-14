Round two done. `wip/c21/dm/r2/mongodb.mdx`, 173 lines before and after, plain-language check clean, no em-dashes.

## Marks and what I did

**The eight-fact paragraph under the `_id` example.** Cut to four MongoDB-client facts and moved the rest into one Next steps bullet. It now reads: "`db` is the client you create once in `src/prisma/db.ts`, and `npx prisma orm init` writes that file. `db.orm.users` is the accessor for the collection, and it follows the collection name, so `@@map` renames the accessor as well. In Prisma ORM 7 it did not. The values go straight into `create`, without the `data:` wrapper Prisma ORM 7 used." The contract sentence, `npx prisma contract emit`, and both migration commands are now the first Next steps bullet with a link to `/orm/migrations/generating-a-migration`.

**Accessor changes with `@@map` (stated twice, never contrasted with v7).** The `@@map` paragraph no longer repeats the accessor; the sentence above carries it once, with the Prisma ORM 7 contrast.

**"There is no `@default(auto())` and no `@db.ObjectId`."** Now: "`ObjectId` replaces `String @db.ObjectId` and `@default(auto())`. Writing either of those attributes is an error whose `code` is `PSL_UNSUPPORTED_FIELD_ATTRIBUTE`."

**`Cart` / `CartItem` referenced but never shown.** Dropped both names; the sentence now uses the page's own type: "`addresses Address[]` stores every address inside the user document, with no second collection and no join to load them."

**"Prisma ORM models a collection..." garden path.** Now: "One collection can hold more than one kind of document. You declare a base model for the shared fields and a variant model for each kind. A discriminator field tells the kinds apart: its value says which kind each document is." The "MongoDB collections do not enforce a single shape" sentence is cut, as instructed.

**16 MB limit with no consequence.** Now "...pushes the document toward MongoDB's 16 MB limit, and a write that exceeds it fails."

**Copied fields go stale.** Added: "The copy then goes stale on its own, and keeping it up to date is your job."

**"contract", `contract emit`, `migration plan`.** All three now appear once, together, in the Next steps bullet, with the contract defined as "the `contract.prisma` file that replaced `schema.prisma`" (the section's fixed wording).

**Pipeline builder gloss.** Now "a chained builder for MongoDB aggregation pipelines", with a two-line example.

**`u`.** Defined at first use: "In an `update`, `u` gives you each field of the document to change."

**`.all()`.** Defined once, where `.first()` first appears: "You `await` the whole chain, and the last call says what you want back: `.first()` for one document or `null`, `.all()` for every matching document."

**"So what do I type?" items.** Connection: one sentence at the top of the first section, no `datasource` block, `prisma.config.ts` with `defineConfig` from `@prisma/orm-mongo/config`, link to `/orm/contract-authoring/the-data-contract`. Creating a referenced record: `db.orm.posts.create({ title: "Hello", authorId: user._id })`. Filtering on an embedded field: the `db.query.from("users").match(...)` example. Querying by id: `db.orm.users.where({ _id: user._id }).first()` with "the id comes back as a string, and you pass it back as a string. There is no `ObjectId` to construct." Adding to a list: `u.tags.push("admin")` / `u.tags.pull("new")` on a `tags String[]` field added to the embedded-section model. Variant `@@map`: "A variant declares no `@@map` of its own and uses its base's collection." Indexes: the trailing index clause in the polymorphic section is cut, per the brief.

Cuts that paid for the additions: the collection-shape sentence, the index clause, the blank lines inside the PSL blocks, and merged paragraphs that repeated each other (embed/reference intro, embedded-type intro, the two reference query examples now in one block).

## Facts looked up (rc.10 source)

- `where` key is `_id`, not `id`: contract fields are keyed by the mapped name. `wip/prisma-src/packages/2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:1320-1336` ("the mapped-name-keyed field record"), and the fixture `.../1-foundation/mongo-contract/test/fixtures/orm-contract.json` keys `User.fields` by `_id`. Test usage `where({ _id: created._id as string })` and `expect(typeof created._id).toBe('string')` at `.../5-query-builders/orm/test/integration/orm-ergonomics.test.ts:66-71`.
- `@default(...)` and `@db.ObjectId` are both `PSL_UNSUPPORTED_FIELD_ATTRIBUTE`: `.../contract-psl/test/interpreter.attribute-specs.test.ts:87-117`; the supported field attributes are only `@id`, `@unique`, `@map`, `@relation` (`.../src/mongo-attribute-specs.ts:256-261`).
- Setting a reference field directly on create: `orm.tasks.create({ title, type, assigneeId: user._id })`, `orm-ergonomics.test.ts:236-245`.
- `push` / `pull` on a scalar list: `orm-ergonomics.test.ts:135-155`. Embedded (value-object) paths get only `set`/`unset`/`exists`/`eq(null)` (`.../query-builder/src/field-accessor.ts:92-110`), so I showed `push` on `tags String[]`, not on an embedded list.
- Variant `@@map`: rejected only when it names a different collection, `interpreter.ts:460-465`.
- `@prisma/orm-mongo/config` export exists (`wip/prisma-src/packages/9-public/@prisma/orm-mongo/package.json`), matching the config example on `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:118-128`.
- Pipeline filter form `f("address.city").eq("NYC")` and `db.query.from("<collection>")`: `.../query-builder/test/builder.test.ts:77-86` and `apps/docs/content/docs/orm/fundamentals/advanced-queries.mdx:307-351`.

## Q list

**Q1.** Whether `npx prisma db migrate` must run before the first write on MongoDB. `wip/prisma-src/skills/prisma-8/references/migrations.md:47` says the marker is a document in `_prisma_migrations`, written after schema verification, but I found no check of that marker in the MongoDB query path (nothing matching `verifyMarker`/`marker` in `wip/prisma-src/packages/2-mongo-family/7-runtime/src/`). So I could not confirm that an unmigrated database rejects a write, and the page does not claim it either way. The reader asked for this ordering explicitly.

**Q2.** Adding to a list of embedded values (`items CartItem[]`). The typed accessor for a value-object path has no `push`, and no test shows one, so the page shows `push`/`pull` on a scalar list only. If the runtime does support it on embedded lists, the example should move there, since that is the case the embed-vs-reference table sends readers to.