# apps/handbook

The Builders Handbook. Read `AUTHORING.md` before writing or editing anything under `content/`.

Non-negotiable: **content comes from Shane's notes in `notes/`, never from Claude.** Claude structures, tightens, and applies the component vocabulary. A missing fact becomes `TODO(shane): ...` in the MDX, not a plausible sentence. The banned-phrasing list in `AUTHORING.md` applies to every word on every page, including code comments.

Shell and components live in `src/`; they follow `apps/docs` and `apps/eclipse` patterns (stock Fumadocs `DocsLayout`, Eclipse tokens, `@prisma-docs/ui` helpers). Port 3004, `basePath: "/handbook"`, `assetPrefix: "/handbook-static"`.

Commits in this repo need a type, a scope of `handbook`, and a Linear reference in the body. See the root `CONTRIBUTING.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
