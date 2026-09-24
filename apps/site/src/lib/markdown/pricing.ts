import {
  bulletList,
  ctaList,
  definitionList,
  heading,
  joinBlocks,
  link,
  paragraphs,
  table,
} from "./blocks";
import { renderTestimonialsMarkdown } from "./testimonials";

/**
 * Markdown rendition of /pricing.
 *
 * Source of truth is the section components rendered by src/app/pricing/page.tsx —
 * pricing-hero, pricing-plans, pricing-how-it-works (+ pricing-includes),
 * pricing-calculator (+ calculator-options/calc.ts), pricing-comparison,
 * pricing-spec-table, testimonials-reveal, cta-burst and pricing-faq.
 *
 * NOTE: src/lib/pricing-data.ts looks canonical but the pricing page does not
 * import it — it is a separate copy consumed only by src/app/llms-content.ts.
 * Every figure below is transcribed from the section files above, so if the two
 * copies ever disagree the section files win here.
 */

const SIGN_UP = "https://console.prisma.io/sign-up";

export const PRICING_H1 = "Usage-based pricing that bills you for what your app actually does";

// The hero has no subhead paragraph of its own: it was removed on 2026-07-30
// so the plan cards clear the fold, and its operation definition moved into the
// opening paragraph of "How Prisma pricing works" (see the note in
// pricing-hero.tsx). That paragraph is therefore the page's lede and is
// exported here — the caller emits it, so the section below starts at its
// second paragraph rather than repeating it.
export const PRICING_SUBHEADLINE =
  "Prisma bills you for real work, on both halves of your stack. Your app on Prisma Compute " +
  "pays for the requests it serves, the memory and CPU it uses while running, and the data it " +
  "sends out. Your database on Prisma Postgres counts every query as one operation, and " +
  "operations are what you pay for.";

/** Mirrors PLANS in components/sections/pricing-plans.tsx. `blurb` lives on that
 *  data but is deliberately never rendered, so it is not repeated here. */
const PLANS = [
  {
    name: "Free",
    price: "$0 / month",
    note: "Free forever. No credit card required.",
    compute: [
      "1M requests / month",
      "360 GB-hours memory / month",
      "4 active vCPU-hours / month",
      "10 GB outbound bandwidth / month",
    ],
    postgres: ["200k operations / month", "500 MB storage", "50 databases"],
    platform: [],
    cta: "Start for free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$10 / month",
    note: null,
    compute: [
      "5M requests / month, then $1 per million",
      "$0.006 per GB-hour memory",
      "$0.064 per active vCPU-hours",
      "$0.025 per GB outbound bandwidth",
    ],
    postgres: [
      "1M operations / month, then $8 per million",
      "10 GB storage, then $2.00 per GB",
      "1,000 databases",
      "7-day daily backups",
    ],
    platform: ["Spend limits"],
    cta: "Get started",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49 / month",
    note: null,
    compute: [
      "20M requests / month, then $1 per million",
      "$0.006 per GB-hour memory",
      "$0.064 per active vCPU-hours",
      "$0.025 per GB outbound bandwidth",
    ],
    postgres: [
      "10M operations / month, then $2 per million",
      "50 GB storage, then $1.50 per GB",
      "1,000 databases",
      "7-day daily backups",
    ],
    platform: ["Spend limits", "GDPR, HIPAA"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Business",
    price: "$129 / month",
    note: null,
    compute: [
      "100M requests / month, then $1 per million",
      "$0.006 per GB-hour memory",
      "$0.064 per active vCPU-hours",
      "$0.025 per GB outbound bandwidth",
    ],
    postgres: [
      "50M operations / month, then $1 per million",
      "100 GB storage",
      "1,000 databases",
      "30-day backup retention",
    ],
    platform: ["Spend limits", "GDPR, HIPAA, SOC 2, ISO 27001"],
    cta: "Get started",
    popular: false,
  },
];

// The four cards are one comparison in the HTML (a single grid, one row of
// features per product group), so they render as a table. An empty Platform
// group is an em dash, which is the same "not on this plan" reading the spec
// table uses for Free.
function planTable(): string {
  return table(
    ["Plan", "Price", "Prisma Compute", "Prisma Postgres", "Platform", "Get started"],
    PLANS.map((plan) => [
      plan.popular ? `${plan.name} (Most popular)` : plan.name,
      plan.note ? `${plan.price} — ${plan.note}` : plan.price,
      plan.compute.join("; "),
      plan.postgres.join("; "),
      plan.platform.length > 0 ? plan.platform.join("; ") : "—",
      link({ label: plan.cta, href: SIGN_UP }),
    ]),
  );
}

/** INCLUDES in components/sections/pricing-includes.tsx. */
const EVERY_PLAN_INCLUDES = [
  "Prisma ORM (always free)",
  "Unlimited Prisma Postgres data transfer",
  "Spend limits",
  "Prisma Studio",
  "CLI + Management API",
];

// PRESETS in components/sections/calculator-options/calc.ts, with the usage
// readout each button shows (fmtOps · fmtGB). The V2 `blurb` on each preset is
// not rendered by the compact preset row, so it is not included.
const CALCULATOR_PRESETS = [
  "Hobby — 100K · 500 MB",
  "Startup — 1M · 8 GB",
  "Scaleup — 20M · 40 GB",
];

// planTerms() from calc.ts, evaluated for each plan. These strings are static —
// only the monthly totals and the "Recommended" / "Not available" states depend
// on the slider positions, and those are interactive-only, so they are omitted.
const CALCULATOR_PLAN_TERMS = [
  { name: "Free plan", description: "100,000 ops • 0.5GB storage • free forever" },
  {
    name: "Starter plan",
    description: "1,000,000 ops included, then $0.008 per 1,000 • 10GB included, then $2/GB",
  },
  {
    name: "Pro plan",
    description: "10,000,000 ops included, then $0.002 per 1,000 • 50GB included, then $1.5/GB",
  },
  {
    name: "Business plan",
    description: "50,000,000 ops included, then $0.001 per 1,000 • 100GB included, then $1/GB",
  },
];

// PRISMA + ALTERNATIVES in components/sections/pricing-comparison.tsx. The
// label column has no header in the HTML (the cost bars are decoration and are
// skipped); "Feature" is added so the table parses cleanly.
const COMPARISON_HEADERS = [
  "Feature",
  "Typical stack (Neon + Vercel)",
  "Supabase Pro",
  "Prisma Pro",
];

const COMPARISON_ROWS = [
  ["Monthly cost at ~50K MAU", "$385–450", "$95–145", "$72–90"],
  [
    "Billing",
    "Separate database + hosting bills",
    "Platform subscription + Postgres compute + function usage",
    "One bill, one platform",
  ],
  ["Database data transfer", "Pay per GB", "250 GB egress included, then $0.09/GB", "Included"],
  [
    "Spend limits",
    "Not standard",
    "Spend cap on by default for covered usage; database compute excluded",
    "On by default",
  ],
];

// GROUPS + PLAN_ROW in components/sections/pricing-spec-table.tsx. `yes` cells
// render as a check icon labelled "Included", so that is the cell text here.
// Starter carries a "Most popular" marker in the table head too; it is already
// stated on the plan table above rather than repeated in all seven headers.
const SPEC_COLUMNS = ["Free", "Starter", "Pro", "Business"];
const INCLUDED = "Included";

const SPEC_PLAN_ROW: [string, string, string, string, string] = [
  "Monthly price",
  "$0",
  "$10",
  "$49",
  "$129",
];

const SPEC_GROUPS: { label: string; rows: [string, string, string, string, string][] }[] = [
  {
    label: "Prisma Postgres",
    rows: [
      ["Operations included", "200k", "1M", "10M", "50M"],
      ["Operation overage", "—", "$8 per million", "$2 per million", "$1 per million"],
      ["Storage included", "500 MB", "10 GB", "50 GB", "100 GB"],
      ["Storage overage", "—", "$2.00 per GB", "$1.50 per GB", "$1.00 per GB"],
      ["Databases", "50", "1,000", "1,000", "1,000"],
      ["Data transfer", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Spend limits", "—", INCLUDED, INCLUDED, INCLUDED],
    ],
  },
  {
    label: "Prisma Compute",
    rows: [
      ["Requests included", "1M", "5M", "20M", "100M"],
      ["Request price", "—", "$1 per million", "$1 per million", "$1 per million"],
      ["Provisioned memory included", "360 GB-hours", "—", "—", "—"],
      [
        "Provisioned memory price",
        "—",
        "$0.006 per GB-hour",
        "$0.006 per GB-hour",
        "$0.006 per GB-hour",
      ],
      ["Active CPU included", "4 vCPU-hours", "—", "—", "—"],
      [
        "Active CPU price",
        "—",
        "$0.064 per vCPU-hour",
        "$0.064 per vCPU-hour",
        "$0.064 per vCPU-hour",
      ],
      ["Outbound bandwidth included", "10 GB", "—", "—", "—"],
      ["Outbound bandwidth price", "—", "$0.025 per GB", "$0.025 per GB", "$0.025 per GB"],
      ["Scale to zero when idle", INCLUDED, INCLUDED, INCLUDED, INCLUDED],
    ],
  },
  {
    label: "Managed connection pool",
    rows: [
      ["Connection limit (pooled)", "10", "100", "500", "1,000"],
      ["Connection limit (direct)", "10", "10", "50", "100"],
      ["Connection idle timeout", "60 minutes", "60 minutes", "60 minutes", "60 minutes"],
      ["Auto-scaling", INCLUDED, INCLUDED, INCLUDED, INCLUDED],
      ["Operation response size", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Operation duration (db queries)", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Operation duration (interactive)", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
    ],
  },
  {
    label: "Accelerate (global cache)",
    rows: [
      ["Operations included", "60,000", "60,000", "60,000", "60,000"],
      ["Operation overage", "—", "$0.018 per 1,000", "$0.008 per 1,000", "$0.006 per 1,000"],
      [
        "Egress included",
        "1 KiB per query",
        "1 KiB per query",
        "1 KiB per query",
        "2 KiB per query",
      ],
      ["Egress overage", "—", "$0.09 per GiB", "$0.09 per GiB", "$0.08 per GiB"],
      [
        "Cache tag invalidations",
        "—",
        "—",
        "$0.002 per 1,000, max 10,000 per day",
        "$0.001 per 1,000, max 100,000 per day",
      ],
      ["Cache purge requests", "5 per hour", "5 per hour", "10 per hour", "20 per hour"],
    ],
  },
  {
    label: "Data",
    rows: [
      ["Query insights", INCLUDED, INCLUDED, INCLUDED, INCLUDED],
      ["View and edit your data", INCLUDED, INCLUDED, INCLUDED, INCLUDED],
      [
        "Backups",
        "—",
        "Daily, 7-day retention",
        "Daily, 7-day retention",
        "Daily, 30-day retention",
      ],
    ],
  },
  {
    label: "Platform",
    rows: [
      ["Support", "Community", "Community", "Standard", "Premium"],
      ["Compliance", "GDPR", "GDPR", "GDPR, HIPAA", "GDPR, HIPAA, SOC 2, ISO 27001"],
      ["Prisma ORM", "Free", "Free", "Free", "Free"],
    ],
  },
];

/** PRICING_FAQS in components/sections/pricing-faq.tsx, rendered through Faq.
 *  Accordion bodies are included even though only the first is open. */
const FAQS = [
  {
    question: "What counts as an operation?",
    answer:
      "An operation is a single action against your Prisma Postgres database — a create, read, " +
      "update, or delete. A simple write and a complex query with multiple joins each count as " +
      "one operation, and a cached read counts too.",
  },
  {
    question: "Is Prisma ORM really free?",
    answer:
      "Yes. Prisma ORM is open source and will always be free. The paid plans cover Prisma " +
      "Postgres (managed database hosting) and Prisma Compute (app hosting).",
  },
  {
    question: "What happens if I exceed my plan's operations?",
    answer:
      "Overage rates kick in automatically at the per-million rate shown on your plan. You can " +
      "set a spend limit on any paid plan to cap how much you're charged in a billing cycle.",
  },
  {
    question: "Are there egress fees?",
    answer:
      "Not for your database — unlimited data transfer is included with Prisma Postgres on all " +
      "plans. Prisma Compute includes 10 GB of outbound bandwidth per month on Free. Paid plans " +
      "bill outbound bandwidth at $0.025 per GB.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes. You can upgrade or downgrade your plan at any time.",
  },
  {
    question: "What is Prisma Compute?",
    answer:
      "Prisma Compute is TypeScript app hosting built to run alongside Prisma Postgres — " +
      "co-located on the same infrastructure so your app and database are always next to each " +
      "other. It's billed on usage across four meters — requests, provisioned memory, active " +
      "CPU, and outbound bandwidth — and an idle app scales to zero and costs nothing.",
  },
  {
    question: "Is there custom pricing for high-volume teams?",
    answer:
      "Yes. If your usage exceeds what the Business plan covers, get in touch and we'll work out " +
      "the right plan for your team.",
  },
];

/** Markdown rendition of /pricing (src/app/pricing/page.tsx). */
export function renderPricingMarkdown(): string {
  return joinBlocks([
    // The plan cards sit inside the hero panel with no heading of their own
    // (PricingHero takes them as children), so this H2 is structural — it is the
    // only block on the page without an HTML heading to carry it.
    heading(2, "Plans"),
    planTable(),
    heading(3, "Need more?"),
    paragraphs("Custom pricing is available for high-volume teams."),
    ctaList([{ label: "Contact us", href: "/contact" }]),

    heading(2, "How Prisma pricing works"),
    // First paragraph omitted: it is PRICING_SUBHEADLINE, which the caller emits.
    paragraphs([
      "The ceremony around shipping stays free: deploys, preview branches, idle time, and the " +
        "number of people on your team never add to the bill. An idle app scales to zero and " +
        "costs nothing. A request does the same work whether it comes from a person, a script, " +
        "or an AI agent, so that work is all you're charged for.",
      "Every paid plan also includes a hard spend limit, on by default, so usage-based pricing " +
        "stays predictable and never becomes a surprise bill.",
    ]),
    heading(3, "Every plan includes"),
    bulletList(EVERY_PLAN_INCLUDES),

    heading(2, "Estimate usage before you upgrade"),
    paragraphs(
      "Estimate your usage before you upgrade, then set a spend limit so the bill can't surprise " +
        "you. The calculator recommends the right plan for where you are.",
    ),
    // Quick-start preset buttons, then the two sliders and the per-plan result
    // cards. The estimated monthly totals and the "Recommended" badge are
    // computed from the slider positions and are interactive-only, so only the
    // static labels and per-plan terms are rendered here.
    bulletList(CALCULATOR_PRESETS),
    heading(3, "Estimate your monthly usage"),
    bulletList([
      "Database operations per month — 1 query = 1 operation",
      "Storage in gigabytes",
      "Data transfer — unlimited, included free",
    ]),
    definitionList(CALCULATOR_PLAN_TERMS),
    paragraphs("Hard spend limit, on by default — never a surprise bill."),

    heading(2, "See how Prisma compares at scale"),
    paragraphs([
      "Prisma charges per operation: each query your app runs against your database counts as " +
        "one. No seats. No egress fees. And every paid plan includes a hard spend limit so there " +
        "are no surprises.",
      "At around 50K monthly active users, Prisma Pro can cost up to 5x less than a typical " +
        "Neon + Vercel setup, with one bill, included data transfer, and spend limits on by " +
        "default.",
      // The badge on the Prisma Pro column; its multiple is derived from the
      // costs in the table below.
      "Up to 5x less vs Neon + Vercel",
    ]),
    table(COMPARISON_HEADERS, COMPARISON_ROWS),

    heading(2, "Compare plans"),
    paragraphs([
      "Everything below is included with your plan, across Prisma Postgres and Prisma Compute.",
      // The table's sr-only <caption>.
      "Feature and limit comparison across the Free, Starter, Pro and Business plans.",
    ]),
    table(["Plan", ...SPEC_COLUMNS], [SPEC_PLAN_ROW]),
    ...SPEC_GROUPS.flatMap((group) => [
      heading(3, group.label),
      table(["Feature", ...SPEC_COLUMNS], group.rows),
    ]),

    // TestimonialsReveal, with the default heading /pricing renders it with.
    // The shared module de-duplicates the marquee's repeated tracks.
    renderTestimonialsMarkdown(),

    // CtaBurst, with the literal props passed by src/app/pricing/page.tsx.
    heading(2, "Start building on Prisma today"),
    paragraphs(
      "Prisma ORM is free and always will be. Spin up a Prisma Postgres database and deploy your " +
        "first app in minutes.",
    ),
    bulletList([
      "No credit card required to start",
      "Free tier with no time limit",
      "Upgrade or downgrade anytime",
    ]),
    ctaList([
      { label: "Get started free", href: SIGN_UP },
      { label: "Talk to us", href: "/contact" },
    ]),

    heading(2, "FAQs"),
    ...FAQS.flatMap((faq) => [heading(3, faq.question), paragraphs(faq.answer)]),
  ]);
}
