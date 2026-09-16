# Naming: the product is "Prisma ORM"

## The rule

"Prisma ORM" names the product. A version number appears only when two versions are being told apart. So:

- "Add Prisma ORM to an existing project", not "Add Prisma 8 to an existing project".
- "Prisma ORM emits the contract", not "Prisma 8 emits the contract".
- "Coming from Prisma ORM 7" and "Migrate from Prisma ORM 7 to 8" keep the numbers, because the contrast is the point.
- The release status page says "Prisma ORM 8 is a release candidate; Prisma ORM 7 is supported until ...".
- The Prisma 7 docs trees (`orm/v7`, `(index)/v7`, `guides/v7`, `cli/v7`) keep their version label in the nav, because that is what they are.

Why: the Prisma brand identity is being separated from the ORM. Prisma is the company and the platform; the ORM is one product on it. Calling the ORM "Prisma 8" ties the whole brand to one product's release cycle, and it leaves no name for the platform, where "Prisma" alone already means the stack. So the ORM is never "Prisma" plus a version; it is "Prisma ORM", and that name is what gets a version number.

## How to do it

One pass over the whole site, as its own PR. Not a global replace: each of the 109 files needs a read, because "Prisma 8" in a contrast sentence becomes "Prisma ORM 8" and elsewhere becomes "Prisma ORM". The 96 titles are the visible part and go first; they are the sidebar and the browser tab.

## What stays as is

- Identifiers: `prisma-next.md`, `// use prisma-next`, `@prisma/orm-postgres`, `/studio/prisma-next`, package names, error codes. 39 occurrences of `prisma-next` as an identifier; none as prose.
- The "Prisma 7" group at the bottom of Getting Started and the v7 doc trees.
- Release notes and changelogs, which name versions by nature.

## Scope on the site (2026-09-10, outside the v6 and v7 trees)

Counted with `git grep -o` over the `.mdx` and `meta.json` files under `apps/docs/content/docs/`, excluding every `v6/` and `v7/` directory, on `main` as of 2026-09-10 (`684dcbf6`).

| Term | Occurrences | Files |
| --- | --- | --- |
| "Prisma 8" | 679 | 109 |
| "Prisma 7" | 135 | 33 |
| "Prisma ORM" | 487 | 95 |

By area: `orm/` 221, `guides/` 196, `(index)/` 131, `cli/` 77. 96 frontmatter titles contain "Prisma 8": 7 `title:` values, which are also the sidebar labels of those pages, and 89 `metaTitle:` values. No `meta.json` group title does.

The common sentence shapes ("Add Prisma 8 to an ...", "Prisma 8 is the ...", "Prisma 8 app with ...", "Prisma 8 skills for ...") all take "Prisma ORM" as a drop-in replacement. The contrast sentences keep the number and add "ORM".
