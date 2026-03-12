# Prisma Blog

The **Prisma blog** site. A Next.js app that hosts Prisma’s product updates, announcements, tutorials, and technical posts.

## What it does

- **Blog posts** — MDX articles with authors, dates, hero images, and code examples
- **Search** — Full-text search over blog content
- **LLM endpoints** — Routes for AI/LLM consumption of processed blog text (`/llms.mdx/...`, `/llms-full.txt`)

## Run locally

```bash
pnpm install
pnpm dev
```

Runs on **http://localhost:3001** (docs is 3000, eclipse is 3002).

## Structure

- `content/blog/` — MDX blog posts
- `src/` — App shell, layout, search, and MDX components (TweetEmbed, Youtube, Quote, etc.)
- Uses [Fumadocs](https://fumadocs.dev) for the blog framework
- Uses `@prisma/eclipse` for UI components

## Related

- **Docs**: `apps/docs` — Prisma documentation
- **Design system**: `apps/eclipse` — Eclipse design system docs
