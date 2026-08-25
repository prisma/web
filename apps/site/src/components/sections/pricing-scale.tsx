"use client";

import { useState } from "react";
import { CheckBold, X } from "@/components/icons/forma";
import { PrismButton } from "@/components/brand/prism-button";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// Grain applied at a fixed scale (instead of <Texture />'s object-cover) so
// the active tab and the panel share the same grain size — the pattern reads
// as one continuous surface across the tab/panel junction.
const GRAIN: React.CSSProperties = {
  backgroundImage: "url(/brand/texture.jpg)",
  backgroundSize: "1200px auto",
  opacity: 0.06,
  mixBlendMode: "multiply",
};

// TODO: the ~5K and ~500K MAU scenario numbers are placeholders pending
// client content — only the ~50K MAU column came from the client.

const BULLETS = [
  {
    lead: "Free Postgres tier",
    rest: " with a hard cap, no credit card required",
  },
  {
    lead: "Spend limits on every paid tier",
    rest: ", so your bill never surprises you",
  },
  {
    lead: "Unlimited data transfer included",
    rest: ", no bandwidth bill-shock",
  },
  {
    lead: "Prisma ORM is free, always",
    rest: "",
  },
  {
    lead: "Per-branch databases included",
    rest: ", no surcharge",
  },
  {
    lead: "SOC2, HIPAA, ISO 27001, and GDPR",
    rest: " at the Business tier",
  },
];

type Scenario = {
  tab: string;
  mau: string;
  typicalCost: string;
  prismaCost: string;
  typical: string[];
  prisma: string[];
};

const SCENARIOS: Scenario[] = [
  {
    tab: "Side project",
    mau: "~5K MAU",
    typicalCost: "$19-39",
    prismaCost: "$0",
    typical: [
      "Separate database + hosting bills",
      "Data transfer billed per GB",
      "Credit card required up front",
    ],
    prisma: [
      "No credit card required",
      "Data transfer included",
      "Hard free-tier cap, no surprises",
    ],
  },
  {
    tab: "Growing SaaS",
    mau: "~50K MAU",
    typicalCost: "$385-450",
    prismaCost: "$70-90",
    typical: [
      "Separate database + hosting bills",
      "Data transfer billed per GB",
      "Spend limits not standard",
    ],
    prisma: ["One bill, one platform", "Data transfer included", "Spend limits on by default"],
  },
  {
    tab: "At scale",
    mau: "~500K MAU",
    typicalCost: "$2,800-3,400",
    prismaCost: "$640-780",
    typical: [
      "Committed-use contracts across vendors",
      "Data transfer billed per GB",
      "Spend limits not standard",
    ],
    prisma: ["One bill, one platform", "Data transfer included", "Spend limits on by default"],
  },
];

// The comparison as the site's before/after idiom in miniature: the typical
// stack ghosted on the muted wash, Prisma lifted on the spectrum glow.
function ComparisonSlide({ scenario, active }: { scenario: Scenario; active: boolean }) {
  return (
    <div className="flex min-w-0 shrink-0 grow-0 basis-full flex-col px-5 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-9">
      <div className="grid flex-1 gap-4 sm:gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-muted/40 p-6 sm:p-7">
          <p className="text-sm font-semibold leading-snug text-muted-foreground">
            Typical stack (Neon + Vercel)
          </p>
          <CountUp
            value={scenario.typicalCost}
            active={active}
            className="mt-3 block font-heading text-3xl leading-none text-muted-foreground sm:text-4xl"
          />
          <p className="mt-2 text-xs text-muted-foreground/80">per month</p>
          <ul className="mt-6 flex flex-col gap-3">
            {scenario.typical.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-pretty text-sm leading-snug text-muted-foreground"
              >
                <X
                  className="mt-0.5 size-3.5 shrink-0 text-foreground/35"
                  strokeWidth={3}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-[0.9375rem] opacity-20 blur-[14px]"
            style={{ backgroundImage: SPECTRUM }}
          />
          <div className="relative flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_24px_-12px_rgba(21,21,21,0.12)] sm:p-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/full-color.svg" alt="Prisma" className="h-4 w-auto self-start" />
            <CountUp
              value={scenario.prismaCost}
              active={active}
              className="mt-3 block font-heading text-3xl leading-none text-foreground sm:text-4xl"
            />
            <p className="mt-2 text-xs text-muted-foreground">per month</p>
            <ul className="mt-6 flex flex-col gap-3">
              {scenario.prisma.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-pretty text-sm font-semibold leading-snug text-foreground"
                >
                  <CheckBold className="mt-0.5 size-3.5 shrink-0 text-prism-cyan-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioCarousel() {
  const [active, setActive] = useState(1);

  return (
    <div className="relative">
      {/* file-folder tabs flush with the card's left edge — the group is
          rounded as one shape, and the active tab carries the card's own
          surface (background + grain) so it reads as part of the panel */}
      <div
        role="tablist"
        aria-label="Pricing scenarios"
        className="relative z-10 -mb-px inline-grid grid-cols-3 overflow-hidden rounded-t-2xl border border-b-0 border-black/[0.06]"
      >
        {/* one grain plane behind the whole row, sharing the panel's x-origin
            — whichever tab is active exposes the same continuous texture
            (per-tab grain sampled a different crop on tabs 2 and 3). The
            inactive tabs paint opaque above it. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-card" style={GRAIN} />
        {SCENARIOS.map(({ tab, mau }, i) => (
          <button
            key={tab}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "relative border-b border-black/[0.06] px-2.5 pb-3 pt-3.5 text-left transition-colors sm:px-6 sm:pb-3.5 sm:pt-4",
              i > 0 && "border-l",
              i === active
                ? "border-b-transparent"
                : "bg-[color-mix(in_srgb,var(--color-foreground)_5%,var(--color-card))] hover:bg-[color-mix(in_srgb,var(--color-foreground)_3%,var(--color-card))]",
            )}
          >
            <span
              className={cn(
                "relative block whitespace-nowrap text-[0.8125rem] font-semibold sm:text-sm",
                i === active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {tab}
            </span>
            <span className="relative mt-0.5 hidden font-mono text-xs text-muted-foreground sm:block">
              {mau}
            </span>
          </button>
        ))}
      </div>

      {/* top-left corner squared off — the tab group above owns that corner */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl rounded-tl-none border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.03),0_16px_32px_-16px_rgba(21,21,21,0.1)]">
        {/* prismatic backdrop — the hero's treatment scaled to the card:
          spectral wash along the bottom, beam fan rising, dispersing to
          white above */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-18rem] left-[10%] h-[44rem] w-24 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[56px]" />
          <div className="absolute bottom-[-20rem] left-1/2 h-[46rem] w-28 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[64px]" />
          <div className="absolute bottom-[-21rem] right-[8%] h-[44rem] w-24 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[56px]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={GRAIN} />

        <div className="relative flex-1 overflow-hidden pt-2">
          <div
            className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {SCENARIOS.map((scenario, i) => (
              <ComparisonSlide key={scenario.tab} scenario={scenario} active={i === active} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingScale() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        {/* Top: heading + description (left), bullets + CTA (right) */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <Reveal>
              <h2 className="max-w-[20ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
                Pricing that scales with you
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-[54ch] text-pretty leading-relaxed text-muted-foreground">
                Start free with the ORM, which will always be free. Prisma Postgres has a free tier
                with a hard cap, so you can build without a credit card. When you outgrow it,
                you&apos;re on operation-based pricing with spend limits, and data transfer is
                always included.
              </p>
            </Reveal>

            <Reveal delay={0.16} className="mt-8 flex">
              <PrismButton href="/pricing">See pricing</PrismButton>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ul className="flex flex-col gap-3">
              {BULLETS.map(({ lead, rest }) => (
                <li
                  key={lead}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  <CheckBold className="mt-1 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  <span>
                    <strong className="font-semibold text-foreground">{lead}</strong>
                    {rest}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Below: the scenario card, full width */}
        <Reveal className="mt-14 min-w-0">
          <ScenarioCarousel />
        </Reveal>
      </div>
    </section>
  );
}
