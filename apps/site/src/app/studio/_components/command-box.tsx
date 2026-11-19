"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CopyCommand } from "./copy-command";

/** One case's command, one step per line; the copy button copies them as one && chain. */
export type CommandTab = { label: string; steps: readonly string[] };

// The launch commands in /studio's Quick access: one per case (a seeded
// example, or any database), behind a two-tab switch, with one copy button that
// copies whichever command is showing. Follows the ARIA tabs pattern: arrow
// keys move between tabs, and the strip is a single tab stop.
export function CommandBox({ tabs, className }: { tabs: CommandTab[]; className?: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = tabs[active];
  const command = current.steps.join(" && ");

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      className={cn(
        "w-full max-w-[30rem] overflow-hidden rounded-xl border border-black/[0.08] bg-white/80 shadow-[0_1px_2px_rgba(21,21,21,0.05)]",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Launch command"
        className="flex gap-5 border-b border-black/[0.08] px-5"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "-mb-px cursor-pointer border-b-2 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prism-yellow-400",
              i === active
                ? "border-prism-yellow-400 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="flex items-start gap-2 py-3 pl-5 pr-3"
      >
        {/* Every tab's command sits in the same grid cell and the inactive
            ones are hidden, not removed, so the box always has the tallest
            tab's height: switching tabs never moves the links below it. */}
        <div className="grid min-w-0 flex-1">
          {tabs.map((tab, t) => (
            <code
              key={tab.label}
              aria-hidden={t !== active}
              className={cn(
                "[grid-area:1/1] py-1 font-mono text-[0.9375rem] leading-7 text-foreground",
                t !== active && "invisible",
              )}
            >
              {tab.steps.map((step, s) => (
                <span key={step} className="flex gap-2.5">
                  <span aria-hidden className="select-none text-muted-foreground">
                    $
                  </span>
                  {/* wrap only between words, never inside a flag like --template */}
                  <span className="min-w-0">
                    {step.split(" ").map((word, i, words) => (
                      <span key={i}>
                        {i > 0 ? " " : null}
                        <span className="whitespace-nowrap">
                          {word}
                          {/* a terminal caret after the last command, kept
                              with its word so it never wraps on its own */}
                          {s === tab.steps.length - 1 && i === words.length - 1 ? (
                            <span
                              aria-hidden
                              className="ml-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-caret-blink bg-prism-yellow-400 motion-reduce:animate-none"
                            />
                          ) : null}
                        </span>
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </code>
          ))}
        </div>
        <CopyCommand text={command} className="mt-0.5" />
      </div>
    </div>
  );
}
