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
import {
  FAQ,
  VERCEL_NEON_DRIZZLE_AUTHOR,
  VERCEL_NEON_DRIZZLE_PATH,
  VERCEL_NEON_DRIZZLE_TITLE,
} from "./_content";
import { getVercelNeonDrizzleArticleFields } from "./facts";
import { VercelNeonDrizzlePage } from "./_sections";

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

export const metadata = getComparisonMetadata("vercel-neon-drizzle");

const faqStructuredData = createFaqStructuredData(
  VERCEL_NEON_DRIZZLE_PATH,
  [...FAQ],
  VERCEL_NEON_DRIZZLE_TITLE,
);

/** The shared comparison graph, with this page's author, dates, image, and tool entities. */
function articleStructuredData() {
  const base = getComparisonStructuredData("vercel-neon-drizzle");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        ...getVercelNeonDrizzleArticleFields(),
        image: getComparisonOgImageUrl("vercel-neon-drizzle"),
        author: comparisonAuthorPerson(VERCEL_NEON_DRIZZLE_AUTHOR, getBaseUrl()),
      },
      ...rest,
    ],
  };
}

/** Render the comparison and its article, breadcrumb and FAQ structured data. */
export default function Page() {
  return (
    <>
      <JsonLd id="compare-vercel-neon-drizzle-article" data={articleStructuredData()} />
      <JsonLd id="compare-vercel-neon-drizzle-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <VercelNeonDrizzlePage />
      </div>
    </>
  );
}
