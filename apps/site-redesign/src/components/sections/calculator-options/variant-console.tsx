"use client"

import { fmtGB, fmtOps, fmtUSD, PRESETS } from "./calc"
import { RangeInput, useEstimator } from "./controls"

// Spectrum swept around the card's perimeter, like the hero console's halo.
const HALO =
  "conic-gradient(var(--color-prism-yellow-300), var(--color-prism-red-500) 32%, var(--color-prism-cyan-400) 64%, var(--color-prism-yellow-300))"

// Option C — "The Console". The estimate rendered as a terminal run: flags
// in, answer out. Speaks to the agent-native story and echoes the homepage
// hero's console card.
export function VariantConsole() {
  const { ops, gb, opsT, gbT, setOpsT, setGbT, setPreset, rec } = useEstimator()
  const { best } = rec

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
        <div className="text-center">
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Estimate usage before you upgrade
          </h2>
          <p className="mx-auto mt-5 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            Estimate your usage before you upgrade, then set a spend limit so
            the bill can&apos;t surprise you. The calculator recommends the
            right plan for where you are.
          </p>
        </div>

        <div className="relative mt-12">
          {/* prismatic halo radiating from the card's edges */}
          <div
            aria-hidden
            className="absolute -inset-1 rounded-[1.25rem] opacity-50 blur-[24px]"
            style={{ background: HALO }}
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-primary text-primary-foreground shadow-[0_32px_64px_-24px_rgba(21,21,21,0.5)]">
            {/* titlebar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <span aria-hidden className="size-2.5 rounded-full bg-white/15" />
              <span aria-hidden className="size-2.5 rounded-full bg-white/15" />
              <span aria-hidden className="size-2.5 rounded-full bg-white/15" />
              <p className="ml-3 font-mono text-xs text-white/50">
                prisma estimate — console.prisma.io
              </p>
            </div>

            <div className="px-6 py-6 font-mono text-sm leading-relaxed sm:px-8">
              <p>
                <span className="text-white/40">$</span> prisma estimate
              </p>

              {/* --operations */}
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-prism-cyan-300">--operations</p>
                  <p className="tabular-nums text-white">{fmtOps(ops)} / mo</p>
                </div>
                <RangeInput
                  t={opsT}
                  onT={setOpsT}
                  label="Operations per month"
                  className="mt-2"
                  trackClassName="bg-white/10"
                  fillClassName="bg-prism-cyan-400"
                  thumbClassName="border-white/20 bg-white"
                />
              </div>

              {/* --storage */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-prism-yellow-200">--storage</p>
                  <p className="tabular-nums text-white">{fmtGB(gb)}</p>
                </div>
                <RangeInput
                  t={gbT}
                  onT={setGbT}
                  label="Storage"
                  className="mt-2"
                  trackClassName="bg-white/10"
                  fillClassName="bg-prism-yellow-300"
                  thumbClassName="border-white/20 bg-white"
                />
              </div>

              {/* presets as a comment */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-white/40"># try:</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreset(p.ops, p.gb)}
                    className="rounded border border-white/15 px-2.5 py-1 text-white/80 transition-colors hover:border-white/35 hover:text-white"
                  >
                    {p.label.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* output */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-white/40">→</span>
                  <span className="text-lg font-semibold text-white">
                    {rec.custom ? "custom" : best.plan.name.toLowerCase()}
                  </span>
                  <span className="text-lg tabular-nums text-white">
                    {fmtUSD(best.total)}/mo
                  </span>
                </p>
                <div className="mt-3 space-y-1 text-[13px] text-white/55">
                  <p className="tabular-nums">
                    base{"          "}
                    {fmtUSD(best.plan.base)}
                  </p>
                  <p className="tabular-nums">
                    ops overage{"   "}
                    {best.opsOverage > 0
                      ? `+${fmtUSD(best.opsOverage)}  (${fmtOps(
                          ops - best.plan.opsIncluded
                        )} × $${(best.plan.opsOveragePer1K ?? 0).toFixed(3)}/1K)`
                      : "$0.00  (within plan)"}
                  </p>
                  <p className="tabular-nums">
                    storage{"       "}
                    {best.storageOverage > 0
                      ? `+${fmtUSD(best.storageOverage)}`
                      : "$0.00  (within plan)"}
                  </p>
                  <p>
                    spend-limit{"   "}
                    <span className="text-prism-cyan-300">on by default</span>
                  </p>
                  {rec.custom && (
                    <p>
                      note{"          "}usage beyond Business — run{" "}
                      <span className="text-white">prisma contact-sales</span>
                    </p>
                  )}
                </div>
                <p aria-hidden className="mt-4 text-white/70">
                  <span className="animate-caret-blink">▌</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
