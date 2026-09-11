# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **Turborepo** monorepo with pnpm workspaces (`apps/*` and `packages/*`):

```
├── apps/
│   ├── site/                 # Prisma marketing site and multi-zone host (port 3000)
│   ├── docs/                 # Prisma documentation site (Next.js 16 + Fumadocs, port 3001)
│   ├── blog/                 # Prisma blog (Next.js + Fumadocs, port 3002)
│   └── eclipse/              # Eclipse design system showcase (Next.js + Fumadocs, port 3003)
├── packages/
│   ├── ui/                   # Shared UI components (@prisma-docs/ui, no build step)
│   └── eclipse/              # Eclipse design system (@prisma/eclipse, published, builds to dist/)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Apps** - each pins its own dev port in its `dev` script, so `pnpm dev` at the root starts all
four side by side.

- **`site`** (apps/site, port 3000) - The prisma.io marketing site and the root zone of the
  multi-zone setup. It has no `basePath`, serves its assets from `/site-static`, and owns the
  `rewrites()` that forward `/docs/*` and `/blog/*` to the docs and blog zones
  (`NEXT_DOCS_ORIGIN` / `NEXT_BLOG_ORIGIN`).
- **`docs`** (apps/docs, port 3001) - The documentation site, served under `basePath: "/docs"`
  with assets at `/docs-static`. See the `docs` section below.
- **`blog`** (apps/blog, port 3002) - Prisma's blog: MDX posts in `content/blog/` plus search
  and `/llms.mdx/*` renditions, served under `basePath: "/blog"` with assets at `/blog-static`.
- **`eclipse`** (apps/eclipse, port 3003) - The showcase and reference docs for the Eclipse
  design system, from MDX in `content/design-system/`. It is a static export
  (`output: "export"`, unoptimized images) and has no `basePath`, so it is not one of the zones
  the site app rewrites into.

**Packages:**

- **`@prisma-docs/ui`** (packages/ui) - Shared shadcn-style components, hooks, footer data, and
  helpers (analytics, newsletter, RSS, UTM, unified search). Private to the workspace; see the
  section below. Site navigation is not here: each app ships its own header and nav.
- **`@prisma/eclipse`** (packages/eclipse) - Prisma's design system: components, styles, tokens,
  and fonts. It is published to npm, and its `build` script runs `tsdown` and then copies the CSS
  and fonts into `dist/`.

**The structural difference to know:** `packages/ui` has no build script and its `exports` point
straight at `src/`, so apps consume it as source. `packages/eclipse` is the opposite - its code,
style, and font exports all resolve into `dist/`, so it must be built before anything that imports
it. (Both packages also export a `./postcss.config` from the package root, which needs no build.)
Turbo's `build` and `dev` tasks both declare `dependsOn: ["^build"]`, which is what makes
`pnpm build` and `pnpm dev` build it first; all four apps also list `@prisma/eclipse` in
`transpilePackages`.

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

- `content/docs/` - all documentation, served under `basePath: "/docs"`
- Versions are content folders, not a route segment: the unversioned tree is the
  latest release (Prisma 8), and older supported versions live beside it in
  `content/docs/orm/v6/`, `content/docs/orm/v7/`, `content/docs/cli/v7/`,
  `content/docs/guides/v7/`, and `content/docs/v7/` (getting started)
- Each section has a `meta.json` defining page order, icons, and hierarchy
- MDX frontmatter supports `badge: "early-access" | "release-candidate" | "beta" | "deprecated" | "preview"`

**Key Directories:**

```
apps/docs/
├── content/                  # MDX documentation files
├── src/
│   ├── app/
│   │   ├── (docs)/(default)/[[...slug]]/ # Main docs pages
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

**Versions:**
There is no content fallback between versions: every versioned page exists as its
own file, and a page missing from `orm/v6` is simply a 404 under `/docs/orm/v6`.
`src/lib/version.ts` maps a pathname to its version and powers the version
switcher; `src/lib/version-metadata.ts` turns that version into the label that
`generateMetadata` folds into the page title and description, so a v6 page and
its v7 twin are distinguishable in search results. Where two versioned URLs are
materially the same document, the older one sets `canonical:` in its frontmatter
(see `src/lib/canonical.ts`).

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
