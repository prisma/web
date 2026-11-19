"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";

export type StudioTourStop = {
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

// Seconds each stop holds before the tour advances.
const HOLD = 6;

// Studio's feature tour. From lg up the section heading and the feature list
// share the left column, so both columns start on one line, and one large
// screenshot on the right follows the list.
//
// The list is an ARIA tablist (arrow keys move, the strip is one tab stop).
// It advances on its own every HOLD seconds while it is on screen, with no
// countdown shown. Hovering or keyboard focus inside the list pauses it (so the
// selected tab never moves out from under a focused one), and the first click
// or key press stops it for good. Reduced motion never starts it.
// Below lg it is a plain stack: heading, then each feature with its screenshot.
export function StudioTour({
  heading,
  headingId,
  stops,
}: {
  heading: string;
  headingId: string;
  stops: readonly StudioTourStop[];
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [driving, setDriving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  // Only run while the tour is actually visible, so it never advances unseen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = !reduce && !driving && !paused && !focused && inView;

  // Keyed on `active`, so the hold always measures from the moment the stop
  // became current.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % stops.length), HOLD * 1000);
    return () => clearTimeout(timer);
  }, [running, active, stops.length]);

  const select = (i: number) => {
    setActive(i);
    setDriving(true);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + stops.length) % stops.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    // One grid for both layouts, so the heading renders once. xl+: heading
    // and list stacked in the left column, the stage spanning both rows on
    // the right. lg: the heading spans the top, and list and stage start
    // together under it (a narrower stage would end above the list).
    // Below lg: heading, then the plain stack.
    <div
      ref={rootRef}
      className="grid items-start lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 xl:gap-x-20"
    >
      <h2
        id={headingId}
        className="text-balance text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1] lg:col-span-2 lg:col-start-1 lg:row-start-1 xl:col-span-1"
      >
        {heading}
      </h2>
      <div
        className="hidden lg:col-start-1 lg:row-start-2 lg:block"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          // Focus moving between tabs stays inside; only leaving resumes it.
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <div
          role="tablist"
          aria-label="Studio features"
          aria-orientation="vertical"
          className="mt-10 border-b border-black/[0.08]"
          onKeyDown={onKeyDown}
        >
          {stops.map((stop, i) => {
            const isActive = i === active;
            return (
              <button
                key={stop.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`${id}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                className="group relative block w-full cursor-pointer border-t border-black/[0.08] py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-prism-yellow-400"
              >
                {/* A static mark on the active stop's top rule. It does not
                    fill or count down: the tour just moves on. */}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute -top-px left-0 h-0.5 w-12 bg-prism-yellow-400"
                  />
                ) : null}
                <span
                  className={cn(
                    "block text-[1.0625rem] font-medium leading-snug transition-colors duration-200",
                    isActive ? "text-foreground" : "text-foreground/75 group-hover:text-foreground",
                  )}
                >
                  {stop.title}
                </span>
                {/* Only the active stop's description shows; the others
                      collapse but stay in the DOM. */}
                <span
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <span className="overflow-hidden">
                    <span className="block max-w-[42ch] pt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {stop.description}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="hidden lg:col-start-2 lg:row-start-2 lg:mt-10 lg:block xl:row-span-2 xl:row-start-1 xl:mt-0"
      >
        <BrowserFrame>
          {/* All screenshots share one grid cell, so the stage never
                changes height and switching is a cross-fade. */}
          <div className="grid">
            {stops.map((stop, i) => (
              <Image
                key={stop.imageSrc}
                src={stop.imageSrc}
                alt={i === active ? stop.imageAlt : ""}
                aria-hidden={i !== active}
                width={1040}
                height={643}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className={cn(
                  "h-auto w-full [grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </BrowserFrame>
      </div>

      {/* below lg: a plain stack */}
      <div className="lg:hidden">
        <div className="mt-10 flex flex-col gap-14">
          {stops.map((stop) => (
            <div key={stop.label}>
              <h3 className="text-lg leading-snug">{stop.title}</h3>
              <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                {stop.description}
              </p>
              <div className="mt-5">
                <BrowserFrame>
                  <Image
                    src={stop.imageSrc}
                    alt={stop.imageAlt}
                    width={1040}
                    height={643}
                    sizes="100vw"
                    className="h-auto w-full"
                  />
                </BrowserFrame>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
