Done. Page is at `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/dm/r4/index.mdx`, 257 lines before, **252 after**. `check-plain.sh` is clean, no em-dashes, no extra banned words, no semicolons in prose.

## What I did, mark by mark

**Sentences the reader could not restate**

- **Line 13, four facts in one paragraph.** Split in two. First paragraph ends at "Prisma ORM derives your TypeScript types and your migrations from it." Second: "There is no `datasource` or `generator` block any more, and the connection string is in `prisma.config.ts` instead. [A complete contract](...) shows a whole file, and that page shows the config file too."
- **"coming from Prisma ORM 7" did not cover a 6 user.** Link text now reads "If you are [coming from Prisma ORM 6 or 7](/orm/coming-from-prisma-orm-7), that page covers the rename and the rest of the differences."
- **Line 151 table note.** Now "The PostgreSQL names in the table are the column types Prisma ORM creates."
- **"the ORM filter".** Now `.where()`: "On a `Jsonb` field, `.where()` compares the whole value. You can ask whether the column equals a given document, but not whether a key inside it matches. A `Json` field cannot be compared in `.where()` at all..."
- **`@@type("pg/text@1")` half-explained.** Now "`@@type` is required on every enum and says how the values are stored, here as PostgreSQL `text`. `pg/text@1` is the PostgreSQL type plus a version, always `@1` today. On MongoDB, write `@@type("mongo/string@1")`."
- **BigInt riddle.** Now "Changing `Int` to `BigInt` later needs a migration. Pick `BigInt` now and you skip it."
- **Optional fields with no example.** Now "...only when "absent" means something different from a sensible default, such as `publishedAt DateTime?` where no value means unpublished."
- **Comma splice on relation fields.** Now "A relation uses two kinds of field. The model that holds the link needs both. The model on the other end needs only a relation field:" and the first bullet says "The link field stores the other record's primary key, like `authorId`. Prisma ORM 7 called this the relation scalar field."
- **"are rejected" / implicit many-to-many.** Now "Prisma ORM 7 let you write a list field on both sides with no such model. That is gone, and `npx prisma contract emit` rejects it."

**"So what do I type?"**

- **Connection string.** The complete-contract clause now says that page shows the config file too. No config snippet added, per the brief.
- **MongoDB id.** "The field takes no `@default`. Omit `id` when you create a document and MongoDB assigns it."
- **Temporal polyfill.** "...add `import "temporal-polyfill/full/global"` in your app's entry file, before any query runs."
- **One-to-one.** Kept the prose and added the link: "[One-to-one](/orm/data-modeling/relational-databases#one-to-one) has both models written out." I did not add the code block; the cuts did not pay for seven lines, and the target page already shows both models in full.
- **Commands.** Now an ordered sequence: "Edit the contract, then run `npx prisma contract emit` to check it and regenerate your types, then `npx prisma migration plan --name <name>` to write a migration file, then `npx prisma db migrate` to apply it. `npx prisma contract emit` replaces `prisma generate`."
- **`Decimal` vs `Numeric(10, 2)`.** Table cell is now "`Decimal`, or `Numeric(10, 2)` with a precision and scale", and the duplicate prose about both spellings is gone.
- **"reference tables" before its gloss.** Reordered: "Some tables hold a fixed set of values that other records point at. Natural keys fit these reference tables best."

**Mechanism instead of instruction**

- **Primary key paragraph trimmed** to the instruction plus one trailing clause: "Give every model one and mark it with `@id`, because `update` and `delete` fail at runtime on a model that has neither a primary key nor a unique field:"
- **Duplicate "leaks row counts".** Cut "and the value tells nobody how many records you have" from the UUID paragraph; kept the autoincrement sentence.
- **`uuid(4)` equivalence cut.** "Write `@default(uuid(7))` for ids that sort by creation time. `@default(uuid())` is random."

**Not redefined, by the section's rules:** polymorphic collections and relations (defined on `/orm/data-modeling/mongodb` and `/orm/data-modeling/relational-databases`, both already linked); relation kinds and foreign key placement (linked).

**Cuts that paid for the additions:** the second `Product`/`sku` example model in "Surrogate keys" (the `User` example already makes the point), and the `Decimal` paragraph merged into the `DateTime`/`Bytes` paragraph.

## Facts looked up

- MongoDB enum `@@type("mongo/string@1")` — `wip/prisma-src/examples/mongo-demo/src/contract.prisma:3-4`.
- `#one-to-one` anchor exists and shows `User` plus `Profile` with `userId Int @unique` — `apps/docs/content/docs/orm/data-modeling/relational-databases.mdx:73-91`.

## Q list

- **Q1.** The reader asked how to add two `Decimal` values when they arrive as strings. I found no guidance in the rc.10 tree (searched `wip/prisma-src/examples/**` and the demo `main.ts` for decimal handling; only aggregate results such as `avgDecimal` returning a decimal string turned up). The page still says only "use `Int` in the currency's smallest unit for ordinary money, `Decimal` when you need more decimal places". No claim invented.
- **Q2.** I did not add "MySQL and SQLite are not options" to the moved support sentence, even though the reader's biggest surprise was MySQL. The source tree contains `wip/prisma-src/examples/prisma-8-demo-sqlite/`, so naming SQLite as unsupported would have been a new claim I cannot back. The sentence now sits in the intro, before the four-block list, as instructed.