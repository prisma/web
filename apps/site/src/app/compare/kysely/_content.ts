export const KYSELY_PATH = "/compare/kysely";

export const KYSELY_TITLE =
  "Prisma ORM vs Kysely: contract-based ORM or SQL-first query builder?";

export const KYSELY_DESCRIPTION =
  "Prisma ORM 8, a release candidate, uses a contract for typed queries and migrations. Kysely is a type-safe SQL query builder. Prisma makes Prisma ORM.";

export const CHECKED = "October 2026";

export const CHOOSE_PRISMA = [
  "You want models and relations in a contract file, contract.prisma.",
  "You want typed model queries and a SQL query builder from the same database client.",
  "You want migration plan to write a TypeScript migration from that contract. On PostgreSQL, migration show prints the SQL.",
  "You want contract infer to write the contract from PostgreSQL tables you already have.",
];

export const CHOOSE_KYSELY = [
  "You want the library itself to be the SQL query builder, with no contract file.",
  "You want table types as TypeScript interfaces, written by hand or produced by a generator.",
  "You want up and down migrations as TypeScript functions you write. An optional CLI lives in kysely-ctl.",
  "You need a built-in dialect for MySQL, Microsoft SQL Server, or PGlite, which Prisma ORM 8 does not ship.",
];

export type CompareRow = {
  feature: string;
  kysely: string;
  prisma: string;
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
    kysely: "A published library. The getting started guide requires TypeScript 5.4 or newer, and strict mode.",
    prisma:
      "Prisma ORM 8 is a release candidate, and it is what npm install prisma gives you. It is not a final release.",
  },
  {
    feature: "Data model",
    kysely: "TypeScript interfaces you provide. A dialect also needs its driver, such as pg for PostgreSQL.",
    prisma: "A contract file, contract.prisma. contract emit writes the types. There is no @prisma/client package.",
  },
  {
    feature: "Queries",
    kysely: "A fluent SQL builder: selectFrom, where, and the other clauses in the guide.",
    prisma:
      "An ORM client for model queries, a SQL query builder on PostgreSQL and SQLite, and raw SQL when those APIs stop short.",
  },
  {
    feature: "Migrations",
    kysely: "up and down functions you write. Pending migrations run in alphanumeric order, with an option for unordered migrations.",
    prisma:
      "migration plan writes migration.ts from the contract. On PostgreSQL, migration show prints the SQL. db migrate runs ops.json, not the TypeScript file.",
  },
  {
    feature: "Databases",
    kysely: "Built-in dialects for PostgreSQL, MySQL, Microsoft SQL Server, SQLite, and PGlite.",
    prisma:
      "PostgreSQL is a release candidate. MongoDB is early access. SQLite is experimental. MySQL, MariaDB, SQL Server, and CockroachDB stay on Prisma ORM 7.",
  },
  {
    feature: "Hosted database",
    kysely: "None. Kysely is a library.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is a separate product. Any Postgres client works with it, so Prisma ORM is optional. [Prisma Compute](/docs/compute) is separate app hosting.",
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
  "Related records should be part of the model API, as in db.orm.public.User.include.",
  "You already have PostgreSQL tables, and contract infer should write the contract from them.",
  "migration plan should write the migration from the contract without connecting to the database.",
];

export const APART = [
  {
    title: "One contract for queries and migrations",
    body: "You describe models in contract.prisma. contract emit writes the types, and migration plan writes a TypeScript migration from that contract. On PostgreSQL, migration show prints the SQL the migration will run.",
  },
  {
    title: "A model API and a SQL query builder",
    body: "The ORM client answers model queries. The SQL query builder, on PostgreSQL and SQLite, takes joins and aggregates the client does not expose. Raw SQL covers a statement neither API expresses.",
  },
  {
    title: "A contract from tables you already have",
    body: "contract infer reads a PostgreSQL database and writes contract.prisma. It does what prisma db pull did in Prisma ORM 7. The rows stay in the database.",
  },
  {
    title: "A migration plan that does not need the database",
    body: "migration plan reads the contract and writes the migration. Planning does not connect to a database, so it can run without database credentials. On PostgreSQL, migration show prints the SQL before anything runs.",
  },
];

export const WRONG_CHOICE = [
  "You want a SQL query builder and no contract file. Kysely takes a TypeScript Database interface, a dialect, and that dialect's driver.",
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
      "No. Prisma ORM 8 is a release candidate, and it is what npm install prisma gives you today. PostgreSQL is the release-candidate database. MongoDB is early access, and SQLite is experimental. Source: [Prisma ORM](/docs/orm) and [supported databases](/docs/orm/supported-databases), October 2026.",
  },
  {
    question: "Can I connect Kysely to Prisma Postgres?",
    answer:
      "Yes. Prisma Postgres is PostgreSQL, and Prisma ORM is optional. Pass the connection string to Kysely's PostgresDialect and the pg driver. The [Kysely quickstart](/docs/prisma-postgres/quickstart/kysely) shows the setup.",
  },
  {
    question: "Which TypeScript setup does Kysely require?",
    answer:
      "Kysely's getting started guide requires TypeScript 5.4 or newer, and strict mode in tsconfig.json. Source: [Kysely getting started](https://kysely.dev/docs/getting-started), October 2026.",
  },
];
