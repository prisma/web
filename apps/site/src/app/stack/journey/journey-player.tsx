"use client";

import { cn } from "@/lib/cn";
import { type AnnotationHandler, type HighlightedCode, InnerToken, Pre } from "codehike/code";
import { useEffect, useRef, useState } from "react";
import styles from "../stack.module.css";
import { RAIL_NODES, journeySteps } from "./journey-steps";
import { SmoothPre } from "./smooth-pre";

const AUTOPLAY_INTERVAL = 6500;

function PlayPauseIcon({ playing }: { playing: boolean }) {
  // Inline SVG: fa-play/fa-pause are not in the site's FontAwesome kit.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3" aria-hidden>
      {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
    </svg>
  );
}

const handlers: AnnotationHandler[] = [
  {
    name: "token-transitions",
    PreWithRef: SmoothPre,
    // inline-block so the WAAPI translate animation can move each token
    Token: (props) => <InnerToken merge={props} style={{ display: "inline-block" }} />,
  },
];

/**
 * The primary explanatory element of the page: a six-step walkthrough where
 * the code panel morphs between states (Code Hike token transitions) while a
 * rail of the four stack layers shows which parts of the stack each step
 * touches. Autoplay pauses off screen and under prefers-reduced-motion; every
 * step's code is also rendered statically for sizing, crawlers, and no-JS.
 */
export function JourneyPlayer({ codes }: { codes: HighlightedCode[] }) {
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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playing = autoplay && inView;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % journeySteps.length),
      AUTOPLAY_INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [playing]);

  // Manual navigation stops autoplay so a reader can study a state; the play
  // button brings it back.
  const goTo = (index: number) => {
    setAutoplay(false);
    setActive((index + journeySteps.length) % journeySteps.length);
  };

  const step = journeySteps[active];

  return (
    <figure
      ref={rootRef}
      role="group"
      aria-label="How the Prisma Stack works, step by step"
      className="not-prose m-0 overflow-hidden rounded-square-high border border-stroke-neutral bg-background-default shadow-box-low"
    >
      {/* Autoplay progress bar: refills every step, so it is obvious the
          walkthrough advances on its own and more steps are coming. */}
      <div className="h-[3px] w-full bg-background-neutral-weak">
        <div
          key={active}
          className={cn("h-full origin-left bg-background-ppg-reverse", styles["journey-progress"])}
          style={{
            animationDuration: `${AUTOPLAY_INTERVAL}ms`,
            animationPlayState: playing ? "running" : "paused",
            animationName: autoplay ? undefined : "none",
            transform: autoplay ? undefined : "scaleX(0)",
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-stroke-neutral px-4 py-2.5">
        <span className="text-sm font-medium text-foreground-neutral">
          From empty folder to production
        </span>
        <span className="flex shrink-0 items-center gap-2.5 text-xs text-foreground-neutral-weak tabular-nums">
          <span aria-live="polite">
            Step {active + 1} of {journeySteps.length}
          </span>
          <button
            type="button"
            aria-label={autoplay ? "Pause the walkthrough" : "Play the walkthrough"}
            aria-pressed={autoplay}
            onClick={() => setAutoplay((on) => !on)}
            className="flex size-6 items-center justify-center rounded-circle border border-stroke-neutral text-foreground-neutral-weak transition-colors hover:border-stroke-ppg hover:text-foreground-ppg"
          >
            <PlayPauseIcon playing={autoplay} />
          </button>
        </span>
      </div>

      <div className="grid md:grid-cols-[15rem_1fr]">
        {/* The rail: where this step happens in the stack. */}
        <ol
          className={cn(
            styles.rail,
            "m-0 flex list-none flex-row flex-wrap gap-1 border-b border-stroke-neutral p-4 md:flex-col md:gap-0 md:border-b-0 md:border-r",
          )}
          aria-label="Layers involved in this step"
        >
          {RAIL_NODES.map((node, index) => {
            const isActive = step.active.includes(node.id);
            const nextActive =
              index < RAIL_NODES.length - 1 && step.active.includes(RAIL_NODES[index + 1].id);
            return (
              <li
                key={node.id}
                className={cn(
                  styles["rail-node"],
                  isActive && styles["rail-active"],
                  step.pulse && isActive && nextActive && styles["rail-flow"],
                )}
              >
                <span className={styles["rail-dot"]} aria-hidden />
                <span className="text-sm">{node.label}</span>
              </li>
            );
          })}
        </ol>

        {/* Grid-stacked sizers reserve the tallest/widest step up front, so
            stepping never shifts the layout. They also keep every step's code
            in the static HTML. */}
        <div className="grid overflow-x-auto p-4 md:p-5">
          <div className="col-start-1 row-start-1" aria-live="off">
            <Pre
              code={codes[active]}
              handlers={handlers}
              className="type-code-sm m-0 whitespace-pre bg-transparent p-0 font-mono"
            />
          </div>
          {journeySteps.map((sizer) => (
            <pre
              key={sizer.title}
              aria-hidden
              className="type-code-sm invisible col-start-1 row-start-1 m-0 whitespace-pre p-0 font-mono"
            >
              {sizer.code}
            </pre>
          ))}
        </div>
      </div>

      {/* Captions are grid-stacked so the footer reserves the tallest one and
          never shifts as the steps advance. */}
      <figcaption className="flex flex-col gap-3 border-t border-stroke-neutral px-4 py-3">
        <span className="grid text-sm leading-snug text-foreground-neutral-weak">
          {journeySteps.map((s, index) => (
            <span
              key={s.title}
              aria-hidden={index !== active}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-300",
                index === active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {s.caption}
            </span>
          ))}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => goTo(active - 1)}
            className="flex size-6 shrink-0 items-center justify-center rounded-circle border border-stroke-neutral text-foreground-neutral-weak transition-colors hover:border-stroke-ppg hover:text-foreground-ppg"
          >
            <i className="fa-regular fa-chevron-left" aria-hidden />
          </button>
          <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
            {journeySteps.map((s, index) => (
              <button
                key={s.title}
                type="button"
                aria-current={index === active ? "step" : undefined}
                onClick={() => goTo(index)}
                className={cn(
                  "whitespace-nowrap rounded-circle border px-2.5 py-1 text-xs transition-colors",
                  index === active
                    ? "border-stroke-ppg bg-background-ppg text-foreground-ppg-strong"
                    : "border-stroke-neutral text-foreground-neutral-weak hover:text-foreground-neutral",
                )}
              >
                {s.title}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next step"
            onClick={() => goTo(active + 1)}
            className="flex size-6 shrink-0 items-center justify-center rounded-circle border border-stroke-neutral text-foreground-neutral-weak transition-colors hover:border-stroke-ppg hover:text-foreground-ppg"
          >
            <i className="fa-regular fa-chevron-right" aria-hidden />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
