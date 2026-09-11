# Slice 1: corrections to published pages

Scope: fix what is wrong on pages that exist today, without moving, adding, or removing pages. Everything in `changes.md` section B, plus A4 (two label edits). Sections A, C, D are out of scope and come after the IA discussion. Each fix cites the rc.9 source line it was verified against; the audit files under `audit/` hold the line lists.

## Proposed batches

Three PRs to `prisma/web`, in this order. Each is reviewable on its own and does not depend on the others.

### PR 1: mechanical renames (about 350 lines, 20 pages)

Search-and-replace with a known correct form. Low judgement, high volume. Reviewer checks the diff is uniform.

| Item | What changes | Pages |
|---|---|---|
| B11 | `execute(plan)` to `query(plan)` for row reads; Mongo `db.execute(plan)` to `(await db.runtime()).query(plan)`; `ps.execute` to `ps.query`; drop `executePrepared`. Writes with no returned rows stay on `execute`. | 14 |
| B1 | `.take()`/`.skip()` to `.limit()`/`.offset()`; keep Mongo pipeline `skip` stages | 8 |
| B2 | `createCount` and siblings to `createAndCount` and siblings, including headings | 2 |
| B12 | drop the `sha256:` prefix on every hash | 9 |
| B13 | `extensionPacks` to `extensions` | 2 |
| B14 | migration directory listing and `migration.ts` imports to the `migrations/snapshots/<hex>/` layout | 3 |
| B4 | remove `@db.Uuid`; re-point the named-types example at a real alias | 1 |
| B21 | stale flags, codes, command names, and printed output (`--skip-skills`, `CLI.INIT_SKILL_INSTALL_FAILED`, bare `ref set`, `prisma-cli` hints, `PN-RUN-3000`, `from: null`, the "Applied 1 migration(s)" line, `cd prisma`, top-level `migrate`, hyphenated slugs, `--db` shown as required) | 10 |
| B23 | `db.runtime().close()` to `db.close()` | 4 |
| B26 | enum ordering note updated for rc.9 | 1 |

### PR 2: page rewrites (about 12 pages)

Sentences change, not just names. Each page gets one commit so the reviewer can read it as prose.

| Item | Page | What changes |
|---|---|---|
| B15 + B3 + B10 | both `add-to-existing-project` pages | default path is `src/prisma/`; `orm init` writes no skills; `.env` is a prompt; show `db.ts` once; one `DATABASE_URL` story; Temporal polyfill note; `--write-env` / `--schema-path`; `db.orm.public.User` |
| B16 | six `orm/migrations/*`, `cli/migration-plan`, `cli/db-init`, `cli/db-update`, `cli/migration-ref`, `cli/index`, upgrade guide | `migration plan` refuses with `MIGRATION.PLAN_ORIGIN_UNKNOWN`; `db init` / `db update` advance the ref only without `--db`; `NO_TARGET` belongs to `migration new`; the automatic baseline and `--from @empty` |
| B17 | five `orm/middleware/*` | two lifecycles, no `intercept`; rewrite the logger example on `afterQuery`; fix lint keys, budgets latency, cache hooks; drop "permissive mode" on Postgres |
| B18 | `orm/reference/raw-queries`, `advanced-queries` | whole-query raw SQL exists; `db.raw.sql`; drop the "unversioned ids" callout |
| B19 | `relations-and-joins`, `data-modeling/relational-databases` | 1:1 back side, N:M include and nested writes, referential actions, `.variant()` all work; stop sending readers to the SQL builder |
| B20 | `sql-query-builder`, `advanced-queries`, `orm-client` | aggregates return numbers; the `BigInt` / `Decimal` variants; `min` / `max` typing |
| B22 | `editing-a-migration` | add `rawCodecInferer` so the data-transform example typechecks |
| B24 | `writing-data` | upsert needs `conflictOn` |
| B27 | `transactions-and-runtime`, `pipeline-builder` | structured error codes, not plain `Error`; fix the `prepare` then `connect()` sample |
| B31 | `data-modeling/index` | scalar table: `Json` vs `Jsonb`, add `Decimal`, `Bytes` |
| B35 | `using-extensions` | the recipe does not fit Supabase; catalog links lead to `@internal` install commands |

### PR 3: start pages and guides, small facts (about 20 pages)

One-line or one-paragraph facts on the getting-started pages and guides.

| Item | What changes |
|---|---|
| B5 | SQLite ships; `orm/index` and `sql-query-builder` |
| B6 | upgrade guides: version pins, `Database signed` output, the CREATE TABLE symptom that no longer appears |
| B8 | one Node floor, stated once (needs decision 2) |
| B9 | explain `// use prisma-next` where the contract is introduced |
| B28 | `create-prisma` page: `minimal` template, no `.env` for Postgres, `--force`, deploy defaults, Deno flag, script list |
| B29 | MongoDB pages: replica set is not required |
| B30 | Bun guide build and dev scripts; NestJS `@Inject` note; TypeScript authoring paths; Deno page staleness |
| B32 + A4 | guides index and the upgrade guide's sidebar label |
| B33 | `ai/tools/skills` page: one skill, no `--skip-skills`, `orm init` does not install |
| B34 | full-stack tutorial: `TimestamptzString`, no `postinstall` |
| B7 | the agent-files line on four pages (needs decision 1) |
| B25 | streaming claim on `reading-data` (needs decision 3) |

## What this slice does not do

- It does not touch the sixteen Prisma 7 guides under Prisma ORM 8 paths (A7). They are wrong for a Prisma ORM 8 reader, but fixing them means moving or rewriting whole pages, which is the IA discussion. If you want something now, the smallest honest change is a one-line banner at the top of each saying it is written for Prisma ORM 7; say so and I will add it to PR 3.
- It does not add missing content (C). Where a fix would leave a hole (for example B18 removes "raw SQL does not exist" but the page still needs a section on what does), the fix states the fact in one paragraph and stops.
- It does not touch the skill (D14) or the monorepo docs (D17).
- It does not rename "Prisma 8" to "Prisma ORM" (naming.md). That is a site-wide pass and cleaner as its own PR after this slice; mixing it in would bury the corrections in a 700-line diff.

## Decisions before PR 3

Will answered on 2026-09-10: 1 and 4 as proposed; 2 and 3 checked as below.

1. **B7, agent files.** Write the `skills: { agents: [] }` workaround now; replace it when the opt-out brief lands.
2. **B8, Node floor.** Checked by running rc.9 end to end (`contract emit`, `db init`, ORM create and read, `for await`, SQL builder) in a scratch project under Node 22.12.0, 22.18.0, and 22.22.3: all pass. Node release schedule (`nodejs/Release/schedule.json`): 22 "Jod" is Maintenance LTS until 2027-04-30; 23 reached end of life 2025-06-01; 24 "Krypton" is Active LTS, Maintenance from 2026-10-20, end of life 2028-04-30; 26 becomes LTS 2026-10-28. So Node 22 is supported and in LTS for another seven months, and 23 is dead. The scaffold's `engines` range `^22.18.0 || >=24.11.0` is what `create-prisma` enforces; the excluded 24.0 to 24.10 band is odd and worth asking the create-prisma owner about, but the site should not contradict what the scaffold refuses. Site wording: "Node.js 22.18 or newer; Node.js 24 recommended." The monorepo's `Supported Versions.md` says 24 and is wrong about what runs.
3. **B25, streaming.** What the page says: `for await` over `.all()` "streams" rows with a "steady, flat memory footprint" for millions of rows, you "start working on the first record before the last one has arrived", and on early exit "unprocessed records are never buffered". What the implementation does: `postgres()` creates its driver with `cursor: { disabled: true }` (`packages/3-extensions/postgres/src/runtime/postgres.ts:245`), and the driver's own comment calls that "buffered execution": the whole result set is fetched into memory before iteration starts; only decoding through the codecs happens per row as your loop pulls. Cursor batches (`batchSize`, default 100) exist in the driver and are only reachable through the serverless facade's `cursor` option. Measured on a 400,006-row table under Node 22.18: `for await` that breaks after the first row took 186 ms and grew the heap by 64 MB (every row was fetched), versus 824 ms for `await ...all()` (fetch plus decode of every row). So `for await` saves the decode work and the decoded array, not the fetch. The page's three claims about memory and arrival order are false on `postgres()`; the "read once" rule and the per-row hand-off are true. Fix for this slice: rewrite the section to say what actually happens (rows are fetched in full, decoded one at a time as you iterate, use `limit()` or the serverless facade with cursors for genuinely large results). Whether `postgres()` should expose `cursor` is D8 and is out of this slice.
4. **B16, the `--db` quirk.** Document the current behaviour as-is, with `--advance-ref db` shown in every example that passes `--db`.

## How the work runs

- One implementer per PR, working from the audit files and `changes.md`, in this worktree on a branch off `main`. Every changed code sample cites the source line in the commit message. Where a sample can be typechecked against `wip/prisma-src/examples/prisma-8-demo`, it is.
- I review each PR against the source before it goes to you. You do the prose pass.
- No push and no PR until you say so; the branches sit here until then.
