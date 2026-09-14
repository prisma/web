Read once, top to bottom, as someone coming from Prisma 6.

## Sentences I could not restate after one reading

**1. Line 13, the `contract.json` row**

> "The machine-readable contract: models, how they are stored, which database features they need, and the hashes"
> Read by: "`db`, `prisma db sign`, `prisma db verify`, and `prisma migration plan`"

Three of those four are commands I type. `db` is not. I read the whole row assuming `db` was a fourth command before line 16 told me it is a client object. Put line 16 before the table, or write "your `db` client".

**2. Line 36 — one paragraph, six separate facts**

> "The hashes are how Prisma ORM connects the contract to a live database. `npx prisma db sign` checks that the database satisfies the contract, then records `storageHash` and `profileHash` in a table it creates called `prisma_contract.marker`. You never write to that table yourself. Run `db sign` when the live database already matches the contract, for example after `prisma contract infer` on an existing database, or after a deployment applied the changes. `npx prisma db verify` compares the contract you hold against that record and against the live schema, and fails when they disagree."

What stopped me: two new commands, a new table, a third command (`contract infer`) I have never heard of, and a conditional rule about when to run `db sign`, all in one block. I also could not work out whether `db sign` is something I run routinely or only in the two listed situations. Plainer: split it. "`prisma db sign` records the hashes in the database. Run it after X or after Y. `prisma db verify` compares them later and fails if they differ."

**3. Line 40**

> "Each model's own `storage` block joins the two."

"Joins" how? I had to scroll to the JSON and work out from `"storage": { "fields": { "email": { "column": "email" } } }` that it means "maps each field to its column". Say that.

**4. Line 107**

> "**`roots`**: the table name of every model, so the query APIs know what to call each one."

This contradicts the JSON directly above it. In the JSON, `roots.user` has value `{ "model": "User", "namespace": "public" }` — the value is the *model* name, and `user` is a key. Is `user` the table name or a lowercased alias? The `storage` section separately says `"table": "user"`. After one reading I do not know whether `roots` holds table names, lowercased model names, or something else.

**5. Line 110**

> "They are not column defaults in the database, so a write that does not go through Prisma ORM gets whatever the column itself defaults to."

I can restate this, but it is the single most surprising behaviour change from Prisma 6 on the page and it is the last clause of a bullet. In Prisma 6 I thought of `@default(uuid())` as belonging to the schema. "If something else writes to this table, it will not get a UUID" deserves its own sentence, or a warning.

**6. Line 137**

> "Because the hash string is part of the type, files from two different runs of `npx prisma contract emit` do not type-check against each other."

Two files from two runs — which two? I eventually decided it means "a `contract.json` from one run and a `contract.d.ts` from another". The next sentence says that, so the first one is a harder restatement of the second. Cut it.

**7. Line 155**

> "Before its first query, `db` reads the record `prisma db sign` wrote in the database and compares it with the contract's hashes. If they do not match, it logs a warning and runs the query anyway."

Not the wording, the gap: what if `db sign` was never run and there is no record? Does it warn on every app start? I do not know after one reading.

## Words and phrases I had to guess

- **"contract"** — the whole page rests on it and never defines it. I guessed: the new name for `schema.prisma`, plus type information. The link on line 9 goes elsewhere.
- **"artifact"** (`metaTitle`, the URL, the heading "How the application consumes the artifacts") — guessed: "generated file". The word never appears in the body text as a defined thing.
- **"codecId"**, `"pg/text@1"` — line 108 says it is "the PostgreSQL type plus a version". So what is a codec? I guessed: the thing that converts a database value to a JavaScript value. Never stated.
- **"namespace"** — I guessed it means "PostgreSQL schema", which line 40 half-confirms, but then "On MongoDB it describes collections" leaves what a namespace is there unsaid.
- **"extension pack"** (lines 111, 112) — guessed: an npm package adding types and database features. "composed in your project" — I guessed "installed and listed in config".
- **"`type` block in your contract"** (line 120) — guessed: a reusable struct in PSL, like `type Address { ... }`. Never shown on this page, yet `AddressOutput` is the example.
- **`"returning": true`** (line 99) — guessed: PostgreSQL `RETURNING`.
- **"skills"** (line 168) — guessed: prompt files for a coding agent.
- **"`profileHash`: The database this contract targets, and whether it is SQL or MongoDB"** — I guessed "profile" is just a name for that pair. Fine, but the word does nothing.
- **"`prisma_contract.marker`"** — guessed: a table called `marker` in a schema called `prisma_contract`.

## "So what do I actually type?" and the page does not say

- **Where does `capabilities` come from?** Line 111: "from any extension packs named in your config". Which config file? What does the entry look like? No file name, no example, no link.
- **Do I run `prisma db sign` on a brand-new project?** Line 36 lists two situations (after `contract infer`, after a deploy). Line 176 says to use `prisma db init` for a fresh database. Whether `db init` signs for me is not stated.
- **Where do I put `prisma db verify`?** Line 155 says run it "when you need the check to fail instead" — instead of a startup warning. In CI? A start script? The Version Control section gives a CI snippet for `contract emit` but not for `verify`.
- **What do I do with `StorageHash`, `ProfileHash`, `FieldOutputTypes`, `FieldInputTypes`?** They are listed as exports with no example of importing or using one. `FieldOutputTypes` gets "keyed by namespace and model name" and nothing else.
- **How do I fix a mismatch?** If `db` warns at startup that hashes differ, or `db verify` fails, the page never says which command repairs it.

## Places explaining how it works inside when I wanted to know what to do

- **"Inside `contract.json`", lines 38–112.** Sixty lines of JSON plus seven bullets explaining every section of a file I was told on line 18 never to edit. Nothing in this section tells me to do anything. The parts I would actually use — that `db.sql.public.user` is keyed off `roots` and `db.orm.public.User` off the model name — are buried in the `roots` bullet.
- **"The content hashes", lines 26–36.** The section opens with "You never compute or compare them yourself" and then gives me a three-row table of hash names and what each covers. If I never touch them, the table is internals. The useful part is the one paragraph about `db sign` and `db verify`.
- **Line 137:** "`CodecTypes`, `StorageHashBase`, and `ProfileHashBase` are helper types the file declares for itself. You never write them." Telling me the names of three things I must never use is internals.
- **Line 155:** "The import path `./contract.d` is written that way on purpose. It is not a typo, and TypeScript resolves it to `contract.d.ts`." This one earns its place — I would have "fixed" it.

## Could I do what the page is for after one reading?

The page is explaining two generated files, not walking me through a task, so partly yes. I came away knowing: I edit the source, not these two files; I run `npx prisma contract emit` after every source change; I commit both files; and I can add the two-line CI check on lines 162–163. That is real and I could act on it today.

What I still would not know:

- What a "contract" is, in one sentence. The page assumes it.
- The order of operations on a real project. `contract emit`, `db init`, `db sign`, `db verify`, `contract infer`, `migration plan` — six commands are named and the page never places them on a timeline.
- Whether my Prisma 6 habits still apply. `PrismaClient` is now `db`; `@default(uuid())` is now applied by the client, not the column. Both changes are mentioned in passing. Nothing else is mapped.
- What a codec, an extension pack, or a `type` block is, or where the config file that names extension packs lives.
- What to do when the hash check fails.

Biggest single fix: define "contract" in the first paragraph, and move the six commands into one short ordered list, before the tour of the JSON.