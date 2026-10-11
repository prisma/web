import Link from "next/link";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { getBaseUrl } from "@/lib/url";
import { privacyEffectiveDate } from "@/lib/legal/privacy";
import { slaEffectiveDate } from "@/lib/legal/sla";
import { termsEffectiveDate } from "@/lib/legal/terms";

// A flat index of Prisma's legal and compliance documents, modeled on
// vercel.com/legal: left-rail heading, right-rail list of document rows,
// hairline dividers, no fills, no scroll-reveal, no section groupings. The
// hub is noindex while review approves copy and layout; the underlying
// document pages stay indexed on their own.
const PAGE_PATH = "/legal";
const PAGE_TITLE = "Legal documents and policies";
const PAGE_DESCRIPTION =
  "Prisma's legal and compliance documents in one place: Terms of Service, Privacy Policy, Service Level Agreement, Security and Compliance, and the HIPAA Business Associate Agreement.";

export const metadata = {
  ...createPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
    ogKicker: "Legal",
  }),
  robots: { index: false, follow: false },
};

type Document = {
  title: string;
  href: string;
  lastUpdated?: string;
  external?: boolean;
};

// Dates are read from the source each document ships with (see
// src/lib/legal/*.tsx and the draft BAA in PR #8448); Security and
// Compliance and the Trust Center have no dated version to read, so the
// field is omitted rather than invented. Ordered alphabetically.
const DOCUMENTS: Document[] = [
  {
    title: "HIPAA Business Associate Agreement",
    href: "/legal/baa",
    lastUpdated: "October 2026",
  },
  {
    title: "Privacy Policy",
    href: "/legal/privacy",
    lastUpdated: privacyEffectiveDate,
  },
  {
    title: "Security and Compliance",
    href: "/legal/security-and-compliance",
  },
  {
    title: "Service Level Agreement",
    href: "/legal/sla",
    lastUpdated: slaEffectiveDate,
  },
  {
    title: "Terms of Service",
    href: "/legal/terms",
    lastUpdated: termsEffectiveDate,
  },
  {
    title: "Trust Center",
    href: "https://trust.prisma.io",
    external: true,
  },
];

function DocumentRow({ document: doc }: { document: Document }) {
  const external = doc.external ?? doc.href.startsWith("http");
  return (
    <li className="group relative">
      <div className="flex items-center justify-between gap-6 py-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-foreground sm:text-[1.0625rem]">
            <Link
              href={doc.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-prism-cyan-500 focus-visible:after:ring-offset-2"
            >
              {doc.title}
            </Link>
          </h2>
          {doc.lastUpdated ? (
            <p className="mt-1 text-sm text-muted-foreground">Last updated {doc.lastUpdated}</p>
          ) : null}
        </div>
        <span
          aria-hidden
          className="shrink-0 whitespace-nowrap rounded-full border border-black/[0.15] bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-foreground"
        >
          Read document
        </span>
      </div>
    </li>
  );
}

// WebPage + BreadcrumbList + ItemList JSON-LD so search engines can read the
// hub structure even while it's noindex (noindex blocks indexing, not
// crawling of the structured data by other agents).
function buildStructuredData() {
  const baseUrl = getBaseUrl();
  const absolute = (path: string) =>
    path.startsWith("http") ? path : new URL(path, baseUrl).toString();
  const pageUrl = absolute(PAGE_PATH);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${baseUrl}#website` },
        about: { "@id": `${baseUrl}#organization` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: DOCUMENTS.map((doc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absolute(doc.href),
            name: doc.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Legal", item: pageUrl },
        ],
      },
    ],
  };
}

export default function LegalHubPage() {
  const structuredData = buildStructuredData();

  return (
    <>
      <JsonLd id="legal-hub-structured-data" data={structuredData} />

      <section className="bg-white px-4 pb-24 pt-32 sm:px-8 sm:pb-32 md:pt-40">
        <div className="mx-auto grid max-w-site gap-x-16 gap-y-10 lg:grid-cols-[18rem_1fr]">
          <header>
            <h1 className="text-balance text-2xl leading-[1.2] text-foreground sm:text-[1.75rem]">
              Explore our legal documents and policies
            </h1>
          </header>
          <ul className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {DOCUMENTS.map((doc) => (
              <DocumentRow key={doc.href} document={doc} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
