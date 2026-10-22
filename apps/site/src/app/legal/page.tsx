import Link from "next/link";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { ArrowRight } from "@/components/icons/forma";
import { createPageMetadata } from "@/lib/page-metadata";
import { getBaseUrl } from "@/lib/url";
import { privacyEffectiveDate } from "@/lib/legal/privacy";
import { slaEffectiveDate } from "@/lib/legal/sla";
import { termsEffectiveDate } from "@/lib/legal/terms";

// A flat index of Prisma's legal and compliance documents, modeled on
// vercel.com/legal: left-rail heading, right-rail list of document rows,
// hairline dividers, no fills, no scroll-reveal, no section groupings.
// Indexable now that every linked document is live (the BAA and DPA
// shipped in #8469, the hub matched them in #8471).

// Same label and order as vercel.com/legal ("Last Updated April 21, 2026"):
// the words "Last Updated", then Month D, YYYY. No ordinals, no month-only
// strings.
const LAST_UPDATED_LABEL = "Last Updated";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// The source strings are not one format: privacy is "7th of August, 2026",
// terms and the SLA are "October 12, 2026", the DPA is "10 September 2025",
// and the BAA publishes an ISO dateModified. Normalize those. Anything else
// is returned unchanged so a new source shape stays visible instead of
// being guessed.
function formatLastUpdated(source: string): string {
  const ordinal = /^(\d{1,2})(?:st|nd|rd|th) of ([A-Za-z]+), (\d{4})$/.exec(source);
  if (ordinal) return `${ordinal[2]} ${Number(ordinal[1])}, ${ordinal[3]}`;

  const monthDay = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(source);
  if (monthDay) return `${monthDay[1]} ${Number(monthDay[2])}, ${monthDay[3]}`;

  // The DPA page prints "10 September 2025".
  const dayMonth = /^(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(source);
  if (dayMonth) return `${dayMonth[2]} ${Number(dayMonth[1])}, ${dayMonth[3]}`;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(source);
  if (iso) {
    const month = MONTHS[Number(iso[2]) - 1];
    if (month) return `${month} ${Number(iso[3])}, ${iso[1]}`;
  }

  return source;
}

const PAGE_PATH = "/legal";
const PAGE_TITLE = "Legal documents and policies";
const PAGE_DESCRIPTION =
  "Prisma's legal and compliance documents in one place: Terms of Service, Privacy Policy, Data Processing Agreement, Service Level Agreement, Security and Compliance, and the HIPAA Business Associate Agreement.";

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  ogKicker: "Legal",
});

type Document = {
  title: string;
  href: string;
  lastUpdated?: string;
  external?: boolean;
};

// Dates are read from the source each document ships with. The BAA page's
// visible line is "October 2026"; its WebPage dateModified is 2026-10-11, and
// that is the day used here so the hub can share one format. The DPA page
// prints "10 September 2025" (dateModified 2025-09-10). Security and
// Compliance and the Trust Center have no dated version to read, so the
// field is omitted rather than invented. Ordered alphabetically.
const BAA_DATE_MODIFIED = "2026-10-11";
const DPA_LAST_UPDATED = "10 September 2025";

const DOCUMENTS: Document[] = [
  {
    title: "Data Processing Agreement",
    href: "/legal/dpa",
    lastUpdated: formatLastUpdated(DPA_LAST_UPDATED),
  },
  {
    title: "HIPAA Business Associate Agreement",
    href: "/legal/baa",
    lastUpdated: formatLastUpdated(BAA_DATE_MODIFIED),
  },
  {
    title: "Privacy Policy",
    href: "/legal/privacy",
    lastUpdated: formatLastUpdated(privacyEffectiveDate),
  },
  {
    title: "Security and Compliance",
    href: "/legal/security-and-compliance",
  },
  {
    title: "Service Level Agreement",
    href: "/legal/sla",
    lastUpdated: formatLastUpdated(slaEffectiveDate),
  },
  {
    title: "Terms of Service",
    href: "/legal/terms",
    lastUpdated: formatLastUpdated(termsEffectiveDate),
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
    <li>
      <Link
        href={doc.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex w-full items-center justify-between gap-6 p-6 outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan-500 focus-visible:ring-offset-2 min-[601px]:p-10 min-[961px]:p-12"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-base font-semibold leading-snug text-foreground sm:text-[1.0625rem]">
            {doc.title}
          </h2>
          {doc.lastUpdated ? (
            <p className="text-sm text-muted-foreground">
              {LAST_UPDATED_LABEL} {doc.lastUpdated}
            </p>
          ) : null}
        </div>
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 text-foreground transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </Link>
    </li>
  );
}

// WebPage + BreadcrumbList + ItemList JSON-LD so search engines can read
// the hub structure: Home -> Legal -> each document, with the hub itself
// isPartOf the existing WebSite entity and about the Organization.
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
        <div className="mx-auto grid max-w-site min-[601px]:grid-cols-3">
          <header className="p-6 min-[601px]:p-10 min-[961px]:p-12">
            <h1 className="text-balance text-2xl leading-[1.2] text-foreground sm:text-[1.75rem]">
              Explore our legal documents and policies
            </h1>
          </header>
          <ul className="divide-y divide-black/[0.08] border-y border-black/[0.08] min-[601px]:col-span-2">
            {DOCUMENTS.map((doc) => (
              <DocumentRow key={doc.href} document={doc} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
