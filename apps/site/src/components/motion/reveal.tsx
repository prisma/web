"use client";

import { motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds — stagger a row of siblings by passing index * 0.1. */
  delay?: number;
  /** Vertical travel distance in px (default 16; capped at 16). */
  y?: number;
  /** Replay every time it re-enters the viewport instead of once (default false). */
  repeat?: boolean;
};

// Baseline scroll-reveal used across the homepage. Each instance observes its
// own entry into the viewport, so elements animate as they actually scroll on
// screen (rather than a whole tall section firing off its top edge). Fade +
// rise, clearly visible, triggered once. Respects prefers-reduced-motion.
//
// Pass `className` to make the Reveal *be* the layout element (grid/flex cell)
// so wrapping never changes the box model; pass none to wrap neutrally.
//
// Quick on purpose (client, 2026-11-22: the page "loads as you scroll", make
// it "come a lot faster"): it starts the moment an element enters the
// viewport (was 20% up from the bottom), rises 16px over 0.3s (was 44px over
// 0.65s), and callers' stagger delays are scaled to 40%, so the existing
// `delay={0.25}`s become 0.1s without touching every caller.
const DELAY_SCALE = 0.4;

// Pages people scan to compare facts (pricing) should show everything at
// once, like Apple's buy pages: wrap them in <StaticReveals> and every Reveal
// inside renders as a plain element, already in place (client, 2026-11-22:
// the scroll-in "doesn't feel solid").
const StaticRevealContext = createContext(false);

export function StaticReveals({ children }: { children: ReactNode }) {
  return <StaticRevealContext.Provider value>{children}</StaticRevealContext.Provider>;
}
const MAX_TRAVEL = 16;

export function Reveal({ children, className, delay = 0, y = 16, repeat = false }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const isStatic = useContext(StaticRevealContext);

  if (reduceMotion || isStatic) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: Math.min(y, MAX_TRAVEL) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: delay * DELAY_SCALE }}
    >
      {children}
    </motion.div>
  );
}
