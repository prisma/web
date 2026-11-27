# Round 2 cold read: ORM migration pages

Reader: a developer who has used Prisma ORM 7 for two years and has not seen Prisma ORM 8.

## orm/migrations/the-migration-graph.mdx

### CHANGED

1. "A `│` continues a column upwards past rows that belong to another column." I could not picture this. In the drawing, the right-hand `│` in the `○ │   5e1f082` row is Bob's column passing Alice's row, but I had to work that out from the drawing, not from the sentence. Plainer: "Where a row belongs to one branch, the other branch's column shows a `│` so you can follow it up the page."

### EXISTING

12 marks.

- "instead of planning it again" (tip box): I do not know what would be planned again.
- Marker definition, "Reading it does not check the tables": a behavior note inside a definition; I did not know why it was there.
- "Prisma ORM still counts it as empty, which is not what you want": it does not say what happens if I run it anyway.
- "Here is the situation from the top of the page, after Bob's branch merged first": the drawing already contains `alice_merge`, which the page only creates later, so the drawing shows the end state, not the situation described.
- "Bob merged first, so `main` now points the `prod` ref at `1a76a3c`": does merging move the ref, or did someone run `ref set`? I only learned it is manual further down.
- "which is no longer the head": "head" is not defined.
- "if `refs/db.json` conflicts too": I did not know the `db` ref, which names what I applied in development, is committed and shared through git. Why is one developer's database state in the repository?
- "That is also why a migration whose end state leads nowhere is never run": "also" ties it to the fewest-migrations rule, but the reason given is that no path reaches the target.
- "`@db` ... The `db` ref is a file, so it can name a different state.": two near-identical names; I do not know when they differ in practice.
- "Because the contract it applied is one that no migration ends at, your next `db migrate` run stops at the check.": stated as always true, but the worked example uses `db update` where `alice_merge` does end at that state.
- Baselines, "Your next `migration plan` writes that one for you, because the `db` ref now names the signed state": `migration plan` starts from the `db` ref and ends at `contract.json`, which here are the same state, so I cannot see what it writes.
- Common tasks, "Apply a rollback migration you planned | `npx prisma db migrate --to <earlier-ref-or-hash>`": the rollbacks page says to revert the contract and run `db migrate` with no `--to`.

## orm/migrations/how-migrations-work.mdx

### CHANGED

1. "`dropdb` and `createdb` are PostgreSQL's own command-line tools. They do not read `DATABASE_URL`, so tell them which server and user to connect to with their own options, such as the `PGHOST`, `PGPORT`, and `PGUSER` environment variables." So what do I actually type? I have one `DATABASE_URL`. The page does not say whether I split it into those variables by hand, or how the password is passed. It also calls environment variables "options", which I read as command-line flags at first.

### EXISTING

2 marks.

- "If you want it to start somewhere else, pass `--from`, such as `--from 20260707T1006_add_user_phone`": this sits in the paragraph about the first `migration plan`, when no migrations exist, so the example directory cannot exist yet.
- Note box, "including any you keep in a migration directory": I did not know `.prisma` files live in migration directories; I guessed the snapshots.

## orm/migrations/rollbacks-and-recovery.mdx

### CHANGED

1. "[`npx prisma migration status`](/cli/migration-status) can warn about this ahead of time, with the code `MIGRATION.MARKER_NOT_IN_HISTORY`." I guessed this is the same problem as `MIGRATION.MARKER_MISMATCH` under a second name. The page does not say why the two commands use different codes, so I would search my logs for the wrong one.
2. "run `npx prisma migration plan --from <newest-migration-dir> --name <name>`" "Newest" by what? The graph page says order by time does not matter and history can branch. I guessed it means the migration the database was at before `db update`, but the page does not say that.

### EXISTING

3 marks.

- Step 4, "In CI and production, run `npx prisma db migrate`": How migrations work says to run `db migrate --to <ref>` in CI and production, and the graph page's table says `--to <earlier-ref-or-hash>`.
- "Planning from it forks the migration graph" and "To plan without the warning, pass `--from` with the rollback's directory name": the rollback's directory names the same state the `db` ref names, so I cannot tell whether the result differs or only the warning goes away.
- "`npx prisma db verify --schema-only --strict`": `--strict` is not explained.

## orm/migrations/editing-a-migration.mdx (introduction and "The same pattern on MongoDB")

### CHANGED

1. "The example below needs no `db` statements, because it builds its queries directly" I do not know what a "`db` statement" is. The PostgreSQL section I skipped may define it, but this section does not. I guessed it means queries written through a query builder object named `db`.
2. The whole paragraph (it is one line in the diff) has too many ideas for one reading: two imports, the `check` shape, two command classes, the constructor arguments, two helper names, `storageHash` and why, why `setValidation` is there, where to write the helpers, and a link. I could not restate it after one read. Splitting it into "what to import", "what the helpers return", and "why `setValidation` is here" would have worked for me.

The introduction has no marks.

## orm/reference/migration-api.mdx (introduction and "MongoDB operations")

No CHANGED marks.

### EXISTING

3 marks.

- `meta: { target: 'mongo', storageHash, lane: 'mongo-pipeline' }` and `lane: 'mongo-raw'`: the prose names only `storageHash`. I do not know what `lane` is or which value to pick.
- "Its other two fields, `filter` and `expect`, are optional": it does not say what they do.
- Introduction, "it writes `ops.json`, the SQL that will run": on MongoDB `ops.json` is not SQL.

## Could I do what the pages are for?

Mostly. I could plan, apply, and roll back a migration, and resolve Alice's merge by following the steps. I would still not know which `db migrate` form to use for a rollback in production, what `migration plan` writes after `db sign`, and how to run `dropdb` from my `DATABASE_URL`.
