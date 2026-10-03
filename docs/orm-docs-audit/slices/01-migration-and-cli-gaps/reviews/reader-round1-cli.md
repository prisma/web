# Round 1 cold read: CLI pages

Reader: a developer with two years on Prisma ORM 7, no knowledge of version 8 vocabulary. Marks were taken before opening the diff, then labelled.

## cli/migration-status.mdx

### CHANGED

1. `--to` row: "Accepts a contract reference: a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty`." I had to guess `<dir>^` (the state before that migration?) and "ref name" (a saved name for a state, like a git tag?). The page does not say, so I must follow the link to type anything but a hash. Plainer: add three words after `<dir>^`, such as "(the state before that migration)".
2. Contract space paragraph: "each extension package that ships migrations, such as pgvector, has its own." I guessed "extension package" means an npm package for a Postgres extension, not a Postgres extension itself. Otherwise the paragraph is clear, and `--space app` tells me what to type.
3. Sample output: the drawing uses `@db (db)`, `@contract`, `∅`, `1 ops`, and `migrations:  migrations`. I could not read `@db (db)`: why is `db` written twice? I guessed `∅` means an empty database. "Read the drawing from the bottom up" does not say why, and every label is explained only on another page. I cannot read the sample on this page alone.
4. Sample output last line: "run `prisma db migrate --to a4c3fa7fc3b2`". The suggested command has no `--db`, but the page ran status with `--db "$DATABASE_URL"`. So what do I actually type? Also the hash in the hint (12 characters) differs from the drawing (7 characters), and nothing says they are the same state.
5. "When the command warns with `MIGRATION.MARKER_NOT_IN_HISTORY`, the marker in the database records a contract state that is not in your migration history." Understood. But the fix is only a link labelled "Drift", and the page never says this situation is called drift, so the link text does not tell me it is the fix. Plainer: "To fix it, see Drift."

### EXISTING

5 marks.

### Could I do what the page is for?

Partly. I can run `migration status --db "$DATABASE_URL"` and see that something is pending. I could not read the drawing without the other page, and I do not know whether the suggested `db migrate` command needs `--db`.

## cli/db-migrate.mdx

### CHANGED

1. First paragraph: "`db migrate` applies pending on-disk migrations to advance the database. A contract space is a separate migration history. ... `db migrate` walks every contract space and applies migrations in canonical order: extensions alphabetically, then the app. It applies only the migrations that exist on disk and never generates new operations." Too many ideas in one paragraph. The contract space definition interrupts the description of the command. "canonical order: extensions alphabetically, then the app" is how it works inside; I only need "it also applies migrations from extension packages". "never generates new operations": I guessed "operations" means SQL steps. Plainer: "`db migrate` applies the migrations in `migrations/` that the database has not run yet, including those shipped by extension packages. It never writes new migrations."
2. `--to` row: "With `--show`, it also accepts `@contract` and `@empty`." Why only with `--show`? And `@contract` and `@empty` are defined only below the table, so on first reading I did not know what they were.
3. `--from` row: "Sets the starting state for the `--show` preview." Does `--from` without `--show` fail, or is it ignored? The page does not say.
4. "`@contract` names the emitted contract, `@db` names the contract state in the database's marker, and `@empty` names the empty database, before any migration." "marker" is not defined on this page. I guessed from another page that it is a row in the database. "emitted contract" I guessed means the output of `contract emit`.

### EXISTING

5 marks.

### Could I do what the page is for?

Yes for the basic command. I would still not know whether to add `--advance-ref db` (this page's recommended flow leaves it off; the CLI overview adds it), what a ref is, or whether `--show` without `--db` reads my database.

## cli/db-update.mdx

### CHANGED

1. `--to` row: "a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^`." Same as above: `<dir>^` and "ref name" are unexplained on the page. Minor.

### EXISTING

6 marks.

### Could I do what the page is for?

Yes for applying changes. I would still not know why passing `--db` changes what happens to the `db` ref, what name to type for `--confirm`, and `--no-interactive` and `--confirm` are missing from the options table.

## cli/db-sign.mdx

### CHANGED

1. `[contract]` row: "a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^`." Same unexplained `<dir>^` and "ref name". Minor.
2. `--contract` row: "The contract reference as a flag. Accepts the same forms as `[contract]`." If both do the same thing, which do I type? Nothing says why both exist or which to prefer. Plainer: "Same as `[contract]`, written as a flag."

### EXISTING

6 marks.

### Could I do what the page is for?

Mostly. I would still not know whether "signature" is the same thing other pages call the "marker", and I am told it is safe in a deployment pipeline but also to pass `--no-advance-ref` there, so I do not know what to type in my pipeline.

## cli/migration-plan.mdx

### CHANGED

1. `--from` row: "`migration plan` is offline, so `@db` and `@contract` are not accepted here." The first half makes sense for `@db`. It does not for `@contract`: I understood `@contract` to be the emitted contract on disk, which needs no database. And neither token is defined on this page. (The sentence wording is the same as before the change, but it is on an added line.)
2. `--to` row: "Accepts the same forms as `--from`, except `@empty`, which is refused as a destination." Understood. No problem beyond the `<dir>^` guess above.

### EXISTING

7 marks.

### Could I do what the page is for?

For a new project, yes. For an existing project I would still not know what to type for `<contract>` in `migration ref set db <contract>` (how do I find the state my database is on?), how `migrations/snapshots/` gets filled, and whether `migration show` takes a directory name or a path.

## cli/index.mdx

### CHANGED

1. "Other commands" paragraph: "`migration log` (executed history from the database ledger ...)" and "`migration check [target]` (artifact and graph integrity ...)" and "a Prisma ORM 7 schema read through `prisma7Schema`". I guessed "ledger" is a table of applied migrations, "artifact" means the files in a migration directory, and `prisma7Schema` is a config field. The paragraph has too many ideas: two unrelated commands, then four commands each with a flag list. (Only the contract space link is new; the rest of the sentence was already there, but it is on an added line.)

### EXISTING

3 marks.

### Could I do what the page is for?

Yes for finding the right command. I would still not know when to pass `--advance-ref db` to `db migrate`: this page says add it locally and leave it off in CI, but the `db migrate` page's recommended flow never mentions it.

## Totals

- CHANGED: 15
- EXISTING: 32
