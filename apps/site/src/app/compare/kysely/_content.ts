export const KYSELY_PATH = "/compare/kysely";

export const KYSELY_TITLE = "Prisma ORM vs Kysely: contract-based ORM or SQL-first query builder?";

export const KYSELY_DESCRIPTION =
  "Prisma ORM 8 drives typed queries and migrations from one contract file. Kysely is a type-safe SQL query builder with no schema file. Which fits your project, with sourced figures.";

export const CHECKED = "October 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const KYSELY_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const KYSELY_UPDATED = { iso: "2026-10-17", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want models and relations in a contract file, `contract.prisma`.",
  "You want typed model queries and a SQL query builder from the same database client.",
  "You want `migration plan` to write a TypeScript migration from that contract. On PostgreSQL, `migration show` prints the SQL.",
  "You want `contract infer` to write the contract from PostgreSQL tables you already have.",
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
} as const;

export type CompareRow = {
  feature: string;
  kysely: string;
  prisma: string;
  /** Only for rows whose cells answer a plain yes or no. */
  marks?: { kysely: "yes" | "no"; prisma: "yes" | "no" };
};

/** Columns run Feature, Kysely, Prisma ORM: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Library price",
    kysely: "Free. MIT license.",
    prisma: "Free. Apache License 2.0.",
  },
  {
    feature: "Release status",
    kysely:
      "Version 0.29.7 on npm, so not yet a 1.0 release. The getting started guide requires TypeScript 5.4 or newer, and strict mode.",
    prisma:
      "Prisma ORM 8 is a release candidate, and it is what `npm install prisma` gives you. The final release is still to come.",
  },
  {
    feature: "Data model",
    kysely:
      "TypeScript interfaces you provide. A dialect also needs its driver, such as `pg` for PostgreSQL.",
    prisma:
      "A contract file, `contract.prisma`. `contract emit` writes the types. There is no `@prisma/client` package.",
  },
  {
    feature: "Queries",
    kysely: "A fluent SQL builder: `selectFrom`, `where`, and the other clauses in the guide.",
    prisma:
      "An ORM client for model queries, a SQL query builder on PostgreSQL and SQLite, and raw SQL for a statement neither API expresses.",
  },
  {
    feature: "Migrations",
    kysely:
      "up and down functions you write. Pending migrations run in alphanumeric order, with an option for unordered migrations.",
    prisma:
      "`migration plan` writes `migration.ts` from the contract. On PostgreSQL, `migration show` prints the SQL. `db migrate` runs `ops.json`, not the TypeScript file.",
  },
  {
    feature: "Databases",
    kysely:
      "Built-in dialects for PostgreSQL, MySQL, Microsoft SQL Server, SQLite, and PGlite. See [database support](#databases).",
    prisma:
      "PostgreSQL, MongoDB, and SQLite in Prisma ORM 8. The rest stay on Prisma ORM 7. See [database support](#databases).",
  },
  {
    feature: "Hosted database",
    kysely: "None. Kysely is a library.",
    marks: { kysely: "no", prisma: "yes" },
    prisma:
      "[Prisma Postgres](/docs/postgres) is a separate product. Any Postgres client works with it, so Prisma ORM is optional. [Prisma Compute](/docs/compute) is separate app hosting.",
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

/** One row per job; every Kysely cell names the API or tool its docs give for it. */
/** What each side costs. Figures checked against the pricing page and each license. */
export const PRICING: readonly { label: string; kysely: string; prisma: string }[] = [
  { label: "Library license and cost", kysely: "Free, MIT", prisma: "Free, Apache 2.0" },
  { label: "Paid plans", kysely: "None", prisma: "None for the ORM" },
  {
    label: "Hosted database",
    kysely: "None. You bring your own.",
    prisma:
      "[Prisma Postgres](/docs/postgres), optional. It works with any Postgres client, Kysely included.",
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
      "Nothing to generate if you write the interface by hand. Community generators such as kysely-codegen write it for you.",
    prisma: "`contract emit` writes the types from the contract.",
  },
  {
    task: "Read an existing database",
    kysely:
      "kysely-codegen connects to PostgreSQL, MySQL, SQLite, or SQL Server and writes the `Database` interface.",
    prisma: "`contract infer` inspects a live database and writes a starter `contract.prisma`.",
  },
  {
    task: "Write a migration",
    kysely:
      "`up` and `down` functions you write with `db.schema`. `kysely migrate make` from kysely-ctl creates the file.",
    prisma: "`migration plan` writes `migration.ts` from the contract.",
  },
  {
    task: "Preview SQL",
    kysely: "`.compile()` on a query returns its SQL and parameters without running it.",
    prisma:
      "`migration show` prints a migration's operations and statement preview, without connecting to the database.",
  },
  {
    task: "Run migrations",
    kysely:
      "`Migrator` from `kysely/migration`, with `migrateToLatest()`. kysely-ctl wraps it as `kysely migrate latest`.",
    prisma: "`db migrate` applies the pending migrations on disk.",
  },
];

export const KYSELY_FITS = [
  "You want queries written as SQL clauses, in the TypeScript you keep.",
  "Table types already live in TypeScript, and a contract file would describe the same tables again.",
  "Several people add migration files in parallel. Kysely runs them in alphanumeric order, and can allow unordered migrations.",
  "The database is MySQL, Microsoft SQL Server, or PGlite.",
];

export const PRISMA_FITS = [
  "One contract should drive model queries, the SQL query builder, and migrations.",
  "Related records should be part of the model API, as in `db.orm.public.User.include`.",
  "You already have PostgreSQL tables, and `contract infer` should write the contract from them.",
  "`migration plan` should write the migration from the contract without connecting to the database.",
];

export const APART = [
  {
    id: "one-contract",
    title: "One contract for queries and migrations",
    body: "You describe models in `contract.prisma`. `contract emit` writes the types, and `migration plan` writes a TypeScript migration from that contract. On PostgreSQL, `migration show` prints the SQL the migration will run.",
  },
  {
    id: "model-api",
    title: "A model API and a SQL query builder",
    body: "The ORM client answers model queries. The SQL query builder, on PostgreSQL and SQLite, takes joins and aggregates the client does not expose. Raw SQL covers a statement neither API expresses.",
  },
  {
    id: "contract-from-tables",
    title: "A contract from tables you already have",
    body: "`contract infer` reads a PostgreSQL database and writes `contract.prisma`. It does what `prisma db pull` did in Prisma ORM 7. The rows stay in the database.",
  },
  {
    id: "offline-migration-plan",
    title: "A migration plan that does not need the database",
    body: "`migration plan` reads the contract and writes the migration. Planning does not connect to a database, so it can run without database credentials. On PostgreSQL, `migration show` prints the SQL before anything runs.",
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
