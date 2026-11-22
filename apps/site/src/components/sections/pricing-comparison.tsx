import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CheckBold } from "@/components/icons/forma";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { CostBar } from "./pricing-cost-bar";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

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

// "See how Prisma compares at scale" — wrapped prismatic panel (hero idiom:
// beam fan and a turning glass prism cropped by the bottom edge).
//
// The comparison itself follows the site's established before/after language
// from comparison.tsx: the alternative sits plain and muted with X marks, the
// Prisma side is lifted on white with the always-on spectrum ring, the brand
// cube pattern greyscaled behind it, and CheckBold in prism cyan. The monthly
// cost leads each side at display size — the figure is the argument, so it
// gets the emphasis rather than sitting in a table cell.
export function PricingComparison() {
  return (
    <section id="compare" className="scroll-mt-24 bg-white px-3 py-16 sm:px-4 sm:py-24">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash plus the three brand beams */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 30%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 24%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 26%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-24rem] left-[12%] h-[60rem] w-40 origin-bottom rotate-[-26deg] bg-prism-cyan-300/45 blur-[80px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[4deg] bg-prism-yellow-200/50 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[12%] h-[60rem] w-40 origin-bottom rotate-[26deg] bg-prism-red-300/45 blur-[80px]" />
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>

        {/* glass prism turning at the bottom edge, light concentrating behind it */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-[16rem] w-[24rem] rounded-full opacity-25 blur-[70px]"
          style={{ backgroundImage: SPECTRUM }}
        />
        <GlassPrismSpin
          shape="pentagon"
          period={24}
          initialAngle={0.7}
          className="bottom-[-4.5rem] right-[-3.5rem] w-[14rem] max-md:bottom-[-3rem] max-md:right-[-2rem] max-md:w-[9rem]"
        />
        <Texture />

        <div className="relative px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-24">
          <div className="mx-auto max-w-site">
            <Reveal>
              <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                See how Prisma compares at scale
              </h2>
            </Reveal>
            {/* One paragraph: the comparison claim. The former first
                paragraph ("Prisma charges per operation… no surprises")
                predated Compute and repeated the hero and "Free with every
                plan" (client review, 2026-11-22). */}
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-3xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
                At around 50K monthly active users, Prisma Pro can cost less than half as much as a
                typical Neon + Vercel setup, with one bill, included database data transfer, and a
                hard spend limit you set.
              </p>
            </Reveal>

            {/* Columns stretch to a shared height so the three read as one
                comparison rather than three stacks of different length. */}
            <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
              {/* The alternatives. Recessed translucent glass rather than bare
                  text: it gives the three columns one shared rhythm so they
                  read as a comparison, and stays transparent enough for the
                  spectral wash to carry through from the panel behind. */}
              {ALTERNATIVES.map((alt, i) => (
                <Reveal
                  key={alt.id}
                  delay={0.2 + i * 0.05}
                  className={cn(
                    "flex flex-col rounded-[1.25rem] border p-6 backdrop-blur-[2px]",
                    alt.pending
                      ? "border-dashed border-black/15 bg-white/25"
                      : "border-black/[0.08] bg-white",
                  )}
                >
                  <RoleKicker color="bg-foreground/20">{alt.name}</RoleKicker>
                  {/* A pending column shows the badge at label size, not the
                      price at display size — a 2.75rem "TBC" reads as a broken
                      column rather than a reserved one. */}
                  {alt.pending ? (
                    <p className="mt-5 flex h-[clamp(2rem,3.4vw,2.75rem)] items-center">
                      <PendingBadge />
                    </p>
                  ) : (
                    <p className="mt-5 font-heading text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-tight text-foreground">
                      <CountUp value={alt.cost} />
                      <span className="ml-1.5 align-baseline text-base font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {alt.pending ? "Awaiting figures" : "at ~50K MAU"}
                  </p>

                  <CostBar
                    className="mt-5"
                    fraction={costFraction(alt.cost)}
                    delay={0.3 + i * 0.05}
                  />

                  <dl className="mt-7 flex flex-col gap-5 border-t border-black/[0.06] pt-6">
                    {alt.rows.map((r) => (
                      <div key={r.label}>
                        <dt className="text-sm font-semibold text-foreground/70">{r.label}</dt>
                        <dd className="mt-1.5 flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-foreground">
                          {alt.pending ? (
                            <PendingBadge />
                          ) : (
                            <>
                              {/* A neutral dot, not an ✗: these rows
                                  describe what the other stack does, and
                                  mostly it does have the thing (spend
                                  notifications, a spend cap). The site
                                  states competitors' strengths plainly. */}
                              <span
                                aria-hidden
                                className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-foreground/30"
                              />
                              {r.value}
                            </>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {/* The fuller picture, including what this stack does well. */}
                  <a
                    href={alt.compareHref}
                    className="mt-auto self-start rounded-sm pt-6 text-sm font-medium text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    Full comparison →
                  </a>
                </Reveal>
              ))}

              {/* Prisma — the same white card as the others (client review,
                  2026-11-22: "the self promotion can be slightly more subtle").
                  The always-on spectrum ring, the glow underneath, the cube
                  pattern, the savings badge and the bold rows are gone; what
                  marks it as ours is the cyan dot, the spectrum cost bar and
                  the cyan checks. The numbers make the case. */}
              <div className="relative">
                <Reveal
                  delay={0.3}
                  className="relative flex h-full flex-col rounded-[1.25rem] border border-black/[0.08] bg-white p-6"
                >
                  <RoleKicker color="bg-prism-cyan-400">{PRISMA.name}</RoleKicker>
                  <p className="relative mt-5 font-heading text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-tight text-foreground">
                    <CountUp value={PRISMA.cost} />
                    <span className="ml-1.5 align-baseline text-base font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                  <p className="relative mt-2 text-sm text-muted-foreground">at ~50K MAU</p>

                  <CostBar
                    className="relative mt-5"
                    fraction={costFraction(PRISMA.cost)}
                    spectrum
                    delay={0.4}
                  />

                  <dl className="relative mt-7 flex flex-col gap-5 border-t border-black/[0.06] pt-6">
                    {PRISMA.rows.map((r) => (
                      <div key={r.label}>
                        <dt className="text-sm font-semibold text-foreground/70">{r.label}</dt>
                        <dd className="mt-1.5 flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-foreground">
                          <CheckBold
                            className="mt-1 size-4 shrink-0 text-prism-cyan-500"
                            aria-hidden
                          />
                          {r.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>
            </div>

            {/* The estimate's basis, said on the page rather than only in
                the code, with the date it was checked and a way to run your
                own numbers in the calculator above. */}
            <Reveal delay={0.35}>
              <p className="mx-auto mt-10 max-w-3xl text-pretty text-center text-sm leading-relaxed text-muted-foreground">
                {COMPARISON_BASIS}{" "}
                <a
                  href="#estimate"
                  className="whitespace-nowrap rounded-sm font-medium text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  Try your own numbers →
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
