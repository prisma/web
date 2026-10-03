# Slice: the Quickstart group, by the reader's starting point

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`; plan in `restructure-plan.md`. Items A1, C2, and C3 of `changes.md`.)_

## At a glance

The Getting Started > Prisma ORM sidebar in prisma/web is grouped by the tool that runs (`create-prisma`, `orm init`). After this slice it is grouped by where the reader starts, in the reader's own words:

```
Quickstart
  I'm creating a new app
  I have an app, but no database yet
  I have a database already
  I have a Prisma 7 app
```

One page pair is new (an app with no database yet), one is extended (a database that already has tables), and no existing URL changes.

## Chosen design

All paths are under `apps/docs/content/docs/`. Do not touch `v6/` or `v7/` folders.

### Sidebar

`(index)/prisma-orm/meta.json` `pages` becomes, in order: `index`, the Release status link, the Supported databases link, `quickstart`, `[Editor setup](/orm/contract-authoring/editor-support)`, `create-prisma`.

`(index)/prisma-orm/quickstart/meta.json` keeps the title "Quickstart" and lists four link entries, so the PostgreSQL and MongoDB pages do not appear as sidebar levels:

| Label | Opens |
| --- | --- |
| I'm creating a new app | `/prisma-orm/quickstart/postgresql` |
| I have an app, but no database yet | `/prisma-orm/quickstart/existing-app/postgresql` |
| I have a database already | `/prisma-orm/add-to-existing-project/postgresql` |
| I have a Prisma 7 app | `/guides/upgrade-prisma-orm/postgresql` |

`from-scratch` and `add-to-existing-project` leave the `prisma-orm` sidebar list; their pages and URLs stay. Confirm in the running docs app that unlisted pages still render at their URLs, that the four entries show in this order, and that the entry for the current page is highlighted on the PostgreSQL page of each pair. If fumadocs cannot express this with link entries, stop and report what it can express.

### Database choice at the top of each page

Each page in a pair starts, directly under the frontmatter, with one line that names the database it covers and links its twin, for example "This page uses PostgreSQL. [Use MongoDB instead](/prisma-orm/quickstart/mongodb)." The Prisma 7 upgrade guide gets no such line: Prisma ORM 7 did not support MongoDB.

### I'm creating a new app

Pages: `(index)/prisma-orm/quickstart/postgresql.mdx` and `mongodb.mdx`, unchanged in content except the database line, a frontmatter `title` that says what the page does ("Create a new app with PostgreSQL", "Create a new app with MongoDB"), and one sentence linking `/prisma-orm/from-scratch` for readers who want no scaffold. `from-scratch.mdx` links back.

### I have an app, but no database yet (new)

New pages `(index)/prisma-orm/quickstart/existing-app/postgresql.mdx` and `mongodb.mdx`. The reader has a project directory with a `package.json` and an empty database, or a connection string for one. Steps, each with the command and the output you capture yourself:

1. `npx prisma@latest orm init --yes --target <target> --authoring psl --write-env` (without `--yes` it still prompts), and what it writes, including `src/prisma/db.ts`, shown in full.
2. Set the connection string. Link `npx create-db@latest` for a reader with no database at all.
3. Edit the starter contract: one model.
4. `npx prisma contract emit`.
5. `npx prisma db init`, and what the marker and the `db` ref in its output are, each in one sentence.
6. One write and one read through `db.orm`, in a script that ends with `await db.close()`.
7. Change the contract and apply it: `contract emit`, `migration plan --name <name>`, `db migrate --advance-ref db`.
8. Next steps.

Commands are for Node.js with npm. The pages say nothing about Bun: installing with Bun fails on the current release (D21 in `changes.md`). The first time a command prints the "Prisma agent skills are out of date" notice, one sentence says what it is and that `npx prisma@latest init` installs the skills; output blocks leave the notice out. The MongoDB page follows the same steps with the MongoDB commands and leaves out anything PostgreSQL-only.

### I have a database already (extended)

Pages: `(index)/prisma-orm/add-to-existing-project/postgresql.mdx` and `mongodb.mdx`. Titles become "Add Prisma ORM to an existing PostgreSQL database" and the MongoDB equivalent. The PostgreSQL page gains:

- What `contract infer` reads from the database and what it does not: check what it captures (indexes, checks, row-level security, relations, defaults) by running it against a database that has each, and state that it reads only the `public` schema.
- What `db sign` checks before it writes the marker, and that exit code 4 means the tables do not match the contract.
- The second migration: after `migration plan`, apply with `npx prisma db migrate --advance-ref db`, with output.
- A link to the no-database page for a reader whose database is empty.

The MongoDB page gains the link only. Adopting an existing MongoDB collection cannot reach a signed database on the current release (D20 in `changes.md`), so the page shows no signing and no second migration.

The PostgreSQL page also says that `contract emit` on an inferred contract prints `PN_EXACT_NAME_BODY_COMPARISON` warnings for policies, checks, and indexes with SQL bodies, and that they are expected.

### The four starting points on `/prisma-orm`

`(index)/prisma-orm/index.mdx`: directly after the opening paragraph, add the four starting points as cards with the sidebar labels and the same targets, replacing the two links to create-prisma and from-scratch. Leave "Use with your agent" where it is; slice 04 moves it.

### Links

Every page that links `/prisma-orm/from-scratch`, `/prisma-orm/quickstart/*`, or `/prisma-orm/add-to-existing-project/*` with link text naming the old sidebar labels ("Quickstart", "Add to Existing Project") gets link text that matches the new titles.

## Coherence rationale

The sidebar change, the page it needs that does not exist, and the page it renames are one reviewable unit: merging the sidebar without the no-database page would leave an entry with nothing behind it.

## Scope

**In:** the two `meta.json` files, the six entry pages, the two new pages, `/prisma-orm`, and link text elsewhere.

**Out:** `/orm` and the docs root page (slice 03); moving agent prompts (slice 04); core concepts (slice 05); any URL change or redirect; the Prisma 7 upgrade guide's content; links to `examples/` in prisma/orm, which docs never use; the gaps in `slices/01-migration-and-cli-gaps/spec.md`, which another agent is changing on some of the same pages, so rebase before opening the pull request.

## Pre-investigated edge cases

| Edge case | Disposition | Notes |
| --- | --- | --- |
| No Docker on the operator's machine | Use the Homebrew PostgreSQL 15 at `/opt/homebrew/opt/postgresql@15/bin` | `LANG=C LC_ALL=C initdb --locale=C -E UTF8`, start with `-c unix_socket_directories=''` on a spare port |
| MongoDB for verification | Use `mongodb-memory-server` or a local `mongod` if installed; if neither can run, stop and report | Do not publish MongoDB output you did not capture |
| `orm init` in a CommonJS project | Link `cli/orm-init.mdx#in-a-commonjs-project`; do not restate it | #8329 |
| CLI prints JSON when not on a terminal | Pass `--format human` when capturing output | The published pages show human output |

## Slice-specific done conditions

- [ ] Every command on the new and extended pages was run by the implementer on the published `prisma` and `@prisma/orm-*` `latest`, and the output on the page is the captured output.
- [ ] The sidebar shows the four entries in order in the running docs app, checked at desktop and mobile widths.
- [ ] The changed pages pass `.claude/skills/docs-reader-review` with at least two cold reader rounds, `lint:links`, and `lint:versions`.

## Open questions

None.

## References

- Design: [`../../ia.md`](../../ia.md), labels in [`../../restructure-plan.md`](../../restructure-plan.md)
- Reader jobs J1 and J2: [`../../journeys.md`](../../journeys.md)
- Mental model: [`../../mental-model.md`](../../mental-model.md)
