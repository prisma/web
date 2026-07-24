"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Copy } from "@/components/icons/forma"

const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)"

// Shatter lines radiating from one impact point (120,70). Ordered main cracks
// first, then the short secondary splinters — so they draw in that sequence.
const CRACKS = [
  "120,70 44,22 0,10",
  "120,70 188,20 244,0",
  "120,70 62,128 22,204 8,240",
  "120,70 172,122 232,182 262,240",
  "120,70 208,88 320,108",
  "120,70 92,158 74,240",
  "120,70 24,88 0,96",
  "120,70 148,34 168,0",
  "82,46 98,60",
  "158,46 148,62",
  "162,108 178,94",
  "86,104 102,88",
  "140,140 158,150",
]

// Start the loop only once the card is actually on screen; re-arm when it
// leaves so it replays fresh on the next visit.
const IN_VIEW = { margin: "0px 0px -20% 0px" } as const

// "Before" — the glass breaks into its shattered state, holds, heals, and
// re-breaks, looping while the card is in view.
export function BrokenCard() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, IN_VIEW)
  const run = inView && !reduce

  return (
    <div ref={ref} aria-hidden className="relative mx-auto mt-10 w-full max-w-sm flex-none select-none">
      <span className="absolute -top-3 right-5 z-10 flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[0.625rem] font-semibold text-muted-foreground shadow-sm">
        <span className="size-1.5 rounded-full bg-foreground/25" />3 dashboards open
      </span>
      <motion.div
        className="relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-5 shadow-[0_1px_2px_rgba(21,21,21,0.03),0_12px_24px_-12px_rgba(21,21,21,0.08)]"
        initial={false}
        animate={run ? { x: [0, -3.5, 3, -2, 1.5, 0, 0] } : { x: 0 }}
        transition={
          run
            ? { duration: 2.8, times: [0, 0.03, 0.06, 0.09, 0.12, 0.16, 1], repeat: Infinity, repeatDelay: 1 }
            : { duration: 0 }
        }
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full text-foreground/25"
          viewBox="0 0 320 240"
          preserveAspectRatio="none"
          fill="none"
        >
          {CRACKS.map((points, i) => (
            <motion.polyline
              key={points}
              points={points}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={
                reduce
                  ? { pathLength: 1, opacity: 1 }
                  : run
                    ? { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
                    : { pathLength: 0, opacity: 0 }
              }
              transition={
                run
                  ? {
                      duration: 2.8,
                      // draw fast (slight per-line propagation), hold, then heal
                      times: [0, 0.08 + i * 0.01, 0.75, 0.92],
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 1,
                    }
                  : { duration: 0 }
              }
            />
          ))}
        </svg>
        <p className="text-center font-heading text-[0.9375rem] leading-snug text-muted-foreground">
          Wire up your stack
        </p>
        <div className="mt-4 flex flex-col gap-1.5">
          <span className="block truncate rounded-md border border-border/80 bg-muted/60 px-3 py-2 font-mono text-[0.625rem] text-muted-foreground/70">
            DATABASE_URL=postgres://…
          </span>
          <span className="block truncate rounded-md border border-border/80 bg-muted/60 px-3 py-2 font-mono text-[0.625rem] text-muted-foreground/60">
            # paste into your hosting dashboard
          </span>
        </div>
        <span className="mt-4 flex h-9 items-center justify-center rounded-full bg-foreground/10 text-[0.75rem] font-semibold text-muted-foreground">
          Redeploy
        </span>
      </motion.div>
    </div>
  )
}

// A small arrow cursor.
function Cursor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5 3 L5 19 L9 15 L11.5 20.5 L14 19.3 L11.5 14 L17.5 14 Z"
        fill="white"
        stroke="#151515"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// "After" — a cursor glides in and clicks "Deploy preview", looping while the
// card is in view; the button presses in as the click lands.
export function LiveCard() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, IN_VIEW)
  const run = inView && !reduce

  return (
    <div ref={ref} aria-hidden className="relative mx-auto mt-10 w-full max-w-sm flex-none select-none">
      <span className="absolute -top-3 right-5 z-10 flex items-center gap-1.5 rounded-full border border-prism-cyan-200 bg-prism-cyan-50 px-2.5 py-1 text-[0.625rem] font-semibold text-prism-cyan-800 shadow-sm">
        <span className="size-1.5 rounded-full bg-prism-cyan-400" />
        Database ready
      </span>
      <div
        aria-hidden
        className="absolute -inset-1 rounded-[1.25rem] opacity-20 blur-[18px]"
        style={{ backgroundImage: SPECTRUM }}
      />
      <div className="relative flex min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_16px_32px_-12px_rgba(21,21,21,0.12)]">
        <p className="text-center font-heading text-[0.9375rem] leading-snug text-foreground">
          Preview for{" "}
          <span className="whitespace-nowrap rounded-md bg-prism-cyan-100 px-1.5 py-0.5 font-sans text-[0.8125rem] font-semibold text-prism-cyan-800">
            storefront
          </span>{" "}
          on{" "}
          <span className="whitespace-nowrap rounded-md bg-prism-cyan-100 px-1.5 py-0.5 font-sans text-[0.8125rem] font-semibold text-prism-cyan-800">
            feature/checkout
          </span>
        </p>
        <span className="mt-4 flex items-center gap-2 rounded-md border border-border/80 bg-muted/60 px-3 py-2 font-mono text-[0.625rem] text-muted-foreground">
          <span className="text-prism-cyan-600">$</span>
          bunx @prisma/cli app deploy
          <Copy className="ml-auto size-3 shrink-0 text-muted-foreground/50" aria-hidden />
        </span>
        <motion.span
          className="relative mt-4 block"
          initial={false}
          animate={run ? { scale: [1, 1, 0.955, 1, 1] } : { scale: 1 }}
          transition={
            run
              ? { duration: 2.6, times: [0, 0.62, 0.68, 0.78, 1], ease: "easeOut", repeat: Infinity, repeatDelay: 1.4 }
              : { duration: 0 }
          }
        >
          <span
            aria-hidden
            className="absolute -inset-0.5 rounded-full opacity-70 blur-[3px]"
            style={{ backgroundImage: SPECTRUM }}
          />
          <span className="relative flex h-9 items-center justify-center rounded-full bg-primary text-[0.75rem] font-semibold text-primary-foreground">
            Deploy preview
          </span>
        </motion.span>

        {!reduce && (
          <motion.div
            className="pointer-events-none absolute bottom-[1.9rem] left-1/2 z-20"
            initial={false}
            animate={
              run
                ? {
                    opacity: [0, 1, 1, 1, 1, 0],
                    x: [52, 10, 0, 0, 0, 0],
                    y: [46, 8, 0, 0, 0, 0],
                    scale: [1, 1, 1, 0.85, 1, 1],
                  }
                : { opacity: 0, x: 52, y: 46, scale: 1 }
            }
            transition={
              run
                ? {
                    duration: 2.6,
                    times: [0, 0.42, 0.6, 0.68, 0.82, 1],
                    ease: [0.4, 0, 0.2, 1],
                    repeat: Infinity,
                    repeatDelay: 1.4,
                  }
                : { duration: 0.2 }
            }
          >
            <Cursor className="h-5 w-5 drop-shadow-[0_2px_3px_rgba(21,21,21,0.35)]" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
