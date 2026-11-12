// Content for /postgres/hipaa.
//
// Rules for this page's copy (SEO / content brief, 11 Oct 2026):
//   - Price never appears in the title, meta description, H1 or closing CTA.
//   - All FAQ answers are rendered in the server HTML (the shared Faq
//     accordion already does that with Radix's `forceMount`).
//   - No em dashes or en dashes.
//   - HIPAA is Business-only on this page (sitewide reconciliation with any
//     older Pro+ wording lives outside this route).

export const HIPAA_PATH = "/postgres/hipaa";
// Deep-link id for the "How do I sign a BAA" section. The id stays
// `request-a-baa` so historical links keep resolving, but the heading itself
// is "How do I get a BAA from Prisma?" because the BAA is requested by email
// after upgrading to Business, not from a form on this page.
export const HIPAA_BAA_ANCHOR = "request-a-baa";
// In-page target for the hero "vs others" tease and any deep links into the
// competitor comparison table ("HIPAA without an enterprise budget").
export const HIPAA_COMPARE_ANCHOR = "compare";
export const BUSINESS_PRICE_USD = "129";
// Stable ISO date for WebPage JSON-LD dateModified. Keep in sync with the
// visible "Updated November 2026" microline on the HIPAA page.
export const HIPAA_LAST_MODIFIED = "2026-11-12";
// Same href the site header's "Get Started" button uses (components/header.tsx
// -> siteConfig.consoleSignUpUrl via the shared PrismButton pattern).
export const CONSOLE_SIGN_UP_URL = "https://console.prisma.io/sign-up";
export const CONSOLE_URL = "https://console.prisma.io";
export const TRUST_URL = "https://trust.prisma.io";
export const BAA_SAMPLE_PDF = "/legal/prisma-hipaa-baa-sample.pdf";
// The BAA request flow is email based: customers write to compliance@prisma.io
// with their company and signatory details and Prisma sends the agreement for
// e-signature. The mailto carries a canned subject the compliance mailbox
// filters on, plus a prefilled body template so the request lands with every
// field the signing workflow needs.
export const BAA_COMPLIANCE_EMAIL = "compliance@prisma.io";

const BAA_MAIL_SUBJECT = "Web BAA Request";
const BAA_MAIL_BODY_FIELDS = [
  "Company name:",
  "Company address:",
  "Account email:",
  "Workspace:",
  "Signatory name:",
  "Signatory email:",
].join("\n");

export function baaComplianceMailto(fromPath: "/postgres/hipaa" | "/legal/baa"): string {
  const body = `${BAA_MAIL_BODY_FIELDS}\n\nSent from prisma.io${fromPath}`;
  return `mailto:${BAA_COMPLIANCE_EMAIL}?subject=${encodeURIComponent(
    BAA_MAIL_SUBJECT,
  )}&body=${encodeURIComponent(body)}`;
}
// HTML version of the standard BAA. The buttons on /postgres/hipaa deep-link
// here instead of straight to the PDF: it gives readers a key-terms summary
// and plain-English notes alongside the legal text, with the PDF one click
// away from the top of the page.
export const BAA_HTML_PATH = "/legal/baa";

export type HipaaFaqItem = {
  question: string;
  // Shared Faq accordion syntax: `[text](/path)` for links, `{newtab}` after
  // an external link to open it in a new tab, and backticks for inline code
  // (see lib/faq-answer.tsx).
  answer: string;
};

// Visible FAQ. Every answer here also feeds FAQPage JSON-LD (see page.tsx).
export const HIPAA_FAQ: HipaaFaqItem[] = [
  {
    question: "Is Prisma Postgres HIPAA compliant?",
    answer:
      "Yes, on the Business plan. Prisma runs a HIPAA compliance program covering Prisma Postgres and Prisma Compute, and Business customers can sign a single Business Associate Agreement (BAA) with Prisma before storing protected health information. HIPAA is not available on the Free, Starter or Pro plans.",
  },
  {
    question: "How much does a HIPAA compliant Postgres database cost on Prisma?",
    answer:
      "HIPAA comes with the Business plan at $129 a month, including usage. A spend limit you set in the Console counts usage charges and stops queries to your workspace's databases when reached. There is no separate HIPAA fee. See [pricing](/pricing) for plan details.",
  },
  {
    question: "Does Prisma sign a BAA, and how do I get one?",
    answer:
      "Yes. Prisma signs a BAA with customers on the Business plan. Read or download the [BAA](/legal/baa), sign up for Prisma and upgrade your workspace to Business, then email compliance@prisma.io from your account email with your company name, address, workspace and signatory name and email. Prisma sends the agreement for e-signature.",
  },
  {
    question:
      "Will Prisma sign a BAA directly with a covered entity, such as a medical practice or clinic?",
    answer:
      "Yes. Prisma signs BAAs directly with covered entities as well as business associates. Covered entities usually have their own requirements or a custom BAA, so Prisma works through those terms with you rather than using the sample BAA, which is written for business associates. Email compliance@prisma.io to get started.",
  },
  {
    question: "Which products does the BAA cover?",
    answer:
      "The BAA covers Prisma Postgres databases and apps you host on [Prisma Compute](/compute) in a Business workspace, under one agreement. Keep protected health information in services covered by your signed BAA. Embeddable [Prisma Studio](/studio) is not designed for regulated industries under Prisma's [Terms of Service](/legal/terms).",
  },
  {
    question: "Does the BAA cover app hosting?",
    answer:
      "Yes. [Prisma Compute](/compute) is covered under the same BAA as Prisma Postgres, so you can host your HIPAA regulated Node.js, Bun or Next.js app alongside your database in a Business workspace without a second agreement or a second vendor.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In the region you choose when you create each database. Prisma Postgres runs in six regions: San Francisco (us-west-1), North Virginia (us-east-1), Paris (eu-west-3), Frankfurt (eu-central-1), Tokyo (ap-northeast-1) and Singapore (ap-southeast-1), so you can keep US patient data in a US region. Storing or transmitting PHI outside the United States needs your advance written consent under the BAA (Section V.O). See the [full list of regions](/docs/postgres/faq#what-regions-is-prisma-postgres-available-in).",
  },
  {
    question: "What am I responsible for under the shared responsibility model?",
    answer:
      "You are responsible for your application code, who can access your workspace and data, keeping PHI out of services the BAA does not cover, and your own HIPAA policies. Prisma secures the managed database and app hosting platform: encryption at rest and in transit, tenant isolation, daily database backups on paid plans and its internal compliance program.",
  },
  {
    question: "How are backups and encryption handled?",
    answer:
      "Every Prisma Postgres database is encrypted at rest and in transit. Paid plans include daily automatic backups: Starter and Pro keep them for 7 days, Business for 30. The Free plan has no backups. You restore a backup from the database's Backups tab in the Console; see the [backups docs](/docs/postgres/database/backups).",
  },
  {
    question: "Does Prisma Postgres provide audit logs?",
    answer:
      "Prisma can provide Prisma Postgres logs in cooperation with you when needed and on request. Logs are not available self-serve.",
  },
  {
    question: "Can I use Prisma ORM with PHI?",
    answer:
      "Yes. Prisma ORM is a library that runs inside your application, so it does not receive your data. Use it with Prisma Postgres or any Postgres database covered by your BAA, and keep PHI out of logs, error reports and query logging tools that are not covered. When your app also runs on Prisma Compute, both the app and the database sit inside your signed BAA.",
  },
  {
    question: "Can I use Prisma Postgres for a healthcare app that isn't written in TypeScript?",
    answer:
      "Yes. Prisma Postgres is standard Postgres, so apps in Python, Ruby, PHP, Java or Go can connect with any Postgres driver. See the [connection docs](/docs/postgres/database/connecting-to-your-database) for the connection string. The database is covered by your BAA on the Business plan. Prisma Compute is the right fit for Node.js, Bun and Next.js apps and is covered by the same BAA. For runtimes Prisma Compute does not support, if a third-party provider hosts your app it needs to sign a BAA too. HIPAA Compliant Hosting's [guide to HIPAA compliant app hosting](https://hipaacomplianthosting.com/blog/hipaa-compliant-app-hosting){newtab} covers the hosting options.",
  },
  {
    question: "Is there a liability cap in the BAA?",
    answer:
      "Yes. The standard BAA includes a liability cap of $250,000. Read the full terms in the [BAA](/legal/baa).",
  },
  {
    question: "Where can I find SOC 2, ISO 27001 and other audit reports?",
    answer:
      "In the [Prisma Trust Center](https://trust.prisma.io), which holds audit reports, policies and control details. HIPAA, SOC 2 Type II and ISO 27001 are included with the Business plan, and GDPR applies on every plan.",
  },
];

export const HIPAA_RESOURCES = [
  { kind: "Docs", title: "Get started with Prisma Postgres", href: "/docs/postgres" },
  {
    kind: "Docs",
    title: "Deploy your app on Prisma Compute",
    href: "/docs/compute",
  },
  {
    kind: "Docs",
    title: "Connect to your database",
    href: "/docs/postgres/database/connecting-to-your-database",
  },
  { kind: "Docs", title: "Backups and restore", href: "/docs/postgres/database/backups" },
  {
    kind: "Blog",
    title: "Search encrypted data with Prisma 8 and CipherStash",
    href: "/blog/search-encrypted-data-with-prisma-8-and-cipherstash",
  },
  {
    kind: "Blog",
    title: "Prisma completes SOC 2 Type II, HIPAA, GDPR and ISO 27001 requirements",
    href: "/blog/compliance-reqs-complete",
  },
] as const;
