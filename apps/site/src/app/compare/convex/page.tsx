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
import { CONVEX_AUTHOR, CONVEX_PATH, CONVEX_TITLE, FAQ } from "./_content";
import { getConvexArticleFields } from "./facts";
import { ConvexPage } from "./_sections";

/**
 * The docs' code face. Shared with the Kysely comparison so both pages load
 * one copy of the unbracketed Mona Sans Mono file.
 */
const monaSansMono = localFont({
  src: "../kysely/mona-sans-mono.woff2",
  variable: "--font-code",
  display: "swap",
  weight: "200 900",
});

export const metadata = getComparisonMetadata("convex");

const faqStructuredData = createFaqStructuredData(CONVEX_PATH, [...FAQ], CONVEX_TITLE);

/** The shared comparison graph, with this page's author, dates, image, and tool entities. */
function articleStructuredData() {
  const base = getComparisonStructuredData("convex");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        ...getConvexArticleFields(),
        image: getComparisonOgImageUrl("convex"),
        author: comparisonAuthorPerson(CONVEX_AUTHOR, getBaseUrl()),
      },
      ...rest,
    ],
  };
}

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-convex-article" data={articleStructuredData()} />
      <JsonLd id="compare-convex-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <ConvexPage />
      </div>
    </>
  );
}
