"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// USA Prisma Postgres regions only (see /postgres/hipaa copy + FAQ).
const US_REGIONS = ["us-east-1", "us-west-1"] as const;

/** Soft opacity crossfade through US regions. No vertical motion. */
export function HipaaRegionFlip({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    // 5s fully settled, then the ~1.8s opacity crossfade into the next region.
    const FADE_MS = 1800;
    const DWELL_MS = 5000;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % US_REGIONS.length);
    }, DWELL_MS + FADE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const current = US_REGIONS[index] ?? US_REGIONS[0];

  if (reduceMotion) {
    return <span className={cn("font-mono", className)}>{US_REGIONS[0]}</span>;
  }

  return (
    <span
      className={cn(
        // Fixed box: sizer sets height/width; layers absolute-overlay inside.
        "relative inline-block h-[1.25em] font-mono",
        className,
      )}
      aria-live="off"
    >
      <span className="invisible whitespace-nowrap" aria-hidden>
        {US_REGIONS.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      {US_REGIONS.map((region, i) => (
        <span
          key={region}
          className={cn(
            "absolute inset-y-0 right-0 whitespace-nowrap transition-opacity duration-[1800ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          {region}
        </span>
      ))}
      <span className="sr-only">{current}</span>
    </span>
  );
}
