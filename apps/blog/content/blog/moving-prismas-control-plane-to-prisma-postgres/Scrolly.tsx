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
 * Sticky visual on one side, scrolling steps on the other. The active step is
 * the last one whose top edge has crossed the vertical centre of the viewport,
 * so scrolling down advances the visual exactly as each step reaches the
 * middle of the screen, and scrolling up winds it back the same way. Without
 * JavaScript the page shows a plain list of steps plus the visual's initial
 * state.
 */
export function Scrolly({ label, steps, visual }: Props) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  // On narrow layouts the visual sticks above the steps, so the step list is
  // padded by the visual's height; otherwise the figure covers the last step.
  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (!section || !visual || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      section.style.setProperty("--cp-visual-h", `${visual.offsetHeight}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(visual);
    return () => ro.disconnect();
  }, []);

  // Where a step has to reach before it becomes the active one. Readers like
  // the text they are reading near the top of the screen, so on the wide
  // layout the line sits level with the top of the sticky figure plus a
  // little, and on the stacked layout just below the figure.
  const readingLine = () => {
    const visual = visualRef.current;
    const section = sectionRef.current;
    const stacked = !!section && section.clientWidth <= 760;
    if (stacked && visual) return visual.getBoundingClientRect().bottom + 56;
    const top = visual ? visual.getBoundingClientRect().top : 0;
    return Math.max(top, 0) + 48;
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = readingLine();
      let next = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });
      setActive((prev) => (prev === next ? prev : next));
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [steps.length]);

  return (
    <section ref={sectionRef} className="cp-scrolly-wrap not-prose" aria-label={label}>
      <div className="cp-scrolly">
        <div ref={visualRef} className="cp-scrolly-visual">
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
                  const el = stepRefs.current[i];
                  if (!el) return;
                  // Land the step title just under the reading line, so the
                  // text sits at the top of the screen beside the figure
                  // instead of in the middle.
                  const top = window.scrollY + el.getBoundingClientRect().top;
                  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({
                    top: top - readingLine() + 40,
                    behavior: reduce ? "auto" : "smooth",
                  });
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
