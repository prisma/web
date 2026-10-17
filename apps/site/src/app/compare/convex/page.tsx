import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { getComparisonMetadata, getComparisonStructuredData } from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { CONVEX_PATH, CONVEX_TITLE, FAQ } from "./_content";
import { ConvexPage } from "./_sections";

export const metadata = getComparisonMetadata("convex");

const faqStructuredData = createFaqStructuredData(CONVEX_PATH, [...FAQ], CONVEX_TITLE);

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-convex-article" data={getComparisonStructuredData("convex")} />
      <JsonLd id="compare-convex-faq" data={faqStructuredData} />
      <ConvexPage />
    </>
  );
}
