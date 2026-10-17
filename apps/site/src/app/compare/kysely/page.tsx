import localFont from "next/font/local";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { getComparisonMetadata, getComparisonStructuredData } from "@/lib/comparison-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { FAQ, KYSELY_AUTHOR, KYSELY_PATH, KYSELY_TITLE, KYSELY_UPDATED } from "./_content";
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

/** The shared comparison graph, with this page's author and update date on its Article. */
function articleStructuredData() {
  const base = getComparisonStructuredData("kysely");
  const [article, ...rest] = base["@graph"];
  return {
    ...base,
    "@graph": [
      {
        ...article,
        dateModified: KYSELY_UPDATED.iso,
        author: {
          "@type": "Person",
          name: KYSELY_AUTHOR.name,
          url: new URL(KYSELY_AUTHOR.path, getBaseUrl()).toString(),
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
      <JsonLd id="compare-kysely-article" data={articleStructuredData()} />
      <JsonLd id="compare-kysely-faq" data={faqStructuredData} />
      <div className={`${monaSansMono.variable} contents`}>
        <KyselyPage />
      </div>
    </>
  );
}
