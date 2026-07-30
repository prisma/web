"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Reserved footprint for a 3D render. The homepage abstractions each float one
// over the card (see the schema stack in orm-illustration.tsx, /brand/cards-3d.png)
// — this holds that space and its motion while the product-page renders are
// still being made. Pass `src` once the asset exists and the placeholder
// disappears with no layout shift; everything else stays the same.
//
// Existing renders: /brand/cards-3d.png, /brand/cpu-3d.png, /brand/database-3d.png

const DRIFT = { y: [0, -9, 0], rotate: [0, -1.6, 0] };
const STILL = { y: 0, rotate: 0 };

export function ThreeDSlot({
  src,
  className,
  label = "3D element",
}: {
  /** Path to the render. Omit while it doesn't exist yet. */
  src?: string;
  className?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const animate = reduce ? STILL : DRIFT;
  const transition = reduce
    ? { duration: 0 }
    : { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const };

  if (src) {
    return (
      <motion.img
        src={src}
        alt=""
        aria-hidden
        className={cn("drop-shadow-[0_18px_26px_rgba(21,21,21,0.24)]", className)}
        initial={false}
        animate={animate}
        transition={transition}
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none", className)}
      initial={false}
      animate={animate}
      transition={transition}
    >
      <div className="flex size-full items-center justify-center rounded-2xl border border-dashed border-foreground/15 bg-white/50 backdrop-blur-[2px]">
        <span className="px-2 text-center text-[0.5625rem] font-semibold uppercase leading-tight tracking-[0.12em] text-muted-foreground/60">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
