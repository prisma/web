import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import {
  CONNSTRING_DESCRIPTION,
  CONNSTRING_FAQ,
  CONNSTRING_H1,
  CONNSTRING_LAST_MODIFIED,
  CONNSTRING_PATH,
  CONNSTRING_TITLE,
} from "./_content";
import { ConnectionStringPage } from "./_sections";

export const metadata = createPageMetadata({
  title: CONNSTRING_TITLE,
  description: CONNSTRING_DESCRIPTION,
  path: CONNSTRING_PATH,
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

// FAQPage JSON-LD mirrors every visible FAQ answer. The shared helper strips
// the `[text](/path)` and `code` markup back to plain text, so the structured
// copy cannot drift from the visible copy.
const faqStructuredData = createFaqStructuredData(
  CONNSTRING_PATH,
  CONNSTRING_FAQ.map(({ question, answer }) => ({ question, answer })),
  "Postgres connection string FAQ",
);

// WebPage + BreadcrumbList and a TechArticle, as on /postgres/hipaa. `about`
// points at the canonical /postgres product id, so this page reads as a facet
// of Prisma Postgres rather than a separate product.
function buildStructuredData() {
  const base = getBaseUrl();
  const url = `${base}${CONNSTRING_PATH}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: CONNSTRING_TITLE,
        description: CONNSTRING_DESCRIPTION,
        dateModified: CONNSTRING_LAST_MODIFIED,
        about: { "@id": `${base}/postgres#product` },
        publisher: { "@id": `${base}/#organization` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Prisma Postgres", item: `${base}/postgres` },
            { "@type": "ListItem", position: 2, name: "Connection string", item: url },
          ],
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: CONNSTRING_H1,
        description: CONNSTRING_DESCRIPTION,
        url,
        mainEntityOfPage: { "@id": url },
        dateModified: CONNSTRING_LAST_MODIFIED,
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

export default function PostgresConnectionStringPage() {
  return (
    <>
      <JsonLd id="postgres-connection-string-faq-structured-data" data={faqStructuredData} />
      <JsonLd id="postgres-connection-string-structured-data" data={buildStructuredData()} />
      <ConnectionStringPage />
    </>
  );
}
