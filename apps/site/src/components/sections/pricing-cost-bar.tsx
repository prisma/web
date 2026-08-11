"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const TRACK = "h-2 w-full overflow-hidden rounded-full bg-foreground/[0.07]";

// The monthly cost drawn to length, so the gap between the stacks is something
// you see before you read it. Scales from the left edge with a transform rather
// than animating width, which keeps it off the layout path.
//
// A null fraction is not zero — it means we have no figure for that column yet,
// and renders as a dashed empty track so it reads as "pending" rather than
// "free". Same distinction the spec table draws between TBC and an em dash.
export function CostBar({ fraction, spectrum = false, delay = 0, className }: CostBarProps) {
  const reduceMotion = useReducedMotion();

  if (fraction === null) {
    return (
      <div
        className={cn(
          "h-2 w-full rounded-full border border-dashed border-black/15 bg-transparent",
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
    <div className={cn(TRACK, className)} aria-hidden>
      <motion.div
        className="h-full w-full origin-left rounded-full"
        style={fill}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: fraction }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  );
}
