# Slice: Deploy a Prisma ORM 8 app to Vercel, and close the client on shutdown

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C9 of `changes.md`, decided by Will on 2026-09-28; started on his word on 2026-10-28. Written 2026-10-28 by `seacole-52`.)_

## At a glance

No Prisma ORM 8 page says how to deploy to Vercel. `guides/postgres/vercel.mdx` covers the Prisma Postgres Marketplace integration and has two short notes on Prisma ORM 8. And six guides tell readers to close the client "on process shutdown" without showing how. After this slice, `guides/deployment/vercel.mdx` takes a Next.js app with Prisma ORM 8 from a repository to a Vercel deployment, and the Docker guide and the client reference show the shutdown code.

## The facts, each checked on 2026-10-28

| What | Fact | Where it comes from |
| --- | --- | --- |
| Which client on Vercel | A Vercel Node.js function keeps its process warm between requests, so the ordinary module-level `postgres()` client is the right one; `postgresServerless()` is for runtimes that must not keep a connection between requests | `docs/Serverless Deployment Guide.md` lines 3 to 5 at prisma/orm `v8.0.0-rc.20` |
| Edge runtime | Next.js 16.4 builds a page with `runtime = "edge"` but warns "The Edge Runtime is deprecated. You can use the nodejs runtime instead" | `next build` of the scaffold in `wip/slice-10/vapp` |
| No generate step | `contract.json` and `contract.d.ts` are committed; the scaffold's `.gitignore` does not exclude them and `.gitattributes` marks them generated | the `create-prisma@0.15` Next.js scaffold |
| Build without a database | The scaffold's page sets `dynamic = "force-dynamic"`, and `next build` succeeds with no `DATABASE_URL`; a page that queries without it is prerendered at build time and needs the database then | `env -u DATABASE_URL npm run build` in `wip/slice-10/vapp` |
| Node.js on Vercel | 24.x is the default, 22.x is the other choice, set in project settings or `engines.node` | vercel.com/docs/functions/runtimes/node-js/node-js-versions (fetched) |
| Temporal | Node.js 24 has no built-in `Temporal`; the scaffold's `db.ts` imports `temporal-polyfill/global` | `orm/supported-versions.mdx`; the scaffold |
| Fluid compute pool | Vercel recommends `attachDatabasePool(pool)` from `@vercel/functions` right after creating a pool, so idle connections are released before a function suspends; for `pg` it listens to the pool's `release` event | the `@vercel/functions` reference (fetched); `@vercel/functions@3.10.4` `db-connections/index.js` |
| Prisma client with your own pool | `postgres({ contract, pg: pool })`; with `@vercel/functions` attached, a page load fired six `release` events | `orm/reference/transactions-and-runtime.mdx`; `npm start` of the scaffold with `VERCEL_URL` and `VERCEL_REGION` set |
| `pg` versions | `@prisma/orm-postgres@8.0.0-rc.20` pins `pg` 8.22.0 and `@types/pg` 8.20.4; `npm install pg` gives 8.23.1, and passing that pool fails type checking with "Type 'Pool' is not assignable"; the pinned versions type-check and build | `wip/slice-10/vapp` |
| Migrations | Applied from CI or a machine with `db migrate --to <ref>` against the direct connection string, never in the Vercel build | `orm/migrations/applying-a-migration.mdx`; the serverless guide's Migrations section |

## Chosen design

All paths are under `apps/docs/content/docs/`.

- New page `guides/deployment/vercel.mdx` at `/guides/deployment/vercel`, first in the Deployment group. Sections: prerequisites; commit the contract files; the client (the scaffold's `db.ts` works as it is; the Temporal import; keep the Node.js runtime); the connection string as a Vercel environment variable, with the pooled Prisma Postgres string and a link to `guides/postgres/vercel.mdx`; pages that query at build time; migrations from CI, not from the Vercel build; deploy and check; Fluid compute and `attachDatabasePool` as the last, optional step, with the `pg` versions.
- `guides/postgres/vercel.mdx` links the new page from its Prisma ORM 8 notes.
- The shutdown example: the Docker guide's Express server gets a `SIGTERM` handler that stops the server and then calls `db.close()`, and the client reference's `close()` section gets the same snippet. The six guides that say "close it only on process shutdown" link the reference section.
- Not on the page: deploying with the Vercel CLI in depth, Vercel Edge, and the serverless client.

Follow-up for the ORM side, in `changes.md`: `@prisma/orm-postgres` pins `@types/pg` exactly, so a reader's own `pg` pool fails type checking unless they match the version.

## Checks before the PR

The three docs-reader-review scripts, cspell, `lint:links`, `lint:versions`; two cold reader rounds; a fact re-check against the table above.
