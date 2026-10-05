/**
 * The brand Google should show as the site name in search results. Every page
 * title on the domain has to carry this — a title with no brand in it gets
 * rewritten by Google using inbound anchor text instead, which is how the
 * homepage ended up listed as "Prisma ORM".
 */
export const SITE_NAME = "Prisma";

export const SITE_HOME_TAGLINE = "Agent Infrastructure for TypeScript";

/** Brand-first, per Google's guidance for homepage titles. */
export const SITE_HOME_TITLE = `${SITE_NAME} | ${SITE_HOME_TAGLINE}`;

// Opens with the positioning sentence shared verbatim by /compute, /postgres,
// the docs Compute index and the package READMEs (content brief, "entity
// wording"), so every surface describes the same product in the same words.
export const SITE_HOME_DESCRIPTION =
  "Prisma Compute hosts TypeScript apps (Node.js, Bun or Next.js) next to Prisma Postgres on one plan. Generally available since August 2026. Free plan, no credit card. Any Postgres client works; Prisma ORM is optional. Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute.";

/**
 * The Organization and WebSite nodes in the site's structured data
 * (lib/structured-data.ts). They describe Prisma the company and prisma.io,
 * not one product, so they do not reuse SITE_HOME_DESCRIPTION, which opens
 * with the Prisma Compute positioning sentence.
 */
export const SITE_ORGANIZATION_DESCRIPTION =
  "Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute: a TypeScript ORM, a managed Postgres database, and hosting for TypeScript apps next to that database on one plan.";
