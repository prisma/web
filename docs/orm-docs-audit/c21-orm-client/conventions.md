# Shared conventions for the C21 plain-language pass (fundamentals)

Verified facts (rc.9 source at wip/prisma-src/). Use these words on every page; do not restate them differently.

- "contract": on first use on a page, say: "your contract, the `contract.prisma` file that replaced `schema.prisma`". After that, "contract" alone.
- `db`: "`db` is the client you create once in `src/prisma/db.ts`; `prisma orm init` writes that file." Examples import it as `import { db } from "./prisma/db"` from a file directly inside `src/`.
- `db.orm.public.User`: "`db.orm` holds your models by model name; `public` is the PostgreSQL schema (the namespace your tables live in, `public` unless you set one)." On MongoDB there is no schema segment and the accessor is the collection name: `db.orm.users`.
- `db.sql.public.user`: the SQL query builder, keyed by table name. The table name is the model name with a lowercase first letter unless the model sets `@@map`. Column names are the field names unless `@map`. Say this once where `db.sql` first appears.
- `db.raw.sql`: raw SQL as a template string. `db.runtime()` is the connection that runs a built query: `db.runtime().query(plan)` for rows, `db.runtime().execute(plan)` for a count. On PostgreSQL `db.runtime()` is synchronous; on MongoDB it must be awaited: `(await db.runtime()).query(plan)`. State this where `db.runtime()` first appears on a page.
- "plan": avoid the word. Say "the built query" or show the code. Every raw or builder query ends with `.build()` and is then passed to `query()` or `execute()`.
- `.all()`, `.first()`, `.create(...)`: "you `await` the whole chain; the last call says what you want back". Do not use "terminal".
- `.first()` returns `null` when nothing matches. `.all().firstOrThrow()` throws an error with code `RUNTIME.NO_ROWS`.
- `emit`: "`prisma contract emit`, which you run after every change to the contract". Never a bare "emit".
- Scaffold command: `npm create prisma@latest -- my-app` (never `npx create-prisma@latest` or the bare package name). Bun: `bun create prisma@latest my-app`.
- Skills note at the bottom of pages: keep, but say "Projects created with `npm create prisma@latest` include the Prisma ORM skills for your coding agent".
- `conflictOn: { email: "..." }` takes a unique column with its value; if a row with that value exists, `update` is applied to it. Leave it out to use the primary key.
- Nested writes that work: `create`, `connect`, `disconnect` (`posts: (p) => p.create([...])`). `connectOrCreate`, nested update/upsert/delete, and `set` do not exist; link /orm/coming-from-prisma-orm-7#not-available-yet.
- Transaction options (`isolationLevel`, `timeout`, `maxWait`) and nested transactions do not exist. Prisma ORM 7's interactive `$transaction(async (tx) => ...)` maps directly to `db.transaction(async (tx) => ...)`.
- `create-prisma` mentions of "skills": "Prisma ORM skills, instruction files for coding agents".
- Type names in raw SQL (`pg/int4@1`): "the PostgreSQL type plus a version, always `@1` today"; prefer taking the type from the table: `db.sql.public.user.columns.id`. The list is at /orm/reference/raw-queries.
- Errors: "an error with code `X`" (it is `error.code`).
- Do not use: terminal, codec, envelope, facade, lane, junction model/table (say "join table" / "model for the join table"), surface, plan, "rides", "fan out", "drop one level", "field proxy" (say "the `p` argument"), "lambda" (say "callback").
- `npx prisma skills sync` exists in the published CLI (8.0.0-rc.13, newer than the rc.9 source tree): "in an existing project, run `npx prisma skills sync`". Do not drop it because the rc.9 tree lacks it.
- The serverless client (`postgresServerless(...)` from `@prisma/orm-postgres/serverless`) has no `db.orm`, `runtime()`, or `transaction()`; it runs SQL builder and raw queries only, reading rows 100 at a time. Never show `db.orm` on it.
