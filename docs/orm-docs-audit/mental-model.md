# The Prisma ORM 8 mental model, from first principles

This is the source we write docs pages from. It explains why Prisma ORM 8 has the pieces it has, in the order a person meets them. Everything here was checked against the `prisma/orm` glossary, the rc.9 release notes, and the source under `packages/`.

## The one idea

Your application and your database each have an opinion about what the data looks like. In Prisma ORM 7 the schema file was the only written-down version, and the generated client trusted that the database matched it. Prisma ORM 8 makes the agreement explicit and checkable from both sides. Everything else follows from that.

## Two things, not one: the contract and the schema

The **contract** is what you write. It is your description of the models, fields, relations, and how they map to tables. It lives in your repository, in `contract.prisma` or in TypeScript.

The **schema** is what the database actually has right now: the tables, columns, and indexes.

Prisma ORM 7 called your file the schema. Prisma ORM 8 reserves that word for the database side, because the whole point is that the two can disagree. When a command or error says "schema", it means the database.

Every Prisma ORM 8 operation is a relationship between these two: queries are typed against the contract, migrations move the schema toward the contract, and verification checks that the schema still satisfies the contract.

## Emit: the build step that replaces `prisma generate`

Prisma ORM 7 generated a client package from your schema. Prisma ORM 8 emits two plain files from your contract:

- `contract.json`, a canonical description of the models, storage layout, and the database features it needs.
- `contract.d.ts`, the TypeScript types derived from it.

The command is `prisma contract emit`. It is deterministic, so the same source always produces byte-identical output, and you commit both files. Think of the pair as `package.json` and its lockfile: the source is what you asked for, the artifacts are the resolved result.

Why a build step at all: every other tool reads the artifacts, not your source. The query APIs read the types. The migration planner diffs two `contract.json` files. The runtime compares `contract.json` with the database. That is why "emit first" comes before almost every other command, and why forgetting it produces stale types or an empty migration plan.

## The signature: how the database says which contract it satisfies

Because emit is deterministic, hashing `contract.json` gives a short identifier for that exact contract, the way a commit hash identifies an exact state of your code.

The database stores a small marker record, the **signature**, naming the contract hash it currently satisfies. Three commands write it:

- `db init` creates the tables for the contract in an empty database and signs it.
- `db sign` checks that an existing database already matches the emitted contract and, if so, signs it. This is how you adopt a database you did not create with Prisma ORM 8.
- `db migrate` applies a migration and updates the signature to the migration's target hash.

`db verify` reads it and reports **drift**: any disagreement between contract and schema.

Why this exists: a deploy against an unmigrated database, or a migration run against the wrong database, is caught before any query runs, because the runtime and the migration runner both check the signature first. In Prisma ORM 7 the same mistake produced wrong results or a failed query later.

## Queries: every query becomes a plan

All query APIs are typed against `contract.d.ts`. Each query compiles to a **plan**, a plain data object holding the statement, its parameters, and metadata about what it touches. Running the plan is a separate step.

Why: one pipeline. The ORM client, the SQL builder, and raw SQL all reach the database as plans, so middleware, telemetry, budgets, and authorization see every query in the same shape. A plan is data, so it can be inspected before anything touches the database.

The three query surfaces on Postgres, from highest to lowest:

1. The **ORM client**: `db.orm.public.User.where({ ... }).all()`. Model-based, coordinates several statements for `.include()`, hands back one typed result. Start here.
2. The **SQL builder**: `db.sql.public.user.select(...).where(...).build()`. Composable joins, grouping, and projections. One plan is exactly one statement.
3. **Raw SQL**: a whole statement, `db.raw.sql`\`...\`.returnsRow(spec)`, when the builder cannot express it, or a `fns.raw` fragment spliced into a builder query. Whole statements declare their row shape and are decoded; fragments are not.

Why `db.orm.public.User` and not `prisma.user`: Postgres tables live in schemas, and Prisma ORM 8 addresses models through the schema namespace so a contract can span more than one. `public` is the default schema. Aliasing by assignment (`const User = db.orm.public.User`) is fine. On MongoDB the key is the collection's storage name (`db.orm.users`) and there is no SQL builder.

## Migrations: edges between contract hashes

A migration is a step from one contract hash to another. Together they form a graph, not a timestamped list. Every migration records the hash it starts from and the hash it produces.

`migration plan` diffs two contracts and writes a migration package. The target is always your emitted contract. The origin is `--from` if you pass it, otherwise the `db` ref. With neither, the command refuses (`MIGRATION.PLAN_ORIGIN_UNKNOWN`) when migrations already exist on disk, and plans from an empty database only when the migrations directory is empty.

The `db` **ref** is a named pointer to a contract hash, kept in the repo, meaning "the state I consider the database to be at". `db init` and `db update` move it when the connection comes from `prisma.config.ts`; with an explicit `--db` they move it only if `--advance-ref db` is also passed. `db migrate --advance-ref db` moves it. `db sign` does not today; the design in `brief-db-ref-on-adoption.md` makes it do so, so that adopting a database is one step.

Why this matters more than it seems: a project with no `db` ref and no migrations on disk plans its first migration from empty, which proposes recreating every table. This is the trap for anyone who adopts an existing database with `db sign` and then runs `migration plan`. The fix today is a baseline migration plus `migration ref set db <hash>` once, then `--advance-ref db` on each migrate. When the graph is empty and the `db` ref names a stored snapshot, `migration plan` writes the baseline for you.

Why a graph and not a list: two branches can each add a migration, and the graph resolves the merge by hashes instead of by timestamp order. Partial failures are safe to retry because each edge has a verifiable precondition.

`db update` is the development shortcut: diff the contract against the live database and apply the difference directly, no migration package, ref advanced for you. Use it while iterating; use `migration plan` plus `db migrate` when you want the change checked in.

## The command vocabulary in one table

| Command | Reads | Writes | When |
| --- | --- | --- | --- |
| `contract emit` | contract source | `contract.json`, `contract.d.ts` | after every contract change, before anything else |
| `db init` | emitted contract | tables, signature, `db` ref | empty database, first time |
| `db sign` | emitted contract, live schema | signature | adopting a database that already matches |
| `db verify` | emitted contract, live schema | nothing | check for drift |
| `db update` | emitted contract, live schema | schema diff, signature, `db` ref | development iteration |
| `migration plan` | origin contract, emitted contract | a migration package | change you want checked in |
| `db migrate` | migration packages, signature | schema, signature, `db` ref with `--advance-ref` | apply checked-in migrations |
| `migration ref set` | a hash | the ref | after a baseline, or to repoint |
| `contract infer` | live schema | a draft contract source | first contract for an existing database |

## What moved from Prisma ORM 7, and why

| Prisma ORM 7 | Prisma ORM 8 | Why |
| --- | --- | --- |
| `schema.prisma` | `contract.prisma` | the file describes an agreement, not the database |
| `prisma generate` | `prisma contract emit` | data artifacts instead of a generated client |
| `prisma migrate dev` | `db update` (dev) or `migration plan` + `db migrate` | plans are explicit and reviewable |
| `prisma db push` | `db update` | same job, now also signs |
| `prisma db pull` | `contract infer` | produces a contract draft |
| `new PrismaClient()` | `postgres<Contract>({ contractJson, url })` in `db.ts` | the client is built from the contract at runtime |
| `prisma.user.findMany({ where })` | `db.orm.public.User.where(...).all()` | chainable, namespace-qualified |
| `findUnique` / `findFirst` | `.first()` | one terminal for one row |
| `{ data: { ... } }` | the fields directly | no wrapper |
| `take` / `skip` | `.limit()` / `.offset()` | renamed in rc.7 |
| `createMany` | `createAll` (rows back) or `createAndCount` (count back) | the return shape is in the name |
| `$transaction([...])` | `db.transaction(async tx => ...)` | callback form only |
| `@db.Text`, `@db.VarChar(n)` | `Text`, `VarChar(n)` in type position | native types are types, not attributes |
| `Prisma.UserGetPayload<...>` | `Shape<...>`, with the `Models` namespace | in `prisma/orm` `main`; ships with the next tagged release |
| `skipDuplicates`, `increment`, `findUniqueOrThrow`, `mode: "insensitive"`, JSON path filters | no equivalent yet (`.all().firstOrThrow()` covers the throw case) | say so plainly |

## The eight words

**Contract**: what you write. **Schema**: what the database has. **Emit**: build the contract into artifacts. **Hash**: the identifier of one exact contract. **Signature**: the database's record of which hash it satisfies. **Drift**: the two disagree. **Plan**: a compiled query or migration, as data. **Ref**: a named pointer to a hash, used as the migration origin.

## What the model costs, honestly

Two extra concepts before the first query: the emit step and the signature. Prisma ORM 7 had neither. The docs must pay that cost back on the same page by showing what it buys: a deploy that refuses to run against the wrong database, a migration plan you can read before it runs, and a query you can inspect before it executes. If a page introduces the concept without the payoff, cut the concept from that page.
