"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Delay in seconds — stagger a row of siblings by passing index * 0.1. */
  delay?: number
  /** Vertical travel distance in px (default 44). */
  y?: number
  /** Replay every time it re-enters the viewport instead of once (default false). */
  repeat?: boolean
}

// Baseline scroll-reveal used across the homepage. Each instance observes its
// own entry into the viewport, so elements animate as they actually scroll on
// screen (rather than a whole tall section firing off its top edge). Fade +
// rise, clearly visible, triggered once. Respects prefers-reduced-motion.
//
// Pass `className` to make the Reveal *be* the layout element (grid/flex cell)
// so wrapping never changes the box model; pass none to wrap neutrally.
export function Reveal({
  children,
  className,
  delay = 0,
  y = 44,
  repeat = false,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
