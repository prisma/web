"use client";

import { useState } from "react";
import { RoleKicker } from "@/components/brand/role-kicker";
import { CheckBold, XCircle } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import {
  fmtGB,
  fmtOps,
  fmtUSD,
  gbToT,
  opsToT,
  planTerms,
  PRESETS,
  priceAllPaid,
  SQL_PER_OPERATION,
  tToGB,
  tToOps,
  YEARLY_DISCOUNT,
} from "./calculator-options/calc";
import { RangeInput } from "./calculator-options/controls";

// The live calculator's behaviour (prisma.io/pricing), rebuilt in our
// components: quick-start presets, an operations slider that also reports
// estimated SQL queries, a storage slider, monthly/annual billing, and every
// paid plan priced with the cheapest recommended. Free isn't offered in their
// calculator, so it isn't priced here either.
//
// Laid out to fit one viewport: presets are a compact row, then inputs and
// results sit side by side (3/5 + 2/5) rather than stacking.
//
// State holds real values rather than slider positions, so a preset click
// matches exactly and its card lights up. The log scale snaps to two
// significant digits and every preset value is two-sig-digit.
export function PricingCalculator() {
  const [ops, setOps] = useState(12_000_000);
  const [gb, setGb] = useState(8);
  const [yearly, setYearly] = useState(false);

  const priced = priceAllPaid(ops, gb, yearly);
  const recommendedId = priced[0].plan.id;
  const activePreset = PRESETS.find((p) => p.ops === ops && p.gb === gb)?.id;

  return (
    <section className="bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-6xl py-12 sm:py-16">
        <Reveal>
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Estimate usage before you upgrade
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            Estimate your usage before you upgrade, then set a spend limit so the bill can&apos;t
            surprise you. The calculator recommends the right plan for where you are.
          </p>
        </Reveal>

        {/* quick-start presets, compact — name and usage only, as on the live
            calculator. The V2 blurbs stay on PRESETS in calc.ts. */}
        <Reveal delay={0.15}>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setOps(p.ops);
                  setGb(p.gb);
                }}
                aria-pressed={activePreset === p.id}
                className={cn(
                  "flex items-baseline justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  activePreset === p.id
                    ? "border-primary bg-white"
                    : "border-black/[0.06] bg-paper hover:border-black/[0.14]",
                )}
              >
                <span className="text-sm font-semibold text-foreground">{p.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {fmtOps(p.ops)} · {fmtGB(p.gb)}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* inputs */}
          <Reveal delay={0.2} className="lg:col-span-3">
            <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-paper p-6 sm:p-7">
              <RoleKicker color="bg-prism-cyan-400">Estimate your monthly usage</RoleKicker>

              <div className="mt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-semibold text-foreground">Database operations</p>
                  <p className="font-mono text-lg tabular-nums text-foreground">
                    {ops.toLocaleString("en-US")}
                  </p>
                </div>
                <RangeInput
                  t={opsToT(ops)}
                  onT={(t) => setOps(tToOps(t))}
                  label="Database operations per month"
                  className="mt-3"
                  fillClassName="bg-prism-cyan-400"
                />
                {/* the live calculator reports operations x5 as SQL queries */}
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  ≈ {(ops * SQL_PER_OPERATION).toLocaleString("en-US")} SQL queries ·{" "}
                  {SQL_PER_OPERATION}× per operation
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-semibold text-foreground">Storage</p>
                  <p className="font-mono text-lg tabular-nums text-foreground">{fmtGB(gb)}</p>
                </div>
                <RangeInput
                  t={gbToT(gb)}
                  onT={(t) => setGb(tToGB(t))}
                  label="Storage in gigabytes"
                  className="mt-3"
                  fillClassName="bg-prism-yellow-300"
                />
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-5">
                <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <CheckBold className="size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  <span>
                    <span className="font-semibold text-foreground">Data transfer</span> —
                    unlimited, included free
                  </span>
                </p>

                <div
                  role="group"
                  aria-label="Billing period"
                  className="flex rounded-full border border-black/[0.08] bg-white p-1"
                >
                  {[
                    { id: "monthly", label: "Monthly", on: !yearly },
                    { id: "yearly", label: `Yearly · −${YEARLY_DISCOUNT * 100}%`, on: yearly },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={o.on}
                      onClick={() => setYearly(o.id === "yearly")}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                        o.on
                          ? "bg-foreground text-white"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* every paid plan priced, cheapest recommended */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            {priced.map((e, i) => {
              const isRec = e.plan.id === recommendedId;
              return (
                <Reveal key={e.plan.id} delay={0.25 + i * 0.05} className="flex-1">
                  <div
                    className={cn(
                      "flex h-full flex-col justify-center rounded-2xl border px-5 py-4",
                      isRec
                        ? "spectrum-border spectrum-border-on border-transparent bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)]"
                        : "border-black/[0.06] bg-paper",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{e.plan.name} plan</p>
                      {isRec && (
                        <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-semibold text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 flex items-baseline gap-2 font-heading text-3xl font-medium tracking-tight text-foreground">
                      {fmtUSD(e.monthly, e.monthly % 1 !== 0)}
                      <span className="font-sans text-sm font-normal text-muted-foreground">
                        {yearly ? "/mo, billed yearly" : "/month"}
                      </span>
                    </p>
                    <p className="mt-2 text-pretty text-xs leading-relaxed text-muted-foreground">
                      {planTerms(e.plan)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.45}>
          <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <XCircle className="mt-0.5 size-4 shrink-0 text-prism-red-500" aria-hidden />
            Hard spend limit, on by default — never a surprise bill.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
