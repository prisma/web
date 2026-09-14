Read once, top to bottom, as someone coming from Prisma 6. Report below.

## Sentences I could not restate after one reading

**Line 13** — "In Prisma ORM, you define this structure in your contract, the `contract.prisma` file that replaced `schema.prisma`."
Stopped by: "your contract." The page uses it as a noun I already own before it ever says what a contract is. "The file that replaced `schema.prisma`" tells me the filename changed but not whether the contents changed, whether my existing file still works, or whether something renames it for me. Plainest version I'd have understood: "Prisma 8 renames `schema.prisma` to `contract.prisma`. The file is called your contract. It holds the same model definitions you wrote before, plus X."

**Line 13, second half** — "Prisma ORM derives your TypeScript types, your migrations, and the client's configuration from it."
Stopped by: "the client's configuration." In v6 my `generator` and `datasource` blocks lived in `schema.prisma`. Is "the client's configuration" those blocks? A new thing? The page shows four building blocks and none of them is configuration, so I can't place this.

**Line 163** — "A `Decimal` value reaches your code as a decimal string, so binary floating point never loses digits. Write the type as `Numeric(10, 2)` when you want an explicit precision and scale. A `DateTime` value reaches your code as a `Temporal.Instant`, and a `Bytes` value as a `Uint8Array`. `Jsonb` is also the storage the TypeScript builder's `field.json()` and value objects use."
Four unrelated facts in one paragraph, and the last one I cannot resolve at all. "The TypeScript builder" is never introduced anywhere on the page and is not linked. "Value objects" likewise. `field.json()` is a method on something I have not been told exists. I got nothing from that sentence.
Also inside it: "Write the type as `Numeric(10, 2)`" — `Numeric` is not in the type table two lines above, which lists `Decimal`. Are they the same type? Two types? Is this `@db.Decimal(10, 2)` renamed? I could not tell.

**Line 167** — "Prisma ORM's type system is extensible, so extensions can add more types, such as vectors or geometry."
"Extensions" here could mean Prisma Client extensions (which I used in v6 for query middleware, and which had nothing to do with schema types) or something new. No link. I'd cut it or link it.

**Line 205** — "Widening a type later is a migration. The wider type today is free."
"Is free" I could not restate honestly. `BigInt` is not free in the client — it comes back as a JS `bigint`, which does not `JSON.stringify`. That's the cost I actually hit in v6, and the page says there isn't one.

**Line 119** — "A UUID is wider than an integer and random UUIDs index a little worse, but independent services never collide and nothing is leaked."
"Random UUIDs" implies non-random ones exist and are better. The example right above is `@default(uuid())`. Which kind do I get? If there's a sortable option, the page tells me to want it and not how to get it.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the schema, same concept.
- **"the client's configuration"** — guessed: the `generator` block.
- **"the TypeScript builder"** — guessed: some way of defining models in TypeScript instead of `.prisma` files? Genuinely a guess.
- **"value objects"** — guessed: no idea. Some Prisma 8 concept.
- **"`Temporal.Instant`"** — guessed: the TC39 Temporal API. Do I need Node 22+? A polyfill? Not said.
- **"`ObjectId`"** as a Prisma type (line 53) — guessed: replaces v6's `String @db.ObjectId`.
- **"`@@map("users")`"** (line 55) — guessed: table/collection name override. Appears in a code sample with zero mention in prose; it's the only attribute in the page that's shown without being explained.
- **"reference tables" / "lookup tables"** (lines 65, 74) — guessed from context; fine, but they're used as if already defined.
- **"skills"** (line 241) — guessed: agent instruction files. At least it's linked.

## "So what do I actually type?"

1. **Migrating an existing project.** The page says `contract.prisma` "replaced `schema.prisma`" and then never says what I do about it. Do I `git mv`? Does a codemod exist? Does Prisma read the old name? This is the single biggest gap for the audience that has a v6 app.
2. **Explicit precision.** "Write the type as `Numeric(10, 2)`" — write it *where*? `price Numeric(10, 2)`? `price Decimal @db.Numeric(10, 2)`? No code sample, and this is the one paragraph that tells me to type something and shows nothing.
3. **After I write the models.** The page ends at "Query your models." Nothing says how the contract reaches the database — no `prisma migrate dev`, no `prisma generate`, not even a link labeled as that step.
4. **MongoDB `_id`.** Line 53 shows `id ObjectId @id @map("_id")` with no `@default`. In v6 I wrote `@default(auto())`. Does Prisma 8 generate the ObjectId for me, or must I supply one on every `create`? The page states `_id` is mandatory and then hands me a model with no way to fill it.
5. **The other side of a relation.** The `Post` example (line 221) has `author User @relation(...)`. v6 required a matching `posts Post[]` on `User` or validation failed. The page never shows `User`, never mentions the back-relation, and says "Two kinds of field describe a relation" — which reads like two fields total, not two per side. I would have typed only the `Post` half and hit an error.
6. **Enums.** Line 245 tells my coding agent to find "fields that should be an enum," and the page never mentions enums — not in the type table, not in the "four things." Where do I declare one?
7. **Databases other than PostgreSQL.** The type table annotates every type with its PostgreSQL mapping only. I'm on MySQL. Does `Decimal` map? Does `Jsonb` exist? The page says "All four apply to every database" and then the only concrete table is PostgreSQL-specific.
8. **Decimal versus integer cents.** Line 155 offers `Decimal` as "exact decimal." Line 187 says "Money is not a `Float`" and tells me to store `priceCents Int`. So when do I use `Decimal`? The page gives me two answers for money and never reconciles them.

## Internals I did not ask for

- **Line 163**, `Jsonb` "is also the storage the TypeScript builder's `field.json()` and value objects use." That's a note about how another Prisma feature is implemented. I'm picking a column type.
- **Line 119**, "random UUIDs index a little worse." Useful as a tradeoff, but without a way to act on it it's just index internals.
- **Line 167**, the type system being "extensible." That's a statement about Prisma's architecture; it doesn't tell me to do anything.
- **Line 109**, "it leaks row counts and invites guessing" is fine — it changes my decision.

## Could I do what the page is for, after one reading?

Partly. I could write a plain PostgreSQL model with a surrogate key, pick sensible scalar types, and make a decent call between a natural and a surrogate key. The primary-key section is the strongest part and I'd have made the right choice from it.

I could not:

- Say what a "contract" is beyond a renamed file, or convert my existing v6 project to one.
- Write a working relation, because I was never shown the `User` side.
- Write a MongoDB model, because the `_id` example has no way to populate the id.
- Declare a decimal with precision, because the instruction has no syntax.
- Get from a finished contract to a database, because the page never names the command.
- Explain `Jsonb`'s relationship to whatever the "TypeScript builder" is — I still don't know what that is.

The page's own framing is "four things." It covers three of them well enough to act on and leaves relations, the thing I actually came for, with half an example.