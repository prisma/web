import { BunMark } from "./bun-mark";
import { PrismaMark } from "./prisma-mark";
import styles from "./stack.module.css";

const heroLayers = [
  {
    id: "app",
    eyebrow: "You write",
    title: "Your application",
    icon: <i className="fa-regular fa-laptop" aria-hidden />,
    accent: "violet" as const,
  },
  {
    id: "orm",
    eyebrow: "Talks through",
    title: "Prisma ORM",
    icon: <PrismaMark className="size-[14px]" />,
    accent: "orm" as const,
  },
  {
    id: "postgres",
    eyebrow: "Stores in",
    title: "Prisma Postgres",
    icon: <i className="fa-regular fa-database" aria-hidden />,
    accent: "ppg" as const,
  },
  {
    id: "compute",
    eyebrow: "Runs on",
    title: "Prisma Compute + Bun",
    icon: <BunMark className="size-[15px]" />,
    accent: "ppg" as const,
  },
];

/**
 * The hero's animated stack: the four layers enter staggered, then a request
 * pulse travels the connectors on a loop. The layers widen toward the base so
 * the visual previews the stack pyramid the reader meets one scroll later.
 * Pure CSS, server-rendered; under prefers-reduced-motion everything is
 * simply visible and static, so the relationship reads the same without
 * animation.
 */
export function HeroVisual() {
  return (
    <div className={styles["hero-visual"]} aria-hidden>
      {heroLayers.map((layer, index) => (
        <div
          key={layer.id}
          className={styles["hero-layer-slot"]}
          style={{ "--row": index } as React.CSSProperties}
        >
          {index > 0 && <span className={styles["hero-connector"]} />}
          <div
            className={`${styles["hero-layer"]} ${styles[`accent-${layer.accent}`]}`}
            style={{ animationDelay: `${index * 140}ms` }}
          >
            <span className={styles["hero-layer-icon"]}>{layer.icon}</span>
            <span className={styles["hero-layer-text"]}>
              <span className={styles["hero-layer-eyebrow"]}>{layer.eyebrow}</span>
              <span className={styles["hero-layer-title"]}>{layer.title}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
