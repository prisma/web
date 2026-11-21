# Restructure of the Prisma ORM entry pages: plan

Design approved by Will on 2026-09-29. The design is `ia.md`, with the sidebar labels below replacing the ones in its first tree. Items A1, A3, A5, A6, A8, C2, and C3 of `changes.md`.

## Sidebar labels (decided)

The Getting Started > Prisma ORM group names each starting point as a statement the reader makes about themselves, under one "Quickstart" group:

```
Prisma ORM
  Introduction to Prisma ORM
  Release status
  Quickstart
    I'm creating a new app
    I have an app, but no database yet
    I have a database already
    I have a Prisma 7 app
  Editor setup
  create-prisma
```

PostgreSQL and MongoDB are a choice at the top of each page, not extra sidebar levels. "I have a Prisma 7 app" opens the upgrade guide, which links Coming from Prisma ORM 7 as the reference for what changed.

## Slices, in order

| Slice | Covers | Spec |
| --- | --- | --- |
| 02 | The Quickstart group, the new no-database pages, the extended existing-database pages, and the four starting points on `/prisma-orm` (A1, C2, C3) | `slices/02-quickstart-by-starting-point/spec.md`; merged as prisma/web#8350 on 2026-09-30 |
| 03 | `/orm` rebuilt; the docs root page gets a row of the four starting points; "What changed for developers" and the blog list leave `/orm` (A1, A5) | `slices/03-orm-page-and-root-row/spec.md`; merged as prisma/web#8351 on 2026-09-30 |
| 04 | "Use with your agent" moves below the human steps on the entry pages and the twelve framework and runtime guides (A3) | `slices/04-agent-prompts-last/spec.md`; merged as prisma/web#8352 on 2026-09-30 |
| 05 | `orm/core-concepts.mdx` rewritten from `mental-model.md` (A6) | `slices/05-core-concepts-from-mental-model/spec.md`; merged as prisma/web#8354 on 2026-09-30 |
| 06 | The two error references name each other and say which codes live where, in the generator (A8) | `slices/06-error-references-link/spec.md`; merged as prisma/web#8353 on 2026-09-30 |

Slice 01 is the migration and CLI gaps, delegated separately.

## Done when

Every slice is merged, each passed the docs reader review (`.claude/skills/docs-reader-review`), and the four starting points are reachable from the docs root page, `/prisma-orm`, and `/orm`.
