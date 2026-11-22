import { bulletList, ctaList, heading, joinBlocks, link, paragraphs, table } from "./blocks";
import {
  APP_PROFILES,
  COMPUTE_RATES,
  FREE_COMPUTE_LIMITS,
  fmtGB,
  fmtOps,
  PLANS as CALCULATOR_PLANS,
  PRESETS as CALCULATOR_PRESET_LIST,
} from "@/components/sections/calculator-options/calc";
import { PRICING_COMPARE_INTRO } from "@/components/sections/compare-links-data";
import { COMPARISON_BASIS } from "@/components/sections/pricing-comparison";
import {
  NEVER_BILLED,
  PRICING_FLOW_LEDE,
  COST_CONTROLS,
  COST_CONTROLS_HEADING,
} from "@/components/sections/pricing-ledger";
import { renderCompareLinksMarkdown } from "./compare-links";
import { renderTestimonialsMarkdown } from "./testimonials";

/**
 * Markdown rendition of /pricing.
 *
 * Source of truth is the section components rendered by src/app/pricing/page.tsx —
 * pricing-hero, pricing-plans, pricing-cost-controls (+ pricing-ledger.ts),
 * pricing-calculator (+ calculator-options/calc.ts), pricing-comparison,
 * pricing-spec-table, testimonials-reveal, cta-burst and pricing-faq.
 *
 * NOTE: src/lib/pricing-data.ts looks canonical but the pricing page does not
 * import it — it is a separate copy consumed only by src/app/llms-content.ts.
 * Every figure below is transcribed from the section files above, so if the two
 * copies ever disagree the section files win here.
 */

const SIGN_UP = "https://console.prisma.io/sign-up";

export const PRICING_H1 = "Usage-based pricing with cost controls";

// The hero has no subhead paragraph of its own: it was removed on 2026-07-30
// so the plan cards clear the fold. The Markdown page still opens with a
// one-paragraph summary of what's metered (PRICING_FLOW_LEDE in
// pricing-ledger.ts); on the page itself the hero title and the rates panel
// under the plan cards say it.
export const PRICING_SUBHEADLINE = PRICING_FLOW_LEDE;

/** Mirrors PLANS in components/sections/pricing-plans.tsx. `blurb` lives on that
 *  data but is deliberately never rendered, so it is not repeated here. */
const PLANS = [
  {
    name: "Free",
    price: "$0 / month",
    note:
      "Free forever. No credit card required. Or skip sign-up: `npx create-db@latest` creates a " +
      "Postgres database in seconds that lasts 24 hours; claim it to keep it " +
      "(https://www.prisma.io/docs/postgres/npx-create-db).",
    compute: [
      "1M requests / month",
      "360 GB-hours provisioned memory / month",
      "4 active vCPU-hours / month",
      "10 GB outbound bandwidth / month",
    ],
    postgres: ["200k operations / month", "2 GB storage", "50 databases"],
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
      "$0.064 per active vCPU-hour",
      "$0.025 per GB outbound bandwidth",
    ],
    postgres: [
      "1M operations / month, then $8 per million",
      "10 GB storage, then $2.00 per GB",
      "1,000 databases",
      "7-day daily backups",
    ],
    platform: ["Spend limits"],
    cta: "Start on Starter",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49 / month",
    note: null,
    compute: [
      "20M requests / month, then $1 per million",
      "$0.006 per GB-hour memory",
      "$0.064 per active vCPU-hour",
      "$0.025 per GB outbound bandwidth",
    ],
    postgres: [
      "10M operations / month, then $2 per million",
      "50 GB storage, then $1.50 per GB",
      "1,000 databases",
      "7-day daily backups",
    ],
    platform: ["Spend limits", "GDPR"],
    cta: "Start on Pro",
    popular: false,
  },
  {
    name: "Business",
    price: "$129 / month",
    note: null,
    compute: [
      "100M requests / month, then $1 per million",
      "$0.006 per GB-hour memory",
      "$0.064 per active vCPU-hour",
      "$0.025 per GB outbound bandwidth",
    ],
    postgres: [
      "50M operations / month, then $1 per million",
      "100 GB storage, then $1.00 per GB",
      "1,000 databases",
      "30-day backup retention",
    ],
    platform: ["Spend limits", "GDPR, [HIPAA with a BAA](/postgres/hipaa), SOC 2, ISO 27001"],
    cta: "Start on Business",
    popular: false,
  },
];

// The four cards are one comparison in the HTML (a single grid, one row of
// features per product group), so they render as a table. An empty Platform
// group is an em dash, meaning "nothing extra on this plan". (The spec table
// below spells its cells out in words instead: "No usage billing" and "Not
// available".)
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

// PRESETS in components/sections/calculator-options/calc.ts, with the usage
// readout each button shows (fmtOps · fmtGB), under the "Example usage, not plan
// limits" line above the preset row. The V2 `blurb` on each preset is not
// rendered by the compact preset row, so it is not included.
const CALCULATOR_PRESETS = CALCULATOR_PRESET_LIST.map(
  (p) =>
    `${p.label} — ${fmtOps(p.requests)} requests · ${fmtOps(p.ops)} operations · ${fmtGB(p.gb)}`,
);

// The calculator's live bill (pricing-bill.tsx): the lines it itemizes. Rates
// come from calc.ts so this copy can't drift; the quantities and totals depend
// on the inputs and are interactive-only, so they are omitted.
const CALCULATOR_BILL_LINES = [
  "Plan — the plan's monthly price",
  `Compute requests — included up to the plan's allowance (${CALCULATOR_PLANS.map((p) => `${p.requestsIncluded / 1_000_000}M on ${p.name}`).join(", ")}), then $${COMPUTE_RATES.requestsPerMillion} per million`,
  `Compute memory — $${COMPUTE_RATES.memoryPerGBHour} per GB-hour, held while your app runs, including time spent waiting`,
  `Compute CPU — $${COMPUTE_RATES.cpuPerVcpuHour} per vCPU-hour, only while your code is computing`,
  `Compute bandwidth — $${COMPUTE_RATES.bandwidthPerGB} per GB sent out to the internet`,
  "Postgres operations and storage — included up to the plan's allowance, then the plan's overage rate (see the plan table above)",
  "Postgres data transfer — unlimited, included",
];
const COMPUTE_APP_TYPES = APP_PROFILES.filter((p) => p.id !== "none").map(
  (p) => `${p.label} — each request ${p.perRequest} (from the ${p.source} example)`,
);

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
  ["Monthly cost at ~50K MAU", "$110–270", "$95–145", "$72–90"],
  [
    "Billing",
    "Billed through Vercel via the Marketplace, or as separate Neon and Vercel bills",
    "Platform subscription + Postgres compute + function usage",
    "One bill, one platform",
  ],
  [
    "Database data transfer",
    "500 GB egress per project included, then $0.10 per GB",
    "250 GB egress included, then $0.09 per GB",
    "Included",
  ],
  [
    "Spend limits",
    "Neon: spending notifications at 80% and 100%. Vercel: a spend budget with an optional pause",
    "Spend cap on by default for covered usage; database compute excluded",
    "Hard cap you set, on every paid plan",
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

// `note` mirrors the optional link in the HTML table's group header.
const SPEC_GROUPS: {
  label: string;
  rows: [string, string, string, string, string][];
  note?: { label: string; href: string };
}[] = [
  {
    label: "Prisma Postgres",
    rows: [
      ["Operations included", "200k", "1M", "10M", "50M"],
      [
        "Operation overage",
        "No usage billing",
        "$8 per million",
        "$2 per million",
        "$1 per million",
      ],
      ["Storage included", "2 GB", "10 GB", "50 GB", "100 GB"],
      ["Storage overage", "No usage billing", "$2.00 per GB", "$1.50 per GB", "$1.00 per GB"],
      ["Databases", "50", "1,000", "1,000", "1,000"],
      ["Data transfer", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Spend limits", "Fixed at $0, no card required", INCLUDED, INCLUDED, INCLUDED],
    ],
  },
  {
    label: "Prisma Compute",
    rows: [
      ["Requests included", "1M", "5M", "20M", "100M"],
      ["Request price", "No usage billing", "$1 per million", "$1 per million", "$1 per million"],
      [
        "Provisioned memory",
        "360 GB-hours / month",
        "$0.006 per GB-hour",
        "$0.006 per GB-hour",
        "$0.006 per GB-hour",
      ],
      [
        "Active CPU",
        "4 vCPU-hours / month",
        "$0.064 per vCPU-hour",
        "$0.064 per vCPU-hour",
        "$0.064 per vCPU-hour",
      ],
      ["Outbound bandwidth", "10 GB / month", "$0.025 per GB", "$0.025 per GB", "$0.025 per GB"],
      ["Scale to zero when idle", INCLUDED, INCLUDED, INCLUDED, INCLUDED],
    ],
  },
  {
    label: "Managed connection pool",
    rows: [
      ["Connection limit (pooled)", "10", "100", "500", "1,000"],
      ["Connection limit (direct)", "10", "10", "50", "100"],
      ["Connection idle timeout", "60 minutes", "60 minutes", "60 minutes", "60 minutes"],
      ["Pool mode", "Transaction", "Transaction", "Transaction", "Transaction"],
      ["Operation response size", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      [
        "Operation duration (db queries)",
        "10 min pooled, unlimited direct",
        "10 min pooled, unlimited direct",
        "10 min pooled, unlimited direct",
        "10 min pooled, unlimited direct",
      ],
      ["Operation duration (interactive)", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
    ],
  },
  {
    label: "Accelerate cache (retires December 1, 2026)",
    note: { label: "How to switch", href: "/docs/postgres/database/switch-from-accelerate" },
    rows: [
      ["Operations included", "60,000", "60,000", "60,000", "60,000"],
      [
        "Operation overage",
        "No usage billing",
        "$0.018 per 1,000",
        "$0.008 per 1,000",
        "$0.006 per 1,000",
      ],
      [
        "Egress included",
        "1 KiB per query",
        "1 KiB per query",
        "1 KiB per query",
        "2 KiB per query",
      ],
      ["Egress overage", "No usage billing", "$0.09 per GiB", "$0.09 per GiB", "$0.08 per GiB"],
      [
        "Cache tag invalidations",
        "Not available",
        "Not available",
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
        "Not available",
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
      ["Compliance", "GDPR", "GDPR", "GDPR", "GDPR, [HIPAA](/postgres/hipaa), SOC 2, ISO 27001"],
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
      "one operation.",
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

    // PricingCostControls: three cards right under the plan cards, under an
    // sr-only H2. The "Free on every plan" card's tiles is decorative on the page;
    // here it is the list, with the one-line reason for each item.
    heading(2, COST_CONTROLS_HEADING),
    ...COST_CONTROLS.flatMap((card, i) => [
      heading(3, card.title),
      paragraphs(card.body),
      i === 2 ? bulletList(NEVER_BILLED.map((item) => `${item.label}: ${item.detail}`)) : undefined,
      ctaList([{ label: card.link.label, href: card.link.href }]),
    ]),

    heading(2, "Estimate usage before you upgrade"),
    paragraphs(
      "Tell us what you're building and roughly how big it is, then fine-tune the numbers. " +
        "You'll see the monthly bill on the cheapest plan that covers it, and you can set a spend " +
        "limit on any paid plan.",
    ),
    // The calculator is four hinted steps: what you're building, how big it
    // is, the usage sliders, then the bill. Quantities and totals depend on
    // the inputs and are interactive-only, so only structure and rates render.
    heading(3, "1. What are you building?"),
    bulletList(APP_PROFILES.map((p) => p.label)),
    heading(3, "2. How big is it?"),
    bulletList(CALCULATOR_PRESETS),
    heading(3, "3. Adjust your usage"),
    paragraphs(
      "Rough numbers are fine. Ticks on each slider mark where the recommended plan changes.",
    ),
    bulletList([
      "Requests per month (not used for Database only)",
      "Database operations per month (1 query = 1 operation)",
      "Database storage in gigabytes",
    ]),
    heading(3, "4. Your estimated bill"),
    paragraphs(
      'The bill opens on the recommended plan, the cheapest one your usage fits, with its monthly total and a three-line breakdown: the plan price, Compute, and Postgres. Each line opens to its meters, showing the usage, the rate, and the charge. Every plan\'s total is shown above the bill, and picking one shows its breakdown instead; a plan your usage is over shows "Over limits". The estimate is kept in the page address, so a copied link reopens it. The lines cover:',
    ),
    bulletList(CALCULATOR_BILL_LINES),
    paragraphs([
      `On Free there is no usage billing: each line shows usage against Free's limit (${FREE_COMPUTE_LIMITS.memoryGBHours} GB-hours of memory, ${FREE_COMPUTE_LIMITS.cpuHours} vCPU-hours, ${FREE_COMPUTE_LIMITS.bandwidthGB} GB of bandwidth, and 1M requests for Compute), and Free is not available once any limit is exceeded.`,
      "The calculator turns requests into memory, CPU, and bandwidth using a typical shape for each app type, taken from the worked examples in the Compute pricing docs (https://www.prisma.io/docs/compute/pricing). Your app's real numbers will differ.",
    ]),
    bulletList(COMPUTE_APP_TYPES),
    paragraphs(
      "Set a hard spend limit on any paid plan in the Console. It caps usage charges, not the plan fee, and database queries stop when it's reached.",
    ),

    heading(2, "See how Prisma compares at scale"),
    paragraphs([
      "At around 50K monthly active users, Prisma Pro can cost less than half as much as a typical " +
        "Neon + Vercel setup, with one bill, included database data transfer, and a hard spend limit " +
        "you set.",
    ]),
    table(COMPARISON_HEADERS, COMPARISON_ROWS),
    paragraphs(COMPARISON_BASIS),

    heading(2, "Compare plans"),
    paragraphs([
      "Everything below is included with your plan, across Prisma Postgres and Prisma Compute.",
      // The table's sr-only <caption>.
      "Feature and limit comparison across the Free, Starter, Pro and Business plans.",
    ]),
    table(["Plan", ...SPEC_COLUMNS], [SPEC_PLAN_ROW]),
    ...SPEC_GROUPS.flatMap((group) => [
      heading(3, group.label),
      group.note ? paragraphs(link(group.note)) : undefined,
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
      "[Free tier with no time limit](/postgres/free-postgresql-hosting)",
      "Upgrade or downgrade anytime",
    ]),
    ctaList([
      { label: "Get started free", href: SIGN_UP },
      { label: "Talk to us", href: "/contact" },
    ]),

    heading(2, "FAQs"),
    ...FAQS.flatMap((faq) => [heading(3, faq.question), paragraphs(faq.answer)]),

    // sections/compare-links.tsx, the page's closing section.
    renderCompareLinksMarkdown(PRICING_COMPARE_INTRO),
  ]);
}
