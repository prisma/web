"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { prismBands } from "@/components/brand/prism-ray";
import { cn } from "@/lib/utils";

// Skeleton line with the loading shimmer (same idiom as the console abstraction).
function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block h-1.5 overflow-hidden rounded-full bg-foreground/10",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-line-shimmer bg-prism-cyan-400 motion-reduce:hidden"
      />
    </span>
  );
}

// A four-point sparkle.
function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 0 C12.6 7 12.6 7 24 12 C12.6 17 12.6 17 12 24 C11.4 17 11.4 17 0 12 C11.4 7 11.4 7 12 0 Z" />
    </svg>
  );
}

// Sparkle field around the chip — varied sizes, hues, and tempos so they
// twinkle out of sync (each has its own duration, so they never resync).
const SPARKLES = [
  { top: "0%", left: "58%", size: 15, color: "#ffffff", duration: 1.6, delay: 0 },
  {
    top: "16%",
    left: "90%",
    size: 10,
    color: "var(--color-prism-cyan-400)",
    duration: 1.9,
    delay: 0.5,
  },
  { top: "54%", left: "97%", size: 12, color: "#ffffff", duration: 1.4, delay: 1.1 },
  {
    top: "82%",
    left: "72%",
    size: 9,
    color: "var(--color-prism-yellow-300)",
    duration: 2.1,
    delay: 0.3,
  },
  { top: "42%", left: "44%", size: 8, color: "#ffffff", duration: 1.7, delay: 0.9 },
  {
    top: "6%",
    left: "82%",
    size: 8,
    color: "var(--color-prism-red-400)",
    duration: 1.5,
    delay: 1.5,
  },
  { top: "68%", left: "50%", size: 7, color: "#ffffff", duration: 2.0, delay: 0.2 },
];

const IN_VIEW = { margin: "0px 0px -20% 0px" } as const;

// Prisma Compute — versioned deployments, the newest live; the compute as a 3D
// chip that glows and sparkles, the brand ray masking in through it, the code
// lines loading and a caret blinking on `git push`.
export function ComputeIllustration() {
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
        className="absolute inset-0 bg-[url('/brand/feature-compute.jpg')] bg-cover bg-[position:20%_90%] [filter:saturate(1.45)_contrast(1.04)]"
      />
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_8px_24px_-12px_rgba(21,21,21,0.16)]">
        {/* brand ray masking in top-to-bottom through the chip */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-[70%] top-[53%] h-14 w-[170%] -translate-x-1/2 -translate-y-1/2 max-md:hidden",
            run && "animate-compute-ray",
          )}
          style={{
            rotate: "74deg",
            filter: "blur(1px)",
            opacity: reduce ? 0.85 : 0,
            background: prismBands(),
            WebkitMaskImage: "linear-gradient(to right, #000 0 45%, transparent 55%)",
            maskImage: "linear-gradient(to right, #000 0 45%, transparent 55%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "200% 100%",
            maskSize: "200% 100%",
          }}
        />

        <div className="relative flex items-center justify-between border-b border-border/70 px-3.5 py-2.5">
          <span className="font-mono text-[0.6875rem] text-primary">Deployments</span>
          <span className="flex items-center gap-1 rounded-full bg-prism-cyan-100 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-cyan-800">
            <span className="size-1 rounded-full bg-prism-cyan-400 animate-status-pulse motion-reduce:animate-none" />
            Live
          </span>
        </div>
        <div className="relative flex flex-1 flex-col justify-evenly px-3.5 py-1.5 font-mono text-[0.6875rem] text-primary">
          <p className="flex items-center gap-2.5 py-1">
            v12
            <Bar className="w-24" />
            <span className="size-1.5 rounded-full bg-prism-cyan-400 animate-status-pulse motion-reduce:animate-none" />
            <span className="text-prism-cyan-600">live</span>
          </p>
          <p className="flex w-fit items-center gap-1.5 rounded-md border border-border/70 bg-card px-2 py-1 text-[0.625rem] text-muted-foreground shadow-sm">
            <span className="size-1 rounded-full bg-prism-cyan-400" />
            pr-214.preview.prisma.app
          </p>
          <p className="flex items-center gap-2.5 py-1 text-muted-foreground">
            v11
            <Bar className="w-28" />
            <span className="text-[0.625rem] text-muted-foreground/70">2d</span>
          </p>
          <p className="flex items-center gap-2.5 py-1 text-muted-foreground">
            v10
            <Bar className="w-16" />
            <span className="text-[0.625rem] text-muted-foreground/70">1w</span>
          </p>
          <p className="flex items-center gap-2.5 py-1 text-muted-foreground">
            v9
            <Bar className="w-20" />
            <span className="text-[0.625rem] text-muted-foreground/70">3w</span>
          </p>
          <p className="flex items-center gap-3 py-1 text-[0.625rem] text-muted-foreground/80">
            <span>
              boot <span className="text-foreground/70">7ms</span>
            </span>
            <span>
              p50 <span className="text-foreground/70">3.8ms</span>
            </span>
            <Bar className="w-10" />
          </p>
        </div>
        <div className="relative flex items-center gap-2 border-t border-border/70 px-3.5 py-2.5 font-mono text-[0.625rem] text-primary">
          <span className="text-prism-cyan-600">$</span>
          git push
          <span
            aria-hidden
            className="inline-block h-3 w-[0.35rem] bg-prism-cyan-400 animate-caret-blink motion-reduce:animate-none"
          />
          <Bar className="ml-auto w-14" />
        </div>

        {/* the compute chip — glows and sparkles */}
        <div className="absolute left-[70%] top-[53%] w-40 -translate-x-1/2 -translate-y-1/2 max-md:hidden">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-[-18%] rounded-full"
            style={{
              background: "var(--paper)",
              filter: "blur(10px)",
            }}
            initial={false}
            animate={
              run
                ? { opacity: [0.3, 0.7, 0.3], scale: [0.92, 1.05, 0.92] }
                : { opacity: reduce ? 0.4 : 0 }
            }
            transition={
              run ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }
            }
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/cpu-3d.png"
            alt=""
            className="relative w-full drop-shadow-[0_20px_30px_rgba(21,21,21,0.24)]"
          />
          {!reduce &&
            SPARKLES.map((s, i) => (
              <motion.span
                key={i}
                className="absolute"
                style={{ top: s.top, left: s.left, color: s.color }}
                initial={false}
                animate={
                  run
                    ? { scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }
                    : { scale: 0, opacity: 0 }
                }
                transition={
                  run
                    ? {
                        duration: s.duration,
                        delay: s.delay,
                        repeat: Infinity,
                        repeatDelay: 0.7,
                        ease: "easeInOut",
                      }
                    : { duration: 0 }
                }
              >
                <Sparkle
                  className="drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
                  style={{ width: s.size, height: s.size }}
                />
              </motion.span>
            ))}
        </div>
      </div>
    </div>
  );
}
