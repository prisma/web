// Content for /postgres/hipaa.
//
// This is a review-preview page (noindex, draft PR only). Yellow "Pending
// confirmation" and "Placeholder" badges stay visible on unconfirmed claims
// so reviewers can see what still needs sign-off before launch; see the PR
// description for the sources behind each claim and the list of pages that
// must be updated for consistency.
//
// Rules for this page's copy (SEO / content brief, 11 Oct 2026):
//   - Price never appears in the title, meta description, H1 or closing CTA.
//   - All FAQ answers are rendered in the server HTML (the shared Faq
//     accordion already does that with Radix's `forceMount`).
//   - No em dashes or en dashes.

export const HIPAA_PATH = "/postgres/hipaa";
export const HIPAA_BAA_ANCHOR = "request-a-baa";
export const BUSINESS_PRICE_USD = "129";
export const CONSOLE_URL = "https://console.prisma.io";
export const TRUST_URL = "https://trust.prisma.io";

export type Confidence = "confirmed" | "pending" | "placeholder";

export type HipaaFaqItem = {
  question: string;
  // Shared Faq accordion syntax: `[text](/path)` for links and backticks for
  // inline code (see lib/faq-answer.tsx). The visible answer is this string
  // with a pending/placeholder badge appended inline when `confidence` is not
  // "confirmed"; the FAQPage JSON-LD includes only "confirmed" items.
  answer: string;
  confidence: Confidence;
};

// Visible FAQ: 10 items in the order the mockup lists them. The 5 confirmed
// answers are the ones that feed FAQPage JSON-LD (see page.tsx).
export const HIPAA_FAQ: HipaaFaqItem[] = [
  {
    question: "Is Prisma Postgres HIPAA compliant?",
    answer:
      "Yes, on the Business plan. Prisma runs a HIPAA compliance program for Prisma Postgres, and Business customers can sign a Business Associate Agreement (BAA) with Prisma before storing protected health information. HIPAA is not available on the Free, Starter or Pro plans.",
    confidence: "confirmed",
  },
  {
    question: "Which Prisma Postgres plans include HIPAA?",
    answer:
      "Only the Business plan. Free, Starter and Pro include GDPR but not HIPAA. Business also includes SOC 2 Type II and ISO 27001, so one plan covers all of them. You can compare every plan on the [pricing page](/pricing).",
    confidence: "confirmed",
  },
  {
    question: "How much does a HIPAA compliant Postgres database cost on Prisma?",
    answer:
      "HIPAA comes with the Business plan at $129 a month. Usage beyond what the plan includes is billed by operations and storage, and spend limits let you cap your bill. There is no separate HIPAA fee.",
    confidence: "pending",
  },
  {
    question: "Does Prisma sign a BAA, and how do I request one?",
    answer:
      "Yes. Prisma signs a BAA with customers on the Business plan. Upgrade to Business, then use the request form to send your company details and signatory. Prisma sends the agreement for e-signature, usually within 2 business days.",
    confidence: "pending",
  },
  {
    question: "Which products does the BAA cover?",
    answer:
      "Coverage of Prisma Postgres, Compute, Buckets, Studio and other products is not confirmed yet. Embeddable Prisma Studio is not designed for regulated industries under Prisma's [Terms](/legal/terms).",
    confidence: "pending",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In the region you choose when you create each database. Prisma Postgres runs in six regions: San Francisco (us-west-1), North Virginia (us-east-1), Paris (eu-west-3), Frankfurt (eu-central-1), Tokyo (ap-northeast-1) and Singapore (ap-southeast-1), so you can keep US patient data in a US region. See the [Prisma Postgres FAQ](/docs/postgres/faq).",
    confidence: "pending",
  },
  {
    question: "What am I responsible for under the shared responsibility model?",
    answer:
      "You are responsible for your application, who can access your data, keeping PHI out of services the BAA does not cover, and your own HIPAA policies. Prisma secures the managed database platform: encryption at rest and in transit, tenant isolation, daily backups on paid plans and its internal compliance program.",
    confidence: "confirmed",
  },
  {
    question: "How are backups and encryption handled?",
    answer:
      "Every Prisma Postgres database is encrypted at rest and in transit. Paid plans include daily automatic backups: Starter and Pro keep them for 7 days, Business for 30. The Free plan has no backups. You restore a backup from the database's Backups tab in the Console; see the [backups docs](/docs/postgres/database/backups).",
    confidence: "confirmed",
  },
  {
    question: "Can I use Prisma ORM with PHI?",
    answer:
      "Yes. Prisma ORM is a library that runs inside your application, so it does not receive your data. Use it with Prisma Postgres or any Postgres database covered by your BAA, and keep PHI out of logs, error reports and query logging tools that are not covered.",
    confidence: "pending",
  },
  {
    question: "Is there a liability cap in the BAA?",
    answer:
      "Yes. The standard BAA includes a liability cap of USD 250,000. Higher liability coverage is available for an additional fee; [contact us](/contact) to discuss.",
    confidence: "confirmed",
  },
  {
    question: "Where can I find SOC 2, ISO 27001 and other audit reports?",
    answer:
      "In the [Prisma Trust Center](https://trust.prisma.io), which holds audit reports, policies and control details. HIPAA, SOC 2 Type II and ISO 27001 are included with the Business plan, and GDPR applies on every plan.",
    confidence: "confirmed",
  },
];

type PlanColumn = { name: string; price: string; highlight?: boolean };
export const HIPAA_PLAN_COLUMNS: readonly PlanColumn[] = [
  { name: "Free", price: "$0" },
  { name: "Starter", price: "$10 / month" },
  { name: "Pro", price: "$49 / month" },
  { name: "Business", price: "$129 / month", highlight: true },
];

type PlanRow = {
  label: string;
  // One cell per plan column, in the same order as HIPAA_PLAN_COLUMNS.
  // `true` renders a check, `false` renders a muted "No", a string renders
  // text (e.g. "7 days").
  cells: readonly (boolean | string)[];
};

export const HIPAA_PLAN_ROWS: PlanRow[] = [
  { label: "HIPAA with a signed BAA", cells: [false, false, false, true] },
  { label: "SOC 2 Type II", cells: [false, false, false, true] },
  { label: "ISO 27001", cells: [false, false, false, true] },
  { label: "GDPR", cells: [true, true, true, true] },
  { label: "Encryption at rest and in transit", cells: [true, true, true, true] },
  { label: "Tenant isolation", cells: [true, true, true, true] },
  { label: "Daily backups", cells: ["No", "7 days", "7 days", "30 days"] },
];

export const HIPAA_RESOURCES = [
  { kind: "Docs", title: "Get started with Prisma Postgres", href: "/docs/postgres" },
  {
    kind: "Docs",
    title: "Connect to your database",
    href: "/docs/postgres/database/connecting-to-your-database",
  },
  { kind: "Docs", title: "Backups and restore", href: "/docs/postgres/database/backups" },
  {
    kind: "Docs",
    title: "Prototype with synthetic data using npx create-db",
    href: "/docs/postgres/npx-create-db",
  },
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
