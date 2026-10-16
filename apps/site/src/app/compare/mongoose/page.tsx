import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { FAQ, MONGOOSE_DESCRIPTION, MONGOOSE_PATH, MONGOOSE_TITLE } from "./_content";
import { MongoosePage } from "./_sections";

export const metadata = createPageMetadata({
  title: MONGOOSE_TITLE,
  description: MONGOOSE_DESCRIPTION,
  path: MONGOOSE_PATH,
  ogKicker: "Compare",
  ogAccent: "cyan",
});

const faqStructuredData = createFaqStructuredData(MONGOOSE_PATH, [...FAQ], MONGOOSE_TITLE);

export default function Page() {
  return (
    <>
      <JsonLd id="compare-mongoose-faq" data={faqStructuredData} />
      <MongoosePage />
    </>
  );
}
