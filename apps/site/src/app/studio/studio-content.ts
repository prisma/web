/**
 * Plain data for the /studio page.
 *
 * Kept React-free so both the page and its Markdown rendition
 * (`@/lib/markdown/studio`) can read the same copy without a route handler
 * pulling components in.
 */

export const CONSOLE_URL = "https://console.prisma.io/login";
export const STUDIO_VSCODE_URL =
  "https://www.prisma.io/docs/studio/integrations/vscode-integration";
// Studio ships only in the Prisma ORM 7 CLI (npm tag `prev`), and Prisma ORM 8
// has no studio command, so the project-agnostic form is the one that works
// everywhere. Inside a Prisma ORM 8 project it must run from outside the
// project folder (QUICK_ACCESS.local.note). See
// apps/docs/content/docs/studio/prisma-next.mdx.
export const OPEN_STUDIO_COMMAND = 'npx prisma@prev studio --url "postgresql://..."';
/**
 * The seeded starter, one step per line; the command box copies it as one &&
 * chain. The starter pins Prisma 7.0.0, whose own `prisma studio` opens an
 * older Studio, so the last step uses the newest Prisma 7 CLI (`prev`), which
 * reads the starter's config and opens the current generation. Drop the tag
 * once prisma-examples bumps its pin.
 */
export const TRY_STUDIO_STEPS = [
  "npx try-prisma@latest --template orm/starter",
  "cd hello-prisma",
  "npx prisma@prev studio",
] as const;

// Hero copy follows the 2026-11 SEO review: the primary query is "prisma
// studio", so the H1 carries the name and the subheadline is the definition
// (what it is, which databases, how it works). Facts checked against
// apps/docs/content/docs/studio: any database via --url, no Prisma ORM
// required, local server on port 5555.
export const STUDIO_HERO = {
  headline: "Prisma Studio: see and edit your database",
  headlineEmphasis: "see and edit",
  subheadline:
    "Prisma Studio is a free visual editor for PostgreSQL, MySQL and SQLite. Browse, edit and query your data, with or without Prisma ORM.",
  // Studio in Console lives inside each database, so no link can open it for a
  // visitor without one. "Get started" jumps to Quick access below, where the
  // copy-ready launch commands are, so the button starts Studio on this page
  // instead of sending people to the docs.
  primaryCta: { label: "Get started", href: "#quick-access" },
  secondaryCta: { label: "Open Prisma Console", href: CONSOLE_URL },
};

// The first section under the hero: the two ways to open Studio. It took
// over from three intro cards; their copy carries over, with "No setup
// required" and "Real-time collaboration" folded into the Console path they
// described.
export const QUICK_ACCESS = {
  title: "Quick access to your database",
  intro: "Connect to your Prisma Postgres database or bring your own.",
  local: {
    title: "On your machine",
    description:
      "Point Studio at any database with one command, or start from a seeded example. It opens in your browser at localhost:5555.",
    note: "In a Prisma ORM 8 project, run the Any database command from the parent folder.",
  },
  console: {
    title: "In Prisma Console",
    description:
      "Studio is included with Prisma's [Postgres hosting](/postgres), right in Prisma Console. Skip installation and go straight to your data.",
    points: [
      "No local setup or configuration",
      "Your whole team works on the same database, with role-based access",
    ],
    cta: { label: "Open Prisma Console", href: CONSOLE_URL },
    // The same Console route inside the editor: the Prisma extension signs in
    // to Prisma Console and opens a database in Studio.
    secondaryCta: { label: "Use it in VS Code", href: STUDIO_VSCODE_URL },
  },
} as const;

/**
 * The feature tour under Quick access: six stops, one screenshot each, all
 * captured from the same Studio at 1040x643.
 */
export const STUDIO_TOUR = {
  title: "Browse, query and change your data",
  stops: [
    {
      label: "Relations",
      title: "Navigate complex relationships",
      description:
        "Explore data relationships with clickable, model-aware navigation. Follow any record to the rows it links to.",
      imageSrc: "/illustrations/studio/tour/relations.png",
      imageAlt:
        "Prisma Studio organizations table with each row's tier and arrow links to its feature flags, incidents and team members",
    },
    {
      label: "Filtering",
      title: "Find exactly the rows you need",
      description:
        "Browse with filters and search, no SQL required. Filter on any column, or write a raw SQL WHERE clause when point-and-click isn't enough.",
      imageSrc: "/illustrations/studio/tour/filter.png",
      imageAlt:
        "Prisma Studio filter menu over the team_members table, listing each column with its type and a SQL WHERE clause option",
    },
    {
      label: "Visualizer",
      title: "See your whole schema at a glance",
      description:
        "Every table, column and relation laid out on one canvas. Primary keys, foreign keys and nullable fields are marked.",
      imageSrc: "/illustrations/studio/tour/visualizer.png",
      imageAlt:
        "Prisma Studio Visualizer showing the task table linked to tag, task_tag, attachment and comment",
    },
    {
      label: "SQL editor",
      title: "Drop into SQL when you need it",
      description:
        "Write a query and run it with Cmd/Ctrl+Enter, right next to your tables. Studio's Console panel lists each statement it runs, with its parameters.",
      imageSrc: "/illustrations/studio/tour/sql.png",
      imageAlt:
        "Prisma Studio SQL editor running a select on team_members, with names, titles and skills in the results",
    },
    {
      label: "Query insights",
      title: "Find your slowest queries",
      description:
        "In Prisma Console, watch queries per second and average latency for your Prisma Postgres database. Each query shows its latency, executions and rows returned.",
      imageSrc: "/illustrations/studio/tour/queries.png",
      imageAlt:
        "Prisma Studio Queries view with a latency chart and recent queries with their latency, executions and rows returned",
    },
    {
      label: "Migrations",
      title: "See what every migration changed",
      description:
        "Step through applied Prisma ORM 8 migrations on PostgreSQL and the SQL each one ran, with destructive changes flagged. Migrations recorded with a schema snapshot also open as a visual diff of what they added, changed or removed.",
      imageSrc: "/illustrations/studio/tour/migrations.png",
      imageAlt:
        "Prisma Studio Migrations timeline with Add Attachments open as a schema diff of the new Attachment table",
    },
  ],
} as const;

// Docs pages the comparison and FAQ link to.
export const STUDIO_PRISMA_ORM_URL = "https://www.prisma.io/docs/studio/prisma-next";
export const STUDIO_EMBED_URL = "https://www.prisma.io/docs/studio/integrations/embedding";
export const STUDIO_CLI_URL = "https://www.prisma.io/docs/cli/studio";

/**
 * Embedding Studio with `@prisma/studio-core`, between the tour and the
 * comparison. Facts and the Markdown snippet follow apps/docs/content/docs/studio/
 * integrations/embedding.mdx (its minimal PostgreSQL example, with the adapter
 * built once at module level instead of in useMemo). Licence and branding as
 * in the FAQ.
 */
export const STUDIO_EMBED = {
  title: "Embed Studio in your own app",
  intro:
    "`@prisma/studio-core` gives you Studio as a React component. It sends each query to an endpoint in your own backend, which runs it against your database.",
  useCases: [
    "Admin dashboards for editing data",
    "Multi-tenant apps where each customer has their own database",
    "Let your users view and edit their own data",
  ],
  facts:
    "Works with PostgreSQL, MySQL and SQLite. Free for production use under Apache 2.0, and you can remove or replace the Prisma branding.",
  cta: { label: "Read the embedding guide", href: STUDIO_EMBED_URL },
  demo: { label: "See the demo on GitHub", href: "https://github.com/prisma/studio-core-demo" },
  // Studio as a host app would show it: a live capture of the current
  // Studio inside an illustrative admin shell ("Fieldline", a made-up brand),
  // same 1040x643 capture size as the hero and tour.
  imageSrc: "/illustrations/studio/embed.png",
  imageAlt:
    "Prisma Studio embedded in an example admin app: the app's own sidebar and header around Studio, open on an organizations table, with the Prisma Studio logo visible",
  address: "app.example.com/admin/data",
  // The minimal setup. /studio.md carries it; the page shows the screenshot.
  code: `import { Studio } from "@prisma/studio-core/ui";
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core";
import { createStudioBFFClient } from "@prisma/studio-core/data/bff";
import "@prisma/studio-core/ui/index.css";

// Each query goes to the /studio endpoint in your backend.
const adapter = createPostgresAdapter({
  executor: createStudioBFFClient({ url: "http://localhost:4242/studio" }),
});

export function AdminData() {
  return <Studio adapter={adapter} />;
}`,
} as const;

/**
 * Prisma Studio next to the database GUIs people compare it with.
 *
 * Every cell was checked on 2026-11-19 against at least three sources: the
 * vendor's own site, docs or pricing page, plus the tool's repo, changelog or
 * a recent independent review. Rows where a competitor's answer rested only on
 * the absence of evidence (ER diagrams, migration history, AI) were left out
 * rather than guessed. Prices are in USD as each vendor shows them; recheck
 * them before changing this table, they move.
 */
export const STUDIO_COMPARISON = {
  title: "How Prisma Studio compares",
  intro:
    "Prisma Studio is built for browsing and editing data, from one command or inside Prisma Console. The desktop clients do more database administration; here is how they line up.",
  corner: "Feature",
  columns: ["Prisma Studio", "pgAdmin", "DBeaver", "TablePlus", "Drizzle Studio"],
  // Each product's own mark, in column order, shown in monochrome in the
  // header. Sources: Prisma from the brand lockup (public/logo/black.svg), Drizzle from this repo, pgAdmin from
  // pgadmin-org/pgadmin4 (pkg/mac icon assets), DBeaver from dbeaver/dbeaver
  // (ui.app.standalone icons), TablePlus from tableplus.com's app icon.
  columnLogos: [
    "/logos/prisma-mark.svg",
    "/logos/pgadmin.svg",
    "/logos/dbeaver.png",
    "/logos/tableplus.png",
    "/icons/technologies/drizzle_light.svg",
  ],
  rows: [
    {
      label: "Price",
      cells: [
        "Free",
        "Free, open source",
        "Community edition free; paid editions from $113 a year",
        "Free version (2 tabs, 2 windows); licences from $99",
        "Free for local use",
      ],
    },
    {
      label: "How it runs",
      cells: [
        "In your browser, from one CLI command, or inside Prisma Console",
        "Desktop app, or a self-hosted web server",
        "Desktop app; the web version is CloudBeaver",
        "Native desktop app, plus iOS",
        "In your browser, from drizzle-kit",
      ],
    },
    {
      label: "Databases",
      cells: [
        "PostgreSQL, MySQL, SQLite",
        "PostgreSQL",
        "100+, including PostgreSQL, MySQL, SQLite",
        "20+, including PostgreSQL, MySQL, SQLite",
        "PostgreSQL, MySQL, SQLite and more",
      ],
    },
    {
      label: "Setup",
      cells: [
        "None beyond Node.js: point it at any database with a connection string",
        "Install the app",
        "Install the app",
        "Install the app",
        "Needs drizzle-kit and a drizzle.config.ts",
      ],
    },
    {
      label: "Edit rows in a grid",
      cells: ["Yes", "Yes", "Yes", "Yes", "Yes"],
    },
    {
      label: "SQL editor",
      cells: ["Yes", "Yes", "Yes", "Yes", "Yes"],
    },
    {
      label: "Shared team access",
      cells: [
        "Prisma Console, on every plan",
        "Self-hosted server mode",
        "Paid editions (CloudBeaver Enterprise, Team Edition)",
        "No shared workspace",
        "Self-hosted Drizzle Gateway",
      ],
    },
    {
      label: "Embed in your own app",
      cells: [
        "Free React component (Apache 2.0)",
        "Not offered",
        "Not offered",
        "Not offered",
        "Paid component, price on request",
      ],
    },
  ],
  note: "Checked November 2026 against each vendor's site and docs. Prices are in USD as each vendor lists them.",
  sources: [
    { label: "pgAdmin", href: "https://www.pgadmin.org" },
    { label: "DBeaver editions", href: "https://dbeaver.com/edition/" },
    { label: "TablePlus pricing", href: "https://tableplus.com/pricing" },
    { label: "Drizzle Studio", href: "https://orm.drizzle.team/drizzle-studio/overview" },
  ],
} as const;

/**
 * Questions people search for about Prisma Studio. Answers are plain strings
 * with the FAQ renderer's inline markup (links, `code`), so the same text
 * feeds the accordion, the FAQPage JSON-LD and /studio.md. Facts checked on
 * 2026-11-19 against the Studio docs, the npm registry and the prisma/studio
 * repo.
 */
export const STUDIO_FAQ = [
  {
    question: "Is Prisma Studio free?",
    answer:
      "Yes. Studio is free to run locally, and Studio in Prisma Console is included on every plan, including Free. Embedding it in your own app with `@prisma/studio-core` is free for production use under Apache 2.0, and you can remove or replace the Prisma branding. Start with [free PostgreSQL hosting](/postgres/free-postgresql-hosting) and view your data in Studio straight away.",
  },
  {
    question: "How do I open Prisma Studio?",
    answer: `In a Prisma ORM 7 project, run \`npx prisma studio\`. It opens in your browser at http://localhost:5555. For any database, pass a connection string instead: \`npx prisma@prev studio --url "postgresql://..."\`. Prisma ORM 8 has no studio command of its own, so run that from a directory outside your project. See [Studio with Prisma ORM](${STUDIO_PRISMA_ORM_URL}).`,
  },
  {
    question: "Which databases does Prisma Studio support?",
    answer:
      "PostgreSQL, MySQL and SQLite, whether you run it locally, open it in Prisma Console or embed it. CockroachDB and MongoDB are not supported yet.",
  },
  {
    question: "Do I need Prisma ORM to use Prisma Studio?",
    answer:
      "No. Start it with `--url` and a connection string, and Studio reads the tables straight from your database. It works the same whether or not the project uses [Prisma ORM](/orm).",
  },
  {
    question: "Can I change the port Prisma Studio runs on?",
    answer: `Yes. Studio uses port 5555 by default; pass \`--port\` to pick another, and \`--browser none\` to start it without opening a browser tab. See the [studio command reference](${STUDIO_CLI_URL}).`,
  },
  {
    question: "Can my team use Prisma Studio together?",
    answer:
      "Yes, in Prisma Console. Every Prisma Postgres database has a Studio tab, so nobody needs a local setup, and workspace members with the Admin or Developer role can use it.",
  },
  {
    question: "Can I embed Prisma Studio in my own app?",
    answer: `Yes. \`@prisma/studio-core\` gives you a React component that calls an endpoint in your own backend, which runs the queries against PostgreSQL, MySQL or SQLite. Use it for admin dashboards, multi-tenant apps, or to let your users edit their own data. See [Embed Studio](${STUDIO_EMBED_URL}).`,
  },
  {
    question: "How is Prisma Studio different from pgAdmin, DBeaver or TablePlus?",
    answer:
      "Those are desktop database clients with broad administration features, and pgAdmin works with PostgreSQL only. Studio is focused on viewing and editing data: it runs in your browser from one command, is built into Prisma Console for teams, and can be embedded in your own app.",
  },
] as const;
