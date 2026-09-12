# Jobs readers come to the docs to do

Twelve jobs. Each names who does it, what "done" looks like, what the docs must provide for it, and where the site's structure fails it. The jobs are the design input for `ia.md` (which node serves each job) and `changes.md` (which page or ORM change supplies what is missing). Verdicts describe the structure, not the state of any one sentence: **green** a page exists for the job and carries it end to end, **amber** the job can be done but the reader has to assemble it from several places or work around a gap, **red** no page is written for the job.

## J1. Add Prisma ORM to an app I already started, with an empty database

Who: Newcomer, sometimes Upgrader. The most common Discord complaint is this job.

Done: models defined, tables created, one query returns rows, from inside the app they already have, and they can open the database and see those rows.

What the docs must provide: one page that starts from "you have a project directory and no tables", runs `orm init`, edit the contract, `contract emit`, `db init`, one query, and shows `db.ts` and where `DATABASE_URL` comes from (linking J11 for a database on the reader's machine). It ends by showing the rows in the database, with Studio or a Postgres client, because that is how a beginner confirms the page worked.

Where the structure fails: the getting-started subtree is organised by which tool runs (`create-prisma` for new apps, `orm init` for "existing project"). The reader's situation, an app with no database yet, falls between the two: the scaffold page creates a new app, and the existing-project page assumes tables exist and starts with `contract infer`. The three commands that fit exist only as a snippet on the CLI overview.

Verdict: **red**. IA node: "Add to an app you already have" (C2).

## J2. Bring an existing database with data under Prisma ORM, then make the next schema change

Who: Upgrader mostly, some Newcomers with a legacy database.

Done: contract matches the database, database is signed, first query works, and `migration plan` for the next change produces one small migration rather than a full recreate.

What the docs must provide: the adoption sequence end to end, including what to expect from `contract infer` (removed attributes, non-`public` schemas, defaults it cannot express, Temporal-backed timestamp types), what `db sign` checks and what its exit codes mean, and whatever makes the next `migration plan` chain from the signed state.

Where the structure fails: the existing-project page stops at "sign, then query". The step that makes the next migration work (today: a baseline migration and `migration ref set db`) is taught only in the incremental upgrade guide, which this reader never sees. That step exists because `db sign` does not record where migrations start from; the design in `brief-db-ref-on-adoption.md` removes it.

Verdict: **red**. IA node: "Adopt an existing database" (C3); ORM change D1.

## J3. Rewrite Prisma ORM 7 queries in Prisma ORM 8

Who: Upgrader.

Done: for every Prisma ORM 7 call in their code, they know the Prisma ORM 8 call or that it does not exist.

What the docs must provide: one mapping page in four sections (schema and types, CLI commands, client API, not-yet list with a status per item), reachable from every ORM entry point. The not-yet list is the part readers ask for most: `createMany` and `skipDuplicates`, `findUniqueOrThrow`, atomic `increment`/`decrement`, case-insensitive filters, JSON path filters, `$transaction` arrays, the payload types.

Where the structure fails: there is no node. The mapping exists as sixteen inline "For Prisma 7 users" blocks across nine pages, so the reader finds it by luck, and nothing admits what does not exist. The accessor change (`prisma.user` to `db.orm.public.User`) is stated once.

Verdict: **red**. IA node: "Coming from Prisma 7" (C1, placed by A2); the not-yet list depends on D4.

## J4. Decide whether to move to Prisma ORM 8 now

Who: Upgrader, also a Newcomer choosing an ORM.

Done: they know Prisma ORM 8 is a release candidate, when GA is expected, how long 7 is supported, what `npx prisma` now installs, and how to pin 7.

What the docs must provide: one short page with those five facts, linked from the root page and from every "Using Prisma 7?" note.

Where the structure fails: no node. The only signal is a note box saying Prisma 7 remains supported, with links for staying on 7. Nothing says "release candidate", gives a window, or explains that `npm install prisma` now resolves to 8 while `@prisma/client` resolves to 7.

Verdict: **red**. IA node: "Release status" (C4); the npm tag question is D6.

## J5. Migrate a whole Prisma ORM 7 app incrementally

Who: Upgrader with a team and a production database.

Done: both versions run side by side, routes move one at a time, migrations hand over, Prisma ORM 7 is removed.

What the docs must provide: the five-phase guide that exists (`guides/upgrade-prisma-orm/postgresql`), reachable from the ORM entry points and from the mapping page, with a label that says what it is.

Where the structure fails: the page is filed under Guides and nothing under Getting Started or ORM links to it. It is the best page on the site for this reader and the hardest to find.

Verdict: content **green**, discoverability **amber**. IA: link it from "Coming from Prisma 7" and the ORM front door (A2).

## J6. Model my data, especially types Prisma ORM 7 handled with `@db.*`

Who: Newcomer and Upgrader.

Done: they can write `Text`, `VarChar(100)`, `Uuid`, `Decimal`, enums, relations, and know which Prisma ORM 7 attributes are gone.

What the docs must provide: the scalar table, the native types in type position, the `@default` generators, index and check options, and a Prisma ORM 7 attribute map (`@db.Text`, `@db.VarChar(n)`, `@db.Decimal(p,s)` to their type-position forms), plus a money and `Decimal` section.

Where the structure fails: the right nodes exist (Data Modeling, Contract Authoring) but cover a fraction of the authoring surface, and the attribute map has no home.

Verdict: **amber**. Pages: C1 (schema section), C14, C8.

## J7. Set up my editor

Who: Newcomer and Upgrader.

Done: syntax highlighting and formatting work for `contract.prisma`.

What the docs must provide: where the VS Code extension lives (open-vsx, not the Microsoft marketplace), that there is no bundled language server and the locally installed CLI is used, that `// use prisma-next` on line one is what the language server keys on, and `prisma contract format` as the fallback.

Where the structure fails: no node. The facts were given once, in a Discord thread.

Verdict: **red**. IA node: "Editor setup" (C5).

## J8. Use advanced Postgres features

Who: Newcomer and Upgrader on real projects. RLS, policies, expression and functional indexes, extensions such as pg_trgm.

Done: they know whether the contract can express it, and how, or that they must manage it outside Prisma.

What the docs must provide: one page: `@@rls` and the `policy_*` blocks, `@@index(expression:, where:, unique:, type:)`, `@@check` and `@noCheck`, `installExtension` / `createExtension` in migrations, `@@control` for tables Prisma should not manage.

Where the structure fails: no node. All of it ships and none of it is documented; readers' agents invent APIs because there is nothing to read.

Verdict: **red**. Page: C7.

## J9. Name a model or result type for reuse

Who: Newcomer and Upgrader.

Done: `type User = ...` and the type of a query result, without reading `contract.d.ts`.

What the docs must provide: a types page with model, result, where, and input types, each beside its Prisma ORM 7 name. The `Models` namespace and `Shape<>` are in `prisma/orm` `main` and ship with the next tagged release; `ResultType` for SQL builder plans exists today.

Where the structure fails: no node.

Verdict: **red**. Page: C6, on the release that carries the types.

## J10. Stop Prisma from writing agent files into my repo

Who: Newcomer and Upgrader.

Done: one config line, and they know it.

What the docs must provide: the one line (`skills: { agents: [] }` in `prisma.config.ts`) at the point where the scaffold introduces the files, linking to the configuration reference; and, once it exists, the scaffold-time opt-out.

Where the structure fails: the reader meets the files on the scaffold pages and the answer lives on the CLI configuration page, which those pages must link. The tool itself has no prompt or flag, and `skills sync` with an empty list does not remove what it wrote.

Verdict: docs **amber**, tool **red**. Tool change D3.

## J11. Run Prisma ORM against a database on my machine

Who: Newcomer, often a junior or a learner who does not want a hosted database yet. Reported on Discord by a reader who spent several days getting a local setup running and ended up reading example repositories on GitHub instead of the site.

Done: a database runs locally, `DATABASE_URL` points at it, the first migration or `db init` has run, and the reader can see the tables and rows.

What the docs must provide: one page in the ORM subtree that names the three ways to get a local database, in order of effort, and links or shows each: `prisma dev` (a local Prisma Postgres, no install), the Composer local stack (`dev`, which also runs the app), and a PostgreSQL the reader runs themselves, with a Docker Compose file and the matching connection string. It ends with how to look at the data: Studio against the local instance, or any Postgres client such as pgAdmin.

Where the structure fails: the answers exist on the site, under Local development and Composer, but those are top-level platform sections. Nothing in the ORM subtree points at them except the quickstart's "Path A", which a reader who arrived at the ORM section from a search result never sees. A reader who wants Docker Compose finds only the Docker deployment guide, which is about shipping, not developing.

Verdict: **red**. IA node: "A database on your machine".

## J12. Learn from a runnable example

Who: Newcomer. The same Discord reader: "I would recommend tutorials which can be cloned, run locally, and have a lot of comments in the code to understand what files need to be created and coded, which files are generated and why."

Done: the reader has cloned a repository, run it against a local database, and can tell from comments in the code which files they wrote, which files Prisma generated, and what each command in `package.json` does.

What the docs must provide: one small example repository per starting state (new app, app you already have, existing database), each with a README that says which files are yours (`contract.prisma`, `db.ts`, `prisma.config.ts`, your queries), which are generated (`contract.json`, `contract.d.ts`, `migrations/`), and the command that produces each generated file. Every quickstart and starting-state page links the matching repository. The monorepo's `examples/prisma-8-demo` is the seed.

Where the structure fails: no page links a runnable repository. The quickstarts are copy-and-paste sequences with no way to check a broken local setup against a known-good one.

Verdict: **red**. IA node: links from every starting-state page; no new node.

## Summary

| Job | Verdict | What serves it |
| --- | --- | --- |
| J1 existing app, empty DB | red | new node: Add to an app you already have (C2) |
| J2 existing DB, next migration | red | Adopt an existing database (C3) after D1 |
| J3 Prisma ORM 7 query mapping | red | Coming from Prisma 7 (C1, A2); D4 for the not-yet list |
| J4 should I move now | red | Release status (C4); D6 |
| J5 incremental upgrade | green / amber | links from the ORM entry points (A2) |
| J6 data types | amber | C1 schema section, C14, C8 |
| J7 editor | red | Editor setup (C5) |
| J8 advanced Postgres | red | Advanced Postgres (C7) |
| J9 types | red | Types (C6) on the next tagged release |
| J10 agent files | amber / red | the line on scaffold pages; D3 |
| J11 local database | red | A database on your machine (C22) |
| J12 runnable example | red | example repositories linked from every starting state (C23) |
