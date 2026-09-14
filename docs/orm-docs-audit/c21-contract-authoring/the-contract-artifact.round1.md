Reader review of `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/apps/docs/content/docs/orm/contract-authoring/the-contract-artifact.mdx`

## Sentences I could not restate after one reading

**Line 9** — "writes `contract.json` and `contract.d.ts` beside the source by default"
Stopped by "the source." Which file is the source? A `.prisma` file? A `.ts` file? Where does it live? The whole page hangs off a noun it never names. Plainer: "writes both files next to your schema file (`prisma/schema.ts` or `prisma/schema.prisma`)."

**Line 13** — "Read by `db`, the migration tooling, the database checks, and anything else that needs to read your schema"
`db` appears here as if I already know it. I guessed it was the client object, and only got confirmation 120 lines later at line 133. "The database checks" is also vague — which checks? Name the commands.

**Line 30** — "and the value sets behind enums"
"Value sets behind enums" made me stop. I guessed it means the list of allowed values for each enum. Say that.

**Line 32** — "`profileHash` | The database this contract targets, and its family"
I do not know what "family" means. I guessed from `targetFamily: "sql"` further down that "family" means SQL vs MongoDB, but the table asks me to understand it 6 lines before the example shows it.

**Line 34** — "[`prisma db sign`](/cli/db-sign) checks that the database satisfies the contract, then records `storageHash` and `profileHash` in a small table it creates in the database."
Two problems. "Sign" made me expect cryptographic signing; it is actually "stamp the hashes into a table." And "a small table it creates" — what is it called? Will it show up in my migrations? Does it need permissions? Nothing.

**Line 34** — "`db` makes the same comparison before its first query, but it logs a warning and carries on."
I could restate it, but it is said again in full at line 145. One of the two is redundant.

**Line 38** — "The contract separates what your application models from how it is stored."
"What your application models" reads as a noun phrase on first pass ("the things your application models") before I realised "models" is the verb. Rewrite: "The contract keeps your application's view of the data separate from the way the database stores it."

**Line 38** — "On PostgreSQL the namespace is the schema, `public` unless you set one."
Set one where? In PSL? In TypeScript? In the connection string? The page does not say, and does not link anywhere that does.

**Line 105** — "**`roots`**: each table name mapped to the model stored in it. The SQL query builder is keyed by those table names, as in `db.sql.public.user`, and the model name is what `db.orm.public.User` uses."
Too many new things in one bullet: `roots`, "SQL query builder", `db.sql.*`, `db.orm.*`. None of `db.sql` or `db.orm` has been introduced anywhere on this page, and neither is linked. I could not restate what `roots` is *for* — only what it contains.

**Line 106** — "its type id, such as `pg/text@1`, the PostgreSQL type plus a version, always `@1` today"
The prose calls it a "type id" but the JSON key is `codecId`. I had to work out these are the same thing. And "always `@1` today" left me wondering whether I ever need to care.

**Line 109** — "collected from the adapter for your database and any extension packs when you run `prisma contract emit`"
"Extension packs" is new and undefined and unlinked. I guessed it means optional plugin packages. Also, the bullet covers both `capabilities` and `extensions` but only explains `capabilities`; `extensions: {}` is never described.

**Line 113** — "It exports the contract type, branded hash types matching `contract.json`, and input/output types for every model"
"Branded hash types" stopped me cold. I guessed, from the code block, that the hash string is baked into the type so two different contracts cannot be mixed up. Line 129 then explains it properly — so the jargon at 113 buys nothing. Also "the contract type" is unnamed here; I only learn it is called `Contract` from the import on line 137.

**Line 129** — "TypeScript catches a mismatched contract before `prisma db verify` has to."
Restatable, but I do not know what "mismatched" means in practice — I regenerated one file but not the other? I upgraded the CLI? What actually triggers this in a real day?

**Line 149** — "A CI job can enforce this by running the command and failing if the working tree changes."
I know what it means, but not what to write. See below.

## Words and phrases I had to guess

- **"contract"** — the central word of the page and of the URL, never defined here. I guessed it means the whole schema definition, compiled. If there is a page that defines it, this page should link to it in the first sentence.
- **`db`** — guessed: the client instance, the Prisma 6 `PrismaClient` equivalent.
- **"sign" / "verify"** — guessed: record the hashes, and check the hashes.
- **"family"** — guessed: SQL vs MongoDB.
- **"codecId"** — guessed: an identifier for how a value is converted between the database and TypeScript.
- **"branded"** — guessed: a type that carries a literal string so mismatches fail to compile.
- **"extension packs"** — guessed: optional add-on packages.
- **"roots"** — guessed: the entry points you address models through.
- **`CodecTypes`, `StorageHashBase`, `ProfileHashBase`** — appear in the excerpt with no explanation. Guessed they are internal helper types I never write myself.
- **"the database checks"** (line 13) — guessed: `prisma db verify`.

## Places I asked "so what do I actually type?"

1. **Line 9.** What is the command's argument, and where do I run it from? The page says "beside the source by default" — implying a flag exists to change it — and never shows the flag or the default path.
2. **Line 38, namespaces.** "`public` unless you set one." How do I set one? No syntax, no link.
3. **Lines 135–143, `db.ts`.** This is the one code block I would actually copy, and it is incomplete as a mental model: `postgres<Contract>({ contractJson })` takes no connection string and no URL. Where does the database URL come from? Environment variable? A default name? I would get stuck here.
4. **Line 137.** `import type { Contract } from "./contract.d";` — importing a path ending in `.d` is unusual enough that I would assume it was a typo and change it. If it is deliberate, say so.
5. **Line 113, input/output types.** I am told input and output types exist for every model. What are they named? I can infer `AddressOutput` from the example, so presumably `AddressInput`, but I am guessing at the API surface I have to type every day.
6. **Line 149, the CI job.** "Running the command and failing if the working tree changes" — show it. Two lines would do: `prisma contract emit` then `git diff --exit-code prisma/`.
7. **Line 34.** When do I run `db sign`? Once at setup? After every migration? The page tells me what it does, never when I do it.

## Places that explain internals when I wanted to know what to do

- **The whole "The same source always produces the same two files" section (lines 18–22).** Byte-identical output, fixed key order, normalized values — that is how the tool works. What I need to act on is one sentence: do not read `process.env`, `Date.now()`, or random values in your schema source. The section links elsewhere for the actual rules, so the explanation here is background I cannot use.
- **"The content hashes" (lines 24–34).** Three hashes, what each covers, what makes each change. As a reader I do not compute or compare these; the tool does. The actionable part is the last paragraph. The table is the tool's internals.
- **Line 108** — "These are not column defaults in the database." A true internal detail, but it raises a practical question it does not answer: if I insert with raw SQL, do I get no default at all?
- **Line 20** — "Keys are written in a fixed key order and values in a normalized form, which is what lets you read the files in a code review and hash them." The justification chain (fixed order → hashable) is engine reasoning. "You can read these diffs in a code review" is the part that matters to me.

## Inconsistencies that cost me a re-read

- The JSON block is titled `prisma/contract.json`, but `db.ts` imports `./contract.json` from `src/prisma/db.ts`, so the file is at `src/prisma/contract.json`. Two different locations for the same file in the same page.
- The `contract.json` example is `User` and `Post`. The `contract.d.ts` example is `Address`, with fields that appear nowhere else. I spent a moment looking for the `Address` model before concluding it is an unrelated excerpt.
- Line 105 refers to `db.sql.public.user` and `db.orm.public.User` — two APIs introduced in a parenthetical, in a bullet about a different topic.

## Could I do what the page is for?

The page's job is to tell me what is in these two files and what reads them. Partly, yes: I could open a `contract.json` in a code review and roughly follow `domain` versus `storage`, and I would know not to hand-edit either file and to commit both.

What I would still not know after one reading:

- What "contract" means as a concept, which is the page's own subject.
- Where the source file lives, what it is called, and what `prisma contract emit` actually takes as arguments.
- How to finish `db.ts` — specifically how the database connection is configured. This is the block I would copy, and it would not work.
- When to run `db sign` versus `db verify` in a real workflow, and what the table `db sign` creates is called.
- What `db.sql` and `db.orm` are, though the page uses both.
- How to set a namespace other than `public`.
- What the input types are called, when the page tells me they exist.