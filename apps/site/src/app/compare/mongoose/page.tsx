import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { getComparisonMetadata, getComparisonStructuredData } from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { FAQ, MONGOOSE_PATH, MONGOOSE_TITLE } from "./_content";
import { MongoosePage } from "./_sections";

export const metadata = getComparisonMetadata("mongoose");

const faqStructuredData = createFaqStructuredData(MONGOOSE_PATH, [...FAQ], MONGOOSE_TITLE);

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-mongoose-article" data={getComparisonStructuredData("mongoose")} />
      <JsonLd id="compare-mongoose-faq" data={faqStructuredData} />
      <MongoosePage />
    </>
  );
}
