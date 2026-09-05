"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { GitBranch } from "@/components/icons/forma";
import { PrismRay } from "@/components/brand/prism-ray";
import { cn } from "@/lib/utils";

// Free per-branch databases wired to hosting previews, single-digit ms boots.
// Each glows in its own brand hue when the boot sweep reaches it.
const BRANCHES = [
  {
    name: "main",
    status: "primary",
    color: "text-prism-cyan-600",
    glow: "var(--color-prism-cyan-100)",
  },
  {
    name: "pr-214",
    status: "preview",
    color: "text-prism-yellow-600",
    glow: "var(--color-prism-yellow-100)",
  },
  {
    name: "feat-auth",
    status: "booted 7ms",
    color: "text-prism-red-500",
    glow: "var(--color-prism-red-100)",
  },
];

const IN_VIEW = { margin: "0px 0px -20% 0px" } as const;

// Prisma Postgres — the database as a 3D object. On scroll-in it comes alive:
// the database floats, the brand ray breathes light through it, a boot pulse
// sweeps across the branch strip (main → pr-214 → feat-auth, the story of a
// preview branch spinning up), and the "Live" dot breathes.
export function PostgresIllustration() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, IN_VIEW);
  const run = inView && !reduce;

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative flex min-h-[22rem] select-none items-stretch justify-center overflow-hidden p-8 lg:min-h-full"
    >
      {/* ray backdrop — saturation boosted (bold pass) on its own layer so the
          filter doesn't touch the card content */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/brand/feature-postgres.jpg')] bg-cover bg-[position:50%_55%] [filter:saturate(1.45)_contrast(1.04)]"
      />
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_8px_24px_-12px_rgba(21,21,21,0.16)]">
        <div className="relative flex items-center justify-between px-4 pt-3 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-primary">
          <span>Prisma Postgres · us-west-1</span>
          <span className="flex items-center gap-1.5">
            <motion.span
              className="size-1.5 rounded-full bg-prism-cyan-400"
              initial={false}
              animate={
                run ? { opacity: [1, 0.35, 1], scale: [1, 0.8, 1] } : { opacity: 1, scale: 1 }
              }
              transition={
                run ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }
              }
            />
            Live
          </span>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-2">
          {/* the brand ray through the database — breathes light on a loop */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-[130%] -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={run ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={
              run ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }
            }
          >
            <PrismRay className="inset-0 h-full w-full" intensity="hero" mask="none" />
          </motion.div>
          {/* the database itself — floats gently */}
          <motion.img
            src="/brand/database-3d.png"
            alt=""
            className="relative w-36 drop-shadow-[0_18px_28px_rgba(21,21,21,0.22)]"
            initial={false}
            animate={run ? { y: [0, -8, 0], rotate: [0, 1.5, 0] } : { y: 0, rotate: 0 }}
            transition={
              run ? { duration: 4.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }
            }
          />
        </div>

        <div className="relative grid grid-cols-3 divide-x divide-border/70 border-t border-border/70 py-2.5 font-mono text-[0.625rem]">
          {/* boot glow — each branch lights up in its hue, one at a time,
              handing off smoothly to the next (cyan → yellow → red) */}
          {BRANCHES.map(({ name, status, color, glow }, i) => (
            <div key={name} className="relative flex flex-col items-center gap-0.5">
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -inset-y-2.5"
                  style={{ backgroundColor: glow }}
                  initial={false}
                  animate={run ? { opacity: [0, 0, 1, 0, 0] } : { opacity: 0 }}
                  transition={
                    run
                      ? {
                          duration: 4.5,
                          times: [0, 0.06 + i * 0.24, 0.18 + i * 0.24, 0.3 + i * 0.24, 1],
                          repeat: Infinity,
                          repeatDelay: 0.6,
                          ease: "easeInOut",
                        }
                      : { duration: 0 }
                  }
                />
              )}
              <span className={cn("relative flex items-center gap-1", color)}>
                <GitBranch className="size-3" />
                {name}
              </span>
              <span className="relative text-muted-foreground">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
