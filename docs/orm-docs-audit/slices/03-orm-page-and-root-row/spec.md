# Slice: the `/orm` page shows the product, and the root page shows the four starting points

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`; plan in `restructure-plan.md`. Items A1 and A5 of `changes.md`. Builds on slice 02, prisma/web#8350, whose pages it links.)_

## At a glance

Today `/orm` argues for the design ("rewrites Prisma ORM in TypeScript", "What changed for developers", a blog list) and the docs root page gives the ORM one line inside the platform hero. After this slice, `/orm` opens with what Prisma ORM is and a contract beside the query it enables and the typed result, then the four starting points, then a one-line map of the ORM sections. The root page gets a row with the four starting points.

## Chosen design

All paths are under `apps/docs/content/docs/`.

### `/orm` (`orm/index.mdx`)

Rewrite the page body in this order. Keep the `url`.

1. **One paragraph saying what Prisma ORM is.** A typed data layer for TypeScript: you describe your data in a contract, and Prisma ORM gives you typed queries and migrations for it. Name the databases with their status from `orm/supported-databases.mdx` (PostgreSQL release candidate, MongoDB early access, SQLite experimental) and link that page.
2. **The product in one screen.** Three short code blocks, in this order, each with a `title`: a contract with one `User` model and one `Post` model related to it (`src/prisma/contract.prisma`), one query that reads users with their posts through `db.orm.public.User` (`index.ts`), and the result that query prints. Take all three from one run of a scratch project on the published packages. Keep each block under 15 lines. One sentence after them says the result is typed from the contract, with no generated client.
3. **Start here.** The four starting points as `<Cards>`, with exactly the sidebar labels and targets from slice 02: "I'm creating a new app" (`/prisma-orm/quickstart/postgresql`), "I have an app, but no database yet" (`/prisma-orm/quickstart/existing-app/postgresql`), "I have a database already" (`/prisma-orm/add-to-existing-project/postgresql`), "I have a Prisma 7 app" (`/guides/upgrade-prisma-orm/postgresql`). One line of description each.
4. **What you can do with it.** A list, one line and one link each: modeling your data (`/orm/data-modeling`), reading and writing data (`/orm/fundamentals/reading-data`), relations (`/orm/fundamentals/relations-and-joins`), transactions (`/orm/fundamentals/transactions`), migrations (`/orm/migrations/how-migrations-work`), middleware (`/orm/middleware/how-middleware-works`), extensions (`/orm/extensions/using-extensions`), and the CLI (`/cli`).
5. **Coming from Prisma ORM 7:** one line linking `/orm/coming-from-prisma-orm-7`.
6. **Release status:** one line linking `/orm/release-status`.

Remove: the "Using Prisma ORM 7?" note (items 5 and 6 replace it on this page), "Your schema becomes a contract" and its three-step workflow, "What changed for developers", "Supported databases", "Get started", "Go deeper", and "Learn more about the design of Prisma ORM". Remove icon imports that no component on the page still uses.

Frontmatter: `description` and `metaDescription` say what Prisma ORM is, not that it is "the next major version". `metaTitle` stays "What is Prisma ORM?".

### Root page (`(index)/index.mdx`)

- Delete the `<span>` with "Here for the ORM?" from the hero.
- Directly after `</WorkflowHero>`, add a `<SectionRow title="Prisma ORM" ...>` whose description says Prisma ORM can be used on its own, with any PostgreSQL or MongoDB database, and whose content is the four starting points with the same labels and targets as on `/orm`. Use a component the root page already renders inside a `SectionRow` (`IconGrid` with `IconLink`, or another the page uses); check the result in the running docs app at desktop width and at 375 pixels.
- Leave the rest of the root page unchanged, including "Other setups" and its agent prompts; slice 04 handles agent prompts.

### Links

Pages that link the removed `/orm` sections by anchor, if any, get links to where the content lives now. `lint:links` must pass.

## Coherence rationale

Both pages are the front door to the same four starting points, and the root page row has nothing to point at without the rebuilt `/orm` page, so they ship together.

## Scope

**In:** `orm/index.mdx`, `(index)/index.mdx`, and link fixes those two changes cause.

**Out:** the sidebar and entry pages (slice 02); agent prompts anywhere (slice 04); `orm/core-concepts.mdx` (slice 05); the "Using Prisma ORM 7?" note on other pages (E21 in `changes.md`).

## Pre-investigated edge cases

| Edge case | Disposition | Notes |
| --- | --- | --- |
| The three-step workflow leaves `/orm` | Acceptable | `orm/core-concepts.mdx` covers the workflow in "How the CLI commands combine"; slice 05 rewrites that page |
| The root page is `full: true` and hides the sidebar | Check the new row renders at full width | The page uses custom components; `Cards` may not match the page's style |
| Scratch projects inside the repository | Give the scratch project its own `package-lock.json` first | Otherwise `orm init` edits the repository's pnpm workspace |

## Slice-specific done conditions

- [ ] The three code blocks on `/orm` come from one run on the published `prisma` and `@prisma/orm-postgres` `latest`.
- [ ] The new root page row and `/orm` render correctly in the running docs app at desktop and 375 pixels, and all four links open the right pages.
- [ ] Both pages pass `.claude/skills/docs-reader-review` with at least two cold reader rounds, and `lint:links`, `lint:versions`, and `test` pass.

## Open questions

None.

## References

- Design: [`../../ia.md`](../../ia.md) § "The ORM root page" and § "Root page"
- Slice 02: [`../02-quickstart-by-starting-point/spec.md`](../02-quickstart-by-starting-point/spec.md)
