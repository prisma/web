"use client";

import { useRef, useState } from "react";
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

const KEY_STEPS: Record<string, number> = {
  ArrowRight: 0.01,
  ArrowUp: 0.01,
  ArrowLeft: -0.01,
  ArrowDown: -0.01,
  PageUp: 0.1,
  PageDown: -0.1,
};

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
  /** Visible but inert: faded, not focusable, not draggable. */
  disabled?: boolean;
  /** Drawn over the track and fill but under the thumb (e.g. tick marks). */
  marks?: React.ReactNode;
  /** Spoken value (aria-valuetext). Without it, screen readers announce the
   *  raw 0–1000 position, which means nothing to anyone. */
  valueText?: string;
  /** The position the caller's value snaps to for a position t. When given,
   *  arrow and page keys keep stepping until the snapped value changes, so a
   *  keypress never lands back on the same value (review, 2026-11-24). */
  snap?: (t: number) => number;
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
  disabled = false,
  marks,
  valueText,
  snap,
}: RangeInputProps) {
  const pct = `${t * 100}%`;
  // Focus ring only when the slider is being driven from the keyboard. On a
  // range input, :focus-visible also matches after a mouse click in Chrome,
  // which left a heavy grey ring on the thumb after every drag.
  const [keyboard, setKeyboard] = useState(false);
  // Set on pointer down, so focus that a click brings shows no ring, while
  // focus that arrives any other way (Tab, held Tab, script) does.
  const pointer = useRef(false);
  // Arrows move 1% (10% with Shift), Page Up/Down 10%, Home/End the ends.
  // The native step here is 0.1%, which made keyboard use a crawl.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let next: number;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    else if (e.key in KEY_STEPS) {
      const step = KEY_STEPS[e.key] * (e.shiftKey ? 10 : 1);
      next = t + step;
      if (snap) {
        const from = snap(t);
        const dir = Math.sign(step) * 0.001;
        while (next > 0 && next < 1 && Math.abs(snap(next) - from) < 1e-9) next += dir;
      }
    } else return;
    e.preventDefault();
    setKeyboard(true);
    onT(Math.min(1, Math.max(0, next)));
  };
  // h-11 below md so the drag target clears the 44px touch minimum; the track
  // and thumb stay centred, so it looks identical at every width.
  return (
    <div
      className={cn(
        "group relative flex h-6 items-center transition-opacity max-md:h-11",
        disabled && "opacity-40",
        className,
      )}
    >
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
      {marks}
      <div
        aria-hidden
        className={cn(
          // The real <input> is transparent, so its keyboard focus has to show
          // on the drawn thumb — otherwise tabbing to a slider is invisible.
          "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(21,21,21,0.25)] transition-transform group-active:scale-110",
          thumbClassName,
          keyboard && "group-has-[input:focus]:ring-[3px] group-has-[input:focus]:ring-ring/50",
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
        aria-valuetext={valueText}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onFocus={() => setKeyboard(!pointer.current)}
        onPointerDown={() => {
          pointer.current = true;
          setKeyboard(false);
        }}
        onBlur={() => {
          pointer.current = false;
          setKeyboard(false);
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
    </div>
  );
}
