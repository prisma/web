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

## Related

- **Package**: `packages/eclipse` — the actual `@prisma/eclipse` component library
- **Usage**: `apps/docs` — Prisma docs site that uses Eclipse components
