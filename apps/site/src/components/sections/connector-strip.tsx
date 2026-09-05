"use client";

import { useEffect, useRef } from "react";
import { Swap } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

function FileChip({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-border/70 bg-card px-2 py-1 font-mono text-[0.8125rem] text-foreground shadow-sm">
      {children}
    </code>
  );
}

// Full-width connector between rows: the file that ties the neighbors
// together, piped into both. Behaves like a timeline — each line segment
// fills with the product-color gradient exactly as the reading line
// (60% of the viewport) passes through it, so the fill flows continuously
// through every connector as you scroll. Driven by a scroll handler rather
// than CSS scroll timelines for cross-browser consistency.
export function ConnectorStrip({
  file,
  caption,
  color,
}: {
  file: string;
  caption: string;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fills = el.querySelectorAll<HTMLElement>("[data-fill]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    let raf = 0;
    const tick = () => {
      const focus = window.innerHeight * 0.6;
      // progress of the reading line through the whole strip (plus a lead-in
      // margin so the draw starts just before the strip reaches the line);
      // top segment fills through the first half, bottom through the second
      const r = el.getBoundingClientRect();
      const lead = 80;
      const p = (focus - (r.top - lead)) / (r.height + lead * 2);
      fills.forEach((f, i) => {
        f.style.transform = `scaleY(${clamp(p * 2 - i)})`;
      });
      raf = 0;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-3 text-center">
      <span aria-hidden className="relative h-7 w-0.5 overflow-hidden rounded-full bg-border/70">
        <span data-fill className={cn("absolute inset-0 origin-top", color)} />
      </span>
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card shadow-[0_8px_20px_-8px_rgba(21,21,21,0.25)]">
          <Swap className="size-4 text-foreground/70" aria-hidden />
        </span>
        <FileChip>{file}</FileChip>
      </div>
      <em className="text-sm text-muted-foreground">{caption}</em>
      <span aria-hidden className="relative h-7 w-0.5 overflow-hidden rounded-full bg-border/70">
        <span data-fill className={cn("absolute inset-0 origin-top", color)} />
      </span>
    </div>
  );
}
