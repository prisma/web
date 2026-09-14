# Reader review: `wip/c21/dm/r4/mongodb.mdx`

## Sentences I could not restate after one reading

**1. Line 13** — "Your models go in your contract, the `contract.prisma` file that replaced `schema.prisma`. There is no `datasource` block on MongoDB. The connection string is in your `prisma.config.ts` file instead, passed to `defineConfig` from `@prisma/orm-mongo/config`."

What stopped me: three new things in three sentences, none shown. "your contract" is used as a noun for a thing I have never heard of. `defineConfig` and `@prisma/orm-mongo/config` are named but never demonstrated — I cannot picture the file. "There is no `datasource` block" answers a question I had not asked yet and implies other databases still have one.

Plainer: "Your models go in `contract.prisma` (Prisma 8's replacement for `schema.prisma`). MongoDB connection settings go in `prisma.config.ts`, not in a `datasource` block — [example here]."

**2. Line 24** — the whole paragraph. It is eight sentences carrying eight unrelated facts: `_id` naming, what `@map` does, what `@@map` does, the default collection name, the key type, two removed syntaxes, the command that validates, and how ids get assigned. I lost the thread by the fourth sentence. Split it.

**3. Line 24** — "`@map("_id")` maps the model's `id` field to MongoDB's mandatory `_id` field and sets the name on both sides, so you write `user._id` and `where({ _id })`."

"sets the name on both sides" — which two sides? Database and TypeScript? I had to infer it from the example that follows. And it contradicts my expectation: I declared the field as `id` in the contract, so why is it `_id` in TypeScript? The page states it but never says why, so I do not know whether I can make it come out as `id`.

Plainer: "In the contract you call the field `id`; in TypeScript it is always `_id`."

**4. Line 30** — "The id comes back as a string, and you pass it back as a string. There is no `ObjectId` to construct."

I had just been told to "Write `ObjectId` for the key type." So the type is `ObjectId` but the value is a string. That is not a contradiction once you think about it, but the page sets it up as one and does not close it. Say plainly: "`ObjectId` is the contract type; in TypeScript ids are plain strings."

**5. Line 81** — "In an `update`, `u` builds the changes you want."

`u` arrives with no introduction. Looking at the example, `update` takes a function and the function returns an **array** — nothing says why it is an array or that multiple changes go in one call (I only worked that out from the second example). Also unexplained: why `u.tags` (property) and `u("address.city")` (call) are two different forms. I guessed: dotted paths must be strings because they are not valid property names. The page should just say that.

**6. Line 88** — "`.where()` filters on top-level model fields only. To match on a field inside an embedded document, use the pipeline builder, a chained builder for MongoDB aggregation pipelines."

The limitation is clear; the replacement is not. "chained builder for MongoDB aggregation pipelines" tells me nothing I can act on, and the example that follows does not run (see below).

**7. Line 123** — "The copy then goes stale on its own, and keeping it up to date is your job."

"goes stale on its own" reads oddly, as if the data actively rots. Plainer: "If the original changes, the copy does not. You have to update it yourself."

## Words and phrases I had to guess

- **"your contract"** (line 13) — guessed: the Prisma 8 name for the schema file. The page tells me the filename in the same breath but never says the word "contract" is now the general term for the whole thing, and then uses it four more times ("changes to your contract", "checks your contract").
- **"contract emit"** (line 24, 169) — guessed: the new `prisma generate`. "emit" is doing a lot of work; the inline gloss ("checks your contract and regenerates your types") helped, but it is buried mid-paragraph in a sentence about removed syntax.
- **"pipeline builder"** (line 88) — guessed: a fluent API that produces a MongoDB aggregation pipeline.
- **"variant"** (line 127 onward) — guessed: a subtype. Fine, the page defines it well enough by example.
- **"discriminator field"** (line 127) — guessed correctly, but only because I have seen the term elsewhere. The sentence "its value says which kind each document is" is doing the defining work and is good.
- **`db.orm`** (line 30) — guessed: a namespace on the client. Never explained why there is an `orm` level at all, or what else lives on `db`.
- **`@@base(Post, "article")`** — guessed: "this model extends Post, and its discriminator value is `article`." Line 148 confirms it one sentence later, which is fine.

## "So what do I actually type?" — places the page does not say

1. **The `prisma.config.ts` file.** Named, with an import path and a function, and never shown. This is the one thing without which nothing on the page works. It is the biggest hole on the page.
2. **Importing the client.** Line 30 says `npx prisma orm init` writes `src/prisma/db.ts`, then every example uses a bare `db`. No import line anywhere. Do I write `import { db } from "./prisma/db"`? Guessing.
3. **Running the pipeline.** Line 91 assigns `const berliners = db.query.from("users")...build()`. No `await`. So `berliners` is... a pipeline object? An array of Berliners? The name says the latter, the code says the former. The page punts to another page for "running it and what comes back" — but then it should not name the variable as though it holds results.
4. **The order of commands for a new project.** The page names `npm create prisma@latest`, `npx prisma orm init`, `npx prisma contract emit`, `npx prisma migration plan --name <name>`, `npx prisma db migrate`, and `npx prisma skills sync`, scattered across five sections. I finished the page not knowing which of these I run first, or whether `orm init` and `npm create` are alternatives.
5. **Indexes and uniqueness.** Line 169 says migration "creat[es] the collections and indexes," but no example declares an index. If I want `email` unique — the very first model has an `email` field — the page does not tell me how.
6. **Querying a variant's own fields.** `db.orm.posts.variant("Article")` limits the query, but nothing shows reading `summary` off a result, or what happens if I `.all()` the base and want to tell an Article from a Tutorial in TypeScript.
7. **`references: [id]` vs `_id`.** Line 111 writes `references: [id]` using the contract-side name while everything in TypeScript is `_id`. I paused on whether that was a typo. One clause would fix it.
8. **Reading references the other way.** `.include("author")` goes child-to-parent. Nothing shows loading a user's `posts`.

## Internals where I only wanted instructions

Very little, which is unusual. Two spots:

- **Line 13** — "the `contract.prisma` file that replaced `schema.prisma`" is product history, not an instruction. It is useful to me as an upgrader, but it is delivered as the definition of what a contract is, which it is not.
- **Line 24** — "The old `String @db.ObjectId` and `@default(auto())` are no longer allowed and fail at `npx prisma contract emit`." Telling me *which command* rejects them is implementation detail I did not need mid-paragraph; "these no longer work, write `ObjectId`" is enough, and `contract emit` deserves its own introduction elsewhere.

## Could I do what the page is for, after one reading?

**Half.** The decision the page exists to help me make — embed or reference — I can now make confidently. The table on lines 44–51 and the blog-comments example on line 53 are the clearest part of the page; I could apply them to my own data immediately. Same for the polymorphic section: the discriminator explanation on line 148, including "write `kind` and not `"kind"`" and `.variant("Article")` not `"article"`, anticipated exactly the two mistakes I would have made.

**What I still would not know:**

- How to connect to MongoDB at all. I cannot write `prisma.config.ts` from this page.
- Whether my project is set up correctly, or in what order to run the six commands named.
- How to import `db`.
- How to actually execute a filter on an embedded field — the one example is incomplete.
- How to declare a unique index on `email`, despite the page putting `email` in its very first model.
- Why my `id` field is `_id` in TypeScript, and whether that is changeable.

The modeling guidance is solid. The surrounding mechanics — set up, connect, run — are named rather than shown, so a reader coming from Prisma 7 cannot get from this page to working code.