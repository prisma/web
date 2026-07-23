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

export const SITE_HOME_DESCRIPTION =
  "Prisma gives TypeScript and Node.js teams Prisma ORM, Prisma Postgres, and Prisma Compute: a type-safe ORM, managed Postgres, and Compute for deploying TypeScript apps, from schema to deployed app.";
