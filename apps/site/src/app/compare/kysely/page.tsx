import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { getComparisonMetadata, getComparisonStructuredData } from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { FAQ, KYSELY_PATH, KYSELY_TITLE } from "./_content";
import { CompareDocument } from "../document";
import { KyselyPage } from "./_sections";

export const metadata = getComparisonMetadata("kysely");

const faqStructuredData = createFaqStructuredData(KYSELY_PATH, [...FAQ], KYSELY_TITLE);

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-kysely-article" data={getComparisonStructuredData("kysely")} />
      <JsonLd id="compare-kysely-faq" data={faqStructuredData} />
      <CompareDocument slug="kysely">
        <KyselyPage />
      </CompareDocument>
    </>
  );
}
