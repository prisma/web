"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

// Skeleton line — matches stack-bento's Bar.
function Bar({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 rounded-full bg-foreground/10", className)} />
}

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

const IN_VIEW = { margin: "0px 0px -20% 0px" } as const

// Prisma ORM — the type-safe query surface: an editor with the client's typed
// autocomplete. On scroll-in it loops: the dropdown drops down, a cursor glides
// in and hovers an option (the highlight follows), then the cursor retreats and
// the dropdown closes. The schema stack (3D) floats gently throughout.
export function OrmIllustration() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, IN_VIEW)
  const run = inView && !reduce

  // one shared clock so the cursor, highlight and dropdown stay in step
  const CYCLE = { duration: 4.2, repeat: Infinity, repeatDelay: 0.8 } as const

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative flex h-full min-h-[15rem] select-none items-center justify-center overflow-hidden p-8"
    >
      {/* ray backdrop — saturation boosted (bold pass) on its own layer so the
          filter doesn't touch the card content */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/brand/feature-orm.jpg')] bg-cover bg-[position:0%_65%] [filter:saturate(1.45)_contrast(1.04)]"
      />
      <div className="relative flex h-full w-full flex-col rounded-xl border border-border bg-card shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)]">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-1.5 font-mono text-xs text-black">app.ts</span>
        </div>
        <div className="flex flex-1 flex-col justify-between px-4 py-4 font-mono text-xs leading-none text-black">
          <div>
            <p className="flex items-center gap-2">
              <span className="text-prism-cyan-600">import</span> <Bar className="w-16" />{" "}
              <span className="text-prism-cyan-600">from</span> <Bar className="w-24 bg-prism-cyan-100" />
            </p>
            <p className="mt-4 flex items-center gap-2">
              <span className="text-prism-cyan-600">const</span> users ={" "}
              <span className="text-prism-cyan-600">await</span>
            </p>
            <p className="mt-3">db.user.findMany(</p>

            {/* autocomplete — wrapper keeps layout stable while the popup
                itself scales open/closed (transform, so nothing reflows) */}
            <div className="relative ml-9 mt-2.5 w-48">
              <motion.div
                className="relative w-full origin-top rounded-lg border border-border bg-card py-1.5 shadow-[0_12px_28px_-10px_rgba(21,21,21,0.22)]"
                initial={false}
                animate={
                  reduce
                    ? { scaleY: 1, opacity: 1 }
                    : run
                      ? { scaleY: [0, 1, 1, 0, 0], opacity: [0, 1, 1, 0, 0] }
                      : { scaleY: 0, opacity: 0 }
                }
                transition={run ? { ...CYCLE, times: [0, 0.12, 0.82, 0.95, 1], ease: "easeOut" } : { duration: 0 }}
              >
                {/* selection highlight — follows the cursor to the hovered row */}
                <motion.span
                  aria-hidden
                  className="absolute inset-x-1 top-1.5 h-6 rounded bg-prism-cyan-50"
                  initial={false}
                  animate={run ? { y: [0, 0, 24, 24, 0] } : { y: 0 }}
                  transition={run ? { ...CYCLE, times: [0, 0.32, 0.42, 0.72, 0.82], ease: "easeInOut" } : { duration: 0 }}
                />
                <p className="relative flex items-center gap-2 px-3 py-1.5">
                  where <Bar className="ml-auto w-12" />
                </p>
                <p className="relative flex items-center gap-2 px-3 py-1.5">
                  select <Bar className="ml-auto w-9" />
                </p>
                <p className="relative flex items-center gap-2 px-3 py-1.5">
                  include <Bar className="ml-auto w-10" />
                </p>
              </motion.div>

              {!reduce && (
                <motion.div
                  className="pointer-events-none absolute left-[2.5rem] top-[2.1rem] z-20"
                  initial={false}
                  animate={
                    run
                      ? { opacity: [0, 0, 1, 1, 0], x: [38, 38, 0, 0, 26], y: [40, 40, 0, 0, 26] }
                      : { opacity: 0, x: 38, y: 40 }
                  }
                  transition={run ? { ...CYCLE, times: [0, 0.12, 0.34, 0.74, 0.86], ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
                >
                  <Cursor className="h-5 w-5 drop-shadow-[0_2px_3px_rgba(21,21,21,0.35)]" />
                </motion.div>
              )}
            </div>

            <p className="mt-3">)</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <p className="flex items-center gap-2">
                <span className="text-prism-cyan-600">for</span> <Bar className="w-8" />{" "}
                <span className="text-prism-cyan-600">of</span> users {"{"}
              </p>
              <p className="flex items-center gap-2 pl-4">
                <Bar className="w-20" /> <Bar className="w-12 bg-prism-red-100" />
              </p>
              <p className="flex items-center gap-2 pl-4">
                <Bar className="w-14" /> <Bar className="w-24" />
              </p>
              <p>{"}"}</p>
            </div>
          </div>
          <p className="flex items-center gap-2 border-t border-border/60 pt-3 text-[0.6875rem] text-black">
            <span className="size-1.5 rounded-full bg-prism-cyan-400" />
            users: User[]
            <Bar className="ml-auto w-14" />
          </p>
        </div>
        {/* the schema stack — floats gently over the editor's right half */}
        <motion.img
          src="/brand/cards-3d.png"
          alt=""
          className="absolute right-4 top-[46%] w-52 -translate-y-1/2 drop-shadow-[0_18px_26px_rgba(21,21,21,0.24)] max-md:hidden"
          initial={false}
          animate={run ? { y: [0, -9, 0], rotate: [0, -1.6, 0] } : { y: 0, rotate: 0 }}
          transition={run ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
      </div>
    </div>
  )
}
