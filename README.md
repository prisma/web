# Prisma Documentation

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/prisma/docs/blob/main/CONTRIBUTING.md) [![Discord](https://img.shields.io/discord/937751382725886062)](https://discord.com/invite/prisma-937751382725886062?utm_source=twitter&utm_medium=bio&dub_id=0HxLEKaaOg6pL0OL)

This repository is a **pnpm monorepo** containing the Prisma documentation, blog, design system docs, and shared packages.

## Repository structure

| Path | Description |
|------|--------------|
| `apps/docs` | Prisma documentation site (Next.js + Fumadocs) |
| `apps/blog` | Prisma blog |
| `apps/eclipse` | Eclipse design system documentation |
| `packages/eclipse` | Eclipse design system component library (`@prisma-docs/eclipse`) |
| `packages/ui` | Shared UI components and utilities (`@prisma-docs/ui`) |

See each app’s `README.md` for more detail.

## Contributing

New contributors are welcome. Read the [contributing guide](CONTRIBUTING.md) before submitting changes.

## Run locally

From the repository root:

```bash
pnpm install
pnpm dev
```

This starts all apps via Turbo:

- **Docs** — http://localhost:3000  
- **Blog** — http://localhost:3001  
- **Eclipse** — http://localhost:3002  

To run a single app:

```bash
pnpm --filter docs dev      # docs only
pnpm --filter blog dev      # blog only
pnpm --filter eclipse dev   # eclipse design system docs only
```

## Build

```bash
pnpm build
```

To build and serve the docs site:

```bash
pnpm --filter docs build
pnpm --filter docs start
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm lint:links` | Validate internal and external links (docs) |
| `pnpm lint:code` | Lint code blocks in MDX (docs) |
| `pnpm lint:spellcheck` | Spell-check content (docs) |
| `pnpm check` | Run formatting and lint fixes across all workspaces |

## Content

- **Docs** — `apps/docs/content/docs/` (latest), `apps/docs/content/docs.v6/` (versioned). Sidebar structure comes from `meta.json` in each folder. See [Fumadocs collections](https://fumadocs.dev/docs/mdx/collections).
- **Blog** — `apps/blog/content/blog/` (MDX with authors, dates, hero images).
- **Eclipse** — `apps/eclipse/content/design-system/` (component docs).

## Note on formatting

`.md` and `.mdx` files are not formatted by Prettier because they use [MDX 3](https://mdxjs.com/blog/v3/), which Prettier does not support. See [prettier/prettier#12209](https://github.com/prettier/prettier/issues/12209).
