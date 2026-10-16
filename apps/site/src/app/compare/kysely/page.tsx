import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { FAQ, KYSELY_DESCRIPTION, KYSELY_PATH, KYSELY_TITLE } from "./_content";
import { KyselyPage } from "./_sections";

export const metadata = createPageMetadata({
  title: KYSELY_TITLE,
  description: KYSELY_DESCRIPTION,
  path: KYSELY_PATH,
  ogKicker: "Compare",
  ogAccent: "cyan",
});

const faqStructuredData = createFaqStructuredData(KYSELY_PATH, [...FAQ], KYSELY_TITLE);

export default function Page() {
  return (
    <>
      <JsonLd data={faqStructuredData} />
      <KyselyPage />
    </>
  );
}
