"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PrismRay } from "@/components/brand/prism-ray";
import { DefineMock, DeployMock, IterateMock } from "@/components/brand/step-mocks";
import { Texture } from "@/components/brand/texture";
import { cn } from "@/lib/utils";

export type StepperStep = { number: string; title: string; body: React.ReactNode };

// Seconds each step holds before the stepper advances on its own.
const DWELL = 6;

const MOCKS = [DefineMock, DeployMock, IterateMock];

// Each step's backdrop: the product feature photos (same crops and saturation
// boost as product-features.tsx), so the stage matches the other illustrated
// panels on the site. They crossfade as the step changes.
const PHOTOS = [
  "bg-[url('/brand/feature-orm.jpg')] bg-[position:0%_65%]",
  "bg-[url('/brand/feature-postgres.jpg')] bg-[position:50%_55%]",
  "bg-[url('/brand/feature-compute.jpg')] bg-[position:20%_90%]",
];
// Progress colour per step, cycling the prism trio (cyan → yellow → red).
const RAIL = ["bg-prism-cyan-400", "bg-prism-yellow-400", "bg-prism-red-500"];

// The three cards sit on one diagonal rising at the brand ray's -16°, so the
// ray drawn behind them passes through all three — define, deploy, iterate as
// one beam of light — and the active card steps forward out of the line.
// The outer slots keep 11.75rem from the stage edge — half the active card's
// width at its 1.45 scale, plus a margin — so the card stepping forward is
// never clipped on narrower stages (1024–1280px).
const SLOTS = [
  { left: "max(25%, 11.75rem)", top: "63%" },
  { left: "50%", top: "50%" },
  { left: "min(75%, calc(100% - 11.75rem))", top: "37%" },
];

// Desktop "three steps": the step list on the left drives a stage on the
// right. It advances every DWELL seconds while the section is on screen — the
// active step's rail fills as the timer, and the advance fires on that
// animation's end, so hovering the stepper (which pauses the fill) pauses the
// timer too. Picking a step stops the auto-advance. Reduced motion never
// auto-advances. Every step's copy stays visible; the selection only changes
// which card the stage brings forward.
export function HowItWorksStepper({ steps }: { steps: StepperStep[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = auto && inView && !reduceMotion;

  return (
    <div
      ref={ref}
      className="group/stepper grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch gap-8 xl:gap-12"
    >
      <ol className="flex flex-col justify-center gap-2">
        {steps.map((step, i) => {
          const on = i === active;
          return (
            <li key={step.number}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setActive(i);
                  setAuto(false);
                }}
                className={cn(
                  "relative w-full cursor-pointer rounded-2xl py-6 pl-10 pr-6 text-left transition-[background-color,box-shadow] duration-300",
                  on
                    ? "bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_28px_-14px_rgba(21,21,21,0.16)] ring-1 ring-black/[0.06]"
                    : "hover:bg-muted/60",
                )}
              >
                {/* the rail doubles as the timer while auto-advancing */}
                <span
                  aria-hidden
                  className="absolute bottom-6 left-5 top-6 w-0.5 overflow-hidden rounded-full bg-black/[0.07]"
                >
                  {on && (
                    <span
                      key={`${active}-${running}`}
                      onAnimationEnd={
                        running ? () => setActive((a) => (a + 1) % steps.length) : undefined
                      }
                      className={cn(
                        "absolute inset-0 origin-top rounded-full",
                        RAIL[i % RAIL.length],
                        running &&
                          "animate-step-progress group-hover/stepper:[animation-play-state:paused]",
                      )}
                      style={running ? { animationDuration: `${DWELL}s` } : undefined}
                    />
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-md text-[0.8125rem] font-semibold transition-colors",
                      on ? "bg-foreground text-background" : "bg-card-wash text-foreground",
                    )}
                  >
                    {step.number}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-2xl font-medium transition-colors",
                      on ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    {step.title}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-3 block text-pretty text-[0.9375rem] leading-relaxed transition-colors",
                    on ? "text-muted-foreground" : "text-muted-foreground/70",
                  )}
                >
                  {step.body}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* the stage — decorative; the step list carries the content */}
      <div
        aria-hidden
        className="relative min-h-[30rem] select-none overflow-hidden rounded-3xl border border-black/[0.06] bg-white"
      >
        {PHOTOS.map((photo, i) => (
          <div
            key={photo}
            className={cn(
              "absolute inset-0 bg-cover [filter:saturate(1.45)_contrast(1.04)] transition-opacity duration-700",
              photo,
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <Texture opacity={0.06} blend="multiply" />
        <PrismRay
          angle={-16}
          intensity="structural"
          className="left-1/2 top-1/2 h-10 w-[130%] -translate-x-1/2 -translate-y-1/2"
        />
        {MOCKS.map((Mock, i) => {
          const on = i === active;
          return (
            <div
              key={i}
              className="absolute w-[15rem] -translate-x-1/2 -translate-y-1/2 transition-[scale,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                left: SLOTS[i]?.left,
                top: SLOTS[i]?.top,
                scale: on ? 1.45 : 1.05,
                opacity: on ? 1 : 0.72,
                filter: on ? "none" : "saturate(0.4)",
                zIndex: on ? 30 : 10 + i,
              }}
            >
              <Mock />
            </div>
          );
        })}
      </div>
    </div>
  );
}
