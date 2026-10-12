import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import {
  AgreementStep,
  INLINE_LINK,
  LegalAgreementPage,
} from "@/components/sections/legal-agreement-page";
import { BAA_SECTIONS } from "./_baa-text";

const BAA_PDF = "/legal/prisma-hipaa-baa-sample.pdf";
const CONSOLE_SIGN_UP = "https://console.prisma.io/sign-up";

// The BAA request flow is email based: customers write to compliance@prisma.io
// with their company and signatory details and Prisma sends the agreement for
// e-signature. The mailto carries a canned subject the compliance mailbox
// filters on, plus a prefilled body template so the request lands with every
// field the signing workflow needs. The "Sent from" line names /legal/baa so
// compliance can tell which page a given request came from.
const BAA_COMPLIANCE_EMAIL = "compliance@prisma.io";
const BAA_MAIL_BODY = [
  "Company name:",
  "Company address:",
  "Account email:",
  "Workspace:",
  "Signatory name:",
  "Signatory email:",
  "",
  "Sent from prisma.io/legal/baa",
].join("\n");
const BAA_MAILTO = `mailto:${BAA_COMPLIANCE_EMAIL}?subject=${encodeURIComponent(
  "Web BAA Request",
)}&body=${encodeURIComponent(BAA_MAIL_BODY)}`;

// Review-preview page for a draft BAA layout; noindex until legal signs off.
export const metadata = {
  ...createPageMetadata({
    title: "HIPAA Business Associate Agreement",
    description:
      "Prisma's standard HIPAA Business Associate Agreement, read online or downloaded as a PDF.",
    path: "/legal/baa",
    ogKicker: "Legal",
  }),
  robots: { index: false, follow: false },
};

const PLAIN_ENGLISH = {
  "section-i":
    "The opening block identifies the two parties (your company and Prisma Data, Inc.) and anchors this HIPAA agreement to a separate services contract between you.",
  "section-ii":
    "Why this agreement exists: Prisma may touch protected health information while running the services, and HIPAA requires a written agreement that spells out how that information is handled.",
  "section-iii":
    "The glossary. These definitions are mostly direct references to the HIPAA regulations and set the meaning of terms like PHI, Reportable Event and Subcontractor for the rest of the document.",
  "section-iv":
    "What Prisma is allowed to do with PHI: perform the services you asked for, manage its own business within limits, and report violations. Anything else needs your written OK or has to be required by law.",
  "section-v":
    "What Prisma must do: keep safeguards in place, report incidents without unreasonable delay (and in no case later than 15 business days), forward individual access or amendment requests within 5 days, control subcontractors, keep records for 6 years, and never sell PHI.",
  "section-vi":
    "If Prisma causes a breach of this agreement or a reportable event, Prisma covers the resulting costs you incur, with the total capped at $250,000.",
  "section-vii":
    "The agreement lasts as long as your services contract. If it ends, Prisma returns or destroys the PHI it still holds, or extends these protections to anything it can't practically give back.",
  "section-viii":
    "Standard legal boilerplate: automatic updates when HIPAA changes, which clauses survive termination, how notices are given, governing law and an overall liability cap of $250,000.",
};

const KEY_TERMS = [
  {
    label: "Liability cap",
    value: (
      <>
        $250,000 standard. You can raise it to $500,000 for an extra $70 a month, $199 a month in
        total with the Business plan.
      </>
    ),
  },
  {
    label: "Breach notice",
    value:
      "Prisma notifies you without unreasonable delay, in no case later than 15 business days.",
  },
  {
    label: "Individual requests",
    value: "Prisma forwards access, amendment and accounting requests to you within 5 days.",
  },
  {
    label: "Term",
    value:
      "Coterminous with your Services Agreement; either side can terminate for uncured material breach.",
  },
  {
    label: "On termination",
    value:
      "Prisma returns or destroys the PHI it holds. Where that is infeasible, these protections continue to apply.",
  },
  {
    label: "How to request it",
    value: (
      <>
        Available on the Business plan. Read or download the BAA, sign up for Prisma and upgrade
        your workspace to Business, then email{" "}
        <a href={BAA_MAILTO} className={INLINE_LINK}>
          {BAA_COMPLIANCE_EMAIL}
        </a>{" "}
        from your account email with your company and signatory details.
      </>
    ),
  },
];

// Structured data: WebPage + Breadcrumb so the page is understood as part of
// /legal, and the title appears correctly in rich results.
function buildStructuredData(baseUrl: string) {
  const url = `${baseUrl}/legal/baa`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: "HIPAA Business Associate Agreement | Prisma",
      dateModified: "2026-10-11",
      publisher: { "@id": `${baseUrl}/#organization` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Legal", item: `${baseUrl}/legal` },
          { "@type": "ListItem", position: 2, name: "BAA", item: url },
        ],
      },
    },
  ];
}

export default function BaaPage() {
  return (
    <>
      <JsonLd id="baa-structured-data" data={buildStructuredData("https://www.prisma.io")} />
      <LegalAgreementPage
        title="HIPAA Business Associate Agreement"
        intro="The standard HIPAA Business Associate Agreement Prisma Data, Inc. signs with customers on the Business plan before they store protected health information in Prisma Postgres."
        lastUpdated="October 2026"
        pdfHref={BAA_PDF}
        keyTerms={KEY_TERMS}
        sections={BAA_SECTIONS}
        plainEnglish={PLAIN_ENGLISH}
        closingId="how-to-execute"
        closingLabel="Request your BAA"
        closing={
          <>
            <h2 className="text-xl leading-snug sm:text-2xl">
              How to request and execute your BAA
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
              The real agreement is countersigned by an authorised Prisma Data, Inc. signatory after
              you request it. The marketing page does not take requests.
            </p>
            <ol className="mt-5 flex flex-col gap-3 text-[0.9375rem] leading-relaxed text-foreground">
              <AgreementStep n={1}>
                Read the BAA above or{" "}
                <a href={BAA_PDF} className={INLINE_LINK}>
                  download the PDF
                </a>{" "}
                and share it with your legal and compliance team.
              </AgreementStep>
              <AgreementStep n={2}>
                <a href={CONSOLE_SIGN_UP} className={INLINE_LINK}>
                  Sign up for Prisma
                </a>{" "}
                and upgrade your workspace to the Business plan.
              </AgreementStep>
              <AgreementStep n={3}>
                Email{" "}
                <a href={BAA_MAILTO} className={INLINE_LINK}>
                  {BAA_COMPLIANCE_EMAIL}
                </a>{" "}
                from your account email with your company name, address, workspace, and signatory
                name and email.
              </AgreementStep>
              <AgreementStep n={4}>
                Prisma sends the agreement for e-signature, usually within 2 business days.
              </AgreementStep>
            </ol>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrismButton href={CONSOLE_SIGN_UP}>Get started</PrismButton>
              <PrismButtonOutline href={BAA_PDF}>Download as PDF</PrismButtonOutline>
            </div>
          </>
        }
      />
    </>
  );
}
