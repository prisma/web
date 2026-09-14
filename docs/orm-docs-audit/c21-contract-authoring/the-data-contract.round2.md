Read once, as a Prisma 7 user. Report below.

## Sentences I could not restate after one reading

**Line 47** — "The contract also identifies its own exact version. `prisma contract emit` computes hashes from the contract and writes them into `contract.json`. [`prisma db sign`](/cli/db-sign) checks that your database satisfies the contract, then records those hashes in the `prisma_contract.marker` table, which it creates in your database. Run it once the database matches the contract, after you have applied your migrations."

Four separate ideas in a row, and two things stopped me. "identifies its own exact version" — version of what? There is no version number here, only hashes, so the word "version" points at something I cannot find. And "Run it once the database matches the contract" is ambiguous: "once" could mean "one single time" or "as soon as". I read it both ways and could not settle it. Plainest wording I would have understood: "`prisma contract emit` writes a hash of your contract into `contract.json`. After you apply your migrations, run `prisma db sign`. It checks the database, then stores that hash in a table it creates called `marker` in the `prisma_contract` schema. Run it again every time the contract changes."

**Line 47** — "Your app then logs a warning when the database stops matching."

Logs where? At startup, on the first query, on every query? I cannot picture when I would see this, so I cannot tell whether it is useful to me or noise.

**Line 45** — "Prisma ORM keeps that description in the open."

"in the open" is a metaphor doing the work of the real claim. I think it means "in plain files you can read", which the next sentence says anyway. Plainest wording: delete the sentence.

**Line 45** — "so you can read them in a code review, hash them, and hand them to tools and coding agents."

"hash them" stopped me. Why would I hash a file, and what would I do with the hash? The page already says Prisma computes hashes itself (line 47), so this reads like a second, unrelated hashing that is never explained.

**Line 84** — "Do not keep a `contract.prisma` and a `contract.ts` in the same project, so the two can never disagree."

The "so" clause makes it sound like keeping both causes the guarantee. I had to re-read to work out the reason is "otherwise they could disagree". Plainest wording: "Keep only one. If you had both, they could describe different things."

**Line 93** — "[`type` blocks](/…), each a structured value stored inside its parent row with no table of its own"

I do not know what this actually becomes in my Postgres database. A `jsonb` column? A composite type? "Structured value stored inside its parent row" tells me the idea but not the thing.

**Line 39** — "In Prisma ORM, the **contract** is what you write in your code, and the **schema** is your database's actual structure."

I could restate it, but it contradicts the rest of the page as I read it. The file is called `contract.prisma`, the language is "PSL, the Prisma schema language" (line 11), and the card on line 118 says "Write the contract as a Prisma schema file." So "schema" is used for my authored file three times after the note tells me it means the database. That left me unsure which meaning applies where.

## Words and phrases I had to guess

- **"the data contract"** (line 9) — guessed: just the new name for `schema.prisma`. The page confirms this later, but the title made me expect a new concept.
- **"extension packages"** (lines 64, 94) — guessed: npm packages that add extra field types, since pgvector is the example. Never defined, and the only link is to a PSL anchor.
- **"pgvector"** and **"`Vector`"** (lines 45, 94) — guessed: a Postgres extension for vector columns. Fine if you know it; nothing on the page says what it is.
- **"`prisma_contract.marker` table"** (line 47) — guessed: a table named `marker` in a schema named `prisma_contract`. The dotted name is never explained, and it matters because it is a table appearing in my database.
- **"the migration tooling"** (line 76) — guessed: some `prisma migrate` command. The page never names one.
- **"named types"** (line 92) — guessed: aliases for scalar types. No idea, really.
- **"the typed contract builder"** (line 125) vs **"TypeScript builder"** (line 82) — guessed these are the same thing.
- **"PSL"** — expanded once on line 11 as "the Prisma schema language", then used as an unexpanded acronym. I coped, but it is the only expansion.

## "So what do I actually type?" — unanswered

1. **Migrations.** The page tells me three times that migrations are planned from the contract (lines 33, 47, 76) and tells me to run `db sign` "after you have applied your migrations". It never gives the migration command. This is the single biggest gap: the page describes the workflow but omits its middle step.
2. **The everyday loop.** I wanted a numbered list: edit contract → `prisma contract emit` → migrate (?) → `prisma db sign`. I had to assemble that from lines 47, 66, and 76, and I am still not sure `db sign` is needed after every change or only the first time.
3. **Starting a project.** Line 64 says `prisma orm init` writes the config, the contract, and `db.ts`. Line 80 says `npm create prisma@latest` scaffolds PSL, and line 101 says projects created that way get the skills. Two different starting commands, never compared. I do not know which one to run.
4. **Using `db`.** Line 72 says "`db` is the client you create once in `src/prisma/db.ts`" and then three bullets about what `db` does internally. It never shows the import line or a single query. After reading a page about the thing that types my queries, I cannot type one.
5. **Anything but PostgreSQL.** The only database package named is `@prisma/orm-postgres` (lines 55, 64). I use MySQL. The page does not say what I import, and does not say Postgres is just the example.
6. **TypeScript authoring.** Line 64 says point `contract` at `./src/prisma/contract.ts`, and line 82 says use the builder. There is no fragment of `contract.ts` anywhere, so I cannot tell what the mode even looks like before clicking away.
7. **`// use prisma-8` on the TypeScript side.** Line 31 says "The first line of every `.prisma` contract" must be that comment. Does `contract.ts` need something equivalent? Unanswered.
8. **The two config functions.** Line 54-55 imports both `definePrismaConfig` and `ormConfig` from two packages. I would not have guessed that shape, and nothing says why there are two or when the inner one changes.
9. **`prisma db sign` cadence.** After I change the contract and migrate, do I re-sign? Line 47's phrasing does not settle it.

## Where it explains the internals when I wanted instructions

- **Line 72-76**, the three bullets under "From there, the rest of the toolchain takes over." All three describe what `db` and the tooling do to the files: "`db` loads `contract.d.ts`", "`db` reads `contract.json` and compares its hashes with the record `prisma db sign` wrote". None of it changes anything I type. This is the section where I expected to learn how to use `db`.
- **Line 45**, the whole "Why a contract" opening. "Prisma ORM 7 compiles your `schema.prisma` into generated client code. The description of your data is in there, but only the generated client can read it." This is a design rationale. I came to find out how to author the file.
- **Line 31**, the language-server detail: "the Prisma language server only reports problems, autocompletes, and formats files that start with it". The instruction is "put `// use prisma-8` on line one." The mechanism behind editor support is more than I needed, and the `prisma-next` history sentence is about a release candidate I never used.
- **Line 47**, hash computation and the marker table. What I need is "run `prisma db sign` after migrating". The hashing mechanism is the answer to a question I did not ask.

## Could I do what the page is for, after one reading?

Partly. I could copy the `contract.prisma` example, copy `prisma.config.ts`, and run `npx prisma contract emit`. That is real.

What I would still not know:

- How to change my database after I change the contract. No migration command appears on the page.
- Whether to start with `prisma orm init` or `npm create prisma@latest`.
- What to import or query with. I never see `db` used.
- What to do on MySQL or SQLite.
- Whether `prisma db sign` is a one-time setup step or part of every change.
- What `contract.ts` looks like, so I cannot decide between the two authoring modes the page spends a section comparing.

The page succeeds at telling me what the contract *is*. It does not get me through one full change to my data model.