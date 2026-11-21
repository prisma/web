# Contract reference forms on prisma/orm#30475

Run on 2026-09-30. Every cell below was run on the branch. No cell comes from tests only.

## What ran

| Component | Version |
| --- | --- |
| prisma/orm | PR #30475 head `20615a96f091453b8737d76b0d2a3abe7537895b` ("fix(cli): db migrate --to resolves @contract and @db like --show does"), merge base with `main` `e1f125185ed026128d679fe53f1ec384362cfb9e` |
| CLI | the workspace-local bin `packages/1-framework/3-tooling/cli/dist/bin.mjs` (prints `8.0.0-rc.12`), built with `pnpm install --frozen-lockfile` and `pnpm turbo run build --filter=@internal/cli... --filter=@prisma/orm-postgres... --filter=@prisma/orm-toolchain...` |
| `@prisma/orm-postgres` | the workspace package at the same commit |
| `@prisma/cli-engine` | 0.6.1 (the version the workspace pins) |
| Node.js | v24.13.0 |
| PostgreSQL | 15.16 (Homebrew), a private instance on port 54331, data in `wip/30475/pgdata`, stopped at the end of the run |

Scratch project: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/30475/scratch`. Its `node_modules` links to the built workspace packages. The contract is the rc.19 scratch contract from `wip/gaps`, so the hashes are the same as in `wip/gaps/facts.md`: baseline ends at `91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e` (H1), `add_user_phone` ends at `a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d` (H2). The emitted contract is H2. The ref `prod` names H1. There is no `db` ref. `prisma.config.ts` connects to the database `r30475`, which is at H1. `prisma.nodb.config.ts` has no `db.connection`.

Script: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/30475/matrix.sh`. Full output: `matrix.log`. One line per run: `matrix-summary.tsv`. Setup: `setup.log`. Follow-up probes: `probes.log`. Help text: `help.txt`. All beside this file. Before every run the script restored `migrations/` from a clean copy, and each command that changes a database ran on a fresh copy of a template database (empty, at H1, or at H2). Every command ran with `--format human --no-color`.

## Matrix

`ok` means exit 0. Anything else is the error code, and the exit code was 2. Codes without a namespace are in `MIGRATION.`. Forms: `full-hash` is H1, `dir-name` is `20260930T0540_baseline`, `dir^` is `20260930T0540_add_user_phone^`, and the three path forms are `./migrations/app/20260930T0540_baseline`, `./src/prisma/contract.json`, and `./migrations/snapshots/<H1>/contract.json`.

| Command | full-hash | dir-name | dir^ | @empty | @contract | @db | path-migration-dir | path-contract-json | path-snapshot-json |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `migration status --to` | ok | ok | ok | ok | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration status --from` | ok | ok | ok | ok | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration status --from` (no db configured) | ok | ok | ok | ok | ok | CONFIG.DB_CONNECTION_REQUIRED | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration status --from <H1> --to` (no db configured) | ok | ok | ok | ok | ok | CONFIG.DB_CONNECTION_REQUIRED | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --to` (empty db) | ok | ok | ok | RUNNER_FAILED | ok | RUNNER_FAILED | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --to` (db at H1) | ok | ok | ok | PATH_UNREACHABLE | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --to` (db at H2) | PATH_UNREACHABLE | PATH_UNREACHABLE | PATH_UNREACHABLE | PATH_UNREACHABLE | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --to` (no db configured) | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED |
| `db migrate --show --to` (db at H1) | ok | ok | ok | PATH_UNREACHABLE | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --show --to` (empty db) | ok | ok | ok | ok | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --show --to` (no db configured) | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED | CONFIG.DB_CONNECTION_REQUIRED |
| `db migrate --show --from` (db at H1) | ok | ok | ok | ok | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db update --dry-run --to` (db at H1) | ok | ok | ok | REF_WRONG_GRAMMAR | REF_WRONG_GRAMMAR | REF_WRONG_GRAMMAR | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db update --to` (db at H2) | ok | ok | ok | REF_WRONG_GRAMMAR | REF_WRONG_GRAMMAR | REF_WRONG_GRAMMAR | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db sign [contract]` (db at H1) | ok | ok | ok | SNAPSHOT_MISSING | REF_NOT_FOUND | SNAPSHOT_MISSING | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db sign --contract` (db at H1) | ok | ok | ok | SNAPSHOT_MISSING | REF_NOT_FOUND | SNAPSHOT_MISSING | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration plan --from` | ok | ok | ok | ok | REF_NOT_FOUND | HASH_NOT_IN_GRAPH | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |

The `db migrate --to` rows with "no db configured" fail before the reference is read, for every form. They show only that `db migrate` needs a connection.

## The results are correct, not only exit 0

rc.19 exited 0 on `migration status --to @db` and `--from @db` with wrong answers. On the branch the answers are right. The database `r30475` is at H1 and the emitted contract is H2, so one migration is pending.

| Command | Result on the branch | rc.19 (`wip/gaps/facts.md`) |
| --- | --- | --- |
| `migration status --to @contract` | `⚠ 1 pending`, same drawing as no `--to` | `REF_NOT_FOUND` |
| `migration status --from @contract` | `✔ Up to date`, offline, no `database:` line | `REF_NOT_FOUND` |
| `migration status --to @db` | `✔ Up to date` (target is the marker, H1) | `⚠ ... to the target ()` |
| `migration status --from @db` | `⚠ 1 pending`, with `✓ applied` on the baseline | `✔ Up to date` |
| `migration status --from @empty --to @db` | `⚠ 1 pending` (the baseline), reads the database for the target only | not run |
| `migration status --from @db` with no connection | `CONFIG.DB_CONNECTION_REQUIRED`, why: "@db resolves to the live database marker and requires a --db connection" | `✔ Up to date` |
| `db migrate --to @contract`, db at H1 | `✔ Applied 1 migration(s)`, marker H2 | `REF_NOT_FOUND` |
| `db migrate --to @contract`, empty db | `✔ Applied 2 migration(s)` | `REF_NOT_FOUND` |
| `db migrate --to @db`, db at H1 or H2 | `✔ Already up to date` | `PATH_UNREACHABLE` |
| `db migrate --show --to @db`, db at H1 | `ℹ Already up to date — nothing to run` | `CONFIG.DB_CONNECTION_REQUIRED` |
| `db migrate --show --from @empty --to @db`, db at H1 | `ℹ The following 1 migration will run` (the baseline) | not run |
| `db migrate --show --from <H1> --to @db`, no connection | `CONFIG.DB_CONNECTION_REQUIRED` | not run |
| `db update --to @contract`, `@db`, `@empty` | `REF_WRONG_GRAMMAR`: "Not a contract `db update --to` accepts" | `REF_NOT_FOUND`, `CLI.UNEXPECTED`, `CLI.UNEXPECTED` |

## Differences from the pull request description

1. **`db migrate --to @db` fails on a database with no marker.** The description says `@db` on an unsigned database resolves to the empty contract. It does, but `db migrate --to @db` on an empty database then exits 2 with `MIGRATION.RUNNER_FAILED`: "Plan destination storage hash (empty) does not match provided contract storage hash (a4c3fa7…)". `db migrate --to @empty` on an empty database fails the same way, on the branch and on rc.19. `db migrate --show --to @db` and `migration status --to @db` on the same empty database both exit 0 with "up to date".
2. **`db migrate --to @empty` still never succeeds.** The description says it fails with `MIGRATION.PATH_UNREACHABLE` when no path leads to the empty contract. On a database at H1 or H2 that is what happens. On an empty database it fails with `MIGRATION.RUNNER_FAILED` instead (item 1). The help text now lists `@empty` for `db migrate --to`. The docs do not, because no run succeeds.
3. **Two help lines are still out of date.** `migration status --from` says "Supplying it switches to offline path computation", which is not true for `--from @db`. `db migrate --from` lists "(@contract, @db, hash, ref name, or dir)" and leaves out the prefix, `<dir>^`, and `@empty`, which all work. Neither line changed in the pull request.

One older behaviour, not from this pull request: `migration status --from <H2> --to <H1>` with no database prints `✔ Up to date`, although no migration leads from H2 back to H1.

## What the docs should say after #30475

| Docs row | Before (prisma/web#8348) | After |
| --- | --- | --- |
| `migration status --from`, `--to` | a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty` | adds `@contract` and `@db` |
| `db migrate --to` | a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^` | adds `@contract` and `@db`; not `@empty` (item 2) |
| `db migrate --show --to` | the basic forms, `@contract`, or `@empty` | adds `@db` |
| `db migrate --show --from` | the basic forms, `@contract`, `@db`, or `@empty` | unchanged |
| `db update --to` | the basic forms | unchanged; the `@` names now fail with `MIGRATION.REF_WRONG_GRAMMAR` |
| `db sign`, `migration plan`, `migration new`, `migration ref set` | as before | unchanged |
| "None of these options accepts a file path" | true on rc.19 | still true: every path form fails with `MIGRATION.REF_NOT_FOUND` |

`migration status --from @db` and `--to @db` need a database connection, so "With `--from`, the command computes the path offline and does not need a database" on `cli/migration-status.mdx` becomes false for `@db`.

## Re-check on the release that ships #30475

Run in a scratch project with two migrations (baseline to H1, then H1 to H2), the emitted contract at H2, a ref `prod` at H1, `prisma.config.ts` connecting to a database at H1, and a second config with no `db.connection`. Pass `--format human --no-color`.

```bash
npx prisma migration status --to @contract          # ⚠ 1 pending
npx prisma migration status --from @contract        # ✔ Up to date, no database: line
npx prisma migration status --to @db                # ✔ Up to date
npx prisma migration status --from @db              # ⚠ 1 pending, baseline ✓ applied
npx prisma migration status --from @empty           # ⚠ 2 pending
npx prisma migration status --from @db --config prisma.nodb.config.ts   # CONFIG.DB_CONNECTION_REQUIRED
npx prisma db migrate --to @contract --db <db at H1>   # Applied 1 migration
npx prisma db migrate --to @db --db <db at H1>         # Already up to date
npx prisma db migrate --to @empty --db <db at H1>      # MIGRATION.PATH_UNREACHABLE
npx prisma db migrate --show --to @db               # Already up to date — nothing to run
npx prisma db migrate --show --to @contract         # 1 migration will run
npx prisma db migrate --show --from @empty --to @db # 1 migration will run
npx prisma db update --dry-run --to @contract       # MIGRATION.REF_WRONG_GRAMMAR
npx prisma db update --dry-run --to @db             # MIGRATION.REF_WRONG_GRAMMAR
npx prisma db update --dry-run --to @empty          # MIGRATION.REF_WRONG_GRAMMAR
# each of these must still fail with MIGRATION.REF_NOT_FOUND:
npx prisma migration status --to ./migrations/app/<baseline dir>
npx prisma migration status --from ./src/prisma/contract.json
npx prisma db migrate --to ./migrations/app/<baseline dir> --db <db at H1>
npx prisma db migrate --show --to ./src/prisma/contract.json
npx prisma db update --dry-run --to ./src/prisma/contract.json
npx prisma db sign --contract ./src/prisma/contract.json --db <db at H1>
npx prisma migration plan --from ./migrations/app/<baseline dir> --name t
```
