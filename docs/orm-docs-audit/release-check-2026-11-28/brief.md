# Brief: the docs workarounds and claims nobody has checked against the releases yet

## Why

The Prisma docs in prisma/web must not work around a defect in a Prisma tool. When a published release fixes the defect, the docs passage that works around it has to go, or the docs become wrong: they tell readers to do extra steps, expect errors that no longer happen, or avoid things that now work. The same goes for a sentence that says a feature is missing "yet": once the feature ships, the sentence is false.

On 2026-11-22 an audit listed every such passage in `wip/inventory.md` (in this worktree, `/Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678`). On 2026-11-26 we checked the entries owned by prisma/orm, the `prisma` CLI and create-prisma (O1 to O45, C1 to C14, P1 to P9) against the published releases. Those are done; do not redo them. Everything else in the inventory has not been checked. Readers install the published packages, so a fix merged on `main` but not released does not count.

The most valuable finding is a docs sentence that is now false. A wrong "fixed" verdict is the costliest mistake, because it makes us delete a passage readers still need. When the evidence is thin, say "cannot tell" and why.

## The published releases

- ORM packages (`@prisma/orm-*`, `@prisma/orm-toolchain`): `8.0.0-rc.25`. Source: tag `v8.0.0-rc.25` in `/Users/wmadden/Projects/prisma/orm/.claude/worktrees/actaeon-80-ga-compatibility`.
- `prisma` CLI: `8.0.0-rc.36` (`latest`), pins `@prisma/orm-toolchain` 8.0.0-rc.25. Source: tag `v8.0.0-rc.36` in `/Users/wmadden/Projects/prisma/prisma-cli` (run `git fetch --tags` first if the tag is missing).
- Composer (`@prisma/composer`): `0.40.0`. Source: tag `v0.40.0` in `/Users/wmadden/Projects/prisma/composer`.
- `create-prisma`: `0.14.10`, tag `v0.14.10` in `/Users/wmadden/Projects/prisma/create-prisma`.
- Studio (`@prisma/studio-core`): `0.36.0`, source `/Users/wmadden/Projects/prisma/studio`.
- `@prisma/dev` `0.25.2` and `create-db` `1.4.1` (prisma/create-db): read the published package with `npm pack <name>@<version>` into your scratch folder, or the GitHub source with `gh`.
- Hosted services (Compute, Prisma Cloud, the Console, Prisma Postgres, Accelerate): the backend is in `/Users/wmadden/Projects/prisma/pdp-control-plane`, whose `origin/main` is close to what is deployed. Treat it as evidence of intent, not proof of what production does, and say so.

In the source repositories, never check out a branch or edit files. Read tags with `git show <tag>:<path>`, `git grep <pattern> <tag>`, `git log <tagA>..<tagB>`, and `gh pr view -R <repo> <n>`.

## The docs

Current docs are `origin/main` of prisma/web (`b3525d8b6`), pages under `apps/docs/content/docs/`. Read them with `git -C /Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678 show origin/main:apps/docs/content/docs/<path>`. Line numbers in the inventory are from an older commit and have moved. Some passages were already removed or changed by later docs pull requests (for example `0f0c67f36`, custom domains on any branch); say so.

## What to do for each item you are given

1. Find the passage on current `origin/main`. If it is gone, report "already removed" and stop.
2. Decide whether it is still true of the published release. Read the code at the tag. Where the code does not settle it and a reproduction is cheap and local, run the published packages in a scratch project under `/Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678/wip/release-check-2/<your-name>/` (ignored by git). Use `export npm_config_cache="$PWD/.npm-cache"`. For PostgreSQL use Homebrew PostgreSQL 15: `LANG=C LC_ALL=C /opt/homebrew/opt/postgresql@15/bin/initdb -D pgdata -U postgres -A trust --locale=C -E UTF8`, then `/opt/homebrew/opt/postgresql@15/bin/pg_ctl -D pgdata -o "-p <your port> -c unix_socket_directories=''" -l pg.log start`. Stop it when done. Set `"type": "module"` in a scratch `package.json`.
3. For an item in the "Unsure" section, also say whether it is a workaround for a defect, or a correct description of designed behaviour. Give the evidence (an ADR, a code comment, a test that asserts it, a pull request that chose it).
4. For a "missing yet" sentence, say whether the feature is in the published release.
5. Watch for a fix that changes the behaviour without making the passage merely redundant, for example a silent failure that now raises an error. Then the passage is wrong and needs new text.

## Limits on this machine

Many agent sessions share this machine. Never deploy anything, never sign in to anything, never create cloud resources, and never run `npm create prisma` without `--no-deploy`. Do not start Docker or OrbStack. Never run a repository's test suite, build or type-check over a whole repository. Run every install, build, type-check or test command through the machine's shared lock, so that heavy commands from different sessions do not pile up and crash the machine: `lockf -t 3600 /Users/Shared/claude-shared/heavy-command.lock <command>`. Reading, grepping and git commands need no lock. Do not write files outside your scratch folder and your findings file.

## What to report

Write your findings to the file path you are given, one section per item:

- **Verdict:** one of "fixed in the release", "partly fixed", "still present", "designed, not a workaround", "feature shipped, sentence now false", "still missing", "already removed from the docs", "cannot tell".
- **Evidence:** the commit or pull request and the code at the tag, or the reproduction (commands and output, trimmed).
- **Docs change needed:** the page, the lines on current `origin/main`, the current sentence quoted, and what it should become. Only where the docs are now wrong or a workaround can go.

Put a summary table at the top. Return a short summary in your final message: what is now false in the docs, what was fixed, and anything surprising.
