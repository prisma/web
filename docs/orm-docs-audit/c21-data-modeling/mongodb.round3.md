## Sentences I could not restate after one reading

**1.** "`ObjectId` replaces `String @db.ObjectId` and `@default(auto())`. Writing either of those attributes is an error whose `code` is `PSL_UNSUPPORTED_FIELD_ATTRIBUTE`." (line 24)

What stopped me: "PSL" is never spelled out. And the second sentence is internal plumbing — I don't type error codes, I read them. Plainest version I'd have understood: "Write `ObjectId`. The old `String @db.ObjectId` and `@default(auto())` are no longer allowed and will fail validation."

**2.** "`db.orm.users` is the accessor for the collection, and it follows the collection name, so `@@map` renames the accessor as well. In Prisma ORM 7 it did not." (line 30)

Three ideas stacked: what the accessor is, that it tracks `@@map`, and a version difference. "Accessor" is a word I had to guess at. Plainer: "`db.orm.users` is how you query the `users` collection. The name after `db.orm.` matches the collection name, so if you set `@@map("users")` you write `db.orm.users`, not `db.orm.user`."

**3.** "`db` is the client you create once in `src/prisma/db.ts`, and `npx prisma orm init` writes that file." (line 30)

This contradicts itself in one sentence — do I write it or does `init` write it? I still don't know whether I need to author anything there.

**4.** "In an `update`, `u` gives you each field of the document to change." (line 81)

I cannot restate this. "gives you each field" means nothing concrete. Then the example shows two completely different shapes — `u("address.city").set(...)` and `u.tags.push(...)` — and the page never says why one is a function call with a string and the other is a property. Plainer: "`u` is a builder. Use `u.fieldName` for a top-level field, and `u("path.to.field")` when the field is inside an embedded document."

**5.** "`const rows = await (await db.runtime()).query(berliners);`" plus "use the pipeline builder, a chained builder for MongoDB aggregation pipelines" (lines 88–92)

The double `await` and `db.runtime()` appear once, are never explained, and appear nowhere else on the page. What is `db.runtime()`? Why does the normal `db.orm.*` path not work here? What type is `rows` — my `User` model, or raw MongoDB documents? I'd have to guess raw.

**6.** "Models go in your contract, the `contract.prisma` file that replaced `schema.prisma`. Run `npx prisma contract emit` after every change to it, then `npx prisma migration plan --name <name>` writes a migration and `npx prisma db migrate` applies it, creating the collections and indexes." (line 170)

One sentence, three unfamiliar commands, and "emit" is never defined — emit *what*, to where? This is the single most important operational sentence on the page and it's buried in a Next steps bullet.

## Words and phrases I had to guess

- **"the data contract"** / **"contract"** — guessed: the new name for the schema file. The link at line 13 is dropped before the page has told me what a contract is; I only learn it's `contract.prisma` in the final bullet, 157 lines later.
- **"accessor"** — guessed: the property on `db.orm` you call query methods on.
- **"PSL"** — guessed: Prisma Schema Language.
- **"pipeline builder"** — guessed: a fluent API that constructs a MongoDB aggregation pipeline.
- **"discriminator"** — the page does define it, adequately.
- **"models a one-to-one"** (line 74) — one-to-one *what*? Guessed: relation.
- **"variant"** — guessed from context; the page does eventually make it clear.

## "So what do I actually type?" — unanswered

1. **`_id` vs `id` in TypeScript.** The model declares `id ObjectId @id @map("_id")`. Then every code sample uses `user._id` (lines 33, 84, 85, 120). So which is the JavaScript property — `id` or `_id`? The page never says, and the mismatch with the model is exactly the thing I'd get wrong. This is the biggest gap on the page.

2. **The connection.** "Your `prisma.config.ts` file holds the connection, using `defineConfig` from `@prisma/orm-mongo/config`" — there is no example. Not one line of what that file looks like, where the connection string goes, or what env var it reads.

3. **Adding to a list of embedded documents.** Line 74 introduces `addresses Address[]`. Line 81 says `.push(...)`/`.pull(...)` work on "a list of scalars." So how do I append an `Address` to `addresses`? Never shown.

4. **Replacing or clearing a whole embedded object.** I'm shown `u("address.city").set("Hamburg")` for one field. How do I swap the entire `address`, or set it to null?

5. **Creating a post and its author together.** "To link a new post to a user, set the reference field yourself" tells me nested writes are gone, but doesn't say whether there's any replacement for Prisma 7's nested `connect`/`create`. I'd be left wondering if I now have to do two round trips by hand.

6. **Variant models.** Do `Article` and `Tutorial` declare `id`/`title` themselves? The example omits them and says "A variant has every field of its base," so I guess no — but I'd want that stated as a rule, not inferred. Also: is there a `db.orm.articles`, or is `db.orm.posts.variant("Article")` the only way in?

7. **Filtering on an embedded field, then using the result.** After the pipeline example I have `rows`, and no idea if I can then `.update()` them, or whether I'm now outside the typed API entirely.

## Implementation detail where I wanted instructions

- The error code `PSL_UNSUPPORTED_FIELD_ATTRIBUTE` (line 24). Tell me not to write it; don't tell me the internal code name.
- "In Prisma ORM 7 it did not" (line 30). A one-clause aside about old behavior dropped mid-explanation of new behavior. If the migration difference matters, say what to change; if not, cut it.
- `db.runtime()` (line 92) exposes a layer of the client I otherwise never touch and never needed explained.

## Could I do what the page is for after one reading?

Partly. I could confidently write the Prisma models — documents, `type` blocks, references, and the discriminator syntax are all clear, and the embed-vs-reference table is genuinely the best part of the page. I'd make the right modeling decision.

I could not write working code. Specifically I would still not know:

- whether to type `user.id` or `user._id`
- what `prisma.config.ts` needs to contain to connect at all
- how to add an item to an embedded array of objects
- what `npx prisma contract emit` does or why it must run before the migration commands
- how to get typed results back when I need to filter on an embedded field

The page reads as if the model syntax is the hard part. For someone coming from Prisma 7, the hard part is that the entire client API changed — no `data:` wrapper, a builder callback for updates, a separate pipeline API, a `db.runtime()` escape hatch — and those changes are each mentioned once, in passing, without enough of an example to copy.