# Reader round 4: `(index)/prisma-orm/local-database.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. The intro's third option names `dev:composer` before the page says what it is.
2. "The setup pages for a new app export it in the shell, and the pages for an existing app put it in `.env`": describes other pages instead of telling me what to do.
3. The Composer and `module.ts` sentence: two new terms, and I cannot tell whether I must touch either.
4. "contract" met before its definition; does the script create tables directly or apply migrations?
5. "The `prisma` commands that connect to the database themselves ... a migration you planned": too many clauses, and `db migrate` is not the Prisma 7 name.
6. The `--fresh` sentence explains how the script is built; is the app running afterwards, and what do I run next time?
7. The replica-set sentences talk about another page's example.
8. The Studio sentence chains three ideas.

## Words I had to guess

`dev:composer`, "Composer", `module.ts`, "contract", "a migration you planned", "the scaffold", `prisma@prev`, "starter contract".

## So what do I actually type?

`.env` or `export`; the exact Prisma 8 migrate command; how to upgrade an old `prisma`; whether `--fresh` leaves the app running; the Docker string hard-coded under a sentence that lists three sources; `cd` back after Studio; whether `@@map` applies to PostgreSQL tables; what to do about transactions on a standalone MongoDB.

## Internals I did not need

The health-check timing; what Composer and `module.ts` are; how the `dev:composer` script is built; why Studio runs from the parent directory.

## Could I do what the page is for?

Mostly yes for `create-db`, Docker PostgreSQL, Docker MongoDB, `psql` and `mongosh`. Still unknown: `.env` or `export`; what Composer and `module.ts` are and whether to touch them; the Prisma 8 migrate command; transactions on local MongoDB; whether `--fresh` leaves the app running; what to do with a `prisma` older than rc.24.

## Decision after this round

Four rounds ran. The marks that remain are Prisma ORM 8 vocabulary the quickstarts teach (`migration plan`, `db migrate`, "contract") and the upgrade path for a scaffold that pins an old `prisma`, which the page cannot give because upgrading the scaffold by hand fails today. The sentences this round quoted were rewritten; no further round.
