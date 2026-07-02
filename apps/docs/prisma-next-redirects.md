# Prisma Next redirect tracking

Temporary migration-decision log for the Prisma Next docs. It documents redirect
**intent** only. Redirects are implemented separately in
[`next.config.mjs`](./next.config.mjs) after the decisions here are reviewed.

This is a working file, not a docs page: Fumadocs only renders
`content/docs/`, so this file at `apps/docs/` is never served as a route.

## The URL model

- Prisma Next ORM docs are authored at **`/docs/orm/next`**.
- Prisma 7 ORM docs are the generally available docs at **`/docs/orm`**.
- When Prisma Next goes generally available, `/docs/orm/next/*` becomes
  `/docs/orm/*` (Prisma Next is promoted to the latest ORM docs), and the
  current Prisma 7 pages are pinned to a versioned path, **`/docs/orm/v7/*`**.
- The Prisma Next getting-started pages live separately under `/docs/next` and
  are not part of the ORM-docs promotion above.

So each Prisma 7 ORM page has up to two redirect futures: its old URL pins to
the Prisma 7 versioned page (`/docs/orm/v7/...`), and/or the old URL points at
the Prisma Next equivalent that will own `/docs/orm/...` at GA.

## Moves already made in this PR

Prisma Next getting-started URLs that changed while restructuring the
getting-started section.

| Old URL | New URL | Redirect added? | Notes |
| --- | --- | --- | --- |
| `/docs/next/prisma-postgres/quickstart/prisma-next` | `/docs/prisma-postgres/quickstart/prisma-next` | Yes (`next.config.mjs`) | The Prisma Next + Prisma Postgres quickstart moved into the Prisma Postgres → Quickstart dropdown, alongside Prisma ORM, Kysely, Drizzle ORM, and TypeORM. |
| `/docs/next/prisma-postgres/quickstart` (index) | `/docs/prisma-postgres/quickstart/prisma-next` | Yes (`next.config.mjs`) | Bare quickstart index now points at the moved page. |

New Prisma Next getting-started pages added in this PR have no prior URL, so
they need no redirect: `/docs/next`, `/docs/next/getting-started`,
`/docs/next/quickstart/{postgresql,mongodb}`,
`/docs/next/add-to-existing-project/{postgresql,mongodb}`, and the Prisma Next
Prisma Postgres import/CLI pages under `/docs/next/prisma-postgres/`.

## Prisma 7 → Prisma Next ORM docs migration map

One row per Prisma 7 ORM page as its Prisma Next counterpart is decided.
Columns follow the tracking spec in the `prisma-docs-voice` skill
(`references/redirects-tracking.md`).

| Current Prisma 7 URL | New Prisma Next URL | Redirect old → Prisma 7 versioned? | Redirect old → Prisma Next equivalent? | No 1:1 equivalent? | Notes |
| --- | --- | --- | --- | --- | --- |
| `/docs/orm/prisma-schema/overview/generators` | `/docs/orm/next/prisma-schema/overview/generators` _(if it exists)_ | Yes → `/docs/orm/v7/prisma-schema/overview/generators` | TBD | TBD | Confirm whether Prisma Next keeps a generators concept. If it does, the Prisma Next page owns `/docs/orm/...` at GA; if not, mark no 1:1 and note where the concept moved. Example row from the migration spec. |
