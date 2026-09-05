import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { Marker } from "@/components/brand/marker";
import { Pattern } from "@/components/brand/pattern";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CheckBold, X } from "@/components/icons/forma";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { CostBar } from "./pricing-cost-bar";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM = "var(--color-prism-cyan-400)";

// V2 copy verbatim, with "No connection limits" removed — Gregory confirmed
// pooled limits do exist (10/100/500/1000).
//
// Figure provenance, as of 2026-07-30:
//  - Supabase Pro $95–145 and Prisma Pro $72–90 are CLIENT-SUPPLIED, from their
//    "Recommended website comparison" (fair 50K MAU model). Both trustworthy.
//  - Neon + Vercel $385–450 is still NOT verified. It has never been confirmed,
//    and the blog post once offered as backing compares Prisma Compute vs Vercel
//    at 20M requests (~$98 vs ~$236, about 2.4x) — a different comparison.
//
// ⚠️ This is now an inconsistency the client needs to resolve, not just a gap.
// SAVINGS_MULTIPLE is derived from the widest column, so it renders "Up to 5x
// less" off the back of the unverified $385–450 — while the client's own freshly
// supplied Supabase column sits beside it at only ~1.5x. Two competitor
// comparisons in one section implying wildly different savings, with the
// aggressive one being the unsourced one, is the kind of thing a competitor
// checks. Flagged to André 2026-07-30; do not quietly keep shipping the 5x.

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

const ALTERNATIVES = [
  {
    id: "neon-vercel",
    name: "Typical stack (Neon + Vercel)",
    shortName: "Neon + Vercel",
    cost: "$385–450",
    pending: false,
    rows: [
      { label: "Billing", value: "Separate database + hosting bills" },
      { label: "Database data transfer", value: "Pay per GB" },
      { label: "Spend limits", value: "Not standard" },
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
    cost: "$95–145",
    pending: false,
    rows: [
      {
        label: "Billing",
        value: "Platform subscription + Postgres compute + function usage",
      },
      {
        label: "Database data transfer",
        value: "250 GB egress included, then $0.09/GB",
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
//
// ⚠️ The cost moved: V2 had $70–90, the client's 2026-07-30 doc says $72–90.
// Taking theirs — the old figure was never verified in the first place (it was
// open item 2), and this is the first time they have put a number in writing.
const PRISMA = {
  name: "Prisma Pro",
  cost: "$72–90",
  rows: [
    { label: "Billing", value: "One bill, one platform" },
    { label: "Database data transfer", value: "Included" },
    { label: "Spend limits", value: "On by default" },
  ],
};

// Bar length and the savings multiple are both derived from the cost strings
// above, so the figures stay a single source of truth: correct "$385–450" and
// the bar and the multiple follow it. Nothing here introduces a number that
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
// can never drift from the bars or from the sentence above them. The V2 copy
// says "up to 5x less"; if this ever renders something else, the figures moved
// and the copy needs re-checking with the client.
//
// It names its basis. Unqualified, "Up to 5x less" sits on the Prisma card right
// next to a Supabase column that is only ~1.5x more expensive, so it reads as a
// claim about Supabase and is wrong by more than 3x. The multiple only ever
// describes the widest column, so it says which one that is.
const PRISMA_MID = costMidpoint(PRISMA.cost);
const SAVINGS_MULTIPLE = PRISMA_MID && MAX_COST ? Math.round(MAX_COST / PRISMA_MID) : null;
const WIDEST = ALTERNATIVES.reduce((a, b) =>
  (costMidpoint(b.cost) ?? 0) > (costMidpoint(a.cost) ?? 0) ? b : a,
);

// Same dashed badge the spec table uses, so "we don't have this yet" looks
// identical in both places on the page.
function PendingBadge() {
  return (
    <span
      title="Awaiting figures from Prisma"
      className="inline-flex rounded border border-dashed border-foreground/20 px-1.5 py-0.5 text-xs font-medium text-muted-foreground/70"
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
    <section className="bg-card px-3 py-16 sm:px-4 sm:py-24">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-foreground/[0.06] bg-card">
        {/* spectral bottom — wash plus the three brand beams */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: "var(--paper)",
            }}
          />

          <div className="absolute inset-x-0 top-0 h-56 bg-transparent" />
        </div>

        {/* glass prism turning at the bottom edge, light concentrating behind it */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-[16rem] w-[24rem] rounded-full opacity-25 blur-[70px]"
          style={{ background: SPECTRUM }}
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
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-3xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
                Prisma charges per operation: each query your app runs against your database counts
                as one. No seats. No egress fees. And every paid plan includes a hard spend limit so
                there are no surprises.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
                At around 50K monthly active users,{" "}
                <strong className="font-semibold text-foreground">
                  Prisma Pro can cost up to 5x less than a typical Neon + Vercel setup
                </strong>
                , with one bill, included data transfer, and spend limits on by default.
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
                      ? "border-dashed border-foreground/15 bg-card/25"
                      : "border-foreground/[0.05] bg-card/45",
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
                    <p className="mt-5 font-heading text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-tight text-muted-foreground">
                      <CountUp value={alt.cost} />
                      <span className="ml-1.5 align-baseline text-base font-normal">/month</span>
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

                  <dl className="mt-7 flex flex-col gap-5 border-t border-foreground/[0.06] pt-6">
                    {alt.rows.map((r) => (
                      <div key={r.label}>
                        <dt className="text-sm font-semibold text-foreground/70">{r.label}</dt>
                        <dd className="mt-1.5 flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                          {alt.pending ? (
                            <PendingBadge />
                          ) : (
                            <>
                              <X
                                className="mt-1 size-4 shrink-0 text-foreground/35"
                                strokeWidth={3}
                                aria-hidden
                              />
                              {r.value}
                            </>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ))}

              {/* Prisma — lifted on white with the always-on spectrum ring, the
                  brand cube pattern greyscaled behind it, and a soft spectrum
                  glow underneath so the winning column sits above the other
                  two rather than merely beside them. */}
              <div className="relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-4 -bottom-6 top-8 rounded-full opacity-25 blur-[52px]"
                  style={{ background: SPECTRUM }}
                />
                <Reveal
                  delay={0.3}
                  className="spectrum-border spectrum-border-on relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-transparent bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
                  >
                    <Pattern className="h-full w-full" scale={2.5} />
                  </div>

                  <div className="relative flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <RoleKicker color="bg-prism-cyan-400">{PRISMA.name}</RoleKicker>
                    {SAVINGS_MULTIPLE !== null && (
                      <Marker className="-mt-0.5 shrink-0">
                        Up to {SAVINGS_MULTIPLE}x less vs {WIDEST.shortName}
                      </Marker>
                    )}
                  </div>
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

                  <dl className="relative mt-7 flex flex-col gap-5 border-t border-foreground/[0.06] pt-6">
                    {PRISMA.rows.map((r) => (
                      <div key={r.label}>
                        <dt className="text-sm font-semibold text-foreground/70">{r.label}</dt>
                        <dd className="mt-1.5 flex items-start gap-3 text-pretty text-[0.9375rem] font-semibold leading-relaxed text-foreground">
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
          </div>
        </div>
      </div>
    </section>
  );
}
