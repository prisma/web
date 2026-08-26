"use client";

import { useMemo } from "react";
import { Shield } from "@/components/icons/forma";
import { fmtGB, fmtOps, fmtUSD, PRESETS, recommend, tToOps } from "./calc";
import { RangeInput, useEstimator } from "./controls";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// Option B — "The Prism Dial". One monumental slider: usage passes through
// the spectrum, and the plan boundaries are marked right on the track, so
// dragging tells the whole pricing story in a single gesture.
export function VariantDial() {
  const { ops, gb, opsT, gbT, setOpsT, setGbT, setPreset, rec } = useEstimator();
  const { best } = rec;

  // Where the recommendation flips plans along the ops track (at current
  // storage) — rendered as labeled ticks.
  const breakpoints = useMemo(() => {
    const marks: { t: number; label: string }[] = [];
    let prev = recommend(tToOps(0), gb).best.plan.id;
    for (let i = 1; i <= 200; i++) {
      const t = i / 200;
      const id = recommend(tToOps(t), gb).best.plan.id;
      if (id !== prev) {
        marks.push({ t, label: recommend(tToOps(t), gb).best.plan.name });
        prev = id;
      }
    }
    return marks;
  }, [gb]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Pricing calculator
        </p>
        <h2 className="mt-3 text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Estimate usage before you upgrade
        </h2>
        <p className="mx-auto mt-5 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted-foreground">
          Estimate your usage before you upgrade, then set a spend limit so the bill can&apos;t
          surprise you. The calculator recommends the right plan for where you are.
        </p>

        {/* the number */}
        <div className="mt-12 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2">
          <p className="font-heading text-[clamp(3.25rem,8vw,5.5rem)] font-medium leading-none tracking-tight text-foreground">
            {fmtUSD(best.total, best.total % 1 !== 0)}
          </p>
          <div className="text-left">
            <p className="text-lg text-muted-foreground">/month</p>
            <p className="mt-0.5 inline-flex rounded-full border border-black/[0.08] bg-card px-3 py-0.5 text-sm font-semibold text-foreground">
              {rec.custom ? "Talk to us" : `${best.plan.name} plan`}
            </p>
          </div>
        </div>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          {fmtUSD(best.plan.base, false)} base
          {best.opsOverage > 0 && ` + ${fmtUSD(best.opsOverage)} operations`}
          {best.storageOverage > 0 && ` + ${fmtUSD(best.storageOverage)} storage`}
          {" · "}
          <Shield className="inline size-3.5 -translate-y-px text-prism-red-500" aria-hidden />{" "}
          spend limit on
        </p>

        {/* the dial */}
        <div className="mt-14">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-foreground">Operations per month</p>
            <p className="font-mono text-sm tabular-nums text-foreground">{fmtOps(ops)}</p>
          </div>
          <div className="relative mt-4">
            <div className="relative flex h-8 items-center">
              <div className="h-2.5 w-full rounded-full" style={{ backgroundImage: SPECTRUM }} />
              {/* veil over the not-yet-reached side */}
              <div
                aria-hidden
                className="absolute inset-y-[10px] right-0 rounded-r-full bg-white/75"
                style={{ width: `${(1 - opsT) * 100}%` }}
              />
              {/* plan boundaries */}
              {breakpoints.map((m) => (
                <div key={m.label} aria-hidden>
                  <div
                    className="absolute inset-y-0 w-px bg-foreground/25"
                    style={{ left: `${m.t * 100}%` }}
                  />
                  <span
                    className="absolute top-9 -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
                    style={{ left: `${m.t * 100}%` }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
              <div
                aria-hidden
                className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-white shadow-[0_2px_8px_rgba(21,21,21,0.35)]"
                style={{ left: `${opsT * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(opsT * 1000)}
                onChange={(e) => setOpsT(Number(e.currentTarget.value) / 1000)}
                aria-label="Operations per month"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>

        {/* storage, quiet */}
        <div className="mx-auto mt-16 max-w-md">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-foreground">Storage</p>
            <p className="font-mono text-sm tabular-nums text-foreground">{fmtGB(gb)}</p>
          </div>
          <RangeInput
            t={gbT}
            onT={setGbT}
            label="Storage"
            className="mt-3"
            fillClassName="bg-foreground/60"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.ops, p.gb)}
              className="rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              {p.label}
              <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                {fmtOps(p.ops)} ops
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
