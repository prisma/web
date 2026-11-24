import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import {
  POOLING_DESCRIPTION,
  POOLING_FAQ,
  POOLING_H1,
  POOLING_LAST_MODIFIED,
  POOLING_PATH,
  POOLING_TITLE,
} from "./_content";
import { PoolingPage } from "./_sections";

export const metadata = createPageMetadata({
  title: POOLING_TITLE,
  description: POOLING_DESCRIPTION,
  path: POOLING_PATH,
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

// FAQPage JSON-LD mirrors every visible FAQ answer. The shared helper strips
// the `[text](/path)` and `code` markup back to plain text, so the structured
// copy cannot drift from the visible copy.
const faqStructuredData = createFaqStructuredData(
  POOLING_PATH,
  POOLING_FAQ.map(({ question, answer }) => ({ question, answer })),
  "Postgres connection pooling FAQ",
);

// WebPage + BreadcrumbList and a TechArticle, as on /postgres/hipaa. `about`
// points at the canonical /postgres product id, so this page reads as a facet
// of Prisma Postgres rather than a separate product.
function buildStructuredData() {
  const base = getBaseUrl();
  const url = `${base}${POOLING_PATH}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: POOLING_TITLE,
        description: POOLING_DESCRIPTION,
        dateModified: POOLING_LAST_MODIFIED,
        about: { "@id": `${base}/postgres#product` },
        publisher: { "@id": `${base}/#organization` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Prisma Postgres", item: `${base}/postgres` },
            { "@type": "ListItem", position: 2, name: "Connection pooling", item: url },
          ],
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: POOLING_H1,
        description: POOLING_DESCRIPTION,
        url,
        mainEntityOfPage: { "@id": url },
        dateModified: POOLING_LAST_MODIFIED,
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

export default function PostgresPoolingPage() {
  return (
    <>
      <JsonLd id="postgres-connection-pooling-faq-structured-data" data={faqStructuredData} />
      <JsonLd id="postgres-connection-pooling-structured-data" data={buildStructuredData()} />
      <PoolingPage />
    </>
  );
}
