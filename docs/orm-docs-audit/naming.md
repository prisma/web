# Naming: the product is "Prisma ORM"

## The rule

"Prisma ORM" names the product. A version number appears only when two versions are being told apart. So:

- "Add Prisma ORM to an existing project", not "Add Prisma 8 to an existing project".
- "Prisma ORM emits the contract", not "Prisma 8 emits the contract".
- "Coming from Prisma ORM 7" and "Migrate from Prisma ORM 7 to 8" keep the numbers, because the contrast is the point.
- The release status page says "Prisma ORM 8 is a release candidate; Prisma ORM 7 is supported until ...".
- The Prisma 7 docs trees (`orm/v7`, `(index)/v7`, `guides/v7`, `cli/v7`) keep their version label in the nav, because that is what they are.

"Prisma 8" as a bare product name reads as a different product from "Prisma ORM", which is the Upgrader's fear stated back to them. It also collides with the platform, where "Prisma" alone means the whole stack.

## How to do it

Not a global replace. Each of the 109 files needs a read, because "Prisma 8" in a contrast sentence becomes "Prisma ORM 8" and elsewhere becomes "Prisma ORM". Do it per page as each page is touched by the restructure and the content fixes, and sweep the remainder at the end. The 96 titles are the visible part and should go first, since they are the sidebar and the browser tab.

## What stays as is

- Identifiers: `prisma-next.md`, `// use prisma-next`, `@prisma/orm-postgres`, `/studio/prisma-next`, package names, error codes. 40 occurrences of `prisma-next` as an identifier; none as prose ("Prisma Next" appears zero times on the site).
- The "Prisma 7" group at the bottom of Getting Started and the v7 doc trees.
- Release notes and changelogs, which name versions by nature.

## Scope on the site today

Outside the v6 and v7 trees:

| Term | Occurrences | Files |
| --- | --- | --- |
| "Prisma 8" | 691 | 109 |
| "Prisma 7" | 198 | 33 |
| "Prisma ORM" | 2816 | 95 |

By area: `orm/` 225, `guides/` 196, `(index)/` 135, `cli/` 81. 96 page titles or meta titles contain "Prisma 8". No sidebar label does; the labels come from titles.

The most common sentence shapes ("Add Prisma 8 to an ...", "Prisma 8 is the ...", "Prisma 8 app with ...", "Prisma 8 skills for ...") all take "Prisma ORM" as a drop-in replacement. The ones that do not are the contrast sentences, which should keep the number and add "ORM".
