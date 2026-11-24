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
// Questions added 2026-11-24 from Promptwatch: what people ask AI assistants
// around Prisma pricing, where Prisma was often missing from the answer
// (comparison with Neon and Supabase, usage-based vs fixed for a small app,
// a hard spend limit for an agent's deployments, keeping an agent-built app's
// costs from surprising you, previews per branch). Figures come from the
// page itself (comparison section, calculator) and the Compute pricing docs'
// worked examples; the spend-limit wording matches the "Cap your spending"
// card. Exported so the Markdown rendition reads the same list.
// Plain-string answers (not ReactNode), so the Markdown can render them too.
export const PRICING_FAQS: (FaqItem & { answer: string })[] = [
  {
    question: "What counts as an operation?",
    answer:
      "An operation is a single action against your Prisma Postgres database: a create, read, update, or delete. A simple write and a complex query with multiple joins each count as one operation.",
  },
  {
    question: "How does Prisma pricing compare with Neon and Supabase?",
    answer:
      "At around 50K monthly active users, Prisma Pro comes to about $72–90 a month, against $95–145 for Supabase Pro and $110–270 for a typical Neon + Vercel setup. You also get one bill, included database data transfer and a hard spend limit. [See the comparison](#compare).",
  },
  {
    question: "Is usage-based pricing cheaper than a fixed plan for a small app?",
    answer:
      "It depends on how busy your app is, but you never pay for idle time: an app that isn't serving traffic scales to zero and costs nothing. A typical web app with about 570,000 requests a month comes to about $11.25 on Starter, the $10 plan plus about $1.25 of Compute usage. [Estimate your own app](/pricing/calculator).",
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
  // For agent builders: what an agent costs to run, how to stop one running up
  // a bill, what its previews cost, and whether it can read usage.
  {
    question: "How much does it cost to run an AI agent on Prisma Compute?",
    answer:
      "Agents spend most of their time waiting on a model API or another service. While a task waits it uses almost no CPU, so active CPU stays low, but the app keeps its memory, so provisioned memory is usually the bigger line. In the agent example in the Compute pricing docs, 10,000 tasks of 30 seconds each come to about $1.17 of usage in a month. [See the worked examples](https://www.prisma.io/docs/compute/pricing).",
  },
  {
    question: "Can I stop an AI agent from running up a bill?",
    answer:
      "Yes. Set a spending limit on any paid plan. It caps usage charges across your app and database, not the plan fee. Your team gets an email at 75%, and at 100% usage is blocked until you raise the limit. No data is deleted.",
  },
  {
    question: "Do preview deployments from my coding agent cost anything?",
    answer:
      "Deploying and creating preview branches are free. A preview only costs money when it does work, such as serving traffic, and an idle one scales to zero. In the Compute pricing docs, a preview an agent deploys several times while fixing a change comes to about $0.03.",
  },
  {
    question: "Can my agent check our usage and costs?",
    answer:
      "For databases, yes. Usage is available from the CLI (`postgres usage`) and the API, including as JSON, so an agent can read it to estimate a cost or explain a change. Equivalent usage reporting for Prisma Compute is still being built.",
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
