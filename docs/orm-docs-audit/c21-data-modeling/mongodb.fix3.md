Done. `wip/c21/dm/r3/mongodb.mdx`, 173 → 172 lines, plain-language check clean, no em-dashes, no extra banned words.

## Marks and what I did

**1. `PSL_UNSUPPORTED_FIELD_ATTRIBUTE`** — code cut. Now: "Write `ObjectId` for the key type. The old `String @db.ObjectId` and `@default(auto())` are no longer allowed and fail at `npx prisma contract emit`, the command that checks your contract and regenerates your types." That also defines `emit` at its first use.

**2. "accessor" / version aside** — "`db.orm.users` is how you query the `users` collection. The name after `db.orm.` is the collection name, so with `@@map("users")` you write `db.orm.users`, not `db.orm.user`." "In Prisma ORM 7 it did not" cut. The word "accessor" no longer appears in prose.

**3. `db.ts` self-contradiction** — "`npx prisma orm init` writes `src/prisma/db.ts`, which creates the client `db`."

**4. "`u` gives you each field"** — "In an `update`, `u` builds the changes you want. Use `u.fieldName` to change a top-level field, and `u("path.to.field")` to change a field inside an embedded document."

**5. `db.runtime()` double await** — the `db.runtime()` line is cut. The filter example stays and ends: "See [the pipeline builder](/orm/fundamentals/advanced-queries#mongodb-pipeline-builder) for running it and what comes back."

**6. Buried operational sentence** — the contract definition moved to the first mention of "contract" (first sentence under the first heading): "Your models go in your contract, the `contract.prisma` file that replaced `schema.prisma`." The Next steps bullet now starts at `npx prisma contract emit`, whose meaning is given where it first appears.

**Guessed words:** "contract" defined at first use (see above); "accessor" and "PSL" removed; "models a one-to-one" → "models a one-to-one relation" (and the list case → "one-to-many relation"); "pipeline builder" keeps its existing one-clause definition; "discriminator" and "variant" the reader said are adequate, so untouched.

**"What do I type?" gaps:**
- `_id` vs `id`: added right after the first model, folded into the `@map` sentence — "In your TypeScript code the field is called `_id`, not `id`. `@map("_id")` maps the model's `id` field to MongoDB's mandatory `_id` field and sets the name on both sides, so you write `user._id` and `where({ _id })`."
- `prisma.config.ts`: no snippet added per the brief; the sentence now says the connection string is in that file and links to the data contract page.
- Appending to / replacing embedded data: "Replace a whole embedded value with `u("address").set({ ... })`, and remove it with `u("address").unset()`. A list of embedded values is replaced as a whole with `u.addresses.set([ ... ])`."
- Nested writes: "There are no nested writes on MongoDB: create the user first, then the post with its `authorId`."
- Variants: "A variant declares only its own fields. `id`, `title`, and `kind` come from `Post`." And "You reach a single variant through the base model: `db.orm.posts.variant("Article")` limits the query to one variant." No claim made about `db.orm.articles` either way.
- Typed results after a pipeline filter: answered by the pipeline-builder link ("for running it and what comes back"), since this page does not own that.

## Facts looked up

- Nested writes: no `connect` and no `create` callback anywhere in `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/prisma-src/packages/2-mongo-family/5-query-builders/orm/src/` (grep for `connect` and `nested` returns nothing). Supports the "no nested writes" sentence.
- Variant access: `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/prisma-src/packages/2-mongo-family/5-query-builders/orm/test/integration/polymorphism.test.ts` uses only `orm.tasks.variant('Bug')` style, never `orm.bugs`. No `variant` accessor generation in `mongo-orm.ts`. So the page keeps "through the base model" and claims nothing more.
- `set` on a list path: `field-accessor.ts:70` gives `set(value: MongoValue)` on `LeafExpression`, and `resolve-path.ts` (`FieldToLeaf`, around lines 98-106) maps a `many: true` contract field to a leaf with `codecId: 'mongo/array@1'`. So a list of embedded values resolves to a leaf and `u.addresses.set([...])` is valid. Whole-value `set`/`unset` on a single embedded path is `field-accessor.ts:92-112` (`ObjectExpression`).

## Q list

None.