import { createPageMetadata } from "@/lib/page-metadata";
import { postgresContent } from "@/components/product/content/postgres";
import { ProductPage } from "@/components/product/product-page";

export const metadata = createPageMetadata({
  title: "Prisma Postgres | Serverless PostgreSQL for TypeScript Apps",
  description:
    "Prisma Postgres is a production-ready serverless PostgreSQL database with instant setup, built-in connection pooling, automated backups, and usage-based pricing, already wired to your stack.",
  path: "/postgres",
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

// /postgres is the one page whose approved copy matches the standard shape
// exactly — hero, problem, features, cross-sell, testimonials, closer — so it
// goes through ProductPage rather than composing the sections itself.
export default function PostgresPage() {
  return <ProductPage content={postgresContent} />;
}
