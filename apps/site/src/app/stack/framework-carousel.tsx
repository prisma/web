import { Marquee } from "@/components/marquee";
import { Action, Card } from "@prisma/eclipse";
import type { CSSProperties } from "react";
import { frameworks } from "./stack-data";

/**
 * Vertical stack: a scrolling marquee of the frameworks Prisma Compute runs,
 * with a Prisma Compute card beneath it. Both are full-width so the pairing
 * reads cleanly on mobile. The compute icon matches the diagram node.
 */
export function FrameworkCarousel() {
  return (
    <div className="mx-auto flex w-full max-w-137 flex-col gap-4">
      <Card className="overflow-hidden p-4">
        <Marquee
          direction="up"
          fade
          fillContainer={false}
          className="h-58 w-full"
          style={{ "--duration": "22s", "--gap": "0.875rem" } as CSSProperties}
        >
          {frameworks.map((f) => (
            <div
              key={f.name}
              className="flex h-16 items-center gap-3.5 rounded-square-high border border-stroke-neutral bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_260%)] px-5"
            >
              <div
                className="grid size-10 shrink-0 place-items-center rounded-square border border-stroke-neutral-strong font-sans-display text-base font-black"
                style={{ background: f.bg, color: f.color }}
              >
                {f.mono}
              </div>
              <div className="font-sans-display text-lg font-extrabold text-foreground-neutral">
                {f.name}
              </div>
            </div>
          ))}
        </Marquee>
      </Card>

      <div className="flex justify-center">
        <i className="fa-regular fa-plus text-lg text-foreground-neutral-weaker" aria-hidden />
      </div>

      <Card className="flex-row items-center gap-4 bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] p-5">
        <Action color="ppg" size="4xl">
          <i className="fa-regular fa-microchip text-2xl" aria-hidden />
        </Action>
        <div className="flex flex-col">
          <span className="font-sans-display text-lg font-bold text-foreground-neutral">
            Prisma Compute
          </span>
          <span className="text-sm text-foreground-neutral-weak">
            Same runtime, same database, same deploy for any framework.
          </span>
        </div>
      </Card>
    </div>
  );
}
