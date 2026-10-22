import { CONVEX_DESCRIPTION, CONVEX_TITLE } from "./convex/_content";
import { KYSELY_DESCRIPTION, KYSELY_TITLE } from "./kysely/_content";
import { MONGOOSE_DESCRIPTION, MONGOOSE_TITLE } from "./mongoose/_content";
import { NEON_DESCRIPTION, NEON_TITLE } from "./neon/_content";
import { PLANETSCALE_DESCRIPTION, PLANETSCALE_TITLE } from "./planetscale/_content";
import { SUPABASE_DESCRIPTION, SUPABASE_TITLE } from "./supabase/_content";
import {
  VERCEL_NEON_DRIZZLE_DESCRIPTION,
  VERCEL_NEON_DRIZZLE_TITLE,
} from "./vercel-neon-drizzle/_content";

export const COMPARISON_INDEX = {
  path: "/compare",
  title: "Prisma comparisons",
  description:
    "Prisma ORM and Prisma Postgres set beside the tools people weigh them against, with every figure sourced and dated.",
} as const;

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

export const COMPARISONS = [
  {
    slug: "convex",
    category: "platform",
    competitor: "Convex",
    title: CONVEX_TITLE,
    description: CONVEX_DESCRIPTION,
  },
  {
    slug: "kysely",
    category: "orm",
    competitor: "Kysely",
    title: KYSELY_TITLE,
    description: KYSELY_DESCRIPTION,
  },
  {
    slug: "mongoose",
    category: "orm",
    competitor: "Mongoose",
    title: MONGOOSE_TITLE,
    description: MONGOOSE_DESCRIPTION,
  },
  {
    slug: "neon",
    category: "postgres",
    competitor: "Neon",
    title: NEON_TITLE,
    description: NEON_DESCRIPTION,
  },
  {
    slug: "planetscale",
    category: "postgres",
    competitor: "PlanetScale",
    title: PLANETSCALE_TITLE,
    description: PLANETSCALE_DESCRIPTION,
  },
  {
    slug: "supabase",
    category: "postgres",
    competitor: "Supabase",
    title: SUPABASE_TITLE,
    description: SUPABASE_DESCRIPTION,
  },
  {
    slug: "vercel-neon-drizzle",
    category: "platform",
    competitor: "Vercel + Neon + Drizzle",
    title: VERCEL_NEON_DRIZZLE_TITLE,
    description: VERCEL_NEON_DRIZZLE_DESCRIPTION,
  },
] as const satisfies readonly ComparisonEntry[];

export type ComparisonSlug = (typeof COMPARISONS)[number]["slug"];
export const COMPARISON_PATHS = [
  COMPARISON_INDEX.path,
  ...COMPARISONS.map((entry) => `/compare/${entry.slug}` as const),
] as const;
export type ComparisonPath = (typeof COMPARISON_PATHS)[number];
