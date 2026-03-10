# Prisma Documentation

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/prisma/docs/blob/main/CONTRIBUTING.md) [![Discord](https://img.shields.io/discord/937751382725886062)](https://discord.com/invite/prisma-937751382725886062?utm_source=twitter&utm_medium=bio&dub_id=0HxLEKaaOg6pL0OL)

The docs app is a Next.js site in the monorepo. All commands below assume you’re in the **repository root** unless noted.

---

## Quick start

```bash
# From repo root: install deps for all workspaces
pnpm install

# Run the docs app (and other apps via Turbo)
pnpm dev
```

Open http://localhost:3000 in your browser.

---

## Working from the monorepo root

### Run docs only

```bash
pnpm --filter docs dev
```

### Build docs only

```bash
pnpm --filter docs build
```

The build runs `fetch-openapi` before `next build` to pull the latest Management API spec.

### Run all apps

```bash
pnpm dev
```

Turbo runs `dev` for every app in parallel (docs on 3000, blog on 3001, eclipse on 3002).

---

## Content and structure

| Path | Purpose |
|------|---------|
| `apps/docs/content/docs/` | Latest version docs (MDX) |
| `apps/docs/content/docs.v6/` | V6 versioned docs |
| `apps/docs/source.config.ts` | Fumadocs config (collections, meta, plugins) |
| `apps/docs/cli.json` | CLI reference data |

Sidebar and structure come from `meta.json` in each folder. See [Fumadocs collections](https://fumadocs.dev/docs/mdx/collections) for details.

---

## Scripts

Run these from the repo root with `pnpm --filter docs <script>`:

| Script | Description |
|--------|-------------|
| `lint:links` | Validate internal and external links |
| `lint:code` | Lint code blocks in MDX |
| `lint:spellcheck` | Spell-check content |
| `fetch-openapi` | Fetch Management API OpenAPI spec (runs automatically before build) |

---

## Dependencies

The docs app uses workspace packages:

- `@prisma/eclipse` — design system components
- `@prisma-docs/ui` — shared UI components, utilities, and config

If you change those packages, rebuild or run them in watch mode so docs sees updates.

---

## Contributing

- Use the `(docs)` scope in commit messages when changes are docs-only: `feat(docs): update getting started`
- Run lint/build for affected workspaces before pushing
- See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full workflow and commit rules
