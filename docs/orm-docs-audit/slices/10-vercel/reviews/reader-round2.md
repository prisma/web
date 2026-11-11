# Reader round 2 (2026-10-28, Opus, Prisma ORM 7 reader persona)

## `guides/deployment/vercel.mdx`

- "contract files" still used before its definition.
- "keeps a function instance running" conflicts with step 5's "paused between requests".
- The Marketplace note, step 3, and step 5 disagree about which variable holds the pooled string.
- What happens to a build with no `DATABASE_URL` was unclear: fails, or succeeds with an error page.
- The four-step "when you change `contract.prisma`" sentence; "commit both".
- `pool` is not exported, so a seed cannot call `pool.end()`.
- Whether `db migrate` is safe on production like `migrate deploy`; whether a Prisma ORM 7 layout must change first; which pages count as "querying"; the order of `vercel link` and the dashboard import; the preview command; `npm view` shows the latest version, not the installed one; the Prisma Compute warning came after the replacement; step 4's check only fits the template.

## Docker guide 1.4 and the `close()` reference

- The `shutdown` sentence ran two cases through one "because" chain; "It" was ambiguous.
- "schema" could mean `schema.prisma`.
- What to do when the process does not exit.
- Reference: "once" conflicts with "more than once"; whether `close()` ends a pool you passed in; how to detect the error in code; how to create a new client; where `app` and `db` come from.

## What changed

All of the above, with these facts checked by running them: a page that queries without catching stops `next build` with `Error occurred prerendering page "/"` when there is no `DATABASE_URL`, and one that catches builds and bakes the error in; `db migrate` maps to `migrate deploy` (`orm/coming-from-prisma-orm-7.mdx:179`). Left as written: timeouts and error handling in the shutdown handler, which are general Node.js practice rather than Prisma ORM behaviour.
