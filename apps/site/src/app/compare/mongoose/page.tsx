import localFont from "next/font/local";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import {
  getComparisonMetadata,
  getComparisonOgImageUrl,
  getComparisonStructuredData,
} from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { FAQ, MONGOOSE_AUTHOR, MONGOOSE_PATH, MONGOOSE_TITLE } from "./_content";
import { getMongooseArticleFields } from "./facts";
import { MongoosePage } from "./_sections";

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

export const metadata = getComparisonMetadata("mongoose");

const faqStructuredData = createFaqStructuredData(MONGOOSE_PATH, [...FAQ], MONGOOSE_TITLE);

/** The shared comparison graph, with this page's author, dates, image, and tool entities. */
function articleStructuredData() {
  const base = getComparisonStructuredData("mongoose");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        ...getMongooseArticleFields(),
        image: getComparisonOgImageUrl("mongoose"),
        author: {
          "@type": "Person",
          name: MONGOOSE_AUTHOR.name,
          url: new URL(MONGOOSE_AUTHOR.path, getBaseUrl()).toString(),
        },
      },
      ...rest,
    ],
  };
}

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-mongoose-article" data={articleStructuredData()} />
      <JsonLd id="compare-mongoose-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <MongoosePage />
      </div>
    </>
  );
}
