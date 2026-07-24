/**
 * All copy and structure for the /stack page lives here so the narrative can
 * be reviewed in one place. Every section states one idea; replaceability is
 * owned by `swapLayers`, deployment by `runtimeOutcomes`, and the data layer
 * by `dataOutcomes`, so no claim repeats across sections.
 */

export type StackLayerId = "app" | "compute" | "bun" | "orm" | "postgres";

export type Framework = {
  name: string;
  /** Real logo from /public/icons/technologies, shown on a white tile. */
  logo: string;
};

/** Frameworks Prisma Compute runs, cycled in the pyramid's top layer. */
export const frameworks: Framework[] = [
  { name: "Next.js", logo: "/icons/technologies/next.svg" },
  { name: "React Router", logo: "/icons/technologies/rr7.svg" },
  { name: "TanStack Start", logo: "/icons/technologies/tanstack.svg" },
  { name: "Astro", logo: "/icons/technologies/astro.svg" },
  { name: "SvelteKit", logo: "/icons/technologies/svelte.svg" },
  { name: "Nuxt", logo: "/icons/technologies/nuxt.svg" },
  { name: "Hono", logo: "/icons/technologies/hono.svg" },
  { name: "NestJS", logo: "/icons/technologies/nest.svg" },
  { name: "SolidStart", logo: "/icons/technologies/solid-start.svg" },
  { name: "React", logo: "/icons/technologies/react.svg" },
];

export type BunApi = {
  api: string;
  role: string;
};

/** Bun capabilities that ship with Prisma Compute, shown in the Bun panel. */
export const bunApis: BunApi[] = [
  { api: "Bun.serve()", role: "HTTP + WebSocket server" },
  { api: "bun test", role: "Jest-compatible tests" },
  { api: "Bun bundler", role: "bundle without config" },
  { api: "Bun.password", role: "Argon2 / bcrypt hashing" },
  { api: "Bun.s3", role: "object storage client" },
  { api: "Bun.redis", role: "cache client" },
  { api: "Bun.file", role: "fast file I/O" },
  { api: "TS + JSX", role: "runs without a build step" },
];

export type StackLayer = {
  id: StackLayerId;
  name: string;
  /** Role eyebrow shown in the pyramid layer and the detail panel. */
  role: string;
  /** One-line subtitle shown inside the pyramid layer. */
  sub: string;
  /** FontAwesome icon class for the layer node. */
  icon: string;
  /** Accent token family: violet for your code, teal for platform, indigo for the ORM. */
  accent: "ppg" | "orm" | "violet";
  description: string;
  facts: string[];
  /** Optional chip strip rendered in the detail panel. */
  chips?: { label: string; items: string[] };
  link: { href: string; label: string };
};

/**
 * The pyramid, top to bottom: your code on top, then the runtime that runs
 * it, the data flow (ORM, then Postgres), and Prisma Compute hosting it all
 * as the foundation. Every layer is inspectable without losing the whole.
 */
export const stackLayers: StackLayer[] = [
  {
    id: "app",
    name: "Your application",
    role: "Any framework",
    sub: "fully open",
    icon: "fa-regular fa-laptop",
    accent: "violet",
    description:
      "The one layer Prisma has no opinion about, on purpose. Every major frontend and backend framework runs on the stack unchanged, with the same runtime, database, and deploy underneath.",
    facts: [
      "Next.js, TanStack Start, Hono, NestJS, and more",
      "Change framework without touching the data layer",
      "Plain TypeScript projects, no proprietary app model",
    ],
    link: { href: "/docs/next", label: "See the framework guides" },
  },
  {
    id: "bun",
    name: "Bun",
    role: "Runtime",
    sub: "serve · test · build",
    icon: "fa-regular fa-bolt",
    accent: "ppg",
    description:
      "The runtime your application executes on, in development and in production. Batteries included: the tooling most projects assemble from a dozen packages is built in.",
    facts: [
      "HTTP server, test runner, and bundler built in",
      "Runs TypeScript directly, no build step",
      "Package manager with a fast lockfile",
    ],
    chips: {
      label: "Built into the runtime",
      items: [
        "Bun.serve()",
        "bun test",
        "Bun bundler",
        "Bun.password",
        "Bun.s3",
        "Bun.redis",
        "Bun.file",
        "TS + JSX",
      ],
    },
    link: { href: "https://bun.com", label: "Learn about Bun" },
  },
  {
    id: "orm",
    name: "Prisma ORM",
    role: "Data access",
    sub: "types · migrations",
    icon: "fa-regular fa-code",
    accent: "orm",
    description:
      "Prisma Next, the next major version of Prisma ORM, available in Early Access. Your schema generates a client with exact types, so every query is checked before it runs.",
    facts: [
      "Type-safe queries derived from one schema file",
      "Versioned migrations that ship in pull requests",
      "Guardrails that keep agents from unsafe writes",
      "A SQL query builder for when you need full control",
    ],
    link: { href: "/docs/orm/next", label: "Explore Prisma Next" },
  },
  {
    id: "postgres",
    name: "Prisma Postgres",
    role: "Database",
    sub: "managed database",
    icon: "fa-regular fa-database",
    accent: "ppg",
    description:
      "A managed Postgres database provisioned together with your app. Common capabilities stay inside the database instead of becoming extra services to run and pay for.",
    facts: [
      "Standard Postgres, works with any Postgres client",
      "Extensions enabled with one command",
      "Preview branches get their own database copy",
    ],
    chips: {
      label: "Extensions one command away",
      items: ["pgvector", "pg_search", "pg_cron", "pg_trgm", "pg_stat_statements", "uuid-ossp"],
    },
    link: { href: "/postgres", label: "Explore Prisma Postgres" },
  },
  {
    id: "compute",
    name: "Prisma Compute",
    role: "Hosting",
    sub: "hosts everything",
    icon: "fa-regular fa-microchip",
    accent: "ppg",
    description:
      "Serverless hosting for TypeScript applications, currently in public beta. Deploy from one CLI command or a Git push; your app runs right next to its database.",
    facts: [
      "One-command deploys from your project directory",
      "Every Git branch can become a preview environment",
      "Co-located with Prisma Postgres for sub-ms queries",
    ],
    link: { href: "/compute", label: "Explore Prisma Compute" },
  },
];

export type SwapLayer = {
  layer: string;
  defaultChoice: string;
  /** Logo of the default product, shown on a white tile. */
  logo: string;
  /** Invert the logo (white-on-transparent marks) so it reads on white. */
  invertLogo?: boolean;
  swap: string;
  /** Real logos of what you can swap to. */
  swapTargets: { src: string; alt: string; invert?: boolean }[];
};

/** Section 4 owns the replaceability message; it appears nowhere else. */
export const swapLayers: SwapLayer[] = [
  {
    layer: "Data access",
    defaultChoice: "Prisma Next",
    logo: "/icons/technologies/prisma_light.svg",
    swap: "Drop to raw SQL with the built-in query builder, or use any Postgres client.",
    swapTargets: [{ src: "/icons/technologies/postgresql.svg", alt: "Any Postgres client" }],
  },
  {
    layer: "Database",
    defaultChoice: "Prisma Postgres",
    logo: "/icons/technologies/prisma-postgres.svg",
    swap: "It speaks standard Postgres. Point the ORM at any Postgres database, anywhere.",
    swapTargets: [{ src: "/icons/technologies/postgresql.svg", alt: "Any PostgreSQL database" }],
  },
  {
    layer: "Hosting",
    defaultChoice: "Prisma Compute",
    logo: "/icons/technologies/prisma_light.svg",
    swap: "Deploy the same app to Vercel, AWS, or your own servers.",
    swapTargets: [
      { src: "/icons/technologies/vercel-icon-dark.svg", alt: "Vercel", invert: true },
      { src: "/icons/technologies/aws.svg", alt: "AWS" },
    ],
  },
  {
    layer: "Runtime",
    defaultChoice: "Bun",
    logo: "/icons/technologies/bun.svg",
    swap: "Your code is standard TypeScript. Run it on Node.js if you prefer.",
    swapTargets: [{ src: "/icons/technologies/node.svg", alt: "Node.js" }],
  },
];

export type Outcome = {
  icon: string;
  title: string;
  body: string;
  /** Compact icon chips that carry the detail visually instead of prose. */
  visual?: { icon: string; label: string; tone?: "ok" | "bad" }[];
};

/** Section 5: what Compute + Bun do for you, stated as outcomes. */
export const runtimeOutcomes: Outcome[] = [
  {
    icon: "fa-regular fa-terminal",
    title: "One command to production",
    body: "The first deploy creates the project, the branch, and the database it runs on.",
    visual: [
      { icon: "fa-regular fa-terminal", label: "prisma app deploy" },
      { icon: "fa-regular fa-rocket", label: "my-app.prisma.build" },
    ],
  },
  {
    icon: "fa-regular fa-code-branch",
    title: "A preview per branch",
    body: "Reviews run against real infrastructure, not a shared staging server.",
    visual: [
      { icon: "fa-regular fa-code-branch", label: "feature/search" },
      { icon: "fa-regular fa-database", label: "own database copy" },
    ],
  },
  {
    icon: "fa-regular fa-wrench",
    title: "Less tooling to maintain",
    body: "The usual pile of dev dependencies is built into the runtime.",
    visual: [
      { icon: "fa-regular fa-server", label: "Bun.serve()" },
      { icon: "fa-regular fa-check", label: "bun test" },
      { icon: "fa-regular fa-cubes-stacked", label: "bundler" },
    ],
  },
];

/** Section 6: what Postgres + Prisma Next provide together. */
export const dataOutcomes: Outcome[] = [
  {
    icon: "fa-regular fa-shield-check",
    title: "Queries that match your schema",
    body: "Types come from the schema, so typos fail in your editor, not in production.",
    visual: [
      { icon: "fa-regular fa-check", label: "post.title", tone: "ok" },
      { icon: "fa-regular fa-triangle-exclamation", label: "post.titel", tone: "bad" },
    ],
  },
  {
    icon: "fa-regular fa-file-binary",
    title: "Migrations you can review",
    body: "Schema changes become versioned files that apply the same way everywhere.",
    visual: [
      { icon: "fa-regular fa-file-binary", label: "0042_add_posts" },
      { icon: "fa-regular fa-code-branch", label: "review in a PR" },
    ],
  },
  {
    icon: "fa-regular fa-cubes-stacked",
    title: "Capabilities without extra services",
    body: "Features you would otherwise host separately live inside Postgres:",
    visual: [
      { icon: "fa-regular fa-stars", label: "pgvector" },
      { icon: "fa-regular fa-magnifying-glass", label: "pg_search" },
      { icon: "fa-regular fa-clock-rotate-left", label: "pg_cron" },
      { icon: "fa-regular fa-chart-line", label: "pg_stat_statements" },
    ],
  },
];

/** Section 7: concrete reasons the stack suits agent-driven development. */
export const agentPoints: Outcome[] = [
  {
    icon: "fa-regular fa-shapes",
    title: "One project shape",
    body: "An agent that knows one Prisma Stack project knows them all.",
    visual: [
      { icon: "fa-regular fa-file-binary", label: "prisma/schema.prisma" },
      { icon: "fa-regular fa-code", label: "src/index.ts" },
    ],
  },
  {
    icon: "fa-regular fa-file-contract",
    title: "The schema is the contract",
    body: "The data model is one readable file: inspect it, diff it, regenerate the types.",
  },
  {
    icon: "fa-regular fa-clock-rotate-left",
    title: "A typed feedback loop",
    body: "Agents iterate against the compiler, not runtime failures.",
  },
  {
    icon: "fa-regular fa-receipt",
    title: "Workflows in plain text",
    body: "Migrations are files and deploys are commands, reviewable before and after they run.",
  },
];
