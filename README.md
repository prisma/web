# Prisma Documentation

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/prisma/docs/blob/main/CONTRIBUTING.md) [![Discord](https://img.shields.io/discord/937751382725886062)](https://discord.com/invite/prisma-937751382725886062?utm_source=twitter&utm_medium=bio&dub_id=0HxLEKaaOg6pL0OL)

This repository is a **pnpm monorepo** containing the Prisma documentation, blog, design system docs, and shared packages.

## Repository structure

| Path | Description |
|------|--------------|
| `apps/site` | Main Prisma website |
| `apps/docs` | Prisma documentation site (Next.js + Fumadocs) |
| `apps/blog` | Prisma blog |
| `apps/handbook` | Builders Handbook (Next.js + Fumadocs), chapters written by Shane, see `apps/handbook/AUTHORING.md` |
| `apps/eclipse` | Eclipse design system documentation |
| `packages/eclipse` | Eclipse design system component library (`@prisma/eclipse`) |
| `packages/ui` | Shared UI components and utilities (`@prisma-docs/ui`) |

See each app’s `README.md` for more detail.
See [ARCHITECTURE.md](ARCHITECTURE.md) for the cross-app multi-zone overview.

## Contributing

New contributors are welcome. Read the [contributing guide](CONTRIBUTING.md) before submitting changes.

## Run locally

From the repository root:

```bash
pnpm install
pnpm dev
```

This builds and runs the combined Composer app locally. Open the **gateway URL**
printed by Composer; it serves the site at `/`, docs at `/docs`, blog at `/blog`,
handbook at `/handbook`, and Eclipse at `/eclipse`. No cloud credentials are needed.
See [COMPOSER.md](COMPOSER.md) for resource budgets, configuration, and the build loop,
and [COMPOSER_FINDINGS.md](COMPOSER_FINDINGS.md) for the findings from this port.

For the original Next.js HMR workflow, run `pnpm dev:turbo`. Its individual app ports
remain 3000 (site), 3001 (docs), 3002 (blog), 3003 (Eclipse), and 3004 (handbook).

To run a single app:

```bash
pnpm --filter docs dev      # docs only
pnpm --filter blog dev      # blog only
pnpm --filter eclipse dev   # eclipse design system docs only
pnpm --filter handbook dev  # builders handbook only
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
