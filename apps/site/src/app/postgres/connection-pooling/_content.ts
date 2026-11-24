// Content for /postgres/connection-pooling.
//
// Brief: new-page-connection-pooling (Search Console 24 Aug to 22 Nov 2026).
// Main term "postgres connection pooling" / "postgres connection pool";
// secondary "connection pooling", "connection pool", "how does connection
// pooling work with serverless postgres", "pgbouncer".
//
// Copy rules for this page:
//   - Never name competitors.
//   - Don't lead with free or price. Plan details stay in the short plan section.
//   - No global cache or automatic failover claims.
//   - No em dashes or en dashes.
//
// Every claim is backed by a docs page. The PR description lists them:
//   docs/postgres/database/connection-pooling.mdx (PgBouncer in transaction
//     mode, connection proxy, hosts, limits, reserved connections, 60-minute
//     idle close, 10-minute query limit, session state, troubleshooting)
//   docs/postgres/database/connecting-to-your-database.mdx (both strings,
//     Console steps, which string for which job)
//   docs/orm/reference/transactions-and-runtime.mdx (poolOptions, default max
//     10, max: 1 behind a pooled Prisma Postgres URL, postgresServerless)
//   docs/orm/coming-from-prisma-orm-7.mdx (prisma.config.ts orm.db.connection)
//   docs/composer/databases.mdx, composer/deploying.mdx (small pools on Compute)
//   docs/compute/environment-variables.mdx (project env add)
//   apps/site/src/components/product/content/compute.ts (PgBouncer included)
//   prisma/orm v7 packages/adapter-pg/src/pg.ts (PrismaPg takes pg.PoolConfig)
//   PostgreSQL 17 docs, "How Connections Are Established" (process per connection)

export const POOLING_PATH = "/postgres/connection-pooling";

export const POOLING_TITLE = "Postgres Connection Pooling, Built In | Prisma Postgres";

export const POOLING_DESCRIPTION =
  "How Postgres connection pooling works, why serverless apps need it, and how Prisma Postgres pools connections with PgBouncer, pooled and direct strings.";

export const POOLING_H1 = "Postgres connection pooling, built into Prisma Postgres";

/** The quotable answer, directly under the H1. */
export const POOLING_SUBHEADLINE =
  "Postgres connection pooling keeps a small set of database connections open and shares them across many requests, so your app doesn't open a new connection for every query. Prisma Postgres includes a PgBouncer pooler on every plan, behind your pooled connection string.";

export const POOLING_LAST_MODIFIED = "2026-11-24";

export const POOLING_HERO_CHECKS = [
  "PgBouncer in transaction mode on every plan",
  "Pooled and direct connection strings for each database",
  "Works with Prisma ORM and any Postgres client",
] as const;

const CONSOLE_SIGN_UP_URL = "https://console.prisma.io/sign-up";

export const POOLING_PRIMARY_CTA = { label: "Get started", href: CONSOLE_SIGN_UP_URL } as const;
export const POOLING_SECONDARY_CTA = {
  label: "Create an instant database",
  href: "https://create-db.prisma.io",
} as const;

export type CodeLang = "typescript" | "prisma" | "bash";

/**
 * Body blocks. Strings use the shared inline syntax from lib/faq-answer.tsx:
 * `[text](/path)` for links and backticks for inline code. A list item may
 * open with a `**bold lead.**`.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "code"; lang: CodeLang; title: string; code: string }
  | {
      type: "table";
      caption: string;
      head: readonly string[];
      rows: readonly (readonly string[])[];
    };

export type Section = { id: string; heading: string; blocks: readonly Block[] };

export const POOLING_LIMITS = [
  ["Free", "10", "10"],
  ["Starter", "100", "10"],
  ["Pro", "500", "50"],
  ["Business", "1,000", "100"],
] as const;

export const POOLING_SECTIONS: readonly Section[] = [
  {
    id: "what-is-connection-pooling",
    heading: "What is Postgres connection pooling?",
    blocks: [
      {
        type: "p",
        text: "Opening a Postgres connection takes work: a network round trip, TLS, authentication, and a [new server process](https://www.postgresql.org/docs/17/connect-estab.html) on the database side. A connection pool opens a few connections once and lends them out, so each query borrows a connection instead of creating one.",
      },
      {
        type: "p",
        text: "Pools live in two places. Your app's database client keeps one in memory, as `node-postgres` and Prisma ORM do. A server-side pooler such as PgBouncer sits in front of the database and shares its connections across every instance of your app. The [dataguide on connection pooling](/dataguide/database-tools/connection-pooling) covers the general theory. This page is about how Prisma Postgres does it.",
      },
    ],
  },
  {
    id: "why-serverless-needs-pooling",
    heading: "Why serverless and agent workloads need a pooler",
    blocks: [
      {
        type: "p",
        text: "A long-running server opens its pool once and reuses it for hours. Serverless functions don't work that way. A traffic spike can start dozens of function instances at once, and each one opens its own connections. So can coding agents running tasks in parallel. Without a pooler, those connections add up until the database runs out of slots and new ones fail with a too many connections error.",
      },
      {
        type: "p",
        text: "A server-side pooler fixes this at the source. Every instance connects to the pooler instead of the database, and the pooler hands out a small number of real database connections one transaction at a time. [Hosted Postgres says too many connections](/postgres/too-many-connections) walks through diagnosing that error on any host.",
      },
    ],
  },
  {
    id: "how-prisma-postgres-pools",
    heading: "How Prisma Postgres pools connections",
    blocks: [
      {
        type: "p",
        text: "Every Prisma Postgres database includes a pooler, and you don't configure or run it yourself. Application traffic goes through a connection proxy to a tenant-isolated PgBouncer instance, then to the database. The diagram at the top of this page shows the difference it makes.",
      },
      { type: "h3", text: "Transaction mode" },
      {
        type: "p",
        text: "PgBouncer runs in transaction mode. It assigns a database connection when a transaction starts and returns it to the pool when the transaction ends, so a connection is only busy while it's doing work. That's what lets many short-lived clients share a few connections.",
      },
      {
        type: "p",
        text: "The trade-off is session state. `SET` commands, prepared statements, advisory locks and temporary tables don't carry over between transactions, and `LISTEN` and `NOTIFY` need a direct connection. Queries on pooled connections are also stopped after 10 minutes.",
      },
      { type: "h3", text: "Pooled and direct connection strings" },
      {
        type: "p",
        text: "Each database has two connection strings with the same credentials. Only the host differs:",
      },
      {
        type: "code",
        lang: "bash",
        title: ".env",
        code: `# Pooled: routes through PgBouncer
DATABASE_URL="postgres://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require"

# Direct: connects straight to the database
DIRECT_URL="postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"`,
      },
      {
        type: "list",
        items: [
          "**Pooled, `pooled.db.prisma.io`.** All application traffic: API handlers, background workers and serverless functions.",
          "**Direct, `db.prisma.io`.** Migrations, Prisma Studio, `pg_dump` and `pg_restore`, `LISTEN` and `NOTIFY`, session-level `SET` commands, and queries that may run longer than 10 minutes.",
        ],
      },
      {
        type: "p",
        text: "Get both in the [Prisma Console](https://console.prisma.io): open the database, select Connect to your database, then Generate new connection string. The [Postgres connection string](/postgres/connection-string) page breaks down each part of the format.",
      },
      { type: "h3", text: "Connection limits" },
      {
        type: "table",
        caption: "Concurrent connection limits per plan",
        head: ["Plan", "Pooled connections", "Direct connections"],
        rows: POOLING_LIMITS,
      },
      {
        type: "p",
        text: "These are concurrent connection limits. 5 direct connections are reserved for platform operations such as maintenance and monitoring, so they aren't available to your workload. Idle pooled connections are closed after 60 minutes. The [connection pooling docs](/docs/postgres/database/connection-pooling) have the details.",
      },
    ],
  },
  {
    id: "prisma-orm",
    heading: "Connection pooling with Prisma ORM",
    blocks: [
      {
        type: "p",
        text: "Prisma ORM keeps its own client-side pool, and each connection in it counts against your pooled limit. In Prisma ORM 8, the client you create with `postgres()` opens up to 10 connections by default. Set [`poolOptions.max`](/docs/orm/reference/transactions-and-runtime) to change that. Behind a pooled Prisma Postgres URL, `max: 1` keeps each client to one connection, and queries take turns on it.",
      },
      {
        type: "code",
        lang: "typescript",
        title: "src/prisma/db.ts",
        code: `import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

export const contract = contractFromJson<Contract>(contractJson);

// DATABASE_URL is the pooled string (pooled.db.prisma.io).
export const db = postgres({
  contract,
  url: process.env.DATABASE_URL!,
  poolOptions: { max: 1 },
});`,
      },
      {
        type: "p",
        text: "With a single connection, send queries inside a transaction through `tx`, not `db`. A query sent through `db` inside `db.transaction()` waits for the transaction's connection until it times out.",
      },
      {
        type: "p",
        text: "Point the Prisma CLI at the direct string, so migrations and `db` commands bypass the pooler:",
      },
      {
        type: "code",
        lang: "typescript",
        title: "prisma.config.ts",
        code: `import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: process.env.DIRECT_URL!,
    },
  }),
});`,
      },
      {
        type: "p",
        text: "For serverless functions, Prisma ORM's [serverless client](/docs/orm/reference/transactions-and-runtime#serverless-client-on-postgresql), `postgresServerless()`, opens one connection per request with `connect({ url })`. Create it once, outside the handler, and give it the pooled string. On Prisma ORM 7, the `PrismaPg` adapter takes the same `pg` pool settings, including `max`. The [serverless Postgres](/postgres/serverless) page shows the full path from schema to deploy.",
      },
    ],
  },
  {
    id: "prisma-compute",
    heading: "Pooling for apps on Prisma Compute",
    blocks: [
      {
        type: "p",
        text: "[Prisma Compute](/compute) runs your Node.js, Bun or Next.js app next to Prisma Postgres in the same project, with PgBouncer pooling included. Store the pooled connection string as a project [environment variable](/docs/compute/environment-variables):",
      },
      {
        type: "code",
        lang: "bash",
        title: "Terminal",
        code: `npx prisma project env add DATABASE_URL=postgres://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require --role production`,
      },
      {
        type: "p",
        text: "Compute scales an idle app to zero and closes idle database connections. Keep each instance's pool small and ready to reconnect. The [Composer docs](/docs/composer/deploying#production-behavior) use one connection with a 10-second idle timeout:",
      },
      {
        type: "code",
        lang: "typescript",
        title: "src/server.ts",
        code: `import { SQL } from "bun";
import service from "./service.ts";

const { db } = service.load();
const sql = new SQL({ url: db.url, max: 1, idleTimeout: 10, prepare: false });`,
      },
    ],
  },
  {
    id: "common-mistakes",
    heading: "Common connection pooling mistakes and how to fix them",
    blocks: [
      {
        type: "list",
        items: [
          "**A new client for every request.** Each new client opens new connections. Create the client once, outside the handler, so warm invocations reuse it.",
          "**More instances than pooled connections.** Each function instance holds its own connections. If your platform scales to 200 instances and your plan allows 100 pooled connections, you hit the limit. Lower each instance's pool size, cap concurrency on the platform, or move to a plan with more pooled connections.",
          "**App traffic on the direct host.** It works at low traffic, then runs out of connections under load, because direct limits are much lower. Use `pooled.db.prisma.io` for the app.",
          "**Migrations through the pooler.** Migrations need session continuity, so on the pooled host they fail with lock, session or prepared statement errors. Point the Prisma CLI at the direct string.",
          "**Expecting session state to stick.** `SET` commands, temporary tables and prepared statements are lost after each transaction in transaction mode. Use a direct connection for work that depends on them.",
          "**Long queries on the pooler.** Pooled queries stop after 10 minutes. Split the job into smaller batches, or run it over the direct connection.",
        ],
      },
    ],
  },
  {
    id: "plans",
    heading: "Plans",
    blocks: [
      {
        type: "p",
        text: "Every plan includes PgBouncer pooling. Plans differ in how many pooled and direct connections you get, as in the table above, and in operations, storage and backups. Compare them on the [pricing page](/pricing).",
      },
    ],
  },
];

export const POOLING_RELATED = [
  { label: "Serverless Postgres", href: "/postgres/serverless" },
  { label: "Postgres connection strings", href: "/postgres/connection-string" },
  { label: "Hosted Postgres says too many connections", href: "/postgres/too-many-connections" },
  { label: "Connection pooling docs", href: "/docs/postgres/database/connection-pooling" },
  {
    label: "Connecting to your database",
    href: "/docs/postgres/database/connecting-to-your-database",
  },
  { label: "What is connection pooling?", href: "/dataguide/database-tools/connection-pooling" },
  { label: "Prisma Postgres", href: "/postgres" },
  { label: "Prisma ORM", href: "/orm" },
  { label: "Prisma Compute", href: "/compute" },
] as const;

export type FaqItem = { question: string; answer: string };

// Visible FAQ. Every answer also feeds FAQPage JSON-LD (see page.tsx).
export const POOLING_FAQ: FaqItem[] = [
  {
    question: "What is connection pooling in Postgres?",
    answer:
      "Connection pooling keeps a set of Postgres connections open and reuses them across requests, so your app doesn't pay for a new connection on every query. Prisma Postgres includes a PgBouncer pooler on every plan, reached through the pooled connection string, with host `pooled.db.prisma.io`.",
  },
  {
    question: "How does connection pooling work with serverless Postgres?",
    answer:
      "Serverless functions start many short-lived instances, and each one opens connections. With Prisma Postgres, they connect to the pooled host, `pooled.db.prisma.io`, where PgBouncer in transaction mode shares a small number of database connections, one transaction at a time. Create your client outside the handler so warm invocations reuse it, and keep each instance's pool small.",
  },
  {
    question: "Does Prisma Postgres use PgBouncer?",
    answer:
      "Yes. Application traffic on the pooled connection string goes through a tenant-isolated PgBouncer instance in transaction mode, on every plan. You don't configure or run it yourself.",
  },
  {
    question: "What is a connection pool?",
    answer:
      "A connection pool is a set of open database connections that a client library or a pooler lends out and takes back. Borrowing an open connection skips the network round trip, TLS and authentication of opening a new one.",
  },
  {
    question: "How many connections does Prisma Postgres allow?",
    answer:
      "Pooled connections: 10 on Free, 100 on Starter, 500 on Pro and 1,000 on Business. Direct connections: 10 on Free and Starter, 50 on Pro and 100 on Business, with 5 reserved for platform operations. See [connection limits](/docs/postgres/database/connection-pooling#connection-limits).",
  },
  {
    question: "Should I use the pooled or the direct connection string?",
    answer:
      "Use the pooled string, with host `pooled.db.prisma.io`, for application traffic. Use the direct string, with host `db.prisma.io`, for migrations, Prisma Studio, `pg_dump`, `LISTEN` and `NOTIFY`, session-level `SET` commands and queries longer than 10 minutes.",
  },
  {
    question: "Why do I get a too many connections error?",
    answer:
      "Usually because the app creates a new client per request, runs more instances than your plan's pooled connections allow, or sends app traffic to the direct host. Reuse one client per instance, keep pools small and use `pooled.db.prisma.io`. [Hosted Postgres says too many connections](/postgres/too-many-connections) covers the diagnosis step by step.",
  },
  {
    question: "Do I still need a client-side pool with PgBouncer?",
    answer:
      "Your client still keeps a pool, and each connection in it counts against your pooled limit. Keep it small on serverless platforms and Prisma Compute. Prisma ORM 8's default is 10 connections, and `poolOptions: { max: 1 }` keeps a client to one behind the pooled URL.",
  },
  {
    question: "Can I use prepared statements with the pooler?",
    answer:
      "Prepared statements don't persist on pooled connections, because PgBouncer in transaction mode returns the connection to the pool after each transaction. Use the direct connection for workloads that rely on session-level prepared statements.",
  },
];

export const POOLING_CLOSER = {
  headline: "Get a database with pooling built in",
  body: "Every Prisma Postgres database comes with a pooled and a direct connection string. Create one with npx create-db, or sign up and create one in the Console.",
  benefits: ["PgBouncer on every plan", "Nothing to configure", "Works with any Postgres client"],
  primaryCta: POOLING_PRIMARY_CTA,
  secondaryCta: {
    label: "Read the pooling docs",
    href: "/docs/postgres/database/connection-pooling",
  },
} as const;

/** Text alternative for the hero diagram (see _diagram.tsx). */
export const POOLING_DIAGRAM_LABEL =
  "Two panels. Without a pooler, each of five function instances opens its own connection straight to Postgres, so five instances use five database connections. With Prisma Postgres, the five instances connect to the pooled host, pooled.db.prisma.io, where PgBouncer in transaction mode shares two database connections between them. The numbers are an illustration.";
