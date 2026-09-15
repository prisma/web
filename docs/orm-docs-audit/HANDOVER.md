# Handover: Prisma ORM 8 docs audit and plain-language pass

Written 2026-09-12, updated 2026-09-15, by the previous agent for the next one. Read this first, then `changes.md` in this directory.

## Transcript of the previous session

The most recent session (2026-09-14 to 2026-09-15, the data-modeling pass, the Supported databases consolidation, and the migrations pass) is `/Users/will/.claude/projects/-Users-will-Projects-prisma-web--claude-worktrees-pr-conflicts-review-fb93f7/ce65cd59-a425-4754-9e75-9f9f740b388b.jsonl` (about 6 MB). Its worktree is `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7`, which holds `wip/c21/dm/` and `wip/c21/mig/` (the data-modeling and migrations briefs, shared answers, page copies per round, and reports; `extract.py` is in `wip/c21/`), `wip/prisma-src-rc11/` (a plain export of prisma/orm at rc.11, `ff47560c9f`), `wip/prisma-src/` (a plain `git archive` export of rc.10, not a worktree, because that session only had read access to `/Users/wmadden/Projects/prisma/prisma`), `wip/orm/` (a shallow clone of prisma/orm through the bot remote), and `wip/migrations-before-queries.md` (a brief for the ORM team, see below). Note that the two transcripts belong to two macOS users, `will` and `wmadden`, who are both Will; if a path is unreadable, tell Will and he grants access with an ACL.

The session before that is `/Users/wmadden/.claude/projects/-Users-wmadden-Projects-prisma-web--claude-worktrees-error-reference-follow-ups-81a8e7/29b9a58b-bb9f-48f4-8639-597b84cf76f8.jsonl` (about 15 MB; 2026-09-13 to 2026-09-14, the orm/reference and contract-authoring passes). If your sandbox cannot read it, tell Will straight away and wait: he will copy it into your worktree. Do not continue without it. The session before that one is at `/Users/will/.claude/projects/-Users-will-Projects-prisma-web--claude-worktrees-prisma-orm-8-docs-audit-5bdfd9/7636eb55-44f8-408f-b81e-481bd0140ea6.jsonl` (the audit and the fundamentals pass).

Search the transcript for `C21`, `reader review`, `fact re-check`, `factcheck2`, `conventions.md`, or a page name. It was compacted once; the first user message after compaction carries a summary of everything before it.

## Absolute paths

The previous agent's worktree is `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7`. It still exists and holds everything below that is not in git:

- This file: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/design/docs/orm-docs-audit/HANDOVER.md` (the design branch checked out at `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/design/`).
- The rc.10 source checkout: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/prisma-src/` (a worktree of `/Users/wmadden/Projects/prisma/prisma` at `cfccb09be2`).
- The contract-authoring briefs: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/ca/factcheck-brief.md`, `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/ca/factcheck2-brief.md`, `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/ca/fixer-brief.md`, and the PR body `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/ca/pr-body.md`. The reference-section briefs are beside them in `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/`.
- The report extractor: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/extract.py`.
- The reports of every round, as files: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/ca/r1/` to `r4/` and `fc2/` hold the page copies; the reader and checker reports are in git at commit 40c5394e3 of `docs/orm8-plain-language-contract-authoring` under `docs/orm-docs-audit/c21-contract-authoring/`, and at 13f900ad2 of `docs/orm8-plain-language-orm-reference` under `docs/orm-docs-audit/c21-orm-reference/`. Read them with `git show <commit>:<path>` from any worktree of prisma/web.
- The docs-reader-review skill: `.claude/skills/docs-reader-review/` at the root of any prisma/web checkout, on `main`.

## Where things are

- `prisma/web` on `main` has, merged this week: the three correction PRs (#8236, #8237, #8238), the naming pass (#8246), Release status and Coming from Prisma ORM 7 (#8245), the `docs-reader-review` skill (#8247), and the plain-language rewrite of the five `orm/fundamentals` pages (#8251).
- Draft PR #8243 (branch `docs/orm8-docs-audit-design`) holds the design docs in `docs/orm-docs-audit/`: `personas.md`, `journeys.md`, `mental-model.md`, `ia.md`, `naming.md`, `changes.md`, `plain-language.md`, the briefs, and this file. It is not meant to merge; it is the shared copy Will links people to. Other people edit this branch: always `git fetch bot` and start from the branch head, and merge your additions rather than copying files over.
- PR #8260 (branch `docs/orm8-plain-language-orm-client`) is C21 on `apps/docs/content/docs/orm/reference/orm-client.mdx`, merged 2026-09-12: two fact re-checks and four reader rounds. The reader and checker reports for that page are in the branch history at d104536a5 under `docs/orm-docs-audit/c21-orm-client/`.
- PR #8271 (branch `docs/orm8-plain-language-contract-authoring`) is C21 on `orm/contract-authoring/` (the data contract, PSL, TypeScript builder, the two emitted files, and the page now titled Supported database features), plus three things Will asked for while it ran: the Supported databases page at `/prisma-orm/supported-databases` (PostgreSQL release candidate, MongoDB early access, everything else coming soon; it replaces the database section of prisma/orm#25843), the upgrade guides linked from the ORM section's Introduction and the v7 guides nav, and a sidebar fix (folders in the version-filtered Guides tree never opened for their own page; they now match by id). It is approved on GitHub and green; the agent could not merge it because the tool refused a merge, so Will merges it. The reports are in the branch history at 40c5394e3. The plain-language checker (`check-plain.sh`) now skips link targets, pinned anchors, `href` attributes, and the front-matter `url` line.
- PR #8267 (branch `docs/orm8-plain-language-orm-reference`) is C21 on the rest of `orm/reference/` (`sql-query-builder`, `raw-queries`, `pipeline-builder`, `transactions-and-runtime`, `index`), merged 2026-09-13: a fact check against rc.10, four reader rounds, a final fact re-check, and CodeRabbit's six comments. The reports are in the branch history at 13f900ad2. The error reference page is generated from prisma/orm and out of scope.
- PR #8279 (branch `docs/orm8-plain-language-data-modeling`) is C21 on `orm/data-modeling/` (`index`, `relational-databases`, `mongodb`), merged 2026-09-15: a fact check against rc.10, four reader rounds, a final fact re-check (five drifts), seven CodeRabbit threads. The reports, `conventions.md`, and `page-conventions.md` are in the branch history at 19138ba09. The same PR moved Release status and Supported databases from the Getting Started tree into the ORM section (`/orm/release-status`, `/orm/supported-databases`, old URLs redirect, Getting Started keeps link entries), and merged the older `orm/reference/supported-databases` page into `/orm/supported-databases` (Ankur's feature table, hosted-provider table, and community-package note kept; SQLite is Experimental with `@prisma/orm-sqlite`, MySQL is coming soon and planned next, MongoDB is early access; Will decided all three).
- Two things learned on the data-modeling pages: on MongoDB, `@map` renames the field in TypeScript as well as in the database, so the primary key is always `_id` in code. That is filed as a bug, TML-3247 on the Terminal team in Linear, related to TML-2961. And the `prisma-8` skill's `contract.md` says the default referential action is `Restrict`; the code writes no clause at all. Add that to D14.
- prisma/orm#30296 (branch `docs/readme-v7-support-window`) fixes the README, CONTRIBUTING, and SECURITY to say Prisma 7 gets bug fixes and security updates for eighteen months after `8.0.0` final, matching the Release status page. Approved, auto-merge armed behind the merge queue as of 2026-09-15.
- prisma/orm#30287 (open) makes `schema.prisma` a Prisma ORM 8 contract source (`prisma7Schema('prisma/schema.prisma')` in `prisma.config.ts`), so a Prisma 7 app runs `contract emit`, `db sign`, and `db verify` on the file it already has, with zero findings. When it ships (rc.12), the upgrade guide and Coming from Prisma ORM 7 are wrong where they describe `contract infer` plus hand edits, and the migrations section pass should know it is coming. `wip/migrations-before-queries.md` in the worktree above is the brief Will shared with the team on the route it enables (hand migrations to Prisma ORM 8 first, keep Prisma 7 queries); it lists what is still missing, including a `migrations: false` option for the Prisma 7 config.
- The Prisma ORM 8 source for the migrations pass was `prisma/orm` at `8.0.0-rc.11` (`ff47560c9f`), exported at `wip/prisma-src-rc11/` in the worktree above; use rc.11 for the next section unless Will says otherwise. Earlier sections used `8.0.0-rc.10` (`cfccb09be2`). In a fresh worktree: `git -C /Users/wmadden/Projects/prisma/prisma worktree add <path> cfccb09be2`. Tag `v8.0.0-rc.11` exists upstream as of 2026-09-14 (`git -C /Users/wmadden/Projects/prisma/prisma fetch origin --tags`; tags are `v8.0.0-rc.N`), and npm `latest` for the three ORM packages is rc.11; the docs still say rc.10. Ask Will whether to move the source to rc.11 before the next section.
- The published `prisma` package (8.0.0-rc.15 on 2026-09-14) exports `./config`, so the docs import `definePrismaConfig` from `prisma/config`. The rc.10 source tree only has `@prisma/cli-engine` and every fact checker "corrects" it; revert them. Check with `npm view prisma@latest exports`.
- pnpm on Will's machine (user `will`) could not switch to the pinned 12.3.4 because its managed install under `~/Library/pnpm/.tools/pnpm/12.3.4` was a placeholder; running that package's `install.js` fixed it. If `pnpm` prints `ENOEXEC`, that is the cause.
- The design branch is checked out in the previous worktree at `wip/design/` (a git worktree under the gitignored `wip/`). In a fresh worktree, `git worktree add wip/design docs/orm8-docs-audit-design` after `git fetch bot` and `git branch -f docs/orm8-docs-audit-design bot/docs/orm8-docs-audit-design`.

## How to work (rules Will has given, in his words where possible)

- Act as the `wmadden-electric` bot: commit with `git commit -s --trailer "Signed-off-by: Will Madden <madden@prisma.io>"`, end the message with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`, push only through the `bot` remote.
- "NOT EVERY FUCKING CHANGE NEEDS A SEPARATE PR": follow-ups go on the open PR.
- Address every review comment and every CI failure without being asked. Resolve CodeRabbit threads via GraphQL `resolveReviewThread` after replying. CodeRabbit's "changes requested" verdict blocks the merge even when all threads are resolved; dismissing it is blocked for the agent, so Will dismisses it or merges with `--admin`.
- PR descriptions: a grounding before/after example first, then the decision, then how it was checked, then what a reviewer should know, alternatives considered last.
- Plain English, no invented jargon, short sentences. Never use the question UI.
- The design docs carry no status ("they are not a fucking to do list"). Progress lives in PRs.
- The product is "Prisma ORM"; a version number only when contrasting ("Prisma ORM 7 to 8"). The reason is separating the Prisma brand from the ORM.
- Use Opus for implementer and reviewer subagents.
- Never fix one sentence Will points at in isolation. Reread the whole page and check the claims around it; a bad sentence has always meant more was wrong nearby ("NEVER REWRITE SENTENCES IN ISOLATION. REREAD THE WHOLE DOCUMENT").
- No commentary about the docs inside the docs: no "this page documents", no "each method has a Remarks list", no "examples carry over between pages". Write the reference itself.
- Never interleave PostgreSQL and MongoDB sentence by sentence. Give each database its own example and its own paragraph.
- Merging: when Will says "approved" in chat, squash-merge with `gh pr merge N --squash --delete-branch`. Auto-merge is off for the repo. On 2026-09-14 the tool refused a merge on a GitHub approval alone; ask Will.
- The dev server in a worktree needs `pnpm turbo run build --filter=@prisma/eclipse` first and `rm -rf apps/docs/.next`; the launch config is `docs` on port 3105. Verify nav changes by reading the sidebar without clicking anything open, and check the live site with the folder collapsed as a reader sees it. Do not report "it is in the nav" from the presence of text in the HTML.
- Resolving CodeRabbit threads: zsh does not word-split `$ids`, so loop with `while read -r id`, and keep the GraphQL query in a file under `wip/` and pass it with `-f query="$(cat file)"`.
- Do not paste the readers' reports into pages; extract each agent's final message from its task output with `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/extract.py` (usage: `python3 extract.py <task .output file> <report.md>`; it prints the last assistant text block of a task JSONL).

## The C21 method (what worked on the fundamentals pages)

The skill is `.claude/skills/docs-reader-review/` on `main`. Per page:

1. Run `scripts/check-plain.sh` and fix hits.
2. Dispatch a fresh Opus reader with `references/reader-persona.md` verbatim and only the page (a long page in slices by `##` heading, 400 to 700 lines each). Save its report with the extract script.
3. Dispatch an Opus fixer per page or slice with: the skill's step 3 rules, `conventions.md` (shared verified facts and wording; the latest is `docs/orm-docs-audit/c21-contract-authoring/conventions.md` at commit 40c5394e3), the page's own conventions file if any, the report, and the source paths. Tell it which facts to look up before writing, a line budget, and to put `Q` markers in its report, not the page.
4. Repeat. Four rounds was the point of diminishing returns on the fundamentals pages; from round three on, give the fixer a word budget counted with `wc -w` (not lines: on the migrations pages fixers met line budgets by writing longer lines), because pages grow and readers then trip on the additions.
5. Fact re-check by a separate Opus agent against the source, claim by claim, before the PR. On the fundamentals pages this caught seven real errors that the wording rounds had introduced or left standing. Do not skip it.
6. Commit each round. Link check: `cd apps/docs && node_modules/.bin/fumadocs-mdx && node_modules/.bin/tsx ./scripts/lint-links.ts`. Spelling: `node_modules/.bin/cspell "content/docs/orm/**/*.mdx"` (random sample ids fail it; use `cuid2000...` style). Revert any `meta.json` the formatter touches.

Readers keep asking for MongoDB depth on every page (fewer examples, no `.aggregate`, no cursor). That is a content gap, not wording; it is logged as C24 in `changes.md` and is out of scope for C21.

## Done: `orm/migrations/` (PR #8281)

PR #8281 (branch `docs/orm8-plain-language-migrations`) is C21 on the six `orm/migrations/` pages, plus C25, a new section in Editing a migration: "When a backfill reads a column the migration removes". Open as of 2026-09-15.

The pass ran these steps:
1. A banned-term pass and a fact check against rc.11.
2. A real run of the pages' commands with `prisma` 8.0.0-rc.15 and a local PostgreSQL.
3. Four reader rounds.
4. A final fact re-check, which made 28 corrections.

The briefs, shared answers, page copies per round, and every report are in `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/mig/`. None is in the PR, because Will said not to add dispatches to PRs. The most useful files there:
- `round2-notes.md`, which holds every final-check item and its resolution.
- `round1-shared-answers.md` to `round4-shared-answers.md`, which are sourced facts about migrations.
- `real-run-transcript.md`.
- `notes-for-handover.md`, which lists the product bugs.
- `fc2-drifts.md`, what the final check corrected.

Things learned on this pass:
- **Budget in words, not lines.** Round three's fixers met line budgets by writing longer lines, and four pages grew by up to 13%.
- **Run the commands.** The real run caught several things that reading the source did not:
  - a wrong rollback end state;
  - an `updatedAt` column makes a backfill impossible to apply;
  - the unfilled-placeholder failure was blamed on the wrong cause;
  - the literal `{bin}` in CLI hints;
  - `node migration.ts` works only from the project root.

  Do the same for any section whose pages show commands.
- **Shared answers every round.** Readers on all six pages asked the same questions. One shared-answers file per round kept the pages consistent. When a fact turns up while fixers run, send it to the affected fixer.
- **Cross-check one checker's finding on the other pages.** The How migrations work checker found that a MongoDB re-run stops at a collection the failed run created. Three other pages said the opposite, and their checkers had confirmed it.
- **Length.** The section went from 9997 words on `main` to 13749. Most of the growth answers questions readers asked every round, and C25 adds about 60 lines. Will has not said whether he wants a cutting round.

## After that, in order

1. Handle review on #8281 (the migrations section), then `orm/middleware/`, `orm/extensions/`, one PR per section.
2. File the product bugs from the migrations pass, listed in `wip/c21/mig/notes-for-handover.md`, wherever Will decides. The list:
   - `{bin}` is never replaced.
   - Planner-written migrations don't type-check.
   - An `updatedAt` backfill can never be applied.
   - `migration new --from` writes a no-op migration that breaks planning.
   - `node migration.ts` works only from the project root.
   - `contract emit --config` misreports its output file names.
   - The `db migrate` summary count is off.
   - `npx prisma dev` needs an entry argument.
   - `migration log` sorts rows applied in the same second by name.
   - A MongoDB re-run after a partial failure stops at a collection the failed run created.

   Outside the section: `studio/prisma-next.mdx` line 112 describes `migration plan` with no `db` ref wrongly. Also add to D14: the `prisma-8` skill says an un-recompiled `migration.ts` edit causes a hash mismatch, and it does not.
3. C2, "Add Prisma ORM to an app you already started": scaffold a Prisma 7 app with an older `npm create prisma`, add ORM 8, write the page from what happens.
4. C22 (a database on your machine: `prisma dev` first, Composer, Docker Compose) and C23 (runnable example repositories), both from a Discord user's feedback; see `journeys.md` J11 and J12.
5. Briefs waiting for an ORM-side owner: `brief-skill-staleness.md` (D14), D17 in `changes.md`. Add to D14: the scorecard marks `contains`/`startsWith`/`endsWith` as reachable when they are not, and the skill still says N:M includes fail when they work.

## Open questions from the last session, for Will

- **SQLite** is decided: Experimental, with `@prisma/orm-sqlite`, on the Supported databases page. The Release status page still does not name the SQLite library; make them agree when that page is next touched.
- **Default referential action.** When `onDelete` and `onUpdate` are both omitted, Prisma ORM writes no clause. The relational data-modeling page says "the database decides" and does not name PostgreSQL's `NO ACTION`. Will has not said whether to name it.
- **MongoDB before the first write.** The skill says `db migrate` writes a marker document in `_prisma_migrations`, but no marker check was found in the MongoDB runtime, so no page says whether an unmigrated database rejects a write.
- **`namespace` blocks** exist in the PSL interpreter (`interpreter.ts:197-231`) and no page documents them; the relational page mentions them in one clause without a link.
- **Node.js floor for `Temporal`.** The source and the raw-queries page say 26.8.2; `coming-from-prisma-orm-7.mdx` line 65 says "26 and later". Fix the latter when that page is next touched.
- **A JavaScript `Date` codec.** Will and Serhii are discussing one beside the Temporal codecs. There is no real-user evidence logged anywhere in this project; the evidence is D10 in `changes.md` (inferred contracts throw at read time without a global `Temporal`, which Node.js 22 and 24 lack), the raw-queries readers stumbling on `Temporal.Instant` in four rounds, raw SQL rejecting a `Date` outright, MongoDB returning a `Date` while PostgreSQL returns Temporal, and the `DateString` family being the only escape hatch. Discord and GitHub issues were not searched.
- **Implicit many-to-many** is not supported at rc.10 or rc.11: two bare list fields raise `PSL_ORPHANED_BACKRELATION` and the message says to write a join model. The docs say so correctly. Serhii read the upgrade guide as saying many-to-many is unsupported; only the implicit form is.
- **Operating contexts.** The Supported databases page covers only the database section of prisma/orm#25843. Runtimes, frameworks, deployment platforms, and languages have no Prisma ORM 8 page.
- A team-facing summary of the whole project is published at https://claude.ai/code/artifact/3516e640-e939-4c4a-9db6-ff858027cf93 (Will's private artifact).
- **Migrations pass: committing refs.** Should `migrations/app/refs/db.json` be committed? The same question applies to a `prod` ref. The source is silent, and no migrations page says.
- **Migrations pass: `--advance-ref db`.** Why is it not the default in development? The source gives no reason.
- **Migrations pass: the `prod` ref.** Does it mean what is deployed or what should be deployed, and should deploys move it?
- **Migrations pass: merge workflow.** The graph page shows the diamond from the e2e test, with two merge migrations after both branches merge. `skills/prisma-8/references/migration-review.md` 116-130 recommends rebasing and replanning instead.
- **Migrations pass: adoption order.** Generating a migration says sign, then plan, then migrate. The PostgreSQL upgrade guide says plan a baseline, sign, then set the `db` ref. Both work.
- **Migrations pass: `db sign` failing on production.** Its error suggests running `db update` and then signing again. The pages do not recommend that on production.
- **Migrations pass: Discord.** Should the pages name the `#prisma-next` channel? They now say only "ask on Discord".
- **Migrations pass: Node.js version.** The published `prisma` 8.0.0-rc.15 declares `node >=22.18.0`, but the rc.11 monorepo declares `>=24`. The pages say 22.18.
- **Migrations pass: concurrent PostgreSQL runs.** After waiting for the lock, the second run fails with a marker mismatch. The page says only that one waits for the other.
