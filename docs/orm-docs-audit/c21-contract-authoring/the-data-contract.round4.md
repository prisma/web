Read once, top to bottom, as a Prisma 7 user who has never seen version 8.

## Sentences I could not restate after one reading

**1.** "`npx prisma orm init` writes the first line, `// use prisma-8`, into every `.prisma` contract. The CLI works without that line, and the Prisma VS Code extension needs it to recognize the file."

What stopped me: the second sentence says two opposite-sounding things joined by "and". Is the line optional or not? I could not tell whether I must type it if I create the file by hand.

Plainer: "The CLI does not need this line. The VS Code extension does, so keep it."

**2.** "Think of it as a `package-lock.json` for your data: a file in version control that records exactly what your application expects from its database."

What stopped me: `package-lock.json` is generated and I never edit it. The contract is a file I write by hand. The comparison told me the opposite of what I had just read. I still do not know which file the comparison points at — the contract, or `contract.json`.

**3.** "In Prisma ORM, the **contract** is what you write in your code, and the **schema** is your database's actual structure. Some tools use these words the other way around. The language you write the contract in keeps the older name: it is PSL, the Prisma Schema Language, the same language as `schema.prisma`."

What stopped me: three redefinitions of two words in four lines, plus an unnamed "some tools". I finished the note less sure of the vocabulary than when I started. The page already said "the same language as `schema.prisma`" in the first paragraph, so the note repeats it without adding anything.

**4.** "`npx prisma contract emit` also writes a [hash](...) of the contract into `contract.json`, and `npx prisma db migrate` stores the same hash in your database. The first time your client `db` runs a query, it compares the two hashes and logs a warning if they differ."

What stopped me: too many ideas in one place — two commands, two storage locations, a runtime comparison, a warning, and a link out. I also do not know what "hash" means here in practice: a fingerprint of what exactly? The contract source, or `contract.json`?

**5.** "Run [`npx prisma db sign`](/cli/db-sign) only to record the hash without applying anything, for example after `npx prisma contract infer`, when the database already matches the contract."

What stopped me: `db sign` and `contract infer` are both used before either is explained. `contract infer` is only explained further down, at line 83. "Sign" is never explained at all — I guessed it means "stamp the hash into the database".

**6.** "The database settings come from the `defineConfig` export from your database package, imported here as `ormConfig`."

What stopped me: I had to go back to the code block and match `defineConfig as ormConfig` before the sentence made sense. Say it in the direction the reader reads: "`@prisma/orm-postgres/config` exports `defineConfig`. The example renames it to `ormConfig` on import."

**7.** "`db.orm` holds your models by model name. `public` is the PostgreSQL schema, the namespace your tables are in, unless you configured a different one."

What stopped me: `await db.orm.public.User.all()` has four segments and the page explains two of them. What is `.orm`? Why is it there, and is there ever anything else at that position? I guessed it is a fixed namespace.

## Words and phrases I had to guess

- **"data contract"** — guessed: the new name for `schema.prisma`. The page confirms this but never says plainly "this is the file you used to call your schema."
- **"emit"** (`prisma contract emit`) — guessed: it means generate, like `prisma generate` in version 7. Nothing says that.
- **"hash"** — guessed: a fingerprint used to detect drift between contract and database.
- **"sign"** (`prisma db sign`) — guessed: write the hash into the database without running a migration.
- **"infer"** (`prisma contract infer`) — guessed: the new `prisma db pull`. Explained one section later than first used.
- **"capabilities"** / "database features they need" — guessed: things like extensions or column types the database must support. Only a link, no one-line definition.
- **"named types"** — "reusable aliases for a type and its storage details". I do not know what "storage details" means as something I would type.
- **"`type` blocks"** — the link text is `#value-objects` but the page never uses the phrase "value object". I guessed the two are the same thing.
- **"extension packages"** — explained, but only after the term is used twice.
- **"artifact"** — never used in the prose, but the anchor is `#two-authoring-modes-one-artifact` and a card says "the contract artifact". I guessed it means `contract.json` plus `contract.d.ts`.
- **"migration plan"** vs **"db migrate"** — guessed: plan writes the SQL, migrate runs it. The page says this, but "works out what the database needs" is vague about what lands on disk.

## Places I asked "so what do I actually type?" and got no answer

1. **Where does `DATABASE_URL` go?** The config imports `"dotenv/config"` and reads `process.env["DATABASE_URL"]`. The page never says to create a `.env` file or what to put in it. This is the first thing I would hit.

2. **The three commands take no arguments here.** In version 7 I named my migrations. Does `npx prisma migration plan` prompt me for a name? Take a `--name`? The page shows a bare command and I would not know.

3. **The very first migration.** Do the same three commands work on an empty database, or is there a different first-run path?

4. **`npx prisma db sign`** — no flags, no example, no output shown. Same for `npx prisma db verify` and `npx prisma contract infer`.

5. **Importing `db` from anywhere else.** "From a file directly inside `src/`, import it with `import { db } from "./prisma/db"`." I do not work only in files directly inside `src/`. Nothing tells me the alias or path to use from `src/routes/api/users.ts`.

6. **Switching authoring modes.** "Do not keep both a `contract.prisma` and a `contract.ts`." So how do I move from one to the other? Delete the old file and change the config string? The page warns me off the wrong thing without telling me the right steps.

7. **Seeing the hash mismatch.** "logs a warning if they differ" — what does the warning look like, and where does it appear? Without that, I will not recognize it when it happens.

8. **Creating data.** The only query shown is `.all()`. This page is my entry point and I finish it able to read rows but not write one. A link to "Reading data" is there; nothing covers writing.

9. **`npx prisma orm init` in an existing project.** It "writes `prisma.config.ts`, the contract file, and `src/prisma/db.ts`". What if I already have a `src/prisma/` directory or a different layout? Does it overwrite?

## Places the page explains the insides when I only wanted to know what to do

- **The whole "Why a contract" section.** "Your contract compiles to two plain files you can open and read" and the paragraph on hash storage. I am trying to get started. Where the hash is written and when it is compared is machinery, not a task. The one thing I needed from it — run `prisma db verify` in CI to fail the build — is the last clause of the second paragraph.

- **"On PostgreSQL each one is stored in a single `jsonb` column."** Storage implementation for a feature I have not been shown how to write.

- **The "Contract vs. schema" note.** It tells me that other tools use the words differently and that PSL kept its old name. Neither changes anything I type.

- **"The same source always produces the same two files"** — this is a property of the compiler. It matters to the toolchain, not to me on first read.

## Could I do what the page is for?

The page is an orientation: what the contract is and how to get one working. **Partly.**

What I could do after one read: run `npm create prisma@latest -- my-app`, recognize `contract.prisma` as my old `schema.prisma`, write a model, and run the three commands.

What I would still not know:

- Where my connection string lives on disk. This blocks me immediately.
- Whether `// use prisma-8` is required.
- What `emit`, `sign`, `infer`, and `verify` each do well enough to choose between them. I would run all three commands every time and hope.
- Why `db.orm.public.User` has the shape it does, so I could not guess the path for a model in a non-`public` schema even though the page mentions those exist.
- How to write data at all.
- How to get from my existing Prisma 7 project to this, since the page sends me to a different guide at exactly the point I was reading for.

The biggest single problem: the terms **contract**, **schema**, **artifact**, **hash**, and **emit** all arrive in the first two screens, and the page defines them by relating them to each other rather than to the file I would open or the command I would type.