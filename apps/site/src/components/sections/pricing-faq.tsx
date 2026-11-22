import { Faq, type FaqItem } from "@/components/sections/faq";

// V2's pricing FAQs, copy verbatim. The operation definition is the wording
// Gregory locked (db-only: API requests do not count) — keep it identical
// wherever it appears on the page.
//
// The Compute answers were rewritten for the GA launch (Shane, 2026-08-24):
// the beta-era "pricing will be published before general availability" line
// became false the moment the meter table went on this page, and the egress
// answer now scopes its "no" to Postgres since Compute bills outbound
// bandwidth. Rates quoted here must match pricing-data.ts computeMeters.
const PRICING_FAQS: FaqItem[] = [
  {
    question: "What counts as an operation?",
    answer:
      "An operation is a single action against your Prisma Postgres database: a create, read, update, or delete. A simple write and a complex query with multiple joins each count as one operation.",
  },
  {
    // Moved here from the Free plan card (client, 2026-11-22), where "Or skip
    // sign-up" read as a property of the Free plan. Facts from docs
    // postgres/npx-create-db: no account or card, deleted after 24 hours
    // unless claimed, a claimed database stays on Free, database only.
    // Absolute docs URL: /docs is another zone, so it must render as a plain
    // link, not a client-side next/link.
    question: "Can I try Prisma Postgres without signing up?",
    answer:
      "Yes. Run `npx create-db` and you get a Postgres database in seconds, with no account and no credit card. It's temporary: it's deleted after 24 hours unless you sign in and claim it, and a claimed database stays on the Free plan. It's a database only; deploying an app to Prisma Compute needs an account. [How create-db works](https://www.prisma.io/docs/postgres/npx-create-db).",
  },
  {
    question: "Is Prisma ORM really free?",
    answer:
      "Yes. Prisma ORM is open source and will always be free. The paid plans cover Prisma Postgres (managed database hosting) and Prisma Compute (app hosting).",
  },
  {
    question: "What happens if I exceed my plan's operations?",
    answer:
      "Overage rates kick in automatically at the per-million rate shown on your plan. You can set a spend limit on any paid plan: it counts usage charges in a billing cycle, and queries to your workspace's databases stop when it is reached.",
  },
  {
    question: "Are there egress fees?",
    answer:
      "Not for your database. Unlimited data transfer is included with Prisma Postgres on all plans. Prisma Compute includes 10 GB of outbound bandwidth per month on Free. Paid plans bill outbound bandwidth at $0.025 per GB.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes. You can upgrade or downgrade your plan at any time.",
  },
  {
    question: "What is Prisma Compute?",
    answer:
      "Prisma Compute is TypeScript app hosting built to run alongside Prisma Postgres. It runs on the same infrastructure, so your app and database are always next to each other. It's billed on usage across four meters (requests, provisioned memory, active CPU, and outbound bandwidth), and an idle app scales to zero and costs nothing.",
  },
  {
    question: "Is there custom pricing for high-volume teams?",
    answer:
      "Yes. If your usage exceeds what the Business plan covers, get in touch and we'll work out the right plan for your team.",
  },
];

export function PricingFaq() {
  return <Faq heading="FAQs" items={PRICING_FAQS} />;
}
