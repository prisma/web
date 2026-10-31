# Fact re-check: `(index)/prisma-orm/local-database.mdx` (2026-10-22, Opus)

Sources: `postgres/npx-create-db.mdx`, `guides/deployment/docker.mdx`, `composer/local-development.mdx`, `cli/dev.mdx`, `studio/prisma-next.mdx`, `guides/postgres/viewing-data.mdx`, `orm/data-modeling/mongodb.mdx`, the MongoDB quickstart, `npm view prisma dist-tags`, and two apps scaffolded with `create-prisma@0.14.3` on 2026-10-22 (`wip/slice-09/demo2` for PostgreSQL, `wip/slice-09/demo-mongo` for MongoDB).

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| "The setup pages for a new app export it in the shell, and the pages for an existing app put it in `.env`" | `from-scratch.mdx` lines 76 to 80 sets up a new project and uses `.env`; only the `npm create prisma` pages export | "The setup pages that start from `npm create prisma` export it in the shell, and the other setup pages put it in `.env`" |
| "open the claim link, which signs you in to a free Prisma account and keeps the database" | `npx-create-db.mdx` lines 196 to 210: you click Claim database, sign in, and authorize | "unless you claim it: open the claim link and sign in to a Prisma account, and you keep the database for free" |

## Confirmed

The create-db output lines, 24 hours, `--ttl 1h`; the Compose file and connection string line for line against the Docker guide; `sslmode=require` on the hosted examples; the scaffold's `dev:composer` = `npm run build && prisma dev module.ts`, the `database` node name, `src/prisma/contract.prisma`, `prisma.config.ts` reading `DATABASE_URL`, the `"User"` and `"Post"` tables; `dev url` printing the bare URL under `$(...)`, the rc.24 requirement, build first, `--fresh`, data kept across runs, `Ctrl-C` stopping services and the database; the MongoDB scaffold's `users` and `posts`, model-name collections without `@@map`, standalone `mongod`, replica set only for transactions and change streams, the `replicaSet=rs0` string; Studio from outside the project, port 5555, the Migrations view, no MongoDB, `prev` = 7.10.1; the PostgreSQL 15 and MongoDB 8.0 floors; the `psql` facts; `docker compose ps` showing `healthy`; all 11 internal links.

## Q, left as written

- Docker was installed but its daemon was not running, so the images were not run; `postgres:17` ships `psql` and `mongo:8` ships `mongosh` per Docker Hub.
- The scaffold pins `prisma` 8.0.0-rc.21, older than the rc.24 that `dev url` needs; the page states the requirement and does not give an upgrade command, because upgrading the scaffold by hand fails on a dependency clash (see the spec).
- The MongoDB quickstart's CLI reads `MONGODB_URL`; this page shows only `DATABASE_URL`, which is what the quickstart links here for.

## After the fact check

Round 4's rewrites were applied after this check and were re-read against the same sources by the author: the "applying the migration the scaffold wrote" clause comes from the scaffold's `migrations/app/` baseline and Composer's `[database-migrate]` step; the `@@map` clause for PostgreSQL tables from `psl-syntax.mdx`; the Atlas pointer for transactions from the replica-set facts above.
