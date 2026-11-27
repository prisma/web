# Release check: Section 4 ("Unsure"), CLI, migrations, scaffolds and framework guides

Checked on 2026-11-28 against ORM `8.0.0-rc.25`, `prisma` `8.0.0-rc.36`, `create-prisma` `0.14.10` and Composer `0.40.0`. Docs are `origin/main` at `b3525d8b6`. Paths are under `apps/docs/content/docs/`. Section 4 bullets are numbered from 1 in file order; the numbering matched the names in the brief.

Reproductions ran in `wip/release-check-2/unsure-a/` with the published packages (`prisma@8.0.0-rc.36`, `@prisma/orm-postgres@8.0.0-rc.25`, `@prisma/cli-engine@0.10.4`) and Homebrew PostgreSQL 15 on port 54363, stopped afterwards.

## Summary

| # | Item | Verdict | Docs change |
| --- | --- | --- | --- |
| 1 | `--db` and ref advancement on `db init`/`db update` versus `db sign` | designed, not a workaround | none |
| 2 | Node.js 24.11 floor | designed, not a workaround | `guides/compute/deploy-existing-app.mdx:32` is false |
| 3 | `.env` copied into each monorepo package | designed, not a workaround | none |
| 4 | pnpm `allowBuilds` for `esbuild`, `msgpackr-extract`, `workerd` | fixed in the release (only `esbuild` has a build script now) | `pnpm-workspaces.mdx`, `turborepo.mdx`: drop two packages, "three" is false |
| 5 | `turborepo.mdx`: move to `prisma@latest` after `orm init` | fixed in the release (redundant step) | drop the step at `turborepo.mdx:629` |
| 16 | Remix deploy steps | designed, not a workaround | none |
| 17 | Vite plugin config path under Nuxt | designed, not a workaround | none |
| 18 | Hono dynamic import | not a workaround for anything; the import is unneeded | optional: static import at `hono.mdx:91` |
| 19 | Cursor reads hang behind Hyperdrive | cannot tell | none |
| 20 | Query inside a cursor loop, or from `activityFinalized` in a transaction, waits forever | still present | none |
| 21 | Structured errors hang SolidStart hydration | cannot tell | none |
| 22 | `JsonValue` from a deep import path | still present | none |
| 23 | `MARKER_NOT_IN_HISTORY` versus `MARKER_MISMATCH` | designed, not a workaround | none |
| 24 | Planning past `MIGRATION.PATH_UNREACHABLE` | fixed in the release; the docs' own advice is now worse than the printed command | `orm/migrations/the-migration-graph.mdx:104` |
| 25 | A database with no marker counts as empty | designed, not a workaround | none |
| 26 | `migration new` with a `db` ref and no migrations: `HASH_NOT_IN_GRAPH` | designed, not a workaround | none |
| 27 | `--name` ignored on the first plan of a signed database | designed, not a workaround | none |
| 28 | `contract emit` skips files without `// use prisma-8`; duplicate operation ids | skip: designed. Duplicate ids: still present | none |
| 29 | "`self-emit` is what the CLI calls recompiling" | designed (still the CLI's word) | none |
| 30 | Long manual procedures for planner limits | designed, not a workaround | none |
| 31 | `contract print` limits (`@ignore`, `.sql({ fk })`) | still present (Prisma 8 PSL cannot express them) | none |
| 32 | Builder checks missing or inconsistent | three still present; the repeated-`map` error code changed | `typescript-schema-builder.mdx:391` is false |
| 33 | `migration new` needs `--from` when the contract has not changed | designed, not a workaround | none |
| 51 | Other CLI items | designed, or still present; one docs sentence is maintainer commentary | optional: `cli/error-reference.mdx:21` |
| 54 | `orm init` on a Prisma 6 MongoDB project prints steps | designed, not a workaround | none |
| 55 | Pages that disagree about `"type": "module"` | designed; one page is wrong | `guides/making-guides.mdx:134` is false |
| 56 | Bun `dev` script uses `tsx`; `pg` SSL warning; Vercel pooled URL; old Accelerate URL | still present (scaffold) or designed (Vercel) | none |
| 60 | `db.json` merge conflicts | designed, not a workaround | none |

## 1. `--db` stops ref advancement on `db init` and `db update`, but not on `db sign`

- **Verdict:** designed, not a workaround.
- **Evidence:** ADR 327 (`docs/architecture docs/adrs/ADR 327 - db migrate advances the db ref when the connection comes from the config.md` at `v8.0.0-rc.25`) has a table "How the other ref-writing commands differ" that records both rules and the reason: "`db sign` advances under `--db` because adopting a database normally names it with `--db`". It also records that giving `db init` and `db update` the CI rule is follow-up work. The warning the inventory mentions for `--db` without `--advance-ref` was not built: the only ref diagnostics at the tag are `MIGRATION.REF_NOT_ADVANCED_IN_CI` and `MIGRATION.REF_NOT_ADVANCED_TO_EMPTY`. The pages (`cli/db-init.mdx:25, 35-37`, `cli/db-update.mdx:33, 45-47`, `cli/index.mdx:78, 93, 105`, `cli/migration-ref.mdx:19-21`, `cli/db-sign.mdx:15`, `orm/migrations/generating-a-migration.mdx:159`) match the ADR.
- **Docs change needed:** none.

## 2. The Node.js 24.11 floor

- **Verdict:** designed, not a workaround.
- **Evidence:** prisma/prisma-cli#343 (merged 2026-10-12) set one range for every Prisma 8 tool, `^22.18.0 || ^24.11.0 || >=26.0.0`, and explains the 24 line: "24.11 is Node 24's first LTS release. Releases before it were the 'Current' line, which we do not test." The published `engines` agree: `prisma@8.0.0-rc.36`, `@prisma/composer@0.40.0` and `create-prisma@0.14.10` all declare that range; the published `@prisma/orm-*` packages declare none (only private workspace packages have `>=24`). The same PR says "There is no runtime version check in the CLI"; a grep of `prisma-cli` at `v8.0.0-rc.36` and `composer` at `v0.40.0` for `process.versions.node` finds nothing. So the range is enforced only by the package manager (npm and pnpm warn, Yarn 1 refuses).
- **Docs change needed:** `guides/compute/deploy-existing-app.mdx:32` says "**Node.js 24.11 or newer.** `prisma dev`, which runs the app locally the way Compute runs it, refuses older versions." Both halves are wrong: Node.js 22.18 is supported, and `prisma dev` checks no version. Change it to the wording the other pages use: "**Node.js 22.18 or newer on the 22 line, 24.11 or newer on the 24 line, or 26 or newer.** `prisma dev` hands your TypeScript entry file straight to Node, which runs `.ts` files only from 22.18." (The same bullet's neighbour pins `prisma@8.0.0-rc.27`; that is outside this item.)

## 3. `.env` copied into each monorepo package

- **Verdict:** designed, not a workaround.
- **Evidence:** `orm init` at `v8.0.0-rc.25` writes `import 'dotenv/config';` at the top of `prisma.config.ts` and `db.ts` (`packages/1-framework/3-tooling/cli/src/commands/init/templates/code-templates.ts:19, 45`). ADR 325 states it as a shared fact of `init`: "the connection string is read from `DATABASE_URL`, and `dotenv` is installed with the target package, so `db.ts` may import `dotenv/config`". `dotenv/config` reads `.env` from the current working directory, and Next.js reads `.env` from the app directory, so a second copy follows from standard behaviour. The pages also offer the alternative (export `DATABASE_URL`, or `dotenvx`).
- **Docs change needed:** none.

## 4. pnpm `allowBuilds` for `esbuild`, `msgpackr-extract` and `workerd`

- **Verdict:** fixed in the release. Only `esbuild` has a build script now.
- **Evidence:** reproduction with pnpm 12.3.4, in a workspace with no `allowBuilds`, inside `packages/database`:

  ```text
  $ pnpm add -D prisma@8.0.0-rc.36 @types/node
  Error: ERR_PNPM_IGNORED_BUILDS
    ╰─▶ Ignored build scripts: esbuild@0.28.2
  ```

  With `allowBuilds: { esbuild: true }` only, `pnpm add @prisma/orm-postgres@8.0.0-rc.25 dotenv pg` and `pnpm add -D @prisma/cli-engine` then succeed, and `node_modules/.pnpm` has no `workerd` or `msgpackr` entry. An npm install of the same packages has one install script, `esbuild`'s, which `@prisma/composer`, `@prisma/composer-cli` and `@prisma/orm-toolchain` depend on.
- **Docs change needed:**
  - `guides/deployment/pnpm-workspaces.mdx:43-46`: remove `msgpackr-extract: true` and `workerd: true` from the block. Line 49: "The Prisma ORM 8 CLI's toolchain pulls in three packages with install scripts, so approve them up front." becomes "The Prisma ORM 8 CLI's toolchain pulls in one package with an install script, `esbuild`, so approve it up front." Also "(on pnpm 10 with the default settings it installs the three packages without running their scripts)" becomes "… installs `esbuild` without running its script".
  - Same page, lines 265-270 (the Next.js block): remove `msgpackr-extract: true` and `workerd: true`. Line 433 (agent prompt): "with `allowBuilds` for `esbuild`, `msgpackr-extract`, and `workerd`" becomes "with `allowBuilds` for `esbuild`".
  - `guides/deployment/turborepo.mdx:78`: "Prisma ORM 8's toolchain ships three packages with build scripts, so declare them" becomes "Prisma ORM 8's toolchain ships one package with a build script, `esbuild`, so declare it". Lines 86-87: remove the two lines. Line 629 (agent prompt): `allowBuilds: { esbuild: true, msgpackr-extract: true, workerd: true }` becomes `allowBuilds: { esbuild: true }`.
  - I did not check `@prisma/composer-prisma-cloud` (only the Remix page installs it); its tree may differ.

## 5. `turborepo.mdx:628`: move to `prisma@latest` after `orm init`

- **Verdict:** fixed in the release. The step is redundant.
- **Evidence:** `orm init` installs `prisma@latest` itself: `packages/1-framework/3-tooling/cli/src/orm/init.ts:266` at `v8.0.0-rc.25` is `const cliDevDeps = ['prisma@latest'];`, with a comment that the `prisma` v8 line publishes under `latest`. The same page shows it at line 108: `✔ pnpm add -D prisma@latest @types/node`.
- **Docs change needed:** `guides/deployment/turborepo.mdx:629` (agent prompt): delete ", and move the package to the current CLI with `pnpm add -D prisma@latest --filter @repo/db`".

## 16. Remix deploy steps

- **Verdict:** designed, not a workaround.
- **Evidence:** Setting `process.env.DATABASE_URL` from `service.load().database.url` before a dynamic import follows from two designed facts. Composer gives a service its connection through `service.load()`, not the environment: Prisma Cloud refuses a variable named `DATABASE_URL` with "Prisma Cloud sets and manages DATABASE_URL and DATABASE_URL_POOLED itself. Declare the database your service uses and read its url from that connection." (`packages/1-prisma-cloud/1-extensions/target/src/variable-name.ts` at `v0.40.0`). The `db.ts` that `orm init` writes reads `DATABASE_URL` when it is imported, and static imports run first, so the value has to be set before a dynamic import. Installing Linux binaries into `dist` follows from Composer ADR-0005, "Users build their app; the framework assembles deploy artifacts from built output": `nodeBuild()` copies what the user built and never installs packages, so packages with native binaries for Linux must be installed by the user's build.
- **Docs change needed:** none.

## 17. Vite plugin config path under Nuxt

- **Verdict:** designed, not a workaround.
- **Evidence:** `prismaVitePlugin(configPath)` documents its parameter ("Path to prisma.config.ts (relative or absolute). Defaults to 'prisma.config.ts'") and resolves it against Vite's root: `absoluteConfigPath = resolve(config.root, configPath)` (`packages/1-framework/3-tooling/vite-plugin-contract-emit/src/plugin.ts:403` at `v8.0.0-rc.25`). Searching upward would be a new feature, not a fix.
- **Docs change needed:** none.

## 18. Hono dynamic import

- **Verdict:** not a workaround for any defect. The dynamic import is not needed.
- **Evidence:** in `create-prisma@0.14.10`, the Hono template's `src/index.ts` imports `listUsers` from `./prisma/users`, which imports `db` from `./db.ts` statically and re-exports it (`templates/create/_shared/src/prisma/users.ts.hbs`). So `db` is already loaded when the server starts, and the guide's `const { db } = await import("./prisma/db")` in the POST route adds nothing. I did not run the Hono scaffold.
- **Docs change needed:** optional. `guides/frameworks/hono.mdx:91` could become a static `import { db } from "./prisma/users";` at the top of `src/index.ts`.

## 19. Cursor reads hang behind Cloudflare Hyperdrive

- **Verdict:** cannot tell.
- **Evidence:** the PostgreSQL driver still reads with `pg-cursor` (`packages/3-targets/postgres/3-driver/src/postgres-driver.ts:501`, `named-cursor.ts`), and no commit from `v8.0.0-rc.20` to `v8.0.0-rc.25` mentions Hyperdrive or changes the cursor. Whether Hyperdrive or the driver is at fault needs a Hyperdrive deployment, which this check may not create.
- **Docs change needed:** none.

## 20. A query inside a cursor loop, or from `activityFinalized` inside a transaction, waits forever

- **Verdict:** still present. Both are recorded in the code as accepted behaviour, not decided in an ADR, and nothing detects them.
- **Evidence:** the driver's concurrency comment at `v8.0.0-rc.25` (`postgres-driver.ts:47-57`): "Cursor-enabled streams hold the lock for the stream's entire lifetime — a nested query on the same client inside stream iteration deadlocks, exactly as under pg@8's queue." For `activityFinalized`, `sql-runtime.ts:1484` says "`commit()` and `rollback()` resolve after every finalization hook has run", so the transaction's connection is still checked out while the hook runs (ADR 271 defines the finalize order). The passages are at `orm/reference/transactions-and-runtime.mdx:44, 316` and `orm/middleware/authoring-custom-middleware.mdx:497`, and `how-middleware-works.mdx:278`.
- **Docs change needed:** none.

## 21. Prisma structured errors hang SolidStart hydration

- **Verdict:** cannot tell.
- **Evidence:** reproducing it needs a SolidStart app with server rendering, which I did not build. The advice at `guides/frameworks/solid-start.mdx:365` (rethrow a plain `Error`) also keeps database details out of the browser, so it stays useful whatever the cause.
- **Docs change needed:** none.

## 22. `JsonValue` from a deep import path

- **Verdict:** still present.
- **Evidence:** in the published `@prisma/orm-postgres@8.0.0-rc.25`, `JsonValue` is exported from `./target/codec-types` and, through a re-export, from `./contract-types`. The main entry points `./runtime` and `./static` do not export it. Both subpaths are in the package's `exports` map, so the import works; it is just not on a main entry point.
- **Docs change needed:** none.

## 23. Two codes for drift

- **Verdict:** designed, not a workaround.
- **Evidence:** `migration status` reports `MIGRATION.MARKER_NOT_IN_HISTORY` as a `warn` finding and exits 0: `status-findings.ts` at `v8.0.0-rc.25` explains that every status finding is `warn` because "the engine refuses a severity-`error` diagnostic on a run that exits 0". `db migrate` fails with `MIGRATION.MARKER_MISMATCH` before any operation. ADR 218 line 121 describes them as checks at different layers. `orm/migrations/rollbacks-and-recovery.mdx:109` says exactly this.
- **Docs change needed:** none.

## 24. "D37 avoided without saying so": planning the migration after `MIGRATION.PATH_UNREACHABLE`

- **Verdict:** fixed in the release, and the docs' own advice is now worse than what the CLI prints.
- **Evidence:** prisma/orm#31174 (in rc.25) made the printed `migration plan` work. Reproduction: baseline, then `add_name` planned and applied, then `add_age` planned but not applied, then a third contract change emitted but not planned. `db migrate` then prints:

  ```text
  ✘ [MIGRATION.PATH_UNREACHABLE] Current contract has no planned migration path
  → Plan the missing edge: prisma migration plan --from 20a5d333…   (the end of add_age)
  ```

  The docs say to plan from the marker's hash (`a62d15a…`, the end of `add_name`). Doing that wrote a second migration from `a62d15a` that adds both `age` and `nick`, and `migration status` then showed the graph forked: `add_age` became a dead branch beside the new migration. The printed command plans from the end of the history instead, so the graph stays one line.
- **Docs change needed:** `orm/migrations/the-migration-graph.mdx:104`: "In the second case, plan it from the hash the marker holds with `npx prisma migration plan --from <hash> --name <name>`, and to find that hash run `npx prisma migration status`, which prints it next to its `@db` label." becomes "In the second case, run the `migration plan` command the error prints, adding `--name <name>`. It starts where your migration history ends, so `db migrate` applies any migrations the database has not run yet and then the new one, and the history does not split in two." `orm/reference/error-reference.mdx` now describes the printed plan in detail (line 1877) and needs no change.

## 25. Tables with no marker count as empty

- **Verdict:** designed, not a workaround.
- **Evidence:** ADR 038 ("Operation idempotency classification & enforcement", lines 124 and 247-254 at `v8.0.0-rc.25`) decides it: with no marker, `db migrate` runs every operation and skips those whose postcheck already holds; a database ahead of a migration stops with `MIGRATION.PRECHECK_FAILED`, and "an existing database is adopted with `db sign` instead". Reproduction on a database with a matching `User` table and an extra column, no marker: `db migrate --to <add_name>` reported "Applied 2 migration(s) (3 of 4 operation(s); the other 1 had nothing to do, since their postchecks already held)", kept the existing row and the extra column, and wrote the marker. The warning at `orm/migrations/the-migration-graph.mdx:55` stays right.
- **Docs change needed:** none.

## 26. `migration new` with a `db` ref and no migrations stops with `MIGRATION.HASH_NOT_IN_GRAPH`

- **Verdict:** designed, not a workaround. The code is not misleading in the message the CLI prints.
- **Evidence:** reproduction after `db init`, with no migrations:

  ```text
  ✘ [MIGRATION.HASH_NOT_IN_GRAPH] The db ref is not a graph node yet
    why: The db ref points at c0c5fb1…, but migrations/app contains no migrations, so that contract is not a graph node and nothing can chain from it.
  → Run `prisma migration plan` first: …
  ```

  The code names the condition (the ref's hash is not in the graph), which ADR 218's rule that every committed edge starts at a graph node requires. `cli/migration-new.mdx:37` and `the-migration-graph.mdx:183` describe it.
- **Docs change needed:** none.

## 27. `--name` ignored on the first plan of a signed database

- **Verdict:** designed, not a workaround.
- **Evidence:** the automatic baseline always gets the directory name `baseline`, and `--name` names the second migration (`migration-plan.ts:927-928` at `v8.0.0-rc.25`); with no contract change there is no second migration. ADR 218 decides the two-directory baseline ("Two-bundle visibility"). Reproduction: `migration plan --name first` after `db init` printed "Planned baseline (3 operation(s)) + 0 operation(s)" and wrote only `…_baseline`. `guides/upgrade-prisma-orm/postgresql.mdx:183` is accurate.
- **Docs change needed:** none.

## 28. `contract emit` skips non-contract files silently; duplicate operation ids are not checked

- **Verdict:** skipping files is designed. Duplicate operation ids: still present.
- **Evidence:** prisma/orm#30379 made membership "a file matches a glob and carries the `// use prisma-8` directive", a standing rule shared with the language server; "directive-less file excluded from the contract" is one of its acceptance criteria. Emit fails only when no file carries it (`PSL_NO_OPTED_IN_SCHEMA_FILES`). For operation ids, no check for repeated ids exists at the tag (ADR 028 checks duplicate edge ids only).
- **Docs change needed:** none. `orm/migrations/generating-a-migration.mdx:29` and `editing-a-migration.mdx:266` stay.

## 29. "`self-emit` is what the CLI calls recompiling"

- **Verdict:** designed. The CLI still uses the word.
- **Evidence:** `migration-plan.ts:158` prints "… then run `node …/migration.ts` to self-emit", and `orm/migration/plan.ts:240` prints "Run it to self-emit ops.json and attest the package", both at `v8.0.0-rc.25`. ADRs 193 and 196 name `migration.ts` a "self-emitting" file. The sample output at `orm/migrations/editing-a-migration.mdx:36, 50` matches.
- **Docs change needed:** none.

## 30. Long manual procedures for planner limits

- **Verdict:** designed, not a workaround.
- **Evidence:** the planner plans only to the emitted contract or to a contract a ref or a migration names (`orm/reference/error-reference.mdx:1877` and the code it describes), and a migration is authored against its start and end contract snapshots (ADR 232). So a migration to an older contract means emitting that contract first, which is what the procedures at `orm/migrations/generating-a-migration.mdx:177-186` and `rollbacks-and-recovery.mdx:129` do. The refusal of a schema-only self-edge (`orm/reference/migration-api.mdx:412`) is ADR 001's rule: "A migration may declare `fromHash === toHash` only when its operation list includes at least one data-class operation". `migration check` reports it as `MIGRATION.CHECK_NOOP_SELF_EDGE` and `db migrate` as `MIGRATION.CONTRACT_SPACE_VIOLATION`, both present at the tag.
- **Docs change needed:** none.

## 31. `contract print` limits

- **Verdict:** still present. Prisma 8 PSL cannot express these, and `contract print` refuses rather than write a file that reads back differently.
- **Evidence:** `packages/3-targets/postgres/1-target/src/core/psl-print/refusals.ts:653` at `v8.0.0-rc.25`: "relation … has no foreign key in storage, which Prisma 8 PSL cannot express." A Prisma 7 `@ignore` field becomes a column with no field in the contract (`contract-prisma7/src/diagnostics.ts`, "unmapped reasons" `ignored` and `unsupported`), and Prisma 8 PSL has no attribute for that. I did not run `contract print` on a Prisma 7 schema.
- **Docs change needed:** none. `guides/upgrade-prisma-orm/postgresql-incremental.mdx:597` and `typescript-schema-builder.mdx:544` stay.

## 32. Builder checks that are missing or inconsistent

- **Verdict:** three are still present; one passage is now false.
- **Evidence:**
  - Deprecated TypeScript helpers do not warn: still present. A TypeScript contract using `type.VarChar(10)` emitted with no warning. ADR 257 requires the warning only from the PSL interpreter (`PSL_DEPRECATED_SCALAR_NAME`), and the TypeScript builder has no deprecation handling for these helpers.
  - Relation column types are not compared: still present. No check exists at the tag.
  - A repeated `map`: the error code changed. Reproduction with two indexes both `map: "dup_idx"`:

    ```text
    ✘ [CONTRACT.VALIDATION_FAILED] Contract semantic validation failed: Namespace "public" table "user": named object "dup_idx" is declared multiple times (index, index)
    ```

  - `psl-syntax.mdx:539` (MongoDB enums of some types, "You can declare it, but it is refused when a collection Prisma ORM manages uses it"): designed. MongoDB's collection validator cannot list those values, and the refusal is made when the contract is built, by one function both authoring surfaces call (`mongo-contract/src/contract-refusals.ts:210`).
- **Docs change needed:** `orm/contract-authoring/typescript-schema-builder.mdx:391`: "A `map` used twice makes `contract emit` fail with `CONTRACT.SOURCE_LOAD_FAILED`." becomes "A `map` used twice makes `contract emit` fail with `CONTRACT.VALIDATION_FAILED`, naming the repeated name."

## 33. `migration new --from` when the contract has not changed

- **Verdict:** designed, not a workaround.
- **Evidence:** `control-api/operations/migration-new.ts:202-208` at `v8.0.0-rc.25` refuses with `MIGRATION.NO_CHANGES` when the start and end are the same and `--from` was not given, and its fix says "To author a data-only migration on the current contract hash, pass `--from <hash>` explicitly." Reproduced. The explicit `--from` is the deliberate opt-in for a self-edge, which ADR 001 allows only with a data operation. `orm/contract-authoring/advanced-postgresql.mdx:194` is accurate, and no longer mentions `migration ref set`.
- **Docs change needed:** none.

## 51. Other CLI items

- **Verdict:** designed, except where noted below.
- **Evidence and status, one line each:**
  - `cli/db-migrate.mdx:166` (`kind` is `neverPlanned` or `pathUnreachable`): designed; that is the error's payload schema in the ORM error reference.
  - `cli/db-verify.mdx:94-96` (SQL defaults compared as text, ignoring case and spaces): designed; the page explains that two SQL expressions cannot be compared for meaning.
  - `cli/db-update.mdx:82-90` (trades and takeovers in two steps): designed. The planner refuses the cycle and its message says how to split it (`2-sql-family/9-family/src/core/migrations/enum-value-planning.ts:355`).
  - `guides/database/data-migration.mdx:474` ("Do not use `db update` for this change"): designed; `db update` makes the database match the contract and carries no data operations.
  - `cli/configuration.mdx:52` (a child config silently uses the parent's `db` and `migrations`): designed. `prisma-cli` `docs/architecture/cli-engine-requirements.md:166` at `v8.0.0-rc.36`: "There are no shadowing notices: overriding a parent's key is the mechanism working as intended."
  - `cli/configuration.mdx:247-253` (no check mode for `contract format`): still missing. `prisma contract format --help` in rc.36 lists no check flag.
  - `cli/init.mdx:67`, `cli/index.mdx:116-122` (config unreadable until `prisma` is installed): designed. `init` "prepare[s] the current repository … entirely locally" and adds the dev dependency without installing (`docs/product/command-principles.md:98-104` in `prisma-cli`).
  - `cli/telemetry.mdx:56` (the notice links to `/docs/cli`): still present. `CLI_DOCS_URL = "https://www.prisma.io/docs/cli"` (`packages/cli/src/cli-name.ts:12` at `v8.0.0-rc.36`) is what the notice prints. The docs quote it correctly.
  - `cli/skills.mdx:45` (a package counts when the project can import it): designed; `packages/cli/src/lib/skills/resolve.ts` uses standard module resolution.
  - `cli/error-reference.mdx:21`: the sentence "`pnpm check:error-reference` verifies only the codes in this repository's source, so a family's entries are kept current by hand …" is copied from the `prisma-cli` repository's own reference. It is a note for that repository's maintainers, not for readers. Lines 399 and 557 match rc.36, except that rc.36 says "Management API" where the docs say "REST API" at 557.
  - `(index)/prisma-orm/from-scratch.mdx:68-74` (the `skills` block turns off the notice): designed; the staleness notice still prints in rc.36 ("Prisma agent skills are out of date … Run: prisma skills sync").
  - `(index)/prisma-orm/local-database.mdx:105` (CLI commands still need `DATABASE_URL`; get it from `prisma dev url`): designed; under Composer the app never reads environment variables.
  - "Ignore the word `space`" (`existing-app/postgresql.mdx:176`, `existing-app/mongodb.mdx:177`, `add-to-existing-project/postgresql.mdx:387`): designed; contract spaces are part of the output.
  - `orm/coming-from-prisma-orm-7.mdx:47` (unset an exported `DATABASE_URL`): designed; `dotenv` does not override a variable that is already set.
  - `orm/core-concepts.mdx:93` (sign before any other `db` or `migration` command): consistent with the rc.25 behaviour checked under O2; no change.
  - `orm/contract-authoring/editor-support.mdx:29` (restart the language server): cannot tell; the VS Code extension is not one of the releases in this check.
- **Docs change needed:** optional: delete the second sentence of `cli/error-reference.mdx:21`, and say "Management API" at line 557. If the page is synced from `prisma-cli`, make the change there.

## 54. `orm init` on a Prisma 6 MongoDB project prints steps instead of doing them

- **Verdict:** designed, not a workaround.
- **Evidence:** ADR 252 (`An earlier Prisma version's schema is a contract source`), item 5: "`orm init` recognises a Prisma 6 MongoDB project and prints the side-by-side setup, and never adds `"type": "module"` to an existing project." Its "orm init" section says init "stops before changing anything, with `CLI.INIT_PRISMA6_SCHEMA_FOUND`". The message at `init/errors.ts:848` gives the reason: both CLIs are published as `prisma`, and the Prisma 6 CLI also reads `prisma.config.ts`. `guides/upgrade-prisma-orm/mongodb.mdx:84-96` quotes it.
- **Docs change needed:** none.

## 55. Pages that disagree about `"type": "module"`

- **Verdict:** designed. `making-guides.mdx` is wrong; the other two pages are right.
- **Evidence:** `ensureEsmModuleType` (`init/hygiene-package-scripts.ts:142-190` at `v8.0.0-rc.25`): with no `"type"` field, `orm init` adds `"type": "module"` to a new project, or to a `package.json` with no `dependencies`. In an app that already has `dependencies` it leaves the field out and warns ("init leaves that alone, because setting it would change how the project's own files load"). A `"type"` other than `module` is kept, with a warning. ADR 252 item 5 decided the existing-project rule. `from-mongoose.mdx:159` and `from-sql-orms.mdx:140` describe existing apps and are right.
- **Docs change needed:** `guides/making-guides.mdx:134`, under "Existing project": "`orm init` keeps `"type": "commonjs"` if your `package.json` declares it and adds `"type": "module"` if there is no `"type"` field" becomes "`orm init` keeps any `"type"` your `package.json` declares. When there is no `"type"` field, it adds `"type": "module"` only if `package.json` lists no `dependencies`; in an app that already has dependencies, it leaves the field out and prints a warning".

## 56. The Bun scaffold's `dev` script uses `tsx`; the `pg` SSL-mode warning; the Vercel pooled URL; the old Accelerate URL

- **Verdict:** the scaffold items are still present. The Vercel items are designed.
- **Evidence:**
  - `create-prisma@0.14.10` `templates/create/minimal/package.json.hbs` writes `"dev": "tsx watch src/index.ts"` for every package manager except Deno, Bun included, and adds `tsx` to the dev dependencies (`src/constants/dependencies.ts:137`). The Hono template uses `bun --watch` under Bun, so the minimal template is the odd one out. `guides/runtimes/bun.mdx:91` describes it correctly.
  - The `pg` SSL-mode warning comes from the `pg` driver reading `sslmode=require` in the connection string, not from Prisma ORM; `bun.mdx:102` is accurate. Not reproduced.
  - Vercel (`guides/postgres/vercel.mdx:20, 78-90`, `guides/deployment/vercel.mdx:19`): `services/marketplaces/vercel/utils.ts` in `pdp-control-plane` `origin/main` (evidence of intent, not proof of production) sets the direct URL in `DATABASE_URL` and `POSTGRES_URL` and the pooled one in `DATABASE_URL_POOLED`, with the comment that `DATABASE_URL_POOLED` "carries the pooled endpoint for application traffic from Vercel Functions". `PRISMA_DATABASE_URL` depends on how the resource was provisioned, in `accelerate` or `postgres` mode, so a resource provisioned in `accelerate` mode keeps an Accelerate URL.
- **Docs change needed:** none.

## 60. `db.json` merge conflicts

- **Verdict:** designed, not a workaround.
- **Evidence:** refs are tracked files in the repository by design (ADR 218: the workflow is "deliberately Git-shaped"; ADR 327 calls `migrations/app/refs/db.json` "a tracked file"). Two branches that each move `db` conflict there, and the next `db migrate` rewrites it. `guides/database/schema-changes.mdx:317-321, 426` describes that.
- **Docs change needed:** none.
