/**
 * The "How it works" walkthrough: six states of one developer journey, from
 * scaffold to a native Postgres capability. Each step pairs a code panel with
 * the rail nodes it touches, so the animation explains how a change moves
 * through the stack instead of just highlighting lines.
 */

/** Nodes on the rail, ordered as the developer journey flows. */
export const RAIL_NODES = [
  { id: "app", label: "Your application" },
  { id: "orm", label: "Prisma ORM" },
  { id: "postgres", label: "Prisma Postgres" },
  { id: "compute", label: "Prisma Compute + Bun" },
] as const;

export type RailNodeId = (typeof RAIL_NODES)[number]["id"];

export type JourneyStep = {
  /** Chip label in the stepper. */
  title: string;
  /** One-idea explanation shown under the code panel. */
  caption: string;
  lang: "bash" | "prisma" | "typescript" | "sql" | "text";
  code: string;
  /** Rail nodes involved in this step. */
  active: RailNodeId[];
  /** Animate a request pulse down the rail through the active nodes. */
  pulse?: boolean;
};

export const journeySteps: JourneyStep[] = [
  {
    title: "Scaffold",
    caption:
      "One command creates the application, provisions a Prisma Postgres database, sets up Prisma Next, and configures the project for Prisma Compute. Nothing to wire together by hand.",
    lang: "bash",
    code: `$ npm create prisma@next

✔ Framework · Hono
✔ ORM       · Prisma Next
✔ Database  · Prisma Postgres

Generating the typed client   ✓
Provisioning Prisma Postgres  ✓
Configuring Compute deploys   ✓

cd my-app && npm run dev`,
    active: ["app", "orm", "postgres", "compute"],
  },
  {
    title: "Project",
    caption:
      "The result is a plain TypeScript project. Two files matter: schema.prisma describes your data, and prisma.config.ts connects the database and the deploy target. Everything else is your application.",
    lang: "text",
    code: `my-app/
  prisma/
    schema.prisma       # your data model
    db.ts               # typed client, generated
  src/
    index.ts            # your application
  prisma.config.ts      # database + deploy config
  package.json`,
    active: ["app"],
  },
  {
    title: "Model",
    caption:
      "The schema is the contract. From these lines, Prisma Next generates a client whose types match your models exactly, migrations included. Change the schema and the types change with it.",
    lang: "prisma",
    code: `model User {
  id    String  @id @default(cuid(2))
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        String  @id @default(cuid(2))
  title     String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  String
}`,
    active: ["orm", "postgres"],
  },
  {
    title: "Query",
    caption:
      "Your app calls the typed client, Prisma ORM turns the call into SQL, and Prisma Postgres answers. The result arrives already typed: mistype a field and the compiler catches it before anything runs.",
    lang: "typescript",
    code: `import { db } from "./prisma/db";

const posts = await db.orm.public.Post
  .where({ published: true })
  .include("author")
  .all();

// typeof posts
// Array<Post & { author: User }>
//
// [{ id: "k9dq…", title: "Hello Prisma",
//    author: { name: "Ada", … } }]`,
    active: ["app", "orm", "postgres"],
    pulse: true,
  },
  {
    title: "Deploy",
    caption:
      "Deploying changes nothing about your data setup. The same schema, client, and connection carry from local development to Prisma Compute, and any Git branch can become its own preview app.",
    lang: "bash",
    code: `$ npx @prisma/cli app deploy

Building with Bun     ✓
Uploading             ✓
Promoting to production

https://my-app.prisma.build
→ same database, same client, no config changes`,
    active: ["app", "orm", "postgres", "compute"],
    pulse: true,
  },
  {
    title: "Extend",
    caption:
      "Need semantic search, full-text search, or scheduled jobs? Enable a Postgres extension. The capability lands inside the database you already run, instead of another service to deploy and pay for.",
    lang: "sql",
    code: `-- Semantic search without a separate vector database
CREATE EXTENSION vector;

ALTER TABLE "Post" ADD COLUMN embedding vector(1536);

SELECT id, title FROM "Post"
ORDER BY embedding <-> $1
LIMIT 5;`,
    active: ["postgres"],
  },
];
