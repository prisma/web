# Reader round 1: `(index)/prisma-orm/local-database.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. "The three PostgreSQL options are in order of how much you install: nothing, Docker, or nothing extra when `npm create prisma` made your app": "nothing" and "nothing extra" both mean installing nothing, and I do not know why `npm create prisma` would give me a database.
2. The Composer sentence carries too many new ideas: what Prisma Composer is, why my app contains a second app, whether `module.ts` and `service.ts` are that app, and what "the whole app" means.
3. "builds the app, starts the database, applies your contract to it, and starts your service": "contract" and "service" are unknown; Prisma ORM 7 had a schema and migrations.
4. "`migration plan` and `db migrate` read `DATABASE_URL` through `prisma.config.ts`": commands I do not know, and a reason I do not need.
5. "`database` is the name `module.ts` gives the database": fixed word or my own name? "With the local credentials" is vague.
6. "If a connection string you copied ends in `replicaSet=rs0&directConnection=true`": copied from where, and what is left after removing one parameter?
7. Studio "fails when it finds a Prisma ORM 8 `prisma.config.ts`": crash or wrong data, permanent or temporary?

## Words I had to guess

"claim URL", "attach it to a free Prisma account", "Prisma Postgres", "Prisma Composer", "contract", "service", `migration plan`, `db migrate`, `prisma@prev`, "the Migrations view", `--fresh`, `8.0.0-rc.24`, whether Prisma ORM 8 writes need a replica set.

## So what do I actually type?

- create-db: which printed line is the connection string; the full `--ttl` command.
- Docker: whether to wait for the health check, and how to see it.
- Composer: what to run after `export DATABASE_URL=...`, and whether to run `migration plan` and `db migrate` at all when the script already applied the contract; how to know my project is a Composer project.
- "Look at your rows": every example uses the Docker credentials; nothing for the create-db or Composer database.
- `\d user` and `SELECT * FROM "user"`: does the table name come from my model, and is it `User` or `user`?
- MongoDB: can `mydb` be any name?

## Internals I did not need

"read `DATABASE_URL` through `prisma.config.ts`"; the reason a replica-set string does not connect; the step-by-step account of what `dev:composer` does inside; the reason for no `sslmode=require`; "`dev url` is in `prisma` since `8.0.0-rc.24`" as version history.

## Could I do what the page is for?

Partly. Docker PostgreSQL and Docker MongoDB: yes. create-db: mostly. The Composer section is where I would get stuck, and "Look at your rows" only works for the Docker setup.
