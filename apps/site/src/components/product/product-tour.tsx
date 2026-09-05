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
  /** Distinguishes this tour's tab/panel ids from any other on the page. */
  id = "tour",
}: {
  stops: ProductTourStop[];
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [driving, setDriving] = useState(false);
  // Hovering holds the tour on its current stop. This is state, not a ref, so
  // the dwell bar unmounts with it — as a ref it kept tweening while the tour
  // stood still, so the bar sat full under a stop that wasn't advancing.
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keyed on `active` and `paused`, so the interval restarts whenever either
  // changes: dwell always measures from the moment the stop actually became
  // current, which is what the bar is drawing.
  useEffect(() => {
    if (reduce || driving || paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % stops.length), HOLD * 1000);
    return () => clearTimeout(id);
  }, [reduce, driving, paused, active, stops.length]);

  const select = (i: number) => {
    setActive(i);
    setDriving(true);
  };

  // Arrow keys are the only interaction the ARIA tabs pattern defines, so a
  // strip that announces itself as tabs has to honour them. Roving tabIndex
  // below keeps the strip a single tab stop, per the same pattern.
  const onTabKeyDown = (event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : event.key === "Home"
            ? -active
            : event.key === "End"
              ? stops.length - 1 - active
              : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + stops.length) % stops.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <figure
      className={cn(
        // one card: tab strip, stage and caption all live inside the same
        // frame, so the tour reads as a single instrument rather than three
        // loose pieces floating on the hero's background
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* The tab strip is the card's header — the tour's table of contents,
          and the fastest read of what the product actually does. It sits on a
          tinted track above the stage, the way a browser's tabs sit above the
          page; each stop then brings its own window chrome underneath. */}
      <div
        role="tablist"
        aria-label="Product tour"
        onKeyDown={onTabKeyDown}
        className="flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/40 px-2 py-2"
      >
        {stops.map(({ label }, i) => {
          const isActive = i === active;
          return (
            <button
              key={label}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-controls={`${id}-panel-${i}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "relative overflow-hidden rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-300 cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.07)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* dwell bar, so the strip reads as a tour in progress rather
                  than a control that changed on its own */}
              {isActive && !reduce && !driving && !paused ? (
                <motion.span
                  key={active}
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-prism-cyan-400"
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

      {/* The stage. Every stop is laid into the same single grid cell rather
          than absolutely positioned, so the frame takes the height of its
          TALLEST stop: the hero never reflows as the tour advances, and no
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
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
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

      {/* The caption closes the card, on the same tinted track as the tabs so
          the frame reads as top-and-tailed, and where it can't collide with
          the hero's ray the way it did when it floated outside the frame.
          Every caption is stacked into one grid cell, same trick as the stage
          above: a fixed min-height only holds until a caption wraps to an
          extra line at some viewport, whereas this is always exactly as tall
          as the longest one and never resizes the card mid-tour. */}
      <figcaption className="grid items-center border-t border-border/70 bg-muted/40 px-4 py-3 [&>*]:col-start-1 [&>*]:row-start-1">
        {stops.map(({ label, caption }, i) => (
          <span
            key={label}
            aria-hidden={i !== active}
            className={cn(
              "text-[0.875rem] leading-snug text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none",
              i === active ? "opacity-100" : "opacity-0",
            )}
          >
            {caption}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
