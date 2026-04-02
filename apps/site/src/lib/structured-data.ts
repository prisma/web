import { getBaseUrl } from "@/lib/url";
import { SITE_HOME_DESCRIPTION } from "@/lib/site-metadata";

type FaqEntry = {
  question: string;
  answer: string;
};

type PricingTier = {
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
};

type ListEntry = {
  name: string;
  url: string;
  description?: string;
};

function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, getBaseUrl()).toString();
}

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;quot;/g, '"')
    .replace(/&amp;#39;|&amp;apos;/g, "'")
    .replace(/&amp;nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createSiteStructuredData() {
  const baseUrl = getBaseUrl();
  const description = SITE_HOME_DESCRIPTION;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "Prisma",
        url: baseUrl,
        description,
        logo: absoluteUrl("/icons/technologies/prisma.svg"),
        sameAs: [
          "https://github.com/prisma",
          "https://twitter.com/prisma",
          "https://www.linkedin.com/company/prisma-io",
          "https://www.youtube.com/prismadata",
          "https://www.facebook.com/prisma.io/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: "Prisma",
        url: baseUrl,
        description,
        publisher: {
          "@id": `${baseUrl}#organization`,
        },
      },
    ],
  };
}

export function createFaqStructuredData(pagePath: string, faqs: FaqEntry[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(pagePath)}#faq`,
    name,
    url: absoluteUrl(pagePath),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(faq.answer),
      },
    })),
  };
}

export function createPricingStructuredData(tiers: PricingTier[]) {
  const url = absoluteUrl("/pricing");
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: "Prisma Pricing — Plans & Features",
        url,
        description:
          "Get started for free with Prisma Postgres. Choose the right plan for your workspace based on your project requirements.",
        publisher: {
          "@id": `${baseUrl}#organization`,
        },
        isPartOf: {
          "@id": `${baseUrl}#website`,
        },
      },
      ...tiers.map((tier) => ({
        "@type": "Product",
        name: `Prisma Postgres ${tier.name}`,
        description: tier.description,
        brand: {
          "@id": `${baseUrl}#organization`,
        },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: tier.price,
          priceValidUntil: new Date(
            new Date().getFullYear() + 1,
            new Date().getMonth(),
            new Date().getDate(),
          )
            .toISOString()
            .split("T")[0],
          availability: "https://schema.org/InStock",
          ...(tier.price > 0
            ? { priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" } }
            : {}),
        },
      })),
    ],
  };
}

export function createSoftwareApplicationStructuredData({
  path,
  name,
  description,
  applicationCategory = "DeveloperApplication",
  operatingSystem = "Cross-platform",
}: {
  path: string;
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
}) {
  const url = absoluteUrl(path);
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@id": `${baseUrl}#organization`,
    },
  };
}

export function createCollectionPageStructuredData({
  path,
  name,
  description,
  items,
}: {
  path: string;
  name: string;
  description: string;
  items: ListEntry[];
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(item.url),
        name: item.name,
        description: item.description,
      })),
    },
  };
}
