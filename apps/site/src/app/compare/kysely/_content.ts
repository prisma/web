export const KYSELY_PATH = "/compare/kysely";

export const KYSELY_TITLE = "Prisma ORM vs Kysely: contract file or SQL query builder?";

export const KYSELY_DESCRIPTION =
  "Prisma ORM 8 drives typed queries and migrations from a contract file. Kysely is a type-safe SQL query builder without a schema file. Checked October 2026.";

export const CHECKED = "October 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const KYSELY_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const KYSELY_PUBLISHED = { iso: "2026-10-16", label: "October 2026" } as const;
export const KYSELY_UPDATED = { iso: "2026-10-18", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want models and relations in a contract file, `contract.prisma`.",
  "You want typed model queries and a SQL query builder from the same database client.",
  "You want `migration plan` to write a TypeScript migration from that contract.",
  "You want related records as part of the model API, as in `db.orm.public.User.include`.",
];

export const CHOOSE_KYSELY = [
  "You want the library itself to be the SQL query builder, with no contract file.",
  "You want table types as TypeScript interfaces, written by hand or produced by a generator.",
  "You want up and down migrations as TypeScript functions you write. An optional CLI lives in `kysely-ctl`.",
  "You need a built-in dialect for MySQL, Microsoft SQL Server, or PGlite, which Prisma ORM 8 does not ship.",
];

/** One user and their posts, read from the same PostgreSQL `User` and `Post` tables. */
export const SAME_QUERY = {
  kysely: `import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "./db"; // your Kysely<Database> instance

const user = await db
  .selectFrom("User")
  .selectAll("User")
  .select((eb) => [
    jsonArrayFrom(
      eb
        .selectFrom("Post")
        .selectAll("Post")
        .whereRef("Post.authorId", "=", "User.id"),
    ).as("posts"),
  ])
  .where("User.email", "=", "alice@example.com")
  .executeTakeFirst();`,
  prisma: `import { db } from "./src/prisma/db";

const user = await db.orm.public.User.include("posts")
  .where({ email: "alice@example.com" })
  .first();`,
  /**
   * Representative SQL both snippets send for that query. Labelled because it
   * was not captured from a live run against one database.
   */
  sql: `-- Representative SQL matching both snippets above, not captured from a live run.

-- Kysely: jsonArrayFrom nested subquery
select
  "User".*,
  (
    select coalesce(json_agg(agg), '[]')
    from (
      select "Post".*
      from "Post"
      where "Post"."authorId" = "User"."id"
    ) as agg
  ) as "posts"
from "User"
where "User"."email" = $1
limit 1

-- Prisma ORM: include loads posts in a follow-up query
select "id", "email", "name" from "User" where "email" = $1 limit $2
select "id", "title", "authorId" from "Post" where "authorId" in ($1)`,
} as const;

/** Shared hover groups across the three same-query tabs (0-based Shiki line indexes). */
export const SAME_QUERY_LINE_GROUPS: readonly {
  id: string;
  kysely: readonly number[];
  prisma: readonly number[];
  sql: readonly number[];
}[] = [
  {
    id: "posts",
    kysely: [6, 7, 8, 9, 10, 11, 12],
    prisma: [2],
    sql: [5, 6, 7, 8, 9, 10, 11, 12, 19],
  },
  { id: "email", kysely: [14], prisma: [3], sql: [14, 18] },
];

export type CompareRow = {
  feature: string;
  kysely: string;
  prisma: string;
  sources: { kysely: string; prisma: string };
};

/** Columns run Feature, Kysely, Prisma ORM: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Library price",
    kysely: "Free. MIT license.",
    prisma: "Free. Apache License 2.0.",
    sources: {
      kysely: "https://github.com/kysely-org/kysely/blob/master/LICENSE",
      prisma: "https://github.com/prisma/prisma/blob/main/LICENSE",
    },
  },
  {
    feature: "Release status",
    kysely:
      "Version 0.29.7 on npm, so not yet a 1.0 release. The getting started guide requires TypeScript 5.4 or newer, and strict mode.",
    prisma:
      "Prisma ORM 8 is a release candidate, and it is what `npm install prisma` gives you. The final release is still to come.",
    sources: {
      kysely: "https://www.npmjs.com/package/kysely",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "Data model",
    kysely:
      "TypeScript interfaces you provide. A dialect also needs its driver, such as `pg` for PostgreSQL.",
    prisma:
      "A contract file, `contract.prisma`. `contract emit` writes the types. `contract infer` writes a starter contract from PostgreSQL tables you already have. There is no `@prisma/client` package.",
    sources: {
      kysely: "https://kysely.dev/docs/getting-started",
      prisma: "https://www.prisma.io/docs/cli/contract-infer",
    },
  },
  {
    feature: "Queries",
    kysely: "A fluent SQL builder: `selectFrom`, `where`, and the other clauses in the guide.",
    prisma:
      "An ORM client for model queries, a SQL query builder on PostgreSQL and SQLite, and raw SQL for a statement neither API expresses.",
    sources: {
      kysely: "https://kysely.dev/docs/getting-started",
      prisma: "https://www.prisma.io/docs/orm/reference/sql-query-builder",
    },
  },
  {
    feature: "Migrations",
    kysely:
      "up and down functions you write. Pending migrations run in alphanumeric order, with an option for unordered migrations.",
    prisma:
      "`migration plan` writes `migration.ts` from the contract. On PostgreSQL, `migration show` prints the SQL. `db migrate` runs `ops.json`, not the TypeScript file.",
    sources: {
      kysely: "https://kysely.dev/docs/migrations",
      prisma: "https://www.prisma.io/docs/cli/migration-show",
    },
  },
  {
    feature: "Databases",
    kysely:
      "Built-in dialects for PostgreSQL, MySQL, Microsoft SQL Server, SQLite, and PGlite. See [database support](#databases).",
    prisma:
      "PostgreSQL, MongoDB, and SQLite in Prisma ORM 8. The rest stay on Prisma ORM 7. See [database support](#databases).",
    sources: {
      kysely: "https://kysely.dev/docs/dialects",
      prisma: "https://www.prisma.io/docs/orm/supported-databases",
    },
  },
  {
    feature: "Hosted database",
    kysely: "None. Kysely is a library.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is a separate product. Any Postgres client works with it, so Prisma ORM is optional. [Prisma Compute](/docs/compute) is separate app hosting.",
    sources: {
      kysely: "https://kysely.dev/docs/getting-started",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
];

/**
 * Kysely: core and community dialects on kysely.dev/docs/dialects. Prisma ORM 8:
 * /docs/orm/supported-databases. Prisma ORM 7: /docs/orm/v7/reference/supported-databases.
 * `null` is no support.
 */
export type DatabaseStatus =
  | "Built-in"
  | "Community dialect"
  | "Release candidate"
  | "Early access"
  | "Experimental"
  | "ORM 7 only"
  | "Supported"
  | null;

/** Statuses for something you can build on today without a preview label. */
export const FULL_SUPPORT: readonly DatabaseStatus[] = [
  "Built-in",
  "Release candidate",
  "Supported",
];

export const DATABASE_SOURCES = {
  kysely: "https://kysely.dev/docs/dialects",
  orm8: "https://www.prisma.io/docs/orm/supported-databases",
  orm7: "https://www.prisma.io/docs/orm/v7/reference/supported-databases",
} as const;

export const DATABASE_MATRIX: readonly {
  database: string;
  kysely: DatabaseStatus;
  orm8: DatabaseStatus;
  orm7: DatabaseStatus;
}[] = [
  { database: "PostgreSQL", kysely: "Built-in", orm8: "Release candidate", orm7: "Supported" },
  { database: "MySQL", kysely: "Built-in", orm8: "ORM 7 only", orm7: "Supported" },
  { database: "MariaDB", kysely: "Community dialect", orm8: "ORM 7 only", orm7: "Supported" },
  { database: "Microsoft SQL Server", kysely: "Built-in", orm8: "ORM 7 only", orm7: "Supported" },
  { database: "SQLite", kysely: "Built-in", orm8: "Experimental", orm7: "Supported" },
  { database: "CockroachDB", kysely: null, orm8: "ORM 7 only", orm7: "Supported" },
  { database: "MongoDB", kysely: null, orm8: "Early access", orm7: "Supported" },
  { database: "PGlite", kysely: "Built-in", orm8: null, orm7: null },
];

/** What each side costs. Figures checked against the pricing page and each license. */
export const PRICING: readonly {
  label: string;
  kysely: string;
  prisma: string;
  sources: { kysely: string; prisma: string };
}[] = [
  {
    label: "Library license and cost",
    kysely: "Free, MIT",
    prisma: "Free, Apache 2.0",
    sources: {
      kysely: "https://github.com/kysely-org/kysely/blob/master/LICENSE",
      prisma: "https://github.com/prisma/prisma/blob/main/LICENSE",
    },
  },
  {
    label: "Paid plans",
    kysely: "None",
    prisma: "None for the ORM",
    sources: {
      kysely: "https://kysely.dev/docs/getting-started",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    label: "Hosted database",
    kysely: "None. You bring your own.",
    prisma:
      "[Prisma Postgres](/docs/postgres), optional. It works with any Postgres client, Kysely included.",
    sources: {
      kysely: "https://kysely.dev/docs/getting-started",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const SAME_JOB: readonly { task: string; kysely: string; prisma: string }[] = [
  {
    task: "Define tables",
    kysely: "A TypeScript `Database` interface, with one property per table.",
    prisma: "Models in `contract.prisma`.",
  },
  {
    task: "Generate types",
    kysely:
      "Nothing to generate if you write the interface by hand. Community generators such as `kysely-codegen` write it for you.",
    prisma: "`contract emit` writes the types from the contract.",
  },
  {
    task: "Read an existing database",
    kysely:
      "`kysely-codegen` connects to PostgreSQL, MySQL, SQLite, or SQL Server and writes the `Database` interface.",
    prisma: "Inspects a live database and writes a starter `contract.prisma`.",
  },
  {
    task: "Write a migration",
    kysely:
      "`up` and `down` functions you write with `db.schema`. `kysely migrate make` from `kysely-ctl` creates the file.",
    prisma: "`migration plan` writes `migration.ts` from the contract.",
  },
  {
    task: "Preview query SQL",
    kysely: "`.compile()` on a query returns its SQL and parameters without running it.",
    prisma: "`.build()` on the SQL query builder returns the query without running it.",
  },
  {
    task: "Preview migration SQL",
    kysely: "You read the SQL you wrote in the `up` function. There is no separate preview command.",
    prisma:
      "A CLI preview prints a migration's operations and statement preview, without connecting to the database.",
  },
  {
    task: "Run migrations",
    kysely:
      "`Migrator` from `kysely/migration`, with `migrateToLatest()`. `kysely-ctl` wraps it as `kysely migrate latest`.",
    prisma: "`db migrate` applies the pending migrations on disk.",
  },
];

export const APART = [
  {
    id: "model-api",
    title: "A model API and a SQL query builder",
    body: "The ORM client answers model queries. The SQL query builder, on PostgreSQL and SQLite, takes joins and aggregates the client does not expose. Raw SQL covers a statement neither API expresses.",
  },
  {
    id: "offline-migration-plan",
    title: "A migration plan that does not need the database",
    body: "`migration plan` reads the contract and writes the migration. Planning does not connect to a database, so it can run without database credentials.",
  },
];

export const WRONG_CHOICE = [
  "You want a SQL query builder and no contract file. Kysely takes a TypeScript `Database` interface, a dialect, and that dialect's driver.",
  "You need MySQL, MariaDB, SQL Server, or CockroachDB from the current Prisma ORM 8 packages. Those databases are not in ORM 8 yet. [Prisma ORM 7](/docs/orm/v7) still supports them, and Kysely has built-in dialects for MySQL, SQL Server, and SQLite. See [supported databases](/docs/orm/supported-databases).",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Is Kysely an ORM?",
    answer:
      "Kysely is a type-safe SQL query builder. You describe tables as TypeScript interfaces and write queries with a fluent SQL API. It does not generate queries from a contract file. Source: [Kysely getting started](https://kysely.dev/docs/getting-started), October 2026.",
  },
  {
    question: "Is Prisma ORM 8 a final release?",
    answer:
      "No. Prisma ORM 8 is a release candidate, and it is what `npm install prisma` gives you today. PostgreSQL is the release-candidate database. MongoDB is early access, and SQLite is experimental. Source: [Prisma ORM](/docs/orm) and [supported databases](/docs/orm/supported-databases), October 2026.",
  },
  {
    question: "Can I connect Kysely to Prisma Postgres?",
    answer:
      "Yes. Prisma Postgres is PostgreSQL, and Prisma ORM is optional. Pass the connection string to Kysely's `PostgresDialect` and the `pg` driver. The [Kysely quickstart](/docs/prisma-postgres/quickstart/kysely) shows the setup.",
  },
  {
    question: "Which TypeScript setup does Kysely require?",
    answer:
      "Kysely's getting started guide requires TypeScript 5.4 or newer, and strict mode in tsconfig.json. Source: [Kysely getting started](https://kysely.dev/docs/getting-started), October 2026.",
  },
];

/** Short Kysely table types for the User and Post tables in the same-query example. */
export const SWITCH_KYSELY_TYPES = `interface Database {
  User: {
    id: number;
    email: string;
    name: string | null;
  };
  Post: {
    id: number;
    title: string;
    authorId: number;
  };
}`;

/**
 * Representative `contract.prisma` matching those tables, in the shape
 * `contract infer` writes (PSL, `// use prisma-8`, namespace public).
 */
export const SWITCH_PRISMA_CONTRACT = `// use prisma-8
// Contract inferred from the live database schema. Edit as needed, then run \`prisma contract emit\`.

namespace public {
  model User {
    id    Int     @id
    email String
    name  String?
    posts Post[]
  }

  model Post {
    id       Int    @id
    title    String
    authorId Int
    author   User   @relation(fields: [authorId], references: [id])
  }
}`;

/** Four commands from the Prisma ORM 8 existing-PostgreSQL guide. */
export const SWITCH_COMMANDS = `npx prisma@latest orm init --yes --target postgres --authoring psl --write-env
npx prisma contract infer --output ./src/prisma/contract.prisma
npx prisma contract emit
npx prisma db sign`;

export const TOOLS = {
  kysely: {
    name: "Kysely",
    softwareVersion: "0.29.7",
    license: "https://opensource.org/licenses/MIT",
    codeRepository: "https://github.com/kysely-org/kysely",
    programmingLanguage: "TypeScript",
    url: "https://kysely.dev",
  },
  prisma: {
    name: "Prisma ORM",
    softwareVersion: "8",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: "https://github.com/prisma/prisma",
    programmingLanguage: "TypeScript",
    url: "https://www.prisma.io/docs/orm",
  },
} as const;
