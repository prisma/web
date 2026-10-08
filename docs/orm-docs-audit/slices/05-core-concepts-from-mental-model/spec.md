# Slice: core concepts rewritten from the mental model

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`; plan in `restructure-plan.md`. Item A6 of `changes.md`. Builds on slices 02 to 04; the page's agent prompts follow the slice 04 rule.)_

## At a glance

`orm/core-concepts.mdx` is prose today, but it is a glossary in order of vocabulary: contract, emit, hash, plan, the query APIs, the stack, capabilities, codecs, extensions, middleware, migrations, then the CLI workflows. `mental-model.md` explains the same pieces in the order a person meets them and says why each one exists. After this slice the page follows the mental model: one idea, then each piece as the reader runs into it, each with what it buys, and the glossary at the end. The A6 gap list is closed: the Prisma ORM 7 contrasts, why `db.orm.public.User`, the origin rules for `migration plan`, the `db` ref as a concept, adoption with the automatic baseline, `db init` as a signature writer, the adoption order (`db sign` first), the command table, and the closing glossary.

## Chosen design

Path: `apps/docs/content/docs/orm/core-concepts.mdx`. Keep the `url`, `title`, and the frontmatter shape; rewrite `description`, `metaTitle`, and `metaDescription` to match the new page.

### Order of the page

Written from `mental-model.md` (in this folder), section by section, in this order. Each section says what the piece is, what the reader does with it, and what it buys them, in that order. The reader is the Prisma ORM 7 developer of two years from `personas.md`; every section names the Prisma ORM 7 thing it replaces, in one clause, where there is one.

1. **The one idea.** The app and the database each have an opinion about the data; Prisma ORM 8 writes the agreement down and checks it from both sides. Two sentences, then the rest of the page in one line.
2. **The contract and the schema.** Keep the current section's contract example (`// use prisma-8`, `User`, `Post`). Add: Prisma ORM 7 called the file the schema; Prisma ORM 8 reserves "schema" for the database, and when a command or error says "schema" it means the database.
3. **Emit.** `contract emit` replaces `prisma generate`; the two files; commit both; why every other command reads the files and not the source (stale types and an empty plan are the symptoms of forgetting). Keep the `package.json` and lockfile comparison.
4. **The signature.** The hash as the identifier of one exact contract; the marker record in the database; the three commands that write it: `db init` (creates what is missing in an empty database and signs), `db sign` (checks an existing database matches and signs), `db migrate` (applies and re-signs). `db verify` reads it and reports drift. What it buys: a deploy against the wrong or unmigrated database stops before the first query. State the adoption order plainly: on a database you did not create with Prisma ORM 8, run `db sign` before anything else.
5. **Queries.** Every query compiles to a plan; keep the current SQL builder example that shows `.build()` and `query(plan)`. The three surfaces on PostgreSQL in one list (ORM client, SQL builder, raw SQL) and the MongoDB pair (ORM client, pipeline builder, raw commands) in one sentence each, with the current links. Add why `db.orm.public.User` and not `prisma.user`: tables live in PostgreSQL schemas, `public` is the default one, and on MongoDB the key is the collection name (`db.orm.users`). Aliasing by assignment is fine.
6. **Migrations.** A migration is an edge from one contract hash to another; the migrations form a graph, not a list. `migration plan` diffs the origin contract and the emitted contract; the origin is `--from` if passed, else the `db` ref. The `db` ref as a concept: a named pointer kept in the repository meaning "the state I consider my development database to be at", moved by `db init`, `db update`, `db sign`, and `db migrate --advance-ref db` (state the `--db` exception once, from `cli/db-init.mdx`). The origin rules from `cli/migration-plan.mdx`: with no ref and no migrations on disk, plan from empty with a notice; with no ref and migrations on disk, refuse with `MIGRATION.PLAN_ORIGIN_UNKNOWN`. Adoption: `db sign` sets the ref and stores a snapshot, and the first `migration plan` then writes the baseline itself (from `cli/migration-plan.mdx`, "The automatic baseline"). `db update` as the development shortcut. Keep the Git comparison table.
7. **The command vocabulary.** The table from `mental-model.md` ("Reads", "Writes", "When"), checked row by row against the `cli/*.mdx` reference pages. It replaces the current "How the CLI commands combine" prose and its four workflows, except the one rule that opens that section (`db ...` connects to a database, `contract ...` and `migration ...` work on files, `contract infer` reads a database), which stays as the table's lead paragraph.
8. **The pieces underneath.** The current "The stack behind one package", "Capabilities", "Codecs", "Extensions", and "Middleware" sections, shortened to one paragraph each and grouped under one heading, with their links. They are names the reader meets in error messages and extension pages, not concepts the workflow needs, and the page says so in its first sentence.
9. **What moved from Prisma ORM 7.** One sentence linking [Coming from Prisma ORM 7](/orm/coming-from-prisma-orm-7) for the table; do not copy the table.
10. **The eight words.** The closing glossary from `mental-model.md`, one line per word.
11. **Use with your agent.** The current "Prompt your coding agent" content, under the slice 04 heading and position: after the glossary, before Next steps.
12. **Next steps.** Keep.

### Facts to check before writing

`mental-model.md` was checked against rc.9 and the release notes up to rc.10. The page is written against the current `latest` (`prisma` 8.0.0-rc.19, `@prisma/orm-postgres` 8.0.0-rc.13 on 2026-09-30, or newer). Before a claim goes on the page, check it against the `cli/*.mdx` reference page and, where the reference page is silent, a scratch run:

- The `db` ref movement rules and the `--db` exception (`cli/db-init.mdx`, `cli/db-update.mdx`, `cli/db-sign.mdx`, `cli/db-migrate.mdx`).
- The `migration plan` origin rules and the automatic baseline (`cli/migration-plan.mdx`).
- `db init` on a database that already has some of the tables ("additive operations only", `cli/db-init.mdx`).
- "Partial failures are safe to retry": no reference page says this today. Find the source statement in `prisma/orm` (the migration runner's precondition check) or leave the claim out.
- The MongoDB query surfaces and `db.orm.<collection>` (`orm/reference/orm-client.mdx`).

## Coherence rationale

The page is one narrative; reordering half of it and leaving the other half as a glossary would give the reader two pages under one title.

## Scope

**In:** `orm/core-concepts.mdx` and the links on it.

**Out:** `mental-model.md` itself (a source document, updated only where a fact check finds it stale, with the date); the pages the new page links; `orm/index.mdx` (slice 03).

## Pre-investigated edge cases

| Edge case | Disposition | Notes |
| --- | --- | --- |
| Anchors into the page | None exist outside `v6/` and `v7/` (checked 2026-09-30) | Headings may change freely; `lint:links` confirms |
| The page grows | Acceptable | Explanation may add length; repetition may not (`explain-not-state.md`) |
| Stack, capabilities, codecs | Kept, shortened, grouped | Error messages use these names; the reader needs one paragraph each, not a section |

## Slice-specific done conditions

- [ ] Every A6 gap named at the top of this spec is closed, and each command claim on the page matches its `cli/*.mdx` page.
- [ ] The page passes the docs reader review with at least two cold reader rounds using `references/reader-persona.md` verbatim, then a fact re-check of the final text.
- [ ] `lint:links`, `lint:versions`, and `test` pass in `apps/docs`, and the page renders in the running docs app.

## Open questions

None.

## References

- Source: [`../../mental-model.md`](../../mental-model.md)
- `changes.md` A6; `personas.md` for the reader
