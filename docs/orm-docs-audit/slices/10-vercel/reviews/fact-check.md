# Fact re-check (2026-10-28, Opus)

Sources: the slice spec, the scaffold in `wip/slice-10/vapp` (`@prisma/orm-postgres` 8.0.0-rc.21, `prisma` 8.0.0-rc.27, Next.js 16.4.2, `@vercel/functions` 3.10.4), prisma/orm at `v8.0.0-rc.20`, the Vercel docs pages on Node.js versions, `@vercel/functions`, environment variables and Fluid compute, and the linked docs pages.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| The change loop (emit, plan, commit, migrate production) | `generating-a-migration.mdx` "The db ref"; `db migrate --help` | adds `npx prisma db migrate --advance-ref db` on the development database, and commits `migrations/app/refs/db.json` |
| The build-log legend shows only `ƒ` | `next@16.4.2` `dist/build/utils.js` | adds the `○ (Static)` legend line |
| The template's home page only lists users | the scaffold's `src/prisma/users.ts` and `seed.ts` | it also adds three sample users on first load |
| "the open pool keeps the process running" | `postgres.ts:84` at rc.20 (`idleTimeoutMillis ?? 30_000`) | "until its idle connections time out, 30 seconds by default" |

## Confirmed

Node.js 24.x default and 22.x; `attachDatabasePool` semantics; Fluid compute; variables apply to new deployments; `vercel env add --environment` and `vercel deploy --prod`; `prisma generate` gives `CLI.UNKNOWN_COMMAND`; the migrate output strings; the `pg` 8.22.0 and `@types/pg` 8.20.4 pins on rc.21; the scaffold's files; `DRIVER.NOT_CONNECTED` with no database; `close()` idempotent and final, waits for running queries, leaves a passed-in pool open; the serverless guide's advice for Vercel Node.js functions; the connection string hosts; `db migrate` as `migrate deploy`; every internal link and anchor.

## Q, left as written

- Which Next.js 16 minor first warns about the Edge runtime (16.4.2 does).
- The Turbopack `Can't resolve './contract.json'` text was reproduced by the author, not the checker.
- With step 5's `db.ts`, a missing `DATABASE_URL` gives a connection error rather than `DRIVER.NOT_CONNECTED`; Common problems describes the template's `db.ts`.
- The template's `temporal.updatedAtString()` fails on `@prisma/orm-postgres` 8.0.0-rc.21 (field presets removed); recorded as D33 in `changes.md`.
