# Facts verified on prisma@8.0.0-rc.19

Run on 2026-09-29. Every command ran in a scratch project under `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps`. Full logs are beside this file; each section names its log.

## Versions

| Component | Version |
| --- | --- |
| `prisma` | 8.0.0-rc.19 (npm `latest`, confirmed with `npm view prisma dist-tags`) |
| `@prisma/orm-postgres` | 8.0.0-rc.13 (npm `latest`) |
| `@prisma/cli-engine` | 0.6.2 (`orm init` added it as a dev dependency; `@prisma/orm-toolchain@8.0.0-rc.13` declares a peer dependency on 0.6.1, so npm prints a peer warning) |
| Node.js | v24.13.0 |
| PostgreSQL | 15.16 (Homebrew), port 54329, stopped at the end of the run |

`npx prisma --version` prints `8.0.0-rc.19` (exit 0).

Setup: `npx prisma orm init --yes --target postgres --authoring psl`. It wrote the contract to `src/prisma/contract.prisma` and emits `src/prisma/contract.json`, not `prisma/contract.json`. The starter contract has `User` and `Post`, so the baseline has 6 operations. I set `"type": "module"` in `package.json` because `npm init` wrote `commonjs` and `orm init` warned about it.

Output mode: in this shell the CLI prints JSON by default, so every command ran with `--format human --no-color`. The logs omit those two flags from the printed command line. I removed one line from every output: `Prisma agent skills are out of date (...)`.

Hashes in this run: baseline ends at `91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e` (called H1 below). `add_user_phone` ends at `a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d` (H2). The ref `prod` names H1.

## Items that differ from the spec

1. **E3, `migration plan --to @empty`: rejected.** The spec table says `migration plan --from`, `--to` accept `@empty`. Only `--from` does. `--to @empty` exits 2 with `MIGRATION.REF_WRONG_GRAMMAR`. rc.17 does the same, so the spec table was wrong for this cell on both versions.
2. **E3, `db migrate --to @empty` (without `--show`): I found no run that succeeds.** On an empty database it exits 2 with `MIGRATION.RUNNER_FAILED`. On a database at H1 it exits 2 with `MIGRATION.PATH_UNREACHABLE`. rc.17 gives the same `RUNNER_FAILED`. `db migrate --show --to @empty` does work (exit 0 on an empty database).
3. **E3, `migration new --from` accepts prefixes shorter than 6 characters.** The spec says a hash prefix is the first 6 or more characters. `migration new --from 91e7f`, `91e7`, `91e`, and `9` all exit 0 and scaffold from H1. Every other command rejects the 5-character prefix with `MIGRATION.REF_NOT_FOUND`. rc.17 also accepts `91e7f` here.
4. **E7, `{bin}` is still in `--json` output.** Human output prints `prisma`, as amendment 2 in `plan.md` expects. The `--json` output still has `{bin}` in `result.summary` and in `result.diagnostics[].hints`. This matters only if a page shows JSON output.

Everything else matches. Three observations that do not contradict the spec, but that a page author should know:

- `migration status --from @db` and `--to @db` exit 0 on rc.19 but give wrong answers (`--from @db` prints `Up to date` with one migration pending; `--to @db` warns about a target named `()`). The spec already says not to list `@db` there. rc.17 behaves the same.
- E9: `init --help` on rc.19 says `init` also adds `prisma` to `devDependencies` when no dependency field declares it. `apps/docs/content/docs/cli/init.mdx` lists three actions and does not mention this one.
- E6: `db migrate --show` does not refuse a hand-edited `ops.json`; it printed the route. I did not test whether `db migrate` without `--show` refuses it.

## Could not verify

- "A hash prefix matches exactly one contract state": I could not produce two contract hashes that share a 6-character prefix, so I did not test an ambiguous prefix.
- `npx prisma@latest` failed in the shared npm cache (`npm error ENOTEMPTY` in `~/.npm/_npx`). I ran E9 with a private npm cache inside `wip/gaps` and deleted that cache afterwards. I did not touch `~/.npm`.

## 1. E3: contract reference forms

Script: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/e3.sh`. Full output: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/e3.log`. One line per run: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/e3-summary.tsv`. Follow-up probes: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/e3-followup.log`. rc.17 comparison: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/rc17.log`.

Method: before every run the script restored `migrations/` from a clean copy. Commands that change a database ran against a throwaway database cloned from a template (empty, at H1, or at H2). Read-only commands ran against the database `gaps`, which is at H1.

Forms tested, all naming H1 where the form can name a state: full hash; prefixes of 12, 7, 6, and 5 characters; `prod`; `20260929T1558_baseline`; `20260929T1558_add_user_phone^`; `@empty`; `@contract`; `@db`; `./migrations/app/20260929T1558_baseline`; `./src/prisma/contract.json`; `./migrations/snapshots/<H1>/contract.json`.

Cell values: `ok` means exit 0. Anything else is the error code, and the exit code was 2. Codes without a namespace are in `MIGRATION.`. `migration plan --to` ran with `--from <H2>`.

| Command | full-hash | prefix-12 | prefix-7 | prefix-6 | prefix-5 | ref-name | dir-name | dir^ | @empty | @contract | @db | path-migration-dir | path-contract-json | path-snapshot-json |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `migration plan --from` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | ok | REF_NOT_FOUND | HASH_NOT_IN_GRAPH | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration plan --to` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | REF_WRONG_GRAMMAR | REF_NOT_FOUND | HASH_NOT_IN_GRAPH | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration new --from` | ok | ok | ok | ok | ok | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH | HASH_NOT_IN_GRAPH |
| `migration ref set` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | REF_SET_EMPTY_SENTINEL | REF_NOT_FOUND | HASH_NOT_IN_GRAPH | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration status --from` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | ok | REF_NOT_FOUND | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `migration status --to` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | ok | REF_NOT_FOUND | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --to (empty db)` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | RUNNER_FAILED | REF_NOT_FOUND | PATH_UNREACHABLE | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --to (db at H1)` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | PATH_UNREACHABLE | REF_NOT_FOUND | PATH_UNREACHABLE | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --show --to` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | PATH_UNREACHABLE | ok | CONFIG.DB_CONNECTION_REQUIRED | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db migrate --show --from` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | ok | ok | ok | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db update --dry-run --to` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | CLI.UNEXPECTED | REF_NOT_FOUND | CLI.UNEXPECTED | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db update --to (db at H2)` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | CLI.UNEXPECTED | REF_NOT_FOUND | CLI.UNEXPECTED | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db sign [contract] (db at H1)` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | SNAPSHOT_MISSING | REF_NOT_FOUND | SNAPSHOT_MISSING | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |
| `db sign --contract (db at H1)` | ok | ok | ok | ok | REF_NOT_FOUND | ok | ok | ok | SNAPSHOT_MISSING | REF_NOT_FOUND | SNAPSHOT_MISSING | REF_NOT_FOUND | REF_NOT_FOUND | REF_NOT_FOUND |

Verdict per row of the spec table:

| Spec row | Verdict | Notes |
| --- | --- | --- |
| `migration plan --from`, `--to` | **DIFFERS** | `--from` matches. `--to @empty` is rejected with `MIGRATION.REF_WRONG_GRAMMAR`. |
| `migration new --from` | **DIFFERS** | Accepts a hash and a prefix, rejects every other form with `MIGRATION.HASH_NOT_IN_GRAPH`. It also accepts prefixes of 5, 4, 3, and 1 characters. |
| `migration ref set <name> <contract>` | MATCH | `@empty` is rejected with `MIGRATION.REF_SET_EMPTY_SENTINEL`. |
| `migration status --from`, `--to` | MATCH | `@contract` is rejected. `@db` exits 0 but is mishandled; the spec does not list it. |
| `db migrate --to` | **DIFFERS** for `@empty` | The five basic forms match. `@empty` never succeeded. `@contract` is rejected with `MIGRATION.REF_NOT_FOUND` and `@db` fails with `MIGRATION.PATH_UNREACHABLE`, as the spec says. |
| `db migrate --show --to` | MATCH | `@empty` exits 0 on an empty database; on the database at H1 it fails with `MIGRATION.PATH_UNREACHABLE` because no migration leads back to empty. `@contract` works. `@db` is rejected with `CONFIG.DB_CONNECTION_REQUIRED` and the reason "@db is not valid as a --to target". |
| `db migrate --show --from` | MATCH | All eight forms exit 0. |
| `db update --to` | MATCH | `@empty` and `@db` crash with `CLI.UNEXPECTED`, `@contract` gives `MIGRATION.REF_NOT_FOUND`. Same with and without `--dry-run`. |
| `db sign [contract]`, `--contract` | MATCH | Both accept `<dir>^`. Both reject `@empty` and `@db` with `MIGRATION.SNAPSHOT_MISSING`. |
| "A hash prefix is the first 6 or more characters" | MATCH, except `migration new --from` | 6 accepted and 5 rejected on every other command. |
| "No command accepts a file path" | MATCH | Rejected in every cell. `migrations/app/<dir>` without `./`, an absolute path, and `src/prisma/contract.json` are rejected too. |

The help text on rc.19 still advertises `./path` for `migration plan --from`, `migration status --to`, `db migrate --to`, `db update --to`, and `db sign --contract` (see `help.txt`). No command accepts it.

Outputs for the cells that differ:

```text
$ npx prisma migration plan --from a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d --to @empty --name t
✘ [MIGRATION.REF_WRONG_GRAMMAR] `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
  why: `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
→ Pass `--to` a contract hash, ref name, or migration directory name. To plan starting from an empty database, use `--from @empty`.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.REF_WRONG_GRAMMAR
[exit 2]

$ npx prisma db migrate --to @empty --db postgresql://postgres@localhost:54329/t_e
▸ Running migration plan across spaces
✘ Running migration plan across spaces
✘ [MIGRATION.RUNNER_FAILED] Plan destination storage hash (empty) does not match provided contract storage hash (a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d).
  why: Migration runner failed
→ Fix the issue and re-run `prisma db migrate --to <contract>` — previously applied migrations are preserved.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.RUNNER_FAILED
[exit 2]

$ npx prisma db migrate --to @empty --db postgresql://postgres@localhost:54329/t_h1
✘ [MIGRATION.PATH_UNREACHABLE] Current contract has no planned migration path
  why: No migration edge connects the current state "91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e" to the target "empty" in contract space "app". The on-disk migration graph does not join the two, and migrate replays existing edges — it never invents one.
→ Plan the missing edge: prisma migration plan --from 91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e --to empty --name <slug>
→ Apply it: prisma db migrate --to empty
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.PATH_UNREACHABLE
[exit 2]

$ npx prisma migration new --from 91e7f --name t
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app

✔ Scaffolded migration at migrations/app/20260929T1600_t

from:  91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d

→ Write the migration body in migrations/app/20260929T1600_t/migration.ts
→ Run it to self-emit ops.json and attest the package: node "migrations/app/20260929T1600_t/migration.ts"
[exit 0]

$ npx prisma migration status --from @db
│  migrations:  migrations
│  from:        @db

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops
○   91e7f9f  (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops
○   ∅

✔ Up to date
[exit 0]

$ npx prisma migration status --to @db
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/gaps

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops
○   91e7f9f  @db (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

⚠ No migration path from the database state (91e7f9f03580) to the target (). Run `prisma migration plan --name <name>` to author one, or pass `--to <contract>` to pick a reachable target.
[exit 0]

```

Follow-up probes (output trimmed to status lines):

```text
$ npx prisma migration new --from 91e7 --name t
✔ Scaffolded migration at migrations/app/20260929T1605_t
from:  91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
$ npx prisma migration new --from 91e --name t
✔ Scaffolded migration at migrations/app/20260929T1605_t
from:  91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
$ npx prisma migration new --from 9 --name t
✔ Scaffolded migration at migrations/app/20260929T1606_t
from:  91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
$ npx prisma migration new --from 91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784f --name t
✘ [MIGRATION.HASH_NOT_IN_GRAPH] Starting contract not found
  why: No migration with to hash matching "91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784f" exists in migrations/app
[exit 2]
$ npx prisma migration plan --to @empty --name t
✘ [MIGRATION.REF_WRONG_GRAMMAR] `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
  why: `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
[exit 2]
$ npx prisma migration plan --from prod --to @empty --name t
✘ [MIGRATION.REF_WRONG_GRAMMAR] `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
  why: `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
[exit 2]
$ npx prisma db migrate --show --to @empty --db postgresql://postgres@localhost:54329/t_e
ℹ Already up to date — nothing to run
[exit 0]
$ npx prisma db migrate --show --from @empty --to @empty --db postgresql://postgres@localhost:54329/t_e
ℹ Already up to date — nothing to run
[exit 0]
$ npx prisma db migrate --show --from @empty --db postgresql://postgres@localhost:54329/t_e
ℹ The following 2 migrations will run:
[exit 0]
$ npx prisma db migrate --show --to @contract --db postgresql://postgres@localhost:54329/t_e
ℹ The following 2 migrations will run:
[exit 0]
$ npx prisma db migrate --show --from @db --db postgresql://postgres@localhost:54329/t_e
ℹ The following 2 migrations will run:
[exit 0]
--- other path spellings
$ npx prisma migration plan --from migrations/app/20260929T1558_baseline --name t
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "migrations/app/20260929T1558_baseline"
  why: No contract matching "migrations/app/20260929T1558_baseline" exists in the migration graph or refs index.
[exit 2]
$ npx prisma migration plan --from /Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/work/migrations/app/20260929T1558_baseline --name t
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/work/migrations/app/20260929T1558_baseline"
  why: No contract matching "/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/work/migrations/app/20260929T1558_baseline" exists in the migration graph or refs index.
[exit 2]
$ npx prisma db migrate --show --to migrations/app/20260929T1558_baseline
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "migrations/app/20260929T1558_baseline"
  why: No contract matching "migrations/app/20260929T1558_baseline" exists in the migration graph or refs index.
[exit 2]
$ npx prisma db sign --contract src/prisma/contract.json --db postgresql://postgres@localhost:54329/t_e
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "src/prisma/contract.json"
  why: No contract matching "src/prisma/contract.json" exists in the migration graph or refs index.
[exit 2]
--- status with @ tokens and no database configured
$ npx prisma migration status --from @db
✔ Up to date
[exit 0]
$ npx prisma migration status --from @contract
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "@contract"
  why: No contract matching "@contract" exists in the migration graph or refs index.
[exit 2]
$ npx prisma migration status --from @empty --to @empty
✔ Up to date
[exit 0]
```

The same cells on rc.17 (`prisma@8.0.0-rc.17`, `@prisma/orm-postgres@8.0.0-rc.12`, `@prisma/cli-engine@0.6.1`). The first `migration plan --to @empty` run failed for another reason, because rc.17 cannot read snapshots that rc.19 wrote, so I rebuilt the history with rc.17 and ran it again:

```text
8.0.0-rc.17
|   `-- @prisma/cli-engine@0.6.1 deduped
  +-- @prisma/cli-engine@0.6.1
    `-- @prisma/cli-engine@0.6.1 deduped
storageHash:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
$ npx prisma migration new --from 91e7f --name t
✔ Scaffolded migration at migrations/app/20260929T1612_t
from:  91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
$ npx prisma migration plan --from a4c3fa7fc3b2 --to @empty --name t
✘ [CONTRACT.VALIDATION_FAILED] Contract validation failed
  why: Predecessor contract at /Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/rc17/migrations/snapshots/a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d/contract.json failed to deserialize: Contract structural validation failed: execution.mutations.defaults
[exit 2]
$ npx prisma db migrate --to @empty --db postgresql://postgres@localhost:54329/t_e
✘ Running migration plan across spaces
✘ [MIGRATION.RUNNER_FAILED] Plan destination storage hash (empty) does not match provided contract storage hash (a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d).
  why: Migration runner failed
[exit 2]
$ npx prisma db migrate --show --to @empty --db postgresql://postgres@localhost:54329/t_e
ℹ Already up to date — nothing to run
[exit 0]
$ npx prisma migration status --from @db
✔ Up to date
[exit 0]
$ npx prisma migration status --to @db
⚠ No migration path from the database state (91e7f9f03580) to the target (). Run `{bin} migration plan --name <name>` to author one, or pass `--to <contract>` to pick a reachable target.
[exit 0]

⚠ 1 pending — run `{bin} db migrate --to a4c3fa7fc3b2`
[exit 0]

--- history rebuilt with rc.17
storageHash:    91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
$ npx prisma migration plan --name baseline
✔ Planned 6 operation(s)
ℹ No db ref set — planning from an empty database. Run db init, db update, or db sign if a database already exists.
from:       (baseline)
to:         91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
ℹ DDL preview
[exit 0]
storageHash:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
$ npx prisma migration plan --name add_user_phone --from @empty
✔ Planned 6 operation(s)
from:       (baseline)
20260929T1612_add_user_phone
20260929T1612_baseline
$ npx prisma migration plan --from 20260929T1612_baseline --name add_user_phone
✘ [MIGRATION.DIR_EXISTS] Migration directory already exists
  why: The directory "/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/rc17/migrations/app/20260929T1612_add_user_phone" already exists. Each migration must have a unique directory.
[exit 2]
$ npx prisma migration plan --from 20260929T1612_add_user_phone --to @empty --name t
✘ [MIGRATION.REF_WRONG_GRAMMAR] `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
  why: `@empty` is only valid as an origin (`--from`); planning a migration to the empty contract is not supported through this shortcut
[exit 2]
$ npx prisma migration plan --to @empty --name t
✘ [MIGRATION.PLAN_ORIGIN_UNKNOWN] Cannot determine the plan origin: migrations exist but no origin is named
  why: Migrations exist on disk, but there is no `db` ref and no --from was given, so the plan origin would silently fall back to an empty database and the resulting migration would recreate everything the existing migrations already create.
[exit 2]
```

## 2. E1: migration graph and --legend

Verdict: MATCH. Log: `e1.log`. Project: `graph/`. History: `init`, then `alice_add_phone` and `bob_add_avatar` both planned with `--from <init dir>`, `prod` set to Bob's migration, then `alice_merge` planned with `--from prod`.

`--legend` explains `○`, `↑`, `↓`, `⟲`, `✓`, `⧗`, `∅`, `@contract` and `@db`, ref labels, and the `aaaaaa → bbbbbb` notation. It prints the key after the drawing. It does not explain `│`, `─`, or `╯`.

```text
$ npx prisma migration graph
│  migrations:  migrations

  ○   b68f9a4  @contract
  │↑  20260929T1601_alice_merge      59b927f → b68f9a4  1 ops
○ │   a4c3fa7
│↑│   20260929T1601_alice_add_phone  91e7f9f → a4c3fa7  1 ops
│ ○   59b927f  (prod)
│ │↑  20260929T1601_bob_add_avatar   91e7f9f → 59b927f  1 ops
│─╯
○     91e7f9f
│↑    20260929T1601_init                   ∅ → 91e7f9f  6 ops
○     ∅

1 space(s), 5 contract(s), 4 migration(s)
[exit 0]

$ npx prisma migration graph --legend
│  migrations:  migrations

  ○   b68f9a4  @contract
  │↑  20260929T1601_alice_merge      59b927f → b68f9a4  1 ops
○ │   a4c3fa7
│↑│   20260929T1601_alice_add_phone  91e7f9f → a4c3fa7  1 ops
│ ○   59b927f  (prod)
│ │↑  20260929T1601_bob_add_avatar   91e7f9f → 59b927f  1 ops
│─╯
○     91e7f9f
│↑    20260929T1601_init                   ∅ → 91e7f9f  6 ops
○     ∅

1 space(s), 5 contract(s), 4 migration(s)

Legend:
  ○ contract   ↑ forward   ↓ rollback
  ⟲ migration without schema change
  ✓ applied   ⧗ pending
  ∅ empty database (baseline)
  @contract @db reserved markers — also typeable as --from/--to tokens
  (prod, staging) user-defined refs
  aaaaaa → bbbbbb   migration from contract aaaaaa to bbbbbb
[exit 0]

$ npx prisma migration graph --ascii
│  migrations:  migrations

  *   b68f9a4  @contract
  |^  20260929T1601_alice_merge      59b927f -> b68f9a4  1 ops
* |   a4c3fa7
|^|   20260929T1601_alice_add_phone  91e7f9f -> a4c3fa7  1 ops
| *   59b927f  (prod)
| |^  20260929T1601_bob_add_avatar   91e7f9f -> 59b927f  1 ops
|-/
*     91e7f9f
|^    20260929T1601_init                   - -> 91e7f9f  6 ops
*     -

1 space(s), 5 contract(s), 4 migration(s)
[exit 0]

```

## 3. E4: replacing migrate reset

Verdict: MATCH on every point. Logs: `e4a.log`, `e4b.log`. Project: `work/`, database `mydb`. `dropdb` and `createdb` ran with `PGHOST=localhost PGPORT=54329 PGUSER=postgres`.

| Fact | Result |
| --- | --- |
| `dropdb --if-exists mydb`, `createdb mydb`, `npx prisma db migrate --advance-ref db` rebuilds | exit 0 each; `Applied 2 migration(s) (7 operation(s))`; `db verify` then passes |
| `npx prisma db init` as the last line instead | exit 0; `Applied 5 operation(s) across 1 contract space`; creates the tables and the marker without running the migrations (the ledger has one row with an empty `migration_name`); `db verify` passes; `migration status` prints `Up to date` |
| `db migrate` runs no seed script | With `prisma.seed` and `scripts.seed` set in `package.json` to write `seed-ran.txt`, `db migrate` exited 0 and the file was not created. The CLI has no seed option in any help text. |
| Drop only `public` | The marker row survives in `prisma_contract.marker`; `db migrate --advance-ref db` prints `Already up to date` (exit 0) with no tables; `db verify` exits 4 with `CONTRACT.SCHEMA_VERIFICATION_FAILED` (24 failures); `migration status` prints `Up to date` |
| Drop `public` and `prisma_contract` | `db migrate --advance-ref db` applies both migrations (exit 0); `db verify` passes |

```text
--- drop only public
$ psql -d mydb -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
NOTICE:  drop cascades to 2 other objects
DETAIL:  drop cascades to table "Post"
drop cascades to table "User"
DROP SCHEMA
CREATE SCHEMA
 space |                            core_hash                             
-------+------------------------------------------------------------------
 app   | a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
(1 row)

Did not find any relation named "public.*".
$ npx prisma db migrate --advance-ref db
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/mydb

✔ Already up to date

App space
├─ (no operations)
└─ marker a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d

✔ Advanced ref "db" → a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
→ Check every space against the database: prisma migration status
[exit 0]

```

`db verify` after dropping only `public` (issue list trimmed):

```text
$ npx prisma db verify
▸ Connecting to database...
✔ Connecting to database...
▸ Verifying database marker...
✔ Verifying database marker...
▸ Introspecting database schema
✔ Introspecting database schema
▸ Verifying contract spaces
✔ Verifying contract spaces
│  contract:  src/prisma/contract.json
│  mode:      full (marker + schema, tolerant)
│  database:  postgresql://****@localhost:54329/mydb

✘ Schema issues

✘ Database schema does not satisfy contract (24 failures)

✘ [CONTRACT.SCHEMA_VERIFICATION_FAILED] Database schema does not satisfy contract (24 failures)
  why: The live schema differs: missing: database/public/Post; missing: database/public/Post/column:authorId; missing: database/public/Post/column:content; missing: database/public/Post/column:created
→ Push the contract to the database: prisma db update
→ Or reconcile the differences by hand and verify again
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SCHEMA_VERIFICATION_FAILED
[exit 4]

```

After dropping both schemas:

```text
--- drop both schemas
$ psql -d mydb -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; DROP SCHEMA prisma_contract CASCADE;'
NOTICE:  drop cascades to 3 other objects
DETAIL:  drop cascades to table prisma_contract.marker
drop cascades to table prisma_contract.ledger
drop cascades to table prisma_contract.contract
DROP SCHEMA
CREATE SCHEMA
DROP SCHEMA
$ npx prisma db migrate --advance-ref db
▸ Running migration plan across spaces
✔ Running migration plan across spaces
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/mydb

✔ Applied 2 migration(s) (7 operation(s)) across 1 contract space(s)

App space
├─ Create schema "public"
├─ Create table "Post"
├─ Create table "User"
├─ Add unique constraint on "User" (email)
├─ Create index "Post_authorId_idx_e47547ed" on "Post"
├─ Add foreign key "Post_authorId_fkey" on "Post"
├─ Add column "phone" to "User"
└─ marker a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d

✔ Advanced ref "db" → a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
→ Check every space against the database: prisma migration status
[exit 0]

$ npx prisma db verify
▸ Connecting to database...
✔ Connecting to database...
▸ Verifying database marker...
✔ Verifying database marker...
▸ Introspecting database schema
✔ Introspecting database schema
▸ Verifying contract spaces
✔ Verifying contract spaces
│  contract:  src/prisma/contract.json
│  mode:      full (marker + schema, tolerant)
│  database:  postgresql://****@localhost:54329/mydb

✔ Database marker and schema match contract

storageHash:  a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
profileHash:  3916f444a8a17ad749191acf9e08dad97d1a327b88c2f1d45d12f240296aa8b2
[exit 0]

        List of relations
 Schema | Name | Type  |  Owner   
--------+------+-------+----------
 public | Post | table | postgres
 public | User | table | postgres
(2 rows)

```

## 4. E5: db verify --schema-only

Verdict: MATCH. Log: `e5.log`. The tables in `mydb` matched the contract (H2) throughout the first three cases.

| Database state | `db verify` | `db verify --schema-only` |
| --- | --- | --- |
| Marker changed to H1 | exit 4, `CONTRACT.MARKER_MISMATCH` | exit 0, `Database schema satisfies contract` |
| Marker row deleted | exit 4, `CONTRACT.MARKER_MISSING` | exit 0 |
| `prisma_contract` schema dropped | exit 4, `CONTRACT.MARKER_MISSING` | exit 0 |
| `phone` column changed to `integer` | not run | exit 4, `CONTRACT.SCHEMA_VERIFICATION_FAILED`, `mismatch: database/public/User/column:phone` |
| Extra table `extra` | not run | exit 0; with `--strict`, exit 4 with `CONTRACT.MARKER_REQUIRED` (the marker schema was still dropped in this run) |

The mode line reads `mode: schema only (tolerant)`, and the marker step (`Verifying database marker...`) does not run.

```text
--- marker set to the baseline hash (tables match the contract a4c3fa7)
UPDATE 1
✔ Connecting to database...
✘ Verifying database marker...
│  mode:      full (marker + schema, tolerant)
✘ Hash mismatch
✘ [CONTRACT.MARKER_MISMATCH] Hash mismatch
  why: Contract storageHash does not match database marker
[exit 4]
✔ Introspecting database schema
✔ Verifying contract spaces
│  mode:      schema only (tolerant)
✔ Database schema satisfies contract
[exit 0]
--- marker row deleted
DELETE 1
✔ Connecting to database...
✘ Verifying database marker...
│  mode:      full (marker + schema, tolerant)
✘ Marker missing
✘ [CONTRACT.MARKER_MISSING] Database not signed
  why: No database signature (marker) found
[exit 4]
✔ Introspecting database schema
✔ Verifying contract spaces
│  mode:      schema only (tolerant)
✔ Database schema satisfies contract
[exit 0]
--- prisma_contract schema dropped
DETAIL:  drop cascades to table prisma_contract.marker
drop cascades to table prisma_contract.ledger
drop cascades to table prisma_contract.contract
DROP SCHEMA
✔ Connecting to database...
✘ Verifying database marker...
│  mode:      full (marker + schema, tolerant)
✘ Marker missing
✘ [CONTRACT.MARKER_MISSING] Database not signed
  why: No database signature (marker) found
[exit 4]
✔ Introspecting database schema
✔ Verifying contract spaces
│  mode:      schema only (tolerant)
✔ Database schema satisfies contract
[exit 0]
--- column type differs: phone is integer
ALTER TABLE
✔ Introspecting database schema
✔ Verifying contract spaces
│  mode:      schema only (tolerant)
✘ Schema issues
✘ Database schema does not satisfy contract (1 failure)
✘ [CONTRACT.SCHEMA_VERIFICATION_FAILED] Database schema does not satisfy contract (1 failure)
  why: The live schema differs: mismatch: database/public/User/column:phone.
[exit 4]
--- extra table, tolerant and strict
ALTER TABLE
CREATE TABLE
✔ Introspecting database schema
✔ Verifying contract spaces
│  mode:      schema only (tolerant)
✔ Database schema satisfies contract
[exit 0]
✔ Introspecting database schema
✔ Verifying contract spaces
│  mode:      schema only (strict)
✘ Unclaimed elements (declared by no contract)
✘ Database schema has 1 unclaimed element (not in any contract)
✘ [CONTRACT.MARKER_REQUIRED] Database schema has 1 unclaimed element (not in any contract)
[exit 4]
```

## 5. E6: migrationHash

Verdict: MATCH. Logs: `e6a.log`, `e6b.log`.

| Fact | Result |
| --- | --- |
| `migrationHash` changes when `ops.json` changes | Editing a label in `ops.json` by hand: `migration check` exits 4 with `MIGRATION.CHECK_HASH_MISMATCH`, stored `e8a4473f...`, recomputed `ee7fa1f0...` |
| It changes when the rest of `migration.json` changes | Editing `createdAt` by hand: exit 4, same code, recomputed `7cb600a3...` |
| Recompiling writes a new hash | After changing `migration.ts` and running `node migrations/app/<dir>/migration.ts`, `migrationHash` became `d9739ea1...` and `migration check` passed. Recompiling with no change kept `e8a4473f...` and kept `createdAt`. |
| `migration show` takes a `migrationHash` prefix | Full hash, 12 characters, and 6 characters: exit 0. 5 characters: exit 2, `MIGRATION.REF_NOT_FOUND` |
| `migration show` with a contract hash prefix | exit 2, `MIGRATION.REF_WRONG_GRAMMAR`, "Hash matched a contract but not a migration" |
| `migration show` with a ref name | exit 2, `MIGRATION.REF_WRONG_GRAMMAR` |
| `migration show` with a directory name or a directory path | exit 0 (`migration show` does accept a path to the migration directory; this is a migration reference, not a contract reference) |
| `--from` and `--to` with a `migrationHash` prefix | exit 2, `MIGRATION.REF_NOT_FOUND` on `migration status --from`, `migration status --to`, `migration plan --from`, `db migrate --show --to`, `db migrate --show --from` |

`migration.json` has five fields: `from`, `to`, `providedInvariants`, `createdAt`, `migrationHash`.

```text
$ npx prisma migration check
│  migrations:  migrations/app

✔ All checks passed
[exit 0]

--- A: hand edit ops.json (label text)
$ npx prisma migration check
│  migrations:  migrations/app

✘ 1 integrity failure(s)

✘ [MIGRATION.CHECK_HASH_MISMATCH] migrations/app/20260929T1558_add_user_phone/migration.json: Stored hash e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd does not match recomputed hash ee7fa1f0bc645d70eb56c16b8c258ef08920587bc23a0438b4ec73ebee91f09a
→ Re-emit the migration package, or restore it from version control
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.CHECK_HASH_MISMATCH
[exit 4]

$ npx prisma migration check 20260929T1558_add_user_phone
│  migrations:  migrations/app
│  target:      20260929T1558_add_user_phone

✘ 1 integrity failure(s)

✘ [MIGRATION.CHECK_HASH_MISMATCH] migrations/app/20260929T1558_add_user_phone/migration.json: Stored hash e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd does not match recomputed hash ee7fa1f0bc645d70eb56c16b8c258ef08920587bc23a0438b4ec73ebee91f09a
→ Re-emit the migration package, or restore it from version control
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.CHECK_HASH_MISMATCH
[exit 4]

$ npx prisma db migrate --show --db postgresql://postgres@localhost:54329/gaps
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/gaps

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  ↑ will run
○   91e7f9f  @db (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f
○   ∅

ℹ The following 1 migration will run:

  20260929T1558_add_user_phone  91e7f9f → a4c3fa7
[exit 0]

--- B: hand edit migration.json (createdAt)
5:  "createdAt": "2026-09-29T15:58:04.319Z",
5:  "createdAt": "2026-09-28T15:58:04.319Z",
$ npx prisma migration check
│  migrations:  migrations/app

✘ 1 integrity failure(s)

✘ [MIGRATION.CHECK_HASH_MISMATCH] migrations/app/20260929T1558_add_user_phone/migration.json: Stored hash e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd does not match recomputed hash 7cb600a382b12cf734cdee243fdde56158b7bc120665848cab6be5532d5d8a41
→ Re-emit the migration package, or restore it from version control
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.CHECK_HASH_MISMATCH
[exit 4]

--- C: edit migration.ts and recompile
```


```text
--- C: edit migration.ts (phone column becomes varchar) and recompile
$ node migrations/app/20260929T1558_add_user_phone/migration.ts
Wrote ops.json + migration.json to /Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/work/migrations/app/20260929T1558_add_user_phone
[exit 0]
5:  "createdAt": "2026-09-29T15:58:04.319Z",
6:  "migrationHash": "d9739ea14ce921b6bc042fba10b0cf9f641b5bcfe0f7ff1e9adf76b9e44be13d"
29:        "sql": "ALTER TABLE \"public\".\"User\" ADD COLUMN \"phone\" varchar"
$ npx prisma migration check
│  migrations:  migrations/app

✔ All checks passed
[exit 0]

--- recompile with no change
$ node migrations/app/20260929T1558_add_user_phone/migration.ts
Wrote ops.json + migration.json to /Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/work/migrations/app/20260929T1558_add_user_phone
5:  "createdAt": "2026-09-29T15:58:04.319Z",
6:  "migrationHash": "e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd"
--- migration show forms
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  target:      e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
✔ 20260929T1558_add_user_phone
from:     91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:       a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
hash:     e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
[exit 0]
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  target:      e8a4473fb1ef
✔ 20260929T1558_add_user_phone
from:     91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:       a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
hash:     e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
[exit 0]
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  target:      e8a447
✔ 20260929T1558_add_user_phone
from:     91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:       a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
hash:     e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
[exit 0]
✘ [MIGRATION.REF_NOT_FOUND] Not a known migration reference: "e8a44"
  why: No migration matching "e8a44" exists in the migration graph or refs index.
→ Provide a valid migration directory name or migration hash.
[exit 2]
✘ [MIGRATION.REF_WRONG_GRAMMAR] Hash matched a contract but not a migration
  why: Hash matched a contract but not a migration
→ Use a contract-accepting flag like `--to` or `--from` to reference contracts by hash. Pass `migration show <dir>` for a specific migration.
[exit 2]
✘ [MIGRATION.REF_WRONG_GRAMMAR] Hash matched a contract but not a migration
  why: Hash matched a contract but not a migration
→ Use a contract-accepting flag like `--to` or `--from` to reference contracts by hash. Pass `migration show <dir>` for a specific migration.
[exit 2]
✘ [MIGRATION.REF_WRONG_GRAMMAR] Hash matched a contract but not a migration
  why: Hash matched a contract but not a migration
→ Use a contract-accepting flag like `--to` or `--from` to reference contracts by hash. Pass `migration show <dir>` for a specific migration.
[exit 2]
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  target:      20260929T1558_add_user_phone
✔ 20260929T1558_add_user_phone
from:     91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:       a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
hash:     e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
[exit 0]
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  target:      migrations/app/20260929T1558_add_user_phone
✔ 20260929T1558_add_user_phone
from:     91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:       a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
hash:     e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
[exit 0]
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  target:      ./migrations/app/20260929T1558_add_user_phone
✔ 20260929T1558_add_user_phone
from:     91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
to:       a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
hash:     e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd
[exit 0]
✘ [MIGRATION.REF_WRONG_GRAMMAR] "prod" is a ref name, not a migration
  why: "prod" is a ref name, not a migration
→ Refs point at contracts, not migrations. Use a migration directory name or migration hash.
[exit 2]
--- --from/--to with a migrationHash prefix
$ npx prisma migration status --from e8a4473fb1ef
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "e8a4473fb1ef"
  why: No contract matching "e8a4473fb1ef" exists in the migration graph or refs index.
→ Provide a valid contract hash, ref name, or migration directory name.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.REF_NOT_FOUND
[exit 2]

$ npx prisma migration status --to e8a4473fb1ef --db postgresql://postgres@localhost:54329/gaps
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "e8a4473fb1ef"
  why: No contract matching "e8a4473fb1ef" exists in the migration graph or refs index.
→ Provide a valid contract hash, ref name, or migration directory name.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.REF_NOT_FOUND
[exit 2]

$ npx prisma migration plan --from e8a4473fb1ef --name t
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "e8a4473fb1ef"
  why: No contract matching "e8a4473fb1ef" exists in the migration graph or refs index.
→ Provide a valid contract hash, ref name, or migration directory name.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.REF_NOT_FOUND
[exit 2]

$ npx prisma db migrate --show --to e8a4473fb1ef --db postgresql://postgres@localhost:54329/gaps
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "e8a4473fb1ef"
  why: No contract matching "e8a4473fb1ef" exists in the migration graph or refs index.
→ Provide a valid contract hash, ref name, or migration directory name.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.REF_NOT_FOUND
[exit 2]

$ npx prisma db migrate --show --from e8a4473fb1ef --db postgresql://postgres@localhost:54329/gaps
✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "e8a4473fb1ef"
  why: No contract matching "e8a4473fb1ef" exists in the migration graph or refs index.
→ Provide a valid contract hash, ref name, or migration directory name.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.REF_NOT_FOUND
[exit 2]

```

## 6. E7: migration status

Verdict: MATCH with amendment 2, and one DIFFERS note for `--json`. Log: `e7.log`.

Sample output, exactly as printed, with one migration applied and one pending, before the `prod` ref existed:

```text
$ npx prisma migration status
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/gaps

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  @db (db)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

```

The CLI does not indent the drawing. The spec's shape reference differs in two ways: the hint prints `prisma`, not `{bin}`, and the applied row ends with `✓ applied`.

| Fact | Result |
| --- | --- |
| Hints print `prisma` or `{bin}` | Human output: `prisma`. `--json`: `{bin}` in `result.summary` and `result.diagnostics[].hints`; the envelope's `nextActions[].command` prints `prisma`. |
| `--space app` | exit 0; adds the header line `space: app`; same drawing |
| `--space nosuch` | exit 2, `MIGRATION.SPACE_NOT_FOUND`, "No directory named "nosuch" exists under the migrations root", "Pick one of: app" |
| `--from <hash> --to <dir>` with an unreachable `--db` | exit 0, prints `1 pending`; header shows `from: 91e7f9f` and no `database:` line |
| `--from <hash> --to <dir>` with no database configured | exit 0, same output |
| `--from <hash>` alone with no database | exit 0 |
| `--to <dir>` alone with no database configured | exit 2, `CONFIG.DB_CONNECTION_REQUIRED` |
| `--to <dir>` alone with an unreachable `--db` | exit 2, `DRIVER.CONNECTION_FAILED` |
| No options, no database configured | exit 2, `CONFIG.DB_CONNECTION_REQUIRED` |

```text
$ npx prisma migration ref set prod 91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
✔ Set ref "prod" → 91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e
[exit 0]

{
  "hash": "91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e",
  "invariants": []
}
$ npx prisma migration status
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/gaps

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  @db (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

$ npx prisma migration status --space app
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/gaps
│  space:       app

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  @db (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

$ npx prisma migration status --space nosuch
✘ [MIGRATION.SPACE_NOT_FOUND] Unknown contract space: nosuch
  why: No directory named "nosuch" exists under the migrations root.
→ Pick one of: app
→ See every space's migrations: prisma migration list
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.SPACE_NOT_FOUND
[exit 2]

$ npx prisma migration status --legend
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/gaps

Legend:
  ○ contract   ↑ forward   ↓ rollback
  ⟲ migration without schema change
  ✓ applied   ⧗ pending
  ∅ empty database (baseline)
  @contract @db reserved markers — also typeable as --from/--to tokens
  (prod, staging) user-defined refs
  aaaaaa → bbbbbb   migration from contract aaaaaa to bbbbbb

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  @db (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

$ npx prisma migration status --json
{"kind":"result","envelope":{"ok":true,"commandId":"migration.status","result":{"ok":true,"spaces":[{"space":"app","currentContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","targetContract":"a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d","migrations":[{"name":"20260929T1558_baseline","hash":"20baf4b21cbbaf9e51fcec754bfb9146733993cb4f2a05c0021a51bbb2156caf","fromContract":null,"toContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","operationCount":6,"createdAt":"2026-09-29T15:58:01.936Z","refs":["db","prod"],"providedInvariants":[],"status":"applied"},{"name":"20260929T1558_add_user_phone","hash":"e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd","fromContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","toContract":"a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d","operationCount":1,"createdAt":"2026-09-29T15:58:04.319Z","refs":[],"providedInvariants":[],"status":"pending"}]}],"summary":"1 pending — run `{bin} db migrate --to a4c3fa7fc3b2`","diagnostics":[]},"exitCode":0,"diagnostics":[],"nextActions":[]},"commandId":"migration.status","timestamp":"2026-09-29T15:58:26.947Z"}
[exit 0]

$ npx prisma migration status --from 91e7f9f --to 20260929T1558_add_user_phone --db postgresql://postgres@localhost:1/nope
│  migrations:  migrations
│  from:        91e7f9f

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

$ npx prisma migration status --from 91e7f9f --to 20260929T1558_add_user_phone
│  migrations:  migrations
│  from:        91e7f9f

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

$ npx prisma migration status --to 20260929T1558_add_user_phone
✘ [CONFIG.DB_CONNECTION_REQUIRED] Database connection is required
  why: migration status needs a database connection to read the marker and ledger (or pass --from for an offline path preview)
→ Run `prisma migration status --from <contract>`, or set `db: { connection: "postgres://…" }` in prisma.config.ts
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONFIG.DB_CONNECTION_REQUIRED
[exit 2]

$ npx prisma migration status
✘ [CONFIG.DB_CONNECTION_REQUIRED] Database connection is required
  why: migration status needs a database connection to read the marker and ledger (or pass --from for an offline path preview)
→ Run `prisma migration status --from <contract>`, or set `db: { connection: "postgres://…" }` in prisma.config.ts
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONFIG.DB_CONNECTION_REQUIRED
[exit 2]

$ npx prisma migration status --from 91e7f9f
│  migrations:  migrations
│  from:        91e7f9f

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ⧗ pending
○   91e7f9f  (db, prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops
○   ∅

⚠ 1 pending — run `prisma db migrate --to a4c3fa7fc3b2`
[exit 0]

$ npx prisma migration status --to 20260929T1558_add_user_phone --db postgresql://postgres@localhost:1/nope
✘ [DRIVER.CONNECTION_FAILED] Database connection failed
  why:
→ Verify the database URL, ensure the database is reachable, and confirm credentials/permissions
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/DRIVER.CONNECTION_FAILED
[exit 2]

```

## 7. E10: marker outside the history

Verdict: MATCH. Log: `e10.log`. Steps: database migrated to H2, then a `bio` field added to the contract, `contract emit` (new hash `3a5ec3f...`), `db update`, and no migration planned.

| Case | `migration status` | `migration status --json` diagnostics | `db migrate` | `db migrate --show` |
| --- | --- | --- | --- | --- |
| 1. `contract.json` is the new state, same as the marker | exit 0, `Up to date`, no warning; draws `3a5ec3f @contract @db (db)` detached above the history | empty | exit 2, `MIGRATION.MARKER_MISMATCH` | exit 0, `Already up to date` |
| 2. `contract.json` back at H2, marker still `3a5ec3f` | exit 0, warns with `MIGRATION.MARKER_NOT_IN_HISTORY` | one entry, code `MIGRATION.MARKER_NOT_IN_HISTORY`, severity `warn` | exit 2, `MIGRATION.MARKER_MISMATCH` | exit 2, `MIGRATION.PATH_UNREACHABLE` |

So `migration status` does not warn in every such case, and the next `db migrate` fails with `MIGRATION.MARKER_MISMATCH` in both. The spec's instruction to word the text so it holds either way still applies on rc.19.

```text
--- case 1: contract.json is the new state (same as the marker)
$ npx prisma migration status
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/mydb

○   3a5ec3f  @contract @db (db)

○   a4c3fa7
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ✓ applied
○   91e7f9f  (prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

✔ Up to date
[exit 0]

$ npx prisma migration status --json
{"kind":"result","envelope":{"ok":true,"commandId":"migration.status","result":{"ok":true,"spaces":[{"space":"app","currentContract":"3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5","targetContract":"3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5","migrations":[{"name":"20260929T1558_baseline","hash":"20baf4b21cbbaf9e51fcec754bfb9146733993cb4f2a05c0021a51bbb2156caf","fromContract":null,"toContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","operationCount":6,"createdAt":"2026-09-29T15:58:01.936Z","refs":["prod"],"providedInvariants":[],"status":"applied"},{"name":"20260929T1558_add_user_phone","hash":"e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd","fromContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","toContract":"a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d","operationCount":1,"createdAt":"2026-09-29T15:58:04.319Z","refs":[],"providedInvariants":[],"status":"applied"}]}],"summary":"Up to date","diagnostics":[]},"exitCode":0,"diagnostics":[],"nextActions":[]},"commandId":"migration.status","timestamp":"2026-09-29T16:08:12.294Z"}
[exit 0]

$ npx prisma db migrate
✘ [MIGRATION.MARKER_MISMATCH] Database marker is not reachable in the on-disk migration graph
  why: DB marker is 3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5, but the on-disk migration graph reaches: 91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e, a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d, empty.
→ Catch the on-disk graph up to the live marker: prisma migration plan --from <contract>
→ Point the local db ref at the live marker: prisma migration ref set db 3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5
→ Investigate whether the database was migrated by an out-of-band process
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.MARKER_MISMATCH
[exit 2]

$ npx prisma db migrate --show
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/mydb

○   3a5ec3f  @contract @db (db)

○   a4c3fa7
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7
○   91e7f9f  (prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f
○   ∅

ℹ Already up to date — nothing to run
[exit 0]

--- case 2: contract.json back at a4c3fa7 (in the history), marker still outside
storageHash:    a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
$ npx prisma migration status
│  migrations:  migrations
│  database:    postgresql://****@localhost:54329/mydb

○   a4c3fa7  @contract
│↑  20260929T1558_add_user_phone  91e7f9f → a4c3fa7  1 ops  ✓ applied
○   91e7f9f  (prod)
│↑  20260929T1558_baseline              ∅ → 91e7f9f  6 ops  ✓ applied
○   ∅

⚠ Database marker 3a5ec3f2e077 is not in the on-disk migration graph

⚠ [MIGRATION.MARKER_NOT_IN_HISTORY] Database was updated outside the migration system (marker for space "app" does not match any migration)
  why: The marker the database carries names no contract in the on-disk migration graph.
→ Overwrite the marker if the database already matches the contract: prisma db sign
→ Or push the current contract to the database: prisma db update
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.MARKER_NOT_IN_HISTORY
[exit 0]

$ npx prisma migration status --json
{"kind":"result","envelope":{"ok":true,"commandId":"migration.status","result":{"ok":true,"spaces":[{"space":"app","currentContract":"3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5","targetContract":"a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d","migrations":[{"name":"20260929T1558_baseline","hash":"20baf4b21cbbaf9e51fcec754bfb9146733993cb4f2a05c0021a51bbb2156caf","fromContract":null,"toContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","operationCount":6,"createdAt":"2026-09-29T15:58:01.936Z","refs":["prod"],"providedInvariants":[],"status":"applied"},{"name":"20260929T1558_add_user_phone","hash":"e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd","fromContract":"91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e","toContract":"a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d","operationCount":1,"createdAt":"2026-09-29T15:58:04.319Z","refs":[],"providedInvariants":[],"status":"applied"}]}],"summary":"Database marker 3a5ec3f2e077 is not in the on-disk migration graph","diagnostics":[{"code":"MIGRATION.MARKER_NOT_IN_HISTORY","severity":"warn","message":"Database was updated outside the migration system (marker for space \"app\" does not match any migration)","hints":["Run '{bin} db sign' to overwrite the marker if the database already matches the contract","Run '{bin} db update' to push the current contract to the database"]}]},"exitCode":0,"diagnostics":[{"code":"MIGRATION.MARKER_NOT_IN_HISTORY","severity":"warn","summary":"Database was updated outside the migration system (marker for space \"app\" does not match any migration)","why":"The marker the database carries names no contract in the on-disk migration graph.","meta":{"space":"app"},"nextActions":[{"kind":"run-command","label":"Overwrite the marker if the database already matches the contract","command":"prisma db sign"},{"kind":"run-command","label":"Or push the current contract to the database","command":"prisma db update"}],"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.MARKER_NOT_IN_HISTORY"}],"nextActions":[]},"commandId":"migration.status","timestamp":"2026-09-29T16:09:03.399Z"}
[exit 0]

$ npx prisma db migrate
✘ [MIGRATION.MARKER_MISMATCH] Database marker is not reachable in the on-disk migration graph
  why: DB marker is 3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5, but the on-disk migration graph reaches: 91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e, a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d, empty.
→ Catch the on-disk graph up to the live marker: prisma migration plan --from <contract>
→ Point the local db ref at the live marker: prisma migration ref set db 3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5
→ Investigate whether the database was migrated by an out-of-band process
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.MARKER_MISMATCH
[exit 2]

$ npx prisma db migrate --show
✘ [MIGRATION.PATH_UNREACHABLE] No migration path from 3a5ec3f2e077f8 to a4c3fa7fc3b224 in space "app".
  why: The migration graph has no path from the from-state to the target in space "app".
→ Plan the missing edge: prisma migration plan
→ Apply it: prisma db migrate
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.PATH_UNREACHABLE
[exit 2]

✔ Connecting to database...
✘ Verifying database marker...
✘ Hash mismatch
✘ [CONTRACT.MARKER_MISMATCH] Hash mismatch
  why: Contract storageHash does not match database marker
[exit 4]
{
  "hash": "3a5ec3f2e077f8d0e90354a7279440b35e97f41fa3d4edb8e6e1d64b89afaaf5",
  "invariants": []
}
```

## 8. E9: init and orm init

Verdict: MATCH. Log: `e9.log`. Both ran in the empty directory `e9/`; neither wrote a file. I did not run `init` itself.

- `npx prisma@latest init --help`: "Prepare this repository for Prisma: config file, dev dependency, AI-agent skills". It adds a `postinstall` script that keeps the agent skills in sync, adds `prisma` to `devDependencies` when no dependency field declares it, scaffolds a `prisma.config.ts` that records which agents get skills, and syncs the skills once. It "runs locally and calls no platform API". It does not set up Prisma ORM.
- `npx prisma@latest orm init --help`: "Initialize a new Prisma ORM project". It "scaffolds config, schema, and runtime files, installs dependencies, and emits the contract".
- `apps/docs/content/docs/cli/init.mdx` says the same about `init`, except that it does not mention the `prisma` dev dependency.
- The `orm init` result on rc.19 itself points at `init`: "Working with a coding agent? Run `prisma init` in this project to set up the Prisma agent skills."

```text
$ npx prisma@latest --version
8.0.0-rc.19
[exit 0]
$ npx prisma@latest init --help
prisma init → Prepare this repository for Prisma: config file, dev dependency, AI-agent skills

│  Usage
│    $ prisma init [options]
│
│  Runs locally and calls no platform API. Adds a postinstall script to
│  package.json that keeps the Prisma agent skills in sync on every install,
│  adds prisma to devDependencies at this CLI's exact version when no
│  dependency field declares it, scaffolds a prisma.config.ts recording which
│  agents to install skills for, then syncs the skills once now. Everything
│  lands in the current directory; a prisma.config.ts or postinstall script
│  that already exists is never edited. Rerunning is safe: each step reports
│  what is already done. In a directory another prisma.config.ts already
│  governs, init writes only the prisma.config.ts scaffold — the postinstall
│  hook, the prisma dev dependency, and the skills sync belong at the
│  repository root and are skipped unless --postinstall or --skills asks for
│  them here.
│
│  Options
│      --postinstall/--no-postinstall  Add the skills-sync postinstall hook (--no-postinstall skips)
│      --skills <agents>               Agents to install skills for (comma-separated: claude, cursor, agents, devin); 'none' records that no agent skills are wanted
│
│  Global options also apply: --format, --json, --log-level, --verbose,
│  --quiet, --yes, --confirm, --interactive, --color, --config. Run 'prisma
│  --help' for details.
│
│  Examples
│    $ prisma init
│    $ prisma init --skills=claude,cursor
│    $ prisma init --skills=none
│    $ prisma init --no-postinstall

[exit 0]
$ npx prisma@latest orm init --help
prisma orm init → Initialize a new Prisma ORM project

│  Usage
│    $ prisma orm init [options]
│
│  Scaffolds config, schema, and runtime files, installs dependencies,
│  and emits the contract. Gets you from zero to typed queries in one step.
│
│  Run it interactively for a guided setup, or supply --target and --authoring
│  for a fully scriptable run (CI, AI coding agents, automation).
│
│  In a Prisma 7 project, pass --from-prisma7-schema (or answer yes when asked)
│  to use the existing schema.prisma as the contract source.
│
│  Options
│      --target <db>                 Database target: postgres or mongodb
│      --authoring <style>           Schema authoring style: psl or typescript
│      --schema-path <path>          Where to write the starter schema
│      --write-env                   Write a .env file from .env.example (gitignored)
│      --probe-db                    Connect to DATABASE_URL once and check the server version
│      --strict-probe                Treat a failed --probe-db as fatal
│      --skip-install                Skip dependency installation and contract emission
│      --keep-previous-facade        Keep the previous target package in package.json when switching targets
│      --from-prisma7-schema <path>  Use an existing Prisma 7 schema.prisma as the contract source
│
│  Global options also apply: --format, --json, --log-level, --verbose,
│  --quiet, --yes, --confirm, --interactive, --color, --config. Run 'prisma
│  --help' for details.
│
│  Examples
│    $ prisma orm init
│    $ prisma orm init --target postgres --authoring psl
│    $ prisma orm init --target mongodb --authoring typescript --json
│    $ prisma orm init --skip-install
│    $ prisma orm init --target postgres --keep-previous-facade
│    $ prisma orm init --from-prisma7-schema prisma/schema.prisma --confirm my-app
│
│  Docs  https://docs.prisma.io/docs/orm/v8/reference/error-reference/

[exit 0]
```

## 9. E8: db init lines that mention contract spaces

Verdict: MATCH. Log: `e4a.log`. `db init` on rc.19 prints these lines that mention spaces:

```text
▸ Initialising database across spaces
✔ Initialising database across spaces
✔ Applied 5 operation(s) across 1 contract space
App space
→ Confirm the space is up to date: prisma migration status
```

Full output:

```text
$ npx prisma db init
▸ Introspecting database schema
✔ Introspecting database schema
▸ Planning migration
✔ Planning migration
▸ Initialising database across spaces
✔ Initialising database across spaces
│  contract:  src/prisma/contract.json
│  database:  postgresql://****@localhost:54329/mydb

✔ Applied 5 operation(s) across 1 contract space

App space
├─ Create table "Post"
├─ Create table "User"
├─ Add unique constraint on "User" (email)
├─ Create index "Post_authorId_idx_e47547ed" on "Post"
├─ Add foreign key "Post_authorId_fkey" on "Post"
└─ marker a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d

✔ Advanced ref "db" → a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
→ Confirm the space is up to date: prisma migration status
[exit 0]
```

For comparison, `db migrate` prints `Running migration plan across spaces` and `Applied 2 migration(s) (7 operation(s)) across 1 contract space(s)`, and `db update` prints `Updating database across spaces` and `Applied 1 operation(s) across 1 contract space`.

## Hand-edited migration files and db migrate

**Verdict: the page's claim is TRUE on rc.19, for both `ops.json` and `migration.json`.** `db migrate --to <ref>` and plain `db migrate` both refuse a pending migration whose files were edited by hand, and they apply nothing.

Script: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/handedit.sh`. Full output: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/handedit.log`. Project: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/typescript-module-nodenext-upgrade-36b97c/wip/gaps/handedit`, a copy of `app` (with `node_modules` symlinked to the original). The original `app` was not changed.

Method: each run used a new database. I restored `migrations/` from `migrations.pristine`, ran `db migrate --to prod` to bring the database to H1, then edited `20260929T1558_add_user_phone`, which was pending. I did not recompile after the edit.

- Edit 1, `ops.json`: replaced every `phone` with `mobile` (9 lines). The edited operation is consistent, so it would run if the CLI did not refuse it.
- Edit 2, `migration.json`: set `createdAt` to `2020-01-01T00:00:00.000Z`.

| Case | Command | Exit | Result | Applied to the database |
| --- | --- | --- | --- | --- |
| `ops.json` edited | `npx prisma migration check` | 4 | `MIGRATION.CHECK_HASH_MISMATCH` | not applicable |
| `ops.json` edited | `npx prisma db migrate --to <H2>` | 2 | `MIGRATION.CONTRACT_SPACE_VIOLATION` | Nothing. `User` has no `phone` or `mobile` column, marker is still H1. |
| `ops.json` edited | `npx prisma db migrate` | 2 | `MIGRATION.CONTRACT_SPACE_VIOLATION` | Nothing. Marker is still H1. |
| `ops.json` edited | `npx prisma migration status` | 2 | `MIGRATION.CONTRACT_SPACE_VIOLATION` | not applicable |
| `migration.json` edited | `npx prisma migration check` | 4 | `MIGRATION.CHECK_HASH_MISMATCH` | not applicable |
| `migration.json` edited | `npx prisma db migrate --to <H2>` | 2 | `MIGRATION.CONTRACT_SPACE_VIOLATION` | Nothing. Marker is still H1. |
| `migration.json` edited | `npx prisma db migrate` | 2 | `MIGRATION.CONTRACT_SPACE_VIOLATION` | Nothing. Marker is still H1. |
| `migration.json` edited | `npx prisma migration status` | 2 | `MIGRATION.CONTRACT_SPACE_VIOLATION` | not applicable |
| Control, no edit | `npx prisma db migrate --to <H2>` | 0 | `Applied 1 migration(s) (1 operation(s))` | `User.phone` exists, marker is H2, `migration status` prints `Up to date`. |
| Control, no edit | `npx prisma db migrate` | 0 | `Applied 1 migration(s) (1 operation(s))` | `User.phone` exists, marker is H2. |

Output of `db migrate --to a4c3fa7f...` with `ops.json` edited (plain `db migrate` and `migration status` print the same text):

```
✘ [MIGRATION.CONTRACT_SPACE_VIOLATION] Contract-space integrity failure for "app"
  why: Migration "20260929T1558_add_user_phone" stored hash "e8a4473fb1ef2d26610f7ea0bcfc2823a716b347280796b0321f8289c74867bd" does not match computed hash "f1851424ed4cce1536b3be013067aac87cc21727b14f72283da45cd776b6cb57".
→ Re-emit the affected migration package(s) or restore the on-disk `<project>/migrations` directory from version control.
  docs: https://pris.ly/contract-spaces
[exit 2]
```

With `migration.json` edited the text is the same, and the computed hash is `040af674c50f42ad730b29a0d1b987c7fa03344683d7646ecceab6d5d61e3a2d`.

Output of `migration check` with `ops.json` edited:

```
│  migrations:  migrations/app

✘ 1 integrity failure(s)

✘ [MIGRATION.CHECK_HASH_MISMATCH] migrations/app/20260929T1558_add_user_phone/migration.json: Stored hash e8a4473f... does not match recomputed hash f1851424...
→ Re-emit the migration package, or restore it from version control
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/MIGRATION.CHECK_HASH_MISMATCH
[exit 4]
```

Database check after each refused run: `psql` listed the columns of `User` as `createdAt email id name updatedAt username`, and `prisma_contract.marker` held `91e7f9f0...` (H1).

Notes for the page author:

- The two commands report the same problem with different codes and exit codes. `migration check` uses `MIGRATION.CHECK_HASH_MISMATCH` and exit 4. `db migrate` and `migration status` use `MIGRATION.CONTRACT_SPACE_VIOLATION` and exit 2.
- `db migrate` checks the files before it connects. In a first run the PostgreSQL server was down, and `db migrate` still printed `MIGRATION.CONTRACT_SPACE_VIOLATION`, not `DRIVER.CONNECTION_FAILED`.
- `db migrate --show` is different: section 5 (E6) found that it prints the route for a hand-edited `ops.json` and does not refuse.
- Not tested: an edit to a migration that is already applied and not on the route, an edit where the author also rewrites `migrationHash` to match, and an edit to a snapshot or a ref file.

## Dropping both schemas without recreating public

**Verdict: no, the reader does not have to run `CREATE SCHEMA public` first. This holds for `db migrate` and for `db init`.** Both commands create the `public` schema themselves as their first operation.

Script and log: the same `handedit.sh` and `handedit.log`. Each case used a new database with both migrations applied (marker at H2). Then:

```
DROP SCHEMA public CASCADE;
DROP SCHEMA prisma_contract CASCADE;
```

After the two statements the database had no schema other than the system schemas.

| Case | Command | Exit | Result |
| --- | --- | --- | --- |
| `db migrate` | `npx prisma db migrate --advance-ref db` | 0 | `Applied 2 migration(s) (7 operation(s))`. First operation: `Create schema "public"`. Ref `db` advanced to H2. |
| `db migrate` | `npx prisma db verify` | 0 | `Database marker and schema match contract` |
| `db init` | `npx prisma db init` | 0 | `Applied 6 operation(s) across 1 contract space`. First operation: `Create schema "public"`. Ref `db` advanced to H2. |
| `db init` | `npx prisma db verify` | 0 | `Database marker and schema match contract` |

Output of `db migrate --advance-ref db`:

```
✔ Applied 2 migration(s) (7 operation(s)) across 1 contract space(s)

App space
├─ Create schema "public"
├─ Create table "Post"
├─ Create table "User"
├─ Add unique constraint on "User" (email)
├─ Create index "Post_authorId_idx_e47547ed" on "Post"
├─ Add foreign key "Post_authorId_fkey" on "Post"
├─ Add column "phone" to "User"
└─ marker a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d

✔ Advanced ref "db" → a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
```

Output of `db init`:

```
✔ Applied 6 operation(s) across 1 contract space

App space
├─ Create schema "public"
├─ Create table "Post"
├─ Create table "User"
├─ Add unique constraint on "User" (email)
├─ Create index "Post_authorId_idx_e47547ed" on "Post"
├─ Add foreign key "Post_authorId_fkey" on "Post"
└─ marker a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d

✔ Advanced ref "db" → a4c3fa7fc3b224675893305ff2fdd24588acbe11ab44cfd67d7d0e14e61d0a2d
[exit 0]
```

After each command `psql` listed the schemas `prisma_contract` and `public`, and the tables `public.User`, `public.Post`, `prisma_contract.marker`, `prisma_contract.ledger`, and `prisma_contract.contract`.

Two details: `db init` advanced the ref `db` without any flag. The contract in this project keeps its models in `public`; I did not test a contract that uses another schema.

PostgreSQL was stopped at the end of the run (`pg_ctl stop`, "server stopped"). To start it in this shell, `LC_ALL=en_US.UTF-8` must be set; without it the server exits with `postmaster became multithreaded during startup`.
