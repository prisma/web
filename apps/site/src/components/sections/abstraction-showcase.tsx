"use client";

import { useEffect, useState } from "react";
import { PrismRay } from "@/components/brand/prism-ray";
import { DefineMock, DeployMock, IterateMock } from "@/components/brand/step-mocks";
import { cn } from "@/lib/utils";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx) — the
// same colored drop shadow used on cards elsewhere in the design.
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// The three "Ship a production TypeScript app" abstractions, cycling inside one
// frame on an infinite loop: the mockup, the frame's background tint, and the
// prism-ray stripes behind all shift through cyan → yellow → red together.

type Stage = {
  key: string;
  label: string;
  Mock: React.ComponentType<{ className?: string }>;
  gradient: string;
  chip: string;
  dot: string;
};

const STAGES: Stage[] = [
  {
    key: "define",
    label: "Define",
    Mock: DefineMock,
    gradient: "from-prism-cyan-50 to-prism-cyan-100",
    chip: "text-prism-cyan-800",
    dot: "bg-prism-cyan-400",
  },
  {
    key: "deploy",
    label: "Deploy",
    Mock: DeployMock,
    gradient: "from-prism-yellow-50 to-prism-yellow-100",
    chip: "text-prism-yellow-700",
    dot: "bg-prism-yellow-400",
  },
  {
    key: "iterate",
    label: "Iterate",
    Mock: IterateMock,
    gradient: "from-prism-red-50 to-prism-red-100",
    chip: "text-prism-red-700",
    dot: "bg-prism-red-500",
  },
];

const INTERVAL = 3200;

export function AbstractionShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % STAGES.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <figure className="flex w-full flex-col items-center">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/[0.06] shadow-lg">
        {/* Background tint — crossfades to the active stage's color */}
        {STAGES.map((stage, i) => (
          <div
            key={stage.key}
            aria-hidden
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-700 ease-out",
              stage.gradient,
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Prism-ray stripe — one horizontal band sweeping straight across the
            middle of the frame, side to side (no rotation). The beam is 1/4 of
            the track, so animate-ray-sweep carries it fully left → right.
            Vertical centering uses a top offset (not translateY) because the
            sweep animation drives translateX. */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <span className="absolute left-0 top-[calc(50%-2rem)] h-16 w-1/4 animate-ray-sweep motion-reduce:hidden">
            <PrismRay angle={0} intensity="whisper" className="inset-0" />
          </span>
          {/* static centered band when motion is reduced */}
          <span className="absolute inset-x-0 top-1/2 hidden h-16 -translate-y-1/2 motion-reduce:block">
            <PrismRay angle={0} intensity="whisper" className="inset-0" />
          </span>
        </div>

        {/* Mockups — crossfade + gentle rise as they swap in */}
        {STAGES.map((stage, i) => {
          const StageMock = stage.Mock;
          return (
            <div
              key={stage.key}
              className={cn(
                "absolute inset-0 grid place-items-center p-8 transition-all duration-700 ease-out motion-reduce:transition-none",
                i === active
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0",
              )}
              aria-hidden={i !== active}
            >
              <div className="relative w-full max-w-[17rem] scale-110">
                {/* colored spectrum drop shadow, like the other cards */}
                <div
                  aria-hidden
                  className="absolute -inset-1 rounded-xl opacity-20 blur-[16px]"
                  style={{ backgroundImage: SPECTRUM }}
                />
                <StageMock className="relative w-full max-w-none" />
              </div>
            </div>
          );
        })}

        {/* Step label + progress dots */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
          <span
            className={cn(
              "rounded-full bg-white/70 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors duration-700",
              STAGES[active].chip,
            )}
          >
            {active + 1}. {STAGES[active].label}
          </span>
          <div className="flex items-center gap-1.5">
            {STAGES.map((stage, i) => (
              <span
                key={stage.key}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active ? cn("w-5", stage.dot) : "w-1.5 bg-foreground/15",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
