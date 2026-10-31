# Slice: A database on your machine

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C22 of `changes.md`, job J11 of `ia.md`, decided by Will on 2026-09-28. Written 2026-10-22 by `seacole-52`.)_

## At a glance

Every Prisma ORM 8 quickstart needs a connection string in `DATABASE_URL`, and a reader with no database gets one sentence about `npx create-db@latest` or nothing. The answers for a database on the reader's own machine exist under Local development (Prisma ORM 7 only) and Composer, and nothing in the ORM subtree points at them. After this slice one page, `/prisma-orm/local-database`, gives a reader with no database three ways to get one, a MongoDB section, and a way to look at the rows, and every entry page links it where `DATABASE_URL` first appears.

## The facts, each checked on 2026-10-22

| What | Fact | Where it is declared |
| --- | --- | --- |
| `npx create-db@latest` | Creates a hosted Prisma Postgres database with no sign-up; 24 hours by default, `--ttl` from 30m to 24h; prints a connection string and a claim URL | `postgres/npx-create-db.mdx` |
| PostgreSQL floor | 15 | `prismaNext.minServerVersion`; `orm/supported-versions.mdx` (prisma/web#8572) |
| Docker Compose shape | `postgres:17`, user `postgres`, password `prisma`, database `postgres`, port 5432, `pg_isready` health check, named volume; `DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres"` | `guides/deployment/docker.mdx` lines 205 to 255 |
| Composer local database | `prisma dev <entry>` runs a Composer app on local emulators; the create-prisma scaffold's `dev:composer` script is `npm run build && prisma dev module.ts`; the scaffold's module provisions one database node with id `database` | `prisma dev --help` on `prisma@8.0.0-rc.25`; `create-prisma@0.14.3` `templates/create/_shared/module.ts.hbs` line 15 and `minimal/package.json.hbs` line 19 |
| `prisma dev url <address>` | Prints a database node's connection string with the local credentials; needs `prisma dev` running in the same directory; in `prisma` since `8.0.0-rc.24` | `prisma dev url --help`; `composer/local-development.mdx`; `cli/dev.mdx` line 31 |
| Scaffold versions | `create-prisma@0.14.3` pins `prisma` 8.0.0-rc.21 and `@prisma/composer` 0.28.0, which have no `dev url`; upgrading those packages by hand in the scaffold fails on a dependency version clash (`effect`, `alchemy`), reproduced in `wip/slice-09/demo` | `wip/slice-09/demo/package.json` before the edits; the `DEPS.EXECUTOR_UNLOADABLE` and "Unable to get redacted value" failures |
| Prisma Studio | Ships with the Prisma ORM 7 CLI (`npx prisma@prev studio`, `prev` is 7.10.1); takes `--url`; must run from a directory outside a Prisma ORM 8 project because the 7 CLI fails on `prisma.config.ts`; PostgreSQL, MySQL and SQLite only, no MongoDB | `studio/prisma-next.mdx`, `guides/postgres/viewing-data.mdx`, `studio/index.mdx`; `npm view prisma dist-tags`; the Prisma ORM 8 CLI's `--help` lists no `studio` command |
| MongoDB floor | 8.0 | `orm/supported-versions.mdx` |
| MongoDB local URL | A standalone `mongod` is enough except for transactions and change streams; the scaffold writes `mongodb://localhost:27017/mydb?replicaSet=rs0&directConnection=true`; drop `replicaSet=rs0` for a standalone server | `(index)/prisma-orm/quickstart/mongodb.mdx` lines 33 to 40 |

## Chosen design

All paths are under `apps/docs/content/docs/`. Do not touch `v6/` or `v7/` folders.

- New page `(index)/prisma-orm/local-database.mdx` at `/prisma-orm/local-database`, title "A database on your machine". Sections, in order of effort: a temporary hosted database with `create-db` (no install, not on the machine, but zero setup); PostgreSQL in Docker with the Compose file from the Docker guide and the connection string for it, plus stop, start and wipe commands; the Composer local database for an app made by `npm create prisma` (`npm run dev:composer`, `npx prisma dev url database` for the connection string, with the `8.0.0-rc.24` requirement and `npx prisma --version`); a MongoDB section with a `mongo:8` Compose file and the standalone connection string; "Look at your rows" with `psql`, Prisma Studio from outside the project, a link to the database editors guide, and `mongosh` or MongoDB Compass for MongoDB.
- `(index)/prisma-orm/meta.json` lists the page after the Quickstart group and before Editor setup.
- The eight entry pages link the page once, at the sentence where `DATABASE_URL` is first set: `quickstart/postgresql` (Path B step 1), `quickstart/mongodb` (step 1), `quickstart/existing-app/postgresql` (step 2), `quickstart/existing-app/mongodb` (step 2), `add-to-existing-project/postgresql` (step 3), `add-to-existing-project/mongodb` (step 3), `from-scratch` (step 2), `create-prisma` (Start the app).

Wording rules: the C21 conventions. No commentary about the docs. PostgreSQL and MongoDB in separate sections, never interleaved. No command the page's author could not run; the Composer section states the version requirement instead of telling readers to upgrade the scaffold.

## Checks before the PR

`check-plain.sh`, `check-ai-signs.sh`, `check-staccato.py`, `cspell`, `lint:links`, `lint:versions`; two cold reader rounds with `references/reader-persona.md`; a fact re-check of every claim against the table above.
