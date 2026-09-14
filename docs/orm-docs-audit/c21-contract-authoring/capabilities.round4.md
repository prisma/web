Read once, top to bottom, as someone coming from Prisma 6.

## Sentences I could not restate after one reading

**Line 9** — "A feature that is not listed fails right away, with an error that names its key, instead of reaching the database and failing there."
A feature doesn't fail; my code does. And "right away" — right away *when*? At build? At startup? At the call? I only learned the answer two sections later. Plainer: "If you use a feature that is not listed, Prisma ORM raises an error instead of sending the query to the database."

**Line 24** — "A key is written group first, so `pgvector.cosine` under `postgres` is `postgres.pgvector.cosine`."
Written *where*? In the JSON it is not written that way — the JSON shows `"pgvector.cosine"` nested inside `"postgres"`. I eventually guessed you mean "in error messages and in this page's table". Plainer: "Error messages name a key group-first."

**Line 44** — "If your contract uses a feature your database cannot store, `npx prisma contract emit` fails."
This contradicts line 13, which says emit "never connects to your database." So it is not my database deciding, it is my database *package*. I stopped and re-read both lines.

**Line 60** — "That message means the method is not available on the database you are connected to."
Same contradiction, sharper. Nothing so far involved a connection. The capability list came from a package on disk.

**Line 60** — "The error arrives when you call the method, not when you `await` the query, so a test that calls it catches it."
Three ideas in one sentence, and the "so" does not follow on first reading. I think you mean: "You do not have to run the query to get the error, so a test that only builds the query still fails."

**Line 60** — "A value such as `db.contract.capabilities.sql?.lateral` is `true`, `false`, or `undefined` when the whole group is absent."
The grammar breaks. It reads as if all three cases happen when the group is absent. Plainer: "…is `true` or `false`, or `undefined` if the whole group is missing."

**Line 60** — "Your own code can read the same list through `db`, the client you create once in `src/prisma/db.ts`."
`db` and that file arrive as things I am assumed to already have. I have never made one.

**Line 80** — "The check that runs when the contract is built applies on every database, MongoDB included. The keys that methods check at query time exist only on the SQL query builder, which MongoDB does not have."
"The keys that methods check at query time" is hard to parse — keys don't check, methods check keys. Plainer: "The build-time check runs for every database. The run-time check only exists on the SQL query builder, and MongoDB has no SQL query builder."

**Line 84** — "The keys say what your packages support, recorded when you run `npx prisma contract emit`, so the same contract behaves the same way in every environment."
The "so" hides the reason (the list is frozen at emit time and never asks the live database). I had to reconstruct it.

**Line 84** — the whole paragraph. The heading promises "The `capabilities` section and `prisma db verify`", then one sentence mentions `db verify`, then it changes subject to extension packages. It never answers the question the heading raised: does `db verify` tell me my real database is missing something the capabilities claim?

## Words and phrases I had to guess

- **"contract emit"** — guessed: a codegen step like `prisma generate` was in v6.
- **"database package"** — guessed: the v8 replacement for `provider = "postgresql"`.
- **"extension packages"** — guessed: optional npm packages that add features.
- **`@prisma/orm-extension-pgvector/control`** — guessed: the subpath you import for config registration. `/control` is never explained.
- **"target" and "adapter"** — the page tells me both mean the database package. So one thing has three names and I have to carry all three.
- **"group"** — guessed: the top-level object in `capabilities`.
- **"scalar list"** — guessed from `tags String[]` in the same sentence. Lucky.
- **`sql.lateral` / `lateralJoin()`** — guessed: SQL `LATERAL` joins. The table entry "Lateral joins (`lateralJoin()`)" defines the term with the term.
- **"SQL query builder"** — new in v8 as far as I know; guessed it is a raw-ish query API.
- **"the first migration the package ships"** — guessed: installing the npm package puts a migration file in my project.
- **`db.contract`** — guessed the emitted contract is readable at run time off the client.
- **`db verify`** — guessed: compares live schema to contract.
- **"skills sync", "the `prisma-8` skill"** — guessed: files for a coding agent.

## "So what do I actually type?" — unanswered

1. **`src/prisma/db.ts`.** Line 60 tells me to read capabilities "through `db`", and never shows me how `db` comes to exist or what to import. The one code sample assumes it.
2. **Reading a three-segment key.** `capabilities.sql?.lateral` is shown. What do I write for `postgres.pgvector.cosine`? `capabilities.postgres?.["pgvector.cosine"]`? The dot inside the key name makes this a real question and the page created it in line 24 and then dropped it.
3. **The pgvector migration.** "the first migration the package ships installs it in PostgreSQL for you" — installs it *when*? Do I run `prisma migrate dev`? Something else? The install instructions stop at `npx prisma contract emit`.
4. **Switching to PostgreSQL.** "change the import and the connection string in `prisma.config.ts`, then set up the new database." There are three imports in the sample above; I don't know which one. "Set up the new database" is an entire unnamed job.
5. **When must I re-run `contract emit`?** The page says "run it again" twice, both times inside a specific recipe. It never states the general rule.
6. **The key in the error vs the key in the table.** The error says `the "scalarList" capability`; the table says `sql.scalarList`. I had to assume those are the same thing.

## Places that explain the machinery when I wanted instructions

- Line 13: "`npx prisma contract emit` never connects to your database. It reads those packages and writes what they report." That is how it works. What I needed was: what do I do when a key is missing.
- Line 24: the whole "written group first" naming rule — internal naming mechanics, given before I have any reason to care.
- Line 52: "In that message, 'target' and 'adapter' both mean your database package." You are explaining the tool's inconsistent internal vocabulary to me rather than the tool using one word.
- Line 60: "The error arrives when you call the method, not when you `await` the query." Implementation timing.
- Line 84: "recorded when you run `npx prisma contract emit`, so the same contract behaves the same way in every environment." Design rationale for a decision I cannot change.

## Could I do what the page is for, after one reading?

Partly.

I could handle both error messages it shows me. If I saw `distinctOn() requires capability postgres.distinctOn`, I would know to rewrite the query or install a package. If emit failed on `tags String[]` under SQLite, I would know to drop the field. That is the page's core job and it does it.

What I would still not know:

- How to write the capability check in my own code, because I do not have `db` and the page did not tell me where it comes from.
- How to check a nested key like `postgres.pgvector.cosine` in TypeScript.
- Whether adding pgvector actually worked — the migration step is asserted, not instructed.
- Whether the list can go stale, and what re-syncs it.
- What `db verify` has to do with any of this, despite a section heading promising to tell me.
- Whether `capabilities` itself can be absent (the sample uses `?.` on `sql` but not on `capabilities`, and I don't know if that is deliberate).

One thing outside the reader's view: the heading anchors are `#what-capabilities-gate` and `#where-capabilities-come-from`. The first uses "gate", which the heading text itself avoided.