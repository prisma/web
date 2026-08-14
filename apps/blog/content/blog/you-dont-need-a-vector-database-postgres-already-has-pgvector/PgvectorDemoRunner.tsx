import { highlight, type HighlightedCode } from "codehike/code";
import { PgvectorDemoRunnerClient, type RunnerStep } from "./PgvectorDemoRunnerClient";

type StepSource = Omit<RunnerStep, "code"> & { source: string; lang: string };

const STEPS: StepSource[] = [
  {
    title: "Spawn a database",
    filename: "terminal",
    lang: "bash",
    source: "npx create-db@latest --json",
    caption:
      "create-db spawns a temporary Prisma Postgres database, no account required. It is deleted after 24 hours unless you open the claim URL. Copy the connection string into .env.",
    output: [
      "{",
      '  "connectionString": "postgres://…@db.prisma.io:5432/postgres",',
      '  "claimUrl": "https://create-db.prisma.io/claim?projectID=…",',
      '  "deletionDate": "2026-07-11T15:41:11.653Z"',
      "}",
    ],
  },
  {
    title: "Declare the contract",
    filename: "src/prisma/contract.prisma",
    lang: "prisma",
    source: `// use prisma-next

types {
  Uuid = String @db.Uuid
  Vibe = pgvector.Vector(4)
}

model Movie {
  id        Uuid   @id @default(uuid())
  title     String
  embedding Vibe

  @@map("movie")
}`,
    caption:
      "The dimension is part of the type: Vibe = pgvector.Vector(4) makes every Movie.embedding a 4-dimensional vector, checked from schema to query.",
    output: ["", "# contract: movie table with a vector(4) embedding column"],
  },
  {
    title: "Wire the extension",
    filename: "prisma-next.config.ts",
    lang: "typescript",
    source: `import "dotenv/config";
import pgvector from "@prisma/orm-extension-pgvector/control";
import { defineConfig } from "@prisma/orm-postgres/config";

export default defineConfig({
  contract: "./src/prisma/contract.prisma",
  extensions: [pgvector],
  db: {
    connection: process.env.DATABASE_URL!,
  },
});`,
    caption:
      "One entry in extensions teaches the CLI, the migration engine, and the query builder what a vector is.",
    output: ["", "# extension packs: [pgvector]"],
  },
  {
    title: "Migrate",
    filename: "terminal",
    lang: "bash",
    source: `bunx @prisma/cli@next contract emit
bunx @prisma/cli@next migration plan
bunx @prisma/cli@next db init`,
    caption:
      "migration plan copies the pgvector pack's own baseline migration into your repo; db init applies both spaces. You never run CREATE EXTENSION by hand.",
    output: [
      "",
      "Planned 1 operation(s); materialised 1 extension-space migration",
      "Applied 2 operation(s) across 2 space(s), database signed",
      "   pgvector space: CREATE EXTENSION IF NOT EXISTS vector",
      "   app space:      CREATE TABLE movie (…, embedding vector(4))",
    ],
  },
  {
    title: "Insert + search",
    filename: "index.ts",
    lang: "typescript",
    source: `const db = postgres<Contract>({
  contractJson,
  extensions: [pgvector],
});

// six movies scored on [action, romance, comedy, scifi]
const movies = [
  { title: "Alien", embedding: [0.6, 0.05, 0.02, 0.95] },
  { title: "The Terminator", embedding: [0.9, 0.15, 0.05, 0.85] },
  // ...
];

const runtime = await db.connect({ url: process.env.DATABASE_URL! });
await runtime.execute(db.sql.public.movie.insert(movies).build());

// "an action-heavy sci-fi movie"
const query = [0.9, 0.1, 0.05, 0.9];

const plan = db.sql.public.movie
  .select("title")
  .select("similarity", (f, fns) =>
    fns.cosineSimilarity(f.embedding, query))
  .orderBy((f, fns) => fns.cosineDistance(f.embedding, query), {
    direction: "asc",
  })
  .limit(3)
  .build();

const rows = await runtime.execute(plan);`,
    caption:
      "cosineSimilarity and cosineDistance are typed methods on the vector column. They render to pgvector's <=> operator, with the query vector as a parameter.",
    output: ["", "Inserted 6 movies."],
  },
  {
    title: "Results",
    filename: "terminal",
    lang: "bash",
    source: "bun index.ts",
    caption:
      "The action-heavy sci-fi movies win, the romantic comedies are nowhere in sight, and row.similarity is a number, not an any.",
    output: [
      "",
      "Closest matches for [action: 0.9, scifi: 0.9]:",
      "  The Terminator       similarity 0.999",
      "  Alien                similarity 0.975",
      "  Mad Max: Fury Road   similarity 0.972",
    ],
  },
];

export async function PgvectorDemoRunner() {
  const steps: RunnerStep[] = await Promise.all(
    STEPS.map(async ({ source, lang, ...step }) => ({
      ...step,
      code: (await highlight(
        { value: source, lang, meta: "" },
        "github-from-css",
      )) as HighlightedCode,
    })),
  );
  return <PgvectorDemoRunnerClient steps={steps} />;
}
