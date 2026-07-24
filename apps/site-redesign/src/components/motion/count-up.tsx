"use client"

import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

type CountUpProps = {
  /** e.g. "$0", "$19-39", "$2,800-3,400" — every digit run animates up. */
  value: string
  className?: string
  /** Only count while true; flip false→true to replay (default true). */
  active?: boolean
  /** Seconds (default 1.1). */
  duration?: number
}

// Animates the numeric runs inside a price string up from zero while leaving
// the currency symbol, range dash, and thousands separators in place. Holds at
// zero until it scrolls into view, and re-runs whenever `active` flips back on
// (used by the pricing carousel so each scenario counts as its tab is picked).
export function CountUp({ value, className, active = true, duration = 1.1 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, margin: "0px 0px -15% 0px" })
  const reduceMotion = useReducedMotion()

  // Split keeps the digit runs as separate tokens: "$2,800-3,400" ->
  // ["$", "2,800", "-", "3,400", ""]. Targets are parsed comma-free.
  const tokens = useMemo(() => value.split(/(\d[\d,]*)/), [value])
  const targets = useMemo(
    () => tokens.map((t) => (/^\d[\d,]*$/.test(t) ? Number(t.replace(/,/g, "")) : null)),
    [tokens],
  )

  // A single 0→1 progress driver. Motion-value writes don't touch React state,
  // so resetting/animating inside the effect stays clear of set-state-in-effect.
  const progress = useMotionValue(active && !reduceMotion ? 0 : 1)
  const [rendered, setRendered] = useState(() => progress.get())
  useMotionValueEvent(progress, "change", setRendered)

  useEffect(() => {
    if (reduceMotion || !active) {
      progress.set(1)
      return
    }
    if (!inView) {
      progress.set(0)
      return
    }
    progress.set(0)
    const controls = animate(progress, 1, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [active, inView, value, duration, reduceMotion, progress])

  return (
    <span ref={ref} className={className}>
      {tokens.map((token, i) => {
        const target = targets[i]
        if (target === null) return <span key={i}>{token}</span>
        return (
          <span key={i} className="tabular-nums">
            {Math.round(rendered * target).toLocaleString("en-US")}
          </span>
        )
      })}
    </span>
  )
}
