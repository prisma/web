"use client";

import { Shield } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { fmtGB, fmtOps, fmtUSD, PRESETS } from "./calc";
import { RangeInput, useEstimator } from "./controls";

// Option E — "The Compare Row". One set of controls prices every plan at
// once; the cheapest eligible plan wears the lit spectrum ring. Answers
// "which plan am I on at this scale?" without hiding the alternatives.
export function VariantCompare() {
  const { ops, gb, opsT, gbT, setOpsT, setGbT, setPreset, rec } = useEstimator();

  return (
    <section className="bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Estimate usage before you upgrade
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Estimate your usage before you upgrade, then set a spend limit so the bill can&apos;t
            surprise you. The calculator recommends the right plan for where you are.
          </p>
        </div>

        {/* control bar */}
        <div className="mt-10 rounded-2xl border border-foreground/[0.06] bg-card p-6 sm:p-7">
          <div className="grid items-center gap-x-10 gap-y-6 lg:grid-cols-[1fr_1fr_auto]">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-foreground">Operations / month</label>
                <span className="font-mono text-sm tabular-nums text-foreground">
                  {fmtOps(ops)}
                </span>
              </div>
              <RangeInput
                t={opsT}
                onT={setOpsT}
                label="Operations per month"
                className="mt-3"
                fillClassName="bg-prism-cyan-400"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-foreground">Storage</label>
                <span className="font-mono text-sm tabular-nums text-foreground">{fmtGB(gb)}</span>
              </div>
              <RangeInput
                t={gbT}
                onT={setGbT}
                label="Storage"
                className="mt-3"
                fillClassName="bg-prism-yellow-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.ops, p.gb)}
                  className="rounded-full border border-foreground/[0.08] bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/[0.2]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* every plan, priced live */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rec.all.map((e) => {
            const isBest = e.plan.id === rec.best.plan.id && !rec.custom;
            return (
              <div
                key={e.plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6 transition-opacity",
                  isBest
                    ? "spectrum-border spectrum-border-on border-transparent shadow-[0_24px_48px_-24px_rgba(21,21,21,0.25)]"
                    : "border-foreground/[0.06]",
                  !e.eligible && "opacity-45",
                )}
              >
                {isBest && (
                  <span className="absolute -top-3 left-6 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white">
                    Your plan at this usage
                  </span>
                )}
                <p className="text-sm font-semibold text-foreground">{e.plan.name}</p>
                <p className="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground">
                  {e.eligible ? fmtUSD(e.total, e.total % 1 !== 0) : "—"}
                  {e.eligible && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>
                  )}
                </p>
                <p className="mt-1 min-h-5 font-mono text-xs text-muted-foreground">
                  {!e.eligible
                    ? "over free limits"
                    : e.total === e.plan.base
                      ? `flat ${fmtUSD(e.plan.base, false)} base`
                      : `${fmtUSD(e.plan.base, false)} base + ${fmtUSD(
                          e.opsOverage + e.storageOverage,
                        )} overage`}
                </p>
                <dl className="mt-5 space-y-1.5 border-t border-foreground/[0.06] pt-4 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <dt>Included ops</dt>
                    <dd className="font-mono tabular-nums">{fmtOps(e.plan.opsIncluded)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Included storage</dt>
                    <dd className="font-mono tabular-nums">{fmtGB(e.plan.storageIncludedGB)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Overage / 1K ops</dt>
                    <dd className="font-mono tabular-nums">
                      {e.plan.opsOveragePer1K ? `$${e.plan.opsOveragePer1K.toFixed(3)}` : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        <p className="mt-6 flex items-center gap-2.5 text-sm text-muted-foreground">
          <Shield className="size-4 shrink-0 text-prism-red-500" aria-hidden />
          Every paid plan includes a hard spend limit, on by default.
          {rec.custom && (
            <span className="font-semibold text-foreground">
              Usage beyond Business? Custom pricing is available — talk to us.
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
