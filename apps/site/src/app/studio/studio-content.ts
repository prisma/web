/**
 * Plain data for the /studio page.
 *
 * Kept React-free so both the page and its Markdown rendition
 * (`@/lib/markdown/studio`) can read the same copy without a route handler
 * pulling components in.
 *
 * Rewritten in the November 2026 SEO pass to target the search terms the page
 * never ranked for (primary: "prisma studio"; secondary: "postgres gui",
 * "postgresql gui", "visual database editor", "what is prisma studio", "npx
 * prisma studio", "view and edit postgres data online"). The surfaces and
 * database list match the Prisma docs (apps/docs/content/docs/studio) and the
 * `@prisma/studio-core` package: PostgreSQL, MySQL and SQLite, with or without
 * Prisma ORM.
 */

export const CONSOLE_URL = "https://console.prisma.io/login";
export const STUDIO_DOCS_URL = "https://www.prisma.io/docs/studio";
export const STUDIO_VSCODE_DOCS_URL =
  "https://www.prisma.io/docs/studio/integrations/vscode-integration";
export const STUDIO_EMBED_DOCS_URL = "https://www.prisma.io/docs/studio/integrations/embedding";
export const STUDIO_EMBED_DEMO_URL = "https://github.com/prisma/studio-core-demo";
export const STUDIO_VSCODE_EXTENSION_URL =
  "https://marketplace.visualstudio.com/items?itemName=Prisma.prisma";

export const STUDIO_PORT = 5555;

/**
 * The short definition paragraph under the H1. 40–60 words so a featured
 * snippet can quote it whole, with the primary search term up front, the
 * category, the surfaces and the port.
 */
export const STUDIO_DEFINITION =
  "Prisma Studio is a free visual database editor for PostgreSQL, MySQL and SQLite. Run `npx prisma studio` to open it in your browser at `http://localhost:5555`, use it in VS Code, or open the Prisma Console to view and edit your Postgres data online. It works with or without Prisma ORM.";

/**
 * The hero sub-headline. Kept distinct from `STUDIO_DEFINITION` because the
 * hero reads it as prose next to the H1, while the definition is a standalone
 * paragraph the FAQ schema and featured snippets quote verbatim.
 */
export const STUDIO_SUBHEADLINE =
  "A visual database editor and Postgres GUI for Prisma. Open it locally with one command, in VS Code, or in the Prisma Console. Works with PostgreSQL, MySQL and SQLite, with or without Prisma ORM.";

export const TRY_STUDIO_COMMAND = `npx try-prisma@latest --template orm/starter \\
&& cd hello-prisma \\
&& npx prisma studio`;

/**
 * The four surfaces Studio runs on. Order matches the docs and reads from
 * easiest (one command) to most involved (embedded in your app).
 */
export const OPEN_STUDIO_WAYS = [
  {
    eyebrow: "Locally, in your browser",
    title: "Run `npx prisma studio`",
    description:
      "In a Prisma project, run `npx prisma studio` and Studio opens at `http://localhost:5555`. No install, no login, no additional client. Pass `--url` to connect to any PostgreSQL, MySQL or SQLite database without `schema.prisma`.",
    accent: "bg-prism-yellow-300",
    href: STUDIO_DOCS_URL,
    linkLabel: "Studio quickstart",
  },
  {
    eyebrow: "Inside your editor",
    title: "Prisma Studio in VS Code",
    description:
      "Install the Prisma VS Code extension, sign in to Prisma Console, and pick a database to open Prisma Studio in a VS Code panel next to your code. Supports the same PostgreSQL, MySQL and SQLite databases.",
    accent: "bg-prism-cyan-300",
    href: STUDIO_VSCODE_DOCS_URL,
    linkLabel: "Studio in VS Code",
  },
  {
    eyebrow: "In the Prisma Console",
    title: "Browse your data online",
    description:
      "With a Prisma Postgres database in the Prisma Console, Studio is one click away in the browser. Share access with your team, no local setup or connection strings to pass around.",
    accent: "bg-prism-red-300",
    href: CONSOLE_URL,
    linkLabel: "Open in Prisma Console",
  },
  {
    eyebrow: "Embedded in your app",
    title: "Embed Studio with `@prisma/studio-core`",
    description:
      "Drop the Studio React component into your own app so your users can view and edit their data. The package is Apache 2.0, free for production use; the Prisma branding stays visible. Supports PostgreSQL, SQLite and MySQL.",
    accent: "bg-foreground/80",
    href: STUDIO_EMBED_DOCS_URL,
    linkLabel: "Embed Prisma Studio",
  },
] as const;

/**
 * Databases the docs explicitly list as supported by Prisma Studio and the
 * `@prisma/studio-core` package.
 *
 * Source: `apps/docs/content/docs/studio/index.mdx`,
 * `apps/docs/content/docs/studio/integrations/vscode-integration.mdx`, and
 * `apps/docs/content/docs/studio/integrations/embedding.mdx`. CockroachDB and
 * MongoDB are documented as not supported yet.
 */
export const SUPPORTED_DATABASES = [
  {
    name: "PostgreSQL",
    description:
      "Any Postgres database, including Prisma Postgres, Neon, Supabase, RDS and a local Postgres instance.",
  },
  {
    name: "MySQL",
    description: "MySQL databases, locally or hosted. Supported through `mysql2` when embedded.",
  },
  {
    name: "SQLite",
    description:
      "Local SQLite database files, for prototypes, tests and single-user apps. Supported through `better-sqlite3` when embedded.",
  },
] as const;

/**
 * Comparison with the GUIs people search alongside Prisma Studio.
 *
 * The copy stays fair: Prisma's own advantages sit in the "Prisma Studio"
 * column, each other tool's real strengths stay in its column. Pick-one-or-the-
 * other guidance lives on the dedicated comparison pages under /compare.
 */
export type ComparisonValue = {
  summary: string;
  detail?: string;
};

export type ComparisonRow = {
  feature: string;
  prismaStudio: ComparisonValue;
  pgadmin: ComparisonValue;
  tableplus: ComparisonValue;
  dbeaver: ComparisonValue;
  drizzleStudio: ComparisonValue;
};

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    feature: "Price",
    prismaStudio: { summary: "Free" },
    pgadmin: { summary: "Free (open source)" },
    tableplus: { summary: "Free tier, paid license from $89" },
    dbeaver: { summary: "Free (Community), paid Pro tier" },
    drizzleStudio: { summary: "Free" },
  },
  {
    feature: "Open locally with one command",
    prismaStudio: { summary: "`npx prisma studio` on port 5555" },
    pgadmin: { summary: "Separate desktop or server install" },
    tableplus: { summary: "Desktop app, one-off install" },
    dbeaver: { summary: "Desktop app, one-off install" },
    drizzleStudio: { summary: "`drizzle-kit studio` or a web host" },
  },
  {
    feature: "Databases supported",
    prismaStudio: { summary: "PostgreSQL, MySQL, SQLite" },
    pgadmin: { summary: "PostgreSQL only" },
    tableplus: { summary: "Postgres, MySQL, SQLite, SQL Server, Redis, and more" },
    dbeaver: { summary: "Dozens, relational and NoSQL" },
    drizzleStudio: { summary: "Postgres, MySQL, SQLite and more through Drizzle drivers" },
  },
  {
    feature: "Works without an ORM",
    prismaStudio: { summary: "Yes, with `--url` or a `.env` connection string" },
    pgadmin: { summary: "Yes, native database tool" },
    tableplus: { summary: "Yes, native database tool" },
    dbeaver: { summary: "Yes, native database tool" },
    drizzleStudio: { summary: "No, Drizzle ORM required" },
  },
  {
    feature: "Edit rows in a spreadsheet view",
    prismaStudio: { summary: "Yes" },
    pgadmin: { summary: "Yes" },
    tableplus: { summary: "Yes" },
    dbeaver: { summary: "Yes" },
    drizzleStudio: { summary: "Yes" },
  },
  {
    feature: "Follow relations by clicking them",
    prismaStudio: { summary: "Yes, model-aware with Prisma ORM" },
    pgadmin: { summary: "Through JOIN queries" },
    tableplus: { summary: "Foreign-key navigation" },
    dbeaver: { summary: "Foreign-key navigation" },
    drizzleStudio: { summary: "Yes, from the Drizzle schema" },
  },
  {
    feature: "Browser-based team access",
    prismaStudio: { summary: "Yes, in the Prisma Console" },
    pgadmin: { summary: "Through pgAdmin server mode you host yourself" },
    tableplus: { summary: "No, desktop only" },
    dbeaver: { summary: "DBeaver CloudBeaver, separate product" },
    drizzleStudio: { summary: "`drizzle-kit studio` or a self-hosted web build" },
  },
  {
    feature: "Embed in your own app",
    prismaStudio: { summary: "Yes, `@prisma/studio-core` React component" },
    pgadmin: { summary: "No" },
    tableplus: { summary: "No" },
    dbeaver: { summary: "No" },
    drizzleStudio: { summary: "Not officially" },
  },
];

export const COMPARISON_COLUMNS = [
  "Prisma Studio",
  "pgAdmin",
  "TablePlus",
  "DBeaver",
  "Drizzle Studio",
] as const;

/**
 * How Studio fits with the other three Prisma products. Content directive:
 * every Prisma product page tells the whole story across ORM, Postgres and
 * Compute, so a reader on /studio sees how the piece joins the stack.
 */
export const STACK_FIT = [
  {
    product: "Prisma ORM",
    href: "/orm",
    accent: "bg-prism-cyan-400",
    body: "When your project has a `schema.prisma`, Prisma Studio reads it and knows your models and relations. Click through a foreign key, filter by an enum, and edit rows with the types your schema declares.",
  },
  {
    product: "Prisma Postgres",
    href: "/postgres",
    accent: "bg-prism-yellow-400",
    body: "Prisma Postgres databases open in Studio directly from the Prisma Console. Your team gets a shared, authenticated way to view and edit data, with no connection strings to hand out and no desktop app to install.",
  },
  {
    product: "Prisma Compute",
    href: "/compute",
    accent: "bg-prism-red-500",
    body: "When you deploy a TypeScript app on Prisma Compute, its Prisma Postgres database is right there in the same project, and Studio opens on it from the Console. One place for the app, its data and the people editing it.",
  },
] as const;

/**
 * FAQ. The same strings feed the visible accordion and the FAQPage JSON-LD
 * in `app/studio/page.tsx`, with the inline link and code markup stripped
 * back to plain text by `createFaqStructuredData`, so visible and structured
 * answers cannot drift.
 *
 * Each answer is a self-contained claim, so a featured snippet or AI answer
 * can quote it on its own.
 */
export const STUDIO_FAQ = [
  {
    question: "What is Prisma Studio?",
    answer:
      "Prisma Studio is a free visual database editor for PostgreSQL, MySQL and SQLite. It opens in your browser at `http://localhost:5555` when you run `npx prisma studio`, or in VS Code and the Prisma Console, and lets you view, filter and edit rows in a spreadsheet-like interface without writing SQL.",
  },
  {
    question: "Is Prisma Studio free?",
    answer:
      "Yes. Running Prisma Studio locally with `npx prisma studio` is free, the VS Code integration is free, and Prisma Studio in the Prisma Console is included on every plan, including the free plan. The `@prisma/studio-core` package used to embed Studio in your own app is licensed under Apache 2.0 and free for production use; the Prisma branding must stay visible.",
  },
  {
    question: "How do I open Prisma Studio?",
    answer:
      'In a Prisma project, run `npx prisma studio` in your terminal and Studio opens at `http://localhost:5555`. Without a Prisma project, pass a connection string with `--url="postgresql://user:password@localhost:5432/mydb"`. You can also open it in VS Code through the [Prisma extension](/docs/studio/integrations/vscode-integration) or in the browser from the [Prisma Console](https://console.prisma.io/login).',
  },
  {
    question: "Does Prisma Studio work without Prisma ORM?",
    answer:
      'Yes. Pass a connection string with `npx prisma studio --url="..."` and Studio connects straight to the database, with no `schema.prisma` required. You still get a spreadsheet view and inline editing. Model-aware navigation between related tables is richer when a Prisma ORM schema is present.',
  },
  {
    question: "Which databases does Prisma Studio support?",
    answer:
      "PostgreSQL, MySQL and SQLite. The same three are supported locally, in VS Code, in the Prisma Console (for Prisma Postgres) and through the `@prisma/studio-core` package when you embed Studio in your own app. CockroachDB and MongoDB support is not available yet.",
  },
  {
    question: "What port does `npx prisma studio` use?",
    answer:
      "Port 5555 by default. Studio opens at `http://localhost:5555`. Pass `--port` to use a different one, for example `npx prisma studio --port 5556` when 5555 is busy.",
  },
] as const;

/**
 * The old abstract visual grid. The /studio page keeps these while real
 * product screenshots from the November 2026 rebrand are being added to the
 * repo. They sit in dark ink frames and illustrate each surface Studio runs on.
 * See the PR's "Claims to confirm" list.
 */
export const FEATURE_ROWS = [
  {
    eyebrow: "Browse and filter",
    title: "Explore your data without SQL",
    description:
      "Open a table in the spreadsheet view, filter by any column, and jump across foreign keys. The schema sidebar lists every model; the detail panel edits one row at a time.",
    imageSrc: "/illustrations/studio/explore.svg",
    imageAlt: "Prisma Studio data exploration interface with highlighted filters",
    imageWidth: 570,
    imageHeight: 275,
  },
  {
    eyebrow: "Multiple tabs",
    title: "Keep several tables open at once",
    description:
      "Studio tabs let you browse related tables in parallel: pull up users, their orders and the orders' line items without losing your place.",
    imageSrc: "/illustrations/studio/tabs.svg",
    imageAlt: "Prisma Studio with multiple tabs open",
    imageWidth: 561,
    imageHeight: 215,
  },
  {
    eyebrow: "Edit from your own app",
    title: "Embed Studio so your users can view and edit their data",
    description:
      "The `@prisma/studio-core` React component gives your users the same spreadsheet-style editor inside your product, backed by your own `/studio` API route and your `DATABASE_URL`.",
    imageSrc: "/illustrations/studio/embed.svg",
    imageAlt: "Embedded Prisma Studio experience inside an app",
    imageWidth: 582,
    imageHeight: 224,
  },
] as const;
