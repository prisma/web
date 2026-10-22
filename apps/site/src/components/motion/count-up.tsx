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

// Count once the figure is comfortably on screen (15% above the bottom
// edge), not the moment its top edge appears.
const ROOT_MARGIN = "0px 0px -15% 0px";

const DIGIT_RUN = /(\d[\d,]*)/;

/**
 * The text runs a CountUp renders at a given progress (0 = start, 1 = final).
 * Digit runs scale with progress; the currency symbol, range dash and
 * thousands separators stay in place. At progress 1 the joined runs equal
 * `value` (digit runs re-formatted as en-US numbers).
 */
export function countUpTokens(value: string, progress: number): string[] {
  // "$2,800-3,400" -> ["$", "2,800", "-", "3,400", ""]
  return value.split(DIGIT_RUN).map((token, i) => {
    if (i % 2 === 0) return token;
    const target = Number(token.replace(/,/g, ""));
    return Math.round(progress * target).toLocaleString("en-US");
  });
}

// Animates the numeric runs inside a price string up from zero.
//
// The server render and the first client render always show the final value,
// so the HTML that crawlers and no-JS readers get carries the real price, and
// hydration matches it. The count-up is a client-only enhancement on top:
//  - a figure that is off screen once the page is interactive is reset to zero
//    while out of view and counts up when it scrolls in;
//  - a figure already visible on load stays put (no flash to zero);
//  - flipping `active` back on replays it (the pricing carousel uses this so
//    each scenario counts as its tab is picked: the incoming slide is clipped
//    out of view when the tab changes, then counts as it slides in);
//  - with prefers-reduced-motion it never animates.
export function CountUp({ value, className, active = true, duration = 1.1 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  // Motion-value writes don't touch React state, so resetting and animating
  // inside the effect stays clear of set-state-in-effect.
  const progress = useMotionValue(1);
  const [rendered, setRendered] = useState(1);
  useMotionValueEvent(progress, "change", setRendered);

  // null until the observer's first report, so an unknown position is never
  // treated as "off screen" (which would reset a visible figure to zero).
  const [inView, setInView] = useState<boolean | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setInView(entry.isIntersecting);
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !active || inView === null) {
      progress.set(1);
      return;
    }
    if (!inView) {
      progress.set(0);
      return;
    }
    if (progress.get() >= 1) return;
    const controls = animate(progress, 1, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [active, inView, duration, reduceMotion, progress]);

  const tokens = useMemo(() => countUpTokens(value, rendered), [value, rendered]);

  return (
    <span ref={ref} className={className}>
      {tokens.map((token, i) =>
        i % 2 === 1 ? (
          <span key={i} className="tabular-nums">
            {token}
          </span>
        ) : (
          <span key={i}>{token}</span>
        ),
      )}
    </span>
  );
}
