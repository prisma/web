# Composer items checked against Composer 0.40.0

Checked against tag `v0.40.0` in prisma/composer, `prisma` 8.0.0-rc.36 (which depends on `@prisma/composer-cli` 0.40.0), and `create-prisma` 0.14.10 (which installs `@prisma/composer` 0.40.0). Docs read from prisma/web `origin/main` (`b3525d8b6`). Line numbers below are on that commit.

Reproductions ran in `wip/release-check-2/composer/app` (npm, Node 24.13) and `wip/release-check-2/composer/bunws` (a Bun 1.3.13 workspace with isolated installs), both on the published 0.40.0 packages. Only `prisma dev` ran; nothing was deployed.

## Summary

| Item | Verdict | Docs change |
| --- | --- | --- |
| M1 `effect` version conflict | still present, but the symptom changed | rewrite the symptom text on 5 pages |
| M2 Bun workspace direct dependencies | fixed in the release | delete the note |
| M3 `--fresh` after upgrading | still present (Composer documents it as designed) | none |
| M4 failed first deploy leaks resources | partly fixed | rewrite one sentence |
| M5 named hostname only in production | already removed from the docs | none |
| M6 control API ignores `auth login` | still present (Composer documents it as designed) | none |
| M7 `HostedStateBootstrapError` for an older Composer's project | still present (designed refusal) | none for M7; see the general naming item |
| M8 pin `arktype` to Composer's version | fixed in the release (no pin needed) | simplify one sentence |
| M9 remove `import 'dotenv/config'` | still present | none for M9 (but the same paragraph names the removed `envParam()`) |
| M10 local buckets ignore conditional headers | still present | none |
| M11 local database cannot run PostGIS | still present | none |
| M12 `bootstrapService` has no `close()` | still present | none |
| Unsure: cold starts return `ECONNRESET` | designed, not a workaround | none |
| Unsure: `dependencies: "external"` and the silent 502 | designed option; the 502 is still present | none |
| Unsure: `.gitignore` for state folders by hand | still present (Composer writes none) | none |
| Unsure: provision names of at least three characters | fixed since Composer 0.35 (not reproduced) | delete the rule; `if (input.enabled)` half is designed |
| Unsure: project naming and `HostedStateBootstrapError` | designed, not a workaround | one example in the full-stack tutorial is false |
| Unsure: `MONGODB_URL` stored on the first deploy wins | **behaviour removed in 0.39; sentence now false** | rewrite on 8 framework guides |
| Section 2, Composer bullet | all still missing, except one | `cli/global-flags.mdx:41` is now false |

Now false in the docs, most important first:

1. The MongoDB paragraph in 8 framework guides says the first deploy copies `MONGODB_URL` to the project. Since Composer 0.39 a deploy never copies a variable; it stops and prints the `prisma project env add` command.
2. `cli/global-flags.mdx:41` says `prisma deploy` writes no data lines. It does.
3. The `effect` conflict section says `prisma.config.ts` fails to load with `CLI.CONFIG_UNREADABLE`. In my reproduction the config loads, and `prisma dev` fails later, at the converge step.
4. `composer/core-concepts.mdx:101` says a retry does not manage resources left by a failed first deploy. A retry now finds and uses them.
5. `(index)/full-stack-tutorial.mdx:227` gives "one deployed from a different checkout" as a cause of `HostedStateBootstrapError`. Deploy state is hosted and shared, so another checkout of the same app deploys normally.
6. Found while checking, outside my items: many Composer pages still describe `envSecret()`, `envParam()` and the deploy copying secrets from the shell. 0.39 stopped the copying and 0.40 removed both functions. See "Other findings" at the end.

---

## M1. A different `effect` version breaks `prisma.config.ts`

**Verdict:** still present, but the symptom changed. The docs' description of the failure is wrong for 0.40.0.

**Evidence:**

- `@prisma/composer` 0.40.0 and `@prisma/composer-prisma-cloud` 0.40.0 still depend on exactly `effect` 4.1.4 and `alchemy` 2.0.0-beta.87 (`npm view`). The pin stays, so a conflict is still possible.
- Reproduction in `composer/app`. I added a direct `effect@3.19.0` to a working 0.40.0 app with npm. npm nested Composer's `effect` and `alchemy` under `node_modules/@prisma/composer/node_modules/` and `node_modules/@prisma/composer-prisma-cloud/node_modules/`. Then:
  - `npx prisma dev url cc-check-app.quotes` loaded `prisma.config.ts` without error. It reported `DEV.NOT_RUNNING`, the normal answer for a stopped app. So the config does not fail to load.
  - `npx prisma dev --detach` failed at the converge step, with exit code 2:

    ```text
    ▸ converge
    Alchemy could not load the required peer dependency "@effect/platform-node".
    Install a compatible version of "@effect/platform-node" in the same project as "alchemy".
    ✘ [DEV.CONVERGE_FAILED] The app could not be converged.
    ConvergeWorkerExited: The converge worker thread exited with code 1 before it reported an outcome.
    ```
  - I removed the direct `effect` and reinstalled. `prisma dev` then reached `dev: ready`, so the conflict was the cause.
- Since 0.39 and 0.40, `deploy`, `destroy` and `dev` all run Alchemy inside the `prisma` process (prisma/composer#405, #411, #439; ADR-0066, 0067, 0068). That is a likely reason the failure moved from loading the config to running Alchemy. I did not run `deploy`, which is not allowed here. It loads Alchemy the same way, so it very likely fails too, but I cannot show its error code.
- I tested only npm with a direct `effect` 3 pin. The fix the section gives (match Composer's `effect`, or force it with an override) still applies.

**Docs change needed:** keep the section and the overrides, but rewrite the symptom.

- `composer/deploying.mdx:165`, heading "When prisma.config.ts fails on an effect version conflict". Rename it, for example to "When `dev` or `deploy` fails on an effect version conflict". The anchor is linked from the four pages below, so update those links too.
- `composer/deploying.mdx:167-174`: "evaluating `prisma.config.ts` fails before any command runs: `Cannot find module '.../effect/dist/unstable/http/FetchHttpClient.js'` … Commands that do not read the config, such as `prisma --version`, still run." Change it to: commands that run the deploy engine fail when they start it. Under `prisma dev` that is `DEV.CONVERGE_FAILED`, with Alchemy's message `Alchemy could not load the required peer dependency "@effect/platform-node"` above it. Commands that only read the config still run.
- `composer/getting-started.mdx:46` ("The CLI then cannot evaluate `prisma.config.ts` and stops with `CLI.CONFIG_UNREADABLE`"), `composer/limitations.mdx:20` ("the CLI cannot evaluate `prisma.config.ts`"), and `(index)/index.mdx:171` ("`prisma.config.ts` fails with `CLI.CONFIG_UNREADABLE`"): change them to the new symptom.
- `(index)/prisma-compute/deploy.mdx:32, 118`: these link to the section without describing the error. Update only the anchor.

## M2. In a Bun workspace, `alchemy` and `@prisma/dev` must be direct dependencies

**Verdict:** fixed in the release.

**Evidence:**

- `DEPLOY.ALCHEMY_BIN_MISSING` and `resolveAlchemyBin` are gone at v0.40.0. ADR-0068 ("destroy runs Alchemy in process") retires `DEPLOY.ALCHEMY_BIN_MISSING`, `DEPLOY.NODE_MISSING` and `DEPLOY.STACK_WRITE_FAILED`. Since #405, #411 and #439, no command looks for Alchemy's bin.
- `@prisma/dev` resolves from Composer's own package, not from the app: `packages/1-prisma-cloud/0-lowering/local-target/src/prisma-dev-module.ts` calls `createRequire(import.meta.url).resolve('@prisma/dev')`. The code comment says the app's copy is ignored on purpose.
- Reproduction in `composer/bunws`. I made a Bun workspace (`bun install --linker isolated`) whose app package lists only `@prisma/composer`, `@prisma/composer-prisma-cloud`, `arktype` and `prisma`. The app's `node_modules` held only `@prisma/*`, `arktype` and `prisma`: no `alchemy` and no `@prisma/dev`. With a service and a `rawPostgres()` database, `bunx prisma dev --detach` printed `postgres emulator ready`, `✔ converge`, `dev: ready`. `prisma dev url cc-bun-app.database` returned a running connection string.
- Not reproduced: `deploy` in a Bun workspace. It runs Alchemy in process from Composer's own dependencies (ADR-0066), so the bin lookup the note describes no longer exists.

**Docs change needed:**

- `composer/getting-started.mdx:48-59`: delete the whole `:::note[Bun workspaces]` block ("In a Bun workspace … A single-package Bun project is not affected.").
- `composer/getting-started.mdx:29`: "**npm, pnpm, or Bun.** Bun workspaces need two extra direct dependencies; see the note in step 1." Change it to "**npm, pnpm, or Bun.**"

## M3. Local state from an older Composer breaks `dev`; `--fresh` wipes it

**Verdict:** still present. Composer documents it as designed.

**Evidence:** Composer's own `docs/guides/running-locally.md` (around line 331) and `docs/guides/deploying.md:710` at v0.40.0 give the same fix: "Local dev state written with retired resource types is not converted … run it once with `--fresh`". The emulators' code says "Local dev state is never migrated across versions" (`dev-emulators/src/compute-main.ts:1165-1170`, `buckets-main.ts:431`).

**Docs change needed:** none.

## M4. A failed first deploy leaks untracked resources

**Verdict:** partly fixed. A retry now takes over the resources. A destroy does not.

**Evidence:**

- prisma/composer#367 (merged 2026-10-20, first in a release by 0.33.0): "a deploy interrupted mid-create resumes on the next deploy". On the app's own project and branch, an App, Database or Bucket whose `logicalId` is a node's address belongs to that node, even if the deploy state has no record of it (`asOwnRow`, `adopt(true)`). Environment variables are matched by their `COMPOSER_` key. ADR-0051 was amended to match.
- Composer's `docs/guides/deploying.md` at v0.40.0: "if a deploy is interrupted after a resource was created but before it was recorded, the next deploy finds the resource by its address and carries on. Destroy does not do this: after an interrupted production deploy, deploy once more before destroying, or the half-created resource is left behind."
- An environment other than production is destroyed by deleting its branch, which removes everything on it, so the remaining gap is production.

**Docs change needed:** `composer/core-concepts.mdx:101`. Current sentence: "One edge sits outside that guarantee: if an environment's very first deploy fails before its state is written, resources created up to that point are untracked, and neither a retry nor a destroy will manage them." Replace it with: "If a deploy is interrupted after it created a resource but before it recorded it, the next deploy finds that resource by its address and uses it. A destroy does not: after an interrupted production deploy, deploy once more before you destroy, or the half-created resource is left behind."

## M5. A named hostname works only in production

**Verdict:** already removed from the docs.

**Evidence:** neither `composer/deploying.mdx` nor `composer/limitations.mdx` has the sentence on `origin/main`. `git grep "only in production"` finds nothing. It was removed by `0f0c67f36` ("custom domains attach to any branch, not only production", #8899).

**Docs change needed:** none.

## M6. The control API ignores the `auth login` session

**Verdict:** still present. Composer documents it as designed.

**Evidence:**

- `DestroyInput` (`cli/src/operations/destroy.ts`) has no credentials field. With no credentials, `requireWorkspaceId` in `target/src/container.ts:176-181` reads `PRISMA_WORKSPACE_ID` and throws `environment variable PRISMA_WORKSPACE_ID is required.`.
- Composer's `docs/guides/deploying.md:20-23` at v0.40.0: "The operations of `@prisma/composer/control`, and so a destroy script, never use a `prisma auth login` session."
- #405 made `prisma deploy` work after `prisma login` with no service token. That is the CLI command, which the docs already describe correctly.
- `prisma` 8.0.0-rc.36 still has no `destroy` command (`packages/cli/src/commands/` has no destroy; Composer's command family mounts `deploy`, `deploy list`, `dev`, `dev url`, `dev stop`, `emulator list`).

**Docs change needed:** none. The passages at `composer/deploying.mdx:125, 158`, `composer/getting-started.mdx:334`, `composer/limitations.mdx:18` and `cli/deploy.mdx:76` are still true.

## M7. `HostedStateBootstrapError` for a project deployed by an older Composer

**Verdict:** still present. Composer refuses this case on purpose and does not adopt older state.

**Evidence:** `lowering/src/state/layer.ts` probes the state scope before Alchemy runs. If the scope is empty but the branch already has apps, databases or buckets, `failOnEmptyScopeWithLiveResources` (`state/empty-scope.ts`) fails, and the failure is wrapped as `HostedStateBootstrapError`. The code comment gives the reason: "The rows could be identified by logicalId, but the rest of the state could not be rebuilt from them (ADR-0057), so fail once, up front." The message tells the reader to delete the environment, or destroy it with the older version first.

**Docs change needed:** none for the "older version" case. One example of another cause is false; see "Project naming and `HostedStateBootstrapError` in general" below.

## M8. `arktype` must be pinned to Composer's version

**Verdict:** fixed in the release. A plain install gives one copy.

**Evidence:**

- `@prisma/composer` 0.40.0 has `arktype` as an optional peer dependency `^2.2.3`, and `@prisma/composer-prisma-cloud` 0.40.0 depends on `^2.2.3`. Both are ranges, not exact pins. The same was true at 0.34.0, the version `deploy-existing-app.mdx` installs, and 0.37.0.
- Reproduction in `composer/app`: `npm install @prisma/composer@0.40.0 @prisma/composer-prisma-cloud@0.40.0 arktype …` installed `arktype@2.2.10` (latest). `npm ls arktype --all` shows nine references, all `arktype@2.2.10 deduped`: one copy.

**Docs change needed:** `guides/compute/deploy-existing-app.mdx:163`. Current: "Add `arktype` as a direct dependency, at the version `@prisma/composer` already uses, which `npm ls arktype` prints." Change it to: "Add `arktype` as a direct dependency (`npm install arktype`)." A caveat: this page pins Composer 0.34.0 (inventory item X1). At 0.34.0 the range is also `^2.2.3`, so the simpler sentence holds there too.

## M9. `.env` handling: remove `import 'dotenv/config'` when you list `dotenv()`

**Verdict:** still present.

**Evidence:** `orm init` at prisma/orm `v8.0.0-rc.25` still writes `import 'dotenv/config';` as the first line of `prisma.config.ts` (`cli/src/commands/init/templates/code-templates.ts:19, 45`). Composer's `dotenv()` at v0.40.0 (`cli/src/config-adapters.ts`) "does not read or change the process environment", and `environmentVariables()` reads `process.env`. So an imported `dotenv/config` still puts `.env` into the shell's values, and the advice holds.

**Docs change needed:** none for this item. But `composer/local-development.mdx:194` says "To read secrets and `envParam()` values from `.env` files". 0.40.0 removed `envParam()` (#431); see "Other findings".

## M10. Local stand-in buckets ignore conditional headers

**Verdict:** still present.

**Evidence:** the local S3 handler (`packages/1-prisma-cloud/0-lowering/s3-protocol/src/handler.ts`, `fs-store.ts`, `memory-store.ts`) and `dev-emulators/src/buckets-main.ts` have no `If-Match`, `If-None-Match`, `412` or precondition handling at v0.40.0 (case-insensitive grep).

**Docs change needed:** none (`storage/behavior.mdx:40`).

## M11. `dev:composer`'s local database (PGlite) cannot run PostGIS

**Verdict:** still present.

**Evidence:** Composer's local Postgres is `@prisma/dev`, resolved from Composer's own dependencies. `@prisma/composer-prisma-cloud` 0.40.0 depends on `@prisma/dev` `^0.25.2`. The `@prisma/dev` 0.25.2 tarball depends on `@electric-sql/pglite` 0.4.3 and loads no PGlite extensions. It imports only `@electric-sql/pglite`, `pglite-socket` and `pglite-tools/pg_dump`, and the string `postgis` does not appear anywhere in the package.

**Docs change needed:** none (`orm/extensions/postgis.mdx:29`).

## M12. `bootstrapService` has no `close()` and cannot use port 0

**Verdict:** still present.

**Evidence:** `packages/1-prisma-cloud/1-extensions/target/src/testing.ts` at v0.40.0 returns `{ url, fetch }` only. Its doc comment says "No `close()`". It refuses a non-numeric port, with the message that "the booted entry self-listens with no way to report an OS-assigned one back".

**Docs change needed:** none (`composer/testing.mdx:67-68`).

---

## Unsure: cold starts return `ECONNRESET`

**Verdict:** designed, not a workaround. It describes the platform's scale-to-zero behaviour correctly.

**Evidence:**

- Composer's own `docs/guides/deploying.md:558` and `skills/prisma-composer-core-concepts/SKILL.md:704-705` at v0.40.0 list it under "Production behavior" as a property of Compute, with the same advice.
- The claim that "the generated RPC client already does" retry is true. `service-rpc/src/client.ts` `callWithRetry` retries a thrown error, a 429 or a 5xx, up to 5 times with jittered backoff, reusing one idempotency key.
- I found no ticket or decision in prisma/composer or pdp-control-plane `origin/main` that treats the reset as a defect, or that plans for the ingress to hold the request. Whether the ingress could hold requests during a cold start is a platform question. pdp-control-plane is evidence of intent only, and I found nothing there either way.

**Docs change needed:** none (`composer/deploying.mdx:238`, `composer/limitations.mdx:31`).

## Unsure: `dependencies: "external"` and the silent 502

**Verdict:** the option is designed. The deploy that succeeds and then serves 502 is still present.

**Evidence:**

- `node()` at v0.40.0 (`2-authoring/node/src/node.ts`, `control/build.ts`) documents `'bundled'` (the default) and `'external'`. Composer's `docs/guides/building-an-app.md:1166-1195` says: "If `dependencies` is wrong and a package is missing, the service fails to start with the runtime's own error". It also lists Astro's Node adapter as a build that needs `'external'`.
- Composer's `docs/guides/deploying.md:333` at v0.40.0: "Prisma Cloud still reports a service that fails at boot as running, and the deploy promotes it, so the deploy succeeds". So "the deploy succeeds and every request returns a 502" is the current behaviour. The deploy's success before the service answers is the same gap as inventory item X2.

**Docs change needed:** none. `guides/compute/astro-marketing-site.mdx:216, 344` and `guides/compute/deploy-existing-app.mdx:80` are correct for 0.40.0. The `prisma service logs` command that line 344 uses exists in rc.36 (`packages/cli/src/commands/service/logs.ts`).

## Unsure: `.gitignore` for Composer state folders by hand

**Verdict:** still present. Composer writes no `.gitignore`, so the step is needed. It is a missing convenience, not a defect workaround.

**Evidence:**

- No `.gitignore` writing anywhere in Composer's `packages/**/src` at v0.40.0.
- Reproduction in `composer/app`: after `npx prisma dev --detach`, the app directory had `.alchemy/state/<app>/<environment>` and `.prisma-composer/{artifacts,dev}`, and no `.gitignore` in either (`find -name .gitignore` outside `node_modules` found none).
- `.alchemy` is still written: `prisma dev` converges against Alchemy's local file store (`devState()` → `localState()`, `core/src/control/local-target.ts:74`), and `destroy` checks `<cwd>/.alchemy` (`execute-deploy-destroy.ts:75`).
- `.prisma/`, which `deploy-existing-app.mdx:261` also lists, was not created by `prisma dev` in my app. I did not check what writes it.

**Docs change needed:** none (`guides/compute/astro-marketing-site.mdx:246-251`, `guides/compute/deploy-existing-app.mdx:261`).

## Unsure: provision names of at least three characters; `if (input.enabled)` not caught

**Verdict:** the three-character rule has been obsolete since Composer 0.35 (not reproduced, because it needs a deploy). The `if (input.enabled)` half is designed.

**Evidence for the three-character rule:**

- In the Management API (pdp-control-plane `origin/main`), the only names with a three-character minimum are connection names: `services/management-api/routes/v1/databases/connections.ts:43` and `routes/v1/connections.ts:229` (`.min(3)`, `.max(65)`). Projects, apps, databases and buckets have no such minimum in the routes.
- Since #384 (ADR-0057, first released in 0.35.0), Composer names a database's connection by the node's full address, starting with the app name: `Prisma.Connection(..., { name: address })` in `target/src/descriptors/shared.ts:233-236`. The same holds at 0.36.0, 0.37.0 and 0.40.0. An address is `<app>.<id>`, so it is at least three characters even when the id is `db` (for example `shop.db`). A two-character provision id can no longer break the rule.
- Composer's own `docs/guides/building-an-app.md:364-366` still states the rule. It looks stale there too.
- Not proven: I could not deploy to see the platform accept a `db` id. When the evidence is this indirect, a wrong "fixed" costs a reader one clear platform error ("Name must contain at least 3 characters"), not lost data.
- Side note: the same route caps a connection name at 65 characters, so a long address could now break that limit. I did not find a check for it in Composer.

**Evidence for `if (input.enabled)`:** Composer's `docs/guides/building-an-app.md:410-414` and `skills/prisma-composer-core-concepts/SKILL.md:157` at v0.40.0 state the same rule. A module's input field is an object placeholder, and JavaScript gives no hook to intercept a truthiness check, so it cannot be caught.

**Docs change needed:**

- `composer/apps-and-modules.mdx:52`: "Two naming rules the platform enforces: provision names must be at least three characters (call a database `'database'`, not `'db'`; the wiring key on the service side can still be `db`), and ids must be unique within their module." Change it to: "Ids must be unique within their module." Lower confidence than the other verdicts; see above.
- `:126`: no change.

## Unsure: project naming and `HostedStateBootstrapError` in general

**Verdict:** designed, not a workaround. One example in the full-stack tutorial is false.

**Evidence:**

- `resolveProject` in `lowering/src/container.ts:106-140` (v0.40.0) first finds the project whose `logicalId` equals the app name. If none, it falls back to the oldest project with that display name. If none, it creates one with `logicalId: appName`. This is ADR-0024 as amended by ADR-0051.
- A project made by hand with `project create my-app` has no logical id, so the display-name fallback selects it. If it already holds a database, the empty-state check (M7) stops the deploy with `HostedStateBootstrapError`. So "Name the project differently from your app" (`(index)/prisma-orm/quickstart/postgresql.mdx:58`, `(index)/full-stack-tutorial.mdx:189`, `(index)/prisma-orm/index.mdx:111`) is correct advice. So is the "same name goes to the same project" paragraph in `guides/runtimes/bun.mdx:177`.
- Deploy state is hosted on the branch and shared by everyone who deploys the app. Composer's `docs/guides/deploying.md:139` says "your laptop and CI see the same world". A second checkout of the same app therefore finds the state and deploys normally. It does not hit `HostedStateBootstrapError`.

**Docs change needed:** `(index)/full-stack-tutorial.mdx:227`. Current: "If a `my-app` project exists whose hosted state the CLI cannot verify (one deployed from a different checkout, for example), the deploy stops with `HostedStateBootstrapError`". Replace the example with true ones: "(one you created by hand and put a database in, or one deployed by an older version of Composer, for example)".

## Unsure: `MONGODB_URL` stored on the first deploy wins

**Verdict:** feature removed, sentence now false. Since Composer 0.39 a deploy never copies a variable from your shell.

**Evidence:**

- prisma/composer#426 (first in 0.39.0): "prisma deploy stops copying secrets from your local environment to Prisma Cloud, and fails only when a service needs a missing one". #431 (0.40.0) replaced `envSecret()` with `variable.secret({ name })` and confirms that "the operator still sets it with `prisma project env add`".
- Composer's `docs/guides/deploying.md:304-333` at v0.40.0: a variable a service needs that has no value fails the deploy and prints `prisma project env add '<NAME>=<value>' --project '<project id>' --role production`. "A new app's first deploy creates its project, then stops at this step if a service needs a variable, with the commands and the new project id. Set the variables and deploy again."
- `create-prisma` 0.14.10 installs `@prisma/composer` 0.40.0 (`src/constants/dependencies.ts:6-7`). Its MongoDB `module.ts` template declares `provision(variable.secret({ name: "MONGODB_URL" }))`, and its README says: "Before deploying, set it on Prisma Cloud with `prisma project env add`; a deploy without it stops and prints the command to run."
- `prisma project env add` in rc.36 takes `--project <id-or-name>`, and reads the value from the shell when given only the key (`env-add.ts:78`).

**Docs change needed:** the MongoDB paragraph in `guides/frameworks/astro.mdx:30`, `elysia.mdx:20`, `hono.mdx:20`, `nestjs.mdx:20`, `nextjs.mdx:22`, `nuxt.mdx:30`, `sveltekit.mdx:30` and `tanstack-start.mdx:30`. Current text: "The first deploy copies the value to your project on Prisma Compute, and the deployed app reads it from there. Later deploys keep that stored value even if you export a different one. To change it, export the new connection string as `MONGODB_URL` and run `npx prisma project env update MONGODB_URL --project my-app --role production`, which copies the exported value to the project …; the app gets the new value on its next deploy." Replace it with: "A deploy does not read `MONGODB_URL` from your shell. The first deploy creates the project, then stops and prints the command that sets the variable. With `MONGODB_URL` exported, run `npx prisma project env add MONGODB_URL --project my-app --role production` and deploy again. To change it later, export the new value and run `npx prisma project env update MONGODB_URL --project my-app --role production`; the app gets the new value on its next deploy." Keep each page's project name and package-manager prefix, and the closing sentence about `--name`. The "Neither `dev:composer` nor a deploy creates a MongoDB database" part stays.

---

## Section 2: Composer temporary wording

| Location | Verdict | Evidence |
| --- | --- | --- |
| `composer/limitations.mdx:3, 9` (front matter and intro, "does not do yet") | still accurate | general framing; the list below it still holds |
| `composer/limitations.mdx:13` and `composer/services-and-contracts.mdx:22` (RPC over HTTP only; no gRPC, WebSocket or streaming contracts yet) | still missing | Composer `docs/guides/building-an-app.md:74`: "There are no gRPC, WebSocket or streaming contracts yet." |
| `composer/limitations.mdx:14` (no in-memory contract bindings yet) | still missing | `skills/prisma-composer-core-concepts/SKILL.md:752` says the same at v0.40.0 |
| `composer/limitations.mdx:24`, `composer/local-development.mdx:198`, `cli/dev.mdx:23` (Windows not supported yet) | still missing | `execute-dev.ts:335`: "local dev is not supported on Windows yet." (`DEV.PLATFORM_UNSUPPORTED`); `docs/guides/running-locally.md:476` |
| `composer/limitations.mdx:25` (Node 22.18 / 24.11 / 26) | still true | `engines.node` of both packages at 0.40.0: `^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` |
| `composer/local-development.mdx:116`, `cli/emulator.mdx:11` (no command to remove a deleted directory's instances) | still missing | the command family has only `emulator list` (`composer-cli/src/exports/family.ts`) |
| `cli/emulator.mdx:65` (no `emulator start` or `stop` yet) | still missing | same |
| `composer/local-development.mdx:152-187`, `cli/dev.mdx:112` (no `log` command) | still missing | the command family mounts `deploy`, `deploy list`, `dev`, `dev url`, `dev stop`, `emulator list`. rc.36's `prisma service logs` reads a deployed Compute service, not the local app |
| `composer/deploying.mdx:123-140` (no `destroy` command) | still missing | no destroy command in rc.36 or in the command family; `destroy` is in `@prisma/composer/control` only |
| `(index)/prisma-compute/deploy.mdx:246` (teardown needs the control API with service-token credentials, or a branch deletion in the Console) | still true | see M6 |
| `composer/core-concepts.mdx:135, 145`, `composer/building-blocks.mdx:9, 81` (cron, storage and streams are the whole catalogue today) | still true as documented | Composer's own guide lists the same three (`building-an-app.md:474-484`). Note: `@prisma/composer-prisma-cloud` 0.40.0 also exports `./auth` and `./email` modules, which neither Composer's guide nor our docs mention; I treat them as unreleased. No `prisma-composer-*` packages on npm (`npm search`) |
| `cli/global-flags.mdx:41` ("`prisma deploy` does not write data lines yet") | **feature shipped, sentence now false** | see below |

**`cli/global-flags.mdx:41`.** Composer's deploy command (`cli/src/family/commands/deploy.ts:242-247` at v0.40.0) writes one data line per deployed entity to stdout: `dataLine([node.address, entity.kind, entity.id, entity.url])`, tab-separated. Composer's `docs/guides/deploying.md` documents it: "Piped, `prisma deploy` writes one line per deployed entity with four tab-separated fields". It has been there since 0.37.0. Docs change: replace "`prisma deploy` does not write data lines yet, so a script reads its result with `--json`." with "`prisma deploy` writes one data line per deployed entity: the node's address, the entity kind (`compute-service`, `postgres-database` or `bucket`), its id and its URL, which is empty for an entity without one." Consider adding a `deploy` row to the data-lines table on that page, and a sentence on `cli/deploy.mdx`.

---

## Other findings (outside my items, now false at 0.40.0)

Several Composer pages still describe the variable API from before 0.39 and 0.40:

- `composer/local-development.mdx:128`: "`.env.test` … copies a secret from it to the platform when the environment does not have that secret yet". False since 0.39 (#426).
- `composer/deploying.mdx:160-163`: "**`envSecret`:** when an environment does not have a secret's platform variable yet, the deploy copies the value from your app secrets". False since 0.39. Also `envSecret`/`envParam` were removed in 0.40.
- `envSecret()` / `envParam()` examples and explanations that no longer compile with 0.40.0 (#431): `composer/apps-and-modules.mdx:86, 94, 118, 143, 158, 168`; `composer/building-blocks.mdx:56, 63`; `composer/core-concepts.mdx:88-89`; `composer/local-development.mdx:194`; `composer/porting-an-app.mdx:40`; `cli/error-reference.mdx:323`; `(index)/index.mdx:172`; `composer/service-input.mdx` throughout. That page has a banner at line 11 saying so, but its line 165, "the app secrets are where a missing `envSecret()` variable is copied from", is false for the same reason. `guides/compute/deploy-existing-app.mdx` has a similar banner. The replacement is `provision(variable({ name }))` or `provision(variable.secret({ name }))` in the app root (Composer `docs/guides/building-an-app.md:395-398`; #431 has a migration guide). This deserves its own docs task.

## Left behind on this machine

`prisma dev` registered two stopped apps with the shared local emulators: `cc-check-app` (environment `cccheck`, from `wip/release-check-2/composer/app`) and `cc-bun-app` (environment `ccbun`, from `wip/release-check-2/composer/bunws/packages/app`). Both are stopped, but each keeps a reserved port (3000 and 3001), and the second keeps a small local database. No command removes them (the gap in `cli/emulator.mdx:11`). Running `prisma dev --fresh` in those directories resets them; deleting the directories leaves the records orphaned.
