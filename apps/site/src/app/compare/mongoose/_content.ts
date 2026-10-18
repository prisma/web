export const MONGOOSE_PATH = "/compare/mongoose";

export const MONGOOSE_TITLE =
  "Prisma ORM vs Mongoose: contract file or schema in application code?";

export const MONGOOSE_DESCRIPTION =
  "Prisma ORM 8 drives typed queries and migrations from a contract file. Mongoose models MongoDB documents in application code. Checked October 2026.";

export const CHECKED = "October 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const MONGOOSE_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const MONGOOSE_PUBLISHED = { iso: "2026-10-16", label: "October 2026" } as const;
export const MONGOOSE_UPDATED = { iso: "2026-10-18", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want models in a contract file, `contract.prisma` — a contract is the file that describes your collections or tables.",
  "You want `contract emit` to write the query types. Prisma ORM 8 does not use the `@prisma/client` package. That package is Prisma ORM 7.",
  "You want `migration plan` to write `migration.ts` from that contract. `db migrate` runs `ops.json`.",
  "You also ship on PostgreSQL, where the release candidate includes the ORM client, a SQL query builder, and relation filters.",
];

export const CHOOSE_MONGOOSE = [
  "You want the schema next to the model in application code, compiled with `mongoose.model`.",
  "You want `populate()` to replace a stored id with a document from another collection.",
  "You want pre and post hooks on documents, queries, aggregates, and models.",
  "The database is MongoDB, and `find()` should take MongoDB query operators.",
];

/** Published posts with their authors, read from the same MongoDB `posts` and `users` collections. */
export const SAME_QUERY = {
  mongoose: `import { Post } from "./models/post";

const posts = await Post.find({ published: true })
  .populate("author");`,
  prisma: `import { db } from "./src/prisma/db";

const posts = await db.orm.posts
  .where({ published: true })
  .include("author")
  .all();`,
  /**
   * Representative MongoDB commands both snippets send for that query. Labelled
   * because they were not captured from a live run against one database.
   */
  mongo: `// Representative commands matching both snippets above, not captured from a live run.

// Mongoose populate: a find, then a second find for the authors
db.posts.find({ published: true })
db.users.find({ _id: { $in: [...] } })

// Prisma ORM include: the same two-query pattern
db.posts.find({ published: true })
db.users.find({ _id: { $in: [...] } })`,
} as const;

/** Shared hover groups across the three same-query tabs (0-based Shiki line indexes). */
export const SAME_QUERY_LINE_GROUPS: readonly {
  id: string;
  mongoose: readonly number[];
  prisma: readonly number[];
  mongo: readonly number[];
}[] = [
  { id: "author", mongoose: [3], prisma: [4], mongo: [4, 8] },
  { id: "published", mongoose: [2], prisma: [3], mongo: [3, 7] },
];

export type CompareRow = {
  feature: string;
  mongoose: string;
  prisma: string;
  sources: { mongoose: string; prisma: string };
};

/** Columns run Feature, Mongoose, Prisma ORM: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Library price",
    mongoose: "Free. MIT license.",
    prisma: "Free. Apache License 2.0.",
    sources: {
      mongoose: "https://github.com/Automattic/mongoose/blob/master/LICENSE.md",
      prisma: "https://github.com/prisma/prisma/blob/main/LICENSE",
    },
  },
  {
    feature: "Release status",
    mongoose:
      "Version 9.11.2 on npm. Mongoose 9.0.0 shipped on 21 November 2025. The getting started guide is this 9.x line.",
    prisma:
      "Prisma ORM 8 is a release candidate, and it is what `npm install prisma` gives you. The final release is still to come. PostgreSQL is the release-candidate database. MongoDB is early access.",
    sources: {
      mongoose: "https://www.npmjs.com/package/mongoose",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "Data model",
    mongoose: "A Schema and a Model in application code. `mongoose.model` compiles the schema.",
    prisma:
      "A contract file, `contract.prisma`. On MongoDB you write that file yourself: `contract infer` does not read a MongoDB database. `contract emit` writes the types. There is no `@prisma/client` package.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/",
      prisma: "https://www.prisma.io/docs/guides/switch-to-prisma-orm/from-mongoose",
    },
  },
  {
    feature: "Queries",
    mongoose: "`Model.find()` and the other query helpers, with MongoDB query operators.",
    prisma:
      "An ORM client, `db.orm.<collection>`, addressed by the storage name (`db.orm.posts`, not `db.orm.Post`). A pipeline builder for aggregation, and raw commands for anything the two APIs do not cover.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/",
      prisma: "https://www.prisma.io/docs/guides/switch-to-prisma-orm/from-mongoose",
    },
  },
  {
    feature: "Related documents",
    mongoose:
      "`populate()` loads related documents in a separate query. `match` filters which of those documents are attached, and the parent stays in the result. `populate()` cannot filter parents by a field on the related document.",
    prisma:
      "On MongoDB, `include()` loads a reference declared with `@relation`, and it takes the relation name only. An array of ids stored on the parent has no `include()` equivalent yet; the migrate guide uses `lookup` in the pipeline builder. Relation filters are not available on MongoDB. On PostgreSQL, `where` can use `some`, `none`, and `every`.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/populate.html",
      prisma: "https://www.prisma.io/docs/guides/switch-to-prisma-orm/from-mongoose",
    },
  },
  {
    feature: "Middleware",
    mongoose: "pre and post hooks. Four kinds: document, model, aggregate, and query middleware.",
    prisma:
      "Middleware runs on MongoDB, except `beforeCompile`, which exists on PostgreSQL. The cache middleware runs on both databases.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/middleware.html",
      prisma: "https://www.prisma.io/docs/orm/supported-databases",
    },
  },
  {
    feature: "Migrations",
    mongoose: "The getting started guide has no migration command.",
    prisma:
      "`migration plan` writes `migration.ts` from the contract. Planning does not connect to a database. `db migrate` runs `ops.json`, not the TypeScript file.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "Databases",
    mongoose: "MongoDB. The README describes Mongoose as a MongoDB object modeling tool.",
    prisma:
      "PostgreSQL is a release candidate. MongoDB is early access. SQLite is experimental. MySQL, MariaDB, SQL Server, and CockroachDB stay on Prisma ORM 7. See [database support](#databases).",
    sources: {
      mongoose: "https://github.com/Automattic/mongoose/blob/master/README.md",
      prisma: "https://www.prisma.io/docs/orm/supported-databases",
    },
  },
  {
    feature: "Hosted database",
    mongoose: "None. Mongoose is a library. You bring MongoDB.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is a separate product. Any Postgres client works with it, so Prisma ORM is optional. Mongoose connects to MongoDB, so it does not connect to Prisma Postgres. [Prisma Compute](/docs/compute) is separate app hosting.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
];

export type DatabaseStatus =
  | "Supported"
  | "Release candidate"
  | "Early access"
  | "Experimental"
  | "ORM 7 only"
  | "Use 6.19"
  | null;

export const FULL_SUPPORT: readonly DatabaseStatus[] = ["Supported", "Release candidate"];

export const DATABASE_SOURCES = {
  mongoose: "https://github.com/Automattic/mongoose/blob/master/README.md",
  orm8: "https://www.prisma.io/docs/orm/supported-databases",
  orm7: "https://www.prisma.io/docs/orm/v7/reference/supported-databases",
  orm7Mongo: "https://www.prisma.io/docs/guides/v7/switch-to-prisma-orm/from-mongoose",
} as const;

export const DATABASE_MATRIX: readonly {
  database: string;
  mongoose: DatabaseStatus;
  orm8: DatabaseStatus;
  orm7: DatabaseStatus;
}[] = [
  { database: "MongoDB", mongoose: "Supported", orm8: "Early access", orm7: "Use 6.19" },
  { database: "PostgreSQL", mongoose: null, orm8: "Release candidate", orm7: "Supported" },
  { database: "MySQL", mongoose: null, orm8: "ORM 7 only", orm7: "Supported" },
  { database: "MariaDB", mongoose: null, orm8: "ORM 7 only", orm7: "Supported" },
  { database: "Microsoft SQL Server", mongoose: null, orm8: "ORM 7 only", orm7: "Supported" },
  { database: "SQLite", mongoose: null, orm8: "Experimental", orm7: "Supported" },
  { database: "CockroachDB", mongoose: null, orm8: "ORM 7 only", orm7: "Supported" },
];

export const PRICING: readonly {
  label: string;
  mongoose: string;
  prisma: string;
  sources: { mongoose: string; prisma: string };
}[] = [
  {
    label: "Library license and cost",
    mongoose: "Free, MIT",
    prisma: "Free, Apache 2.0",
    sources: {
      mongoose: "https://github.com/Automattic/mongoose/blob/master/LICENSE.md",
      prisma: "https://github.com/prisma/prisma/blob/main/LICENSE",
    },
  },
  {
    label: "Paid plans",
    mongoose: "None",
    prisma: "None for the ORM",
    sources: {
      mongoose: "https://mongoosejs.com/docs/",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    label: "Hosted database",
    mongoose: "None. You bring MongoDB.",
    prisma:
      "[Prisma Postgres](/docs/postgres), optional. It is PostgreSQL, so Mongoose does not connect to it.",
    sources: {
      mongoose: "https://mongoosejs.com/docs/",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const SAME_JOB: readonly { task: string; mongoose: string; prisma: string }[] = [
  {
    task: "Define collections",
    mongoose: "A `Schema` compiled with `mongoose.model`.",
    prisma: "Models in `contract.prisma`, with `@@map` for the collection name.",
  },
  {
    task: "Generate types",
    mongoose: "TypeScript types you write, or types inferred from the schema in application code.",
    prisma: "`contract emit` writes the types from the contract.",
  },
  {
    task: "Read an existing database",
    mongoose: "The schemas in the app are the source of truth. MongoDB has no schema to infer.",
    prisma:
      "`contract infer` does not read MongoDB. You write `contract.prisma` from the Mongoose schemas.",
  },
  {
    task: "Write a migration",
    mongoose: "The getting started guide has no migration command. You change documents in code.",
    prisma: "`migration plan` writes `migration.ts` from the contract.",
  },
  {
    task: "Load a related document",
    mongoose: "`populate()` on a stored id. `match` can narrow which related documents come back.",
    prisma:
      "`include()` on a single `@relation`. An array of ids has no `include()` equivalent yet; use `lookup` in the pipeline builder.",
  },
  {
    task: "Run middleware",
    mongoose: "pre and post hooks on documents, queries, aggregates, and models.",
    prisma: "Middleware on MongoDB, except `beforeCompile`. The cache middleware runs on MongoDB.",
  },
  {
    task: "Apply schema changes",
    mongoose: "You update documents yourself. There is no Mongoose migrate command in the guide.",
    prisma: "`db migrate` applies the pending migrations on disk.",
  },
];

export const APART = [
  {
    id: "postgres-too",
    title: "The same ORM client on PostgreSQL",
    body: "Mongoose speaks MongoDB. Prisma ORM 8's PostgreSQL library is a release candidate: the ORM client, a SQL query builder, and relation filters (`some`, `none`, `every`) that the MongoDB client does not have.",
  },
  {
    id: "offline-migration-plan",
    title: "A migration plan that does not need the database",
    body: "`migration plan` reads the contract and writes the migration. Planning does not connect to a database, so it can run without database credentials.",
  },
];

export const WRONG_CHOICE = [
  "You want document and query middleware, and `populate()` on arrays of stored ids, from a MongoDB library that is already a stable release. Prisma ORM 8's MongoDB library is early access. An array of ids has no `include()` equivalent yet. See [migrate from Mongoose](/docs/guides/switch-to-prisma-orm/from-mongoose).",
  "You want multi-document transactions on MongoDB. `db.transaction()` is absent on the MongoDB client. Multi-document writes go through the MongoDB driver. See [supported databases](/docs/orm/supported-databases).",
  "You need MySQL, MariaDB, SQL Server, or CockroachDB from the current Prisma ORM 8 packages. Those databases are absent from ORM 8. [Prisma ORM 7](/docs/orm/v7) still supports them. Mongoose speaks MongoDB. See [supported databases](/docs/orm/supported-databases).",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Is Mongoose an ORM?",
    answer:
      "Mongoose is a MongoDB object modeling tool. The getting started guide builds a Schema, compiles it with `mongoose.model`, and queries with `find()`. It does not generate a client from a separate contract file. Source: [Mongoose README](https://github.com/Automattic/mongoose/blob/master/README.md) and [getting started](https://mongoosejs.com/docs/), October 2026.",
  },
  {
    question: "Is Prisma ORM 8 a final release?",
    answer:
      "No. Prisma ORM 8 is a release candidate, and it is what `npm install prisma` gives you today. PostgreSQL is the release-candidate database. MongoDB is early access, and SQLite is experimental. Source: [Prisma ORM](/docs/orm) and [supported databases](/docs/orm/supported-databases), October 2026.",
  },
  {
    question: "Can Prisma ORM and Mongoose use the same MongoDB database?",
    answer:
      "Yes. The migrate guide adds Prisma ORM beside Mongoose and reads the same collections. You write `contract.prisma` for the collections you query through Prisma ORM. `contract infer` does not read MongoDB. The documents stay where they are. Source: [migrate from Mongoose](/docs/guides/switch-to-prisma-orm/from-mongoose), October 2026.",
  },
  {
    question: "Does Mongoose work with Prisma Postgres?",
    answer:
      "Mongoose connects to MongoDB. Prisma Postgres is PostgreSQL, and Prisma ORM is optional with it: a Postgres client uses the connection string. Mongoose is not a Postgres client. Source: [Mongoose getting started](https://mongoosejs.com/docs/) and [Prisma Postgres](/docs/postgres), October 2026.",
  },
];

/** Representative Mongoose models for the User and Post collections in the same-query example. */
export const SWITCH_MONGOOSE_SCHEMA = `import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
});

export const User = model("User", userSchema);

const postSchema = new Schema({
  title: { type: String, required: true },
  published: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Post = model("Post", postSchema);`;

/**
 * Representative `contract.prisma` matching those collections, in the shape
 * the migrate-from-Mongoose guide writes (`// use prisma-8`, ObjectId, @@map).
 */
export const SWITCH_PRISMA_CONTRACT = `// use prisma-8

model User {
  id    ObjectId @id @map("_id")
  email String   @unique
  name  String?
  posts Post[]
  @@map("users")
}

model Post {
  id        ObjectId @id @map("_id")
  title     String
  published Bool
  author    User     @relation(fields: [authorId], references: [id])
  authorId  ObjectId @map("author")
  @@map("posts")
}`;

/** Commands from the Prisma ORM 8 migrate-from-Mongoose guide. */
export const SWITCH_COMMANDS = `npx prisma@latest orm init --target mongodb
npx prisma contract emit`;

export const TOOLS = {
  mongoose: {
    name: "Mongoose",
    softwareVersion: "9.11.2",
    license: "https://opensource.org/licenses/MIT",
    codeRepository: "https://github.com/Automattic/mongoose",
    programmingLanguage: "TypeScript",
    url: "https://mongoosejs.com",
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
