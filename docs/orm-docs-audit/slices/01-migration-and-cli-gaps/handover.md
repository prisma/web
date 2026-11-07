# Handover: section E of the Prisma ORM 8 docs audit

Written 2026-10-07 by columbo-92 before a rate limit. Replaces the handover of 2026-09-30. For an agent starting in a fresh session and a fresh worktree of prisma/web.

## Status: complete

Every piece of work from this session is merged. Nothing is waiting.

| Pull request | What it did | State |
| --- | --- | --- |
| [prisma/web#8348](https://github.com/prisma/web/pull/8348) | Section E: twelve gaps on the migration pages and the CLI reference, and one table of the contract references each command accepts | Merged 2026-09-30 |
| [prisma/orm#30527](https://github.com/prisma/orm/pull/30527) | Correct command names in 29 entries of prisma/orm's `docs/reference/error-reference.md`, which the site's ORM error reference is generated from | Merged 2026-09-30 |
| [prisma/web#8349](https://github.com/prisma/web/pull/8349) | The docs change prisma/orm#30475 needed (`@contract`, `@db`, `@empty` on `migration status` and `db migrate`) | Merged 2026-10-07, finished by another session (wukong-58) and verified against `prisma` 8.0.0-rc.21 |

The four defects this session reported on prisma/orm#30475 were fixed before it merged on 2026-10-06.

## Where the records are

All on branch `docs/orm8-docs-audit-design` (prisma/web#8243), under `docs/orm-docs-audit/`:

- `changes.md`: the audit's working list. This session recorded E13 to E20 (docs follow-ups) and D23 to D29 (CLI defects). Other sessions have since added up to E25 and D31 and merged the restructure. Some of D23 to D29 may be fixed by later releases; check against npm `latest` before working on one.
- `slices/01-migration-and-cli-gaps/`: the spec, the plan with three amendments, `facts-rc19.md` (every command run on `prisma` 8.0.0-rc.19), `facts-30475-branch.md` with its scripts, and `reviews/`.

## Transcript

- Session id `local_075b8826-8782-4df4-afa7-9da2fc37c0d5`: read it with the `ccd_session_mgmt` tools `list_events` or `search_session_transcripts`.
- App link: `claude://claude.ai/epitaxy/local_075b8826-8782-4df4-afa7-9da2fc37c0d5`
- Export: `/Users/wmadden/Downloads/session-export-1791389136586.zip`

## Next work

None is assigned. Ask Will what to pick up. Do not start items in `changes.md` unless he asks.

## Things to know

- Verifying CLI facts on this machine: PostgreSQL 15 from Homebrew, no Docker, and `LC_ALL=en_US.UTF-8` for `pg_ctl` to start. The recipe is at the top of `facts-rc19.md`.
- Docs slices in prisma/web are validated with `.claude/skills/docs-reader-review` (its scripts and cold reader rounds), not `/drive-code-review`.
- Turn on Auto-fix (`mcp__ccd_pr__set_monitor`) right after opening any pull request, and fix its CI and review comments yourself.
- Use Opus for every subagent.
