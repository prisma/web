# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **Turborepo** monorepo with pnpm workspaces:

```
├── apps/
│   └── docs/                 # Prisma documentation site (Next.js 16 + Fumadocs)
├── packages/
│   └── ui/                   # Shared UI components (@prisma-docs/ui)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Commands

Run from the root:

```bash
pnpm install           # Install all dependencies
pnpm dev               # Start all apps in dev mode
pnpm build             # Build all packages and apps
pnpm check             # Format (oxfmt) and lint (oxlint) with auto-fix
pnpm types:check       # Type check all packages
pnpm lint:links        # Validate internal links in docs (runs in apps/docs)
```

Pre-commit hook runs `pnpm check` via lefthook.

## Packages

### `@prisma-docs/ui` (packages/ui)

Shared shadcn-style UI components. No build step - exports source files directly.

**Exports:**

- `@prisma-docs/ui/components/*` - React components (button, popover, collapsible, etc.)
- `@prisma-docs/ui/lib/utils` - `cn()` utility function
- `@prisma-docs/ui/postcss.config` - Shared PostCSS config

**Adding new components:**

1. Create `packages/ui/src/components/my-component.tsx`
2. Import utils as `import { cn } from "@prisma-docs/ui/lib/utils"`
3. Use in apps: `import { MyComponent } from "@prisma-docs/ui/components/my-component"`

### `docs` (apps/docs)

Prisma documentation site built with **Fumadocs** on **Next.js 16 App Router**.

**Content Structure:**

- `content/docs/` - v7 documentation (latest), served at `/docs/v7/*`
- `content/docs.v6/` - v6 documentation, served at `/docs/v6/*`
- Each section has a `meta.json` defining page order, icons, and hierarchy
- MDX frontmatter supports `badge: "early-access" | "release-candidate" | "beta" | "deprecated" | "preview"`

**Key Directories:**

```
apps/docs/
├── content/                  # MDX documentation files
├── src/
│   ├── app/
│   │   ├── docs/[version]/[[...slug]]/  # Main docs pages
│   │   ├── api/search/                   # Orama search endpoint
│   │   └── og/docs/                      # OG image generation
│   ├── components/
│   │   └── layout/
│   │       ├── notebook/                 # DocsLayout, DocsPage, DocsBody
│   │       └── sidebar/                  # Sidebar, SidebarPageTree
│   └── lib/
│       ├── source.ts                     # Content loaders
│       └── version.ts                    # Version definitions
├── source.config.ts          # Fumadocs MDX config
└── postcss.config.mjs        # Re-exports from @prisma-docs/ui
```

**MDX Features:**

- Directives: `:::note`, `:::warning`, etc. (via remark-directive)
- Package managers: npm commands auto-convert to pnpm/yarn/bun
- Custom components: `APIPage` (defined in `src/mdx-components.tsx`)

**Version Fallback:**
When a page doesn't exist in v6, it falls back to v7 content with a banner. See `src/app/docs/[version]/[[...slug]]/page.tsx`.

## TypeScript Paths

Apps can use these path aliases:

- `@/*` → `./src/*` (within each app)
- `@prisma-docs/ui/components/*` → UI components
- `@prisma-docs/ui/lib/*` → UI utilities

## Adding a New App

1. Create `apps/my-app/` with `package.json`
2. Add `@prisma-docs/ui: workspace:*` as dependency
3. Import components: `import { Button } from "@prisma-docs/ui/components/button"`
4. Re-export postcss config: `export { default } from "@prisma-docs/ui/postcss.config"`
5. Add Tailwind source in CSS: `@source "../../../../packages/ui/src/**/*.tsx"`
