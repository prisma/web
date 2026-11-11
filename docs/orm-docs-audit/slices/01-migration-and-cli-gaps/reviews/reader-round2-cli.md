# Round 2 cold read: CLI pages

Persona: developer with two years on the previous major version, no knowledge of the new vocabulary.

## cli/migration-status.mdx

CHANGED marks:

1. CHANGED. "Accepts a contract reference: a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty`." The paragraph under the table explains ref names and `<dir>^`, but never `@empty` on this page. I guessed "an empty database". Also unclear whether `@contract` and `@db`, which appear in the sample output, are accepted here.
2. CHANGED. "With one migration applied and one pending, `npx prisma migration status` prints:" The command has no `--db`, but the output shows a `database:` line. Usage says to pass `--db`. So where did the URL come from? I guessed `prisma.config.ts`, but the page does not say.
3. CHANGED. "`@contract` marks the contract in `contract.json`, and `@db` marks the contract state that the database's marker records. `(db)` is the `db` ref, a file in `migrations/app/refs/` that names the contract state you last applied in development." Too many ideas in two sentences. I cannot tell why `@db` and `(db)` are two different things that sit on the same row, or who writes the ref file. Plainer: "`@db` is where the database is. `(db)` is where the `db` ref file says your development database is. They normally agree."
4. CHANGED. "⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`". Why does the suggestion need `--to`? The Usage of `db migrate` has none. I would wonder whether plain `db migrate` does something different.
5. CHANGED (minor, reading order). The `--space` and `--to` table rows use "contract space" and "ref name". They are explained only after the table. I stopped at the table before reaching the explanation.

EXISTING marks: 3.

## cli/db-migrate.mdx

CHANGED marks:

1. CHANGED. "With `--show`, it also accepts the tokens `@contract` and `@empty`, which the note under this table explains." Why only with `--show`? What happens if I pass `@contract` without `--show`? I guessed an error. Also "the note under this table" is a plain paragraph, so I looked for a note box.
2. CHANGED. "`@db` names the contract state that the database's marker records, and the marker is the row in the database that says which contract state it matches." Two definitions in one sentence. Plainer: "The database stores a marker row that says which contract state it matches. `@db` names that state."

EXISTING marks: 4.

## cli/db-update.mdx

CHANGED marks:

1. CHANGED. "Accepts a contract reference: a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^`." The page says `db update` is for when you "do not need a checked-in migration package". So I did not understand why I would name a migration directory here. I guessed it means "update to the state that migration produces, without running it", but the page does not say.

EXISTING marks: 4.

## cli/db-sign.mdx

No CHANGED mark.

EXISTING marks: 5.

## cli/migration-plan.mdx

CHANGED marks:

1. CHANGED. "`migration plan` is offline, so `@db` and `@contract` are not accepted here." `@db` needs a database, so that follows. But `@contract` is `contract.json` on disk, which is offline. The reason does not explain why `@contract` is refused. I would also wonder how to plan to the emitted contract explicitly; the `--to` row says it is the default, which answers it only if I keep reading.

EXISTING marks: 6.

## (index)/prisma-orm/quickstart/mongodb.mdx

No CHANGED mark.

EXISTING marks: 4.

## (index)/prisma-orm/from-scratch.mdx (introduction and step 4)

CHANGED marks:

1. CHANGED. "Prisma ORM keeps one migration history for your own models, called the `app` space, in `migrations/app/`, and one for each extension package that ships its own migrations, such as pgvector. Each of these histories is a contract space, and the output counts them. This project has only the `app` space, which the output prints as `App space`, so you do not need to do anything about contract spaces here." This explains how the tool works inside, then tells me to do nothing. In a first-run tutorial it is a whole paragraph I read for no action. One sentence would do: "`App space` is the migration history for your own models; you can ignore it for now."

EXISTING marks: 2.

## guides/integrations/github-actions.mdx (introduction and "Prompt your coding agent")

CHANGED marks:

1. CHANGED. "Run `npx prisma@latest init` once to install the Prisma ORM skills for your coding agent and keep them matching your installed packages. `init` only installs the agent skills. You already set up Prisma ORM with `orm init` in step 2.1." Three problems. First, `init` and `orm init` are two commands with almost the same name, and in the previous version `prisma init` set up the project, so I expected `init` to do setup. Second, running it "once" cannot "keep them matching" later upgrades; I cannot tell whether I must rerun it. Third, I did not read step 2.1, so "`orm init`" is new to me here. Plainer: "Run `npx prisma@latest init` to install the Prisma ORM skills for your coding agent. It does not change your project. Run it again after you upgrade Prisma packages."

EXISTING marks: 2.

## Could I do what the pages are for?

Mostly. On `migration status` I could run the command and read the drawing. I would still not know where the database URL comes from when `--db` is omitted, or what `@empty` means there. On `migration plan` I would not know why `@contract` is refused for `--from`.
