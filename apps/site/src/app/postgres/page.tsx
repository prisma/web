import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { postgresContent } from "@/components/product/content/postgres";
import { ProductPage } from "@/components/product/product-page";
import { createFaqStructuredData } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Prisma Postgres | Free Postgres database for TypeScript and AI",
  description:
    "Managed Postgres, part of Prisma's infrastructure for TypeScript and AI apps. Create a free database in seconds with npx create-db. No credit card.",
  path: "/postgres",
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

// FAQPage JSON-LD is deliberately page-scoped (2026-10-08 /postgres SEO pass).
// The same strings feed the visible accordion (sections/faq.tsx) and the
// structured data below, with inline link and code markup stripped back to
// plain text by `createFaqStructuredData` so the two copies cannot drift.
// Only /postgres carries one today; add others page by page as their briefs
// ask for it.
const postgresFaqStructuredData = postgresContent.faq
  ? createFaqStructuredData(
      "/postgres",
      postgresContent.faq.map(({ question, answer }) => ({ question, answer })),
      "Prisma Postgres FAQ",
    )
  : null;

// /postgres uses the standard product-page shape (hero, problem, features,
// cross-sell, testimonials, closer), so it goes through ProductPage rather
// than composing the sections itself.
export default function PostgresPage() {
  return (
    <>
      {postgresFaqStructuredData ? (
        <JsonLd id="postgres-faq-structured-data" data={postgresFaqStructuredData} />
      ) : null}
      <ProductPage content={postgresContent} faqId="faq" />
    </>
  );
}
