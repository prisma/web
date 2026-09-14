Read it once, straight through, as a Prisma 7 user who has never seen 8.

## Sentences I could not restate after one reading

**Line 32 — the whole paragraph.** This is the worst thing on the page.

> "`db` is the client you create once in `src/prisma/db.ts`, and `prisma orm init` writes that file. `db.orm` holds your models, and on MongoDB the accessor is the collection name, so `db.orm.users`. The values go straight in, without the `data:` wrapper Prisma ORM 7 used. Models themselves go in your contract, the `contract.prisma` file that replaced `schema.prisma`. Run `npx prisma contract emit` after every change to it. MongoDB has migrations like any other database: `npx prisma migration plan` writes one and `npx prisma db migrate` applies it, creating the collections and indexes."

Eight unrelated new facts in one paragraph, none of them about MongoDB modeling: client file location, an init command, accessor naming, a removed `data:` wrapper, a renamed schema file, an `emit` command, and two migration commands. I stopped reading and went back three times. It is a "everything that changed in v8" dump wedged under a code sample about `_id`. It belongs in its own section, or on the migration page, with the MongoDB-specific bit (`db.orm.users`) left here.

**Line 24 vs 29/32 — the accessor name.**

> "Without it the collection takes the model name with a lowercase first letter, so `user`, and you reach it in code as `db.orm.user`."

I had to stop and work out that the *client accessor changes when I rename the collection*. In v7 the accessor was the model name and `@@map` was purely a database-side rename. The page states the new behavior twice but never says "unlike v7, `@@map` also renames the client accessor" — which is the only thing I actually needed to be told. I would have gotten this wrong.

**Line 26.**

> "There is no `@default(auto())` and no `@db.ObjectId`."

Three readings and I still don't know what happens if I write them. Removed? Ignored? Contract-emit error? "No" is not a behavior. Plainest version: "`@default(auto())` and `@db.ObjectId` are gone — writing either is an error. The `ObjectId` type covers both."

**Line 74.**

> "A list of embedded values models a one-to-many: `items CartItem[]` on a `Cart` model stores every line item inside the cart document"

Two model/type names (`Cart`, `CartItem`) that appear nowhere on the page, referenced as if I'd already seen them. I could not check my mental model against anything. Show the three-line `type CartItem` + `model Cart` instead of describing it.

**Line 124.**

> "Prisma ORM models a collection that holds more than one kind of document with a base model plus variant models, all sharing one collection."

Garden path: I read "models" as a noun ("Prisma ORM models" = my models) and had to restart the sentence. Also "base model plus variant models" and "polymorphic" are dropped on me as established terms. Plainer: "One collection can hold more than one kind of document. You declare a base model for the shared fields and a variant model for each kind."

**Line 91.**

> "pushes the document toward MongoDB's 16 MB limit"

Minor, but "16 MB limit" appears with no statement of what happens at the limit (the write fails). I guessed.

**Line 120.**

> "If a read runs constantly, you can copy the few fields it needs into the parent document, such as a comment storing its author's name."

I know this is denormalization. The sentence does not say that copies go stale and that keeping them in sync is now my job. That is the entire cost of the advice, and it's missing.

## Words and phrases I had to guess

- **"contract"** (line 32) — guessed: the new name for the schema file. The page says "your contract, the `contract.prisma` file that replaced `schema.prisma`" but never says what a contract *is* or why it isn't just called a schema anymore.
- **"`prisma contract emit`"** — guessed: regenerates the client, i.e. the old `prisma generate`. The page never says what it emits or why I need it.
- **"`npx prisma migration plan` writes one"** — guessed: "one" = a migration file. Guessed it goes in a `migrations/` folder. Not stated.
- **"the pipeline builder, the API for MongoDB aggregation pipelines"** (line 89) — the gloss tells me what it wraps, not what it looks like. Guessed: a chained query builder.
- **"`u`"** in `update((u) => [u("address.city").set("Hamburg")])` — guessed: a field-accessor for the row being updated. Never named or explained anywhere on the page.
- **"`.all()`"** (line 117) — guessed: executes and returns many rows. It appears once, unannounced, and `create` on line 29 does *not* need it, so I don't know the rule.
- **"variant"** (line 152) — guessed correctly, but only because `@@base(Post, "article")` was right above it.
- **"`@@discriminator(kind)`"** — the page does define "discriminator field" inline, which worked.

## "So what do I actually type?" — unanswered

1. **How do I tell the contract this is MongoDB.** There is no `datasource` block, no `provider = "mongodb"`, no connection string, anywhere on a page titled "MongoDB data modeling". For MongoDB specifically this is the first thing I need.
2. **How do I create a referenced record.** The references section shows the schema and a read (`.include("author")`), and then stops. I don't know whether I write `authorId` directly, or use something like v7's `connect:`, or a nested create. This is the most common thing I'd do after reading that section.
3. **How do I filter on an embedded field.** Line 89 tells me `.where()` won't do it, tells me the tool that will, and gives me zero code. I'm left with "use the pipeline builder with a path such as `address.city`" and a link. One example would fix this.
4. **How do I query by `_id`.** Do I pass a string, or construct an `ObjectId`? Every v7 MongoDB user hits this in the first hour. Not mentioned.
5. **How do I push to or remove from an embedded array.** The page recommends embedded arrays for one-to-many, then only shows `.set()` on a scalar path. Adding a cart item — the exact example it used — is not shown.
6. **Do variant models need `@@map`?** `Article` has no `id`, no `@@map`. I inferred it inherits the collection from `@@base(Post, ...)`, but that's a guess and the page should say it in five words.
7. **Where does `@@index([authorId])` go and when do I need one?** It's mentioned in one trailing clause of the polymorphic section, which has nothing to do with indexes, and then handed off to another page.
8. **Migrations for MongoDB.** "MongoDB has migrations like any other database" — but I have no idea what a migration does on a schemaless store, what `plan` produces, or whether I must run these before my first `create`. The sentence raises the question and then leaves.

## Internal mechanics where I only wanted to know what to do

- Line 24, `@@map("_id")` explained as a *mapping* between model field and MongoDB field. Fine and short — this one earns its place.
- Line 32, `prisma contract emit` "after every change" is the reverse problem: pure mechanism with no explanation, presented as a ritual.
- Line 124, "MongoDB collections do not enforce a single shape, so this is the usual way..." — background on MongoDB's storage model when I was trying to find out how to declare a variant. Cut it or move it after the code.

Nothing else on the page over-explains internals. The failure mode here is the opposite: commands and APIs introduced with no explanation at all.

## Could I do what the page is for, after one read?

**Partly.** I could decide embed vs reference — that section (lines 36–53, including the table) is genuinely good and is the only part I could restate cleanly without rereading. I could also write the `type Address` / `model User` embedded schema and the reference schema from memory.

**I could not actually build anything**, because after one reading I still don't know:

- How to point the contract at my MongoDB database at all.
- How to create a record on either side of a reference.
- How to query or filter by anything inside an embedded document — the page explicitly tells me `.where()` won't work and then doesn't show me what does.
- Whether I have to run `prisma contract emit` and `prisma db migrate` before my first write, or in what order.
- How to pass an `_id` into a query.
- What `u`, `.all()`, or `.set()` are, beyond guessing from context.

The page is a good *decision* guide and an incomplete *task* guide. The embed-vs-reference material is the strongest thing here; the v8 API and tooling around it is asserted in fragments, mostly inside one overloaded paragraph, and never demonstrated end to end.