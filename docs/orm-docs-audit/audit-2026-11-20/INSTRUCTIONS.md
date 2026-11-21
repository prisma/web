# Audit instructions, 2026-11-20 (shared by every area agent)

You are auditing the Prisma ORM 8 pages of the docs site against the released source. The goal is a list of things on the site that are wrong, out of date, or missing, with evidence. This repeats the audit of 2026-09-11 (done against rc.9) against the releases current on 2026-11-20.

## Versions

`prisma` (the CLI) 8.0.0-rc.34, `@prisma/orm-postgres` and `@prisma/orm-mongo` 8.0.0-rc.24, `@prisma/cli-engine` 0.10.0, `create-prisma` 0.14.8.

## Where things are

All four checkouts are read-only for you. The only file you write is your own output file.

- Docs site: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/agitated-lalande-93625d/wip-audit-site/apps/docs/content/docs/`, at `main`. Cite site paths relative to that directory, for example `orm/fundamentals/reading-data.mdx:42`. Prisma ORM 8 pages are the unversioned tree. Paths under `orm/v6`, `orm/v7`, `cli/v7`, `guides/v7` and `(index)/v7` are out of scope.
- The ORM monorepo at tag `v8.0.0-rc.24` (the truth): `/Users/wmadden/Projects/prisma/orm/.claude/worktrees/audit-rc24`. Inside it: `packages/` for source, `packages/9-public/@prisma/*/package.json` for the export paths users import, `docs/releases/` for what changed and when, `docs/glossary.md`, `skills/prisma-8/` for the shipped agent skill, `upgrade-instructions/`, `examples/`. Workspace source uses `@internal/*` package names; users import the published `@prisma/orm-*` names. Do not report that.
- The `prisma` CLI at tag `v8.0.0-rc.34` (the `prisma` binary, `@prisma/cli-engine`, `init`, `dev`, `skills`, global flags, the platform commands): `/Users/wmadden/Projects/prisma/prisma-cli/.claude/worktrees/audit-rc34`.
- create-prisma at `v0.14.8` (what the scaffold generates): `/Users/wmadden/Projects/prisma/create-prisma/.claude/worktrees/audit-0.14.8`.
- The earlier audit and the plan: `/Users/wmadden/Projects/prisma/web/.claude/worktrees/agitated-lalande-93625d/wip-design/docs/orm-docs-audit/` (`changes.md` is the plan, `audit/` holds the September findings).

## How to work

- Read every page in your area in full. Do not skim headings.
- For every API name, method, flag, command, config key, file path, import path, type name, error code, version number and printed output on a page, check it against the source. Check `docs/releases/` for renames.
- For every code sample, ask: would this typecheck and run on the versions above? Point at the source that says yes or no.
- You may run the published CLI to settle a claim that the source leaves unclear. Use a new folder under `/Users/wmadden/Projects/prisma/scratch/audit-<area>/`. Always pass `--no-deploy` to `npm create prisma`. Never deploy anything, never read `~/.config/prisma-compose/deploy.env`, never print a token. Never write to `/tmp`. Never run the monorepo's full test suites (`pnpm test:integration`, `pnpm test:e2e`, `pnpm test:all`).
- Verify before reporting. A finding must cite a source file, a release note, or a command with its output. If you cannot find evidence either way, report it under "Unverified" with what you looked for.
- Look the other way too: what does the source or the skill support in your area that the site never mentions? Report those under "Missing".
- Check consistency across the pages of your area: the same command, flag, file name or version stated two different ways is a finding.
- Check links between pages only where a link's text promises something the target page does not contain. A linter already checks that link targets exist.
- Do not report prose style or tone. Do not report "Prisma 8" versus "Prisma ORM 8" naming.
- Do not report what the plan already lists as open: read "Open in the docs", "Open on the ORM side" and section D of `changes.md` first. If a known open item is worse than the plan says, report the difference.
- Composer pages (`composer/`) are out of scope, as are platform-only pages. If a page in your area turns out not to be about Prisma ORM 8, list it under "Out of scope" in one line and move on. If it documents Prisma ORM 7 or earlier inside the unversioned tree without saying so, that is a finding.

## Output

Write your findings to `/Users/wmadden/Projects/prisma/web/.claude/worktrees/agitated-lalande-93625d/wip-design/docs/orm-docs-audit/audit-2026-11-20/<area>.md`. Use exactly this structure. Markdown, no hard-wrapped lines, plain English, no invented terms.

```
# Audit: <area>

Pages read: <list>

## Breaks copy-paste
Things a user copies that fail: wrong name, removed API, wrong flag, wrong path, wrong import, wrong version.

- `<page path>:<line>` — <what the page says> — <what is true> — evidence: `<source path, release note, or command and output>`

## Misleading
Statements that lead the user wrong: stale defaults, changed behaviour, wrong claims about what is supported, two pages that disagree.

- (same format)

## Missing
Things the source or skill supports in this area that the site never mentions, or that a user in this area would need and cannot find.

- <feature> — evidence it exists: `<path>` — where on the site it belongs

## Unverified
Things that looked wrong but you could not confirm either way.

- `<page path>:<line>` — <suspicion> — <what you checked>

## Out of scope
Pages in your list that are not about Prisma ORM 8, one line each.
```

Keep each bullet to the facts. Line numbers are from the site file. When one defect repeats across many lines, give the count and the first line. Do not pad: an area with few findings is a valid result.

When finished, return a short summary: the number of findings in each section, and the three most serious.
