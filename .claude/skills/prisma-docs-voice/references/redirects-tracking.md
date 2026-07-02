# Redirect and URL migration tracking

Prisma Next ORM docs are authored at `/docs/orm/next`. Prisma 7 ORM docs are the
generally available docs at `/docs/orm`. When Prisma Next goes generally
available, `/docs/orm/next/*` becomes `/docs/orm/*` (Prisma Next is promoted to
the latest ORM docs) and the current Prisma 7 pages are pinned to a versioned
path, `/docs/orm/v7/*`. (The Prisma Next getting-started pages live separately
under `/docs/next` and are not part of that promotion.)

So sections move and URLs change. Track every decision before the routing
changes land, so redirects are deliberate rather than reconstructed after the
fact.

This tracking file **documents decisions only**. It does not implement
redirects. Redirects land later in `apps/docs/next.config.mjs` after the table
is reviewed.

## Where the file lives

One tracking file per migration effort, in the `prisma/web` repo:

```
apps/docs/prisma-next-redirects.md
```

It sits next to `next.config.mjs` (where redirects are implemented) and is a
plain working file, not a docs page (Fumadocs only renders `content/docs/`, so
a file at `apps/docs/` never becomes a route). Update it in the same PR that
adds or moves a Prisma Next section.

## What to record for each new or moved section

Maintain a table with one row per page. Columns:

| Column | Meaning |
| --- | --- |
| Current Prisma 7 URL | The live page today, e.g. `/docs/orm/prisma-schema/overview/generators`. Blank if the page is new to Prisma Next. |
| New Prisma Next URL | Where the page lives (or will live) under Prisma Next. |
| Redirect old → Prisma 7 versioned? | Whether the old URL should redirect to a pinned Prisma 7 page (e.g. `/docs/orm/v7/...`) so Prisma 7 readers keep the old behavior. Yes / No. |
| Redirect old → Prisma Next equivalent? | Whether the old URL should redirect to the Prisma Next page instead. Yes / No. |
| No one-to-one equivalent? | Yes when the page has no direct Prisma Next counterpart (removed, split, or merged concept). |
| Notes | Missing, merged, renamed, or deprecated pages; open questions; owner. |

Rules:

- A row's "redirect to Prisma 7 versioned" and "redirect to Prisma Next
  equivalent" are usually mutually exclusive. If both look true, the page
  probably splits into two, so add a note and a second row.
- When there is no one-to-one equivalent, still record the old URL and say in
  Notes where its content went (merged into which page, or dropped and why).
- Do not delete rows as decisions settle. Mark them resolved so the history of
  the migration stays legible.

## Template

Copy this into `apps/docs/prisma-next-redirects.md` to start (or extend) the
table.

```markdown
# Prisma Next redirect tracking

Temporary migration-decision log. Documents redirect intent only; redirects are
implemented later in `next.config.mjs` after review.

| Current Prisma 7 URL | New Prisma Next URL | Redirect old → Prisma 7 versioned? | Redirect old → Prisma Next equivalent? | No 1:1 equivalent? | Notes |
| --- | --- | --- | --- | --- | --- |
| /docs/orm/prisma-schema/overview/generators | /docs/orm/next/prisma-schema/overview/generators (if it exists) | Yes → /docs/orm/v7/prisma-schema/overview/generators | TBD | TBD | Confirm whether Prisma Next keeps a generators concept. If it does, the Prisma Next page owns /docs/orm/... at GA; if not, mark no 1:1 and note where the concept moved. |
```
