import localFont from "next/font/local";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { getComparisonMetadata, getComparisonStructuredData } from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { FAQ, KYSELY_PATH, KYSELY_TITLE } from "./_content";
import { KyselyPage } from "./_sections";

/** The docs' code face, loaded here rather than in `highlight.tsx` because tests import that file outside Next. */
const monaSansMono = localFont({
  src: "../../../../../../packages/eclipse/src/static/fonts/MonaSansMonoVF[wght].woff2",
  variable: "--font-code",
  display: "swap",
  weight: "200 900",
});

export const metadata = getComparisonMetadata("kysely");

const faqStructuredData = createFaqStructuredData(KYSELY_PATH, [...FAQ], KYSELY_TITLE);

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-kysely-article" data={getComparisonStructuredData("kysely")} />
      <JsonLd id="compare-kysely-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <KyselyPage />
      </div>
    </>
  );
}
