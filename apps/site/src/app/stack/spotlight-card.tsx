"use client";

import { cn } from "@/lib/cn";
import { useRef, type ReactNode } from "react";
import styles from "./stack.module.css";

/**
 * A card with a pointer-tracked radial highlight (the React Bits "spotlight
 * card" pattern, restyled with Eclipse tokens). Purely decorative: the effect
 * only reacts to hover-capable pointers and is disabled under
 * prefers-reduced-motion, so keyboard and touch users lose nothing.
 */
export function SpotlightCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={cn(styles.spotlight, className)}>
      {children}
    </div>
  );
}
