# Release check: inventory entries O1 to O24 (prisma/orm)

Checked against ORM `v8.0.0-rc.25` (read with `git show` in `/Users/wmadden/Projects/prisma/orm/.claude/worktrees/actaeon-80-ga-compatibility`), the `prisma` CLI `8.0.0-rc.35` and `create-prisma` `v0.14.10`. Docs are `origin/main` at `6c765c503`. Line numbers below are on that commit.

Reproductions ran in `/Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678/wip/release-check/o-first/p2`: `npm init -y`, `npx prisma@8.0.0-rc.35 orm init --yes --target postgres --authoring psl` (it installed `@prisma/orm-postgres` 8.0.0-rc.25 and `prisma` 8.0.0-rc.35), Homebrew PostgreSQL 15 on port 54347. The commands run were the published `node_modules/.bin/prisma`.

## Summary

| Entry | Verdict | Docs change needed |
| --- | --- | --- |
| O1 (leftovers only) | fixed in the release; no passage on `origin/main` still works around it | none |
| O2 | partly fixed | delete the warning box in `studio/prisma-next.mdx:111-113` |
| O3 (leftovers only) | already removed from the docs | none |
| O4 (leftovers only) | already removed from the docs | none |
| O5 | still present (code only) | none |
| O6 | still present (code only, thin) | none |
| O7 | still present | none |
| O8 | partly fixed; both remaining passages still needed | none |
| O9 | still present | none |
| O10 | still present | none |
| O11 | still present | none |
| O12 | still present | none |
| O13 | still present | none |
| O14 | still present | none |
| O15 | still present | none |
| O16 | still present | none |
| O17 | still present | none |
| O18 | still present | none |
| O19 | still present | none |
| O20 | already removed from the docs (fixed in rc.25 by #31040, page already describes the new refusal) | none |
| O21 | still present | none |
| O22 | still present | none |
| O23 | partly fixed (before rc.25) | correct one sentence in `orm/supported-versions.mdx:48` |
| O24 | still present | none |

## O1 (leftovers only)

- **Verdict:** fixed in the release (prisma/orm#31169, commit `540820453c`, in `v8.0.0-rc.25`). No passage on `origin/main` still works around it.
- **Evidence:** reproduction: `migration plan --name init` then `db migrate --yes` with the connection from `prisma.config.ts` wrote `migrations/app/refs/db.json`. A grep for `advance-ref` across the current pages finds it only where it is still right: with `--db` (`cli/index.mdx:75, 101`, `cli/db-update.mdx:59, 145`, `cli/db-init.mdx:49`), `--no-advance-ref` for deploys, and the tables that describe the rc.25 rule. The framework guides now say `npm run migrate` does both steps; in `create-prisma` `v0.14.10`, `src/tasks/install.ts:46` defines `migrate` as `prisma db migrate`, which now advances the ref.
- **Docs change needed:** none. One redundant flag, not an O1 workaround: `(index)/prisma-orm/add-to-existing-project/mongodb.mdx:236` and `:241` run `npx prisma db update --advance-ref db` without `--db`, where `db update` advances `db` anyway. Optional cleanup.

## O2

- **Verdict:** partly fixed.
- **Evidence:**
  - With migrations on disk and no `db` ref, `migration plan` refuses (this was already so before rc.25; `errorPlanOriginUnknown` exists at rc.20). Reproduction, after moving `refs/db.json` away: `✘ [MIGRATION.PLAN_ORIGIN_UNKNOWN] Cannot determine the plan origin: migrations exist but no origin is named`. With #31169, `db migrate` now keeps the ref, so the studio page's flow never reaches that state.
  - With no migrations and no `db` ref, the plan still starts from an empty database with only a notice (`resolveFromForPlan` in `cli/src/control-api/operations/plan-resolution.ts` returns `greenfield`; `cli/migration-plan.mdx:14` documents the notice). `migration plan` does not read the database, so it cannot see that the MongoDB collections already exist. That is the case on the MongoDB page.
- **Docs change needed:** `studio/prisma-next.mdx:111-113`, the warning box: "Without a `db` ref and without `--from`, `migration plan` compares against an empty database and recreates every table. If that happens, delete the planned migration directory and re-plan with `--from <previous-migration-dir>` …". At that step migrations already exist, so the command refuses with `MIGRATION.PLAN_ORIGIN_UNKNOWN` and never recreates tables. Delete the box. Keep `(index)/prisma-orm/add-to-existing-project/mongodb.mdx:241`: the empty-graph case it describes still behaves that way.

## O3 and O4 (leftovers only)

- **Verdict:** already removed from the docs.
- **Evidence:** a grep for "Do not run the commands", "as the error prints", "Do not follow that hint" and "literally" finds nothing. `cli/db-migrate.mdx:106-135` now says to run the commands the error prints, which matches #31130 and #31174. `guides/database/schema-changes.mdx:366` shows the rc.25 `migration status` hint with `--from <contract>` and the list of tips, and tells the reader to run it once per tip.
- **Docs change needed:** none.

## O5

- **Verdict:** still present (code only).
- **Evidence:** nothing in `v8.0.0-rc.20..v8.0.0-rc.25` changes how the planner writes the `dataTransform` contract argument. I did not run a `--backfill` plan.
- **Docs change needed:** none.

## O6

- **Verdict:** still present (code only, thin evidence).
- **Evidence:** no commit in the range mentions a deterministic recompile or `@onUpdate`. Not reproduced.
- **Docs change needed:** none.

## O7

- **Verdict:** still present.
- **Evidence:** `resolveFromForPlan` at rc.25 still returns `defaultOriginForks` when the `db` ref's node already has outgoing edges, and the plan is still written with a warning.
- **Docs change needed:** none.

## O8

- **Verdict:** partly fixed. #31130 and #31174 fixed the printed `migration plan` commands (they now carry `--from`, and the docs' sample output at `orm/migrations/rollbacks-and-recovery.mdx:88-95` already shows that). The two parts the docs still work around remain.
- **Evidence:**
  - PostgreSQL precheck advice: `keepOptional` in `cli/src/utils/runner-failure-advice.ts:696-707` at rc.25 still says "make it optional in the contract source again, delete …, and plan it again with …" with no `contract emit` step. It still says to run the planned `migration.ts` and apply it, although `migration plan` writes nothing when the contract is back at the plan's start. So `rollbacks-and-recovery.mdx:98` is still needed.
  - MongoDB validator precheck: `mongo-runner.ts:1709-1721` (outside the CLI package, so outside #31174) still builds one message for both commands. It now adds "db update writes no migration.ts, so there fix the documents first", which the docs' sample output already shows. It still leads with "Change them with a dataTransform in migration.ts" and the `db migrate` alternative. `guides/switch-to-prisma-orm/from-mongoose.mdx:548` is still accurate and still needed.
- **Docs change needed:** none.

## O9

- **Verdict:** still present (code; no MongoDB server was available without Docker).
- **Evidence:** `planFieldFills` in `mongo/1-target/src/core/migrations/mongo-field-fills.ts:159-210` returns no fill when `temporaryValueOf` finds none (a `DateTime`) and adds no warning or refusal. The doc comment says such a field "is left to the validator change's document check".
- **Docs change needed:** none.

## O10

- **Verdict:** still present.
- **Evidence:** `errorStatementOriginUnknown` in `cli/src/utils/cli-errors.ts:960-1030` at rc.25 still refuses, and its fix text is the same three-step procedure, including "Adding --advance-ref to this command alone does not help".
- **Docs change needed:** none.

## O11

- **Verdict:** still present.
- **Evidence:** reproduction. After `db migrate` of the first migration, add a field, `contract emit`, `db update --yes` (`✔ Advanced ref "db" → 6e69751d…`), then `migration plan --name add-bio`:

  ```text
  ✘ [MIGRATION.HASH_NOT_IN_GRAPH] Resolved from-hash is not in the migration graph: 6e69751d…
  → Plan from an explicit origin with `prisma migration plan --from 920a87b5…`. No migration records contract 6e69751d….
  ```

  The guides' recovery works: `migration plan --from 20261126T0940_init --name add-bio`, then `db migrate --yes`, which advanced `db` to `6e69751d…`. The progress table in the inventory says #31169 fixed "most of O11". It did not: #31169 changes only `db migrate`.
- **Docs change needed:** none.

## O12

- **Verdict:** still present.
- **Evidence:** reproduction: `prisma migration ref set db @db` gives `✘ [MIGRATION.HASH_NOT_IN_GRAPH] Resolved contract hash is not in the migration graph: ` (an empty hash). `executeRefSetCommand` in `cli/src/control-api/operations/ref.ts` is offline, and `parseContractRef` returns `@db` with the placeholder hash `''`. The passages are still at `cli/migration-new.mdx:36`, `cli/migration-plan.mdx:16` and the `@db` row at `cli/migration-ref.mdx:54`.
- **Docs change needed:** none.

## O13

- **Verdict:** still present.
- **Evidence:** reproduction: `prisma migration ref set db migrations/app/20261126T0940_init` gives `✘ [MIGRATION.REF_NOT_FOUND] Not a known contract reference: "migrations/app/20261126T0940_init"`, while `… ref set db 20261126T0940_init` succeeds. `findEdgeByDirName` in `migration/src/refs/types.ts:102` compares the whole input with the directory name. #31174 does not touch this. The sentence is in every framework guide (for example `guides/frameworks/astro.mdx:128`) and `guides/runtimes/bun.mdx:197`.
- **Docs change needed:** none.

## O14

- **Verdict:** still present.
- **Evidence:** at rc.25, `migration check` raises `MIGRATION.CHECK_HASH_MISMATCH` (`migration-check.ts:589`), while the loader that `db migrate` and `migration status` use raises `MIGRATION.CONTRACT_SPACE_VIOLATION` (`contract-space-aggregate-loader.ts:39`). For snapshots, `CHECK_SNAPSHOT_CONTENT_MISMATCH` and `CONTRACT_SNAPSHOT_CONTENT_MISMATCH` are both still raised. The passages are at `orm/migrations/applying-a-migration.mdx:168` and `:172`.
- **Docs change needed:** none.

## O15

- **Verdict:** still present.
- **Evidence:** `migration-new.ts:147-180` at rc.25 matches `--from` only as a prefix of a migration's `to` hash; there is no `parseContractRef` call. The passage was reworded and is at `cli/migration-new.mdx:28`, with the table row at `cli/migration-ref.mdx:90`.
- **Docs change needed:** none.

## O16

- **Verdict:** still present.
- **Evidence:** reproduction. A table `secret` with row-level security and policy `secret_p`; `contract infer`; remove `model Secret` and `policy_all secret_p`; `contract emit`; `db sign`:

  ```text
  ✘ app: not signed, the schema does not satisfy its contract
  └─ ✘ extra: database/public/secret/secret_p
  ✘ [CONTRACT.SCHEMA_VERIFICATION_FAILED] Database schema does not satisfy contract (1 failure)
  ```

  The passage is at `(index)/prisma-orm/add-to-existing-project/postgresql.mdx:160`.
- **Docs change needed:** none.

## O17

- **Verdict:** still present. prisma/orm#30573 is open.
- **Evidence:** reproduction. With `other.thing` in a second schema, `contract infer --output inferred.prisma` wrote only `namespace public { … }` and printed no message about `other`. The passages are at `(index)/prisma-orm/add-to-existing-project/postgresql.mdx:180` and `orm/contract-authoring/advanced-postgresql.mdx:214`.
- **Docs change needed:** none.

## O18

- **Verdict:** still present.
- **Evidence:** reproduction. `contract emit` on the unedited inferred contract printed `[PN_EXACT_NAME_BODY_COMPARISON] Warning: policy "doc_owner" uses @@map with a SQL body …` for each policy and check. The code is `packages/2-sql-family/1-core/contract/src/index-naming.ts:106` (`EXACT_NAME_BODY_WARNING_CODE`), with the old `PN_` prefix. The passages are at `(index)/prisma-orm/add-to-existing-project/postgresql.mdx:213` and `orm/contract-authoring/advanced-postgresql.mdx:190`.
- **Docs change needed:** none.

## O19

- **Verdict:** still present. prisma/orm#30270 is open.
- **Evidence:** reproduction: `@@index([createdAt(sort: Desc)], map: "doc_created_idx")` then `contract emit` gives `PSL_INVALID_ATTRIBUTE_SYNTAX: Expected a field name`. The passage is at `orm/contract-authoring/advanced-postgresql.mdx:211`.
- **Docs change needed:** none. A related defect the docs do not mention is described under "Surprises" below.

## O20

- **Verdict:** already removed from the docs. Fixed in rc.25 by prisma/orm#31040 (prisma/orm#30445 closed 2026-11-18), and the workaround was replaced.
- **Evidence:** `PSL_UNSCOPED_INDEX_ON_STI_VARIANT` exists at rc.25 in `contract-psl/src/interpreter.ts`. `orm/contract-authoring/advanced-postgresql.mdx:212` now describes the refusal and says "Before `8.0.0-rc.25`, the foreign key, unique and index were dropped from the contract without a warning."
- **Docs change needed:** none.

## O21

- **Verdict:** still present. prisma/orm#30294 is open.
- **Evidence:** reproduction. `alter table doc add constraint doc_nonempty check (owner <> '')`, then `@@check(expression: sql\`owner <> ''\`, map: "doc_nonempty")` in the contract, `contract emit`, `db verify --schema-only`: `✘ mismatch: database/public/doc/check:doc_nonempty`. `db sign` refuses on the same mismatch. The passage is at `orm/contract-authoring/advanced-postgresql.mdx:213`.
- **Docs change needed:** none.

## O22

- **Verdict:** still present.
- **Evidence:** reproduction. With an edit appended to the configured `contract.prisma`, `contract infer` with no `--output` printed `Overwriting existing file: contract.prisma` and replaced the file; the edit was gone. The code is `cli/src/orm/contract/infer.ts:181-193`, and the help text says "overwritten, with a warning". The passages are at `cli/contract-infer.mdx:30` and `cli/index.mdx:82`.
- **Docs change needed:** none.

## O23

- **Verdict:** partly fixed, by prisma/orm#30360, which was already in `v8.0.0-rc.24`. `orm init` now keeps a `bundler` pair (`preserve` or `esnext`) and, in a `"type": "module"` package, a `nodenext` pair. The CommonJS case is unchanged.
- **Evidence:**
  - Reproduction in an `npm init -y` project (`"type": "commonjs"`): `orm init` printed `package.json declares "type": "commonjs" — keeping yours, but the scaffolded prisma/db.ts uses an ESM-only import attribute …`, left `"type": "commonjs"`, and wrote `module: preserve`. `node t.ts` importing `./src/prisma/db.ts` failed with `SyntaxError: Cannot use import statement outside a module`, and worked after switching to `"type": "module"`. A `contract.ts` source failed `contract emit` with `CONTRACT.SOURCE_LOAD_FAILED` (`Unexpected token 'export'`). So the repair steps in `orm/contract-authoring/typescript-schema-builder.mdx:49`, `guides/deployment/docker.mdx`, `guides/database/data-migration.mdx:46`, `guides/deployment/pnpm-workspaces.mdx:137` and `cli/orm-init.mdx` are still needed.
  - Code: `mergeTsConfig` and `NODE_MODULE_PAIRS` in `cli/src/commands/init/templates/tsconfig.ts` keep `nodenext` only when `package.json` has `"type": "module"`. `cli/orm-init.mdx:65-71` already describes this.
- **Docs change needed:** `orm/supported-versions.mdx:48`. Current: "If your project already has a `tsconfig.json`, `orm init` sets `module`, `moduleResolution`, and `resolveJsonModule` to those values, adds `node` to `types`, and keeps your other settings. An app that compiles with `tsc` and runs the output with `node` uses `"module": "nodenext"` and `"moduleResolution": "nodenext"` instead, so change them back after `orm init`." It should say that `orm init` keeps `module` and `moduleResolution` when they are already `bundler` with `preserve` or `esnext`, or `nodenext` in a package with `"type": "module"`, and otherwise sets `preserve` and `bundler`. So only a CommonJS app on `nodenext` has to set them back. Link to `cli/orm-init#in-a-commonjs-project`.

## O24

- **Verdict:** still present.
- **Evidence:** reproduction: the `prisma.config.ts` that `orm init` wrote starts `import { definePrismaConfig } from '@prisma/cli-engine';`. The template is `configFile` in `cli/src/commands/init/templates/code-templates.ts:18-31` at rc.25, and is still used by `init-scaffold.ts:227` after #31093. The passages are at `cli/orm-init.mdx:59` and `orm/contract-authoring/psl-syntax.mdx:128`.
- **Docs change needed:** none.

## Surprises

- **`contract infer` drops `DESC` from an index without a word.** A database index `create index doc_created_idx on doc (created_at desc)` was inferred as `@@index([createdAt], map: "doc_created_idx")`, with no comment in the file. `db sign` with that contract then succeeded, so the drift check does not notice the lost sort order either. `orm/contract-authoring/advanced-postgresql.mdx:214` says infer "leaves a comment in the file" for SQL it cannot read back; here it left none. This is a tool defect, not yet in the inventory.
- **The inventory's progress table is wrong about O11.** It says #31169 fixed "most of O11"; the reproduction shows O11 unchanged.
- **Scratch project side effect, now undone.** My first scratch project sat inside this worktree's pnpm workspace. `orm init` installed with pnpm into the worktree root (`node_modules/.pnpm`) and rewrote `pnpm-lock.yaml`, and then `contract emit` crashed with `Cannot read properties of undefined (reading 'needs')`, because the root's older `prisma` and `@prisma/cli-engine` were resolved. I restored `pnpm-lock.yaml` with `git checkout` and deleted that project. The extra packages are still in the root `node_modules`; the next `pnpm install` removes them. The second project used npm (a `package-lock.json` created first), and all results above come from it. Other agents writing scratch projects under `wip/` should create a `package-lock.json` before running `orm init`.
