"use client";

import { cn } from "@/lib/cn";
import { Action } from "@prisma/eclipse";
import { useEffect, useRef, useState } from "react";
import { SpotlightCard } from "./spotlight-card";
import { frameworks, stackLayers } from "./stack-data";
import styles from "./stack.module.css";

const FRAMEWORK_SWAP_INTERVAL = 2200;

const accentText = {
  ppg: "text-foreground-ppg",
  orm: "text-foreground-orm",
  violet: "text-[var(--color-foreground-violet)]",
} as const;

const accentTile = {
  ppg: "border-stroke-ppg/40 bg-background-ppg text-foreground-ppg",
  orm: "border-stroke-orm/40 bg-background-orm text-foreground-orm",
  violet:
    "border-[color-mix(in_srgb,var(--color-foreground-violet)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-foreground-violet)_14%,transparent)] text-[var(--color-foreground-violet)]",
} as const;

/**
 * The interactive stack pyramid: your code as the tip, Prisma Postgres as the
 * foundation. Each layer is a tab that opens a detail panel, so a reader can
 * inspect one layer without losing sight of the whole. The top layer cycles
 * through frameworks to show that the choice of framework stays open. All
 * panels stay in the DOM (inactive ones use `hidden`) so every product fact
 * is served as static HTML; cycling stops under prefers-reduced-motion.
 */
export function StackPyramid() {
  const [active, setActive] = useState(0);
  const [fwIndex, setFwIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [cycle, setCycle] = useState(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCycle(false);
    }
  }, []);

  // Cycle the framework in the top layer: fade out, swap, fade in.
  useEffect(() => {
    if (!cycle) return;
    let swapTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setSwapping(true);
      swapTimeout = setTimeout(() => {
        setFwIndex((i) => (i + 1) % frameworks.length);
        setSwapping(false);
      }, 240);
    }, FRAMEWORK_SWAP_INTERVAL);
    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeout);
    };
  }, [cycle]);

  const framework = frameworks[fwIndex];

  const focusTab = (index: number) => {
    const next = (index + stackLayers.length) % stackLayers.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(active + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(stackLayers.length - 1);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-12">
      {/* The pyramid, always fully visible. */}
      <div
        role="tablist"
        aria-label="Layers of the Prisma Stack, from your application down to the database"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className={styles.pyramid}
      >
        {stackLayers.map((layer, index) => {
          const isApp = layer.id === "app";
          return (
            <div
              key={layer.id}
              className={styles["pyramid-slot"]}
              style={{ "--row": index } as React.CSSProperties}
            >
              {index > 0 && <span className={styles["pyramid-connector"]} aria-hidden />}
              <button
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`stack-tab-${layer.id}`}
                aria-selected={index === active}
                aria-controls={`stack-panel-${layer.id}`}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  styles["pyramid-layer"],
                  styles[`accent-${layer.accent}`],
                  index === active && styles["pyramid-active"],
                )}
              >
                <span
                  className={cn(styles["pyramid-icon"], isApp && styles["pyramid-icon-logo"])}
                  aria-hidden
                >
                  {isApp ? (
                    <img
                      src={framework.logo}
                      alt=""
                      className={cn(styles["pyramid-mono"], swapping && styles.swapping)}
                    />
                  ) : (
                    <i className={layer.icon} />
                  )}
                </span>
                <span className={styles["pyramid-text"]}>
                  <span className={styles["pyramid-eyebrow"]}>{layer.role}</span>
                  {isApp ? (
                    <span className={cn(styles["pyramid-title"], swapping && styles.swapping)}>
                      {framework.name}
                    </span>
                  ) : (
                    <span className={styles["pyramid-title"]}>{layer.name}</span>
                  )}
                </span>
                <span className={styles["pyramid-sub"]}>{layer.sub}</span>
              </button>
            </div>
          );
        })}
        <p className="m-0 mt-3 text-center text-xs text-foreground-neutral-weaker">
          One connected platform. The framework on top is your call.
        </p>
      </div>

      {/* One panel per layer, stacked in the same grid cell. Inactive panels
          stay in the layout (invisible, not display:none) so the section
          always keeps the tallest panel's height and switching tabs never
          shifts the content below. */}
      <div className="grid">
        {stackLayers.map((layer, index) => (
          <div
            key={layer.id}
            role="tabpanel"
            id={`stack-panel-${layer.id}`}
            aria-labelledby={`stack-tab-${layer.id}`}
            aria-hidden={index !== active}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-200",
              index !== active && "invisible opacity-0",
            )}
          >
            <SpotlightCard className="flex h-full flex-col gap-5 rounded-square-high border border-stroke-neutral bg-background-default p-6 md:p-8">
              <div className="flex items-center gap-3">
                {layer.accent === "violet" ? (
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-square border text-xl",
                      accentTile.violet,
                    )}
                    aria-hidden
                  >
                    <i className={layer.icon} />
                  </span>
                ) : (
                  <Action color={layer.accent} size="3xl">
                    <i className={`${layer.icon} text-xl`} aria-hidden />
                  </Action>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground-neutral-weaker">
                    {layer.role}
                  </span>
                  <h3 className="type-title-lg m-0 text-foreground-neutral">{layer.name}</h3>
                </div>
              </div>
              <p className="m-0 text-foreground-neutral-weak">{layer.description}</p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-foreground-neutral">
                {layer.facts.map((fact) => (
                  <li key={fact} className="flex gap-3">
                    <i
                      className={cn("fa-regular fa-check mt-1", accentText[layer.accent])}
                      aria-hidden
                    />
                    {fact}
                  </li>
                ))}
              </ul>
              {layer.id === "app" ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground-neutral-weaker">
                    Runs unchanged on the stack
                  </span>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {frameworks.map((fw) => (
                      <li key={fw.name} className="flex">
                        <a
                          href={fw.guide}
                          title={`${fw.name} guide`}
                          className="flex items-center gap-2 rounded-square border border-stroke-neutral px-2.5 py-1.5 text-xs text-foreground-neutral no-underline transition-colors hover:border-stroke-ppg/60 hover:bg-background-ppg hover:text-foreground-ppg-strong"
                        >
                          <span
                            className="grid size-5 shrink-0 place-items-center overflow-hidden rounded-square-low border border-stroke-neutral bg-white p-0.5"
                            aria-hidden
                          >
                            <img
                              src={fw.logo}
                              alt=""
                              className="max-h-full max-w-full object-contain"
                            />
                          </span>
                          {fw.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {layer.chips ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground-neutral-weaker">
                    {layer.chips.label}
                  </span>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {layer.chips.items.map((chip) => (
                      <li
                        key={chip}
                        className={cn(
                          "rounded-square border px-2.5 py-1.5 font-mono text-xs",
                          layer.accent === "orm"
                            ? "border-stroke-orm/30 bg-background-orm text-foreground-orm-strong"
                            : "border-stroke-ppg/30 bg-background-ppg text-foreground-ppg-strong",
                        )}
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <a
                href={layer.link.href}
                className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground-ppg hover:underline"
              >
                {layer.link.label}
                <i className="fa-regular fa-arrow-right" aria-hidden />
              </a>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </div>
  );
}
