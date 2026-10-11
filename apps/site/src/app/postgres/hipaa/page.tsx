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
  HipaaPlans,
  HipaaResources,
  HipaaResponsibility,
  HipaaTrustStrip,
} from "./_sections";

// This is a review-preview page. Vercel builds a preview deployment for the
// draft PR; `noindex` keeps it out of search indexes until launch. Remove the
// `robots` block (and the yellow placeholder badges inside _sections.tsx)
// before marking the PR ready.
//
// Title, meta description and H1 deliberately avoid the price (SEO brief,
// 11 Oct 2026): the price lives in the hero microline, the glance table,
// the plan table and one FAQ answer, never in the title, meta, H1 or closing
// CTA.
export const metadata = {
  ...createPageMetadata({
    title: "HIPAA compliant Postgres database | Prisma Postgres",
    description:
      "Managed Postgres for healthcare apps. Sign a BAA on the Business plan, keep PHI encrypted and isolated, and get SOC 2 and ISO 27001 reports.",
    path: HIPAA_PATH,
    ogKicker: "Prisma Postgres",
    ogAccent: "yellow" as const,
  }),
  robots: { index: false, follow: false },
};

// FAQPage JSON-LD includes only the answers confirmed as accurate for this
// preview (the other visible FAQ items carry yellow badges in the UI). The
// shared helper strips the `[text](/path)` and `code` markup back to plain
// text, so the structured copy cannot drift from the visible copy.
const confirmedFaq = HIPAA_FAQ.filter((f) => f.confidence === "confirmed").map(
  ({ question, answer }) => ({ question, answer }),
);
const faqStructuredData = createFaqStructuredData(
  HIPAA_PATH,
  confirmedFaq,
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
      <HipaaPlans />
      <HipaaBaaSteps />
      <HipaaResources />
      <HipaaFaq />
      <HipaaTrustStrip />
      <HipaaCloser />
    </>
  );
}
