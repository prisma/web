"use client";

import { useState } from "react";
import { CheckBold, X } from "@/components/icons/forma";
import { Pattern } from "@/components/brand/pattern";
import { SectionKicker } from "@/components/brand/section-kicker";
import { Reveal } from "@/components/motion/reveal";
import { BrokenCard, LiveCard } from "@/components/sections/comparison-cards";
import { cn } from "@/lib/utils";

const BEFORE = [
  "A database from Neon, an ORM from Drizzle, hosting from Vercel",
  "Your agent writes the code, you wire it up",
  "Per-branch databases that don't connect to your hosting previews",
  "Bandwidth bills that scale faster than your traffic",
  "Context-switching between a database dashboard, ORM CLI, hosting console, and data browser",
];

const AFTER = [
  "Your agent runs the full loop: build, deploy, debug, fix, redeploy",
  "One platform: hosting, database, and ORM built to work together natively",
  "Per-branch databases wired to your hosting previews automatically",
  "App and database co-located on the same host, at latency no two-vendor setup can match",
  "Spend limits on every paid tier, so your bill stops where you tell it to",
];

type Side = "before" | "after";

// Before/after: two columns, each led by a mini deploy card — the same
// moment, broken on the left, alive on the right. Card microcopy is
// decorative UI illustration (same idiom as ConsoleIllustration).
//
// Below lg the columns would stack into two screens of scrolling, so a
// segmented switch shows one side at a time, opening on After. Both columns
// stay in the DOM (only hidden) so the copy is still there for crawlers and
// for the lg layout.
export function Comparison() {
  const [side, setSide] = useState<Side>("after");

  return (
    <section className="bg-white px-4 py-14 sm:px-8 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-site">
        <Reveal>
          <SectionKicker>Before and after</SectionKicker>
          <h2 className="mt-4 max-w-[24ch] text-balance text-[clamp(2rem,3.5vw,3rem)] leading-[1.1]">
            The stack your agent has been waiting for
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-8 flex sm:mt-10 lg:hidden">
          <div
            role="group"
            aria-label="Show your stack before or after Prisma"
            className="relative grid grid-cols-2 rounded-full border border-black/[0.08] bg-muted/60 p-1"
          >
            {/* the active pill slides between the two options */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_1px_2px_rgba(21,21,21,0.08),0_4px_12px_-4px_rgba(21,21,21,0.14)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                side === "after" && "translate-x-full",
              )}
            />
            {(["before", "after"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={side === option}
                onClick={() => setSide(option)}
                className={cn(
                  "relative z-10 min-h-10 rounded-full px-6 text-sm font-semibold capitalize transition-colors",
                  side === option ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-10 sm:mt-8 lg:mt-14 lg:grid-cols-2 lg:gap-6">
          {/* before */}
          <Reveal
            delay={0.05}
            className={cn("flex flex-col px-1 py-2 sm:p-8", side !== "before" && "max-lg:hidden")}
          >
            <h3 className="text-2xl text-muted-foreground sm:text-3xl">Before</h3>

            {/* broken deploy card — glass shatters into its current state */}
            <BrokenCard />

            <ul className="mt-8 flex flex-col gap-3 sm:mt-10">
              {BEFORE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  <X
                    className="mt-1 size-4 shrink-0 text-foreground/35"
                    strokeWidth={3}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* after — lifted on white with the brand cube pattern, greyscaled */}
          <Reveal
            delay={0.15}
            className={cn(
              "spectrum-border spectrum-border-on relative flex flex-col overflow-hidden rounded-[1.25rem] border border-transparent bg-white p-5 sm:p-8",
              side !== "after" && "max-lg:hidden",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
            >
              <Pattern className="h-full w-full" scale={2.5} />
            </div>
            <h3 className="text-2xl text-foreground sm:text-3xl">After</h3>

            {/* live deploy card — a cursor glides in and clicks Deploy preview */}
            <LiveCard />

            <ul className="mt-8 flex flex-col gap-3 sm:mt-10">
              {AFTER.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] font-semibold leading-relaxed text-foreground"
                >
                  <CheckBold className="mt-1 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
