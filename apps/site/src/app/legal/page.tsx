import Link from "next/link";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { PanelHero } from "@/components/extensions/panel-hero";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { RoleKicker } from "@/components/brand/role-kicker";
import { ArrowRight, Mail, Shield } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { getBaseUrl } from "@/lib/url";
import { privacyEffectiveDate } from "@/lib/legal/privacy";
import { slaEffectiveDate } from "@/lib/legal/sla";
import { termsEffectiveDate } from "@/lib/legal/terms";

// A hub index of Prisma's legal and compliance documents. Mirrors how
// /postgres and /pricing are built: wrapped PanelHero on paper, then content
// sections at max-w-site. Design idioms (RoleKicker, PrismButton,
// IconTile-style accents, ArrowRight hover) are reused rather than re-rolled.
//
// Noindex until review approves, so Google does not surface the hub before
// copy and layout are signed off. The underlying document pages stay indexed.
const PAGE_PATH = "/legal";
const PAGE_TITLE = "Legal and compliance documents";
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
  description: string;
  lastUpdated?: string;
  external?: boolean;
};

type DocumentGroup = {
  title: string;
  summary: string;
  documents: Document[];
};

// Dates are read from the source each document ships with (see
// src/lib/legal/*.tsx and src/app/legal/baa/_baa-text.ts via its page.tsx);
// Security and Compliance has no dated version today, so the field is
// omitted rather than invented.
const GROUPS: DocumentGroup[] = [
  {
    title: "Terms and policies",
    summary:
      "The master agreements that govern using Prisma's services, from the free tier to Business plan workloads.",
    documents: [
      {
        title: "Terms of Service",
        href: "/legal/terms",
        description:
          "The service agreement every account signs up to. Covers acceptable use, billing, support, and liability for Prisma Postgres, Prisma Compute, Prisma ORM, and the Console.",
        lastUpdated: termsEffectiveDate,
      },
      {
        title: "Service Level Agreement",
        href: "/legal/sla",
        description:
          "Uptime commitments and service credits for paid Prisma Postgres and Prisma Compute workloads. For teams running production on Prisma.",
        lastUpdated: slaEffectiveDate,
      },
    ],
  },
  {
    title: "Privacy and data",
    summary:
      "How Prisma handles personal data on behalf of its customers and the people whose information passes through the platform.",
    documents: [
      {
        title: "Privacy Policy",
        href: "/legal/privacy",
        description:
          "What personal data Prisma collects, why, how long it is kept, and the rights people have over it under GDPR, CCPA, and other privacy laws.",
        lastUpdated: privacyEffectiveDate,
      },
    ],
  },
  {
    title: "Security and compliance",
    summary:
      "The certifications, controls, and public commitments behind Prisma's platform. Audit reports and subprocessor details live in the Trust Center.",
    documents: [
      {
        title: "Security and Compliance",
        href: "/legal/security-and-compliance",
        description:
          "Prisma's SOC 2 Type II, ISO 27001, GDPR, and HIPAA posture, plus which plans each standard covers. The jumping-off point into the Trust Center for teams in regulated environments.",
      },
      {
        title: "Trust Center",
        href: "https://trust.prisma.io",
        description:
          "The live portal for audit reports, subprocessors, and security questionnaires. For procurement, security, and compliance reviewers.",
        external: true,
      },
      {
        title: "Security vulnerability disclosure",
        href: "/.well-known/security.txt",
        description:
          "Where to report a security issue in Prisma's platform or packages, and how to reach the security team. Follows the security.txt standard.",
      },
    ],
  },
  {
    title: "Healthcare (HIPAA)",
    summary:
      "For teams building apps that handle protected health information on Prisma. Available from the Pro plan.",
    documents: [
      {
        title: "HIPAA Business Associate Agreement",
        href: "/legal/baa",
        description:
          "Prisma's standard BAA, read online or downloaded as a PDF, for customers covered under HIPAA. Sign before putting protected health information through Prisma Postgres or Prisma Compute.",
        lastUpdated: "October 2026",
      },
    ],
  },
];

function DocumentCard({ document: doc }: { document: Document }) {
  const external = doc.external ?? doc.href.startsWith("http");
  // next/link handles both internal routes and the public /.well-known/
  // asset, so one component covers every row; external absolute URLs still
  // need rel/target.
  return (
    <li className="group relative flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-colors hover:border-black/[0.2] hover:bg-paper focus-within:border-black/[0.2]">
      <h3 className="text-lg font-semibold leading-snug text-foreground">
        <Link
          href={doc.href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-prism-cyan-500 focus-visible:after:ring-offset-2"
        >
          {doc.title}
        </Link>
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{doc.description}</p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-2 text-sm">
        {doc.lastUpdated ? (
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Last updated {doc.lastUpdated}
          </span>
        ) : (
          <span aria-hidden />
        )}
        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors group-hover:text-prism-cyan-700">
          {external ? "Open" : "Read document"}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      </div>
    </li>
  );
}

function DocumentGroupSection({ group, index }: { group: DocumentGroup; index: number }) {
  return (
    <section
      aria-labelledby={`legal-${index}`}
      className="border-t border-black/[0.08] py-14 first:border-t-0 first:pt-0 sm:py-16"
    >
      <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-14">
        <Reveal>
          <div>
            <h2
              id={`legal-${index}`}
              className="text-balance text-2xl leading-[1.15] text-foreground sm:text-[1.75rem]"
            >
              {group.title}
            </h2>
            <p className="mt-3 max-w-[36ch] text-pretty text-sm leading-relaxed text-muted-foreground">
              {group.summary}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          {/* One card: keep it at the width a two-column row would give, so a
              single-document group reads the same as the first card of a
              multi-document one and never stretches into a billboard. */}
          <ul
            className={
              group.documents.length === 1
                ? "grid gap-4 sm:max-w-[32rem]"
                : "grid gap-4 sm:grid-cols-2"
            }
          >
            {group.documents.map((doc) => (
              <DocumentCard key={doc.href} document={doc} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// WebPage + BreadcrumbList JSON-LD. The hub itself is a WebPage; the
// BreadcrumbList sits beside it so Google can connect Home to Legal to each
// document. ItemList enumerates the documents on the hub so the structure
// mirrors what a reader sees.
function buildStructuredData() {
  const baseUrl = getBaseUrl();
  const absolute = (path: string) =>
    path.startsWith("http") ? path : new URL(path, baseUrl).toString();
  const pageUrl = absolute(PAGE_PATH);

  const items = GROUPS.flatMap((group) =>
    group.documents.map((doc) => ({
      name: doc.title,
      url: absolute(doc.href),
      description: doc.description,
    })),
  );

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
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: item.url,
            name: item.name,
            description: item.description,
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

      <PanelHero
        kicker="Legal"
        title="Prisma's legal and compliance documents"
        lead="One place for the agreements and policies that govern using Prisma. Read any document on this page, or open the Trust Center for live audit reports, subprocessors, and security questionnaires."
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <PrismButton href="https://trust.prisma.io/" ctaLocation="legal-hero">
            Open the Trust Center
          </PrismButton>
          <PrismButtonOutline href="/legal/security-and-compliance">
            See compliance posture
          </PrismButtonOutline>
        </div>
      </PanelHero>

      <section className="bg-white px-4 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex max-w-site flex-col">
          {GROUPS.map((group, i) => (
            <DocumentGroupSection key={group.title} group={group} index={i} />
          ))}
        </div>
      </section>

      {/* Closing callout: a single question-and-answer row rather than another
          CTA burst. The hub's job is routing readers to the right document;
          anything louder than this competes with the cards above. */}
      <section className="bg-white px-4 pb-28 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-paper px-6 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden"
            >
              <div
                className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
                style={{
                  background:
                    "radial-gradient(50% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 18%, transparent), transparent 70%)",
                }}
              />
            </div>
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <RoleKicker color="bg-prism-cyan-400">Questions</RoleKicker>
                <h2 className="mt-3 max-w-[22ch] text-balance text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-foreground">
                  Talk to compliance before you sign
                </h2>
                <p className="mt-4 max-w-[58ch] text-pretty leading-relaxed text-muted-foreground">
                  Procurement, security, and legal reviews are welcome. Email{" "}
                  <a
                    href="mailto:compliance@prisma.io"
                    className="font-semibold text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60"
                  >
                    compliance@prisma.io
                  </a>{" "}
                  with questions about the documents on this page, redlines on a BAA or master
                  agreement, or any security questionnaire. Audit reports, subprocessor lists, and
                  live attestations are available in the Trust Center.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="mailto:compliance@prisma.io"
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.15] bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan-500 focus-visible:ring-offset-2"
                >
                  <Mail aria-hidden className="size-4" />
                  compliance@prisma.io
                </a>
                <a
                  href="https://trust.prisma.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.15] bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan-500 focus-visible:ring-offset-2"
                >
                  <Shield aria-hidden className="size-4" />
                  Trust Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
