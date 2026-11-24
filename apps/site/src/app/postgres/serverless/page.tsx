import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import {
  SERVERLESS_DESCRIPTION,
  SERVERLESS_FAQ,
  SERVERLESS_H1,
  SERVERLESS_LAST_MODIFIED,
  SERVERLESS_PATH,
  SERVERLESS_TITLE,
} from "./_content";
import { ServerlessPage } from "./_sections";

export const metadata = createPageMetadata({
  title: SERVERLESS_TITLE,
  description: SERVERLESS_DESCRIPTION,
  path: SERVERLESS_PATH,
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

// FAQPage JSON-LD mirrors every visible FAQ answer. The shared helper strips
// the `[text](/path)` and `code` markup back to plain text, so the structured
// copy cannot drift from the visible copy.
const faqStructuredData = createFaqStructuredData(
  SERVERLESS_PATH,
  SERVERLESS_FAQ.map(({ question, answer }) => ({ question, answer })),
  "Serverless Postgres FAQ",
);

// WebPage + BreadcrumbList and a TechArticle, as on /postgres/hipaa. `about`
// points at the canonical /postgres product id, so this page reads as a facet
// of Prisma Postgres rather than a separate product.
function buildStructuredData() {
  const base = getBaseUrl();
  const url = `${base}${SERVERLESS_PATH}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: SERVERLESS_TITLE,
        description: SERVERLESS_DESCRIPTION,
        dateModified: SERVERLESS_LAST_MODIFIED,
        about: { "@id": `${base}/postgres#product` },
        publisher: { "@id": `${base}/#organization` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Prisma Postgres", item: `${base}/postgres` },
            { "@type": "ListItem", position: 2, name: "Serverless Postgres", item: url },
          ],
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: SERVERLESS_H1,
        description: SERVERLESS_DESCRIPTION,
        url,
        mainEntityOfPage: { "@id": url },
        dateModified: SERVERLESS_LAST_MODIFIED,
        about: { "@id": `${base}/postgres#product` },
        author: { "@id": `${base}/#organization` },
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "Prisma",
        url: base,
        logo: `${base}/logo/full-color.svg`,
        sameAs: ["https://github.com/prisma", "https://x.com/prisma"],
      },
    ],
  };
}

export default function PostgresServerlessPage() {
  return (
    <>
      <JsonLd id="postgres-serverless-faq-structured-data" data={faqStructuredData} />
      <JsonLd id="postgres-serverless-structured-data" data={buildStructuredData()} />
      <ServerlessPage />
    </>
  );
}
