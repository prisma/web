"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type ScrollyStep = {
  id: string;
  title: string;
  body: ReactNode;
};

type Props = {
  label: string;
  steps: ScrollyStep[];
  /** Renders the sticky visual for the active step. */
  visual: (active: number) => ReactNode;
};

/**
 * Sticky visual on one side, scrolling steps on the other. The step nearest
 * the vertical centre of the viewport is the active one; the visual re-renders
 * from that index. Everything degrades to a plain list of steps plus the
 * visual's initial state when IntersectionObserver is unavailable.
 */
export function Scrolly({ label, steps, visual }: Props) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ratios = new Map<number, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
          ratios.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = -1;
        let bestRatio = 0;
        for (const [idx, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = idx;
            bestRatio = ratio;
          }
        }
        if (best >= 0) setActive(best);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const el of stepRefs.current) if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [steps.length]);

  return (
    <section className="cp-scrolly-wrap not-prose" aria-label={label}>
      <div className="cp-scrolly">
        <div className="cp-scrolly-visual">
          <div className="cp-scrolly-visual-inner">{visual(active)}</div>
        </div>
        <ol className="cp-scrolly-steps">
          {steps.map((step, i) => (
            <li
              key={step.id}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-step-index={i}
              data-active={i === active ? "true" : undefined}
              className="cp-step"
            >
              <button
                type="button"
                className="cp-step-title"
                onClick={() => {
                  setActive(i);
                  stepRefs.current[i]?.scrollIntoView({ block: "center", behavior: "smooth" });
                }}
              >
                <span className="cp-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                {step.title}
              </button>
              <div className="cp-step-body">{step.body}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
