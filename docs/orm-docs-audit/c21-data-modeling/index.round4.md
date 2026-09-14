Read once, top to bottom, as a Prisma 6 user who has never seen v8.

## Sentences I could not restate after one reading

**Line 13** — "In Prisma ORM, you define this structure in your contract, the `contract.prisma` file that replaced `schema.prisma`."
Stopped by "your contract." The page uses the word as if I should already know why a schema file is now called a contract. Plainest version: "Prisma 8 renames `schema.prisma` to `contract.prisma`. It still holds your models." Also: four separate facts land in one paragraph (rename, types/migrations derived from it, no `datasource`/`generator`, connection string moved). I had to reread to separate them.

**Line 151** — "Where a row names a PostgreSQL type such as `numeric`, that is the column type on PostgreSQL."
Abstract and self-referential; I read it three times. Plainer: "The PostgreSQL names in the table are the column types Prisma creates."

**Line 157** — "Filtering on a `Jsonb` field is whole-value equality only: you can ask whether the column equals a given document, not whether a key inside it matches. A `Json` field offers no comparison at all in the ORM filter."
"the ORM filter" — I do not know what that names. The `where` clause? A specific API? Two types, two different restrictions, and a workaround, all in one paragraph.

**Line 171** — "`@@type(\"pg/text@1\")` says how the values are stored, here as PostgreSQL `text`."
This explains the half I could already guess and skips the half I could not: what `pg/` and `@1` mean, whether it is required on every enum, and what else I am allowed to put there.

**Line 204** — "Widening a type later is a migration, so picking the wider type now saves you one."
Compressed to the point of riddle. Plainer: "Changing `Int` to `BigInt` later requires a migration. Pick `BigInt` now and you skip it."

**Line 206** — "Mark a field optional (`?`) only when \"absent\" means something different from a sensible default. A required field with a default is often the clearer model."
I understand the words and cannot picture the case. No example. Everything else in this section has one.

**Line 212** — "Two kinds of field describe a relation, the link field and the relation field. The model that holds the link needs both of them."
Comma splice, and "the model that holds the link" arrives before I know what "the link" is. Plainer: "A relation uses two fields. One stores the other record's id. The other is typed as the other model and exists only so Prisma can follow the relation."

**Line 236** — "List fields on both sides with no such model are rejected, so write the model out as many-to-many shows."
Rejected by what, and when — at `contract emit`? I also had to work out on my own that this means implicit many-to-many (`posts Post[]` / `tags Tag[]` with no join model) is gone, which is a significant break from what I have been writing for two years. The page never says so.

## Words and phrases I had to guess

- **"contract"** — guessed: just the new name for the schema file, with no behavioral meaning. Still not sure that guess is right, because the word is doing a lot of work (`prisma contract emit`).
- **"link field"** (line 214) — guessed: what I have always called the relation scalar field, e.g. `authorId`. The page never says these are the same thing.
- **"the ORM filter"** (line 157) — guessed: the `where` argument in queries.
- **"reference tables"** (line 63) — guessed correctly from the gloss that follows, but it is stated before the gloss.
- **"polymorphic collections"** / **"polymorphic relations"** (lines 241, 254) — guessed: some way to point at more than one model. Appears only in link text, never explained.
- **"`pg/text@1`"** (line 165) — guessed: PostgreSQL's `text` type, version 1 of some mapping registry. No idea what the `@1` is for.
- **"Prisma ORM skills"** (line 245) — guessed: markdown instruction files a coding agent reads.

## Where I asked "so what do I actually type?"

1. **Line 13, the connection string.** "the connection string is in `prisma.config.ts` instead." I have no idea what that file looks like. This is the single thing that stops me writing a working project, and the page moves on. The "complete contract" link may have it, but the sentence does not say so.
2. **Line 51, the MongoDB id.** `id ObjectId @id @map("_id")` — no `@default`. In v6 I wrote `@default(auto())`. Do I add a default or not? "Omit `id` when you create a document. MongoDB assigns it." implies not, but does not say it.
3. **Line 155, the Temporal polyfill.** "add `import \"temporal-polyfill/full/global\"`" — add it where? Top of every file? One entry file? A Next.js `instrumentation.ts`?
4. **Line 153, `Decimal` arithmetic.** "A `Decimal` value reaches your code as a string" — so how do I add two of them? The money advice below implies I should not, but never says what to do if I must.
5. **Line 234, one-to-one.** Prose only. Every other relation shape gets a code block or a link. I wanted the four lines of `contract.prisma`.
6. **Line 165, enums.** Is `@@type` mandatory? What do I write for MongoDB? The block shown would be my template and I do not trust it.
7. **Line 256, the commands.** Three commands in one bullet with no ordering or "run this when":
   `npx prisma contract emit`, `npx prisma migration plan --name <name>`, `npx prisma db migrate`. I also cannot tell whether `contract emit` is what replaced `prisma generate` — `generate` is never mentioned, and I have typed it for two years.
8. **Line 143, `Decimal` vs `Numeric(10, 2)`.** One table row, two spellings. Is `Numeric` a distinct type or `Decimal` with arguments? Line 153 implies the latter; the table implies the former.

## Where it explains the insides when I wanted instructions

- **Line 40** — "Prisma ORM accepts a model without one, but `update` and `delete` on that model fail at runtime, because they need a primary key or a unique field." Two clauses about validator behavior for one instruction: give every model a primary key. The runtime detail is fine as a trailing note, but it takes over the paragraph.
- **Line 106** — "it leaks row counts and invites guessing if you expose it in URLs." Reasonable, but combined with line 116's "the value tells nobody how many records you have," the same point is made twice in ten lines.
- **Line 116** — "`@default(uuid())` and `@default(uuid(4))` both give you a random UUID." I did not ask which spellings are equivalent. I asked which one to write. Say "write `@default(uuid(7))`" and drop the equivalence.

## Could I do what the page is for, after one reading?

Partly. The page is an overview, and I came away able to write a model, choose `@id` versus `@@id`, pick between a natural and a surrogate key, pick scalar types, and write a one-to-many relation. That part works.

What I still would not know:

- How to get from this page to a project that runs. The connection string moved to a file the page names once and never shows. Without it nothing I wrote here connects to anything.
- What `contract` means beyond a filename, and therefore what `npx prisma contract emit` does.
- Whether `prisma generate` still exists.
- How to write an enum I can trust, because `@@type("pg/text@1")` is unexplained.
- That implicit many-to-many is gone — I inferred it from "are rejected," and I would have written `Post[]` / `Tag[]` on both sides out of habit and been surprised.
- That MySQL is no longer supported until line 22, which is one sentence deep in a section about building blocks. For a v6 user on MySQL this is the most consequential sentence on the page and it is not treated as such.

One more, as an existing user: line 13 points to "what changed" for people "coming from Prisma ORM 7." I am coming from 6. The page does not say whether that link covers me.