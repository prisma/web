/**
 * All copy and structure for the /stack page lives here so the narrative can
 * be reviewed in one place. Every section states one idea; replaceability is
 * owned by `swapLayers`, deployment by `runtimeOutcomes`, and the data layer
 * by `dataOutcomes`, so no claim repeats across sections.
 */

export type StackLayerId = "compute" | "bun" | "orm" | "postgres";

export type StackLayer = {
  id: StackLayerId;
  name: string;
  /** Role eyebrow shown in the rail and the detail panel. */
  role: string;
  /** FontAwesome icon class for the rail node. */
  icon: string;
  /** Accent token family: teal for platform, indigo for the ORM. */
  accent: "ppg" | "orm";
  description: string;
  facts: string[];
  link: { href: string; label: string };
};

/** The four connected layers, ordered as a request travels through them. */
export const stackLayers: StackLayer[] = [
  {
    id: "compute",
    name: "Prisma Compute",
    role: "Hosting",
    icon: "fa-regular fa-microchip",
    accent: "ppg",
    description:
      "Serverless hosting for TypeScript applications, co-located with Prisma Postgres and currently in public beta. Deploy from one CLI command or a Git push.",
    facts: [
      "One-command deploys from your project directory",
      "Every Git branch can become a preview environment",
      "Runs any major framework, frontend or backend",
    ],
    link: { href: "/compute", label: "Explore Prisma Compute" },
  },
  {
    id: "bun",
    name: "Bun",
    role: "Runtime",
    icon: "fa-regular fa-bolt",
    accent: "ppg",
    description:
      "The runtime your application executes on, in development and in production. Bun runs TypeScript directly and ships the tooling most projects install separately.",
    facts: [
      "HTTP server, test runner, and bundler built in",
      "Runs TypeScript without a build step",
      "Package manager with a fast lockfile",
    ],
    link: { href: "https://bun.com", label: "Learn about Bun" },
  },
  {
    id: "orm",
    name: "Prisma ORM",
    role: "Data access",
    icon: "fa-regular fa-code",
    accent: "orm",
    description:
      "Prisma Next, the next major version of Prisma ORM, available in Early Access. Your schema generates a client with exact types, so every query is checked before it runs.",
    facts: [
      "Type-safe queries derived from one schema file",
      "Versioned migrations that ship in pull requests",
      "A SQL query builder for when you need full control",
    ],
    link: { href: "/docs/orm/next", label: "Explore Prisma Next" },
  },
  {
    id: "postgres",
    name: "Prisma Postgres",
    role: "Database",
    icon: "fa-regular fa-database",
    accent: "ppg",
    description:
      "A managed Postgres database provisioned together with your app. Common capabilities stay inside the database instead of becoming extra services.",
    facts: [
      "Standard Postgres, works with any Postgres client",
      "pgvector, full-text search, and pg_cron one command away",
      "Preview branches get their own database copy",
    ],
    link: { href: "/postgres", label: "Explore Prisma Postgres" },
  },
];

export type SwapLayer = {
  layer: string;
  defaultChoice: string;
  swap: string;
};

/** Section 4 owns the replaceability message; it appears nowhere else. */
export const swapLayers: SwapLayer[] = [
  {
    layer: "Hosting",
    defaultChoice: "Prisma Compute",
    swap: "Deploy the same app to Vercel, AWS, or your own servers.",
  },
  {
    layer: "Runtime",
    defaultChoice: "Bun",
    swap: "Your code is standard TypeScript. Run it on Node.js if you prefer.",
  },
  {
    layer: "Data access",
    defaultChoice: "Prisma Next",
    swap: "Drop to raw SQL with the built-in query builder, or use any Postgres client.",
  },
  {
    layer: "Database",
    defaultChoice: "Prisma Postgres",
    swap: "It speaks standard Postgres. Point the ORM at any Postgres database, anywhere.",
  },
];

export type Outcome = {
  icon: string;
  title: string;
  body: string;
};

/** Section 5: what Compute + Bun do for you, stated as outcomes. */
export const runtimeOutcomes: Outcome[] = [
  {
    icon: "fa-regular fa-terminal",
    title: "One command to production",
    body: "prisma app deploy builds your app, uploads it, and returns a production URL. The first deploy creates the project, the branch, and the database it runs on.",
  },
  {
    icon: "fa-regular fa-code-branch",
    title: "A preview per branch",
    body: "Deploy any Git branch and it gets its own app, URL, and database copy. Reviews happen against real infrastructure, not a shared staging server.",
  },
  {
    icon: "fa-regular fa-box-open",
    title: "Less tooling to maintain",
    body: "Bun's built-in server, test runner, and bundler replace the usual pile of dev dependencies. Fewer packages to install, patch, and configure.",
  },
  {
    icon: "fa-regular fa-window",
    title: "Bring any frontend",
    body: "Next.js, TanStack Start, Hono, Elysia, and more run unchanged. The stack has no opinion about your view layer, on purpose.",
  },
];

/** Section 6: what Postgres + Prisma Next provide together. */
export const dataOutcomes: Outcome[] = [
  {
    icon: "fa-regular fa-shield-check",
    title: "Queries that match your schema",
    body: "The client's types are generated from your schema. A mistyped field or a wrong filter is a compile error in your editor, not a 500 in production.",
  },
  {
    icon: "fa-regular fa-file-lines",
    title: "Migrations you can review",
    body: "Schema changes become versioned migration files that ship in pull requests and apply the same way in every environment.",
  },
  {
    icon: "fa-regular fa-cubes-stacked",
    title: "Capabilities without extra services",
    body: "pgvector for embeddings, full-text search, pg_cron for scheduled jobs. Features you would otherwise host separately live inside Postgres.",
  },
];

/** Postgres extensions surfaced in the data section. */
export const postgresExtensions: string[] = [
  "pgvector",
  "pg_search",
  "pg_cron",
  "pg_trgm",
  "pg_stat_statements",
];

/** Section 7: concrete reasons the stack suits agent-driven development. */
export const agentPoints: Outcome[] = [
  {
    icon: "fa-regular fa-folder-tree",
    title: "One project shape",
    body: "Every scaffold has the same layout: the schema in prisma/, the app in src/, the config in prisma.config.ts. An agent that knows one Prisma Stack project knows them all.",
  },
  {
    icon: "fa-regular fa-file-contract",
    title: "The schema is the contract",
    body: "The entire data model lives in one readable file. Agents can inspect it, propose a change as a diff, and regenerate the types to see what breaks.",
  },
  {
    icon: "fa-regular fa-rotate",
    title: "A typed feedback loop",
    body: "Because queries are type-checked, agents iterate against the compiler instead of discovering failures at runtime. Wrong code fails before it runs.",
  },
  {
    icon: "fa-regular fa-list-check",
    title: "Workflows in plain text",
    body: "Migrations are files, deploys are CLI commands with readable output. Every action an agent takes can be reviewed before it runs and audited after.",
  },
];
