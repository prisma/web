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
      "An operation is a single action against your Prisma Postgres database — a create, read, update, or delete. A simple write and a complex query with multiple joins each count as one operation, and a cached read counts too.",
  },
  {
    question: "Is Prisma ORM really free?",
    answer:
      "Yes. Prisma ORM is open source and will always be free. The paid plans cover Prisma Postgres (managed database hosting) and Prisma Compute (app hosting).",
  },
  {
    question: "What happens if I exceed my plan's operations?",
    answer:
      "Overage rates kick in automatically at the per-1,000 rate shown on your plan. You can set a spend limit on any paid plan to cap how much you're charged in a billing cycle.",
  },
  {
    question: "Are there egress fees?",
    answer:
      "Not for your database — unlimited data transfer is included with Prisma Postgres on all plans. Apps hosted on Prisma Compute pay for outbound bandwidth at $0.025 per GB, as part of Compute's usage-based pricing.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes. You can upgrade or downgrade your plan at any time.",
  },
  {
    question: "What is Prisma Compute?",
    answer:
      "Prisma Compute is TypeScript app hosting built to run alongside Prisma Postgres — co-located on the same infrastructure so your app and database are always next to each other. It's billed on usage across four meters — requests, provisioned memory, active CPU, and outbound bandwidth — and an idle app scales to zero and costs nothing.",
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
