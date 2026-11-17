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
import { FAQ, NEON_AUTHOR, NEON_PATH, NEON_TITLE } from "./_content";
import { getNeonArticleFields } from "./facts";
import { NeonPage } from "./_sections";

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

export const metadata = getComparisonMetadata("neon");

const faqStructuredData = createFaqStructuredData(NEON_PATH, [...FAQ], NEON_TITLE);

/** The shared comparison graph, with this page's author, dates, image, and tool entities. */
function articleStructuredData() {
  const base = getComparisonStructuredData("neon");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        ...getNeonArticleFields(),
        image: getComparisonOgImageUrl("neon"),
        author: comparisonAuthorPerson(NEON_AUTHOR, getBaseUrl()),
      },
      ...rest,
    ],
  };
}

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-neon-article" data={articleStructuredData()} />
      <JsonLd id="compare-neon-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <NeonPage />
      </div>
    </>
  );
}
