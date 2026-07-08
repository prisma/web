export type Framework = {
  name: string;
  /** Short monogram shown in the badge tile */
  mono: string;
  /** Accent color for the badge glyph */
  color: string;
  /** Badge tile background */
  bg: string;
};

/** Frameworks that Prisma Compute runs, cycled through the diagram + marquee. */
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
  { name: "SolidStart", mono: "So", color: "#4c86c6", bg: "rgba(70,130,200,0.18)" },
  { name: "Qwik City", mono: "Q", color: "#18b6f6", bg: "rgba(24,182,246,0.14)" },
  { name: "Remix", mono: "Rx", color: "#3992ff", bg: "rgba(57,146,255,0.16)" },
  { name: "Vite + React", mono: "Vt", color: "#bd34fe", bg: "rgba(189,52,254,0.16)" },
];

export type BunApi = {
  api: string;
  role: string;
};

/** Bun capabilities that ship with Prisma Compute. */
export const bunApis: BunApi[] = [
  { api: "Bun.serve()", role: "HTTP + WebSocket server, built in." },
  { api: "Bun.image", role: "Resize, convert and optimise images." },
  { api: "bun test", role: "Jest-compatible test runner." },
  { api: "Bun.password", role: "Argon2 / bcrypt hashing." },
  { api: "bun install", role: "Package manager, fast lockfile." },
  { api: "Bun bundler", role: "Bundle and transpile, no config." },
  { api: "Bun.$``", role: "Shell scripting in TypeScript." },
  { api: "Bun.s3", role: "S3-compatible object storage client." },
  { api: "Bun.redis", role: "Built-in Redis / cache client." },
  { api: "Bun.file", role: "Fast file reads, writes and streams." },
  { api: ".env (native)", role: "Auto-loads environment files." },
  { api: "TS + JSX", role: "Runs TypeScript directly, no build." },
];

/** Postgres extensions surfaced in the data section. */
export const postgresExtensions: string[] = [
  "pgvector",
  "pg_search",
  "Vector type",
  "pg_cron",
  "pg_trgm",
  "pg_stat_statements",
  "uuid-ossp",
];
