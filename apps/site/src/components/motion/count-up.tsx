"use client";

import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type CountUpProps = {
  /** e.g. "$0", "$19-39", "$2,800-3,400" — every digit run animates up. */
  value: string;
  className?: string;
  /** Only count while true; flip false→true to replay (default true). */
  active?: boolean;
  /** Seconds (default 1.1). */
  duration?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// Animates the numeric runs inside a price string up from zero while leaving
// the currency symbol, range dash, and thousands separators in place, and
// re-runs whenever `active` flips back on (used by the pricing carousel so each
// scenario counts as its tab is picked).
//
// The server render and the first client paint show the real figures, so
// crawlers, agents, and no-JS readers never see "$0-0". The counter only drops
// to zero while it is off screen, where the reset can't be seen, and counts up
// when it scrolls back in. A counter already on screen when the page loads
// keeps its figures rather than flashing to zero.
export function CountUp({ value, className, active = true, duration = 1.1 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const wasActive = useRef(active);

  // Split keeps the digit runs as separate tokens: "$2,800-3,400" ->
  // ["$", "2,800", "-", "3,400", ""]. Targets are parsed comma-free.
  const tokens = useMemo(() => value.split(/(\d[\d,]*)/), [value]);
  const targets = useMemo(
    () => tokens.map((t) => (/^\d[\d,]*$/.test(t) ? Number(t.replace(/,/g, "")) : null)),
    [tokens],
  );

  // A single 0→1 progress driver. Motion-value writes don't touch React state,
  // so resetting/animating inside the effect stays clear of set-state-in-effect.
  const progress = useMotionValue(1);
  const [rendered, setRendered] = useState(1);
  useMotionValueEvent(progress, "change", setRendered);

  useEffect(() => {
    const el = ref.current;
    const becameActive = active && !wasActive.current;
    wasActive.current = active;
    if (!el || reduceMotion || !active) {
      progress.set(1);
      return;
    }
    // A tab picked in the carousel counts from zero while it is in view.
    if (becameActive) progress.set(0);

    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        if (progress.get() < 1) controls = animate(progress, 1, { duration, ease: EASE });
      } else {
        controls?.stop();
        progress.set(0);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [active, value, duration, reduceMotion, progress]);

  return (
    <span ref={ref} className={className}>
      {tokens.map((token, i) => {
        const target = targets[i];
        if (target === null) return <span key={i}>{token}</span>;
        return (
          <span key={i} className="tabular-nums">
            {Math.round(rendered * target).toLocaleString("en-US")}
          </span>
        );
      })}
    </span>
  );
}
