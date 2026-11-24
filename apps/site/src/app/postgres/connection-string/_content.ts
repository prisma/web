// Content for /postgres/connection-string.
//
// Brief: new-page-connection-string (Search Console 24 Aug to 22 Nov 2026).
// Main term "postgres connection string" / "postgresql connection string";
// secondary "postgres url", "postgresql url", "postgres url format",
// "postgres connection uri", "DATABASE_URL postgres".
//
// Copy rules for this page:
//   - Never name competitors.
//   - Don't lead with free or price. Plan details stay in the short plan section.
//   - No global cache or automatic failover claims.
//   - No em dashes or en dashes.
//   - Link to /postgres/database-url-missing rather than repeating it.
//
// Every claim is backed by a docs page. The PR description lists them:
//   docs/postgres/database/connecting-to-your-database.mdx (format, parts,
//     sslmode always require, Console steps, credentials, rotate and delete,
//     firewall allowlist)
//   docs/postgres/database/connection-pooling.mdx (which string for which job)
//   docs/postgres/npx-create-db.mdx (create-db output, --env, --json)
//   docs/cli/postgres.mdx (postgres create prints a one-time URL)
//   docs/orm/v7/reference/connection-urls.mdx (percent-encoding example,
//     ?schema= in Prisma ORM 7)
//   docs/orm/reference/transactions-and-runtime.mdx (Prisma ORM 8 accepts
//     postgres:// or postgresql://, RUNTIME.BINDING_INVALID)
//   docs/compute/environment-variables.mdx (project env add, write-only)
//   docs/postgres/database/serverless-driver.mdx (keep credentials server-side)
//   PostgreSQL 17 libpq docs (URI format, both schemes, default port, sslmode)

export const CONNSTRING_PATH = "/postgres/connection-string";

export const CONNSTRING_TITLE = "Postgres Connection String: Format and Examples | Prisma";

export const CONNSTRING_DESCRIPTION =
  "The Postgres connection string format explained part by part, with examples for SSL, pooled and direct hosts and special characters, and how to get one.";

export const CONNSTRING_H1 = "Postgres connection string format, with examples";

/** The quotable answer, directly under the H1. */
export const CONNSTRING_SUBHEADLINE =
  "A Postgres connection string is a URL in the form postgres://user:password@host:port/database?parameters that tells a client where and how to connect. With Prisma Postgres, you get a working one in seconds from npx create-db or the Console.";

export const CONNSTRING_LAST_MODIFIED = "2026-11-24";

export const CONNSTRING_HERO_CHECKS = [
  "A connection string in seconds with npx create-db",
  "Pooled and direct strings for every database",
  "SSL required on every connection",
] as const;

const CONSOLE_SIGN_UP_URL = "https://console.prisma.io/sign-up";

export const CONNSTRING_PRIMARY_CTA = {
  label: "Create an instant database",
  href: "https://create-db.prisma.io",
} as const;
export const CONNSTRING_SECONDARY_CTA = {
  label: "Get started",
  href: CONSOLE_SIGN_UP_URL,
} as const;

export type CodeLang = "typescript" | "prisma" | "bash";

/**
 * Body blocks. Strings use the shared inline syntax from lib/faq-answer.tsx:
 * `[text](/path)` for links and backticks for inline code. A list item may
 * open with a `**bold lead.**`. Table cells use the same inline syntax.
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

const LIBPQ_URIS = "https://www.postgresql.org/docs/17/libpq-connect.html#LIBPQ-CONNSTRING-URIS";
const LIBPQ_SSL = "https://www.postgresql.org/docs/17/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS";

/** The annotated parts, shared by the hero diagram and the format table. */
export const CONNSTRING_PARTS = [
  { part: "Scheme", value: "postgres://", note: "Marks the URL as PostgreSQL" },
  { part: "User", value: "USER", note: "The database user" },
  { part: "Password", value: ":PASSWORD", note: "Percent-encode special characters" },
  { part: "Host", value: "@pooled.db.prisma.io", note: "Pooled, or db.prisma.io for direct" },
  { part: "Port", value: ":5432", note: "The PostgreSQL default" },
  { part: "Database", value: "/postgres", note: "The database name" },
  { part: "Parameters", value: "?sslmode=require", note: "Options after ?, joined with &" },
] as const;

export const CONNSTRING_SECTIONS: readonly Section[] = [
  {
    id: "format",
    heading: "Postgres connection string format",
    blocks: [
      {
        type: "p",
        text:
          "PostgreSQL clients accept a [connection URI](" +
          LIBPQ_URIS +
          ") with this shape. Both `postgres://` and `postgresql://` work as the scheme, and clients fill in defaults for parts you leave out, such as port 5432.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Format",
        code: `postgres://USER:PASSWORD@HOST:PORT/DATABASE?KEY=VALUE&KEY=VALUE`,
      },
      {
        type: "table",
        caption: "The parts of a Postgres connection string",
        head: ["Part", "Example", "What it is"],
        rows: [
          [
            "Scheme",
            "`postgres://`",
            "Tells the client it's a PostgreSQL URL. `postgresql://` works too.",
          ],
          [
            "User",
            "`USER`",
            "The database user. In Prisma Postgres it's generated for you and is the same in every credential for a database.",
          ],
          ["Password", "`PASSWORD`", "The password. Percent-encode any special characters."],
          [
            "Host",
            "`pooled.db.prisma.io`",
            "The server's hostname. Prisma Postgres uses `pooled.db.prisma.io` for pooled and `db.prisma.io` for direct connections.",
          ],
          ["Port", "`5432`", "The PostgreSQL port. 5432 is the default."],
          ["Database", "`postgres`", "The database to connect to."],
          ["Parameters", "`?sslmode=require`", "Options after `?`, joined with `&`."],
        ],
      },
    ],
  },
  {
    id: "examples",
    heading: "Postgres connection string examples",
    blocks: [
      { type: "h3", text: "A local database" },
      {
        type: "code",
        lang: "bash",
        title: ".env",
        code: `DATABASE_URL="postgresql://janedoe:mypassword@localhost:5432/mydb"`,
      },
      { type: "h3", text: "With SSL" },
      {
        type: "p",
        text:
          "Prisma Postgres requires SSL, so its connection strings always end in `?sslmode=require`. PostgreSQL defines [other `sslmode` values](" +
          LIBPQ_SSL +
          "), such as `verify-full`, for clients that should also check the server's certificate.",
      },
      {
        type: "code",
        lang: "bash",
        title: ".env",
        code: `DATABASE_URL="postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"`,
      },
      { type: "h3", text: "Pooled and direct" },
      {
        type: "p",
        text: "Every Prisma Postgres database has two connection strings with the same credentials. Only the host differs. Use the pooled one for application traffic and the direct one for migrations, Prisma Studio and `pg_dump`. [Postgres connection pooling](/postgres/connection-pooling) explains why.",
      },
      {
        type: "code",
        lang: "bash",
        title: ".env",
        code: `# Pooled: routes through PgBouncer, for your app
DATABASE_URL="postgres://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require"

# Direct: straight to the database, for migrations and admin tools
DIRECT_URL="postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"`,
      },
      { type: "h3", text: "Special characters in the password" },
      {
        type: "p",
        text: "Percent-encode special characters in any part of the URL, including the password. For example, `p@$$w0rd` becomes `p%40%24%24w0rd`. Left as is, an `@` in the password ends the user part early, and the client reads the rest as the host.",
      },
      {
        type: "code",
        lang: "typescript",
        title: "build-url.ts",
        code: `const password = encodeURIComponent("p@$$w0rd"); // "p%40%24%24w0rd"
const url = \`postgres://USER:\${password}@db.prisma.io:5432/postgres?sslmode=require\`;`,
      },
      {
        type: "p",
        text: "Prisma Postgres connection strings come ready to use, so copy them as they are rather than rebuilding them by hand.",
      },
      { type: "h3", text: "The schema parameter" },
      {
        type: "p",
        text: "In [Prisma ORM 7](/docs/orm/v7/reference/connection-urls), `?schema=` picks the PostgreSQL schema, as in `postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample`. It's read by Prisma ORM, not by PostgreSQL itself, so other tools such as `psql` don't understand it.",
      },
    ],
  },
  {
    id: "get-a-connection-string",
    heading: "Get a Postgres connection string in seconds",
    blocks: [
      { type: "h3", text: "From the terminal with create-db" },
      {
        type: "p",
        text: "[`npx create-db`](/docs/postgres/npx-create-db) creates a Prisma Postgres database and prints its connection string and a claim URL, with no account. The database is deleted after 24 hours unless you open the claim URL and keep it in your workspace.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Terminal",
        code: `npx create-db@latest`,
      },
      {
        type: "p",
        text: "Add `--env .env` to write `DATABASE_URL` and `CLAIM_URL` straight into a file. On a file that already exists it appends both lines and leaves any existing `DATABASE_URL` in place, so check for duplicates. Coding agents can use `--json` to get the connection string, claim URL and deletion time as JSON.",
      },
      { type: "h3", text: "From the Prisma Console" },
      {
        type: "p",
        text: "Open your project in the [Prisma Console](https://console.prisma.io), select your database, choose Connect to your database, then Generate new connection string. Copy both the pooled and the direct string.",
      },
      {
        type: "p",
        text: "Each time you generate one, the Console creates a new credential: a new password for the same user. Older credentials keep working until you delete them.",
      },
      { type: "h3", text: "From the Prisma CLI" },
      {
        type: "p",
        text: "`npx prisma postgres create my-db` creates a database and prints its connection string once, so save it when it appears. See the [`postgres` CLI reference](/docs/cli/postgres).",
      },
    ],
  },
  {
    id: "where-to-put-it",
    heading: "Where to put your connection string",
    blocks: [
      { type: "h3", text: "In .env as DATABASE_URL for Prisma ORM" },
      {
        type: "p",
        text: "Store it in `.env` as `DATABASE_URL`, and keep `.env` out of source control. Prisma ORM 8's client reads it in `src/prisma/db.ts`:",
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
export const db = postgres({ contract, url: process.env.DATABASE_URL! });`,
      },
      {
        type: "p",
        text: "The Prisma CLI reads its connection from `prisma.config.ts`. Give it the direct string, so migrations bypass the pooler.",
      },
      { type: "h3", text: "As an environment variable on Prisma Compute" },
      {
        type: "p",
        text: "[Prisma Compute](/compute) injects project [environment variables](/docs/compute/environment-variables) into your deployments, scoped to production or preview:",
      },
      {
        type: "code",
        lang: "bash",
        title: "Terminal",
        code: `npx prisma project env add DATABASE_URL=postgres://... --role production
npx prisma project env add DATABASE_URL=postgres://... --role preview`,
      },
      {
        type: "p",
        text: "Values are write-only and resolve at deploy time, and `npx prisma project env list` shows names, never values. Point the preview `DATABASE_URL` at a non-production database if preview work must not touch production data.",
      },
      {
        type: "p",
        text: "Wherever it lives, keep the connection string in server-side secrets. Never commit it or ship it in code that runs in a browser.",
      },
    ],
  },
  {
    id: "common-errors",
    heading: "Common connection string errors and how to fix them",
    blocks: [
      {
        type: "list",
        items: [
          "**`DATABASE_URL` is missing.** The variable isn't set where the code runs, often only in production. [DATABASE_URL is missing](/postgres/database-url-missing) walks through the fix.",
          "**Connection refused or a timeout.** Check that the string uses port `5432` and `sslmode=require`. A corporate firewall or VPN may block outbound PostgreSQL traffic. Allowlist `*.db.prisma.io` on port 5432, or use the [serverless driver](/docs/postgres/database/serverless-driver), which connects over HTTPS. For a string that works locally but times out after deploy, see [this guide](/postgres/connection-timeout-after-deploy).",
          "**SSL errors.** Keep `sslmode=require` in Prisma Postgres strings, and check how your driver reads it. [SSL errors connecting to hosted Postgres](/postgres/ssl-connection-error) covers each driver.",
          "**Password authentication fails.** The credential may have been deleted or rotated. Generate a new connection string, update `DATABASE_URL` and redeploy.",
          "**The URL won't parse.** A special character in the password isn't percent-encoded, or the scheme is wrong. Prisma ORM 8 accepts only `postgres://` or `postgresql://` and rejects anything else with `RUNTIME.BINDING_INVALID`.",
          "**Migrations fail with lock or prepared statement errors.** The Prisma CLI is using the pooled string. Point it at the direct string, with host `db.prisma.io`.",
        ],
      },
    ],
  },
  {
    id: "keep-it-secret",
    heading: "Keep your connection string secret",
    blocks: [
      {
        type: "p",
        text: "Every Prisma Postgres credential has full access to its database. Give each app or service its own credential, so you can delete one app's password without breaking the others.",
      },
      {
        type: "p",
        text: "If a password leaks, replace it. Create a new credential, put its strings in your environment variables and redeploy, then delete the old credential. Rotating isn't enough, because after a rotate the old password can keep working. [Connecting to your database](/docs/postgres/database/connecting-to-your-database#rotate-or-delete-a-credential) has the steps.",
      },
    ],
  },
  {
    id: "plans",
    heading: "Plans",
    blocks: [
      {
        type: "p",
        text: "Every plan gives each database a pooled and a direct connection string, with SSL. The Free plan includes 200,000 operations a month, 2 GB of storage and up to 50 databases, with no credit card. Compare plans on the [pricing page](/pricing).",
      },
    ],
  },
];

export const CONNSTRING_RELATED = [
  { label: "Postgres connection pooling", href: "/postgres/connection-pooling" },
  { label: "Serverless Postgres", href: "/postgres/serverless" },
  { label: "DATABASE_URL is missing", href: "/postgres/database-url-missing" },
  {
    label: "Connecting to your database docs",
    href: "/docs/postgres/database/connecting-to-your-database",
  },
  { label: "create-db docs", href: "/docs/postgres/npx-create-db" },
  {
    label: "PostgreSQL connection URIs",
    href: "/dataguide/postgresql/short-guides/connection-uris",
  },
  { label: "Prisma Postgres", href: "/postgres" },
  { label: "Prisma ORM", href: "/orm" },
  { label: "Prisma Compute", href: "/compute" },
] as const;

export type FaqItem = { question: string; answer: string };

// Visible FAQ. Every answer also feeds FAQPage JSON-LD (see page.tsx).
export const CONNSTRING_FAQ: FaqItem[] = [
  {
    question: "What is a Postgres connection string?",
    answer:
      "A Postgres connection string is a URL that tells a client how to reach a PostgreSQL database: the user, password, host, port, database name and options such as `sslmode`. It looks like `postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`.",
  },
  {
    question: "What is the PostgreSQL connection string format?",
    answer:
      "`postgres://USER:PASSWORD@HOST:PORT/DATABASE?KEY=VALUE`. The scheme comes first, then the user and password, an `@`, the host and port, a `/` and the database name, and optional parameters after `?`, joined with `&`.",
  },
  {
    question: "What's the difference between postgres:// and postgresql://?",
    answer:
      "Nothing. PostgreSQL accepts both schemes, and so does Prisma ORM. Prisma Postgres connection strings use `postgres://`.",
  },
  {
    question: "What is the default Postgres port?",
    answer:
      "5432. Prisma Postgres uses port 5432 for both its pooled and direct connection strings.",
  },
  {
    question: "How do I get a Postgres connection string quickly?",
    answer:
      "Run [`npx create-db@latest`](/docs/postgres/npx-create-db). It creates a Prisma Postgres database and prints a connection string in seconds, with no account. Claim the database within 24 hours to keep it, or create one in the [Prisma Console](https://console.prisma.io) instead.",
  },
  {
    question: "What is DATABASE_URL?",
    answer:
      "`DATABASE_URL` is the environment variable Prisma ORM projects and the Prisma docs use for the connection string. Set it in `.env` for local work and as a project environment variable when you deploy, for example on Prisma Compute with `npx prisma project env add`.",
  },
  {
    question: "How do I put special characters in the password?",
    answer:
      "Percent-encode them. `p@$$w0rd` becomes `p%40%24%24w0rd`. In JavaScript, `encodeURIComponent()` does it for you.",
  },
  {
    question: "What does sslmode=require mean?",
    answer:
      "It tells the client to connect only over SSL. Prisma Postgres requires SSL, so keep `sslmode=require` in its connection strings.",
  },
  {
    question: "Should I use the pooled or the direct connection string?",
    answer:
      "Use the pooled string, with host `pooled.db.prisma.io`, for your app. Use the direct string, with host `db.prisma.io`, for migrations, Prisma Studio, `pg_dump` and anything that needs session state. See [Postgres connection pooling](/postgres/connection-pooling).",
  },
  {
    question: "Where do I find my Prisma Postgres connection string?",
    answer:
      "In the Prisma Console: open your project, select your database, choose Connect to your database, then Generate new connection string. `npx create-db` and `npx prisma postgres create` also print one when they create a database.",
  },
];

export const CONNSTRING_CLOSER = {
  headline: "Get a working connection string now",
  body: "Run npx create-db for a Prisma Postgres database and its connection string in seconds, with no account. Paste it into any Postgres client, then claim it to keep it.",
  benefits: ["No account to start", "Pooled and direct strings", "Works with any Postgres client"],
  primaryCta: CONNSTRING_PRIMARY_CTA,
  secondaryCta: {
    label: "Read the docs",
    href: "/docs/postgres/database/connecting-to-your-database",
  },
} as const;

/** Text alternative for the hero diagram (see _diagram.tsx). */
export const CONNSTRING_DIAGRAM_LABEL =
  "An annotated Prisma Postgres connection string: postgres://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require. The scheme postgres:// marks it as PostgreSQL. USER is the database user. PASSWORD follows a colon and must be percent-encoded. The host after the @ is pooled.db.prisma.io, or db.prisma.io for a direct connection. The port is 5432, the database is postgres, and the parameter sslmode=require follows a question mark.";
