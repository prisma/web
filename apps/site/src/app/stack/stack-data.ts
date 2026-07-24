/**
 * All copy and structure for the /stack page lives here so the narrative can
 * be reviewed in one place. Every section states one idea; replaceability is
 * owned by `swapLayers`, deployment by `runtimeOutcomes`, and the data layer
 * by `dataOutcomes`, so no claim repeats across sections.
 */

export type StackLayerId = "app" | "compute" | "bun" | "orm" | "postgres";

export type Framework = {
  name: string;
  /** Short monogram shown in the badge tile */
  mono: string;
  /** Accent color for the badge glyph */
  color: string;
  /** Badge tile background */
  bg: string;
};

/** Frameworks Prisma Compute runs, cycled in the pyramid's top layer. */
export const frameworks: Framework[] = [
  {
    name: "Next.js",
    mono: "N",
    color: "var(--color-foreground-neutral)",
    bg: "var(--color-background-neutral-weak)",
  },
  { name: "React Router", mono: "RR", color: "#f44250", bg: "rgba(244,66,80,0.14)" },
  { name: "TanStack Start", mono: "TS", color: "#ff6b35", bg: "rgba(255,107,53,0.14)" },
  { name: "Astro", mono: "A", color: "#ff5d01", bg: "rgba(255,93,1,0.14)" },
  { name: "SvelteKit", mono: "S", color: "#ff3e00", bg: "rgba(255,62,0,0.14)" },
  { name: "Nuxt", mono: "V", color: "#00dc82", bg: "rgba(0,220,130,0.14)" },
  { name: "Hono", mono: "H", color: "#ff5b11", bg: "rgba(255,91,17,0.14)" },
  { name: "Elysia", mono: "E", color: "#8fa6fb", bg: "rgba(143,166,251,0.16)" },
  { name: "SolidStart", mono: "So", color: "#4c86c6", bg: "rgba(70,130,200,0.18)" },
  { name: "Vite + React", mono: "Vt", color: "#bd34fe", bg: "rgba(189,52,254,0.16)" },
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
      "Next.js, TanStack Start, Hono, Elysia, and more",
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
  swap: string;
};

/** Section 4 owns the replaceability message; it appears nowhere else. */
export const swapLayers: SwapLayer[] = [
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
