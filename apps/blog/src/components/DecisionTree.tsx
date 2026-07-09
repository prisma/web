"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

export type DecisionResult = {
  id: string;
  title: string;
  why: string;
  caveat?: string;
};

export type DecisionQuestion = {
  id: string;
  question: string;
  options: { label: string; next: string }[];
};

export type DecisionNode = DecisionQuestion | DecisionResult;

export type DecisionTreeData = {
  startId: string;
  nodes: DecisionNode[];
};

function isResult(node: DecisionNode): node is DecisionResult {
  return !("options" in node);
}

type Line = { x1: number; y1: number; x2: number; y2: number };

/**
 * Decision tree rendered as a schema-diagram canvas: cards on a dotted
 * grid, answers as rows inside each card, dashed connectors from the
 * chosen answer to the next card. Every node also ships server-rendered
 * as plain text (the <details> block), so crawlers and AI engines read
 * the complete tree regardless of client-side state.
 */
export function DecisionTree({ data, label }: { data: DecisionTreeData; label: string }) {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const [path, setPath] = useState<{ nodeId: string; choice?: string }[]>([
    { nodeId: data.startId },
  ]);
  const [lines, setLines] = useState<Line[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chosenRowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function choose(stepIndex: number, optionLabel: string, nextId: string) {
    setPath((p) => {
      const step = p[stepIndex];
      if (step.choice === optionLabel && stepIndex < p.length - 1) return p;
      return [
        ...p.slice(0, stepIndex),
        { nodeId: step.nodeId, choice: optionLabel },
        { nodeId: nextId },
      ];
    });
  }

  function restart() {
    setPath([{ nodeId: data.startId }]);
  }

  // Offset-based measurement (unaffected by entrance transforms).
  function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
    let x = 0;
    let y = 0;
    let cur: HTMLElement | null = el;
    while (cur && cur !== ancestor) {
      x += cur.offsetLeft;
      y += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    return { x, y };
  }

  useLayoutEffect(() => {
    function measure() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const next: Line[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        const row = chosenRowRefs.current[i];
        const target = cardRefs.current[i + 1];
        if (!row || !target) continue;
        const from = offsetWithin(row, canvas);
        const to = offsetWithin(target, canvas);
        next.push({
          x1: from.x + row.offsetWidth,
          y1: from.y + row.offsetHeight / 2,
          x2: to.x,
          y2: to.y + 26,
        });
      }
      setLines((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [path]);

  return (
    <div className="my-8 rounded-2xl border border-stroke-neutral-strong overflow-hidden">
      <style>{`
        @keyframes dt-card-in {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dt-line-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="flex items-center justify-between gap-2 border-b border-stroke-neutral-strong px-4 py-2.5">
        <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak font-semibold">
          {label}
        </div>
        {path.length > 1 && (
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1 text-xs text-foreground-neutral-weak hover:text-foreground-ppg"
          >
            <RotateCcw size={12} aria-hidden />
            Start over
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div
          ref={canvasRef}
          className="relative min-w-max p-6 sm:p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, color-mix(in srgb, currentColor 18%, transparent) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-foreground-neutral-weak"
            aria-hidden
          >
            {lines.map((l, i) => {
              const dx = Math.max(24, (l.x2 - l.x1) / 2);
              return (
                <path
                  key={i}
                  d={`M ${l.x1} ${l.y1} C ${l.x1 + dx} ${l.y1}, ${l.x2 - dx} ${l.y2}, ${l.x2} ${l.y2}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeDasharray="4 4"
                  style={{ animation: "dt-line-in 240ms ease-out both", animationDelay: "220ms" }}
                />
              );
            })}
          </svg>

          <div className="relative flex items-start gap-12 sm:gap-16">
            {path.map((step, i) => {
              const node = byId.get(step.nodeId);
              if (!node) return null;
              const stagger = (i % 2) * 28;

              if (isResult(node)) {
                return (
                  <div
                    key={`${node.id}-${i}`}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="w-72 shrink-0 rounded-lg border border-foreground-ppg bg-background-ppg shadow-sm"
                    style={{
                      marginTop: stagger,
                      animation: "dt-card-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
                      <span className="font-semibold text-foreground-neutral text-sm">
                        {node.title}
                      </span>
                      <span className="shrink-0 rounded-full border border-foreground-ppg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-ppg">
                        Match
                      </span>
                    </div>
                    <div className="px-4 pb-4">
                      <p className="text-xs leading-relaxed text-foreground-neutral my-0">
                        {node.why}
                      </p>
                      {node.caveat && (
                        <p className="text-xs leading-relaxed text-foreground-neutral-weak mt-2 mb-0">
                          {node.caveat}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={`${node.id}-${i}`}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="w-64 shrink-0 rounded-lg border border-stroke-neutral-strong bg-background-neutral shadow-sm"
                  style={{
                    marginTop: stagger,
                    animation: "dt-card-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
                    <span className="font-semibold text-foreground-neutral text-sm">
                      {node.question}
                    </span>
                    <span className="shrink-0 rounded-full border border-stroke-neutral-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-neutral-weak">
                      Q{i + 1}
                    </span>
                  </div>
                  <div className="border-t border-stroke-neutral-strong">
                    {node.options.map((opt) => {
                      const chosen = step.choice === opt.label;
                      const dimmed = step.choice !== undefined && !chosen;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => choose(i, opt.label, opt.next)}
                          aria-pressed={chosen}
                          ref={(el) => {
                            if (chosen) chosenRowRefs.current[i] = el;
                          }}
                          className={[
                            "block w-full border-b border-stroke-neutral-strong px-4 py-2 text-left text-xs last:border-b-0 transition-colors duration-150",
                            chosen
                              ? "bg-background-ppg font-semibold text-foreground-neutral"
                              : dimmed
                                ? "text-foreground-neutral-weak opacity-60 hover:opacity-100 hover:text-foreground-ppg"
                                : "text-foreground-neutral hover:text-foreground-ppg",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <details className="border-t border-stroke-neutral-strong px-4 py-3">
        <summary className="cursor-pointer text-xs text-foreground-neutral-weak hover:text-foreground-ppg">
          The same decision tree as text
        </summary>
        <TextTree byId={byId} nodeId={data.startId} />
      </details>
    </div>
  );
}

function TextTree({
  byId,
  nodeId,
}: {
  byId: Map<string, DecisionNode>;
  nodeId: string;
}) {
  const node = byId.get(nodeId);
  if (!node) return null;
  if (isResult(node)) {
    return (
      <p className="text-sm text-foreground-neutral my-2">
        <strong>{node.title}.</strong> {node.why}
        {node.caveat ? ` ${node.caveat}` : ""}
      </p>
    );
  }
  return (
    <div className="my-2">
      <p className="text-sm font-semibold text-foreground-neutral my-2">{node.question}</p>
      <ul className="list-none pl-4 my-0">
        {node.options.map((opt) => (
          <li key={opt.label} className="my-2 border-l border-stroke-neutral-strong pl-3">
            <span className="text-sm text-foreground-neutral-weak">{opt.label}:</span>
            <TextTree byId={byId} nodeId={opt.next} />
          </li>
        ))}
      </ul>
    </div>
  );
}
