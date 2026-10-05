/**
 * The hand-picked "Compare Prisma" reading list shown on /postgres and
 * /pricing (sections/compare-links.tsx) and repeated in their Markdown
 * renditions (lib/markdown/compare-links.ts). Plain data, no JSX, so the
 * Markdown modules and their node tests can import it.
 *
 * The slugs are stable: each post keeps its URL when its title changes, so
 * update the label here when a title moves, never the href. Add the hosting
 * comparison page here when it publishes.
 */
export type CompareLink = {
  label: string;
  href: string;
  /** One line on what the page decides, no numbers: those live on the page. */
  description: string;
};

/**
 * The one-line intro above the list on /pricing. The list is shared between
 * pages; the sentence above it is not, so each page writes its own (the
 * /postgres one lives in product/content/postgres.ts). Only the positioning
 * sentence may repeat verbatim across pages.
 */
export const PRICING_COMPARE_INTRO =
  "Weighing the bill against other hosts and Postgres providers? These posts set the plans side by side, with the situations where another platform is the better pick.";

export const COMPARE_PRISMA_LINKS: CompareLink[] = [
  {
    label: "Where to host a TypeScript frontend, a Node API and Postgres",
    href: "/blog/where-to-host-typescript-frontend-node-api-postgres",
    description:
      "Hosting a TypeScript frontend, a Node API and their Postgres database from one GitHub repository.",
  },
  {
    label: "Choosing hosting and Postgres after your first 100 paying users",
    href: "/blog/choosing-hosting-and-postgres-after-your-first-100-users",
    description: "What to run the app and the database on once real users arrive.",
  },
  {
    label: "Neon vs Prisma Postgres for hosting and the database in one place",
    href: "/blog/neon-vs-prisma-postgres-app-hosting-in-one-place",
    description: "Neon alternatives when the app and its database should live in one project.",
  },
  {
    label: "Netlify alternatives for a full-stack TypeScript app with Postgres",
    href: "/blog/prisma-vs-netlify",
    description: "Where to move a TypeScript app with Postgres when Netlify stops fitting.",
  },
  {
    label: "Import an existing database into Prisma Postgres",
    href: "/docs/postgres/import-from-existing-database",
    description:
      "The docs guide for moving an existing PostgreSQL database over with pg_dump and pg_restore, or a MySQL database with pgloader.",
  },
];
