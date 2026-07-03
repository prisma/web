import { Action, Card } from "@prisma/eclipse";
import { frameworks } from "./stack-data";
import styles from "./stack.module.css";

/**
 * Vertical stack: a scrolling marquee of the frameworks Prisma Compute runs,
 * with a Prisma Compute card beneath it. Both are full-width so the pairing
 * reads cleanly on mobile. The compute icon matches the diagram node.
 */
export function FrameworkCarousel() {
  return (
    <div className="mx-auto flex w-full max-w-137 flex-col gap-4">
      <Card className="overflow-hidden p-4">
        <div className={styles["fw-marquee"]}>
          <div className={styles["fw-track"]}>
            {[...frameworks, ...frameworks].map((f, i) => (
              <div className={styles["fw-row"]} key={`${f.name}-${i}`}>
                <div className={styles["fw-logo-sm"]} style={{ background: f.bg, color: f.color }}>
                  {f.mono}
                </div>
                <div className={styles["fw-row-name"]}>{f.name}</div>
              </div>
            ))}
          </div>
        </div>
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
