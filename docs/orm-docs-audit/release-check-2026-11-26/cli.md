# Release check: prisma-cli (C1 to C14), create-prisma (P1 to P9), section 2 (ORM and create-prisma), section 3

Checked against `prisma` 8.0.0-rc.35 (tag `v8.0.0-rc.35`), `@prisma/orm-toolchain` and the ORM packages 8.0.0-rc.25 (tag `v8.0.0-rc.25`), and `create-prisma` 0.14.10 (tag `v0.14.10`). Docs read from `origin/main` (`6c765c503`). Reproductions ran in `wip/release-check/cli/` with the published packages: `prisma@8.0.0-rc.35` installed in `cliinstall/`, and two apps scaffolded with `npx create-prisma@0.14.10 ... --no-deploy --yes` in `scaffolds/nextpg` (Next.js, PostgreSQL) and `scaffolds/minmongo` (minimal, MongoDB). No database server was started.

## Summary

| Entry | Verdict | One line |
| --- | --- | --- |
| C1 | still present (decision pending) | rc.35 has no `studio`; `prisma studio` exits with `CLI.V7_COMMAND` and tells you to install `@prisma/prisma7@7` and run `prisma7 studio`, which differs from what the docs say to do |
| C2 | still present | no command for a standalone local Prisma Postgres; `prisma dev ls` is a v7 redirect to `emulator list` |
| C3 | still present | `init --db` exits with `CLI.V7_FLAG` pointing to `postgres create`; `init --prompt` is an unknown flag. The troubleshooting page's "npx caching" cause is wrong |
| C4 | still present | `INIT.CONFIG_KEPT` is raised whenever the existing config has no `skills.agents`, whatever the suggestion |
| C5 | still present | the staleness notice treats never-synced skills as out of date; code unchanged since 2026-09 |
| C6 | still present | package manager detection walks up with no project boundary, documented in the engine as deliberate; reproduced |
| C7 | still present | nothing in the CLI reads `PRISMA_PROJECT_ID` |
| C8 | still present | `postgres create`, `connection create` and `connection rotate` print one connection string |
| C9 | still present | `project link` unchanged since 2026-10-28 |
| C10 | still present | `domain wait --timeout 0` still throws `SERVICE.DOMAIN_VERIFICATION_TIMEOUT` for a domain that is not active |
| C11 | still present | update check still skips on any non-empty `CI`, `false` included |
| C12 | still present | a foreign `postinstall` still makes `init` leave `package.json` alone, dependency included |
| C13 | still present | prisma/prisma-cli#339 is open |
| C14 | still present | reproduced: `CLI.CONFIG_SECTION_INVALID` from `contract emit` links to the ORM error reference, which has no entry for it |
| P1 | still present | the non-Deno `prisma.config.ts` template loads no dotenv |
| P2 | still present (passage already accurate) | output still says "Set MONGODB_URL"; the docs passage already explains it is only for Composer |
| P3 | still present | the scaffold writes `migrations/app/<ts>_init` and no `refs/db.json`; the `npm run migrate` path was already updated for prisma/orm#31169 |
| P4 | still present, but not triggering today | Composer 0.40.0 still pins `@prisma/orm-postgres` exactly, but today every version is rc.25, so a plain install succeeds |
| P5 | still present | `db.ts` still takes `service.load().database.client` |
| P6 | still present | `db.ts` still falls back to `postgres({ contract })` with no URL |
| P7 | still present | the template already has explicit `@Inject()`; the passage is advice for code the agent writes, and `tsx` (no decorator metadata) is still the dev runner |
| P8 | still present, and wider than described | the published package has no template `.gitignore` at all; the Next.js app ignores only `node_modules/ dist/ .env /.alchemy /.prisma-composer` |
| P9 | still present | `create-prisma` sets `output: ./src/prisma/generated`; `orm init` sets no `output` |
| Section 2, ORM | one sentence now wrong | `orm/index.mdx:42` says MariaDB "has no client for your app yet"; rc.25 ships `mariadb()` (prisma/orm#31082) |
| Section 2, create-prisma | still accurate | Deno is still limited to the minimal PostgreSQL template |
| Section 3 | none found wrong | spot-checked against rc.25 and rc.35; see the section for what was checked |

## prisma/prisma-cli

### C1. No `studio` command

**Verdict:** still present. Decision on a `studio` command is still Will's; reporting state only.

**Evidence:** no `studio` command is mounted in `packages/cli/src/cli.ts` at `v8.0.0-rc.35`. The redirect lives in prisma/orm, `packages/1-framework/3-tooling/cli/src/orm/family.ts:180` at `v8.0.0-rc.25` (`v7Command('studio', ...)`). The shell appends the Prisma 7 install sentence (`packages/cli/src/v7-redirects.ts:18`, since prisma/prisma-cli#391, in rc.34). Reproduction:

```text
$ prisma studio
✘ [CLI.V7_COMMAND] `prisma studio` is a Prisma 7 command and is not available in Prisma 8
  why: Prisma 8 has no Studio command for browsing and editing your data in a browser. To keep using Prisma 7, install its CLI with `npm install --save-dev @prisma/prisma7@7` and run `prisma7 studio`.
```

Note for whoever settles C1: the CLI's own advice (install `@prisma/prisma7@7` as a dev dependency, run `prisma7 studio`) differs from the docs (`npx prisma@prev studio`, run from the directory above the project). I did not test whether `prisma7 studio` works inside a Prisma ORM 8 project. `orm/coming-from-prisma-orm-7.mdx:207` already describes the CLI's advice correctly.

### C2. No standalone local Prisma Postgres

**Verdict:** still present.

**Evidence:** no command in `packages/cli/src/cli.ts` at rc.35 starts a local Prisma Postgres, and no package depends on `@prisma/dev`. `prisma dev ls` returns `CLI.V7_COMMAND` with "Use the replacement: prisma emulator list".

### C3. `init --db` and `init --prompt`

**Verdict:** still present.

**Evidence:** reproduction with rc.35:

```text
$ prisma init --db
✘ [CLI.V7_FLAG] `--db` on `prisma init` is a Prisma 7 flag and is not available in Prisma 8
  why: `init` creates no database. `postgres create` creates a Prisma Postgres database in the Project this directory is linked to. ...
→ Use the replacement: prisma postgres create <name>
$ prisma init --prompt hello
✘ [CLI.INVALID_ARGUMENTS] No flag registered for --prompt, did you mean --format?
```

Not a fix, but the docs are wrong independently of it: `postgres/troubleshooting.mdx:20-26` says `npx prisma init --db` fails "due to npx caching" of "an outdated cached version". The current CLI rejects the flag on purpose and names `postgres create`. That section needs rewriting whatever is decided for C3. `init --prompt` gets no Prisma 7 redirect, only an unknown-flag error.

### C4. `INIT.CONFIG_KEPT` warning

**Verdict:** still present.

**Evidence:** `packages/cli/src/commands/init.ts:610` at rc.35: `diagnostics: agentsConfigured ? [] : [configKeptDiagnostic(agents)]`. The warning depends only on whether the existing config sets `skills.agents`, not on whether the suggestion equals the default. Passages are still at `guides/integrations/github-actions.mdx:773`, `guides/deployment/bun-workspaces.mdx:490`, `cloudflare-workers.mdx:387`, `docker.mdx:577`, `pnpm-workspaces.mdx:444`, `turborepo.mdx:640`.

### C5. "Prisma agent skills are out of date" with no skills

**Verdict:** still present.

**Evidence:** `packages/cli/src/skills-check.ts` at rc.35, last changed 2026-09-21. `firstOutdatedSkillIn` counts a target in state `absent` as out of date, so a project that never synced gets the notice ("synced none"). Passages still at the four quickstart and add-to-existing pages (line 54 or 96) and the deployment guides.

### C6. Package manager found by walking up to a lockfile

**Verdict:** still present.

**Evidence:** `packages/cli-engine/src/package-manager.ts` (`resolvePackageManager`, last changed 2026-08-11) and prisma/orm `packages/1-framework/3-tooling/cli/src/commands/init/detect-package-manager.ts` (unchanged since 2026-09-24). The engine's comment calls the no-boundary walk "deliberate". Reproduced: in a scratch directory with its own `.git` and `package.json` inside this worktree, `prisma orm init --skip-install` advised "Install it with `pnpm add @prisma/orm-postgres pg`", picking pnpm from the prisma/web lockfile above it.

### C7. `PRISMA_PROJECT_ID` not read

**Verdict:** still present.

**Evidence:** `git grep PRISMA_PROJECT_ID v8.0.0-rc.35 -- 'packages/*/src/**'` finds nothing.

### C8. One connection string

**Verdict:** still present.

**Evidence:** `packages/cli/src/commands/postgres/create.ts:74-85`, `connection-create.ts:57-68` and `connection-rotate.ts:59-73` at rc.35 each print `result.connectionString` only; `presentation.ts:121` has one "connection URL" row. Passages still at `postgres/import-from-existing-database.mdx:53` and `postgres/database/connecting-to-your-database.mdx:208` (moved from 191).

### C9. `project link` accepts a parent directory

**Verdict:** still present.

**Evidence:** `packages/cli/src/commands/project/link.ts` last changed in prisma/prisma-cli#373 (2026-10-28), before the inventory. Passage still at `compute/deploy-on-push.mdx:90`.

### C10. `domain wait --timeout 0` fails on a domain that is not active

**Verdict:** still present.

**Evidence:** prisma/prisma-cli#400 (in rc.35) rewrote the domain commands, and the docs page was already updated for it. At rc.35, `packages/cli/src/commands/service/domain-wait.ts:237`: `if (timeoutMs === 0 || Date.now() >= deadline) { throw domainVerificationTimeoutError(...) }`. Passage now at `compute/domains.mdx:77`.

### C11. Update check treats `CI=false` as CI

**Verdict:** still present.

**Evidence:** `packages/cli/src/update-check.ts:182` at rc.35: `if (runtime.env.CI || runtime.env.GITHUB_ACTIONS)`; last changed 2026-09-30.

### C12. `init` skips the dev dependency when a `postinstall` exists

**Verdict:** still present.

**Evidence:** `packages/cli/src/commands/init.ts:369-383` at rc.35 returns `foreignPostinstallDiagnostic(...)` before `writeHookAndDependency`, so `package.json` is not written and the dependency is only advised.

### C13. A leftover `--confirm` is ignored

**Verdict:** still present.

**Evidence:** `gh issue view 339 -R prisma/prisma-cli`: state OPEN. Passage still at `cli/error-reference.mdx:203`.

### C14. Shared `CLI.*` codes link to the wrong page

**Verdict:** still present.

**Evidence:** `packages/cli-engine/src/execution/rendering.ts` (`withDocsUrl`, last changed 2026-10-08) builds every diagnostic's link from the routed family's `docsBaseUrl`. Reproduction with a `prisma.config.ts` whose `orm` section is invalid:

```text
$ prisma contract emit
✘ [CLI.CONFIG_SECTION_INVALID] The 'orm' section of .../prisma.config.ts is invalid.
  docs: https://docs.prisma.io/docs/orm/v8/reference/error-reference/CLI.CONFIG_SECTION_INVALID
```

That URL redirects to `/docs/orm/reference/error-reference#CLI.CONFIG_SECTION_INVALID`. The ORM page has no entry for that code; the CLI page does.

## prisma/create-prisma

### P1. The scaffold does not load `.env`

**Verdict:** still present.

**Evidence:** `templates/create/_shared/prisma.config.ts.hbs` at v0.14.10 imports `dotenv/config` only in the Deno branch. No script passes `--env-file` outside Deno (`src/tasks/install.ts:35`).

### P2. MongoDB output names `MONGODB_URL`

**Verdict:** still present, but the docs passage is already accurate.

**Evidence:** `src/tasks/prisma-setup/presentation.ts:53` at v0.14.10 still prints "Set MONGODB_URL in your environment … The app reads this secret when it starts". The scaffold confirms it. `MONGODB_URL` is read only under Composer (`module.ts` declares `variable.secret({ name: "MONGODB_URL" })`; `db.ts` falls back to `DATABASE_URL` outside Composer). The inventory's "which nothing reads" was already wrong at 0.14.8. The current sentence at `(index)/prisma-orm/quickstart/mongodb.mdx:48` ("only for running or deploying the app with Prisma Composer") matches. The output's "The app reads this secret when it starts" is misleading for `npm run dev`, which is a create-prisma defect, not a docs one.

### P3. No `db` ref after scaffolding; `dev:composer` and deploy write none

**Verdict:** still present.

**Evidence:** the scaffolded `nextpg` app has `migrations/app/20261126T0941_init/` and no `migrations/app/refs/` directory. `create-prisma` v0.14.10 has no code that writes a ref. The `npm run migrate` paragraph (for example `guides/frameworks/nextjs.mdx:135-139`, "one command does both") already reflects prisma/orm#31169. What remains is the `dev:composer` and deploy paths (`nextjs.mdx:120-124` and `141-145`, and the same two paragraphs in the other framework guides). Those need Composer or create-prisma to write the ref.

### P4. `ERESOLVE` when installing an extension pack

**Verdict:** still present (the exact pin remains), but the failure does not happen with today's versions.

**Evidence:** `npm view @prisma/composer-prisma-cloud@0.40.0 peerDependencies` gives `"@prisma/orm-postgres": "8.0.0-rc.25"`, an exact pin. `@prisma/orm-extension-postgis` and `@prisma/orm-extension-arktype-json` `latest` are both `8.0.0-rc.25`, and their peer is `@prisma/orm-target-postgres: 8.0.0-rc.25`. In the scaffolded `nextpg` app, `npm install --dry-run @prisma/orm-extension-postgis` and `... arktype-json` both succeed.

**Docs change needed:** none yet; keep the workaround, because the failure comes back the moment the ORM publishes an RC that create-prisma and Composer have not followed. The sentence at `orm/extensions/postgis.mdx:25` and `arktype-json.mdx:29` ("that command fails with `ERESOLVE`") is false today, so a reader who tries the plain command will see it work. If you want the text right in both states, say it "can fail" when the extension's latest version is newer than the project's `@prisma/orm-postgres`.

### P5. `db.ts` takes Composer's plain client

**Verdict:** still present.

**Evidence:** `templates/create/_shared/src/prisma/db.ts.hbs` at v0.14.10: `return service.load().database.client;`.

### P6. Missing `DATABASE_URL` surfaces as `Postgres driver not connected`

**Verdict:** still present.

**Evidence:** same template: `process.env.DATABASE_URL ? postgres({ contract, url: ... }) : postgres({ contract })`, and the Composer load error is swallowed by `catch { return undefined; }`.

### P7. Nest needs explicit `@Inject()` tokens

**Verdict:** still present, though not as the inventory describes it.

**Evidence:** the template's own classes have used explicit `@Inject(...)` since v0.8.0 (`templates/create/nest/src/users.service.ts.hbs`, `users.controller.ts.hbs`). The passages (`(index)/getting-started.mdx:52`, `(index)/prisma-orm/index.mdx:114`) are advice to the agent for code it writes. The underlying cause is unchanged: the Node dev script is `tsx watch` (`src/utils/package-manager.ts:382`), and esbuild emits no decorator metadata, so constructor injection without a token fails.

### P8. Next.js `.gitignore` misses `.env.local`

**Verdict:** still present, and wider than the inventory says.

**Evidence:** the source template `templates/create/next/.gitignore` has `.env*`, but npm strips `.gitignore` files from published packages. `npm pack create-prisma@0.14.10` contains no `.gitignore` for any template. The scaffolded Next.js app's `.gitignore` holds only what `orm init` (`node_modules/ dist/ .env`) and create-prisma (`/.alchemy /.prisma-composer`) append:

```text
node_modules/
dist/
.env
/.alchemy
/.prisma-composer
```

So `.next/`, `.env.local`, `.vercel` and every other entry of every template's `.gitignore` are missing in published scaffolds. The fix belongs in create-prisma (ship the files as `gitignore` and rename them, or similar). The docs step at `guides/authentication/clerk/nextjs.mdx:184-188` is still needed.

### P9. Different TypeScript contract output locations

**Verdict:** still present.

**Evidence:** create-prisma's config template sets `output: "./src/prisma/generated"` for TypeScript authoring. prisma/orm `packages/1-framework/3-tooling/cli/src/commands/init/templates/code-templates.ts` `configFile(...)` at rc.25 writes no `output`.

## Section 2: temporary wording about missing features (prisma/orm and create-prisma bullets)

Checked first, as asked:

- **MongoDB prepared queries (prisma/orm#31054):** shipped in rc.25. The docs already say so (`orm/reference/transactions-and-runtime.mdx:769`, "since `8.0.0-rc.25`"), and no "yet" sentence about it is left. Nothing to do.
- **Nested transactions and savepoints (#31106, #31121):** shipped in rc.25. Already documented (`orm/fundamentals/transactions.mdx:63-93`, `transactions-and-runtime.mdx:526-527`, `coming-from-prisma-orm-7.mdx:438`). Nothing to do.
- **MongoDB transactions:** not shipped. `packages/2-mongo-family/7-runtime/src/mongo-middleware.ts:24` at rc.25: "Mongo has no transactions". The "yet" sentences stay.

Now wrong:

- **`orm/index.mdx:42`:** "MariaDB is an early preview, `@prisma/orm-mariadb`, that runs migrations but has no client for your app yet." rc.25 ships `mariadb()` from `@prisma/orm-mariadb/runtime` (prisma/orm#31082, merged 2026-11-18; `packages/3-targets/mysql/2-mariadb/9-facade/src/runtime/mariadb.ts`). `orm/supported-databases.mdx:49` already says "Since `8.0.0-rc.25`, your app can read and write too". Suggested text: "MariaDB is an early preview, `@prisma/orm-mariadb`, that runs migrations and reads and writes data." This matches `supported-databases.mdx:95` and `supported-versions.mdx:42`.

Checked and still missing in rc.25, so the wording stays:

- MongoDB `whereUnique`: not in any `packages/2-mongo-family` source.
- `.include` on an id array (`from-mongoose.mdx:357`): the Mongo ORM still refuses compound references (`collection.ts:493`), and there is no to-many include over an id list.
- Prisma ORM 6 MongoDB schema features (`guides/upgrade-prisma-orm/mongodb.mdx:209-222`): every `PSL.PRISMA6_MONGO_*_UNSUPPORTED` code in the table still exists in rc.25 source.
- MySQL and MariaDB: row locks, `LATERAL` joins, `RETURNING` and skipping conflicting rows are still refused in `packages/3-targets/mysql/1-mysql/2-adapter/src/core/sql-renderer.ts` (lines 269, 302, 374, 793). The migration planner still refuses other changes as "not yet supported by the migration planner".
- Migration tooling: no squash, split, rehearsal or shadow-database command, and no apply-time check that `ops.json` matches `migration.ts`. The migration commands mounted in `orm/family.ts` are check, graph, list, log, new, plan, ref, show and status.
- Client gaps in `coming-from-prisma-orm-7.mdx#not-available-yet`: no atomic increment, list filters, JSON-path filters or `maxWait` in `sql-orm-client` source.
- `contract print` with `Unsupported(...)` (`cli/configuration.mdx:151`, `cli/contract-print.mdx:53`): `CONTRACT.PRINT_UNSUPPORTED` is still thrown for contracts PSL cannot express. I did not reproduce this case.
- The generated `orm/reference/error-reference.mdx` is synced from tag `v8.0.0-rc.25`, so its wording matches the release by construction.
- create-prisma, Deno (`guides/runtimes/deno.mdx:27`): `src/tasks/prisma-setup/context.ts:182-189` at v0.14.10 still refuses Deno with anything but PostgreSQL and the minimal template.

Cannot tell:

- `orm/reference/orm-client.mdx:1163` and `1364`, many-to-many `connect()` on MySQL or MariaDB throwing `RUNTIME.AST_UNSUPPORTED`. No rc.25 commit names it, and no test asserts it either way. Settling it needs a MySQL server.

Already gone: `typescript-schema-builder.mdx:286` (the `.defaultSql` "stable 8.0.0" sentence) is no longer on the page.

Minor, not a "yet" sentence: `orm/migrations/applying-a-migration.mdx:9` says `db migrate` works on "PostgreSQL and MongoDB, with SQLite still experimental". It leaves out MySQL and MariaDB, which `supported-databases.mdx:47-49` says run `db migrate`.

## Section 3: notes about earlier release candidates

I found none that rc.25 or rc.35 now contradicts. What I checked against the release:

- `orm/coming-from-prisma-orm-7.mdx:207`: the `CLI.V7_COMMAND` description matches rc.35 output exactly, including the `@prisma/prisma7@7` install sentence.
- `cli/db-migrate.mdx:15, 32`: the rc.25 change to the `db` ref and `--no-advance-ref` match prisma/orm#31169.
- `cli/migration-plan.mdx:102` and `cli/db-update.mdx:92`: "On MySQL and MongoDB … as before rc.25" matches prisma/orm#31088, which covers PostgreSQL and SQLite only.
- `cli/orm-init.mdx:171, 181`: target packages since `prisma` rc.35 match prisma/orm#31128 (in toolchain rc.25, which rc.35 pins).
- `cli/configuration.mdx:32`: the removed name is `defineConfig` from `@prisma/cli-engine`. `definePrismaConfig` is still exported there, and rc.25's `orm init` writes that import, which `cli/orm-init.mdx:59` already explains.
- `orm/contract-authoring/typescript-schema-builder.mdx:53` (`CONTRACT.TARGET_MISMATCH`, prisma/orm#31091), `orm/extensions/using-extensions.mdx:72` (variable-length pgvector, prisma/orm#30664), `orm/data-modeling/mongodb.mdx:75` and `psl-syntax.mdx:190` (convenience types and deprecated names, prisma/orm#31065 and TML-3790): each matches a commit in rc.25.

The other notes describe behaviour before rc.24 and were not changed by rc.25. I read each line but did not re-derive every older claim from the source.
