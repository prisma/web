# Audit instructions (shared by every area agent)

You are auditing the Prisma ORM docs site against the Prisma 8 monorepo at rc.9. The goal is a list of things on the site that are wrong, out of date, or missing, with evidence.

## Where things are

Work only inside the docs worktree. Do not edit any file except your own output file. Put scratch files in `wip/docs-audit/audit/scratch-<area>/`.

- Docs site source: `apps/docs/content/docs/` (this worktree is the `prisma/web` repo). Cite site paths relative to that directory, for example `orm/fundamentals/reading-data.mdx:42`. Prisma ORM 8 pages are under `orm/` (not `orm/v6`, `orm/v7`), `(index)/prisma-orm/`, `(index)/getting-started.mdx`, `cli/` (not `cli/v7`), and the ORM parts of `guides/`.
- The monorepo (the truth) is checked out at rc.9 under `wip/prisma-src/`. Inside it: `packages/` for source, `docs/releases/v8.0.0-rc.*.md` and `docs/releases/v0.1[5-7].0.md` for what changed and when, `docs/glossary.md` for terms, `skills/prisma-8/` for the shipped agent skill (`SKILL.md` plus `references/*.md`). The skill is well maintained and a good second source, but it uses `@internal/*` import paths that users must read as `@prisma/orm-postgres/*`; do not report that, it is known.
- The public package: `packages/9-public/@prisma/orm-postgres/package.json` lists the real export paths users import.
- create-prisma source (what the scaffold generates): `wip/create-prisma-src/`.
- Worked examples that compile against rc.9: `wip/prisma-src/examples/`.

## How to work

- Read every page in your area in full. Do not skim headings.
- For every API name, method, flag, command, config key, file path, import path, type name, and error code on a page, check it exists in the source with that name and shape. Grep `packages/` and `skills/prisma-8/references/`. Check `docs/releases/` for renames.
- For every code sample, ask: would this typecheck and run on rc.9? You do not need to run it, but you must be able to point at the source that says yes or no.
- Verify before reporting. A finding must cite a file in the monorepo or a release note. If you cannot find evidence either way, report it under "Unverified" with what you looked for.
- Also look the other way: what does the source or skill support in your area that the site never mentions? Report those under "Missing".
- The product is called "Prisma ORM"; do not report pages that say "Prisma 8", that is a known site-wide naming issue.
- Do not report the items already known (list below). Do not report prose style, tone, or the "written for AI" complaint. Do not report `@internal/*` in the skill.

## Already known, do not re-report

- `.take()`/`.skip()` should be `.limit()`/`.offset()` (renamed rc.7).
- `createCount`/`updateCount`/`deleteCount` should be `createAndCount` etc. (renamed 0.17).
- The existing-project PostgreSQL page uses `db.orm.User` and `db.sql.user` instead of `db.orm.public.User` / `db.sql.public.user`.
- `@db.*` attributes were removed in 0.17; `psl-syntax.mdx` still shows `String @db.Uuid`.
- `orm/index.mdx` says SQLite is planned; it ships as `@prisma/orm-sqlite`.
- The upgrade guide is pinned to rc.6 / rc.4.
- `db sign` does not set the `db` ref, so `migration plan` after adoption plans from empty.
- No page covers: a Prisma 7 to 8 API mapping, model/result types (`Models`, `Shape<>`, in open PRs), `createMany`/`skipDuplicates`, `firstOrThrow`, atomic increment, case-insensitive filters, editor setup, RLS outside Supabase, functional indexes, pg_trgm, money/Decimal, the skills opt-out on getting-started pages, the npm `latest` tag / release status.
- `DATABASE_URL` from `.env` vs the environment is inconsistent across getting-started pages; `db.connect()` vs `db.runtime()` is used interchangeably; `db.ts` is imported but never shown on getting-started pages; Node version claims differ.

## Output

Write your findings to `wip/docs-audit/audit/<area>.md` (the area name is given in your prompt). Use exactly this structure. Markdown, no hard-wrapped lines, plain English, no invented jargon.

```
# Audit: <area>

Pages read: <list>

## Breaks copy-paste
Things a user copies that fail: wrong name, removed API, wrong flag, wrong path, wrong import.

- `<page path>:<line>` — <what the page says> — <what is true> — evidence: `<monorepo path or release note>`

## Misleading
True-ish statements that lead the user wrong: stale defaults, changed behaviour, wrong claims about what is supported.

- (same format)

## Missing
Things the source or skill supports in this area that the site never mentions, or that a user in this area would need and cannot find.

- <feature> — evidence it exists: `<path>` — where on the site it belongs

## Unverified
Things that looked wrong but you could not confirm either way.

- `<page path>:<line>` — <suspicion> — <what you checked>

## Skill vs site
Places where the shipped skill (`skills/prisma-8/references/`) and the site disagree, beyond the items above. Say which one matches the source.

- (same format)
```

Keep each bullet to the facts. Line numbers are from the site file. When one defect repeats across many lines, give the count and the first line, not every line.

When finished, return a two-paragraph summary: how many findings in each section, and the three most serious.
