/**
 * Head-to-head pages that already exist on the redesign at /compare/<slug>.
 * Checked 15 October 2026 against
 * prisma-web-site-redesign-n1sktwo1y-conversion-factory.vercel.app.
 *
 * Order is alphabetical by the other product. Titles and descriptions are
 * that deployment's document title and meta description, so the directory
 * does not add a claim the page itself does not already make.
 *
 * content/compare/competitor-one.mdx and competitor-two.mdx are starter-kit
 * samples. They stay on disk and off this list.
 */
export type ComparisonEntry = {
  slug: string
  /** The other product, used as the scan label and the sort key. */
  competitor: string
  title: string
  description: string
}

export const COMPARISONS: readonly ComparisonEntry[] = [
  {
    slug: "neon",
    competitor: "Neon",
    title: "Prisma Postgres vs Neon: compare managed Postgres for TypeScript apps",
    description:
      "Compare managed Postgres for TypeScript apps. Prisma Postgres puts your database on the same platform as a type-safe ORM and full TypeScript app hosting.",
  },
  {
    slug: "planetscale",
    competitor: "PlanetScale",
    title: "Prisma Postgres vs PlanetScale: managed Postgres for TypeScript apps",
    description:
      "Managed Postgres for TypeScript apps. PlanetScale focuses on database performance and infrastructure; Prisma Postgres connects your database to a first-party ORM and full app hosting.",
  },
  {
    slug: "supabase",
    competitor: "Supabase",
    title: "Prisma Postgres vs Supabase: which is better for TypeScript apps?",
    description:
      "Which is better for TypeScript apps? Compare Supabase's backend-as-a-service around Postgres with Prisma's first-party ORM, managed Postgres, and full app hosting.",
  },
]

/** Starter-kit samples under content/compare. Not products, so not published. */
export function isStarterKitComparison(slug: string): boolean {
  return slug.startsWith("competitor-")
}
