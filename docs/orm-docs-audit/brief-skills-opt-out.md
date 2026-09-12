# Brief: let users opt out of agent skill files at scaffold time

Written 2026-09-10 for an agent with no prior context. Repos: `prisma/create-prisma` (the scaffolder, checked at 0.11.7) and `prisma/prisma-cli` (the unified `prisma` binary, whose `init` and `skills` commands are involved).

## What we want

1. `create-prisma` asks. Add a prompt in the interactive flow, "Install agent skills for coding assistants?" or similar, alongside the existing prompts, defaulting to yes. Add a flag for the non-interactive path, `--skills <list|none>` matching `prisma init --skills`, so `--yes` plus `--skills none` produces a project with no agent files, no `postinstall` hook, and `skills: { agents: [] }` in the config.
2. When the answer is no, the generated project has no `.claude/`, `.cursor/`, `.agents/`, or Devin directories, no `postinstall`, and no `skills:sync` script. `prisma-next.md` is a separate question: decide whether it is an agent file or a human readme and treat it accordingly.
3. `prisma init` on the existing-project path (the command that installs skills; `orm init` stopped touching skills in rc.6) asks the same question when interactive, and honours `--skills`.
4. Removing skills after the fact: `prisma skills sync` with `agents: []` should remove the directories it previously wrote, or there should be a `prisma skills remove`. Decide which; the current behaviour (write nothing, leave the old copies) means the config opt-out looks like it did nothing.

## Acceptance

- `create-prisma my-app --yes --skills none` produces a project with none of the four agent directories, no `postinstall`, and `agents: []` in the config. Test in create-prisma's `tests/`.
- The interactive prompt appears and its answer is reflected the same way.
- `prisma init --skills=none` on an existing project behaves the same and, with an existing config, writes `agents: []` into it rather than leaving it alone.
- `prisma skills sync` after setting `agents: []` removes the previously written directories, or the new remove command does, with a test in prisma-cli.
- The `create-prisma` README and the CLI help text list the new flag.
- Note in the PR the exact user-facing sequence for the docs page, which is written separately: the `create-prisma` reference page, both quickstarts, `cli/init`, `cli/orm-init`, `cli/skills`, and `cli/configuration` on the docs site all need the answer.

## The problem

`npx create-prisma@latest` writes agent skill files for Claude, Cursor, Codex-style `.agents`, and Devin into every new project, adds a `postinstall` hook that re-syncs them on every install, and offers no prompt or flag to decline. One user counted "more than 200 files" and left. Five people raised it in one week. The workaround being passed around in the community (`skills sync --disable`, a `PRISMA_DISABLE_AGENT` env var) is wrong: the first only silences the staleness notice and the second does not exist.

## What exists today

In `create-prisma`:

- `templates/create/_shared/prisma.config.ts.hbs` writes `skills: { agents: ["claude", "cursor", "agents", "devin"] }` for every non-Deno project.
- `src/tasks/install.ts` adds a `skills:sync` package script.
- `src/tasks/prisma-setup/commands.ts` first runs `prisma orm init --yes --target ... --authoring ... --skip-install`, which writes `prisma-next.md` (create-prisma deletes it again only for Deno). Then `initializeAgentSkills` runs `prisma init --yes`. That command adds a `postinstall` of `prisma skills sync || exit 0`, leaves the existing `prisma.config.ts` alone, and runs `skills sync` once.
- The CLI flags are `--template`, `--provider`, `--authoring`, `--package-manager`, `--deploy`/`--no-deploy`, `--workspace`, `--yes`, `--force`, `--verbose`, `--json`. Nothing about skills.

In `prisma-cli`:

- `prisma init --skills=none` writes `skills: { agents: [] }` when no config exists. With an existing config it does nothing to it.
- `prisma orm init` does not install skills (the `--skip-skills` flag was removed in rc.6 along with the install); it only deletes retired skill directories.
- `prisma skills sync` writes the directories listed in `skills.agents`; with `agents: []` it writes nothing, but it does not delete copies already on disk.
- `skills: { check: false }` only silences the out-of-date notice.

So the real opt-out is `skills: { agents: [] }` in `prisma.config.ts`, and nothing on the scaffold path lets the user say that.

## Pointers

- create-prisma: `src/tasks/setup-prisma.ts`, `src/tasks/prisma-setup/commands.ts`, `src/tasks/install.ts`, `templates/create/_shared/prisma.config.ts.hbs`, `src/index.ts` for flags
- prisma-cli: the `init`, `orm init`, and `skills` commands
- Docs pages describing current behaviour, in `prisma/web` under `apps/docs/content/docs/`: `cli/init.mdx`, `cli/orm-init.mdx`, `cli/skills.mdx`, `cli/configuration.mdx`
