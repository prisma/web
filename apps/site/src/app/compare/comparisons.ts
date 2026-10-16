/**
 * Head-to-head pages linked from /compare/<slug>.
 *
 * Postgres entries were checked 15 October 2026 against the redesign
 * deployment. Kysely, Mongoose, and Convex are pages in this app. Titles
 * and descriptions match each page's own document title and meta description.
 *
 * Order is alphabetical by the other product.
 *
 * content/compare/competitor-one.mdx and competitor-two.mdx are starter-kit
 * samples. They stay on disk and off this list.
 */
export const COMPARISON_CATEGORIES = [
  { id: "orm", label: "ORM", dot: "bg-prism-cyan-400" },
  { id: "postgres", label: "Postgres", dot: "bg-prism-yellow-400" },
  { id: "compute", label: "Compute", dot: "bg-prism-red-500" },
  { id: "platform", label: "Platform", dot: "bg-foreground/40" },
] as const;

export type ComparisonCategory = (typeof COMPARISON_CATEGORIES)[number]["id"];

export type ComparisonEntry = {
  slug: string;
  category: ComparisonCategory;
  /** The other product, used as the scan label and the sort key. */
  competitor: string;
  title: string;
  description: string;
};

export const COMPARISONS: readonly ComparisonEntry[] = [
  {
    slug: "convex",
    category: "platform",
    competitor: "Convex",
    title: "Prisma Postgres vs Convex: standard Postgres or a reactive database?",
    description:
      "Convex is a reactive database with TypeScript queries. Prisma Postgres is PostgreSQL, and Prisma ORM is optional. Prisma makes Prisma Postgres.",
  },
  {
    slug: "kysely",
    category: "orm",
    competitor: "Kysely",
    title: "Prisma ORM vs Kysely: contract-based ORM or SQL-first query builder?",
    description:
      "Prisma ORM 8, a release candidate, uses a contract for typed queries and migrations. Kysely is a type-safe SQL query builder. Prisma makes Prisma ORM.",
  },
  {
    slug: "mongoose",
    category: "orm",
    competitor: "Mongoose",
    title: "Prisma ORM vs Mongoose: type-safe data modeling beyond MongoDB",
    description:
      "Prisma ORM uses a contract for typed queries on PostgreSQL and MongoDB. Mongoose models MongoDB documents in application code. Prisma makes Prisma ORM.",
  },
  {
    slug: "neon",
    category: "postgres",
    competitor: "Neon",
    title: "Prisma Postgres vs Neon: compare managed Postgres for TypeScript apps",
    description:
      "Compare managed Postgres for TypeScript apps. Prisma Postgres puts your database on the same platform as a type-safe ORM and full TypeScript app hosting.",
  },
  {
    slug: "planetscale",
    category: "postgres",
    competitor: "PlanetScale",
    title: "Prisma Postgres vs PlanetScale: managed Postgres for TypeScript apps",
    description:
      "Managed Postgres for TypeScript apps. PlanetScale focuses on database performance and infrastructure; Prisma Postgres connects your database to a first-party ORM and full app hosting.",
  },
  {
    slug: "supabase",
    category: "postgres",
    competitor: "Supabase",
    title: "Prisma Postgres vs Supabase: which is better for TypeScript apps?",
    description:
      "Which is better for TypeScript apps? Compare Supabase's backend-as-a-service around Postgres with Prisma's first-party ORM, managed Postgres, and full app hosting.",
  },
];

/** Starter-kit samples under content/compare. Not products, so not published. */
export function isStarterKitComparison(slug: string): boolean {
  return slug.startsWith("competitor-");
}
