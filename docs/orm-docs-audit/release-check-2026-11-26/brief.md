# Brief: which docs workarounds now have a fix in a published release

## Why

The Prisma ORM 8 docs in prisma/web must not work around a defect in a Prisma tool. When a published release fixes the defect, the docs passage that works around it has to go, or the docs become wrong: they tell readers to do extra steps, expect errors that no longer happen, or avoid things that now work. On 2026-11-22 an audit listed every such passage in `docs/orm-docs-audit/workarounds-inventory.md` (in this worktree, `/Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678`). It judged "still open" from notes and an old checkout, not from the releases. Since then new releases came out. We need to know, entry by entry, whether the released tools still have each defect.

## The published releases to check against

- ORM packages, including `@prisma/orm-toolchain`: `8.0.0-rc.25` (2026-11-23). Source: tag `v8.0.0-rc.25` in `/Users/wmadden/Projects/prisma/orm/.claude/worktrees/actaeon-80-ga-compatibility` (tags fetched; read with `git show v8.0.0-rc.25:<path>`, `git log v8.0.0-rc.24..v8.0.0-rc.25`, `git log --grep`, and `gh pr view -R prisma/orm <n>`).
- `prisma` CLI: `8.0.0-rc.35` (2026-11-23), pins `@prisma/orm-toolchain` 8.0.0-rc.25. Source: tag `v8.0.0-rc.35` in `/Users/wmadden/Projects/prisma/prisma-cli`.
- `create-prisma`: `0.14.10`. Source: tag `v0.14.10` in `/Users/wmadden/Projects/prisma/create-prisma`.

Never check out a branch or edit files in those three repositories. Read tags with `git show` / `git grep <pattern> <tag>`.

## The docs

Current docs are `origin/main` of prisma/web (`6c765c503`), pages under `apps/docs/content/docs/`. Read them with `git -C /Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678 show origin/main:apps/docs/content/docs/<path>`. Line numbers in the inventory are from an older commit and may have moved. Some passages were already removed by later docs pull requests; say so when that is the case.

## What to do for each entry you are given

1. Find the passage on current `origin/main`. If it is gone, report "already removed" and stop.
2. Decide whether the released tool still has the defect. Look for the fixing commit in the tag, then read the code at the tag. Where the code does not settle it and a reproduction is cheap, run the published packages in a scratch project under `/Users/wmadden/Projects/prisma/web/.claude/worktrees/prisma-docs-branch-review-476678/wip/release-check/<your-name>/` (already ignored by git). Use `export npm_config_cache="$PWD/.npm-cache"` so you do not share the npx cache with other sessions. For PostgreSQL use Homebrew PostgreSQL 15: `LANG=C LC_ALL=C /opt/homebrew/opt/postgresql@15/bin/initdb -D pgdata -U postgres -A trust --locale=C -E UTF8`, then `/opt/homebrew/opt/postgresql@15/bin/pg_ctl -D pgdata -o "-p <a port of your own between 54340 and 54360> -c unix_socket_directories=''" -l pg.log start`. Stop it when done. Set `"type": "module"` in a scratch `package.json`. Do not start Docker or OrbStack. Never deploy anything, never run `npm create prisma` without `--no-deploy`, and never run a repository's whole test suite.
3. Watch for a fix that changes the behaviour without making the passage merely redundant: for example a defect that used to be silent now raises an error. Then the passage is wrong, not just unnecessary, and the docs need new text.

## What to report

Write your findings to the file path you are given, one section per entry:

- **Verdict:** one of "fixed in the release", "partly fixed", "still present", "already removed from the docs", "cannot tell".
- **Evidence:** the commit or pull request and the code at the tag, or the reproduction (commands and output, trimmed).
- **Docs change needed:** the page, the lines on current `origin/main`, and what the text should become. Quote the current sentence. Only for "fixed" and "partly fixed".

Put a summary table at the top. Be exact: a wrong "fixed" verdict makes us delete a passage readers still need. When the evidence is thin, say "cannot tell" and why.

Return a short summary in your final message: which entries are fixed, which partly, and anything surprising.
