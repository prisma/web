# Release check: Compute, Prisma Cloud, Console, Prisma Postgres, Studio, Accelerate, other repositories

Checked on 2026-11-28 by `services`. Docs read from prisma/web `origin/main` at `b3525d8b6`. Line numbers are on that commit. Sources: `prisma` CLI `v8.0.0-rc.36`, Composer `v0.40.0`, `@alchemy.run/prisma` `2.0.0-beta.87` (the version Composer 0.40.0 pins, read from the npm tarball), `create-db` `1.4.1` (npm tarball) and the prisma/create-db `main` worker source, `@prisma/dev` `0.25.2` and `0.24.17`, `@prisma/studio-core` `0.36.0`, prisma/cloud-deploy-action `v1.11.0`, ORM `v8.0.0-rc.25`, and pdp-control-plane `origin/main` at `d2c145a28`.

About pdp-control-plane: its "Deploy production" workflow ran successfully on `d2c145a28` (the current `main` tip) on 2026-11-27 12:30 UTC, so `main` is very likely what production runs. It is still evidence of intent, not an observation of production, and feature flags could hold parts back.

Scratch reproductions are in `wip/release-check-2/services/` (git-ignored). No cloud resources were created and nothing was signed in to.

## Summary

| Item | Verdict | Docs change |
| --- | --- | --- |
| X1 Compute pins old releases | **fixed in the release** | **Yes, the pinned versions are now refused.** Pin text, `@latest` advice, rc.20 notes and Composer 0.34 must go. |
| X2 URL answers 404 after first deploy | cannot tell | None until a real deploy shows it is gone. |
| X3 setup writes `service.mjs` outside the build, guesses the entry | partly fixed | Yes: step 2 (move `service.mjs`) is no longer needed for a `tsc` app; the entry warning can be narrowed. |
| X4 account deletion blockers | still present | Add the missing "no other admin" blocker. |
| X5 restored copy in a Vercel workspace cannot be deleted in Console | still present | None. |
| G1 new `create-db` database not ready | still present (no fix found) | None. |
| G2 `create-db --env` appends duplicates | still present | None. |
| G3 rotate can leave the old password working | still present | None. |
| G4 no `DATABASE_URL_POOLED` backfill | still present, designed | Optional: say a secret rotation in Vercel also adds it. |
| G5 local Prisma Postgres (`@prisma/dev`) | still present | Yes: "Recent versions of `prisma`" lock fix is not in any Prisma ORM 7 release; "one connection at a time" is slightly wrong. |
| S1 `@prisma/studio-core` needs `--force` | fixed in the release | Delete the note. |
| S2 Studio and extension column types | cannot tell | None. |
| S3 Studio binds `127.0.0.1` | still present | None. |
| A1 Accelerate rewrites IPv4 MongoDB hosts | cannot tell (source not available); moot on 1 December 2026 | Delete with the Accelerate retirement. |
| R1 old action releases call removed commands | fixed in the release | Delete the `CLI.UNKNOWN_COMMAND` sentence. |
| R2 ParadeDB hidden, PSL cannot declare `bm25` | still present | Keep hidden text as is. |
| Unsure: `deploy` does not link the directory | designed, not a workaround | None. |
| Unsure: `git connect` needs a terminal, adds no workflow | designed, not a workaround | Yes: two pages overstate the terminal requirement. |
| Unsure: Compute region defaults | designed, not a workaround | None. |
| Unsure: placeholder `DATABASE_URL`, `service.load()` outside Composer | designed, not a workaround | None. |
| Unsure: the action needs Bun | designed, not a workaround | None. |
| Unsure: deleted project keeps its GitHub connection | fixed in the backend | Narrow the sentence. |
| Unsure: agent enrollment, paused credential | still present, designed | None. |
| Unsure: `.env` uploaded with a Next.js standalone build | designed, not a workaround (Next.js behaviour) | None. |
| Unsure: Console password copy; `init` writes a third config | cannot tell; designed | None. |
| Unsure: Prisma Postgres | mostly designed; one stale date | Yes: the EA deletion date has passed. |
| Unsure: Local Prisma Postgres | designed; one plain error | Yes: `app-development.mdx` says `npx prisma dev` starts a database. |
| Unsure: Console and Accelerate | mostly designed; one sentence probably now false | Yes: the "switch from GitHub login to email and password" steps. |
| Unsure: Prisma 7 material | **fixed in Prisma ORM 7.3.0, text now false** | **Yes: section 11 of `ai/prompts/prisma-7.mdx` is wrong.** |
| Unsure: GitHub Copilot extension | cannot tell | Fix the inconsistent namespace; check the extension still works. |
| Section 2: Compute and Cloud | **one feature shipped (MCP accepts agent credentials)**, rest still missing | Yes: `agent-enrollment.mdx:212`. |
| Section 2: Prisma Postgres | still missing; **"coming in November 2026" is about to be false** | Yes: five point-in-time recovery sentences. |
| Section 2: create-prisma | still missing | None. |
| Section 2: Studio and the editor extension | still missing | None. |
| Section 2: Accelerate | still present; moot on 1 December 2026 | Delete with the retirement. |
| Section 2: Docs not yet ported | still missing | None. |

## Section 1

### X1. Compute deploys only older Prisma releases

**Verdict:** fixed in the release. The docs are now wrong, not just redundant: a repository at the versions the docs pin is refused by the Console setup.

**Evidence:**

- pdp-control-plane `packages/interactors/src/compute/planComposerSetup.ts:1302-1306` on `main`: `PRISMA_CLI_VERSION = "8.0.0-rc.35"`, `COMPOSER_VERSION = "0.40.0"`, `COMPOSER_PRISMA_CLOUD_VERSION = "0.40.0"`, `ORM_POSTGRES_VERSION = "8.0.0-rc.25"`, `EFFECT_VERSION = "4.1.4"`. Changed by prisma/pdp-control-plane#6141, merged 2026-11-23 ("write Composer 0.40.0 and variable() into set-up repositories"). Its `docs/compute/SupportedRepositories.md:130` records the same.
- `MINIMUM_VERSIONS` (same file, 1327-1331) requires `@prisma/composer` and `@prisma/composer-prisma-cloud` at 0.40.0 or newer and `prisma` at 8.0.0-rc.35 or newer. `declaredVersionProblem` (1429-1497) requires `@prisma/orm-postgres` to be exactly 8.0.0-rc.25. A repository that declares `@prisma/orm-postgres` 8.0.0-rc.20 gets: "This repository declares `@prisma/orm-postgres` 8.0.0-rc.20. Composer 0.40.0 needs exactly 8.0.0-rc.25. Upgrade …". A repository that pins `@prisma/composer` 0.34.0 gets "pins `@prisma/composer` 0.34.0, older than 0.40.0. Move these together …".
- npm today: `prisma` `latest` is 8.0.0-rc.36, `@prisma/orm-postgres` `latest` is 8.0.0-rc.25, `@prisma/composer` `latest` is 0.40.0. `@prisma/composer-prisma-cloud@0.40.0` has the peer `@prisma/orm-postgres: 8.0.0-rc.25`. `prisma@8.0.0-rc.36` depends on `@prisma/composer-cli` 0.40.0 and `@prisma/orm-toolchain` 8.0.0-rc.25. So the latest releases on npm are exactly what the setup accepts.

**Docs change needed:**

- `guides/upgrade-prisma-orm/postgresql.mdx`:
  - line 10, the `lint-versions-ignore-file` comment: remove it, since the page no longer needs to pin.
  - lines 64-65, `prisma@8.0.0-rc.27` and `@prisma/orm-postgres@8.0.0-rc.20`: install `@latest` (or rc.36 and rc.25 if the page keeps exact versions).
  - line 71, "Install these exact versions, not `@latest`. They are the versions Prisma Compute deploys today … the latest pair on npm does not work with the Composer version it installs. The rest of this guide, including the query notes in step 5, was tested at these versions.": delete or replace with "Install the latest versions; they are the versions Prisma Compute deploys."
  - line 104, "**Check:** `npx prisma --version` prints `8.0.0-rc.27`.": update.
  - lines 136-141, the two limits of the pinned versions and "Prisma Compute does not deploy them yet. So an app with a `@db.Citext` field cannot both upgrade and deploy on Compute today.": now false; keep only the extension-pack instructions.
  - lines 389-390, the two rc.20 query notes (`DateTime` read as a string, `now()` filled by the database): they describe rc.20 only. Once the page installs rc.25, check them against the ORM entries from the 2026-11-26 check before deleting; I did not re-run them at rc.25.
- `guides/upgrade-prisma-orm/index.mdx:26`, "Today it needs the Prisma 8 versions the all-at-once guide installs. The route-by-route guide installs the latest Prisma 8 releases, which Compute does not deploy yet": now false; both guides' latest releases deploy.
- `guides/upgrade-prisma-orm/postgresql-incremental.mdx:12`, "This guide installs the latest Prisma 8 releases, which Compute does not deploy yet; [Deploy an existing app…] lists the versions it needs.": delete that sentence.
- `guides/compute/deploy-existing-app.mdx`:
  - line 10, the ignore comment: remove.
  - line 33, "at `prisma@8.0.0-rc.27` and `@prisma/orm-postgres@8.0.0-rc.20` … These are the versions the Console's setup works with today; newer ones do not yet deploy.": the setup now needs `prisma` 8.0.0-rc.35 or newer and `@prisma/orm-postgres` exactly 8.0.0-rc.25. The rc.27/rc.20 pair is refused.
  - line 51, "The setup keeps the `prisma` and `@prisma/orm-postgres` versions your `package.json` declares.": partly false. It keeps them only if they meet the requirement above, and otherwise refuses with a message naming the versions to move to.
  - lines 165-169, the "Composer 0.40" warning before the `envSecret()` excerpt, and the excerpt at 171-178: the setup now writes Composer 0.40.0, so a reader on this page is always on 0.40 and the `envSecret()` excerpt never applies. Replace the excerpt with the `variable.secret()` form instead of warning about it (Composer item, shared with whoever owns the Composer entries).
  - lines 217-220, "at the version that matches `@prisma/orm-postgres@8.0.0-rc.20`, because the latest Composer release does not work with it" and `@prisma/composer@0.34.0 @prisma/composer-prisma-cloud@0.34.0`: install 0.40.0 (the latest).

### X2. The URL answers "There is no service on this URL" right after the first deploy

**Verdict:** cannot tell.

**Evidence:** The passage is still at `guides/frameworks/sveltekit.mdx:114` and `:192`. The deploy code is meant to prevent it. `@alchemy.run/prisma@2.0.0-beta.87` `src/Compute.ts:1325-1424` (`waitForDeploymentUrl`) polls the new URL for up to 60 seconds and keeps waiting while the edge answers 404 with "There is no service on this URL" (`isPrismaEdgeServiceNotFound`, line 1295). It runs for the preview URL (line 2604) and, after promotion, for the app URL (line 2631). `verifyUrl` defaults to true, and Composer 0.40.0 supplies the HTTP client it needs (`management-api-http-client.ts:92-116`). But that check has existed since `@alchemy.run` beta.66 (July 2026), and the docs sentence was written on 2026-11-21 (prisma/web#8892), which suggests the writer saw the 404 despite the check. A likely cause is that the check sees one edge location and the reader's browser reaches another, but I cannot test it without deploying.

**Docs change needed:** none. Keep the sentence until a real deploy shows it no longer happens.

### X3. The Console's setup writes `service.mjs` where the build does not ship it, and guesses the entry

**Verdict:** partly fixed.

**Evidence:**

- prisma/pdp-control-plane#6015 (merged 2026-11-13), `placeServiceDeclaration` in `planComposerSetup.ts:661-787`: for a Prisma 8 app compiled by `tsc`, the setup now writes the declaration as TypeScript at the tsconfig `rootDir` (default `src`), for example `src/service.mts`, so `tsc` compiles it into the build output. An app that ships its source writes `service.mjs` into the shipped folder. Only Next.js apps, apps without Prisma 8, and apps whose code cannot be placed keep `service.mjs` at the root. The generated `module.mjs` imports the declaration from its path (line 947). The setup refuses, with a message, when the contract or `outDir` is outside the folder (lines 742-762), and adds a first step when the tsconfig cannot compile the file (lines 779-785).
- The entry: `frameworks/declaredServerBuild.ts` takes the one file the `start` script runs, else `package.json` `main`, and only then falls back to a framework default. So the entry is read from the app, not guessed, except in the fallback case.

**Docs change needed:** `guides/compute/deploy-existing-app.mdx`:

- lines 46-51, the list of files the pull request adds: `service.mjs` is now `src/service.mts` (in the source folder) for this app.
- lines 55-89, step 2 "Move the service declaration into your build" (`git rm service.mjs`, the `src/service.mts` listing, the `module.mjs` import change): the setup now does this. Replace with a short note on what the setup wrote and where.
- line 80, "Check it, because the setup guesses the entry from your repository and can get it wrong.": narrow to "The setup takes the entry from your `start` script or `main`; check it." 
- "Without the Console" (lines 215-279) still needs its own instructions, since nothing writes files there.

### X4. Console account deletion: mismatched name, stopped deployments, GitHub connection

**Verdict:** still present.

**Evidence:** pdp-control-plane `packages/interactors/src/user/domain.ts:136-141`: the message is still "has active compute instances. Stop and delete all compute instances before deleting your account." `hasActiveDeployments` counts every deployment that is not soft-deleted (`compute/deployment.repository.ts:102-114`), so stopped deployments still count. Lines 145-160: a GitHub App installation connected by the user still blocks with "Ask another admin of that workspace to reconnect GitHub".

New since the page was last edited (2026-10-26): prisma/pdp-control-plane#5926 (merged 2026-11-09) added a blocker at lines 96-104: "Workspace "…" has other members but no other admin. Promote another member before deleting your account."

**Docs change needed:** `console/more/support.mdx`, the table at lines 54-62 and the list at 66-72: add a row for "You are the only admin of a workspace that has other members", message "Promote another member before deleting your account.", fix: make another member an Admin. The existing sentences at 61, 62, 71 and 72 stay.

### X5. A database restored into a Vercel-created workspace cannot be deleted in the Console

**Verdict:** still present.

**Evidence:** pdp-control-plane `services/console-compute/app/routes/_app.$organizationId.$projectId.$databaseId.settings/route.tsx:217-237, 368-390`: the delete control is chosen by the workspace's integration (`getIntegrationResourceAccess({ integrationName }, "databaseLifecycle")`), not by the database, so every database in a Vercel workspace shows "This database is managed through your Vercel account" and **Manage in Vercel**. The CLI path the docs give exists at rc.36 (`packages/cli/src/commands/postgres/delete.ts`).

**Docs change needed:** none.

### G1. A new database is not ready when `create-db` returns

**Verdict:** still present (no fix found).

**Evidence:** `create-db@1.4.1` `dist/src-Be7SU8vI.mjs:159-236` returns as soon as `POST /create` answers. The worker (prisma/create-db `apps/create-db-worker/src/index.ts:212`) returns as soon as `POST https://api.prisma.io/v1/projects` answers. Neither waits for the database to accept connections, and pdp-control-plane has no commit since October that adds such a wait. I could not test it, because `create-db` creates a real cloud database.

**Docs change needed:** none.

### G2. `create-db --env` appends duplicate keys

**Verdict:** still present.

**Evidence:** `create-db@1.4.1` `writeEnvFile` (`dist/src-Be7SU8vI.mjs:571-593`) calls `fs.appendFileSync` with a comment, `DATABASE_URL` and `CLAIM_URL`, and never reads existing keys. The 72-hour lifetime the pages state matches 1.4.1 (`MAX_TTL_MS = 2592e5`).

**Docs change needed:** none.

### G3. Rotating a credential can leave the old password working, silently

**Verdict:** still present.

**Evidence:** pdp-control-plane `services/management-api/routes/v1/connections.ts:710-722` (`POST /connections/:id/rotate`): when deleting the old key fails, it only adds a span event `old-key-deletion-failed` and still returns success. For Vercel (`services/marketplaces/vercel/index.ts:1106-1136`), keys that fail to delete are recorded on the rotation request and not reported to the caller.

**Docs change needed:** none. (The passages are now at `postgres/database/connecting-to-your-database.mdx:164, 202, 212`.)

### G4. `DATABASE_URL_POOLED` was not backfilled

**Verdict:** still present, by design.

**Evidence:** prisma/pdp-control-plane#5814 (merged 2026-10-29) sets it on new resources. Its description: "Existing resources: nothing changes until their next secret rotation. On that rotation they also get `DATABASE_URL_POOLED`." No backfill commit since.

**Docs change needed:** optional. `guides/postgres/vercel.mdx:86` could add that rotating the integration's secrets in Vercel also adds `DATABASE_URL_POOLED`, as an alternative to adding it by hand.

### G5. The local Prisma Postgres server (`@prisma/dev`)

**Verdict:** still present, with one sentence that is false.

The page `local-development/postgres.mdx` uses `npx prisma@7`. The newest Prisma 7, `prisma@7.10.1`, depends on `@prisma/dev` **0.24.17**, not 0.25.2. Composer uses `@prisma/dev` `^0.25.2`.

**Evidence (reproduced in `wip/release-check-2/services/p7/`, `prisma@7.10.1` with `@prisma/dev@0.24.17`):**

- `P1017` (lines 113-136): on a fresh instance, `prisma migrate dev --name init` printed `Error: P1017 Server has closed the connection.` After `prisma db execute --file` with the page's `CREATE TABLE "_prisma_migrations"`, the same command succeeded. prisma/orm#29366 is still open.
- Shadow database (line 62): without `shadowDatabaseUrl`, the second `migrate dev` failed with `ERROR: relation "User" already exists`; with it, it succeeded.
- Stale lock (lines 343-357): after `kill -9` of a running 0.24.17 server, starting the same name at once failed with `A Prisma Dev server with the name "svc-lock" is already running.` About a minute later it started. `@prisma/dev` 0.25.2 contains "breaking lock left behind by dead server"; 0.24.17 does not. After `kill -9` of a 0.25.2 server, an immediate restart failed with `Lock file is already being held` (the Prisma Streams lock), and a restart about a minute later worked.
- One connection (lines 359-363) and `prepare: false` (`composer/databases.mdx:38`, `composer/deploying.mdx:224-231`): with both 0.25.2 and 0.24.17, a second `pg` client connected at once, but its `SELECT 1` waited while the first client held an open transaction, and a named prepared statement `s1` created on the first client failed on the second with `prepared statement "s1" already exists`. So the clients share one session, as the Composer pages say, and `prepare: false` is still needed.

**Docs change needed:**

- `local-development/postgres.mdx:349`, "Recent versions of `prisma` detect that the previous owner is dead, take over the leftover lock, and start normally. Projects whose installed `prisma` predates the fix can still hit this.": false for this page's command. No Prisma ORM 7 release has the fix (7.10.1 ships `@prisma/dev` 0.24.17). Say that `npx prisma@7 dev` can hit it, and that Prisma Composer (which runs `@prisma/dev` 0.25) recovers on its own after a short wait.
- `local-development/postgres.mdx:363`, "accepts one connection at a time. Additional connection attempts queue until the active connection closes.": connections are accepted; it is the queries that wait while another client is in a transaction, and all clients share one session (prepared statements collide). Suggest: "Every client shares one database session. A client's queries wait while another client is inside a transaction, and named prepared statements from one client are visible to the others."
- The P1017 and shadow-database notes stay.

### S1. `@prisma/studio-core` needs `--force` to install

**Verdict:** fixed in the release.

**Evidence:** `@prisma/studio-core@0.36.0` peers are `react`, `react-dom` and `@types/react` at `^18.0.0 || ^19.0.0`. In `wip/release-check-2/services/studio-embed/`, a `package.json` with the page's dependencies (`next` 16.4.6, `react` 19.3.1, `@types/react` 19.3.3, `@prisma/client` 7.10.1, `prisma` 7.10.1, the Accelerate extension and the adapter) resolved `npm install --package-lock-only @prisma/studio-core@0.36.0` with no error and no `--force`.

**Docs change needed:** `guides/integrations/embed-studio.mdx:473-480`, the note "If you encounter a dependency resolution error … `npm install @prisma/studio-core --force`": delete.

### S2. Studio fails on extension column types

**Verdict:** cannot tell.

**Evidence:** Console Studio sends its SQL to the tenant manager (`packages/tenant-manager/src/index.ts:514-523`, `POST /tenants/:id/products/ppg/sql`), a service outside this repository, so the deserialization step is not visible. `@prisma/studio-core` 0.36.0 has no commit about extension or unknown types.

**Docs change needed:** none.

### S3. Studio binds to `127.0.0.1` inside a container

**Verdict:** still present.

**Evidence:** `prisma@7.10.1 studio --port 54396` listened on `127.0.0.1:54396` only (`lsof`), and `prisma studio --help` has no host option.

**Docs change needed:** none.

### A1. IPv4 MongoDB hosts are rewritten to an invalid form

**Verdict:** cannot tell. The Accelerate source is not in the repositories I can read, and no commit in pdp-control-plane touches it. Accelerate in front of your own database (MongoDB always is) retires on 1 December 2026.

**Docs change needed:** delete `accelerate/more/known-limitations.mdx:31-42` with the retirement.

### R1. Old action releases call removed commands

**Verdict:** fixed in the release.

**Evidence:** The `v1` tag of prisma/cloud-deploy-action points to the same commit as `v1.11.0` (`b1250b462c30…`, released 2026-11-10). `cli.mjs` at v1.11.0 runs the top-level command (`bun run --bun prisma deploy …`, lines 121-138); its comment says the `prisma composer` prefix was removed. A workflow that uses `@v1`, as every page does, gets v1.11.0.

**Docs change needed:** `compute/deploy-on-push.mdx:156`, delete the first two sentences ("If the deploy step fails with `CLI.UNKNOWN_COMMAND`, the action release predates the unified CLI: releases up to v1.5.0 call the removed `prisma composer` commands. Use a release that runs the top-level `deploy` command; …"). Keep the `skipped-no-credential` and fork sentences.

### R2. ParadeDB pages hidden; PSL cannot declare a `bm25` index

**Verdict:** still present.

**Evidence (reproduced in `wip/release-check-2/services/paradedb/`, `prisma@8.0.0-rc.36`, `@prisma/orm-postgres@8.0.0-rc.25`, `@prisma/orm-extension-paradedb@8.0.0-rc.25`):** with `extensions: [paradedb]` in the config and a `contract.prisma` containing `@@index([id, title, body], type: "bm25", options: { key_field: "id" }, name: "article_search")`, `prisma contract emit` failed with `[CONTRACT.VALIDATION_FAILED] Namespace "public" table "Article" index "article_search_6b8605a0" uses unregistered index type "bm25"`. The PSL parser accepts `type` and `options` (`contract-psl/src/sql-attribute-specs.ts`), but the index type is only registered through the pack that a TypeScript contract passes to `defineContract`. The TypeScript contract from the hidden page emitted successfully, with `bm25` in `contract.json`.

**Docs change needed:** none. The hidden page's sentence "a `contract.prisma` contract cannot declare it yet" is still true at rc.25.

## Section 4 ("Unsure")

### `deploy` does not link the directory

**Verdict:** designed, not a workaround.

**Evidence:** Only `project link` and `project create` call `bindDirectoryToProject` (prisma-cli rc.36, `commands/project/context.ts:119`, `link.ts`, `create.ts`); `deploy` comes from `@prisma/composer-cli` 0.40.0. Composer finds the project by the app's name (`lowering/src/container.ts:113-127`: first by `logicalId`, then by name), so deploy needs no link. The link is a per-checkout pin in `.prisma/local.json` (prisma-cli `docs/architecture/overview.md:53`). I found no decision record that says deploy must not write it.

**Docs change needed:** none (`compute/getting-started.mdx:72`, `compute/deploy-on-push.mdx:84` are accurate).

### `git connect` needs an interactive terminal and adds no deploy workflow

**Verdict:** designed, not a workaround. Two pages overstate the terminal requirement.

**Evidence:** prisma-cli rc.36 `commands/git/connect.ts:202-207`: "Deliberately no `interaction` need. Only the install wait requires a person … Declaring the need here would have failed every scripted run up front, including the ones that never reach the wait: the repository already connected, or the app already installed." No workflow: prisma/prisma-cli#271 ("stop promising deploy-on-push without a workflow"); the help text says the Console import opens a pull request that adds it.

**Docs change needed:**

- `compute/deploy-on-push.mdx:100`, "It needs an interactive terminal. With `--no-interactive` it fails with `CLI.INTERACTION_REQUIRED`": only when the Prisma GitHub App is not installed yet. Match `cli/git.mdx:19`, which is right.
- `compute/github.mdx:40`, "The command needs an interactive terminal: it waits for the install to complete": same correction.

### Compute region defaults

**Verdict:** designed, not a workaround.

**Evidence:** Composer commit `d0995768` ("fix(prisma-cloud): inherit the project region instead of defaulting to us-east-1"): "Creating a new project without a region now fails with an actionable error". The message is at `lowering/src/container.ts:131-140` in v0.40.0.

**Docs change needed:** none.

### Compute placeholder `DATABASE_URL` and `service.load()` outside Composer

**Verdict:** designed, not a workaround. The errors are unhelpful, but the behaviour is intended.

**Evidence:** pdp-control-plane `planComposerSetup.ts:661-666`: "Composer sets `DATABASE_URL` to a placeholder, so an app with a database reads its client from `service.load()`". Composer v0.40.0 `target/src/serializer.ts:114-120` throws `missing required config param "<name>" (env <key>)` when a required parameter is missing, which is what happens outside a Composer run.

**Docs change needed:** none.

### The action needs Bun on the runner

**Verdict:** designed, not a workaround.

**Evidence:** cloud-deploy-action v1.11.0 `main.mjs:212-219`: "Bun is required: composer runs under Bun, not Node. The generated Prisma deploy workflow adds `oven-sh/setup-bun@v2` for every project." It fails with a message naming that step.

**Docs change needed:** none.

### A deleted project keeps its GitHub connection

**Verdict:** fixed in the backend.

**Evidence:** pdp-control-plane `project/deleteProject.ts:138-144` archives the project's repository links before deleting it (prisma/pdp-control-plane#4654, 2026-07-22). `linkProjectToScmRepo.ts:131-145` only blocks on a live (not archived) link. `ProjectScmRepo.project` has `onDelete: Cascade` (`packages/database/contract.prisma`), which covers workspace deletion, where projects are removed by cascade.

**Docs change needed:** `compute/github.mdx:80`, "If the other project no longer exists, or you don't have access to it, uninstall the Prisma GitHub App": the "no longer exists" case should no longer happen; keep the "you don't have access to it" case. Low priority: a project deleted before 2026-07-22 could still hold a link.

### Agent enrollment

**Verdict:** still present, by design.

**Evidence:** pdp-control-plane `interactors/src/actor.ts:628-665` (`verifyAgentToken`): a paused agent is refused as unauthorized with "Agent is not active"; a revoked or expired token with "Invalid agent token". Both are the same unauthorized error, so an agent cannot easily tell them apart. `agent/setAgentStatus.ts:28-32` documents pause as intended.

**Docs change needed:** none for line 177. Line 212 is in Section 2 below.

### `.env` uploaded with a Next.js standalone build

**Verdict:** designed, not a workaround.

**Evidence:** Next.js copies `.env` into `output: "standalone"`; Composer v0.40.0's Next.js build and artifact code (`0-framework/2-authoring/nextjs/src/control/build.ts`, `lowering/src/compute/artifact.ts`) ships the standalone folder without filtering `.env`. Composer could strip it, which would be a product change, not a fix of a defect.

**Docs change needed:** none (`guides/authentication/clerk/nextjs.mdx:177`).

### Console password copy; `init` writes a third config

**Verdict:** cannot tell for the password copy; designed for `init`.

**Evidence:** No Console change about copying connection strings was found; the line at `guides/integrations/codeless-sync.mdx:57` reads as ordinary troubleshooting for a partial paste. prisma-cli rc.36 `commands/init.ts:570-610` writes a `prisma.config.ts` holding only the `skills` section when none exists, and leaves an existing one alone with a diagnostic; that is its purpose.

**Docs change needed:** none.

### Prisma Postgres

**Verdict:** mostly designed; one stale date.

**Evidence:**

- `connecting-to-your-database.mdx:51` (new credentials do not remove old ones; Console names all of them `console-connection-string`): product behaviour.
- The old 154-166 range is now the rotation text at 162-212: see G3, still present.
- `postgres/error-reference.mdx:146, 148`: billing behaviour, not a tool defect.
- `postgres/faq.mdx:40-46` (`restricted superuser cannot create roles`): designed.
- `postgres/import-from-existing-database.mdx:10, 38` (PostGIS and TimescaleDB not supported): still true. Neither is in the supported list on `postgres/database/postgres-extensions.mdx`, and pdp-control-plane has no PostGIS support. The ORM's PostGIS pack is for other PostgreSQL hosts.
- `postgres/migrate-from-ea-to-ga.mdx:11`, "EA databases will be deleted on **1 November 2026 at 00\:00 UTC**, so plan to finish your migration before then.": the date has passed. I found nothing in pdp-control-plane that shows whether the deletion ran.
- `ai/prompts/nextjs.mdx:196, 451-459`, `ai/prompts/nuxt.mdx`, `ai/tutorials/typefully-clone.mdx:513-523` (replace the generated `DATABASE_URL` by hand): these prompts install `prisma@prev` (7.10.1), whose `init` writes a local URL. Replacing it by hand is needed because `create-db --env` appends (G2). The "72 hours" they state matches create-db 1.4.1.

**Docs change needed:** `postgres/migrate-from-ea-to-ga.mdx:11` and its `metaDescription` (line 6): rewrite in the past tense once someone confirms what happened to the EA databases, or retire the page.

### Local Prisma Postgres

**Verdict:** designed; one plain error.

**Evidence:** `local-development/postgres.mdx:274` (undocumented `@prisma/dev` APIs) and `:323` (`databaseIdleTimeoutMillis` "if you suffer from client hanging"): the hang is the shared single session reproduced under G5. A client waits while another holds a transaction, and the idle timeout evicts the holder. Designed, since PGlite has one session. `prisma` rc.36 maps `dev` to Composer (`cli.ts:433`, `dev: composerCommandFamily.commands.dev`), so `npx prisma dev` runs a Composer app and does not start a standalone database.

**Docs change needed:** `local-development/app-development.mdx:31-37`, "Point your app at a local Prisma Postgres instance … `npx prisma dev` … It prints a `DATABASE_URL` you copy into `.env`": false with the Prisma 8 CLI. Use `npx prisma@7 dev` as `local-development/postgres.mdx` does, or describe the Composer route (`npx prisma dev url database` prints the URL of a running Composer app's database, as `guides/compute/deploy-existing-app.mdx:123` uses).

### Console and Accelerate

**Verdict:** mostly designed; one sentence is probably now false.

**Evidence:**

- `accelerate/getting-started.mdx:55-82`: designed (`prisma://` is an HTTP proxy, so Migrate needs a direct URL). Lines 76-78 still speak of `directUrl`, which the Prisma ORM 7 config shown at 64-74 does not have. The whole page goes when Accelerate retires on 1 December 2026.
- `accelerate/getting-started.mdx:158` and `accelerate/more/faq.mdx:37-46` (restart the TypeScript server): editor behaviour, not a tool defect.
- `accelerate/keep-your-database.mdx:84` (keep MongoDB apps on Prisma ORM 6.19): `orm/release-status.mdx:25` says Prisma ORM 6 updates ended on 19 November 2026. The advice is the only route for MongoDB with Prisma 7 and moot after 1 December.
- `console/more/support.mdx:66-68`, `console/more/workspaces.mdx:29-31, 41, 73-78`: match pdp-control-plane `interactors/src/workspace.ts:340-462` and `user/domain.ts` (last workspace, unpaid invoice, paid plan, deployments including stopped ones, integration-managed). Designed.
- `console/workspace-access.mdx:90`, `storage/behavior.mdx:67`, `compute/image-transformations.mdx:34`: product statements, no defect.
- `accelerate/more/faq.mdx:199-217` (and the same answer in `postgres/faq.mdx:48` onwards), "Create a New Email/Password Account … Use the same email address … Our system will automatically connect your new email/password account to your existing data.": probably false now. The Console signs in through `auth.prisma.io` in production since prisma/pdp-control-plane#6046 (2026-11-17). Its sign-up (#5699) says: "Signing up with an email that already has an account shows the same 'check your email' page", and Better Auth "returns a made-up user for existing emails". So signing up with a GitHub user's email no longer adds a password. #5700 added "Forgot password?" on the login page, which is the likely route now, but I could not confirm that a reset adds a password to an account that has only a GitHub sign-in.

**Docs change needed:** `accelerate/more/faq.mdx:199-217` and `postgres/faq.mdx:48` onwards: confirm with the team that owns sign-in (or test with a throwaway account), then replace step 2 with the "Forgot password?" route if it works.

### Prisma 7 material

**Verdict:** fixed in Prisma ORM 7.3.0; the text is now false.

**Evidence:** prisma/prisma#28591 was closed on 2026-01-20 ("Fixed in upcoming 7.3.0 release"). prisma/prisma#29002 (merged 2026-01-06) reverted the change that made generated enums use `@map` values. Reproduced with `prisma@7.10.1` in `wip/release-check-2/services/p7/`: for `enum SuggestionStatus { PENDING @map("pending") ACCEPTED @map("accepted") }`, `prisma generate` wrote `export const SuggestionStatus = { PENDING: 'PENDING', ACCEPTED: 'ACCEPTED' } as const` in `generated/enums.ts`, the Prisma 6 shape.

`accelerate/more/known-limitations.mdx:15-17` (fluent API types in client extensions): not checked; moot with the Accelerate retirement.

**Docs change needed:** `ai/prompts/prisma-7.mdx:360-435`, section "11) Mapped Enum Breaking Change": line 362 "In Prisma v7, the generated TypeScript enum values now use `@map` values instead of schema names", the "v7 generated enum" block at 386-394, the "Known Bug (as of v7.2.0)" and "Temporary Workarounds" at 396-430, and "Inform users about this breaking change" at 433-435 are all wrong for Prisma ORM 7.3.0 and later. Delete the section, or say that 7.0 to 7.2 had this change and 7.3.0 reverted it.

### GitHub Copilot extension

**Verdict:** cannot tell.

**Evidence:** The GitHub App `prisma-for-github-copilot` exists (`gh api /apps/prisma-for-github-copilot`, last updated 2025-05-09). The reload advice concerns GitHub's chat UI, not a Prisma tool. Two more things to check: the page uses two different names, `@prisma-for-copilot` at lines 27 and 30 and `@prisma-for-github-copilot` at line 37; and, from memory and not verified here, GitHub retired GitHub App based Copilot Extensions in late 2025, in which case the whole section no longer works.

**Docs change needed:** `ai/tools/github-copilot.mdx:27, 30, 37`: use one namespace. Someone should try the extension once and remove the section if GitHub no longer runs it.

## Section 2 (temporary wording)

### Compute and Cloud

**Verdict:** one feature shipped; the rest are still missing.

**Feature shipped, sentence now false:** `(index)/prisma-compute/agent-enrollment.mdx:212`, "Agent credentials work with the Prisma REST API. The Prisma MCP server (Prisma's tool server for AI assistants) doesn't accept them yet." prisma/pdp-control-plane#5524 (merged 2026-10-05): "Existing device credentials also work through MCP. All 41 tools use the same permission gate". `services/mcp-server/mcp/auth.ts:96-130` accepts `token_type: agent_token`, the token the enrollment flow issues (`interactors/src/agent/pollAgentEnrollmentToken.ts:94`, `oauth/src/signAgentToken.ts:43`). Later fixes, prisma/pdp-control-plane#6165 (2026-11-24) and #6200 (2026-11-26), show it in use. Rewrite line 212 to say the MCP server accepts agent credentials under the same policy and approvals. Lines 213 and 214 (no email or mobile notifications for approvals; no read-only connection strings) I found no change for.

**Still missing (no change found in pdp-control-plane, prisma-cli rc.36, Composer 0.40.0 or create-prisma 0.14.10):** WebSocket servers and native cron, planned for early 2027 (`compute/faq.mdx:21, 37, 42, 61, 62, 83, 99`; `compute/limitations.mdx:58, 60`; `compute/keeping-instances-awake.mdx:20`; `compute/request-timeout.mdx:69`; `(index)/prisma-orm/add-to-existing-project/postgresql.mdx:426`; `orm/supported-databases.mdx:91`); pull-request and preview comments (`compute/github.mdx:62`); Compute usage reporting (`compute/pricing.mdx:115`, `(index)/full-stack-tutorial.mdx:64`; prisma-cli rc.36 has only `postgres usage`, and the Management API has only `/databases/:id/usage`); Object Store and bucket pricing (`compute/object-storage.mdx:37`, `storage/index.mdx:64`, `storage/behavior.mdx:77`); the deployments endpoint is still marked experimental (`compute/deployments.mdx:18`; `services/management-api/routes/v1/services.ts` uses `describeExperimentalRoute`); every service still gets a `prisma.build` hostname (`composer/deploying.mdx:84`); Deno (`guides/runtimes/deno.mdx:121, 137`; `(index)/full-stack-tutorial.mdx:76`; `(index)/index.mdx:55, 169`; `(index)/prisma-orm/create-prisma.mdx:98`): create-prisma 0.14.10 `src/tasks/prisma-setup/context.ts:196` still says "Prisma Compute does not support Deno deployments yet. Use --no-deploy." `(index)/full-stack-tutorial.mdx:25` no longer has temporary wording. I did not find `cli/error-reference.mdx:696` or `postgres/import-from-existing-database.mdx:87` wording that is now false.

### Prisma Postgres

**Verdict:** still missing; the point-in-time recovery date is about to become false.

**Evidence:** Point-in-time recovery has not shipped. pdp-control-plane has no point-in-time recovery code, and `services/management-api/routes/v1/databases/restore.pn.integration.test.ts:120-129` asserts that `POST /databases/:id/restore` with `source: { type: "pitr", timestamp }` is rejected with 422 ("rejects unknown source type"). Query caching: still none; `accelerate/index.mdx:28` and `postgres/faq.mdx:299` already say it is "not on our immediate roadmap". Regions (`postgres/faq.mdx:76-87`) match `interactors/src/database/regions.ts`. Pulumi and Terraform "currently" sentences: no change found.

**Docs change needed:** these five sentences promise "November 2026", which ends in two days with no feature:

- `postgres/database/backups.mdx:27-29`, "Point-in-time recovery is coming to Prisma Postgres in November 2026."
- `postgres/index.mdx:117`, "Point-in-time recovery is coming in November 2026."
- `compute/faq.mdx:43`, "No point-in-time recovery on Prisma Postgres yet; it is coming in November 2026."
- `compute/faq.mdx:91`, "There is no point-in-time recovery yet (it is coming in November 2026)"
- `orm/supported-databases.mdx:91`, "Prisma Postgres has no point-in-time recovery yet; it is coming in November 2026"

Drop the month, or replace it with a date the Prisma Postgres team confirms. The `(index)/full-stack-tutorial.mdx:47` sentence the inventory listed is already gone.

### create-prisma

**Verdict:** still missing.

**Evidence:** create-prisma 0.14.10 `src/tasks/prisma-setup/context.ts:87, 182-196`: Deno is limited to the minimal PostgreSQL template.

**Docs change needed:** none (`guides/runtimes/deno.mdx:27`).

### Studio and the editor extension

**Verdict:** still missing.

**Evidence:** `@prisma/studio-core` 0.36.0 has data adapters for PostgreSQL, MySQL and SQLite only (`data/postgres-core`, `data/mysql-core`, `data/sqlite-core` and their drivers); nothing for MongoDB or CockroachDB.

**Docs change needed:** none (`studio/integrations/vscode-integration.mdx:15`, `guides/integrations/embed-studio.mdx:35`, `guides/postgres/vscode.mdx:140`).

### Accelerate

**Verdict:** still present; not checkable here; moot for your own database on 1 December 2026.

**Docs change needed:** delete with the retirement work (`accelerate/more/known-limitations.mdx:11-17`, `accelerate/more/faq.mdx:31, 105, 113`), keeping what still applies to hosted Accelerate connections for Prisma Postgres.

### Docs not yet ported

**Verdict:** still missing. Each page still carries the "This guide uses Prisma ORM 7" note at line 10 to 12, and `guides/index.mdx:96-98` explains it. These wait on third-party adapters, not Prisma tools.

**Docs change needed:** none.
