import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { BUSINESS_PRICE_USD, HIPAA_FAQ, HIPAA_PATH } from "./_content";
import {
  HipaaBaaSteps,
  HipaaCloser,
  HipaaFaq,
  HipaaFeatures,
  HipaaFoundations,
  HipaaGlance,
  HipaaHero,
  HipaaResources,
  HipaaResponsibility,
  HipaaStartups,
  HipaaTrustStrip,
} from "./_sections";

// `noindex` keeps the preview out of search indexes until launch. Remove the
// `robots` block before marking the PR ready.
export const metadata = {
  ...createPageMetadata({
    title: "HIPAA compliant database for healthcare | Prisma Postgres",
    description:
      "Prisma Postgres is a HIPAA ready cloud database with a signed BAA on Business. Built for teams that need HIPAA compliant database hosting without enterprise bloat.",
    path: HIPAA_PATH,
    ogKicker: "Prisma Postgres",
    ogAccent: "yellow" as const,
  }),
  robots: { index: false, follow: false },
};

// FAQPage JSON-LD mirrors every visible FAQ answer. The shared helper strips
// the `[text](/path)` and `code` markup back to plain text, so the structured
// copy cannot drift from the visible copy.
const faqStructuredData = createFaqStructuredData(
  HIPAA_PATH,
  HIPAA_FAQ.map(({ question, answer }) => ({ question, answer })),
  "Prisma Postgres HIPAA FAQ",
);

// WebPage + BreadcrumbList, Product (Business offer) and Organization — the
// mockup specifies them as separate JSON-LD blocks. Product `@id` reuses the
// canonical /postgres product id so this preview page is understood as a
// facet of the same product, not a separate one.
function buildStructuredData() {
  const base = getBaseUrl();
  const url = `${base}${HIPAA_PATH}`;
  const today = new Date().toISOString().slice(0, 10);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: "HIPAA compliant Postgres database | Prisma Postgres",
      dateModified: today,
      about: { "@id": `${base}/postgres#product` },
      publisher: { "@id": `${base}/#organization` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Prisma Postgres",
            item: `${base}/postgres`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "HIPAA",
            item: url,
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${base}/postgres#product`,
      name: "Prisma Postgres",
      category: "Managed PostgreSQL database",
      brand: { "@id": `${base}/#organization` },
      description:
        "Managed Postgres with HIPAA support and a signed Business Associate Agreement on the Business plan.",
      offers: {
        "@type": "Offer",
        name: "Business plan",
        price: BUSINESS_PRICE_USD,
        priceCurrency: "USD",
        url: `${base}/pricing`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: "Prisma",
      url: base,
      logo: `${base}/logo/full-color.svg`,
      sameAs: ["https://github.com/prisma", "https://x.com/prisma"],
    },
  ];
}

export default function PostgresHipaaPage() {
  const structuredData = buildStructuredData();
  return (
    <>
      <JsonLd id="hipaa-faq-structured-data" data={faqStructuredData} />
      <JsonLd id="hipaa-structured-data" data={structuredData} />
      <HipaaHero />
      <HipaaGlance />
      <HipaaFoundations />
      <HipaaFeatures />
      <HipaaResponsibility />
      <HipaaStartups />
      <HipaaBaaSteps />
      <HipaaResources />
      <HipaaFaq />
      <HipaaTrustStrip />
      <HipaaCloser />
    </>
  );
}
