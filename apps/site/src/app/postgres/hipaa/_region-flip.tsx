"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// USA Prisma Postgres regions only (see /postgres/hipaa copy + FAQ).
const US_REGIONS = ["us-east-1", "us-west-1"] as const;

/**
 * Subtle crossfade through US regions every 2s. Static under reduced motion.
 */
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
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % US_REGIONS.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const current = US_REGIONS[index] ?? US_REGIONS[0];

  if (reduceMotion) {
    return <span className={cn("font-mono", className)}>{US_REGIONS[0]}</span>;
  }

  return (
    <span
      className={cn("relative inline-grid font-mono", className)}
      aria-live="off"
    >
      {/* Invisible sizer so the row width stays stable across flips. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {US_REGIONS.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      {US_REGIONS.map((region, i) => (
        <span
          key={region}
          className={cn(
            "col-start-1 row-start-1 text-right transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            i === index
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-1 opacity-0",
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
