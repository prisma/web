"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { gbToT, opsToT, recommend, tToGB, tToOps, type Recommendation } from "./calc";

// One estimator state shared by every design option: operations + storage,
// preset jumps, and the live recommendation.
export function useEstimator(initialOps = 3_000_000, initialGB = 12) {
  const [opsT, setOpsT] = useState(opsToT(initialOps));
  const [gbT, setGbT] = useState(gbToT(initialGB));
  const ops = tToOps(opsT);
  const gb = tToGB(gbT);
  const rec: Recommendation = recommend(ops, gb);
  const setPreset = (presetOps: number, presetGB: number) => {
    setOpsT(opsToT(presetOps));
    setGbT(gbToT(presetGB));
  };
  return { ops, gb, opsT, gbT, setOpsT, setGbT, setPreset, rec };
}

type RangeInputProps = {
  /** Normalized position 0..1. */
  t: number;
  onT: (t: number) => void;
  label: string;
  /** Visible track (background). */
  trackClassName?: string;
  /** Filled portion, left of the thumb. Omit to skip the fill layer. */
  fillClassName?: string;
  fillStyle?: React.CSSProperties;
  thumbClassName?: string;
  className?: string;
};

// Headless range slider: a transparent native input drives an entirely
// custom-rendered track/fill/thumb, so each design option can skin it freely
// without fighting browser pseudo-elements. Keyboard + screen-reader behavior
// comes from the real <input>.
export function RangeInput({
  t,
  onT,
  label,
  trackClassName,
  fillClassName,
  fillStyle,
  thumbClassName,
  className,
}: RangeInputProps) {
  const pct = `${t * 100}%`;
  // h-11 below md so the drag target clears the 44px touch minimum; the track
  // and thumb stay centred, so it looks identical at every width.
  return (
    <div className={cn("group relative flex h-6 items-center max-md:h-11", className)}>
      <div className={cn("h-1.5 w-full rounded-full bg-black/[0.06]", trackClassName)} />
      {fillClassName !== undefined && (
        <div
          aria-hidden
          className={cn(
            "absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full",
            fillClassName,
          )}
          style={{ width: pct, ...fillStyle }}
        />
      )}
      <div
        aria-hidden
        className={cn(
          "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(21,21,21,0.25)] transition-transform group-active:scale-110",
          thumbClassName,
        )}
        style={{ left: pct }}
      />
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(t * 1000)}
        onChange={(e) => onT(Number(e.currentTarget.value) / 1000)}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
