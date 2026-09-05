"use client";

import { useMemo, useState } from "react";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Shield } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import {
  fmtGB,
  fmtOps,
  fmtUSD,
  GB_CANDIDATES,
  lastOfRuns,
  nearest,
  OPS_CANDIDATES,
  PRESETS,
  recommend,
} from "./calc";
import { RangeInput } from "./controls";

// Option D — "The Bento". Inputs as calm tiles in the stack-bento language;
// the estimate lives in one tall result tile wearing the brand's always-on
// spectrum ring. Composed, editorial, zero drama.
export function VariantBento() {
  const [ops, setOps] = useState(3_000_000);
  const [gb, setGb] = useState(12);

  const opsStops = useMemo(
    () => lastOfRuns(OPS_CANDIDATES, (v) => recommend(v, gb).best.total),
    [gb],
  );
  const gbStops = useMemo(
    () => lastOfRuns(GB_CANDIDATES, (v) => recommend(ops, v).best.total),
    [ops],
  );
  const opsSnapped = nearest(opsStops, ops);
  const gbSnapped = nearest(gbStops, gb);
  const rec = recommend(opsSnapped, gbSnapped);
  const { best } = rec;
  const activePreset = PRESETS.find((p) => p.ops === opsSnapped && p.gb === gbSnapped)?.id;

  const opsIdx = opsStops.indexOf(opsSnapped);
  const gbIdx = gbStops.indexOf(gbSnapped);

  const parts = [
    { label: "Base", value: best.plan.base, className: "bg-prism-cyan-400" },
    { label: "Operations", value: best.opsOverage, className: "bg-prism-yellow-300" },
    { label: "Storage", value: best.storageOverage, className: "bg-prism-red-500" },
  ].filter((p) => p.value > 0);

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

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          <div className="grid gap-4 lg:col-span-3">
            {/* preset tile */}
            <div className="rounded-2xl border border-foreground/[0.06] bg-card p-6">
              <RoleKicker color="bg-prism-cyan-400">Where are you now?</RoleKicker>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setOps(p.ops);
                      setGb(p.gb);
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      activePreset === p.id
                        ? "spectrum-border spectrum-border-on border-transparent bg-card"
                        : "border-foreground/[0.06] bg-card/60 hover:border-foreground/[0.14]",
                    )}
                  >
                    <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                    <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                      {fmtOps(p.ops)} ops · {fmtGB(p.gb)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ops tile */}
            <div className="rounded-2xl border border-foreground/[0.06] bg-card p-6">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-foreground">Operations per month</p>
                <p className="font-mono text-lg tabular-nums text-foreground">
                  {fmtOps(opsSnapped)}
                </p>
              </div>
              <RangeInput
                t={opsIdx / (opsStops.length - 1)}
                onT={(t) => setOps(opsStops[Math.round(t * (opsStops.length - 1))])}
                label="Operations per month"
                className="mt-4"
                fillClassName="bg-prism-cyan-400"
              />
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                1 query = 1 operation · every step changes the price
              </p>
            </div>

            {/* storage tile */}
            <div className="rounded-2xl border border-foreground/[0.06] bg-card p-6">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-foreground">Storage</p>
                <p className="font-mono text-lg tabular-nums text-foreground">{fmtGB(gbSnapped)}</p>
              </div>
              <RangeInput
                t={gbIdx / (gbStops.length - 1)}
                onT={(t) => setGb(gbStops[Math.round(t * (gbStops.length - 1))])}
                label="Storage"
                className="mt-4"
                fillClassName="bg-prism-yellow-300"
              />
            </div>
          </div>

          {/* result tile */}
          <div className="spectrum-border spectrum-border-on relative flex flex-col rounded-2xl border border-transparent bg-card p-7 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)] lg:col-span-2">
            <RoleKicker color="bg-prism-cyan-400">Your estimate</RoleKicker>
            <p className="mt-4 font-heading text-5xl font-medium tracking-tight text-foreground">
              {fmtUSD(best.total, best.total % 1 !== 0)}
              <span className="ml-1 text-lg font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-3 inline-flex w-fit rounded-full border border-foreground/[0.08] bg-card px-3 py-1 text-sm font-semibold text-foreground">
              {rec.custom ? "Custom — talk to us" : `${best.plan.name} plan`}
            </p>

            {/* contribution bar */}
            <div className="mt-7">
              <div className="flex h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
                {parts.map((p) => (
                  <div
                    key={p.label}
                    className={p.className}
                    style={{ width: `${(p.value / best.total) * 100}%` }}
                  />
                ))}
              </div>
              <dl className="mt-4 space-y-2">
                {parts.map((p) => (
                  <div key={p.label} className="flex items-center gap-2.5 text-sm">
                    <span aria-hidden className={cn("size-2 rounded-full", p.className)} />
                    <dt className="text-muted-foreground">{p.label}</dt>
                    <dd className="ml-auto font-mono tabular-nums text-foreground">
                      {fmtUSD(p.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-auto flex items-center gap-2.5 border-t border-foreground/[0.06] pt-5">
              <Shield className="size-4 shrink-0 text-prism-red-500" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hard spend limit, on by default — never a surprise bill.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
