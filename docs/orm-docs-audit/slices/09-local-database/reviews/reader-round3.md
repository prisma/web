# Reader round 3: `(index)/prisma-orm/local-database.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. "the database that app can start for itself": an app does not start a database in Prisma 7.
2. "the quickest way through a setup page, and the only option on this page that is not on your machine": two ideas, odd phrasing.
3. The Composer sentence introduces a product after I was told to run the script; is Composer installed, a dependency, or a service?
4. `migration plan` and `db migrate` treated as familiar.
5. "`database` is the name the scaffold gave the database in `module.ts`": what and where `module.ts` is.
6. The `--fresh` sentence: why `npm run build` first, what "once instead of the script" means, how to get back to normal.
7. "the setup pages use nothing more; only transactions and change streams need a replica set": will nested writes that needed a replica set in Prisma 7 fail?
8. The Studio sentence: four ideas in one.

## Words I had to guess

`create-db`, "claim link", "Composer", `module.ts`, "the scaffold", `npx prisma dev url database` (same as Prisma 7's `prisma dev`?), `8.0.0-rc.24`, "the starter contract", `prisma@prev`, "a Prisma ORM 8 `prisma.config.ts`", "Migrations view", `directConnection=true`.

## So what do I actually type?

- `.env` or export: one clear default.
- The `create-db` output line to copy.
- After `dev url`: run `migration plan` and `db migrate` myself, or does the script keep tables in sync?
- How to upgrade for `dev url`.
- How to return to normal after `--fresh`.
- `psql` for the `create-db` and Composer databases; only the Docker export is shown.
- Studio with `DATABASE_URL` set only in `.env` fails from the parent directory.
- A collection without `@@map`.

## Internals I did not need

The health-check timing; the reason for no `sslmode`; what Composer is; the `module.ts` excerpt; the replica-set explanation; why Studio runs outside the project.

## Could I do what the page is for?

Partly. `create-db`, Docker PostgreSQL, and Docker MongoDB: yes. The Composer section is the weak one: what Composer and `module.ts` are, whether the script keeps tables in sync, `--fresh`, `psql` against that database, whether "contract" replaces `schema.prisma`, and how to install a version new enough for `dev url`.
