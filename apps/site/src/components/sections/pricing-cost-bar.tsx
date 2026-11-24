"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

type CostBarProps = {
  /** Share of the widest bar in the row, 0–1. Null renders an empty track. */
  fraction: number | null;
  /** Spectrum fill for Prisma; flat graphite for the alternatives. */
  spectrum?: boolean;
  /** Seconds, to stagger with the surrounding Reveals. */
  delay?: number;
  className?: string;
};

// 3px: a fine line, not a bar (client, 2026-11-24: "make it finer").
const TRACK = "h-[3px] w-full overflow-hidden rounded-full bg-foreground/[0.07]";

// The monthly cost drawn to length, so the gap between the stacks is something
// you see before you read it. Scales from the left edge with a transform rather
// than animating width, which keeps it off the layout path.
//
// A null fraction is not zero — it means we have no figure for that column yet,
// and renders as a dashed empty track so it reads as "pending" rather than
// "free". No column currently passes null; the branch exists so a future
// comparison column can be added before its figures land.
export function CostBar({ fraction, spectrum = false, delay = 0, className }: CostBarProps) {
  const reduceMotion = useReducedMotion();
  // Watch the full-width track, not the bar. The bar starts at scaleX(0), a
  // zero-width box, and an IntersectionObserver doesn't reliably report a
  // zero-area target as visible, so `whileInView` on the bar left some bars
  // empty for good (client, 2026-11-22: "the bars aren't loading").
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, margin: "0px 0px -15% 0px" });

  if (fraction === null) {
    return (
      <div
        className={cn(
          "h-[3px] w-full rounded-full border-t border-dashed border-black/15 bg-transparent",
          className,
        )}
        aria-hidden
      />
    );
  }

  const fill: React.CSSProperties = spectrum
    ? { backgroundImage: SPECTRUM }
    : { backgroundColor: "color-mix(in srgb, var(--foreground) 28%, transparent)" };

  if (reduceMotion) {
    return (
      <div className={cn(TRACK, className)} aria-hidden>
        <div
          className="h-full rounded-full"
          style={{ ...fill, width: `${Math.round(fraction * 100)}%` }}
        />
      </div>
    );
  }

  return (
    <div ref={trackRef} className={cn(TRACK, className)} aria-hidden>
      <motion.div
        className="h-full w-full origin-left rounded-full"
        style={fill}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? fraction : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  );
}
