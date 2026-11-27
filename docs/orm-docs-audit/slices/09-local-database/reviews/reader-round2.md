# Reader round 2: `(index)/prisma-orm/local-database.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. "the local database that app already includes": a Prisma 7 scaffold gave a schema and `.env`, not a database.
2. "The script works this way because the scaffold is also a Prisma Composer app: `module.ts` describes your app and its database": two new names, neither explained; is Composer a product, a runtime, or a dev server?
3. The sentence with `contract.prisma`, the renamed concept, `migration plan`, `db migrate`, and the `DATABASE_URL` rule: too many ideas.
4. "`database` is the database's name in `module.ts`": I have never seen `module.ts` and read `database` as a keyword.
5. The Studio sentence tells me why before what to do, and I cannot tell whether Studio works fully against a Prisma 8 database.
6. "it is enough for the setup pages" while the setup pages use a `replicaSet=rs0` string: do they use transactions?

## Words I had to guess

"contract", "Prisma Composer", `module.ts`, "scaffold", `npx prisma dev url database`, `migration plan`, `db migrate`, `--fresh` (which command takes it), "Migrations view".

## So what do I actually type?

- The export command for `DATABASE_URL` in the create-db section and in "Look at your rows".
- The line in `module.ts` that holds the database name.
- Which command `--fresh` goes on.
- What to do when my app was not made by `npm create prisma`.
- `psql -U postgres` without a database name lands in `postgres` by luck.

## Internals I did not need

The reason the script works (Composer); why MongoDB needs no database created; the length of the replica-set explanation; why Studio fails inside the project; the health-check timing; "`dev url` exists in `prisma` from version `8.0.0-rc.24`" as history.

## Could I do what the page is for?

Mostly. Still unknown: what Composer and `module.ts` are and whether to prefer that path or Docker; how to export `DATABASE_URL` from `.env`; where the database name is and which command takes `--fresh`; whether a standalone MongoDB is enough for the MongoDB setup page; whether Prisma 7 Studio fully works against a Prisma 8 database.
