# Builders Handbook

A handbook for people who build software with AI, technical or not. Published by Prisma. Next.js + Fumadocs, one chapter per MDX file, served under `basePath: "/handbook"` as a multi-zone app alongside docs and blog.

**Content is written by Shane, structured with AI assistance.** Read `AUTHORING.md` before touching anything under `content/`.

## Run locally

```bash
pnpm install
pnpm --filter handbook dev
```

Runs on **http://localhost:3004/handbook** (site is 3000, docs 3001, blog 3002, eclipse 3003). `@prisma/eclipse` must be built first; `pnpm dev` at the root does that via Turbo, or run `pnpm --filter @prisma/eclipse build` once.

## Structure

- `content/handbook/` — published chapters. Parts are folders, each with a `meta.json`.
- `notes/` — Shane's raw dictation per chapter. Never published.
- `AUTHORING.md` — voice, banned phrasing, chapter anatomy, component vocabulary, dictation workflow.
- `src/components/handbook/` — `Callout`, `Aside`, `Playbook`/`Step`, `Checklist`/`Check`, `ChapterMeta`.
- `src/app/(handbook)/` — Fumadocs `DocsLayout` (sidebar + TOC) and the `[[...slug]]` page renderer.
- `source.config.ts` — MDX pipeline: directive callouts, Shiki via `@prisma-docs/ui`, frontmatter schema (`status`, `readingTime`).

## Wiring into prisma.io/handbook (not done yet)

When this goes public, `apps/site/next.config.mjs` needs the same treatment docs and blog get:

```js
const HANDBOOK_ORIGIN = process.env.NEXT_HANDBOOK_ORIGIN || "https://handbook.prisma.io";
// ...in rewrites().beforeFiles:
{ source: "/handbook", destination: `${HANDBOOK_ORIGIN}/handbook`, missing: [{ type: "host", value: HANDBOOK_ORIGIN_HOST }] },
{ source: "/handbook/:any*", destination: `${HANDBOOK_ORIGIN}/handbook/:any*`, missing: [...] },
{ source: "/handbook-static/:path*", destination: `${HANDBOOK_ORIGIN}/handbook-static/:path*`, missing: [...] },
```

plus a Vercel project for this app, `NEXT_HANDBOOK_ORIGIN` on the site project, and a CSP/security-headers block copied from `apps/blog/next.config.mjs`. Search, OG images, `llms.txt`, and sitemap are also deferred until there are real chapters.

## Related

- `ARCHITECTURE.md` at the repo root explains the multi-zone setup.
- `apps/docs` and `apps/blog` are the sibling zones this app copies its patterns from.
