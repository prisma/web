import type { Metadata } from "next";
import { postgresContent } from "@/components/product/content/postgres";
import { ProductPage } from "@/components/product/product-page";

export const metadata: Metadata = {
  title: "Prisma Postgres",
  description: "Production-ready Postgres, already wired to your stack.",
};

// /postgres is the one page whose approved copy matches the standard shape
// exactly — hero, problem, features, cross-sell, testimonials, closer — so it
// goes through ProductPage rather than composing the sections itself.
export default function PostgresPage() {
  return <ProductPage content={postgresContent} />;
}
