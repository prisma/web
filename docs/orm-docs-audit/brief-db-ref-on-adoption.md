# Brief: set the `db` ref when a database is adopted

Written 2026-09-10 for an agent with no prior context. Repo: `prisma/orm` `main` (the Prisma 8 monorepo, rc.9; formerly `prisma/prisma`, and the old name still redirects).

## What we want

After adopting a database, the migration system knows the baseline. Concretely: `db sign` on a database with no prior signature should leave the project in a state where the next `migration plan` chains from the signed contract, with no extra commands.

The shape we have in mind: `db sign` records the signed contract hash as the baseline state and sets the `db` ref to it, writing the contract snapshot so the ref resolves. Whether that also needs a baseline migration package on disk, or whether a snapshot alone is enough for `migration plan` to chain from and for `migration status` to report cleanly, is for the implementer to determine from how the planner and status resolve origins.

Open questions to settle in the design, not to guess at:

1. Should `db sign` on an already-signed database (re-signing under a newer hash) also move the ref? Probably yes, for the same reason, but it changes an existing behaviour.
2. Does `db sign --db <url>` follow the same rule as `db init --db <url>` and skip the ref? The existing rule is that an explicit `--db` means "not my dev database, don't move my ref". Adoption is usually done against the real database, so the rule may be wrong for sign. Decide and document.
3. If the ref already exists and points elsewhere, refuse, overwrite, or require `--advance-ref`.
4. `migration plan` with no `--from`, no ref, and no migrations on disk currently plans silently from empty. Consider warning or refusing the same way it does when migrations exist, since after this change the silent case means "you never ran init, update, or sign".

## Acceptance

- A test in `test/integration/` that: creates tables directly, runs `contract infer`, `contract emit`, `db sign`, changes the contract, emits, runs `migration plan`, and asserts the plan contains only the delta.
- The same flow with `--db <url>` on `db sign`, asserting whichever behaviour the design settles on.
- `migration status` after `db sign` reports current and target hashes equal and nothing pending.
- Update the shipped skill: `skills/prisma-8/references/migration-model.md` ("The trap" section and the origin rules) and `references/quickstart.md` (the brownfield adoption path).
- Update the monorepo docs that describe the ref rules: `docs/glossary.md` under "Ref", and any release note for the version this ships in (`docs/releases/`).
- Record upgrade instructions if the behaviour change is user-visible (the `record-upgrade-instructions` skill).

The docs site (`prisma/web`) changes are handled separately; note in the PR what the new user-facing sequence is so the docs page can be written from it.

## The problem

A user with an existing database brings it under Prisma 8 by running `contract infer`, `contract emit`, and `db sign`. That is what the getting-started page for existing projects tells them to do. Then they change the contract and run `migration plan`. The plan proposes creating every table again.

Cause: `migration plan` takes its origin from `--from`, else the `db` ref, else the empty contract. `db sign` writes the database marker but never sets the `db` ref, and there are no migrations on disk, so the plan resolves to the empty origin and the CLI does not refuse (the `MIGRATION.PLAN_ORIGIN_UNKNOWN` refusal only fires when migrations already exist on disk).

Two Discord users hit this in one week and asked what `--from` is for. The incremental upgrade guide avoids it by teaching three extra commands (`migration plan --name baseline`, `db sign`, `migration ref set db <dir>`), and the "add to existing project" page does not teach them at all.

## What exists today

- `db init` and `db update` advance the `db` ref by default. `computeRefAdvancementName` in `packages/1-framework/3-tooling/cli/src/control-api/operations/ref-advancement.ts` returns `db` when no `--db` flag is given and `null` when `--db <url>` is passed, so passing `--db` also skips the ref. That second rule is a separate trap the shipped skill documents under "The trap" in `skills/prisma-8/references/migration-model.md`.
- `db migrate --advance-ref db` advances the ref after applying.
- `db sign` (`packages/1-framework/3-tooling/cli/src/orm/db/sign.ts`) verifies the live schema against the emitted contract and writes the marker. It does not touch refs.
- `migration ref set <name> <hash-or-dir>` sets a ref by hand.
- `executeRefAdvancement` writes a contract snapshot under `migrations/snapshots/` and then the ref file. A ref must point at a hash that has a snapshot.

## Pointers

- Ref advancement: `packages/1-framework/3-tooling/cli/src/control-api/operations/ref-advancement.ts`
- Sign command: `packages/1-framework/3-tooling/cli/src/orm/db/sign.ts`
- Plan command and origin flag: `packages/1-framework/3-tooling/cli/src/orm/migration/plan.ts`, `control-api/operations/migration-plan.ts`
- Refusal text: `PLAN_ORIGIN_UNKNOWN` in `packages/1-framework/3-tooling/cli/src/utils/cli-errors.ts`
- Existing ref tests: `test/integration/test/cli.db-ref-advancement.e2e.test.ts`
- The documented workaround: `wip/web/apps/docs/content/docs/guides/upgrade-prisma-orm/postgresql.mdx` §4.1 to 4.3
- Migration graph ADRs: search `docs/architecture docs/adrs/` for "ref"
