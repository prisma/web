import { getBaseUrl } from "@/lib/url";
import { SITE_HOME_DESCRIPTION, SITE_NAME } from "@/lib/site-metadata";

type FaqEntry = {
  question: string;
  answer: string;
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
        name: SITE_NAME,
        url: baseUrl,
        description,
        logo: absoluteUrl("/images/logo.svg"),
        sameAs: [
          "https://github.com/prisma",
          "https://twitter.com/prisma",
          "https://www.linkedin.com/company/prisma-io",
          "https://www.youtube.com/prismadata",
          "https://www.facebook.com/prisma.io/",
        ],
      },
      {
        // The single WebSite entity for prisma.io. Docs and blog deliberately
        // do not declare their own — competing WebSite nodes on one domain give
        // Google more than one candidate for the site name.
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: SITE_NAME,
        alternateName: "Prisma.io",
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

export function createSoftwareApplicationStructuredData({
  path,
  name,
  description,
  applicationCategory = "DeveloperApplication",
  operatingSystem = "Cross-platform",
  license,
  downloadUrl,
  offers,
}: {
  path: string;
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  license?: string;
  downloadUrl?: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    name?: string;
    description?: string;
  };
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
    ...(license && { license }),
    ...(downloadUrl && { downloadUrl }),
    offers: offers ?? {
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
