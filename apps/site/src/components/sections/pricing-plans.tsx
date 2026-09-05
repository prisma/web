import { Marker } from "@/components/brand/marker";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { CheckBold } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// V2 plan cards. Corrections applied on top of V2:
//  - Gregory (2026-07-24): Business has an overage rate, $0.0010 per 1,000
//  - Shane (2026-07-29): "Most popular" moved from Pro to Starter, to anchor
//    on the lower price rather than making Prisma read as expensive; Free
//    states that it is free forever
//
// `compute` is each plan's Prisma Compute pricing — Compute GA (Shane,
// 2026-08-24). The numbers are LOCKED IN, hand-entered by Shane: requests
// include 1M requests, 360 GB-hours of memory, 4 vCPU-hours, and 10 GB of
// outbound bandwidth on Free with no usage billing. Paid tiers include
// 5M/20M/100M requests, then bill every meter by use. These cards are the
// page's source of truth — keep the Prisma Compute group in
// pricing-spec-table.tsx, pricing-data.ts, and the llms surfaces in sync
// with them.
//
// `blurb` is kept in the data but NOT rendered (2026-07-30). Shane asked to land
// on the plans with no preamble, and trimming the cards is what buys the last
// 40px: at 1440x800 the blurb pushed each card to 494px and the CTA fell below
// the fold. Left in place rather than deleted because it is approved V2 copy and
// this is the one piece of it with nowhere else to live — restoring it is a
// one-line change if the client would rather have the copy than the fold.
// Verify the fold if you do.
const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "Free forever. No credit card required.",
    compute: [
      "1M requests / month",
      "360 GB-hours memory / month",
      "4 active vCPU-hours / month",
      "10 GB outbound bandwidth / month",
    ],
    postgres: ["200k operations / month", "500 MB storage", "50 databases"],
    platform: [],
    blurb:
      "Everything you need to build and explore with no clock running. No credit card, no expiry.",
    cta: "Start for free",
    href: "https://console.prisma.io/sign-up",
    popular: false,
  },
  {
    name: "Starter",
    price: "$10",
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
    blurb:
      "Ship your first production app without worrying about the bill. Backups included, spend limits on by default.",
    cta: "Get started",
    href: "https://console.prisma.io/sign-up",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49",
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
    blurb:
      "For production apps with real traffic. More operations, lower overage rates, and headroom to grow without watching the meter.",
    cta: "Get started",
    href: "https://console.prisma.io/sign-up",
    popular: false,
  },
  {
    name: "Business",
    price: "$129",
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
    blurb: "Built for high-growth teams with compliance requirements and sustained high volume.",
    cta: "Get started",
    href: "https://console.prisma.io/sign-up",
    popular: false,
  },
];

// The two product groups render identically — same label style, same bullet
// treatment — which is the "equal footing" Shane asked for (2026-08-24:
// Compute is a first-class citizen). Compute leads, matching the
// "Compute+Postgres" framing. Platform holds the plan-level items (spend
// limits, compliance) so they don't masquerade as database features.
const CARD_GROUPS = [
  { key: "compute", label: "Prisma Compute" },
  { key: "postgres", label: "Prisma Postgres" },
  { key: "platform", label: "Platform" },
] as const;

// Renders bare — no <section>, no gutter, no max-width. These cards live inside
// the hero panel (PricingHero takes them as children), which already provides
// all three. Rendering it standalone would have no horizontal padding.
export function PricingPlans() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-6 sm:p-7",
              plan.popular
                ? "spectrum-border spectrum-border-on border-transparent shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)]"
                : "border-foreground/[0.06]",
            )}
          >
            {plan.popular && (
              <Marker className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Marker>
            )}
            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
            <p className="mt-4 font-heading text-4xl font-medium tracking-tight text-foreground">
              {plan.price}
              <span className="ml-1 text-base font-normal text-muted-foreground">/ month</span>
            </p>
            {plan.note && <p className="mt-2.5 text-sm text-muted-foreground">{plan.note}</p>}
            {/* One loop for every group — Compute and Postgres get the exact
                same treatment by construction (see CARD_GROUPS). */}
            <div className="mt-6">
              {CARD_GROUPS.map(({ key, label }) => {
                const items = plan[key];
                if (items.length === 0) {
                  return null;
                }
                return (
                  <div key={key} className="border-t border-foreground/[0.06] py-5 last:pb-0">
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                    <ul className="mt-3 space-y-3">
                      {items.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-2.5 text-sm leading-relaxed text-foreground"
                        >
                          <CheckBold
                            className="mt-0.5 size-4 shrink-0 text-prism-cyan-500"
                            aria-hidden
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            {/* plan.blurb is deliberately not rendered — see the note on PLANS */}
            <div className="mt-8 flex flex-1 items-end">
              {/* Brand CTAs, not the shadcn pair: the recommended plan gets
                    the prismatic fill, the rest the spectrum-on-hover outline,
                    so only one CTA in the row reads as primary. */}
              {plan.popular ? (
                <PrismButton href={plan.href} fullWidth>
                  {plan.cta}
                </PrismButton>
              ) : (
                <PrismButtonOutline href={plan.href} className="w-full">
                  {plan.cta}
                </PrismButtonOutline>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Need more? — sits inside the panel with the cards, since it's part of
          the pricing block rather than the start of the next section. It falls
          below the fold, which is fine; the four cards are what had to clear it. */}
      <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-foreground/[0.06] bg-card p-7 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="font-heading text-lg font-medium text-foreground">Need more?</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Custom pricing is available for high-volume teams.
          </p>
        </div>
        <PrismButtonOutline href="/contact" className="shrink-0">
          Contact us
        </PrismButtonOutline>
      </div>
    </>
  );
}
