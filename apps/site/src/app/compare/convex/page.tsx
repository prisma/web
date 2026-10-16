import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { CONVEX_DESCRIPTION, CONVEX_PATH, CONVEX_TITLE, FAQ } from "./_content";
import { ConvexPage } from "./_sections";

export const metadata = createPageMetadata({
  title: CONVEX_TITLE,
  description: CONVEX_DESCRIPTION,
  path: CONVEX_PATH,
  ogKicker: "Compare",
  ogAccent: "cyan",
});

const faqStructuredData = createFaqStructuredData(CONVEX_PATH, [...FAQ], CONVEX_TITLE);

export default function Page() {
  return (
    <>
      <JsonLd data={faqStructuredData} />
      <ConvexPage />
    </>
  );
}
