# Docs update for intermediate contracts in data transform migrations

Recorded 2026-09-13 from a brief written on another branch. Target page: `apps/docs/content/docs/orm/migrations/editing-a-migration.mdx`, next to `dataTransform`. Change item C25 in `changes.md`.

# For the docs site: data transforms that need an intermediate contract

Audience: an agent writing or extending the Prisma 8 migrations documentation. This describes a technique that exists in the ORM today and is specified in ADR 197 ("Migration packages snapshot their own contract", section "Intermediate contracts") in `prisma/orm`. It should be documented next to `dataTransform`, because it answers the first question anyone hits when a migration both changes a column and has to move data through it.

## The problem the reader has

A migration in Prisma 8 is an edge between two contracts: the start contract and the end contract. Its `dataTransform` step runs typed ORM queries, and those queries are typed and planned against a contract the author hands in. The natural choice is the end contract, and for a pure backfill it is right: add a nullable column, fill it, the end contract has the column.

It stops working the moment the transform has to read something the migration removes. Example: replacing a boolean `needsReply` with an enum column `state`. The transform must read `needsReply` to decide each row's `state`, but the end contract no longer has `needsReply`, so a query against it cannot name that column; the planner rejects it (`PN-MIG-2005`, a reference to something not in the contract). The start contract has `needsReply` but not `state`, so a query against it cannot write the new column either. Neither contract describes the database at the moment the transform runs.

Authors who hit this reach for raw SQL inside the migration, which throws away the typing the contract-first design exists to give them.

## The technique

Describe the in-between state as a contract of its own, inside the migration directory, and type the transform against it.

1. Copy the schema authoring file (the `.prisma` file, or the TypeScript builder) into the migration directory as `intermediate.prisma`.
2. Edit it to the shape the database has at the moment the transform runs: in the example, `ConversationReplyState` carries both `needsReply Boolean` and `state reply_state?` (nullable, because it is not yet filled).
3. Emit it: `prisma contract emit` pointed at that file, producing `intermediate.json` and `intermediate.d.ts` next to it. These are snapshots; they never change after the migration is written, which is the same rule ADR 197 applies to the migration's own `contract.json`.
4. In `migration.ts`, import both the end contract snapshot and the intermediate one, and order the operations as: schema steps that reach the intermediate state (add the nullable `state` column), then `this.dataTransform(intermediateContract, 'fill reply state', { run: () => <update built with the intermediate contract's query builder> })`, then the schema steps that reach the end state (set `state` not null, drop `needsReply`, drop anything else the migration removes).

The transform's queries are now typed: `needsReply` and `state` both exist in the contract they are built from, the plan's storage hash matches the contract the transform was handed (the runner checks this and refuses a mismatch with `MIGRATION.DATA_TRANSFORM_CONTRACT_MISMATCH`), and nothing is raw text.

Multiple intermediate contracts are allowed; the author names and emits each one. Every migration directory is self-contained: it never reaches outside itself for type information, so it keeps type-checking however the project's schema evolves afterwards.

## A trap the page must warn about

A column declared with `temporal.updatedAtString()` makes the query builder set it on every update, and it does so by putting the current time into the plan as a parameter. A migration's transform is lowered into `ops.json` when the migration is planned, not when it is applied, so that timestamp is baked into `ops.json`, and every re-emit of the migration produces different bytes while `migration.json` keeps the same hash. `migration status` then reports `MIGRATION.CONTRACT_SPACE_VIOLATION` and the author has no idea why. In the intermediate contract, declare such columns as a plain timestamp type (`TimestamptzString`) rather than the auto-updating form; the intermediate contract only types the transform, so the end contract's `updatedAt` behaviour is untouched. Found while writing the first such migration in `prisma/asks` (2026-09-12).

## What the docs page should show

- A worked example with three files: `intermediate.prisma` (the relevant model only), `migration.ts` with the imports and the operation order, and the directory listing after `contract emit`.
- The rule of thumb: type a transform against the end contract when the transform only writes columns the end contract has and reads columns it keeps; use an intermediate contract when the transform reads anything the migration removes or renames, or writes a column before its final constraints are applied.
- The failure the reader sees without it (`PN-MIG-2005` against the end contract) and why raw SQL is the wrong fix.
- The alternative of two migrations (add and fill in the first, drop in the second), when a team prefers not to keep an intermediate snapshot, with its cost: an extra contract version that exists only to make the transform expressible.

## References for the writer

- `prisma/orm`, `docs/architecture docs/adrs/ADR 197 - Migration packages snapshot their own contract.md`, section "Intermediate contracts" (the directory layout and the import pattern are there, written for Mongo; the Postgres form is identical apart from the builder).
- `prisma/orm`, `packages/3-targets/3-targets/postgres/src/core/migrations/operations/data-transform.ts`, the Postgres `dataTransform(contract, name, { run, check })` signature and its contract-mismatch check.
- `prisma/orm`, `examples/retail-store/migrations/app/20260513T0508_backfill_product_status/migration.ts`, a backfill transform (Mongo) showing the operation order and the snapshot imports.
- ADR 028 ("Migration Structure & Operations") for migrations as edges between contract hashes, and ADR 192 for why no TypeScript runs at apply time: the intermediate contract matters at plan time only; the runner executes the lowered `ops.json`.
- Status note from ADR 197: the scaffolder's automatic snapshot copy is target state; the intermediate-contract workflow itself is done by hand with `contract emit` and works with the current CLI. Verify against the release the page documents.
