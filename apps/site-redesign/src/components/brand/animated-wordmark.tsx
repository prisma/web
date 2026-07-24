"use client"

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from "framer-motion"

// Two halves of the designer's PrismaFooter.svg (identical 725×158 viewBox):
// the solid-black letters, and the colour layer (prism stripes struck through
// the letters + the trailing rays). Splitting them lets the black word stay
// put while only the colour animates in.
const BLACK = "/logo/prisma-footer-black.svg"
const COLOR = "/logo/prisma-footer-color.svg"

// Reveal timing (seconds): sweep in from the right, hold, retreat, pause.
const IN = 1.0
const HOLD = 4.5
const OUT = 1.0
const GAP = 1.2
const DUR = IN + HOLD + OUT

// Footer wordmark: solid-black "Prisma" always visible; the prism stripes and
// trailing rays are revealed on top by a clipPath that sweeps in from the
// right (rays first, then the colour fills the letters leftward), holds, and
// retreats — looping. Respects prefers-reduced-motion (colour shown in full).
export function AnimatedWordmark() {
  const reduce = useReducedMotion()

  return (
    <div className="relative w-full select-none" aria-hidden>
      {/* black letters — always visible */}
      <img src={BLACK} alt="" className="block w-full" draggable={false} />

      {/* colour (stripes + rays), clipped in from the right, looping */}
      <motion.img
        src={COLOR}
        alt=""
        className="absolute inset-0 block w-full"
        initial={{ clipPath: "inset(0 0 0 100%)" }}
        animate={{
          clipPath: reduce
            ? "inset(0 0 0 0%)"
            : [
                "inset(0 0 0 100%)",
                "inset(0 0 0 0%)",
                "inset(0 0 0 0%)",
                "inset(0 0 0 100%)",
              ],
        }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: DUR,
                times: [0, IN / DUR, (IN + HOLD) / DUR, 1],
                ease: [[0.22, 1, 0.36, 1], "linear", [0.5, 0, 0.9, 1]],
                repeat: Infinity,
                repeatDelay: GAP,
              }
        }
      />
    </div>
  )
}
