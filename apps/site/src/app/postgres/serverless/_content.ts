// Content for /postgres/serverless.
//
// Brief: new-page-serverless (Search Console 24 Aug to 22 Nov 2026). Main term
// "serverless postgres"; secondary "serverless database", "what is a
// serverless database", "best serverless postgres".
//
// Copy rules for this page:
//   - Never name competitors. The comparison lives on /blog/serverless-postgres.
//   - Don't lead with free or price. Plan details stay in the short plan section.
//   - No global cache or automatic failover claims.
//   - "no cold starts" is quoted from the docs (docs/postgres/index.mdx) in the
//     body and the FAQ only, never as a headline (guardrail in
//     components/product/content/postgres.ts).
//   - No em dashes or en dashes.
//
// Every claim is backed by a docs page. The PR description lists them:
//   docs/postgres/index.mdx (PostgreSQL 17, autoscaling, no cold starts)
//   docs/postgres/database/connection-pooling.mdx (PgBouncer, hosts, limits)
//   docs/postgres/database/serverless-driver.mdx (@prisma/ppg, HTTP/WebSockets)
//   docs/postgres/npx-create-db.mdx (create-db flags and lifetime)
//   docs/orm/reference/transactions-and-runtime.mdx (postgresServerless)
//   docs/compute/getting-started.mdx, compute/environment-variables.mdx,
//   composer/databases.mdx, composer/deploying.mdx (Compute deploy and pools)
//   docs/postgres/faq.mdx (regions, operations, custom roles)

export const SERVERLESS_PATH = "/postgres/serverless";

export const SERVERLESS_TITLE = "Serverless Postgres for TypeScript Apps | Prisma Postgres";

export const SERVERLESS_DESCRIPTION =
  "What serverless Postgres is and how Prisma Postgres runs it: no instance to size, built-in pooling, a serverless driver for edge runtimes and six regions.";

export const SERVERLESS_H1 = "Serverless Postgres for TypeScript apps and agents";

/** The quotable answer, directly under the H1. */
export const SERVERLESS_SUBHEADLINE =
  "Serverless Postgres is PostgreSQL you use without running a server: the platform scales it, pools connections and bills for what you use. Prisma Postgres is managed PostgreSQL 17 built that way, with no instance to size and connection pooling on every plan.";

export const SERVERLESS_LAST_MODIFIED = "2026-11-24";

export const SERVERLESS_HERO_CHECKS = [
  "PgBouncer connection pooling on every plan",
  "A serverless driver for edge runtimes",
  "A database from the terminal with npx create-db",
] as const;

const CONSOLE_SIGN_UP_URL = "https://console.prisma.io/sign-up";

export const SERVERLESS_PRIMARY_CTA = { label: "Get started", href: CONSOLE_SIGN_UP_URL } as const;
export const SERVERLESS_SECONDARY_CTA = {
  label: "Create an instant database",
  href: "https://create-db.prisma.io",
} as const;

export type CodeLang = "typescript" | "prisma" | "bash";

/**
 * Body blocks. Strings use the shared inline syntax from lib/faq-answer.tsx:
 * `[text](/path)` for links and backticks for inline code.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "code"; lang: CodeLang; title: string; code: string };

export type Section = { id: string; heading: string; blocks: readonly Block[] };

export const SERVERLESS_SECTIONS: readonly Section[] = [
  {
    id: "what-is-serverless-postgres",
    heading: "What is serverless Postgres?",
    blocks: [
      {
        type: "p",
        text: "Serverless Postgres is a PostgreSQL database you reach through a connection string, while the provider runs the servers, scales them and handles connections for you. You don't pick an instance size up front, and you pay for usage instead of for a machine that runs all day.",
      },
      {
        type: "p",
        text: "That matters most for serverless apps. A function can start many copies of itself in a second, and each copy wants a database connection. A database built for serverless puts a connection pooler in front of Postgres, so those copies share a small set of real connections instead of running out of them.",
      },
      {
        type: "p",
        text: "Prisma Postgres works this way. It is managed [PostgreSQL 17](/docs/postgres) that autoscales, so there is no instance to size or upgrade. It bills by operations and storage, where an [operation](/docs/postgres/faq#what-is-an-operation) is one query, read or write. To your app it is ordinary Postgres: Prisma ORM, `node-postgres`, `psql` and other Postgres clients all connect with the same connection string.",
      },
    ],
  },
  {
    id: "how-it-works",
    heading: "How Prisma Postgres works for serverless and edge apps",
    blocks: [
      {
        type: "p",
        text: "Every database has a pooled connection string, a direct one, and a serverless driver for runtimes without TCP. The diagram at the top of this page shows which traffic takes which path.",
      },
      { type: "h3", text: "Connection pooling is built in" },
      {
        type: "p",
        text: "Application traffic goes to the pooled host, `pooled.db.prisma.io`. It routes through a tenant-isolated PgBouncer instance in transaction mode: a real database connection is assigned for one transaction, then returned to the pool. Many short-lived functions share those connections instead of opening one each.",
      },
      {
        type: "p",
        text: "Pooled connection limits are per plan: 10 on Free, 100 on Starter, 500 on Pro and 1,000 on Business. [Postgres connection pooling](/postgres/connection-pooling) explains how the pooler behaves and when to bypass it.",
      },
      { type: "h3", text: "Direct connections for migrations and tools" },
      {
        type: "p",
        text: "The direct host, `db.prisma.io`, skips the pooler. Use it for migrations, Prisma Studio, `pg_dump` and anything that needs session state, such as `LISTEN` and `NOTIFY`. The [Postgres connection string](/postgres/connection-string) page breaks down both formats.",
      },
      { type: "h3", text: "A serverless driver for edge runtimes" },
      {
        type: "p",
        text: "Some runtimes can't open a PostgreSQL TCP connection. For those, the [serverless driver](/docs/postgres/database/serverless-driver), `@prisma/ppg`, talks to Prisma Postgres over HTTP and WebSockets. It takes your direct connection string as its credential but never opens a TCP connection.",
      },
      {
        type: "code",
        lang: "typescript",
        title: "src/query.ts",
        code: `import { prismaPostgres, defaultClientConfig } from "@prisma/ppg";

const ppg = prismaPostgres(defaultClientConfig(process.env.DATABASE_URL!));

type User = { id: number; email: string };

const users = await ppg.sql<User>\`
  SELECT id, email FROM "User" WHERE email = \${"ada@example.com"}
\`.collect();`,
      },
      { type: "h3", text: "Scaling and cold starts" },
      {
        type: "p",
        text: "There is no instance to size or upgrade: Prisma Postgres scales with the queries you send. The [Prisma Postgres docs](/docs/postgres) note that it has no cold starts, so the first query after an idle period does not wait for the database to wake up. A first request after idle can still be slow for other reasons, such as a stopped app host or a new connection. [This guide](/postgres/slow-first-request-after-idle) shows how to find which part woke up.",
      },
      { type: "h3", text: "Regions" },
      {
        type: "p",
        text: "You choose one of [six regions](/docs/postgres/faq#what-regions-is-prisma-postgres-available-in) when you create a database: San Francisco, North Virginia, Paris, Frankfurt, Tokyo or Singapore. The region can't be changed later. Every query travels from your function to that region and back, so run your functions in or near it.",
      },
    ],
  },
  {
    id: "from-schema-to-deploy",
    heading: "From schema to deployed app in four steps",
    blocks: [
      {
        type: "p",
        text: "Here is the whole path: Prisma ORM to model and query, Prisma Postgres to store, and Prisma Compute to deploy. The code uses [Prisma ORM 8](/docs/orm). Any other Postgres client works the same way with the connection string.",
      },
      { type: "h3", text: "1. Define your schema" },
      {
        type: "p",
        text: "Your models live in a contract file. `npm create prisma@latest` writes one for a new app, and `npx prisma orm init` adds one to an app you already have.",
      },
      {
        type: "code",
        lang: "prisma",
        title: "src/prisma/contract.prisma",
        code: `// use prisma-8

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`,
      },
      { type: "h3", text: "2. Create a database" },
      {
        type: "p",
        text: "Run [`create-db`](/docs/postgres/npx-create-db) to get a Prisma Postgres database and its connection string in seconds, with no account. Put the connection string it prints in `.env` as `DATABASE_URL`, then create the tables. The database is deleted after 24 hours unless you open the claim URL from the output and keep it in your workspace.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Terminal",
        code: `npx create-db@latest
npx prisma contract emit
npx prisma db init`,
      },
      {
        type: "p",
        text: "`contract emit` writes the `contract.json` and `contract.d.ts` files your app imports, and `db init` creates the tables in the empty database.",
      },
      { type: "h3", text: "3. Query it from a serverless function" },
      {
        type: "p",
        text: "For functions on Node.js or Bun, Prisma ORM has a [serverless client](/docs/orm/reference/transactions-and-runtime#serverless-client-on-postgresql). It holds no connection of its own, so you create it once, outside the handler, and open one connection per request with `connect()`. `await using` closes it when the request ends.",
      },
      {
        type: "code",
        lang: "typescript",
        title: "src/app/api/users/route.ts",
        code: `import postgresServerless from "@prisma/orm-postgres/serverless";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "../../../prisma/contract.d";
import contractJson from "../../../prisma/contract.json" with { type: "json" };

const postgres = postgresServerless({ contract: contractFromJson<Contract>(contractJson) });

export async function GET() {
  await using db = await postgres.connect({ url: process.env.DATABASE_URL! });
  const users = await db.orm.public.User.all();
  return Response.json(users);
}`,
      },
      {
        type: "p",
        text: "In production, set `DATABASE_URL` to the pooled connection string from the Console, so every function instance goes through PgBouncer. On a runtime with no TCP support, query with the serverless driver shown above instead.",
      },
      { type: "h3", text: "4. Deploy on Prisma Compute" },
      {
        type: "p",
        text: "[Prisma Compute](/compute) hosts Node.js, Bun and Next.js apps next to Prisma Postgres, in the same project. Add a [Composer declaration](/docs/prisma-compute/deploy) around your server code, then build and deploy:",
      },
      {
        type: "code",
        lang: "bash",
        title: "Terminal",
        code: `npx prisma auth login
npm run build
npx prisma deploy`,
      },
      {
        type: "p",
        text: "Store the connection string as a project [environment variable](/docs/compute/environment-variables), scoped to production or preview, with `npx prisma project env add DATABASE_URL=... --role production`. Values are write-only and resolve at the next deploy. You can also let the deploy create the database: a `rawPostgres()` dependency in the Composer module provisions a [Prisma Postgres database](/docs/composer/databases) with the app. Compute scales an idle app to zero and closes idle database connections, so keep your app's pool small and ready to reconnect.",
      },
    ],
  },
  {
    id: "good-fit",
    heading: "When serverless Postgres is a good fit, and when it isn't",
    blocks: [
      { type: "h3", text: "A good fit" },
      {
        type: "list",
        items: [
          "**Uneven traffic.** You don't pay for an instance sized for your busiest hour, and there is no instance to resize when traffic grows.",
          "**Serverless functions and edge runtimes.** Pooling is built in, and the serverless driver covers runtimes without TCP.",
          "**Many small databases.** A database per app, preview branch or agent task, created in seconds with `npx create-db` or the [Prisma MCP server](/docs/ai/tools/mcp-server).",
          "**The app and database in one place.** On Prisma Compute, deploy on push gives each feature branch a preview with its own declared databases.",
        ],
      },
      { type: "h3", text: "Not the best fit" },
      {
        type: "list",
        items: [
          "**Sustained, heavy query volume.** Billing follows operations, so at a constant high query rate an always-on server can cost less. [Serverless Postgres compared](/blog/serverless-postgres) works through the crossover.",
          "**Long queries and session state on the pooler.** Pooled connections stop queries after 10 minutes and don't keep session state such as `SET` commands, advisory locks or `LISTEN` and `NOTIFY`. Use the direct connection for those.",
          "**Custom database roles.** Prisma Postgres doesn't support `CREATE ROLE`, so per-role access rules have to live in your app.",
          "**Moving between regions.** A database's region is fixed when you create it. Moving means a new database and a copy with `pg_dump` and `pg_restore`.",
        ],
      },
    ],
  },
  {
    id: "agents",
    heading: "Serverless Postgres that coding agents can set up",
    blocks: [
      {
        type: "p",
        text: "Coding agents such as Claude Code, Cursor and Codex can create a database without a person signing up first. `npx create-db@latest --json` returns the connection string, the claim URL and the deletion time as JSON. The [Prisma MCP server](/docs/ai/tools/mcp-server) lets an agent create databases, inspect the schema and run SQL with your Prisma sign-in.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Terminal",
        code: `npx create-db@latest --json --region eu-central-1`,
      },
      {
        type: "p",
        text: "In [Scope's November 2026 benchmark](https://www.tryscope.com/leaderboard/databases) of AI agents signing up for a database and using it, Prisma Postgres ranked first of 18 providers, with an 88.3% success rate.",
      },
    ],
  },
  {
    id: "plans",
    heading: "Plans",
    blocks: [
      {
        type: "p",
        text: "Every plan includes connection pooling. The Free plan includes 200,000 operations a month, 2 GB of storage and up to 50 databases, with no credit card. Paid plans add daily backups, more pooled connections and spend limits. Compare them on the [pricing page](/pricing).",
      },
    ],
  },
];

export const SERVERLESS_RELATED = [
  { label: "Postgres connection pooling", href: "/postgres/connection-pooling" },
  { label: "Postgres connection strings", href: "/postgres/connection-string" },
  { label: "Serverless driver docs", href: "/docs/postgres/database/serverless-driver" },
  { label: "Connection pooling docs", href: "/docs/postgres/database/connection-pooling" },
  { label: "Serverless Postgres compared", href: "/blog/serverless-postgres" },
  {
    label: "Traditional databases vs serverless databases",
    href: "/dataguide/serverless/traditional-vs-serverless-databases",
  },
  { label: "Prisma Postgres", href: "/postgres" },
  { label: "Prisma ORM", href: "/orm" },
  { label: "Prisma Compute", href: "/compute" },
] as const;

export type FaqItem = { question: string; answer: string };

// Visible FAQ. Every answer also feeds FAQPage JSON-LD (see page.tsx).
export const SERVERLESS_FAQ: FaqItem[] = [
  {
    question: "What is serverless Postgres?",
    answer:
      "Serverless Postgres is PostgreSQL that you use through a connection string while the provider runs, scales and pools it for you. You don't size an instance, and you pay for usage. Prisma Postgres is serverless Postgres: managed PostgreSQL 17 with built-in PgBouncer connection pooling, billed by operations and storage.",
  },
  {
    question: "What is a serverless database?",
    answer:
      "A serverless database is one you use without provisioning or managing servers. The provider handles capacity, scaling and connections, and you pay for what you use rather than for a fixed machine. Serverless Postgres is a serverless database that speaks standard PostgreSQL, so existing Postgres clients and tools work with it.",
  },
  {
    question: "Is Prisma Postgres serverless?",
    answer:
      "Yes. There is no instance to size or upgrade, pooling is built in, and you pay for operations and storage. Serverless functions connect over the pooled connection string, and edge runtimes connect through the [serverless driver](/docs/postgres/database/serverless-driver).",
  },
  {
    question: "Does Prisma Postgres have cold starts?",
    answer:
      "No. The [Prisma Postgres docs](/docs/postgres) say the first query after an idle period does not wait for the database to wake up. If your first request after idle is still slow, the cause is usually the app host or a new connection. [This guide](/postgres/slow-first-request-after-idle) shows how to find it.",
  },
  {
    question: "How do I connect to Postgres from a serverless function?",
    answer:
      "Use the pooled connection string, with host `pooled.db.prisma.io`, as `DATABASE_URL`. Create your database client once, outside the handler, so warm invocations reuse it. With Prisma ORM, `postgresServerless()` opens one connection per request. Keep the direct string, with host `db.prisma.io`, for migrations and admin tools.",
  },
  {
    question: "Can I use Prisma Postgres from edge runtimes?",
    answer:
      "Yes. On a runtime that can't open a PostgreSQL TCP connection, use the [serverless driver](/docs/postgres/database/serverless-driver), `@prisma/ppg`. It connects over HTTP and WebSockets, with your direct connection string as the credential.",
  },
  {
    question: "What is the best serverless Postgres?",
    answer:
      "The one whose billing and idle behaviour match your traffic. Check what you're billed for (queries, compute time or an instance), what happens when the database is idle, how connections are pooled, and whether you can host your app next to it. Prisma Postgres bills per operation, pools connections on every plan and runs next to Prisma Compute. [Serverless Postgres compared](/blog/serverless-postgres) puts the options side by side.",
  },
  {
    question: "Can I use Prisma Postgres without Prisma ORM?",
    answer:
      "Yes. It is standard PostgreSQL, so `node-postgres`, `psql`, other ORMs and GUI tools all connect with the connection string. Prisma ORM is optional.",
  },
  {
    question: "How do I deploy my app next to the database?",
    answer:
      "On [Prisma Compute](/compute), which hosts Node.js, Bun and Next.js apps in the same project as Prisma Postgres. Build your app, then run `npx prisma deploy`. Each Compute service runs in one region, so create it in the same region as its database.",
  },
];

export const SERVERLESS_CLOSER = {
  headline: "Start with a database in seconds",
  body: "Run npx create-db for a database with no account, or sign up and create one in the Console. Add Prisma ORM and Prisma Compute when you need them.",
  benefits: ["No instance to size", "Pooling on every plan", "Works with any Postgres client"],
  primaryCta: SERVERLESS_PRIMARY_CTA,
  secondaryCta: { label: "Read the docs", href: "/docs/postgres" },
} as const;

/** Text alternative for the hero diagram (see _diagram.tsx). */
export const SERVERLESS_DIAGRAM_LABEL =
  "How apps reach Prisma Postgres. Serverless functions and Prisma Compute apps connect over TCP to the pooled host, pooled.db.prisma.io, where PgBouncer in transaction mode shares a few database connections. Edge runtimes use the serverless driver over HTTP and WebSockets. Migrations, Prisma Studio and pg_dump use the direct host, db.prisma.io. All three paths reach one PostgreSQL 17 database in the region you chose.";
