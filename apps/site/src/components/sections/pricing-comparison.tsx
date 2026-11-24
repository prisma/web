import { RoleKicker } from "@/components/brand/role-kicker";
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

// What the three costs assume, shown under the cards. Keep in step with the
// provenance note above; update the date whenever the figures are rechecked.
export const COMPARISON_BASIS =
  "Estimated at list prices for about 50K monthly active users: 10M requests, 10–20M database " +
  "operations, a 40 GB database and 1–3 developer seats. Prices checked 22 November 2026.";

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

function costFraction(cost: string): number | null {
  const mid = costMidpoint(cost);
  return mid === null || !MAX_COST ? null : mid / MAX_COST;
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
// heading on the page's left edge like the other sections. Prisma is marked
// by its cyan dot only; the figures make the case.
export function PricingComparison() {
  const columns = [...ALTERNATIVES, { ...PRISMA, id: "prisma", pending: false, compareHref: null }];
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
            At around 50K monthly active users, Prisma Pro can cost less than half as much as a
            typical Neon + Vercel setup, with one bill, included database data transfer, and a hard
            spend limit you set.
          </p>
        </Reveal>

        {/* One shared grid of eight rows (name, price, basis, bar, three
            facts, link); each column takes all eight as a subgrid, so every
            row starts at the same height in all three columns however its
            text wraps (client, 2026-11-24: "now let's fix this"). */}
        <div className="mt-10 grid border-t border-black/[0.08] lg:grid-cols-3 lg:grid-rows-[repeat(8,auto)] lg:divide-x lg:divide-black/[0.06]">
          {columns.map((col, i) => {
            const prisma = col.id === "prisma";
            return (
              <div
                key={col.id}
                className="flex flex-col border-b border-black/[0.06] py-8 last:border-b-0 lg:row-span-8 lg:grid lg:grid-rows-subgrid lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <RoleKicker color={prisma ? "bg-prism-cyan-400" : "bg-foreground/20"}>
                  {col.name}
                </RoleKicker>
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
