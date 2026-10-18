import localFont from "next/font/local";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import {
  getComparisonMetadata,
  getComparisonOgImageUrl,
  getComparisonStructuredData,
} from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { comparisonAuthorPerson } from "../byline";
import { FAQ, KYSELY_AUTHOR, KYSELY_PATH, KYSELY_TITLE } from "./_content";
import { getKyselyArticleFields } from "./facts";
import { KyselyPage } from "./_sections";

/**
 * The docs' code face. The file is a copy of MonaSansMonoVF[wght].woff2
 * without brackets in the name so the preload href and @font-face url match
 * (encoded `%5Bwght%5D` vs raw `[wght]` used to unused-preload the face).
 */
const monaSansMono = localFont({
  src: "./mona-sans-mono.woff2",
  variable: "--font-code",
  display: "swap",
  weight: "200 900",
});

export const metadata = getComparisonMetadata("kysely");

const faqStructuredData = createFaqStructuredData(KYSELY_PATH, [...FAQ], KYSELY_TITLE);

/** The shared comparison graph, with this page's author, dates, image, and tool entities. */
function articleStructuredData() {
  const base = getComparisonStructuredData("kysely");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        ...getKyselyArticleFields(),
        image: getComparisonOgImageUrl("kysely"),
        author: comparisonAuthorPerson(KYSELY_AUTHOR, getBaseUrl()),
      },
      ...rest,
    ],
  };
}

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-kysely-article" data={articleStructuredData()} />
      <JsonLd id="compare-kysely-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <KyselyPage />
      </div>
    </>
  );
}
