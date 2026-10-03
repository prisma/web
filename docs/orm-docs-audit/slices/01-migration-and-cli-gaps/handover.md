# Handover: section E of the Prisma ORM 8 docs audit, and its follow-ups

Written 2026-09-30 by columbo-92 before a rate limit. For an agent starting in a fresh session and a fresh worktree of prisma/web.

## Context

Section E of the Prisma ORM 8 docs audit is twelve small gaps on the migration pages and the CLI reference. The audit's working documents are in `docs/orm-docs-audit/` on branch `docs/orm8-docs-audit-design` (prisma/web#8243). Read `docs/orm-docs-audit/changes.md` there: section E, items E13 to E20, and items D17 and D23 to D29 were written by this session.

The slice's spec, plan, and evidence are in `docs/orm-docs-audit/slices/01-migration-and-cli-gaps/` on that branch:

- `spec.md`: the slice spec. `plan.md`: the plan, with three amendments agreed with Will.
- `facts-rc19.md`: every command the pages name, run on `prisma` 8.0.0-rc.19 against PostgreSQL 15. Section 1 is the matrix of which contract reference forms each command accepts.
- `facts-30475-branch.md`, `matrix-30475.sh`, `lib-30475.sh`: the same matrix run on the unreleased branch of prisma/orm#30475 (commit `20615a96f0`).
- `reviews/`: two cold reader rounds, a system design review, and a code review.

Full transcript of this session: session id `local_075b8826-8782-4df4-afa7-9da2fc37c0d5` (read it with the `ccd_session_mgmt` tools `list_events` or `search_session_transcripts`), app link `claude://claude.ai/epitaxy/local_075b8826-8782-4df4-afa7-9da2fc37c0d5`, and an export at `/Users/wmadden/Downloads/session-export-1790751438144.zip`.

## State of each pull request on 2026-09-30

| Pull request | State | What it needs |
| --- | --- | --- |
| [prisma/web#8348](https://github.com/prisma/web/pull/8348) | Open, approved, all checks pass, no conflicts | Nothing from an agent. Will merges it. If `main` moves and it conflicts, merge `main` in (no rebase, no force push) and push. |
| [prisma/orm#30527](https://github.com/prisma/orm/pull/30527) | Open, all checks pass, waiting for review | Nothing until a reviewer comments. Answer review comments. |
| [prisma/web#8349](https://github.com/prisma/web/pull/8349) | Draft, stacked on #8348's branch, all checks pass | Wait. See below. |

prisma/web#8348 is section E. It also bumps 14 stale version lines to npm `latest` with the same line changes as prisma/web#8342 (another session's pull request), so the two merge in either order.

prisma/orm#30527 corrects command names in prisma/orm's `docs/reference/error-reference.md` (29 entries), which the site's ORM error reference is generated from. After it merges, the daily sync (`.github/workflows/sync-error-reference-docs.yml` in prisma/web) picks it up; nothing else to do.

prisma/web#8349 is the docs change that prisma/orm#30475 needs. It adds `@contract` and `@db` to the contract reference table and to the rows on `cli/migration-status.mdx`, `cli/db-migrate.mdx`, and `cli/db-update.mdx`. Two steps are left:

1. After #8348 merges, change #8349's base to `main` (`gh pr edit 8349 --repo prisma/web --base main`) and merge `main` into its branch if needed.
2. It must not merge until a published `prisma` release contains prisma/orm#30475. Then run the re-check list in its description against that release. If every result matches, mark it ready. If a result differs, change the pages to what the release does.

## First steps for the new session

1. Turn on Auto-fix for #8348, #30527, and #8349 in your session: `mcp__ccd_pr__bind_pr` with each URL, then `mcp__ccd_pr__set_monitor` with `auto_fix: true` and `address_comments: true`. Fix CI failures and review comments yourself; do not hand them to Will. Do not bind prisma/web#8243 or prisma/orm#30475; they belong to other sessions.
2. Branches, all pushed through the bot remote (`git@github-wmadden-electric:...`): `claude/orm-migration-cli-gaps-c600ba` (#8348) and `claude/docs-contract-refs-30475` (#8349) in prisma/web, `docs/error-reference-migration-ref-commands` (#30527) in prisma/orm. Check them out in your own worktree; do not reuse this session's worktree.

## Things to know

- prisma/orm#30475 belongs to another session. This session reported four defects on it: [one comment](https://github.com/prisma/orm/pull/30475#issuecomment-5904954696) and [another](https://github.com/prisma/orm/pull/30475#issuecomment-5905041843). They are D27 and D28 in `changes.md`. Do not push to its branch.
- The published CLI rejects `@empty` for `migration plan --to` and `db migrate --to` (only `db migrate --show --to` accepts it). The original spec said otherwise; the pages follow the CLI. This is amendment 3 in `plan.md`.
- To run CLI commands for verification on this machine: PostgreSQL 15 from Homebrew, no Docker. `LC_ALL=en_US.UTF-8` is needed for `pg_ctl` to start. The recipe is at the top of `facts-rc19.md`.
- The Vercel CLI on this machine has no access to the prisma team, so Vercel build logs cannot be read. A one-off Vercel blog failure on #8349 was cleared by pushing an empty commit.
- Items in `changes.md` that this session recorded but did not fix (E13 to E20, D23 to D29) are for Will to schedule. Do not start them unless Will asks.
