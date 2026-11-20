"use client";

import { useId, useState, type KeyboardEvent } from "react";

export type Layer = {
  name: string;
  heading: string;
  risk: string;
  check: string;
  setup: "Automatic" | "Declare a policy";
  effect: "Not available" | "Blocks" | "Warns";
  remains: string;
};

type Props = {
  label: string;
  layers: Layer[];
};

// The rail is the tab list: a change enters on the left and reaches the
// database on the right only after it has passed every stage before it.
export function LayerMap({ label, layers }: Props) {
  const [index, setIndex] = useState(0);
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    const count = layers.length;
    let next = i;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    setIndex(next);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs?.[next]?.focus();
  }

  return (
    <figure className="layers not-prose" aria-label={label}>
      <div className="layers-rail">
        <span className="layers-end" aria-hidden="true">
          Schema edit
        </span>
        <div className="layers-tabs" role="tablist" aria-label={label}>
          {layers.map((layer, i) => (
            <button
              key={layer.name}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={i === index}
              aria-controls={panelId}
              tabIndex={i === index ? 0 : -1}
              className="layers-tab"
              data-active={i === index ? "true" : undefined}
              data-passed={i < index ? "true" : undefined}
              data-setup={layer.setup === "Automatic" ? "auto" : "policy"}
              onClick={() => setIndex(i)}
              onKeyDown={(event) => onKeyDown(event, i)}
            >
              <span className="layers-node" aria-hidden="true">
                {i + 1}
              </span>
              <span className="layers-name">{layer.name}</span>
            </button>
          ))}
        </div>
        <span className="layers-end" aria-hidden="true">
          Database
        </span>
      </div>

      <p className="layers-legend" aria-hidden="true">
        <span data-setup="auto">Automatic</span>
        <span data-setup="policy">Needs a declared policy</span>
      </p>

      <div className="layers-stack" role="tabpanel" id={panelId} aria-labelledby={tabId(index)}>
        {layers.map((layer, i) => (
          <div
            key={layer.name}
            className="layers-panel"
            data-active={i === index ? "true" : undefined}
            aria-hidden={i === index ? undefined : true}
            inert={i !== index}
          >
            <div className="layers-panel-head">
              <span className="layers-panel-title">
                <span className="layers-panel-num">{i + 1}</span>
                {layer.heading}
              </span>
              <span className="layers-chips">
                <span
                  className="layers-chip"
                  data-setup={layer.setup === "Automatic" ? "auto" : "policy"}
                >
                  {layer.setup}
                </span>
                <span className="layers-chip" data-effect={layer.effect}>
                  {layer.effect}
                </span>
              </span>
            </div>
            <dl className="layers-facts">
              <div>
                <dt>What goes wrong</dt>
                <dd>{layer.risk}</dd>
              </div>
              <div>
                <dt>What Prisma checks</dt>
                <dd>{layer.check}</dd>
              </div>
              <div>
                <dt>What it leaves to you</dt>
                <dd>{layer.remains}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </figure>
  );
}
