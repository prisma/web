import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import {
  AgreementStep,
  INLINE_LINK,
  LegalAgreementPage,
} from "@/components/sections/legal-agreement-page";
import { DPA_SECTIONS } from "./_dpa-text";

const DPA_PDF = "/legal/prisma-dpa.pdf";
const DPO_EMAIL = "dpo@prisma.io";
const TRUST_URL = "https://trust.prisma.io/";

// Signed copies go through the same email-based e-signature flow as the BAA:
// customers write to compliance@prisma.io with their company and signatory
// details. The canned subject lets the compliance mailbox filter these, and
// the "Sent from" line names the page the request came from.
const DPA_COMPLIANCE_EMAIL = "compliance@prisma.io";
const DPA_MAIL_BODY = [
  "Company name:",
  "Company address:",
  "Account email:",
  "Workspace:",
  "Signatory name:",
  "Signatory title:",
  "Signatory email:",
  "",
  "Sent from prisma.io/legal/dpa",
].join("\n");
const DPA_MAILTO = `mailto:${DPA_COMPLIANCE_EMAIL}?subject=${encodeURIComponent(
  "Web DPA Request",
)}&body=${encodeURIComponent(DPA_MAIL_BODY)}`;

// Review-preview page laid out like /legal/baa; noindex until legal signs off
// on the plain-English notes and key terms.
export const metadata = {
  ...createPageMetadata({
    title: "Data Processing Agreement",
    description:
      "Prisma's Data Processing Agreement for GDPR, UK GDPR and CCPA, read online or downloaded as a PDF.",
    path: "/legal/dpa",
    ogKicker: "Legal",
  }),
  robots: { index: false, follow: false },
};

const PLAIN_ENGLISH = {
  "section-i":
    'The glossary. It reuses the definitions from the Terms of Service and Privacy Policy, names the data protection laws in scope (GDPR, UK GDPR, CCPA/CPRA and similar) and confirms that "Prisma" means Prisma Data, Inc.',
  "section-ii":
    "When you are the controller of personal data you put into Prisma, Prisma acts as your processor. The DPA applies for as long as the Terms of Service apply to you or Prisma processes the data, whichever is longer.",
  "section-iii":
    "Prisma only processes your data for the purpose in the annex, unless the law requires otherwise, and tells you if it thinks one of your instructions breaks data protection law.",
  "section-iv":
    "Data can leave the EEA, UK or Switzerland, but only under recognised safeguards: the EU Standard Contractual Clauses, the UK IDTA or the Data Privacy Framework, with transfer impact assessments where required.",
  "section-v": "Only send Prisma personal data you have the right to share.",
  "section-vi": "Everyone Prisma authorises to handle your data is bound by confidentiality.",
  "section-vii":
    "Prisma keeps security measures appropriate to the risk, can show you evidence of them on request, and maintains ISO 27001 and SOC 2 Type II compliance where applicable.",
  "section-viii":
    "You can have an independent, non-competitor auditor check Prisma's compliance at your own cost, with 28 days' notice and an NDA in place.",
  "section-ix":
    "Prisma tells you about authority requests for your data unless the law forbids it.",
  "section-x":
    "Prisma tells you in writing within 72 hours of becoming aware of a suspected or confirmed personal data breach, in line with GDPR Article 33.",
  "section-xi":
    "Prisma helps you answer data subject requests, normally within 30 days, and redirects anyone who contacts Prisma directly to you. It also supports impact assessments and audits.",
  "section-xii":
    "Prisma's subprocessors are listed on the Trust Center. You get an email when the list changes and have 28 days to object on reasonable data protection grounds.",
  "section-xiii":
    "Prisma keeps your data only as long as needed, then returns or deletes it and confirms the deletion in writing if you ask.",
  "section-xiv":
    "Prisma's data protection officer is a subsidiary in Germany, reachable at dpo@prisma.io.",
  "section-xv":
    "The annex describes what is processed and why: platform access for you and your users, covering names, email addresses, account numbers and any other personal data you store with Prisma.",
};

const KEY_TERMS = [
  {
    label: "Laws covered",
    value:
      "GDPR, UK GDPR, the California Consumer Privacy Act (CCPA/CPRA) and other applicable data protection laws.",
  },
  {
    label: "Breach notice",
    value:
      "Prisma notifies you in writing without undue delay and within 72 hours of becoming aware.",
  },
  {
    label: "Data subject requests",
    value:
      "Prisma assists with access, rectification and deletion requests, normally within 30 days.",
  },
  {
    label: "International transfers",
    value:
      "2021 EU Standard Contractual Clauses, the UK IDTA and the EU-US, UK and Swiss Data Privacy Frameworks.",
  },
  {
    label: "Subprocessors",
    value: (
      <>
        Listed on the{" "}
        <a href={TRUST_URL} className={INLINE_LINK}>
          Trust Center
        </a>
        . You're notified by email of changes and can object within 28 days.
      </>
    ),
  },
  {
    label: "Audits",
    value: "An independent auditor at your cost, with 28 days' notice and an NDA.",
  },
  {
    label: "Term",
    value:
      "As long as the Terms of Service apply to you, or Prisma processes your data, whichever is longer.",
  },
  {
    label: "Signed copy",
    value: (
      <>
        Email{" "}
        <a href={DPA_MAILTO} className={INLINE_LINK}>
          {DPA_COMPLIANCE_EMAIL}
        </a>{" "}
        with your company and signatory details and Prisma sends the DPA for e-signature.
      </>
    ),
  },
];

// Structured data: WebPage + Breadcrumb so the page is understood as part of
// /legal, and the title appears correctly in rich results.
function buildStructuredData(baseUrl: string) {
  const url = `${baseUrl}/legal/dpa`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: "Data Processing Agreement | Prisma",
      dateModified: "2025-09-10",
      publisher: { "@id": `${baseUrl}/#organization` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Legal", item: `${baseUrl}/legal` },
          { "@type": "ListItem", position: 2, name: "DPA", item: url },
        ],
      },
    },
  ];
}

export default function DpaPage() {
  return (
    <>
      <JsonLd id="dpa-structured-data" data={buildStructuredData("https://www.prisma.io")} />
      <LegalAgreementPage
        title="Data Processing Agreement"
        intro="The Data Processing Agreement between you and Prisma Data, Inc. that governs how Prisma processes personal data on your behalf under the GDPR, UK GDPR, CCPA and other data protection laws."
        lastUpdated="10 September 2025"
        pdfHref={DPA_PDF}
        keyTerms={KEY_TERMS}
        sections={DPA_SECTIONS}
        plainEnglish={PLAIN_ENGLISH}
        closingId="request-signed-dpa"
        closingLabel="Request a signed DPA"
        closing={
          <>
            <h2 className="text-xl leading-snug sm:text-2xl">Request a signed DPA</h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
              If your vendor review needs a countersigned copy, request one by email and Prisma
              sends the DPA for e-signature.
            </p>
            <ol className="mt-5 flex flex-col gap-3 text-[0.9375rem] leading-relaxed text-foreground">
              <AgreementStep n={1}>
                Read the DPA above or{" "}
                <a href={DPA_PDF} className={INLINE_LINK}>
                  download the PDF
                </a>{" "}
                and share it with your legal and privacy team.
              </AgreementStep>
              <AgreementStep n={2}>
                Email{" "}
                <a href={DPA_MAILTO} className={INLINE_LINK}>
                  {DPA_COMPLIANCE_EMAIL}
                </a>{" "}
                with your company name and address, your account email and workspace, and the
                signatory's name, title and email.
              </AgreementStep>
              <AgreementStep n={3}>
                Prisma sends the DPA to your signatory for e-signature and countersigns it.
              </AgreementStep>
            </ol>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrismButton href={DPA_MAILTO}>Request a signed DPA</PrismButton>
              <PrismButtonOutline href={DPA_PDF}>Download as PDF</PrismButtonOutline>
            </div>
            <p className="mt-8 border-t border-black/[0.07] pt-6 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Questions about this DPA or how Prisma processes personal data? Email Prisma's data
              protection officer at{" "}
              <a href={`mailto:${DPO_EMAIL}`} className={INLINE_LINK}>
                {DPO_EMAIL}
              </a>
              .
            </p>
          </>
        }
      />
    </>
  );
}
