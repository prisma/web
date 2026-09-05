"use client";

import { Shield } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { fmtGB, fmtOps, fmtUSD, PRESETS } from "./calc";
import { RangeInput, useEstimator } from "./controls";

// Barcode bars — fixed pattern, purely decorative.
const BARS = [2, 1, 3, 1, 2, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2];

// Option A — "The Receipt". The promise is a predictable bill, so the result
// IS a bill: a paper slip with the total up top, itemized lines below, and
// the spend limit printed on it like a guarantee.
export function VariantReceipt() {
  const { ops, gb, opsT, gbT, setOpsT, setGbT, setPreset, rec } = useEstimator();
  const { best } = rec;

  return (
    <section className="bg-card">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-20 sm:px-8 md:grid-cols-[1fr_400px] lg:gap-20">
        <div>
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Estimate usage before you upgrade
          </h2>
          <p className="mt-5 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            Estimate your usage before you upgrade, then set a spend limit so the bill can&apos;t
            surprise you. The calculator recommends the right plan for where you are.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.ops, p.gb)}
                className="rounded-xl border border-foreground/[0.06] bg-card p-4 text-left transition-colors hover:border-foreground/[0.14]"
              >
                <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {p.blurb}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Operations per month
                </label>
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
              <p className="mt-2 font-mono text-xs text-muted-foreground">1 query = 1 operation</p>
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
          </div>
        </div>

        {/* the receipt */}
        <div className="relative mx-auto w-full max-w-[400px] rotate-[0.4deg]">
          <div className="bg-primary-foreground px-7 pb-8 pt-7 shadow-[0_1px_2px_rgba(21,21,21,0.06),0_32px_64px_-32px_rgba(21,21,21,0.35)]">
            <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Prisma · Estimate
            </p>

            <div className="mt-6 border-t border-dashed border-foreground/20 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Recommended plan
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="font-mono text-xl font-semibold uppercase text-foreground">
                  {best.plan.name}
                </p>
                <p className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                  {fmtUSD(best.total)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-dashed border-foreground/20 pt-5 font-mono text-[13px] tabular-nums">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Base plan</dt>
                <dd className="text-foreground">{fmtUSD(best.plan.base)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  Operations · {fmtOps(ops)}
                  <span className="block text-[11px]">
                    {fmtOps(best.plan.opsIncluded)} included
                  </span>
                </dt>
                <dd className="text-foreground">
                  {best.opsOverage > 0 ? `+${fmtUSD(best.opsOverage)}` : "included"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  Storage · {fmtGB(gb)}
                  <span className="block text-[11px]">
                    {fmtGB(best.plan.storageIncludedGB)} included
                  </span>
                </dt>
                <dd className="text-foreground">
                  {best.storageOverage > 0 ? `+${fmtUSD(best.storageOverage)}` : "included"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-2.5 border-t border-dashed border-foreground/20 pt-5">
              <Shield className="size-4 shrink-0 text-prism-red-500" aria-hidden />
              <p className="font-mono text-xs leading-relaxed text-foreground">
                Spend limit on by default — the bill can&apos;t pass it.
              </p>
            </div>

            {rec.custom && (
              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                Usage beyond Business — custom pricing is available.
              </p>
            )}

            <div
              aria-hidden
              className={cn("mt-6 flex h-8 items-stretch justify-center gap-[3px] opacity-70")}
            >
              {BARS.map((w, i) => (
                <span key={i} className="bg-foreground" style={{ width: w }} />
              ))}
            </div>
          </div>
          {/* sawtooth tear along the bottom edge */}
          <div
            aria-hidden
            className="h-3 w-full"
            style={{
              background: "var(--paper)",
              backgroundSize: "14px 14px",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>
      </div>
    </section>
  );
}
