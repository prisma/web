"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./_price-nudge.module.css";

// Delay after the card scrolls into view before the nudge plays, so the
// reader has a beat to take in the card first.
const START_DELAY_MS = 900;

/**
 * The Business price in the hero compliance card, with a one-time nudge:
 * each digit makes one slow odometer turn and lands back on itself, then a
 * thin cyan underline draws in under the price and stays.
 *
 * The first and last frames are identical, so the server-rendered price never
 * flashes or shifts on hydration. Reduced motion skips the turn and shows the
 * underline statically (see the CSS module).
 */
export function HipaaPriceNudge({ price, className }: { price: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timeoutId = window.setTimeout(() => setPlayed(true), START_DELAY_MS);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={cn(styles.price, played && styles.played, className)}
      aria-label={`$${price} a month`}
    >
      <span className={styles.glyph} aria-hidden>
        $
      </span>
      {[...price].map((char, i) => {
        const digit = Number(char);
        if (Number.isNaN(digit)) {
          return (
            <span key={i} className={styles.glyph} aria-hidden>
              {char}
            </span>
          );
        }
        // One full revolution that starts and ends on the same digit:
        // d, d+1, ..., 9, 0, ..., d (11 cells, 10 steps).
        const reel = Array.from({ length: 11 }, (_, step) => (digit + step) % 10);
        return (
          <span
            key={i}
            className={styles.digit}
            style={{ "--i": i } as React.CSSProperties}
            aria-hidden
          >
            <span className={styles.reel}>
              {reel.map((n, step) => (
                <span key={step}>{n}</span>
              ))}
            </span>
          </span>
        );
      })}
      <span className={styles.glyph} aria-hidden>
        /month
      </span>
      <span className={styles.underline} aria-hidden />
    </span>
  );
}
