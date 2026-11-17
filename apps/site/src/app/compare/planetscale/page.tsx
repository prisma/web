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
import { FAQ, PLANETSCALE_AUTHOR, PLANETSCALE_PATH, PLANETSCALE_TITLE } from "./_content";
import { getPlanetScaleArticleFields } from "./facts";
import { PlanetScalePage } from "./_sections";

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

export const metadata = getComparisonMetadata("planetscale");

const faqStructuredData = createFaqStructuredData(PLANETSCALE_PATH, [...FAQ], PLANETSCALE_TITLE);

/** The shared comparison graph, with this page's author, dates, image, and tool entities. */
function articleStructuredData() {
  const base = getComparisonStructuredData("planetscale");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        ...getPlanetScaleArticleFields(),
        image: getComparisonOgImageUrl("planetscale"),
        author: comparisonAuthorPerson(PLANETSCALE_AUTHOR, getBaseUrl()),
      },
      ...rest,
    ],
  };
}

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-planetscale-article" data={articleStructuredData()} />
      <JsonLd id="compare-planetscale-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <PlanetScalePage />
      </div>
    </>
  );
}
