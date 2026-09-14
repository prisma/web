I read the page once, top to bottom, as a Prisma 7 user who has never seen version 8.

## Sentences I could not restate after one reading

**1. Line 30 — the header comment**

> "Start every `.prisma` contract with `// use prisma-8`. Your editor's Prisma support only works on files that have that line."

Two ideas that fight each other. "Start every" reads as a hard requirement. The reason given is only about my editor. So: does the CLI fail without it, or do I just lose syntax highlighting? What is "your editor's Prisma support" — the VS Code extension? Something else? Plainer: "Add `// use prisma-8` as the first line. Without it, the Prisma VS Code extension ignores the file. The CLI works either way." (If the CLI does *not* work either way, say that instead — that is the version I needed and did not get.)

**2. Line 46 — the whole hash paragraph**

> "`prisma contract emit` also writes a hash of the contract into `contract.json`. When you apply a contract change to the database, the command that applies it records that hash in a small table it creates in your database. Before its first query, `db` compares the two and logs a warning if they differ."

Four moving parts in three sentences, and every noun is vague. "the command that applies it" — which command? (I only learn it is `prisma db migrate` thirty lines later.) "a small table it creates in your database" — named what? Do I need to know it exists when I review a migration? "Before its first query" — the first query of what, the process? per connection? "compares the two" — the two hashes, I assume, but "the two" has no clear antecedent because three things were just named. And `db` is used here as if I know what it is; the page does not tell me until line 77.

Plainer: "`prisma contract emit` writes a hash of your contract into `contract.json`. `prisma db migrate` stores the same hash in a table in your database. The first time your app runs a query, Prisma compares the two hashes and logs a warning if they do not match."

**3. Line 63 — the config paragraph**

> "`definePrismaConfig` holds the whole config. `ormConfig` comes from your database package and holds the settings for that database"

`ormConfig` does not exist. The code block imports `defineConfig as ormConfig`. So the prose names a thing that is only a local rename I made up in my own file. I stopped and re-read the import three times to confirm. Say "the `defineConfig` export from your database package, imported here as `ormConfig`."

The same paragraph then packs in: what the two functions do, the three database packages, which one the examples use, two different init commands, and the four things those commands write. That is six unrelated facts in one paragraph. I could not hold them.

**4. Line 75 — signing**

> "so there is no separate signing step. Run [`prisma db sign`](/cli/db-sign) only when the database already matches the contract and nothing needs applying, for example after `prisma contract infer`."

"Signing" is never defined. The page has never used the word before this sentence. I had to guess it means "write the hash into the database table." Also `prisma contract infer` is referenced here but not explained until line 81. Plainer: "`prisma db migrate` records the new hash for you. Run `prisma db sign` only to record the hash without applying anything — for example after `prisma contract infer`, when the database already matches."

**5. Line 77 — `public`**

> "`public` is the PostgreSQL schema, the namespace your tables are in, which is `public` unless you set one."

The callout at line 38 just told me, in bold, that "the **schema** is your database's actual structure." Now "schema" means a PostgreSQL namespace. That is a third meaning for a word the page went out of its way to define. I re-read the callout to check whether I had misunderstood it. The sentence also defines `public` using the word `public` twice. Plainer: "`public` is the PostgreSQL namespace your tables live in. It is `public` unless you configured a different one."

**6. Line 85 — the two-files warning**

> "Do not keep both a `contract.prisma` and a `contract.ts`. If you had both, they could describe different things."

"Could describe different things" tells me a risk, not a consequence. Does the CLI error? Silently use the one in the config and ignore the other? I could not restate what actually happens to me.

**7. Line 94 — `type` blocks**

> "[`type` blocks](/orm/contract-authoring/psl-syntax#value-objects), each a structured value stored inside its parent row with no table of its own."

I understood "no table of its own" and "stored in a `jsonb` column." I did not understand what a `type` block *is for* or how it differs from a model, and the link text says "value objects," a term the sentence never uses.

## Words and phrases I had to guess

- **"the rest of the toolchain"** (line 32) — guessed: the CLI, the client, and my editor. Not stated.
- **"an exact, versioned record"** (line 32) — guessed: versioned as in checked into git, not as in "has a version number." The `package-lock.json` comparison is what let me guess.
- **"named types"** (line 93) — guessed: a reusable alias, from the appositive. Fine, but "reusable aliases for a type and its storage details" is itself guesswork about what "storage details" covers.
- **"capabilities"** — the link at line 44 says "which database features they need" and the card at line 135 says "Supported database features," but the URL is `/capabilities`. Guessed they are the same thing.
- **"extension packages"** (line 65) — the pgvector example saved me. Without it I had nothing.
- **"artifact"** — the section heading anchor and the card at line 128 use "artifact" for `contract.json`. The prose never does. Mild, but I noticed the mismatch.
- **"signing" / `db sign`** — guessed: recording the hash. See above.
- **"logs a warning"** (line 46) — guessed: to stdout, at app startup. Where do I see it?

## "So what do I actually type?"

1. **How does any of this reach my database?** The page tells me to run `prisma db migrate` but never mentions a connection string, `DATABASE_URL`, `.env`, or a `datasource` block. In Prisma 7 the connection lived in `schema.prisma`. The example contract has no datasource block at all. So where does the URL go now — `prisma.config.ts`? An env file? This is the single biggest hole. I could not run the three commands after reading this page.
2. **`npx` or not?** The code block says `npx prisma contract emit`. The prose says "run `prisma orm init`" and "run `npx prisma skills sync`." Inconsistent, so I do not know whether `prisma` is expected on my PATH.
3. **`npm create prisma@latest -- my-app`** — the bare `--` is unexplained and easy to mistype. And I am not told what it produces on disk beyond a list of four files with no directory layout.
4. **Where does `contract.json` go?** "beside the source" (line 75). So `src/prisma/contract.json`. I had to infer that from the config path.
5. **Converting my existing Prisma 7 project.** Line 34 sends me to two other pages. Fine for an overview page, but then line 63 tells me `prisma orm init` "adds Prisma ORM to a project you already have" — which is it for a Prisma 7 project? I would have run the wrong one.
6. **Is the `// use prisma-8` line something the generator writes, or something I type?** Not said.

## Places the page explains internals when I wanted instructions

- **Line 46, the whole paragraph.** I wanted "run these commands and your database stays in sync." I got a mechanism: a hash, a table the tool creates, a comparison before the first query. The one actionable sentence — "To fail instead of warn... run `prisma db verify`" — is buried at the end.
- **Line 44, "In Prisma ORM 7 the same description existed, but only the generated client could read it."** Interesting, changes nothing about what I type.
- **Line 85, "For the same models they write the same `contract.json`."** The useful part is "pick either, it does not matter." The identical-output detail is implementation reassurance.

## Could I do what the page is for?

The page is an orientation page, and on that narrow bar it mostly works. After one reading I can say what the contract is, that it replaced `schema.prisma`, that it compiles to `contract.json` and `contract.d.ts`, that I can write it in PSL or TypeScript but not both, and that the three-command loop is emit, plan, migrate.

What I still would not know:

- **How to point Prisma at my actual database.** No connection string anywhere. This is disqualifying for anyone trying to follow along.
- **Whether `// use prisma-8` is required or cosmetic.**
- **What "signing" is**, so I cannot tell when `prisma db sign` applies to me.
- **What happens if the hashes do not match** beyond "logs a warning" — can I still query? Is my app broken?
- **Which init command my Prisma 7 project needs.**
- **What a `type` block is for**, only where it is stored.

The three-command block at line 69 is the best part of the page. Everything I needed to act on is either in that block or scattered around it in prose; the paragraphs between the blocks are where I got lost.