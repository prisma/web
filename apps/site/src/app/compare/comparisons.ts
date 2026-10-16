/**
 * Head-to-head pages linked from /compare/<slug>.
 *
 * Every entry here must have a page at src/app/compare/<slug>/page.tsx, because
 * the list links to /compare/<slug> and nothing else resolves that path. Titles
 * and descriptions match each page's own document title and meta description.
 *
 * Order is alphabetical by the other product. A category with no entries is
 * hidden from the sidebar, so adding the first page in a category is enough to
 * show it.
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
      "Convex is a reactive database with TypeScript query functions. Prisma Postgres is managed PostgreSQL, and Prisma ORM is optional. Which fits your app, with sourced figures.",
  },
  {
    slug: "kysely",
    category: "orm",
    competitor: "Kysely",
    title: "Prisma ORM vs Kysely: contract-based ORM or SQL-first query builder?",
    description:
      "Prisma ORM 8 drives typed queries and migrations from one contract file. Kysely is a type-safe SQL query builder with no schema file. Which fits your project, with sourced figures.",
  },
  {
    slug: "mongoose",
    category: "orm",
    competitor: "Mongoose",
    title: "Prisma ORM vs Mongoose: type-safe data modeling beyond MongoDB",
    description:
      "Prisma ORM drives typed queries and migrations from one contract file, on PostgreSQL and MongoDB. Mongoose models MongoDB documents in application code. Which fits, with sourced figures.",
  },
];
