Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**Line 13** — "In Prisma ORM, you define this structure in your contract, the `contract.prisma` file that replaced `schema.prisma`."
Stopped by: "your contract." The page names the new word and immediately uses it as if I now know it. I know what a schema is. I do not know why this is called a contract, or whether "contract" means something more than "the file formerly called schema.prisma." Plainest version I'd have understood: "Prisma ORM 8 renames `schema.prisma` to `contract.prisma`. It holds the same model definitions; the file is called your contract."

**Line 22** — "All four apply to both databases Prisma ORM supports today, PostgreSQL and MongoDB."
Stopped by the implication, not the words. I ship on MySQL. This sentence says my database is gone and then moves on to the next heading. Either say it plainly ("Prisma ORM 8 supports PostgreSQL and MongoDB only") or don't raise it here.

**Line 36** — "Two posts with the same title are still two different records, and a user who changes their email address is still the same user."
Stopped by: I cannot tell what this sentence is for. It sits under a model code block, makes no claim about models, and nothing before or after picks it up. I assume it is a hint at primary keys, but the primary key section never refers back to it.

**Line 42** — "`npx prisma contract emit` accepts a model without a primary key. The ORM client does not."
Two problems. First, `npx prisma contract emit` is used here with no explanation of what it does; the page does not say until line 257. Second, "The ORM client does not" reads as a parallel to "accepts," but a client doesn't accept a model — it fails at runtime. Plainer: "Prisma will generate a client for a model with no primary key, but `update` and `delete` on that model fail at runtime."

**Line 59** — "The `create` input type makes `id` optional, so leaving it out type-checks and MongoDB assigns the `ObjectId` for you."
Stopped by "the `create` input type." That is the generated-types' name for something, and I only wanted to know: omit `id` when creating. Plainer: "Omit `id` when you create a document; MongoDB assigns it."

**Line 155** — "Where a row above names a PostgreSQL type such as `numeric` or `jsonb`, that is the column type Prisma ORM uses on PostgreSQL. MongoDB has no such mapping, and `ObjectId` is the only type in the table that is specific to it."
Stopped by: this is a sentence about how to read the table I just read. Two ideas crammed together (what the PostgreSQL column names mean; which row is MongoDB-only). I had to reread to work out it wasn't telling me anything I do.

**Line 157** — "Write `price Numeric(10, 2)` when you want an explicit precision and scale. `Numeric` is `Decimal` with the number of digits written out."
This is the worst sentence on the page for me. `Numeric` is not in the type table directly above. So is it a type? An alias? In Prisma 7 I wrote `Decimal @db.Decimal(10, 2)`, so I cannot tell whether `@db.` is gone, whether `Numeric` is a new scalar, or whether every type now takes arguments. "with the number of digits written out" is a guess-invitation, not a definition.

**Line 161** — "Filtering on a `Jsonb` field is whole-value equality only: you can ask whether the column equals a given document, not whether a key inside it matches."
Restatable on the second read, not the first. Also unexplained: `Json` and `Jsonb` are now two separate scalar types. In Prisma 7 there was one `Json` type. The page never flags the change.

**Line 170** — "You declare those values in an `enum` block that lists each member and says how the members are stored."
Stopped hard by "says how the members are stored." In Prisma 7 an enum is just a list of names — storage is not part of it. This sentence tells me the syntax changed and then refuses to show me the syntax, linking away instead. An enum block is four lines. Show it.

**Line 211** — "Two kinds of field describe a relation. The model that holds the link needs both of them. The model on the other end needs only a relation field."
Three abstractions stacked before either kind of field has been named. I had to read the bullets, then come back up to this paragraph for it to parse.

**Line 213** — "The field that stores the other record's primary key, like `authorId`."
The second bullet is named ("A relation field"). This one is not. I never learn what to call it, which matters because the next paragraph says `fields` "names the local field" — a third name for the same thing.

**Line 235** — "One-to-one: a user has at most one profile. Write it as a one-to-many and add `@unique` to the field that stores the link."
Not restatable. "Write it as a one-to-many" — but a one-to-many has `Profile[]` on the user side. Do I write `Profile[]` and then it isn't a list? Or `Profile?`? The page tells me to do something whose result contradicts its own description, and shows no code.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for schema.prisma, nothing more.
- **"emit"** in `prisma contract emit` — guessed: the new name for `prisma generate`.
- **"the ORM client"** (line 42) — guessed: what used to be called Prisma Client. The page never says they are the same thing.
- **"`ORM.ROW_IDENTITY_MISSING`"** — guessed: an error code string I could match on in a catch block. Not told where I see it.
- **"`Numeric(10, 2)`"** — guessed: a scalar type that takes precision arguments, replacing `@db.Decimal`.
- **"`Jsonb`"** as a distinct type — guessed: what `Json @db.JsonB` used to be.
- **"a model for the join table"** (line 237) — guessed: the thing that used to be called an explicit many-to-many relation table.
- **"skills"** / **"the `prisma-8` skill"** (line 246) — guessed: instruction files for Claude/Cursor. The page half-defines it ("instruction files for coding agents") but I still don't know what `npx prisma skills sync` writes or where.
- **"polymorphic collections"** (line 242, 256) — guessed: storing different shapes in one collection. Never explained, appears twice.

## Where I asked "so what do I actually type?"

1. **Line 13, `prisma.config.ts`.** I'm told the connection string moved there and the `datasource` block is gone. That is the single change most likely to break my first five minutes, and the page shows zero lines of it. Not even a three-line snippet.
2. **Line 13, where does `contract.prisma` go?** Same directory as `schema.prisma` did? Is there a rename command, or do I move the file myself?
3. **Line 170, enums.** Told the block "says how the members are stored" and sent to another page. Show the block.
4. **Line 235, one-to-one.** Described in prose only. I cannot write it from this.
5. **Line 237, many-to-many.** "This needs a model for the join table." In Prisma 7 I could write `tags Tag[]` / `posts Post[]` and get an implicit join table. Is implicit many-to-many removed? The page implies yes by omission and never says so. No code shown.
6. **Line 159, `Temporal`.** "install the `temporal-polyfill` package" — do I then need to import or configure anything, or does Prisma pick it up?
7. **Line 203, `BigInt`.** "Convert it to a string before you send it anywhere as JSON." Where — in my serializer, per field, globally? No snippet.
8. **Line 135, the composite key example.** "The two relation fields ... are left out here." So if I copy this block, does it compile? I can't tell.
9. **Line 257, the three new commands.** `npx prisma contract emit`, `npx prisma migration plan --name <name>`, `npx prisma db migrate`. All three replace `prisma migrate dev` and all three appear for the first time in one bullet, with no statement of what each does or when. The naming is also inconsistent — `migration plan` versus `db migrate` — which made me read the bullet three times to be sure it wasn't a typo.

## Where it explains internals when I wanted instructions

- **Line 42**, `ORM.ROW_IDENTITY_MISSING`. The instruction is "give every model a primary key." The error code is machinery. It sits in the middle of the instruction and interrupts it.
- **Line 59**, "The `create` input type makes `id` optional, so leaving it out type-checks." I wanted "omit `id`." I got the mechanism by which omitting it works.
- **Line 155**, the paragraph explaining how to read the type table's PostgreSQL column.
- **Line 214**, "It stores nothing in the database. It tells Prisma ORM how to follow the connection in a query." This one is borderline — it does correct a real misconception — but it's framed as how Prisma works rather than as "you don't get a column for this."
- **Line 135**, "are left out here to keep the key in view." Commentary about the docs' own editing choices.

## After one reading, could I do what the page is for?

Partly. The middle of the page is genuinely usable: I could write models, pick a primary key strategy, and choose scalar types from the "How to pick a data type" section without rereading. That section is the best writing on the page — concrete rule, concrete reason, code.

What I still could not do:

- **Set up a Prisma 8 project at all.** I know `datasource` and `generator` are gone and that a `prisma.config.ts` exists. I have never seen one. I cannot connect to a database from this page.
- **Write an enum.** The page describes syntax it declines to show.
- **Write a one-to-one or a many-to-many relation.** Prose only, and the one-to-one instruction contradicts itself as written.
- **Write a `Decimal` with fixed precision.** `Numeric(10, 2)` appears from nowhere and is not in the type table.
- **Run a migration.** Three unfamiliar commands in one bullet, none explained, in a "Next steps" list rather than anywhere I'd look for them.
- **Know whether my MySQL app has a path forward.** "both databases Prisma ORM supports today" is the only signal, and it's dropped in a transitional sentence.

The page is billed as the four building blocks. It covers three of them well and the fourth — relations — mostly by pointing elsewhere. That's defensible for a hub page. The unforced errors are the undefined new vocabulary ("contract", "emit", "ORM client"), the `Numeric` type that isn't in its own type table, and the enum paragraph that describes syntax instead of printing it.