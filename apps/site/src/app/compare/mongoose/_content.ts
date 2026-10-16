export const MONGOOSE_PATH = "/compare/mongoose";

export const MONGOOSE_TITLE = "Prisma ORM vs Mongoose: type-safe data modeling beyond MongoDB";

export const MONGOOSE_DESCRIPTION =
  "Prisma ORM drives typed queries and migrations from one contract file, on PostgreSQL and MongoDB. Mongoose models MongoDB documents in application code. Which fits, with sourced figures.";

export const CHECKED = "October 2026";

export const CHOOSE_PRISMA = [
  "You want models in a contract file, contract.prisma, for PostgreSQL or for MongoDB.",
  "You want contract emit to write the query types. Prisma ORM 8 does not use the @prisma/client package. That package is Prisma ORM 7.",
  "You want migration plan to write migration.ts from that contract. db migrate runs ops.json.",
  "On PostgreSQL, you want the query to select parent records by their related records.",
];

export const CHOOSE_MONGOOSE = [
  "The application talks to MongoDB, and the schema sits next to the model in application code.",
  "You want populate() to replace stored ids with documents from another collection.",
  "You want pre and post hooks on documents, queries, aggregates, and models.",
  "You want MongoDB query operators in find(), as the getting started guide shows.",
];

export type CompareRow = {
  feature: string;
  mongoose: string;
  prisma: string;
};

/** Columns run Feature, Mongoose, Prisma ORM: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Library price",
    mongoose: "Free. MIT license.",
    prisma: "Free. Apache License 2.0.",
  },
  {
    feature: "Release status",
    mongoose:
      "The getting started guide is Mongoose v9.11.2. Mongoose 9.0.0 shipped on 21 November 2025.",
    prisma:
      "Prisma ORM 8 is a release candidate, and it is what npm install prisma gives you. The final release is still to come. PostgreSQL is the release-candidate database. MongoDB is early access.",
  },
  {
    feature: "Data model",
    mongoose: "A Schema and a Model in application code. mongoose.model compiles the schema.",
    prisma:
      "A contract file, contract.prisma. On MongoDB you write that file yourself: contract infer does not read a MongoDB database. contract emit writes the types.",
  },
  {
    feature: "Queries",
    mongoose: "Model.find() and the other query helpers, with MongoDB query operators.",
    prisma:
      "An ORM client, db.orm.<collection>. On MongoDB, a pipeline builder for aggregation, and raw commands for anything the two APIs do not cover.",
  },
  {
    feature: "Related documents",
    mongoose:
      "populate() loads related documents in a separate query. match filters which of those documents are attached, and the parent stays in the result. populate() cannot filter parents by a field on the related document.",
    prisma:
      "On MongoDB, include() loads a reference declared with @relation, and it takes the relation name only. An array of ids stored on the parent has no include() equivalent yet. Relation filters are not available on MongoDB. On PostgreSQL, where can use some, none, and every.",
  },
  {
    feature: "Pagination",
    mongoose:
      "skip and limit on queries. Pair skip with sort: without a sort, MongoDB does not promise the order skip counts from.",
    prisma:
      "limit and offset on MongoDB and on PostgreSQL. cursor follows orderBy and is PostgreSQL only. On MongoDB, page with limit and offset.",
  },
  {
    feature: "Middleware",
    mongoose: "pre and post hooks. Four kinds: document, model, aggregate, and query middleware.",
    prisma:
      "Middleware runs on MongoDB, except beforeCompile, which exists on PostgreSQL. The cache middleware runs on both databases.",
  },
  {
    feature: "Migrations",
    mongoose: "The getting started guide has no migration command.",
    prisma:
      "migration plan writes migration.ts from the contract. Planning does not connect to a database. db migrate runs ops.json, not the TypeScript file.",
  },
  {
    feature: "Databases",
    mongoose: "MongoDB. The README describes Mongoose as a MongoDB object modeling tool.",
    prisma:
      "PostgreSQL is a release candidate. MongoDB is early access. SQLite is experimental. MySQL, MariaDB, SQL Server, and CockroachDB stay on Prisma ORM 7.",
  },
  {
    feature: "Hosted database",
    mongoose: "None. Mongoose is a library. You bring MongoDB.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is a separate product. Any Postgres client works with it, so Prisma ORM is optional. [Prisma Compute](/docs/compute) is separate app hosting. Mongoose connects to MongoDB, so it does not connect to Prisma Postgres.",
  },
];

export const MONGOOSE_FITS = [
  "Schemas, document methods, and validators live in the application, next to the model.",
  "populate() should load a referenced document, and match should narrow which related documents come back.",
  "pre and post hooks should run around save, find, and aggregate.",
  "The database is MongoDB, and find() should take MongoDB query operators.",
];

export const PRISMA_FITS = [
  "One contract should describe the collections or the tables, and contract emit should write the types.",
  "The application also ships on PostgreSQL, where the release candidate includes the ORM client, a SQL query builder, and relation filters.",
  "migration plan should write the migration from the contract, including on MongoDB.",
  "A referenced document declared with @relation should load with include().",
];

export const APART = [
  {
    title: "A contract for PostgreSQL and MongoDB",
    body: "Models live in contract.prisma. PostgreSQL, including Prisma Postgres, is the release-candidate database. MongoDB is an early-access library, @prisma/orm-mongo. SQLite is experimental.",
  },
  {
    title: "Types from the contract",
    body: "contract emit writes the types your queries use. Prisma ORM 8 does not use the @prisma/client package. That package is Prisma ORM 7. On MongoDB the field you query is the stored name, so a field mapped to _id is _id in TypeScript.",
  },
  {
    title: "Migrations from the contract",
    body: "migration plan reads the contract and writes migration.ts. Planning does not connect to a database. On MongoDB the quickstart applies that plan with db migrate, which runs ops.json.",
  },
  {
    title: "Relation filters on PostgreSQL",
    body: "On PostgreSQL, where can select parent rows with some, none, and every. On MongoDB those filters are absent. You query the child collection and include the parent.",
  },
];

export const WRONG_CHOICE = [
  "You want document and query middleware, and multi-document transactions, from a MongoDB library that is already a stable release. Prisma ORM 8's MongoDB library is early access. db.transaction() is absent on the MongoDB client. Multi-document writes go through the MongoDB driver. See [transactions](/docs/orm/fundamentals/transactions).",
  "You store arrays of related ids and load them with populate(). The [migrate from Mongoose](/docs/guides/switch-to-prisma-orm/from-mongoose) guide says that shape has no include() equivalent yet, and shows lookup in the pipeline builder instead.",
  "You need MySQL, MariaDB, SQL Server, or CockroachDB from the current Prisma ORM 8 packages. Those databases are absent from ORM 8. [Prisma ORM 7](/docs/orm/v7) still supports them. Mongoose speaks MongoDB. See [supported databases](/docs/orm/supported-databases).",
  "You want cursor pagination on MongoDB. cursor is PostgreSQL only. On MongoDB, page with limit and offset. See [reading data](/docs/orm/fundamentals/reading-data).",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Is Mongoose an ORM?",
    answer:
      "Mongoose is a MongoDB object modeling tool. The getting started guide builds a Schema, compiles it with mongoose.model, and queries with find(). It does not generate a client from a separate contract file. Source: [Mongoose README](https://github.com/Automattic/mongoose/blob/master/README.md) and [getting started](https://mongoosejs.com/docs/), October 2026.",
  },
  {
    question: "Is Prisma ORM 8 a final release?",
    answer:
      "No. Prisma ORM 8 is a release candidate, and it is what npm install prisma gives you today. PostgreSQL is the release-candidate database. MongoDB is early access, and SQLite is experimental. Source: [Prisma ORM](/docs/orm) and [supported databases](/docs/orm/supported-databases), October 2026.",
  },
  {
    question: "Can Prisma ORM and Mongoose use the same MongoDB database?",
    answer:
      "Yes. The migrate guide adds Prisma ORM beside Mongoose and reads the same collections. You write contract.prisma for the collections you query through Prisma ORM. contract infer does not read MongoDB. The documents stay where they are. Source: [migrate from Mongoose](/docs/guides/switch-to-prisma-orm/from-mongoose), October 2026.",
  },
  {
    question: "Does Mongoose work with Prisma Postgres?",
    answer:
      "Mongoose connects to MongoDB. Prisma Postgres is PostgreSQL, and Prisma ORM is optional with it: a Postgres client uses the connection string. Mongoose is not a Postgres client. Source: [Mongoose getting started](https://mongoosejs.com/docs/) and [Prisma Postgres](/docs/postgres), October 2026.",
  },
];
