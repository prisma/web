# Contributing

## Workflow

1. Create a branch from the default branch.
2. Make focused changes (prefer smaller PRs).
3. Ensure lint/build pass for impacted workspaces.
4. Commit using the required commit format (below).
5. Open a PR with a clear description and validation notes.

---

## Hard Requirements

### 1) Commit messages MUST include a type

Every commit **must** start with a valid change type:

- `feat` — new functionality
- `fix` — bug fix
- `docs` — documentation only
- `chore` — maintenance, tooling, housekeeping
- `refactor` — code change that neither fixes a bug nor adds a feature
- `perf` — performance improvement
- `build` — build system / dependencies
- `ci` — CI configuration/scripts
- `revert` — revert a prior commit

### 2) Commit scope MUST be the app being worked on (or empty if crossing boundaries)

We use Conventional-Commit-inspired scopes to clarify *where* changes land.

- If your change is scoped to **one app**, the scope **must** be that app/workspace.
  - Example: `feat(docs): update page layout`
- If your change intentionally spans **multiple apps/packages**, you **must** use an **empty scope** (no parentheses).
  - Example: `chore: align eslint rules across apps`

---

## Commit Message Format

### Required shape

```
<type>(<scope>): <subject>
```

- **`type`**: required (see list above)
- **`scope`**: required for single-app changes; **must be empty** for cross-boundary changes
- **`subject`**: short, imperative, no trailing period
- **`body`**: optional; explain why the change is needed

### Examples

Single app change (scoped):
```
feat(docs): update getting started
```

Single app bug fix (scoped):
```
fix(docs): ensure UTMs are persisted
```

Cross-boundary change (empty scope):
```
chore: update shared lint rules and apply fixes
```

---

## Dependencies

Use the **same version** for a given dependency across all apps and packages (e.g. the same `react`, `typescript`, or `next` range everywhere). When adding or upgrading a dependency used in multiple workspaces, update every `package.json` that lists it so versions stay aligned.

---

## Keep changes workspace-focused
- Prefer changes that only touch the necessary app/package.
- If you need shared updates, ensure they’re intentional and explained in the PR.

### Validate before pushing
Run checks for affected workspaces where possible:

- `pnpm run lint`
- `pnpm run build`

---

## Pull Requests

### PR title
PR titles should follow the same convention as commits:
- `feat(app): …`
- `fix(app): …`
- `chore: …` (for cross-boundary)

### PR description should include
- What changed and why
- How it was tested (commands + notes)
- Screenshots for UI changes (when applicable)
- Follow-ups / known limitations

---

## Code Style & Quality
- Prefer clarity over cleverness.
- Avoid drive-by refactors inside feature/bugfix PRs.
- Follow existing patterns within each app.

---

## Writing documentation

Writing or editing a page in `apps/docs` or `apps/blog`? Start with the [`docs-writer` guide](.claude/skills/docs-writer/README.md). The "Writing style in one minute" section at the top is all you need to make a solid first contribution; the rest is there when you want it.

It covers how we write docs for Prisma Postgres, Prisma Compute, and Prisma 8: page shape, how to write a step, what to cut, and a final-pass checklist, with a worked example for each kind of page.

- **Using Claude Code?** The guide loads as a skill automatically. Ask it to write or improve a page.
- **Not using Claude Code?** Read [`SKILL.md`](.claude/skills/docs-writer/SKILL.md) as a checklist and [`how-to-use.md`](.claude/skills/docs-writer/references/how-to-use.md) for examples.
