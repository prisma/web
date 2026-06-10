"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import { type ReactNode, useEffect, useRef, useState } from "react";

const AUTOPLAY_INTERVAL = 5000;

/** Title + caption for one step; the body itself is rendered by the caller. */
export interface ShellStep {
  title: string;
  caption: string;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

/**
 * Shared chrome for the concept animations: an autoplay progress bar, a header
 * with the diagram label and step count, the body (rendered by `children` for
 * the active step), and a footer with the step caption and a labelled stepper.
 *
 * The body is a render prop so the same controls drive both the Code Hike
 * token animation and the SVG flow diagrams. Autoplay pauses off-screen and
 * when the reader prefers reduced motion.
 */
export function PlayerShell({
  label,
  steps,
  children,
}: {
  label: string;
  steps: ShellStep[];
  children: (active: number) => ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoplay(false);
    }
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // A low threshold keeps tall diagrams autoplaying even when only partly
    // on screen, so the animation is moving by the time a reader looks at it.
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playing = autoplay && inView;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % steps.length),
      AUTOPLAY_INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [playing, steps.length]);

  // Manual navigation stops autoplay so a reader can study a state; the play
  // button brings it back.
  const goTo = (index: number) => {
    setAutoplay(false);
    setActive((index + steps.length) % steps.length);
  };

  return (
    <figure
      ref={rootRef}
      role="group"
      aria-label={label}
      className="not-prose my-4 overflow-hidden rounded-square border border-stroke-neutral bg-fd-card"
    >
      <style>{"@keyframes concept-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}"}</style>

      {/* Autoplay progress bar: refills every step, so it is obvious the
          diagram is advancing on its own and that more steps are coming. */}
      <div className="h-[3px] w-full bg-fd-muted-foreground/15">
        <div
          key={active}
          className="h-full origin-left bg-fd-primary"
          style={{
            animationName: autoplay ? "concept-progress" : "none",
            animationDuration: `${AUTOPLAY_INTERVAL}ms`,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            animationPlayState: playing ? "running" : "paused",
            transform: autoplay ? undefined : "scaleX(0)",
          }}
        />
      </div>

      {/* Header: what this diagram explains, plus where you are in the steps. */}
      <div className="flex items-center justify-between gap-4 border-b border-stroke-neutral px-4 py-2.5">
        <span className="text-[0.8125rem] font-medium text-fd-foreground">{label}</span>
        <span className="flex shrink-0 items-center gap-2.5 text-[0.75rem] text-fd-muted-foreground tabular-nums">
          <span aria-live="polite">
            Step {active + 1} of {steps.length}
          </span>
          <button
            type="button"
            aria-label={autoplay ? "Pause animation" : "Play animation"}
            aria-pressed={autoplay}
            onClick={() => setAutoplay((on) => !on)}
            className="flex size-6 items-center justify-center rounded-full border border-stroke-neutral text-fd-muted-foreground transition-colors hover:border-fd-primary hover:text-fd-primary"
          >
            {autoplay ? <PauseIcon /> : <PlayIcon />}
          </button>
        </span>
      </div>

      {children(active)}

      {/* Footer: the caption for the current step, plus a labelled stepper so
          readers can jump straight to any named state or walk prev/next. The
          captions are grid-stacked so the footer reserves the tallest one and
          never shifts as you step through. */}
      <figcaption className="flex flex-col gap-3 border-t border-stroke-neutral px-4 py-3">
        <span className="grid text-[0.8125rem] leading-snug text-fd-muted-foreground">
          {steps.map((step, index) => (
            <span
              key={step.title}
              aria-hidden={index !== active}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-300",
                index === active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {step.caption}
            </span>
          ))}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => goTo(active - 1)}
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-stroke-neutral text-fd-muted-foreground transition-colors hover:border-fd-primary hover:text-fd-primary"
          >
            <ChevronIcon direction="left" />
          </button>
          <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                aria-current={index === active}
                onClick={() => goTo(index)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.75rem] transition-colors",
                  index === active
                    ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
                    : "border-stroke-neutral text-fd-muted-foreground hover:text-fd-foreground",
                )}
              >
                {step.title}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next step"
            onClick={() => goTo(active + 1)}
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-stroke-neutral text-fd-muted-foreground transition-colors hover:border-fd-primary hover:text-fd-primary"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
