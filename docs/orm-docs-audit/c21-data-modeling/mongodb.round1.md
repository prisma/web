Read once, top to bottom. Here's what tripped me up.

## Sentences I could not restate after one reading

**Line 87:** "You can still match on its fields through the parent, with a path such as `address.city` in the [pipeline builder](...)."

Two problems. I don't know what "the pipeline builder" is — it's linked but never described, and the sentence assumes I already know. Worse, the sentence implies that matching on an embedded field is something you do *in the pipeline builder*, i.e. not in an ordinary query. In the version I use I'd write a normal filter on a composite type field. Is that gone? Plainer: "You can filter on embedded fields in a normal query using X syntax" — and then show X. If the pipeline builder really is the only way, say that outright.

**Line 118:** "A `$lookup` is a real cost on reads that run often, so document models often keep a small copy of the fields a read needs inside the parent."

"document models often keep a small copy" — models don't keep copies, people do. And this is three ideas in one sentence: lookups are slow, therefore denormalize, and here's the general practice. Plainer: "Resolving a reference costs an extra query. If a read runs constantly, you can copy the few fields it needs into the parent document." Also, the whole paragraph gives me advice with no code — see below.

**Line 150:** "`db.orm.posts.variant(\"Article\")` limits the query to one variant."

I could not restate this because I don't know what `db` is, what `.orm` is, or where either comes from. In the version I've used for two years the client is `prisma.post.findMany()`. This is the only client code on the entire page and it arrives with no introduction. Is `db` something I import? Something generated? `orm` looks like a namespace I've never seen.

**Line 152:** "Use one polymorphic collection when the variants are handled together far more than separately: a notifications collection of email, SMS, and push messages read as one stream."

The colon-example construction made me re-read. The example is good; the sentence in front of it is compressed. Plainer: "Use one collection when you almost always query the variants together — for example, email, SMS, and push notifications that you read as a single feed."

## Words and phrases I had to guess at

- **`ObjectId`** (line 19) — I guessed this is a new scalar type in the schema language. In the version I know, you write `String @id @default(auto()) @map("_id") @db.ObjectId`. The page shows a bare `ObjectId` with no `@default`, and never says the type is new or that `@db.ObjectId` is gone. I guessed, and I'm not confident.
- **"the pipeline builder"** (lines 87, 166) — guessed: some API for writing MongoDB aggregation pipelines. Never stated on the page.
- **`@@discriminator(kind)`** (line 132) — guessed from the name. The page does explain it on line 150, but the unquoted `kind` next to `@@map("users")`'s quoted string made me guess whether the argument is a field reference or a string, and whether I'd get an error for writing `"kind"`.
- **`@@base(Post, "article")`** (line 139) — guessed: "Article is a subtype of Post, stored with `kind = "article"`." The explanation on line 150 confirms it, but only after two code blocks.
- **`.include(...)`** (line 165) — guessed this is a chained method. In the version I know, `include` is an option object key. The page uses method syntax in passing without flagging the change.
- **`prisma-8` skill** (line 156) — guessed: a named bundle of instructions for an AI coding agent.
- **"discriminator field"** (line 122) — guessed: a field whose value says which kind of document this is. Fine, but it's introduced as if standard vocabulary.
- **"no independent life" / "records with their own life"** (lines 32, 87) — guessed: can't be queried or updated on its own. The literal version is right there in the page (line 34, "each record stands on its own"); the metaphor is the weaker wording.

## "So what do I actually type?"

This is the page's biggest problem. There is **not one line of query code on the whole page** except the unexplained `db.orm.posts.variant("Article")`.

1. **How do I get an `_id` generated?** The schema shows `id ObjectId @id @map("_id")` with no default. When I call create, do I have to supply an ObjectId myself? Does MongoDB fill it in? Does Prisma? The version I know requires `@default(auto())` and I'd get a runtime error without it. The page never says.
2. **How do I create a document with an embedded type?** Section "Embedded documents" defines `Address` and `CartItem` and then never shows a write. Do I pass a plain nested object? Is there a `create:` wrapper like relations have?
3. **How do I update one item inside an embedded array?** Line 32 says writes update "parent and children together, atomically" — great, but what do I type to change `items[2].amount`?
4. **How do I filter on an embedded field in a normal query?** See line 87 above. I'm told a path string and pointed at another page.
5. **How do I create a polymorphic document?** `Article` has `summary` and nothing else. Do I write `db.orm.articles.create({ title, summary })`? Does `kind` get set for me from `@@base`, or do I set it? Does `Article` have `title` and `id`, inherited from `Post`? The page says they "share one collection" but never says the variant model inherits the base model's fields — I'm inferring it.
6. **How do I apply this schema to MongoDB?** There are no migrations for MongoDB in the version I know; you run a push command. The page ends with a polymorphic schema and never tells me the command that makes it real.
7. **How do I declare the indexes line 152 tells me to think about?** "need very different indexes" is the only mention of indexes and there's no syntax anywhere.
8. **How do I keep the denormalized copy in sync** (line 118)? The page raises the technique and the maintenance cost, then stops. Either show the pattern or don't raise it.

## Explaining the machinery when I wanted instructions

- **Line 116:** "Prisma ORM resolves it with a `$lookup` aggregation." I don't need to know the MongoDB operator name to write a query. It's only justified if it sets up line 118 — and line 118 is itself advice I can't act on.
- **Line 122:** "MongoDB collections do not enforce a single shape. The usual choice is to store documents of different kinds in one collection..." This is a MongoDB-modeling lecture before I get told what Prisma does about it. Line 124 ("Prisma ORM models this with a base model plus variant models") is what I came for and it's the third sentence.
- **Line 91:** "pushes the document toward MongoDB's 16 MB limit" — this one earns its place; it's a hard limit I'd hit. Keeping it.
- **Line 26:** "Without it the collection takes the model name with a lowercase first letter, so `user`." Useful, but then every single example on the page uses `@@map` anyway, which made me wonder whether it's actually optional or just conventionally required.

## Could I do what the page is for?

Partly. I could **write a schema** — models with `ObjectId` ids, `type` blocks for embedded data, `@relation` for references. The embed-vs-reference table on line 38 is the best thing on the page; it answered the actual decision I came with, in one screen, with examples I recognized.

I could **not** do anything with that schema. After one reading I still don't know:

- Whether I need `@default(auto())` on the id, or what happens on create if I omit it.
- How to apply the schema to my database (no command anywhere).
- What `db.orm` is, or how to get one.
- How to write or read an embedded document — no client code exists on this page.
- How to filter on an embedded field without learning "the pipeline builder" first.
- Whether `Article` inherits `Post`'s fields, and how to create one.

The page reads as a schema-design reference that has been labeled a data-modeling guide. Every time it approaches "and here's what you run," it hands off to a link (`/orm/fundamentals/reading-data`, `/orm/fundamentals/relations-and-joins`, the pipeline builder anchor) — five links, and I'd have to open at least three of them before I could run anything I modeled here.