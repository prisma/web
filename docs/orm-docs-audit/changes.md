# Prisma ORM 8 docs: what to change, and in what order

This is the working list of changes to the Prisma ORM 8 documentation, built from a page-by-page audit against `@prisma/orm-postgres@8.0.0-rc.9` (the audit files are under `audit/`, with a source citation for every finding). Four kinds of change: restructure the site, correct existing pages, write new pages, change the ORM or its tooling where the docs are hard because the tool is.

Item numbers (A1, B11, C9, D4) are stable identifiers used in the audit files and the PRs; some are out of sequence because items were added as they were found. "J1" to "J10" are the reader jobs defined in `journeys.md`. Source paths are in `prisma/orm` at rc.9 unless they start with `create-prisma`.

Status as of 2026-09-11.

## Where things stand

**Shipped, or nearly.** Every correction to an existing page (section B, 35 items) is in three PRs: prisma/web #8236 (API names, flags, and paths that no longer exist) and #8237 (pages whose explanations were wrong) are merged; #8238 (facts on the getting-started pages and guides) is open as of 2026-09-11. Each commit cites the source line it was verified against. Section B below is a summary of what changed; the details are in the PRs.

**Landed since the audit.** A7 shipped as prisma/web #8242 (merged 2026-09-11), in a different shape from the move proposed below: fifteen of the sixteen Prisma 7 guides were rewritten for Prisma ORM 8 at the same slugs, each with its Prisma 7 page preserved under `guides/v7/`; Cloudflare D1 moved to `guides/v7/` only, with a redirect; thirteen other pages (authentication, some integrations, some Prisma Postgres guides) stay in the Latest tree with a "This guide uses Prisma 7" note. C9, C11, and C12 need re-scoping against the pages #8242 added.

**In progress.** D1 (adoption sets the `db` ref) and D3 (a skills opt-out in create-prisma) have briefs and are with ORM-side agents. D14 (the agent skill) has a brief ready to hand over.

**Not started.** The naming pass, the restructure (A1 to A3, A5, A6, A8), every new page (C), and the rest of D.

## Recommended order for the open work

1. **Naming pass**: "Prisma 8" to "Prisma ORM" everywhere (679 occurrences in 109 files). Mechanical, one PR. A7 has landed (#8242), so nothing blocks it.
2. **C4, release status page.** Half a page; unblocks J4 (the reader who got upgraded by accident). Needs the GA window and the Prisma ORM 7 support policy from Will.
3. **C2, add Prisma ORM to an app you already started.** The J1 page and the complaint that started this work. One page, written from `mental-model.md`.
4. **C1, coming from Prisma 7.** The mapping table and the "not yet" list. Unblocks J3.
5. **C9, deployment.** Was the largest hole; #8242 shipped Prisma ORM 8 guides for Docker, Cloudflare Workers, Turborepo, pnpm workspaces, and Bun workspaces. What remains is what those pages do not cover (see C9).
6. **The restructure** (A1, A2, A3, A5, A6) as one piece of work, after the pages above exist to be organised.
7. **Everything else in C** as its dependency in D clears.

## Decisions needed, and from whom

| Item | Decision | Who |
|---|---|---|
| C4 | GA window to state publicly; Prisma ORM 7 support policy | Will |
| D6 | Keep the release candidate on npm `latest`, or move it to `next` until GA | Will, with whoever owns publishing |
| D4 | For each missing client API: build it, or document the workaround and say it is not planned | ORM product |
| D1 | Which of the two designs for one-step adoption | ORM (brief in `brief-db-ref-on-adoption.md`) |
| D3 | Flag name and prompt wording for the skills opt-out | create-prisma (brief in `brief-skills-opt-out.md`) |
| C18 | The version floors to publish: the monorepo's `docs/Supported Versions.md` says Node 24; the scaffold enforces 22.18 and rc.9 runs on 22.12 | ORM product |
| C5 | Current state of the VS Code extension and language server | Serhii |
| C7 | Whether RLS, expression indexes, and `@@control` are documented as supported or as preview | ORM product |

## A. Restructure

The proposed sidebar trees and the `/orm` page structure are in `ia.md`. These are the moves that tree implies.

- **A1. Give the ORM its own front door, organised by starting state.** Replace the quickstart-versus-existing-project split with four doors on `/prisma-orm` and `/orm`: new app from scratch; app already started with an empty database; existing database with data; existing Prisma 7 app. Each door is one page that carries the whole path. Today three of the four starting states share one page written for the third. Unblocks J1, J2, J5.
- **A2. "Coming from Prisma 7" at the top level of the ORM sidebar**, linked from the root page, `/getting-started`, `/orm`, and reading-data. The fourteen inline diff blocks stay but point at it. Unblocks J3, J4. The page itself is C1.
- **A3. Human content first, agent prompts last.** `/prisma-orm`, `/getting-started`, and every framework guide open with a copyable agent prompt before any human instruction. Move the prompt to the end or into a collapsed block. This is the direct answer to the "written for AI" complaint.
- **A5. Root page: give the ORM a section**, not one line ("Here for the ORM? Jump to Prisma 7 or Prisma 8"). The four doors from A1 in one row. File: `(index)/index.mdx`.
- **A6. Rewrite `orm/core-concepts.mdx` as a narrative** from `mental-model.md`. The current page is a glossary; the mental model explains why, in the order a reader meets each piece. Keep the glossary as a closing section.
- **A7. Move the sixteen Prisma 7 guides out of the Latest tree.** Landed as #8242 (2026-09-11), in a different shape. `guides/frameworks/react-router-7`, `solid-start`, `guides/deployment/*` except Cloudflare D1, `guides/integrations/github-actions`, `ai-sdk`, all of `guides/switch-to-prisma-orm/*` and `guides/database/*` were rewritten for Prisma ORM 8 at the same slugs, each with its Prisma 7 page preserved under `guides/v7/`; Cloudflare D1 moved to `guides/v7/` only (there is no Prisma ORM 8 D1 driver). The Latest sidebar keeps those labels. Thirteen further pages stay in Latest with a "This guide uses Prisma 7" note; #8242 says which are blocked on third-party adapters and which are portable follow-ups.
- **A8. One error reference, or two that link.** `cli/error-reference.mdx` claims to list every CLI code but carries only the platform namespaces; every `MIGRATION.*`, `CONTRACT.*`, `CONFIG.*` code is on `orm/reference/error-reference.mdx`, and the structured errors' `docsUrl` points there. Merge them, or state the split on both and cross-link.
- **A4** (sidebar labels and the guides index) is in #8238, open as of 2026-09-11.

## B. Corrections to existing pages (#8236 and #8237 merged; #8238 open)

Thirty-five items, all verified against rc.9 source, in #8236 and #8237 (merged) and #8238 (open as of 2026-09-11). What they fixed, in order of how many readers they hit:

| Theme | What was wrong | Items |
|---|---|---|
| Row reads through `execute()` | Since rc.2 `execute()` returns `{ affectedRows }`; rows come from `query()`. About 200 lines on 14 pages, plus Mongo's removed `db.execute`. | B11 |
| Renamed API | `take`/`skip` (rc.7), `createCount` and siblings (0.17), `extensionPacks` (0.17), `@db.*` attributes (0.17), `sha256:` hash prefixes (0.17), the migration snapshot layout (0.17) | B1, B2, B4, B12, B13, B14 |
| Existing-project pages | Wrong default path (`prisma/` vs `src/prisma/`), skills claim, `.env` prompt, Temporal polyfill, namespace-qualified accessors | B3, B15, B10 |
| The `db` ref | `migration plan` refuses (`MIGRATION.PLAN_ORIGIN_UNKNOWN`) instead of planning CREATE-everything; `db init`/`db update` advance the ref only without `--db`; the automatic baseline | B16 |
| Middleware | Five-hook model replaced by the two rc.2 lifecycles; the logger example never fired on reads; lint keys, budgets latency, "permissive mode" | B17 |
| Things called unsupported that work | Whole-query raw SQL, 1:1 back-relations, many-to-many include and nested writes, referential actions, `.variant()` | B18, B19 |
| Aggregates | Return numbers, not strings; the lossless variants | B20 |
| Stale CLI surface | `--skip-skills`, bare `ref` group, `prisma-cli` hints, `PN-RUN-*` codes, printed output, top-level `migrate` | B21 |
| Samples that failed | Data-transform wiring, upsert without `conflictOn`, `prepare` then `connect()`, structured error codes shown as plain `Error` | B22, B24, B27 |
| Getting-started facts | Node floor (22.18; on the 24 line 24.11; 24 recommended), MongoDB replica set not required, create-prisma flags and scripts, `npm create prisma@latest`, SQLite ships, upgrade-guide version targets, `// use prisma-next`, `db.close()`, enum ordering, the scalar table, the skills page, the tutorial's starter model, the extensions recipe, streaming does not stream on `postgres()` | B5 to B9, B23, B25, B26, B28 to B35 |

Two audit claims were overruled by the source during implementation and the pages left as they were: `migration plan` can raise `MIGRATION.NO_TARGET` after a rollback cycle, and `min`/`max` over a `DateTime` column type-checks at rc.9.

## C. New pages

Grouped by where the page lives. Each says what the page is for, what it must cover, where the facts come from, and what it waits on.

### Entry pages

- **C2. Add Prisma ORM to an app you already started.** Starts from "you have a project directory and an empty or absent database": `orm init`, edit the contract, `contract emit`, `db init`, one query, with `db.ts` shown. Bun as the worked example, since that is the case reported, with a note for Node. Unblocks J1. Source: `mental-model.md`; the scaffold in `create-prisma`.
- **C1. Coming from Prisma 7.** The mapping table from `mental-model.md` in four sections: schema and types, CLI commands, client API, and "not in Prisma ORM 8 yet" with a status per item. The last section is the one readers ask for most and no page has: `skipDuplicates`, `increment`/`decrement`, `findUniqueOrThrow`, case-insensitive filters, `$transaction` arrays, model and payload types, `@updatedAt` (rejected; use `temporal.updatedAt()`), `cuid()` (rejected; use `cuid(2)`), JSON path filtering, soft delete, validations, callbacks, read replicas. Unblocks J3. Placement is A2; content of the "not yet" list depends on D4.
- **C3. Adopt an existing database.** Split from the existing-project page so it has room: what `contract infer` produces (SQL-only; captures indexes, checks, RLS, 1:1 relations; emits Temporal-backed timestamp types that need the polyfill, D10), what `db sign` checks and what exit code 4 means, the baseline migration, the `db` ref, the second migration with `--advance-ref db`. Unblocks J2. Waits on D1, which decides how short it can be.
- **C4. Release status.** One short page: release candidate; GA window; Prisma ORM 7 gets bug fixes and security updates for twelve months; `npx prisma` and `npm install prisma` resolve to Prisma ORM 8; to stay on 7, pin `prisma@7` and `@prisma/client@7`. Linked from the root page and every "Using Prisma 7?" note. Unblocks J4. Waits on Will (facts) and D6 (whether the tag stays).
- **C18. Supported versions.** No page states the floors. Candidates: Node (see the decision above), Bun 1.2 (site says 1.1), Deno 2.0, PostgreSQL 15 (stated nowhere), MongoDB 8.0, TypeScript 5.9, `tsconfig` with `moduleResolution: "bundler"` and `strict: true`, ESM-only. The monorepo's `docs/Supported Versions.md` is the draft but is wrong about Node and documents a `--merge-tsconfig` flag that does not exist, so confirm each number. One page under getting started, linked from every quickstart.
- **C5. Editor setup.** Where the VS Code extension lives (open-vsx), that Prisma ORM 8 does not bundle a language server and uses the locally installed CLI, that `// use prisma-next` on line one is what the language server keys on, and `prisma contract format` as the fallback. Unblocks J7. Waits on Serhii.

### Guides

- **C9. Deploying Prisma ORM 8.** Partly overtaken by #8242, which added Prisma ORM 8 guides for Docker, Cloudflare Workers, Turborepo, pnpm workspaces, and Bun workspaces; re-scope against those pages before writing. What a deploy needs: `prisma contract emit` as a `prebuild` step, `db migrate` (or `db init`) from the pipeline before the app starts, `db.close()` on shutdown, and for edge runtimes the per-request facade `@prisma/orm-postgres/serverless` (`postgresServerless<Contract>({ contractJson })` at module scope, `await using runtime = await db.connect({ url })` per request). Sections or pages for Docker, Vercel, Cloudflare Workers, monorepos. The monorepo's `docs/Serverless Deployment Guide.md` is the source for the Cloudflare path (Hyperdrive, `nodejs_compat`, migrations against the origin URL never through Hyperdrive, one runtime per `connect()`, the 128 MiB isolate limit) and carries a production caveat with no site presence: against real Hyperdrive the serverless facade's default cursor path hangs (SQLSTATE 58000, request killed at 30 s); the workaround is `cursor: { disabled: true }`. Source: `skills/prisma-8/references/build.md:421-435`, `packages/3-extensions/postgres/README.md:41-60`, `docs/Serverless Deployment Guide.md:97,274`.
- **C11. CI.** #8242 rewrote `guides/integrations/github-actions.mdx` for Prisma ORM 8; check it against this before writing. `prisma migration status --to <env> --db "$URL" --json`, fail the job on any `diagnostics[]` entry (the process exits 0 on warnings, so exit codes alone miss `MIGRATION.DIVERGED` and friends), then `prisma db migrate --to <env> --db "$URL"`. Source: `skills/prisma-8/references/migration-review.md:172-197`. D16 would make this one line.
- **C12. Switching from another ORM; team schema workflow.** #8242 rewrote the three `guides/switch-to-prisma-orm/*` and three `guides/database/*` pages for Prisma ORM 8; re-scope against them. The brownfield flow (`orm init`, `contract infer`, review, `contract emit`, `db sign`, `db verify`) and the team loop (`migration plan`, refs, `db update` for local iteration, `db verify`, `migration status` in CI). Reuses C3 and C11.
- **C10. Supabase and row level security.** The Supabase extension is one table row on the site. What ships: `@@rls` on a model, the five `policy_*` block kinds with `target` / `roles` / `using` / `withCheck`, the cross-space foreign key `supabase:auth.AuthUser`, `supabase<Contract>({ contractJson, url, jwksUrl | jwtSecret })`, `db.asUser(jwt)` / `db.asAnon()` / `db.asServiceRole()`, the session-pooler requirement, the one-time `GRANT` for `auth.*`, and the `SUPABASE.*` errors. Source: `packages/9-public/@prisma/orm-extension-supabase/`, `skills/prisma-8/references/supabase.md`.

### Reference completeness

- **C7. Advanced Postgres.** All of it ships and none of it is documented: RLS and policies in PSL and the TypeScript builder; expression and partial indexes (`@@index(expression:, where:, unique:, type:)`); `@@check`; `@noCheck`; `installExtension` / `createExtension` migration factories; `@@control` for how much of a table Prisma manages. Unblocks J8. Source: `skills/prisma-8/references/contract.md:101-108,265-367`, `packages/2-sql/2-authoring/contract-psl/README.md`. Waits on the product call about how to label these.
- **C8. Money and Decimal.** Cents as integers (already there), `Numeric(p, s)` in type position, what `@default` accepts, `avgDecimal`, and that a decimal string avoids float loss while the declared scale still rounds. Answers an open Discord question.
- **C6. Types.** Model, result, where, and input types with the Prisma 7 names beside each. Written from `docs/reference/model-and-result-types.md` on prisma/orm `main` (#30231 and #30236 merged 2026-09-10); publish when the first tagged release after rc.9 ships them. #30158 (reusable where filter types) is already in rc.9. Also what `contract.d.ts` already exports today. Unblocks J9.
- **C13. Migration factory reference.** The site shows six factories; the `Migration` base class has about thirty (indexes, foreign keys, uniques, checks, column changes, native enums, `installExtension`, RLS and policies), plus free factories and the `node migration.ts --dry-run` / `--config` self-emit CLI. Source: `packages/3-targets/3-targets/postgres/src/core/migrations/postgres-migration.ts:159-506`.
- **C14. PSL and TypeScript builder completeness.** A rewrite of `psl-syntax.mdx` and `typescript-schema-builder.mdx` large enough to plan as one. The PSL page lacks native types in type position, the `@default` generator list, the `temporal.*` presets, scalar lists, `@@unique`, `@@index` options, `@@check`, `@noCheck`, `@@control`, `namespace` blocks, `native_enum`, `@relation("Name")`, `onDelete`/`onUpdate`, inline extension types, MongoDB index options, `.variant()`. The TypeScript page lacks most field helpers, composite keys (`.attributes()`), indexes and checks, `foreignKeyDefaults`, the `output` option, and the MongoDB builder's value objects, indexes, enums, vectors, and polymorphism. The full list is in `audit/contract.md` under Missing. Source: the two `contract-psl` and `contract-ts` READMEs.
- **C15. Runtime reference completeness.** Additions to `transactions-and-runtime.mdx` and `orm-client.mdx`: `query` vs `execute`; `verifyMarker`; `binding`; `db.raw`, `db.nativeEnums`, `db.context`, `db.contract`, `db.stack`; the flat `db.orm.User` accessor for single-namespace contracts; `AsyncIterableResult.first()` / `.firstOrThrow()`; the `configure(meta)` callback and `meta.annotate(...)` (how cache opt-in works); `distinctOn`'s capability; MongoDB `mode` and the extra filter classes; the SQLite facade; the static client; `db.prepare`; `ctx.signal` and `MongoMiddleware`; `createInMemoryCacheStore`. Full list in `audit/orm-client.md` and `audit/builders.md` under Missing.
- **C16. Build integration.** The Vite plugin `@prisma/orm-postgres/vite-plugin-contract-emit` (re-emits on save; dev server only) and the `"prebuild": "prisma contract emit"` pattern for every other bundler. Zero hits on the site; the Vite-based framework guides tell readers to run emit by hand. Source: `packages/1-framework/3-tooling/vite-plugin-contract-emit/README.md`.
- **C19. Extension pages beyond pgvector.** PostGIS (`Geometry`, seven operations, the `pg/geometry@1` JSON round-trip exemption), ParadeDB (`key_field`-only), arktype-json (`arktypeJson(schema)`) each have one catalog row.
- **C20. Telemetry page.** `cli/telemetry.mdx` omits `DO_NOT_TRACK=1`, `PRISMA_NEXT_DISABLE_TELEMETRY=1`, the per-user config file, that CI never sends, the first-run notice, and the event fields. The rc.9 first-run notice links to `prisma-next.dev/docs/cli/telemetry`, which is not this page. Source: `packages/1-framework/3-tooling/cli-telemetry/src/`.
- **C17. CLI page additions.** `configuration.mdx`: `migrations.dir`, `formatter`, the `composer` section, the telemetry variables. `orm-init.mdx`: full flag list, exit codes 4 and 5, `prisma-next.md`. `db-update.mdx`: never plans `data`-class operations. `migration-ref.mdx`: the refusals. `migration-new.mdx`: default origin rules. `migration-status.mdx`: `--json` diagnostics. `db-migrate.mdx`: `MIGRATION.MARKER_MISMATCH`, `PATH_UNREACHABLE`. `contract-emit.mdx`: `--json` output, the `output` option. `cli/index.mdx`: `@prisma/orm-toolchain`, `@prisma/orm-framework`.

## D. Change the ORM and its tooling

Places where the docs are hard because the tool is. Grouped by who owns the fix.

### ORM behaviour

- **D1. Make adoption one step.** Today: `contract infer`, edit, `contract emit`, `db sign`, `migration plan`, `migration ref set db <hash>`. Either `db sign` sets the `db` ref when none exists, or a `db adopt` command does sign plus ref. Removes the recreate-everything trap in J2 and halves C3. In progress; brief in `brief-db-ref-on-adoption.md`.
- **D2. `migration plan` with no origin and no migrations on disk plans from empty silently.** With migrations on disk it refuses (`MIGRATION.PLAN_ORIGIN_UNKNOWN`). For a signed database with no ref the silent case is the wrong default; it should warn or refuse the same way.
- **D9. `--db` suppresses `db` ref advancement.** `db init` and `db update` advance the ref only when the URL comes from config; with `--db` they do not unless `--advance-ref` is also passed. Surprising, and every example passes `--db`. Advance regardless, or warn when `--db` is used without `--advance-ref` and no ref exists. Source: `cli/src/control-api/operations/ref-advancement.ts:19-28`.
- **D13. `migration ref set … @db` fails** with `MIGRATION.HASH_NOT_IN_GRAPH` instead of reading the marker. Support it when a connection is available, or reject it with a message that says why. Source: `cli/src/control-api/operations/ref.ts:104-118`.
- **D15. `db update` never plans data operations.** A change that needs a backfill fails and the user must switch to `migration plan`; nothing says so. Allow it, or print the hint. Source: `cli/src/control-api/operations/db-update.ts:17`.
- **D16. `migration status` exits 0 on warnings.** CI has to parse `--json`. A `--strict` flag or a non-zero exit on warn-level findings makes C11 one line. Source: `cli/src/orm/migration/status-findings.ts`.
- **D8. Streaming does not stream on `postgres()`.** The facade creates its driver with `cursor: { disabled: true }`, so `for await` iterates an already-fetched result; only the serverless facade exposes cursor batches. Measured: breaking after the first row of a 400,000-row table still grew the heap by 64 MB. Expose `cursor` on `postgres()` or keep the docs' new wording. Source: `packages/3-extensions/postgres/src/runtime/postgres.ts:245-247`.
- **D12. Permissive mode is unreachable on Postgres.** `postgres()` never forwards `mode`, so every "warn in permissive mode" branch in lints and budgets is dead on Postgres; only `mongo()` accepts it. Expose it or remove the branches. Source: `postgres.ts:86-94,276-282`, `sql-runtime.ts:187`.
- **D7. `db.connect()` vs `db.runtime()`, `db.close()` vs `db.runtime().close()`.** Two names for adjacent things, a Mongo-only `await`, and `db.prepare` then `db.connect()` throwing `DRIVER.ALREADY_CONNECTED`. One call on both targets would simplify every page that shows a script.
- **D10. Inferred contracts fail at read time without the Temporal polyfill.** `contract infer` maps timestamp columns to Temporal-backed types; on Node.js 25 and earlier every read throws (official Node.js 26 ships `globalThis.Temporal`; Homebrew's Node.js 26 build omits it) `RUNTIME.TEMPORAL_UNAVAILABLE` unless `temporal-polyfill/full/global` is imported. `create-prisma` installs the polyfill; `orm init` does not. Options: infer to `TimestamptzString` by default, have `orm init` install and import the polyfill, or fail at emit with a clear message. Source: `packages/3-targets/3-targets/postgres/src/core/psl-infer/postgres-type-map.ts:30-33`.
- **D5. `contract infer` on Prisma 7 databases.** Users report inferred contracts that fail to emit: `@db.*` attributes, `Decimal` defaults, non-`public` schemas. Check whether rc.9 still emits removed syntax and whether `Decimal @default(0.00)` is a bug. See D10.

### Product decisions

- **D4. Missing client API.** Verified absent: `firstOrThrow` on the collection (it exists on the result, so `.all().firstOrThrow()` works), atomic `increment`/`decrement`, case-insensitive string filters, insert with on-conflict-do-nothing (`skipDuplicates`), JSON path or containment filters (the `jsonb` codec has only the `equality` trait). Also not supported: soft delete, validations, lifecycle callbacks, custom `Collection` subclasses, read replicas, MongoDB referential actions. Each needs a decision: build it, or document the workaround and say it is not planned. The types work is merged: the where filter types (#30158) are in rc.9; `Models` and `Shape<>` (#30231, #30236) are on `main` awaiting a tagged release.
- **D6. The npm `latest` tag.** `prisma@latest` is 8.0.0-rc.13 while `@prisma/client@latest` is 7.10.0, so a Prisma 7 project's routine `npx prisma` picks up the 8 CLI against a 7 client. Move the release candidate to `next` until GA, or state the policy on C4.

### create-prisma

- **D3. Opt out of agent files at scaffold time.** No flag exists; every scaffold writes all four agent directories plus a `postinstall` hook. Add a prompt and `--skills none`, and have `orm init` ask. In progress; brief in `brief-skills-opt-out.md`.
- **D11. create-prisma pins rc.8.** `create-prisma@0.11.7` pins the ORM packages to `8.0.0-rc.8` for a Composer peer dependency, so fresh scaffolds lag the site. Bump on every release candidate, or document the lag. Source: `create-prisma/src/constants/dependencies.ts:8-10`.
- **D18. The MongoDB scaffold writes a `.env` nothing reads.** It contains `DATABASE_URL`; the generated `prisma.config.ts` reads `MONGODB_URL` and loads no dotenv file. Source: `create-prisma/templates/create/_shared/prisma.config.ts.hbs:13,31`, `src/tasks/prisma-setup/project-files.ts:22-26`.
- **Node 24.0 to 24.10.** The generated `package.json` declares `^22.18.0 || >=24.11.0` while create-prisma itself accepts `>=22.18.0`. Nobody could say why the 24 sub-range is excluded. Worth a question to the owner.

### The agent skill

- **D14. `skills/prisma-8/` is stale in the same places the site was, and more.** Twenty-one verified defects, the worst being row reads through `execute()`, `PN-*` error codes that no longer exist anywhere, and the flat config file removed in rc.4. It ships inside the ORM packages and is what coding agents read instead of the site. Brief ready to hand over: `brief-skill-staleness.md`.

### Monorepo docs hygiene

- **D17. `docs/reference/` and `docs/Supported Versions.md` disagree with the site and partly with the source.** `reference/capabilities.md` disagrees with the site's capabilities page on key namespacing, pack key nesting, the error code spelling, and whether capabilities are fixed at emit or negotiated at connect. `Supported Versions.md` says Node 24 and documents `--merge-tsconfig`, which does not exist. `Telemetry.md` says no exit code is sent; rc.9 sends one. `docs/reference/error-reference.md`, from which the site's error reference is generated verbatim, still says `ref set` and `prisma ref set` in eight entries (the command is `migration ref set` since rc.5). `mongodb-user-promise.md` promises MongoDB referential actions that are not implemented. Until reconciled, the audit treats `packages/` and `docs/releases/` as the only truth.

## Naming

The product is "Prisma ORM". A version number appears only when two versions are contrasted ("Prisma ORM 7 to 8"). Never "Prisma 8" as a product name. Rule, counts, and exceptions in `naming.md`. Applies to every item above and to the proposed nodes in `ia.md`. Not started; planned as its own PR (A7 has landed, so nothing blocks it).

## Open questions

Things the audit flagged but could not settle, mostly because the `prisma` binary and `@prisma/cli-engine` live in the `prisma-cli` repo, which was not audited: the global `--yes` flag on `db migrate`; `cli/global-flags.mdx`, `cli/init.mdx`, `cli/skills.mdx` as whole pages; `definePrismaConfig` from `prisma/config` versus `@prisma/cli-engine`; `HostedStateBootstrapError` and `--name`; Mongo `_id` decoding through `$lookup` and `findOneAndUpdate`; `_id` equality inside `match()`; the apply order of extension spaces versus `app`; whether `DateTime` still parses in PSL now that the starter writes `TimestamptzString`; the raw `EXTRACT(...)` codec claim; the `ilike` `fns` helper; "ParadeDB and Supabase are experimental"; which agent directory list is current (the skills page says Claude Code, Cursor, Codex, Windsurf; `cli/skills.mdx` and the scaffold say `claude`, `cursor`, `agents`, `devin`); whether `npx skills add` wants `prisma/prisma/skills` or `prisma/orm/skills`; the real capability key strings. Each audit file has an `## Unverified` section with what was checked.
