import { Marker } from "@/components/brand/marker";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { SpectrumRing } from "@/components/brand/spectrum-ring";
import { ArrowRightLeft, ArrowUpFromLine, Cpu, MemoryStick } from "lucide-react";
import { CheckBold } from "@/components/icons/forma";
import { renderFaqAnswer } from "@/lib/faq-answer";
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
// Card trim (client review with PostHog, 2026-11-21): the median desktop
// visitor sees only about the first 1,550px of the page and the median phone
// visitor about 2,100px, so the cards are most of what anyone reads.
//  - Memory, CPU and bandwidth rates are identical on every paid plan, so each
//    paid card says "billed by use" once and the rates appear a single time
//    under the row (PAID_RATES). Numbers unchanged — still Shane's.
//  - "Spend limits" is on every plan, so it moved out of Platform (now the
//    "Cap your spending" card, pricing-cost-controls.tsx); Platform lists
//    only what differs.
//  - Paid buttons name their plan. All three said "Get started", so PostHog
//    couldn't tell which paid plan anyone chose (cta_text is the label).
// The Compute rates that are identical on every paid plan, shown once as a
// strip under the cards (client, 2026-11-21, after Railway's pricing page:
// big plain rates make the charges obvious). Postgres overage rates differ
// by plan, so they stay on the cards. Numbers are Shane's, unchanged.
const PAID_RATES = [
  {
    icon: ArrowRightLeft,
    name: "Requests",
    amount: "$1",
    unit: "per million",
    note: "beyond your plan's included requests",
  },
  {
    icon: MemoryStick,
    name: "Provisioned memory",
    amount: "$0.006",
    unit: "per GB-hour",
    note: "while your app runs",
  },
  { icon: Cpu, name: "Active CPU", amount: "$0.064", unit: "per vCPU-hour", note: "CPU time used" },
  {
    icon: ArrowUpFromLine,
    name: "Outbound bandwidth",
    amount: "$0.025",
    unit: "per GB",
    note: "sent to the internet",
  },
];

// Jump links under the cards: most visitors never scroll past them, so the
// sections further down get a way in. Anchors live on each section.
const JUMP_LINKS = [
  { href: "#estimate", label: "Estimate your bill" },
  { href: "#compare-plans", label: "Compare all features" },
  { href: "#compare", label: "Prisma vs Neon, Supabase and Vercel" },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "Free forever. No credit card required.",
    compute: [
      "1M requests / month",
      "360 GB-hours provisioned memory / month",
      "4 active vCPU-hours / month",
      "10 GB outbound bandwidth / month",
    ],
    postgres: ["200k operations / month", "2 GB storage", "50 databases"],
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
    compute: ["5M requests / month included", "Usage billed at the rates below"],
    postgres: [
      "1M operations / month, then $8 per million",
      "10 GB storage, then $2.00 per GB",
      "1,000 databases",
      "7-day daily backups",
    ],
    platform: [],
    blurb:
      "Ship your first production app without worrying about the bill. Backups included, and a spend limit you set.",
    cta: "Start on Starter",
    href: "https://console.prisma.io/sign-up",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49",
    note: null,
    compute: ["20M requests / month included", "Usage billed at the rates below"],
    postgres: [
      "10M operations / month, then $2 per million",
      "50 GB storage, then $1.50 per GB",
      "1,000 databases",
      "7-day daily backups",
    ],
    platform: ["GDPR"],
    blurb:
      "For production apps with real traffic. More operations, lower overage rates, and headroom to grow without watching the meter.",
    cta: "Start on Pro",
    href: "https://console.prisma.io/sign-up",
    popular: false,
  },
  {
    name: "Business",
    price: "$129",
    note: null,
    compute: ["100M requests / month included", "Usage billed at the rates below"],
    postgres: [
      "50M operations / month, then $1 per million",
      "100 GB storage, then $1.00 per GB",
      "1,000 databases",
      "30-day backup retention",
    ],
    // HIPAA deep-links to /postgres/hipaa (the Business-plan landing page);
    // the card renders feature strings through `renderFaqAnswer`, which turns
    // `[text](/path)` into an inline link.
    platform: ["GDPR, [HIPAA with a BAA](/postgres/hipaa), SOC 2, ISO 27001"],
    blurb: "Built for high-growth teams with compliance requirements and sustained high volume.",
    cta: "Start on Business",
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
              "relative flex flex-col rounded-2xl border bg-white p-6 sm:p-7",
              plan.popular
                ? "border-transparent shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)]"
                : "border-black/[0.06]",
            )}
          >
            {/* z-10: the SpectrumRing is rendered last and is also absolute, so
                without it the ring paints over the marker it's meant to sit under. */}
            {plan.popular && (
              <Marker className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                Most popular
              </Marker>
            )}
            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
            <p className="mt-4 font-heading text-4xl font-medium tracking-tight text-foreground">
              {plan.price}
              <span className="ml-1 text-base font-normal text-muted-foreground">/ month</span>
            </p>
            {plan.note && <p className="mt-2.5 text-sm text-muted-foreground">{plan.note}</p>}
            {/* `npx create-db` used to sit here ("Or skip sign-up"). Moved to
                the FAQ (client, 2026-11-22): on the Free card it read as if
                the Free plan itself needed no account, when it's a separate,
                temporary, database-only start. */}
            {/* One loop for every group — Compute and Postgres get the exact
                same treatment by construction (see CARD_GROUPS). */}
            <div className="mt-6">
              {CARD_GROUPS.map(({ key, label }) => {
                const items = plan[key];
                if (items.length === 0) {
                  return null;
                }
                return (
                  <div key={key} className="border-t border-black/[0.06] py-5 last:pb-0">
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
                          <span>{renderFaqAnswer(feature)}</span>
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
            {plan.popular && <SpectrumRing />}
          </div>
        ))}
      </div>

      {/* Compute usage rates, Railway-style (client, 2026-11-21): a label and
          the four rates that are identical on every paid plan.
          Off the card (client, 2026-11-22: "take this off a card"): a band
          between two hairlines, on the cards' own four-column grid. The label
          sits under Free, which has no usage billing, and the rates span the
          three paid columns, so nothing reads as a Free rate. Text is inset
          to the cards' padding so every left edge lines up. Phones: label on
          top, rates two by two. */}
      <div className="mt-10 grid gap-x-6 gap-y-6 border-y border-black/[0.08] py-8 lg:grid-cols-4">
        <div className="sm:px-7">
          <p className="text-sm font-semibold text-foreground">Usage rates</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Prisma Compute, on every paid plan. Free has no usage billing.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:px-7 md:grid-cols-4 lg:col-span-3">
          {PAID_RATES.map(({ icon: Icon, name, amount, unit, note }) => (
            <li key={name}>
              {/* Two-line slot on phones, where "Provisioned memory" and
                  "Outbound bandwidth" wrap in a half-width column, so the
                  amounts below stay level across each pair. */}
              <span className="flex min-h-10 items-start gap-2 text-sm font-medium text-foreground md:min-h-0 md:items-center">
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-prism-red-500 md:mt-0" />
                {name}
              </span>
              <span className="mt-1.5 block font-heading text-2xl tabular-nums text-foreground">
                {amount}
              </span>
              <span className="block text-sm text-muted-foreground">
                {unit}, {note}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* One quiet footer line: where to go next on the left (most visitors
          never scroll past the cards), custom pricing on the right. */}
      <div className="mt-6 flex flex-col gap-4 text-sm sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="More on this page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {JUMP_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-sm text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted-foreground">
          Need more? Custom pricing is available for high-volume teams.{" "}
          <a
            href="/contact"
            className="whitespace-nowrap rounded-sm font-medium text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            Contact us
          </a>
        </p>
      </div>
    </>
  );
}
