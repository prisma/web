import { Reveal } from "@/components/motion/reveal";
import { CostBar } from "./pricing-cost-bar";

// V2 copy verbatim, with "No connection limits" removed — Gregory confirmed
// pooled limits do exist (10/100/500/1000).
//
// Figure provenance, checked 2026-10-22. Basis for every column: ~50K MAU,
// 10M requests, 10-20M database operations, 40 GB database, database compute
// of 1-2 CU always on (Supabase Medium-Large), 1-3 developer seats.
//  - Supabase Pro $95-145 and Prisma Pro $72-90 come from the 2026-07-30
//    "Recommended website comparison" (fair 50K MAU model).
//  - Rechecked 2026-11-22 against neon.com, supabase.com and vercel.com
//    pricing: every rate above unchanged. Supabase reproduces exactly: $25
//    Pro + $60-110 Medium-Large compute - $10 credit + $4 disk (32 GB over at
//    $0.125) + $16 Edge Function invocations (8M over at $2/M) = $95-145.
//    Prisma Pro reproduces with this page's own calculator (calc.ts, "API or
//    web app" profile, 10M requests, 10-20M operations, 40 GB): $49 plan +
//    $0-20 operations + ~$22 Compute (833 GB-hours, 167 vCPU-hours, 250 GB
//    out) = $71-91. The card keeps $72-90, which pricing-scale.tsx on the
//    home page also uses.
//  - Neon + Vercel $110-270, recomputed from list prices on the same basis.
//    Neon Launch (neon.com/pricing): 730-1,460 CU-hours at $0.106 plus 40 GB
//    at $0.35 per GB-month = $91-169; database egress stays inside the 500 GB
//    per project included. Vercel Pro (vercel.com/pricing, docs/pricing,
//    docs/pricing/flat-rate-cdn): $20 seat with a $20 usage credit, $0-40 for
//    extra seats, $0-20 for 10M CDN requests, and function usage of $17-39
//    before the credit = $20-99. Function usage: 10M invocations at $0.60 per
//    million ($6), 50-150 active CPU-hours at $0.128 ($6-19) and 400-1,300
//    provisioned-memory GB-hours at $0.0106 ($4-14). CDN is a range because
//    Vercel's sources differ: docs/pricing/flat-rate-cdn says Pro includes the
//    lowest Flat Rate tier (1M requests, 1 TB) and 10M requests is the $20
//    tier (on demand, $2 per 1M above the included 1M, about $18), while
//    one rendering of vercel.com/pricing has shown 10M CDN requests and 1 TB
//    transfer as included on Pro, which would make it $0. Total $111-268.
//  - Ratio at the midpoints: $190 / $81, about 2.3x, so the marker below
//    renders "Up to 2x less", and $81 is about 43% of $190 ("less than half
//    as much"). The earlier $385-450 could only be reproduced
//    by pricing Neon Scale (SLAs, HIPAA) against Prisma Pro, which is not a
//    like-for-like plan, so it was replaced.
// Re-check these figures whenever any of the four pricing pages change.

// /pricing compares Netlify, Supabase and Railway (client, 2026-11-24:
// "use Netlify instead of Vercel", "also add Railway"). The Neon + Vercel
// column above stays in ALTERNATIVES for /lp/providers and the home page,
// whose copy names Vercel; /pricing renders PRICING_ALTERNATIVES below.
//
// Provenance, checked 2026-11-24 against netlify.com/pricing, the Netlify
// billing docs (credit-based plans, how credits work, auto recharge) and
// railway.com/pricing, docs.railway.com (plans, cost control, workspaces).
// Same basis as above, plus about 250 GB of data out: the bandwidth this
// page's own calculator gives Prisma for 10M requests (calc.ts, "API or web
// app"), so every column now prices the same transfer.
//  - Netlify Pro $130-240, app and database on Netlify (client, 2026-11-24:
//    "they have their own db now"). Netlify Database is billed in Netlify
//    credits on credit-based plans (docs.netlify.com/build/data-and-storage/
//    netlify-database/billing-and-usage): 10 credits per database compute
//    unit, 20 credits per GB of data out of the database, storage free for
//    now (40 GB is inside Pro's 100 GB per database). Netlify Pro: $20 a month
//    with 3,000 credits and unlimited members (no seat fees). Usage in
//    credits: web requests 10M at 2 per 10,000 = 2,000; function compute
//    400-1,300 GB-hours (the same range as Vercel's provisioned memory above)
//    at 10 per GB-hour = 4,000-13,000; bandwidth 250 GB at 20 per GB = 5,000;
//    database compute 1-2 units always on, 730-1,460 unit-hours at 10 =
//    7,300-14,600; database data out 20-40 GB (about 2 KB per operation) at
//    20 per GB = 400-800. Total 18,700-35,400, less 3,000 included =
//    15,700-32,400 extra, bought in Pro packs of 1,500 credits for $10 (auto
//    recharge): 11-22 packs = $110-220. Netlify $130-240. Production deploys
//    (15 credits each) are left out, so this is the low side. The larger Pro
//    credit tiers would be cheaper per credit, but Netlify doesn't publish
//    their prices, so the packs are what can be checked.
//  - Railway Pro $70-125. $20 a month per workspace, which counts towards
//    usage; unlimited seats; billed per second on the CPU, memory and disk
//    actually used ($20 per vCPU-month, $10 per GB-month of memory, $0.15 per
//    GB-month of volume, $0.05 per GB egress). App: 0.5-1 GB resident memory
//    all month $5-10, 100-200 vCPU-hours $3-5. Postgres on Railway, sized like
//    the 1-2 Neon CU above (4-8 GB memory, 0.25-0.5 vCPU on average): $40-80
//    memory, $5-10 CPU. Volume 40 GB $6. Egress 250 GB $12.50 (app-to-database
//    traffic stays on the private network). Usage $71-124, above the $20 fee,
//    so the bill is the usage: $70-125.
//  - Prisma Pro $72-90 already includes ~250 GB out (see above).
//  - Midpoints: Netlify $185, Supabase $120, Railway $97.50, Prisma $81.
//    Prisma is about 44% of Netlify, so "less than half as much" holds; Railway is close to Prisma, and the page says so plainly.
// Re-check whenever any of these pricing pages change.

// What the costs assume, shown under the columns. Keep in step with the
// provenance notes above; update the date whenever the figures are rechecked.
export const COMPARISON_BASIS =
  "Estimated at list prices for about 50K monthly active users: 10M requests, 10–20M database " +
  "operations, a 40 GB database, about 250 GB of data out and 1–3 developer seats. Prices " +
  "checked 24 November 2026.";

// Placeholder marker. Anything using PENDING is awaiting figures from the
// client — never fill these in with estimates.
//
// This is the dashed "TBC" badge, NOT an em dash. The spec table lower down
// this same page tells the reader in print that an em dash means "not included
// on that plan", so using one here made the Supabase column read as a claim
// that Supabase has no billing model and no spend limits. It means we have not
// been given their figures. See pricing-spec-table.tsx, which draws the same
// distinction.
const PENDING = "TBC";

export const ALTERNATIVES = [
  {
    id: "neon-vercel",
    name: "Typical stack (Neon + Vercel)",
    shortName: "Neon + Vercel",
    compareHref: "/compare/vercel-neon-drizzle",
    cost: "$110–270",
    pending: false,
    // Billing and data transfer checked 2026-10-22: Neon added from the Vercel
    // Marketplace is billed through the Vercel account
    // (vercel.com/docs/marketplace-storage, "Unified billing";
    // vercel.com/marketplace/neon, "Billing is managed through Vercel."), while
    // the Neon-Managed Integration is "Paid through Neon"
    // (neon.com/docs/guides/vercel-overview). Neon Launch and Scale
    // include 500 GB of public network transfer per project, then $0.10/GB
    // (neon.com/pricing).
    rows: [
      {
        label: "Billing",
        value: "Billed through Vercel via the Marketplace, or as separate Neon and Vercel bills",
      },
      {
        label: "Database data transfer",
        value: "500 GB egress per project included, then $0.10 per GB",
      },
      {
        label: "Spend limits",
        value:
          "Neon: spending notifications at 80% and 100%. Vercel: a spend budget with an optional pause",
      },
    ],
  },
  {
    // Shane (2026-07-29) asked to compare against Supabase as well. Figures
    // supplied by the client 2026-07-30 ("Recommended website comparison",
    // Supabase vs Prisma fair 50K MAU model) and used verbatim — basis is
    // ~50K MAU, 10M requests, 40 GB database, Medium–Large database compute.
    id: "supabase",
    name: "Supabase Pro",
    shortName: "Supabase",
    compareHref: "/compare/supabase",
    cost: "$95–145",
    pending: false,
    rows: [
      {
        label: "Billing",
        value: "Platform subscription + Postgres compute + function usage",
      },
      {
        label: "Database data transfer",
        value: "250 GB egress included, then $0.09 per GB",
      },
      // The "database compute excluded" caveat is the client's own wording and
      // is the point of the row — a spend cap that doesn't cover compute is not
      // the same promise as Prisma's. Don't trim it.
      {
        label: "Spend limits",
        value: "Spend cap on by default for covered usage; database compute excluded",
      },
    ],
  },
];

// The columns /pricing shows (see the provenance note above COMPARISON_BASIS).
export const PRICING_ALTERNATIVES = [
  {
    id: "netlify",
    name: "Netlify Pro",
    shortName: "Netlify",
    compareHref: "/blog/prisma-vs-netlify",
    cost: "$130–240",
    pending: false,
    // Netlify docs: Pro is credit-based; "all of your web projects
    // (sites/apps) are paused" when credits run out, unless auto recharge
    // (off by default) buys more. Netlify Database is paid in the same
    // credits; 20 credits per GB out is $0.13 at the $10 per 1,500 pack.
    rows: [
      {
        label: "Billing",
        value: "One Netlify bill; app and database usage both paid in credits",
      },
      {
        label: "Database data transfer",
        value: "20 credits per GB out of the database (about $0.13 per GB)",
      },
      {
        label: "Spend limits",
        value: "Sites pause when credits run out, unless auto recharge is on",
      },
    ],
  },
  ALTERNATIVES[1],
  {
    id: "railway",
    name: "Railway Pro",
    shortName: "Railway",
    compareHref: "/blog/app-hosting-platforms-with-managed-postgres-2026",
    cost: "$70–125",
    pending: false,
    // Railway docs: billed per second "for the CPU, memory, and disk your
    // services actually use"; private networking keeps traffic "within
    // Railway's private network"; a hard usage limit takes "all your
    // workloads ... offline", with email reminders at 75%, 90% and 100%.
    rows: [
      {
        label: "Billing",
        value: "One bill for app and database, on the CPU, memory and disk used",
      },
      {
        label: "Database data transfer",
        value: "Egress $0.05 per GB; app-to-database traffic stays on the private network",
      },
      {
        label: "Spend limits",
        value: "Email alerts and a hard usage limit you set; services go offline when it's hit",
      },
    ],
  },
];

// Prisma's own column keeps the approved V2 marketing copy for the three rows.
// The client's comparison doc phrases them analytically ("Postgres operations
// and storage + application Compute usage", "Unlimited database data transfer",
// "Spend limits included on paid plans") — same substance, so V2 wins on voice.
// Exception: V2's "On by default" for spend limits was wrong. A paid workspace
// has no limit until someone sets one in the Console (docs: /console/more/billing),
// so the row says the cap is one you set (2026-10-29).
//
// The cost is the 2026-07-30 doc's $72–90 (V2 had $70–90). The home page
// scenario card (pricing-scale.tsx) uses the same figure.
export const PRISMA = {
  name: "Prisma Pro",
  cost: "$72–90",
  rows: [
    { label: "Billing", value: "One bill, one platform" },
    { label: "Database data transfer", value: "Included" },
    { label: "Spend limits", value: "Hard cap you set, on every paid plan" },
  ],
};

// Bar length and the savings multiple are both derived from the cost strings
// above, so the figures stay a single source of truth: correct a cost string
// and the bar and the multiple follow it. Nothing here introduces a number that
// isn't already in the copy.
//
// Returns null when a column has no figure yet (the Supabase placeholder) —
// null is "unknown", which the bar draws as a dashed empty track, not as zero.
function costMidpoint(cost: string): number | null {
  const nums = cost.match(/\d[\d,]*/g)?.map((n) => Number(n.replace(/,/g, "")));
  if (!nums?.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const COSTS = [...ALTERNATIVES.map((a) => a.cost), PRISMA.cost];
const MAX_COST = Math.max(...COSTS.map((c) => costMidpoint(c) ?? 0));

// The bars on /pricing scale to its own widest column (Netlify).
const PAGE_MAX_COST = Math.max(
  ...[...PRICING_ALTERNATIVES.map((a) => a.cost), PRISMA.cost].map((c) => costMidpoint(c) ?? 0),
);

function costFraction(cost: string): number | null {
  const mid = costMidpoint(cost);
  return mid === null || !PAGE_MAX_COST ? null : mid / PAGE_MAX_COST;
}

// The headline multiple, rounded from the figures rather than hardcoded, so it
// can never drift from the bars. With the figures above it renders "Up to 2x
// less"; the sentence above the columns says "less than half as much", so if
// this ever renders something else, re-check that sentence too.
//
// It names its basis. Unqualified, the marker sits on the Prisma card right
// next to a Supabase column that is only ~1.5x more expensive, so it would read
// as a claim about Supabase. The multiple only ever describes the widest
// column, so it says which one that is.
const PRISMA_MID = costMidpoint(PRISMA.cost);
export const SAVINGS_MULTIPLE = PRISMA_MID && MAX_COST ? Math.round(MAX_COST / PRISMA_MID) : null;
export const WIDEST = ALTERNATIVES.reduce((a, b) =>
  (costMidpoint(b.cost) ?? 0) > (costMidpoint(a.cost) ?? 0) ? b : a,
);

// Same dashed badge the spec table uses, so "we don't have this yet" looks
// identical in both places on the page.
function PendingBadge() {
  return (
    <span
      title="Awaiting figures from Prisma"
      className="inline-flex rounded border border-dashed border-black/20 px-1.5 py-0.5 text-xs font-medium text-muted-foreground/70"
    >
      {PENDING}
    </span>
  );
}

// "See how Prisma compares at scale", quietened (client, 2026-11-24: "this is
// too much, let's quieten this section by a whole bunch"). No panel, wash,
// beams, glass prism, grain, cards, counting numbers, ticks or spectrum bar:
// three plain columns on hairlines, like the Compare plans table, with the
// heading on the page's left edge like the other sections. Each column is
// marked by its logo; Prisma's cost bar is the one in colour.
// Each column's logo(s), in place of the kicker's dot (client, 2026-11-24).
// The marks only, not wordmarks: the column names already say who they are.
const LOGOS: Record<string, string[]> = {
  netlify: ["/icons/companies/netlify-logo.svg"],
  railway: ["/logos/railway.svg"],
  supabase: ["/icons/companies/supabase.svg"],
  prisma: ["/logos/prisma-logo-mark.svg"],
};

export function PricingComparison() {
  const columns = [
    ...PRICING_ALTERNATIVES,
    { ...PRISMA, id: "prisma", pending: false, compareHref: null },
  ];
  return (
    <section id="compare" className="scroll-mt-24 bg-white px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className="max-w-[24ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            See how Prisma compares at scale
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            At around 50K monthly active users, Prisma Pro can cost less than half as much as
            Netlify Pro, with database data transfer included and a hard spend limit you set.
          </p>
        </Reveal>

        {/* One shared grid of eight rows (name, price, basis, bar, three
            facts, link); each column takes all eight as a subgrid, so every
            row starts at the same height in all three columns however its
            text wraps (client, 2026-11-24: "now let's fix this"). */}
        <div className="mt-10 grid border-t border-black/[0.08] md:grid-cols-2 md:gap-x-8 xl:grid-cols-4 xl:grid-rows-[repeat(8,auto)] xl:gap-x-0 xl:divide-x xl:divide-black/[0.06]">
          {columns.map((col, i) => {
            const prisma = col.id === "prisma";
            return (
              <div
                key={col.id}
                className="flex flex-col border-b border-black/[0.06] py-8 xl:row-span-8 xl:grid xl:grid-rows-subgrid xl:border-b-0 xl:px-6 xl:first:pl-0 xl:last:pr-0"
              >
                <p className="flex items-center gap-2.5 text-sm font-semibold text-foreground/80">
                  <span className="flex items-center gap-1.5">
                    {/* Decorative beside the name, so alt is empty. */}
                    {(LOGOS[col.id] ?? []).map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="" className="size-[18px]" />
                    ))}
                  </span>
                  {col.name}
                </p>
                {col.pending ? (
                  <p className="mt-4 flex h-9 items-center">
                    <PendingBadge />
                  </p>
                ) : (
                  <p className="mt-4 font-heading text-3xl font-medium tracking-tight text-foreground">
                    {col.cost}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {col.pending ? "Awaiting figures" : "at ~50K MAU"}
                </p>
                {/* Prisma's bar in the brand gradient, the others grey: the
                    one highlight, on the figure that makes the case (client
                    picked from five options, 2026-11-24). */}
                <CostBar
                  className="mt-4 self-center"
                  fraction={costFraction(col.cost)}
                  spectrum={prisma}
                  delay={0.1 + i * 0.05}
                />

                {/* `contents`, so each fact is its own row of the shared grid. */}
                <dl className="contents">
                  {col.rows.map((r, k) => (
                    <div key={r.label} className={k === 0 ? "mt-6" : "mt-4"}>
                      <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                      <dd className="mt-1 text-pretty text-sm leading-relaxed text-foreground">
                        {col.pending ? <PendingBadge /> : r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {/* Every column ends on a link, so the three end level:
                    the others link to their full comparison, Prisma to the
                    calculator (was "Try your own numbers" in the small print). */}
                <a
                  href={col.compareHref ?? "/pricing/calculator"}
                  className="mt-auto self-start justify-self-start rounded-sm pt-6 text-sm text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {col.compareHref ? "Full comparison →" : "Estimate your bill →"}
                </a>
              </div>
            );
          })}
        </div>

        {/* The estimate's basis, with the date it was checked and a way to
            run your own numbers in the calculator above. */}
        <p className="mt-6 max-w-3xl text-pretty text-xs leading-relaxed text-muted-foreground">
          {COMPARISON_BASIS}
        </p>
      </div>
    </section>
  );
}
