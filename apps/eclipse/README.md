# Eclipse Design System Docs

The **documentation site** for the [Eclipse Design System](https://prisma.io/docs/design-system). This Next.js app showcases and documents all components from the `@prisma/eclipse` package.

## What it does

- **Design system documentation** — Interactive docs for Eclipse atoms (Button, Badge, Input, etc.) and molecules (Card, Tabs, CodeBlock, etc.)
- **Component playground** — Live, editable examples for each component
- **Reference site** — The main docs (`apps/docs`) imports and uses Eclipse components; this app serves as the component library reference

## Run locally

```bash
pnpm install
pnpm dev
```

Runs on **http://localhost:3002** (docs is 3000, blog is 3001).

## Structure

- `content/design-system/` — MDX docs (atoms, molecules, colors)
- `src/` — App shell, search, layout, and MDX components
- Uses [Fumadocs](https://fumadocs.dev) for the doc framework
- Consumes `@prisma/eclipse` from `packages/eclipse` (workspace package)

## Deployment

### Vercel

This app has a `vercel.json` configuration that ensures the `@prisma/eclipse` package is built before the app itself. The build command uses Turborepo's dependency graph:

```bash
turbo run build --filter=eclipse
```

This automatically builds `@prisma/eclipse` and `@prisma-docs/ui` before building the Eclipse docs app, ensuring all built assets (CSS, components) are available.

**Important**: If you see errors about missing files in `@prisma/eclipse/dist/`, it means the package wasn't built before the app. The `vercel.json` in this directory ensures this happens automatically on Vercel.

## Related

- **Package**: `packages/eclipse` — the actual `@prisma/eclipse` component library
- **Usage**: `apps/docs` — Prisma docs site that uses Eclipse components
