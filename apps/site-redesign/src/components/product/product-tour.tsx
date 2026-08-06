"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRODUCT_ILLUSTRATIONS } from "./illustrations";
import type { ProductTourStop } from "./types";

// Seconds each stop holds before the tour advances.
const HOLD = 5;

// The hero's product tour: a tab strip over one panel that steps through the
// product doing a handful of real things. Review feedback was that the pages
// explained the product where the live site demonstrates it, so the hero
// visual is no longer a single still frame — it's the demo, and it sits in the
// first screen rather than in a section below it.
//
// Tabs are clickable, so a visitor can drive it; auto-advance stops for good
// once they do, and never starts under prefers-reduced-motion.
export function ProductTour({
  stops,
  className,
}: {
  stops: ProductTourStop[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [driving, setDriving] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    if (reduce || driving) return;
    const id = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % stops.length);
    }, HOLD * 1000);
    return () => clearInterval(id);
  }, [reduce, driving, stops.length]);

  return (
    <figure
      className={cn("flex h-full flex-col gap-3", className)}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      {/* tab strip — the tour's table of contents, and the fastest read of
          what the product actually does */}
      <div role="tablist" className="flex flex-wrap items-center gap-1.5">
        {stops.map(({ label }, i) => {
          const isActive = i === active;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(i);
                setDriving(true);
              }}
              className={cn(
                "relative overflow-hidden rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-300 cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.06),0_6px_16px_-8px_rgba(21,21,21,0.24)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* dwell bar, so the strip reads as a tour in progress rather
                  than a control that changed on its own */}
              {isActive && !reduce && !driving ? (
                <motion.span
                  key={active}
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-prism-cyan-400 via-prism-yellow-300 to-prism-red-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: HOLD, ease: "linear" }}
                />
              ) : null}
              {label}
            </button>
          );
        })}
      </div>

      {/* The caption sits above the panel, not below it: below, it landed on
          the hero's spectral bottom and the ray graphic, which made it hard to
          read. Fixed min-height so a one-line and a two-line caption don't
          shift the panel as the tour advances. */}
      <figcaption className="min-h-[2.75rem] max-w-[62ch] text-[0.9375rem] leading-snug text-muted-foreground">
        {stops[active].caption}
      </figcaption>

      {/* The panel itself. Every stop is laid into the same single grid cell
          rather than absolutely positioned, so the frame takes the height of
          its TALLEST stop: the hero never reflows as the tour advances, and no
          stop is clipped on mobile, where the narrower column makes the dense
          panels much taller than any fixed height would allow for. */}
      <div className="grid flex-1 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
        {stops.map(({ label, illustration }, i) => {
          const Illustration = PRODUCT_ILLUSTRATIONS[illustration];
          const isActive = i === active;
          return (
            <div
              key={label}
              role="tabpanel"
              aria-hidden={!isActive}
              className={cn(
                "transition-all duration-500 ease-out motion-reduce:transition-none",
                isActive ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
              )}
            >
              <Illustration />
            </div>
          );
        })}
      </div>
    </figure>
  );
}
