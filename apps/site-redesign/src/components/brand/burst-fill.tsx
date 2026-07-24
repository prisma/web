"use client"

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { useEffect, useState } from "react"
import PrismaticBurst from "@/components/brand/prismatic-burst"

const PRISM_COLORS = ["#01d7e4", "#f3c306", "#f37a03", "#f43531", "#f00e5c", "#ffffff"]

// The brand's signature hover fill: a prismatic burst erupting from the
// centre via a feathered radial reveal. Mounts the WebGL canvas only while
// active (plus the fade-out) so idle buttons don't hold GL contexts.
export function BurstFill({ on }: { on: boolean }) {
  const [present, setPresent] = useState(false)
  useEffect(() => {
    if (on) {
      setPresent(true)
      return
    }
    const t = setTimeout(() => setPresent(false), 700)
    return () => clearTimeout(t)
  }, [on])

  // Drive the burst's radial reveal via a numeric motion value, fed into a
  // soft-edged radial-gradient mask (feathered, so no hard circle edge).
  const reveal = useMotionValue(0)
  const maskOuter = useTransform(reveal, (v) => v + 32)
  const maskImage = useMotionTemplate`radial-gradient(circle at 50% 50%, #000 ${reveal}%, rgba(0,0,0,0) ${maskOuter}%)`
  useEffect(() => {
    // Always restart the reveal from 0 on hover-in so the build-in plays every
    // time (otherwise a leftover value makes it pop in instantly).
    if (on) reveal.set(0)
    const controls = animate(reveal, on ? 100 : 0, {
      duration: on ? 2.0 : 0.6,
      ease: on ? [0.22, 1, 0.36, 1] : "easeIn",
    })
    return () => controls.stop()
  }, [on, reveal])

  if (!present) return null

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 block"
      style={{ maskImage, WebkitMaskImage: maskImage }}
      initial={{ opacity: 0 }}
      animate={{ opacity: on ? 0.5 : 0 }}
      transition={{ opacity: { duration: 0.12, ease: "easeOut" } }}
    >
      <PrismaticBurst
        animationType="rotate3d"
        intensity={3.2}
        speed={0.7}
        distort={1.4}
        rayCount={0}
        paused={!on}
        mixBlendMode="lighten"
        colors={PRISM_COLORS}
      />
    </motion.span>
  )
}
