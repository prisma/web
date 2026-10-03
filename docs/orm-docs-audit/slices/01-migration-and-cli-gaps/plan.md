# Plan: close the gaps on the migration pages and the CLI reference

Spec: `spec.md` in this directory. Orchestrator: columbo-92. Delivered as prisma/web#8348, branch `claude/orm-migration-cli-gaps-c600ba`. The plan below is the one used during delivery; paths such as `wip/gaps/facts.md` refer to that branch's worktree. The evidence is copied beside this plan: `facts-rc19.md` (every command run on `prisma` 8.0.0-rc.19) and `reviews/` (the two reader rounds, the design review, and the code review).

## Amendments to the spec

Agreed with Will on 2026-09-29.

1. Verify against npm `latest` on 2026-09-29, `prisma@8.0.0-rc.19` and `@prisma/orm-postgres@8.0.0-rc.13`, instead of rc.17 and rc.12.
2. E7: drop the sentence that explains `{bin}`. The literal `{bin}` was a bug in `@prisma/cli-engine`, fixed in 0.6.2, which rc.19 installs. The sample output shows what the CLI prints.

## Notes from grounding

- prisma/orm#30475 is open. Do not list `@contract` or `@db` where the published CLI rejects them.
- E8: `cli/index.mdx` uses the term "contract space" once, in the `migration list` description near the end of the page. (An earlier version of this note said it did not; that was wrong.)
- E9: the GitHub Actions guide names `npx prisma@latest init` in the agent prompt near the top (step 1) as well as in "Prompt your coding agent". Both places say what `init` does.
- E12: `orm/migrations/editing-a-migration.mdx` names two helpers it does not show. `orm/reference/migration-api.mdx` shows both, so the first page links to that section.
- E11: the regenerated page reads prisma/orm `main`, so its diff can include upstream text changes. Report them; do not edit them.
- prisma/web#8342 edits `from-scratch.mdx` and `github-actions.mdx` in other passages. Rebase onto `main` after it merges.
- D17 lines in prisma/orm are out of scope, as the spec says.

## Dispatches

| # | Outcome | Builds on | Hands to |
| --- | --- | --- | --- |
| 1 | Every fact in the spec is run on rc.19 and PostgreSQL 15. `wip/gaps/facts.md` records each command, its output, and whether it matches the spec. | The spec | A facts file that dispatches 2 and 3 quote from, and a list of facts that differ |
| 2 | The ORM pages carry E1, E2, E3, E4, E5, E6, the Drift half of E10, and the E12 removals | 1 | The E3 table with its anchor, which dispatch 3 links to |
| 3 | The CLI pages and guides carry E7, E8, E9, the other half of E10, and the contract reference rows on five CLI pages | 1, and the E3 anchor from 2 | Pages that agree with the E3 table |
| 4 | E11: the script and both workflows name `prisma/orm`, and the error reference page is regenerated | Nothing | The regenerated page |
| 5 | The changed pages pass the three reader-review scripts, two cold reader rounds, a second fact check against `facts.md`, `pnpm lint:links`, and `pnpm lint:versions` | 2, 3, 4 | Pages ready for review |
| 6 | `/drive-code-review` run and its findings fixed; rendered pages checked in the preview; pull request open | 5 | The pull request |

Dispatches 2 and 4 can run in parallel after 1. Dispatch 3 waits for the E3 anchor name from 2.

## Stop condition

A fact that does not hold on rc.19 stops the work on that item. Report it to Will with the command and its output.

## Status, 2026-09-29

- Dispatch 4 (E11) is done, uncommitted. It also changed one comment in `.github/workflows/docs-prose.yml`.
- Dispatch 1 is done. Facts: `wip/gaps/facts.md`. Three cells of the E3 table differ on rc.19 (and on rc.17), reported to Will:
  1. `migration plan --to @empty` is rejected (`MIGRATION.REF_WRONG_GRAMMAR`); only `--from` accepts `@empty`.
  2. `db migrate --to @empty` without `--show` fails (`MIGRATION.RUNNER_FAILED` or `MIGRATION.PATH_UNREACHABLE`); `db migrate --show --to @empty` works.
  3. `migration new --from` accepts a hash prefix shorter than 6 characters.
- Held until Will answers: E3 table, the `--to` and `--from` rows on the five CLI pages.
- Not blocked, dispatched: E1, E2, E4, E5, E6, E8, E9, E10, E12, and the rest of E7.
- Found, not in the spec: `migration status --json` still prints `{bin}`; `cli/init.mdx` does not say `init` adds `prisma` to `devDependencies`; whether `db migrate` refuses a hand-edited `ops.json` was not tested.
- Dispatches 2 and 3 are done for every item except E3 and the contract reference rows, uncommitted. "Lane" is a banned word in `plain-language.md`, so E1 says "column".
- Two facts are being verified before the pages are final: whether `db migrate --to <ref>` refuses a hand-edited migration file (claimed on `the-migration-graph.mdx`), and whether the reader must recreate the `public` schema after dropping both schemas (E4).
- Verified on rc.19: `db migrate`, with or without `--to`, refuses a hand-edited `ops.json` or `migration.json` (`MIGRATION.CONTRACT_SPACE_VIOLATION`, nothing applied), so the claim on `the-migration-graph.mdx` stands. After dropping both schemas, `db migrate` and `db init` create `public` themselves, so the E4 text stands. No page change needed for either.
- Environment: PostgreSQL 15 needed `LC_ALL=en_US.UTF-8` to start on this machine on 2026-09-29.

## Amendment 3, 2026-09-29

The E3 table follows what rc.19 does: `migration plan --to` and `db migrate --to` do not list `@empty`; `db migrate --show --to` lists `@contract` and `@empty`. `migration new --from` keeps the spec's wording. E3 and the contract reference rows are no longer held.
