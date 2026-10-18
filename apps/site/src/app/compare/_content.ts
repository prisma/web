export const COMPARISON_CTA = {
  headline: "Ready to build with Prisma?",
  headlineMaxWidth: "max-w-[22ch]",
  body: "Free to start, no credit card required.",
  bodyMaxWidth: "max-w-[44ch]",
  checks: [
    { label: "Create a database and start building in minutes", color: "text-prism-cyan-500" },
    { label: "Read the docs for guides and API reference", color: "text-prism-yellow-400" },
    { label: "Trusted by 500K+ developers globally", color: "text-prism-red-500" },
  ],
  primaryCta: { label: "Get started free", href: "https://console.prisma.io" },
  secondaryCta: { label: "Talk to us", href: "/contact" },
} as const;

/**
 * Closing action on ORM comparisons (Kysely, Mongoose). The 500K+ line is how
 * many people use Prisma ORM; it stays. The buttons go to the ORM quickstart
 * and Prisma Postgres rather than a generic console pitch.
 */
export const ORM_COMPARISON_CTA = {
  headline: "Add Prisma ORM to an existing project",
  headlineMaxWidth: "max-w-[28ch]",
  body: "Free to start, no credit card required.",
  bodyMaxWidth: "max-w-[44ch]",
  checks: COMPARISON_CTA.checks,
  primaryCta: {
    label: "Get started with Prisma ORM",
    href: "/docs/prisma-orm/quickstart/postgresql",
  },
  secondaryCta: {
    label: "Get started with Prisma Postgres",
    href: "https://console.prisma.io",
  },
} as const;

export const ORM_HERO_CTAS = {
  primary: {
    label: "Get started with Prisma ORM",
    href: "/docs/prisma-orm/quickstart/postgresql",
  },
  secondary: {
    label: "Get started with Prisma Postgres",
    href: "https://console.prisma.io",
  },
} as const;
