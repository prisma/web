// The facts behind "Keep your bill in check" (pricing-cost-controls.tsx), the
// section right under the plan cards: three cards (idle costs nothing, cap
// your spending, free on every plan). Shared by the section and
// the Markdown rendition (lib/markdown/pricing.ts) so the two can't drift.
//
// History: a "Free with every plan" section (a $0 heading, a lede and a grid
// of six items) sat between the plan cards and the calculator from
// 2026-11-21. Once the cards existed it repeated their message at 539px tall,
// so on 2026-11-22 the client agreed to fold it into one line under the
// cards, then into the third card. Prisma ORM, Studio, CLI and API left with it: they are product facts,
// not cost, and the "Compare plans" table still lists them.

/** What usage-based billing meters, in one paragraph. The Markdown page's
 *  subheadline only: the page itself says it with the hero title and the
 *  rates panel under the plan cards. */
export const PRICING_FLOW_LEDE =
  "On paid plans, usage-based billing covers the work itself: requests beyond your plan, " +
  "provisioned memory, active CPU and outbound bandwidth on Prisma Compute, and operations (one " +
  "per query) and storage beyond your plan on Prisma Postgres. Free has monthly limits and no " +
  "usage billing.";

// "Free on every plan", the third cost-control card (client, 2026-11-22: "three
// cost control ideas"). Each item traces to the docs or existing copy,
// worded no wider than the source:
//   - Deployments, preview branches: docs compute/pricing.mdx ("What is not
//     billed separately": deployments, preview branch creation). Creating a
//     preview branch is free; its services cost money while they do work, so
//     the copy says "creating", never just "preview branches".
//   - Team seats: "No seats" in pricing-comparison; no plan charges per person.
//   - Database data transfer: the former "Every plan includes" list
//     ("Unlimited, no egress fees"). Database only: Compute's outbound
//     bandwidth is billed.
//   - Connection pooling, query insights, Prisma Studio, Prisma ORM (client,
//     2026-11-24: "maybe add some more stuff here", after asking about query
//     insights): the "Compare plans" table marks each one on every plan
//     (Managed connection pool, Query insights, View and edit your data,
//     Prisma ORM "Free"). Pool limits differ by plan, so the detail says
//     "sized by plan" and names no number. This reverses the 2026-11-22 call
//     above that ORM and Studio were product facts, not cost.
// Idle apps aren't repeated here: the first card says it.
export type NeverBilledItem = {
  icon: "deploys" | "previews" | "seats" | "transfer" | "pool" | "insights" | "studio" | "orm";
  /** The tile in the card's illustration. */
  short: string;
  /** The Markdown rendition's bullet. */
  label: string;
  detail: string;
};

export const NEVER_BILLED: NeverBilledItem[] = [
  { icon: "deploys", short: "Deployments", label: "Deployments", detail: "as often as you like" },
  {
    icon: "previews",
    short: "Preview branches",
    label: "Creating preview branches",
    detail: "a preview costs money only while it does work",
  },
  { icon: "seats", short: "Team seats", label: "Team seats", detail: "no charge per person" },
  {
    icon: "transfer",
    short: "Database transfer",
    label: "Database data transfer",
    detail: "unlimited, no egress fees",
  },
  {
    icon: "pool",
    short: "Connection pool",
    label: "Managed connection pooling",
    detail: "sized by plan",
  },
  {
    icon: "insights",
    short: "Query insights",
    label: "Query insights",
    detail: "on every database",
  },
  {
    icon: "studio",
    short: "Prisma Studio",
    label: "Prisma Studio",
    detail: "view and edit your data",
  },
  { icon: "orm", short: "Prisma ORM", label: "Prisma ORM", detail: "free and open source" },
];

// "Keep your bill in check": three cards under the plan cards
// (pricing-cost-controls.tsx), client request 2026-11-22 after Vercel's "No
// idle, no waste" / "Control your spending" pair. They answer the worry that
// usage-based billing runs away from you, next to the prices that raise it.
//
// Precise to the docs, and no more:
//   - Idle: compute/pricing.mdx ("What is not billed separately": inactive
//     apps, apps scaled to zero) and Active CPU billed for CPU time used.
//     Deliberately NOT Vercel's "only pay for actual execution time":
//     provisioned memory is billed the whole time an app runs.
//   - Spending limit: console/more/billing.mdx. Optional, on paid plans, set
//     in the Console; caps usage charges, not the plan fee; every workspace
//     member is emailed at 75%; at 100% further usage is blocked until the
//     limit is raised or removed; no data is deleted. The docs name database
//     queries as what stops, so this says "usage is blocked" and makes no
//     claim either way about Compute apps. "Spending limit" is the Console's
//     own name for it.
export type CostControl = {
  title: string;
  body: string;
  link: { label: string; href: string };
};

export const COST_CONTROLS_HEADING = "Keep your bill in check";

export const COST_CONTROLS: [CostControl, CostControl, CostControl] = [
  {
    title: "Idle costs nothing",
    body:
      "Apps scale to zero when traffic stops, and an app that has scaled to zero isn't billed. " +
      "Active CPU is billed only for the CPU time your app uses.",
    link: { label: "How Compute is billed", href: "/docs/compute/pricing" },
  },
  {
    title: "Cap your spending",
    body:
      "Set a spending limit on any paid plan. It caps usage charges, not the plan fee. Your team " +
      "gets an email at 75%, and at 100% usage is blocked until you raise the limit. No data is " +
      "deleted.",
    link: {
      label: "How spending limits work",
      href: "/docs/console/more/billing#cap-usage-charges-with-a-spending-limit",
    },
  },
  {
    // Titles tried: "Never billed" read as "you'll never be billed"; "No
    // extra fees" was too abstract. The client (2026-11-22): it should be
    // immediately obvious that these four are included free on every plan,
    // so the title says exactly that and the tiles show the four. The body
    // keeps the one precision: creating a preview is free, running one is
    // ordinary usage.
    title: "Free on every plan",
    body:
      "Deployments, creating preview branches, team seats and database data transfer cost " +
      "nothing. Every plan also includes connection pooling, query insights, Prisma Studio and " +
      "Prisma ORM.",
    link: { label: "Compare what each plan includes", href: "/pricing#compare-plans" },
  },
];
