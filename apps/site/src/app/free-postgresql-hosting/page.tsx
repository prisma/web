import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import {
  FREE_POSTGRES_DESCRIPTION,
  FREE_POSTGRES_FAQ,
  FREE_POSTGRES_PATH,
  FREE_POSTGRES_TITLE,
} from "./_content";
import { FreePostgresPage } from "./_sections";

export const metadata = createPageMetadata({
  title: FREE_POSTGRES_TITLE,
  description: FREE_POSTGRES_DESCRIPTION,
  path: FREE_POSTGRES_PATH,
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

// FAQPage JSON-LD mirrors every visible FAQ answer. The shared helper strips
// the `[text](/path)` and `code` markup back to plain text, so the structured
// copy cannot drift from the visible copy.
const faqStructuredData = createFaqStructuredData(
  FREE_POSTGRES_PATH,
  FREE_POSTGRES_FAQ.map(({ question, answer }) => ({ question, answer })),
  "Prisma Postgres Free plan FAQ",
);

export default function FreePostgresqlDatabasePage() {
  return (
    <>
      <JsonLd id="free-postgresql-hosting-faq-structured-data" data={faqStructuredData} />
      <FreePostgresPage />
    </>
  );
}
