"use client";

import { cn } from "@/lib/cn";
import { Action } from "@prisma/eclipse";
import { useRef, useState } from "react";
import { SpotlightCard } from "./spotlight-card";
import { stackLayers } from "./stack-data";
import styles from "./stack.module.css";

/**
 * The interactive stack overview: a tablist shaped like the stack itself, so
 * inspecting one layer never hides the whole. Layer order mirrors the request
 * path (app → Compute + Bun → ORM → Postgres). Every panel stays in the DOM
 * (inactive ones use `hidden`), so all product copy is served as static HTML.
 */
export function StackOverview() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    <div className="grid gap-6 md:grid-cols-[minmax(16rem,20rem)_1fr] md:gap-10">
      {/* The stack, always fully visible. */}
      <div className={styles["overview-rail"]}>
        <div className="mb-1 flex items-center gap-2.5 px-3.5 py-2 text-sm text-foreground-neutral-weak">
          <i className="fa-regular fa-browser" aria-hidden />
          Your application
        </div>
        <div
          role="tablist"
          aria-label="Layers of the Prisma Stack"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col"
        >
          {stackLayers.map((layer, index) => (
            <button
              key={layer.id}
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
                styles["overview-tab"],
                index === active && styles["overview-tab-active"],
                "flex w-full items-center gap-3 rounded-square-high border px-3.5 py-3 text-left transition-colors",
                index === active
                  ? "border-stroke-ppg bg-background-ppg/60"
                  : "border-stroke-neutral bg-background-default hover:border-stroke-neutral-strong",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-square border text-sm",
                  layer.accent === "orm"
                    ? "border-stroke-orm/40 bg-background-orm text-foreground-orm"
                    : "border-stroke-ppg/40 bg-background-ppg text-foreground-ppg",
                )}
                aria-hidden
              >
                <i className={layer.icon} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-foreground-neutral-weaker">
                  {layer.role}
                </span>
                <span className="font-sans-display text-base font-bold text-foreground-neutral">
                  {layer.name}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* One panel per layer; all rendered, one visible. */}
      <div className="grid">
        {stackLayers.map((layer, index) => (
          <div
            key={layer.id}
            role="tabpanel"
            id={`stack-panel-${layer.id}`}
            aria-labelledby={`stack-tab-${layer.id}`}
            hidden={index !== active}
            className="col-start-1 row-start-1"
          >
            <SpotlightCard className="flex h-full flex-col gap-5 rounded-square-high border border-stroke-neutral bg-background-default p-6 md:p-8">
              <div className="flex items-center gap-3">
                <Action color={layer.accent} size="3xl">
                  <i className={`${layer.icon} text-xl`} aria-hidden />
                </Action>
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
                      className={cn(
                        "fa-regular fa-check mt-1",
                        layer.accent === "orm" ? "text-foreground-orm" : "text-foreground-ppg",
                      )}
                      aria-hidden
                    />
                    {fact}
                  </li>
                ))}
              </ul>
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
