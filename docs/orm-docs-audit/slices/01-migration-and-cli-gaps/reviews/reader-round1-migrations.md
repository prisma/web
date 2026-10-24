# Round 1 cold read: migrations pages

Reader: a developer who used Prisma ORM 7 for two years and has not seen Prisma ORM 8.

## orm/migrations/the-migration-graph.mdx

### Marks

1. CHANGED. "A `╯` with a `─` joins a column to the state it starts from, so the `│─╯` above `4437973` shows that the right-hand column, which holds Bob's migration, starts from the same state as the left-hand column, which holds Alice's." Too many ideas in one sentence. I had to go back to the drawing three times. The `│─╯` sits on its own row, so "above `4437973`" did not tell me which symbol belongs to which column. Plainer: "The `│─╯` row shows where the two columns split: both Bob's migration (right column) and Alice's (left column) start from `4437973`."
2. CHANGED. "For the symbols in the rows, `--legend` prints a key: `○`, the arrows, `✓` and `⧗`, `∅`, and the labels." So what do I type? I guessed `npx prisma migration graph --legend`. `✓` and `⧗` do not appear in the drawing, so I do not know when I would see them. I guessed "applied" and "pending". "the labels" is vague: I guessed `@contract` and `(prod)`.
3. CHANGED. The "Which forms each command accepts" table. I could read each row, but I could not keep it in my head. The rows differ in small ways with no reason given. For example, `db migrate --to` does not accept `@contract`, but the page says `db migrate` goes to `contract.json` by default, so I do not know why I cannot name it. `migration status --from`, `--to` appears only here, and nothing on the page says what those options do on a status command.
4. CHANGED. "No command accepts a file path." The How migrations work page says `migration show` accepts "its path under `migrations/app/`". I could not tell whether that counts as a file path. I guessed the sentence means only the options in this table.

EXISTING marks: 13.

### Could I do what the page is for?

Mostly. I could plan the merge migration from `prod`. I would still not know who moves the `prod` ref after a merge, or how, and whether that is a manual `ref set` commit or something the pipeline does.

## orm/migrations/how-migrations-work.mdx

### Marks

1. CHANGED. "its own hash, `migrationHash`, which is computed from the rest of `migration.json` and from `ops.json`, so it changes when either file changes." This explains how the tool works inside. I only needed "do not edit these files; `migration check` catches edits."
2. CHANGED. "`migration show` takes a prefix of a `migrationHash`, while `--from` and `--to` take a prefix of a contract hash." So what do I type? The page never shows me where to see a `migrationHash` other than opening `migration.json`. I would just use the directory name, so this sentence added a distinction I did not need.
3. CHANGED. "To create what your contract declares without running the migrations, run `npx prisma db init` in place of the last line." `db init` appears nowhere else on the page. I guessed it is like Prisma ORM 7's `db push` on an empty database, but I do not know how it differs from `db update`.
4. CHANGED. "If you cannot drop the database, drop both the `public` schema and the `prisma_contract` schema." So what do I type? I guessed `DROP SCHEMA public CASCADE; DROP SCHEMA prisma_contract CASCADE; CREATE SCHEMA public;`, but I am not sure whether I must re-create `public` myself.
5. CHANGED. "Dropping only `public` leaves the marker in the database, so `db migrate` reports `Already up to date` on a database with no tables, and `db verify` fails." I understood it, but only after rereading. It reads as a warning about a mistake I have not made yet, stuck on the end of a long paragraph.
6. CHANGED. The `dropdb` and `createdb` block. It does not say which server or user these connect to. I guessed they use my local PostgreSQL defaults, not `DATABASE_URL`.

EXISTING marks: 4.

### Could I do what the page is for?

Yes. I could run the plan, review, and apply loop. I would still not know what `db init` is.

## orm/migrations/rollbacks-and-recovery.mdx

### Marks

1. CHANGED. "[`npx prisma migration status`](/cli/migration-status) can warn you about the same situation before you run `db migrate`. Its warning has the code `MIGRATION.MARKER_NOT_IN_HISTORY`, and it means that the next `db migrate` fails with `MIGRATION.MARKER_MISMATCH`." Two error codes for one situation made me think there were two problems. This makes an already long paragraph longer: by the end of it I had lost the fix. Plainer: "`migration status` warns about this ahead of time with `MIGRATION.MARKER_NOT_IN_HISTORY`." Then give the fix in its own sentence.
2. CHANGED, same paragraph. "That migration ends at the state `db update` applied, so the next `db migrate` there has nothing to run." "there" does not say which place. I guessed it means the database that `db update` changed.

EXISTING marks: 6.

### Could I do what the page is for?

For development, yes. For production, no. Step 4 says to run plain `npx prisma db migrate` in CI and production, but the other pages say to run `db migrate --to <ref>` there. I would not know whether I must move the `prod` ref back before the rollback runs.

## Totals

- CHANGED: 12 (4 graph, 6 how-migrations-work, 2 rollbacks)
- EXISTING: 23 (13 graph, 4 how-migrations-work, 6 rollbacks)
