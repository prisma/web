"use client";

import { useState } from "react";
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

/**
 * Interactive decision tree that grows on screen: each answered question
 * card stays visible with its chosen answer highlighted, and the next card
 * flows out beneath it. Every node also ships server-rendered as plain text
 * (the <details> block at the bottom), so crawlers and AI engines read the
 * complete tree regardless of client-side state.
 */
export function DecisionTree({ data, label }: { data: DecisionTreeData; label: string }) {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const [path, setPath] = useState<{ nodeId: string; choice?: string }[]>([
    { nodeId: data.startId },
  ]);

  function choose(stepIndex: number, optionLabel: string, nextId: string) {
    setPath((p) => {
      const step = p[stepIndex];
      // Re-clicking the already-chosen answer changes nothing.
      if (step.choice === optionLabel && stepIndex < p.length - 1) return p;
      return [...p.slice(0, stepIndex), { nodeId: step.nodeId, choice: optionLabel }, { nodeId: nextId }];
    });
  }

  function restart() {
    setPath([{ nodeId: data.startId }]);
  }

  return (
    <div className="my-8 rounded-2xl border border-stroke-neutral-strong p-5 sm:p-6">
      <style>{`
        @keyframes dt-flow-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dt-fan-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mb-2 flex items-center justify-between gap-2">
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

      {path.map((step, i) => {
        const node = byId.get(step.nodeId);
        if (!node) return null;
        const isLast = i === path.length - 1;

        if (isResult(node)) {
          return (
            <div key={`${node.id}-${i}`}>
              <Connector />
              <div
                className="rounded-2xl bg-background-ppg p-4 sm:p-5"
                style={{ animation: "dt-flow-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both" }}
              >
                <p className="type-title-lg font-semibold text-foreground-neutral mb-2 mt-0">
                  {node.title}
                </p>
                <p className="text-sm text-foreground-neutral mb-0">{node.why}</p>
                {node.caveat && (
                  <p className="text-sm text-foreground-neutral-weak mt-2 mb-0">{node.caveat}</p>
                )}
              </div>
            </div>
          );
        }

        return (
          <div key={`${node.id}-${i}`}>
            {i > 0 && <Connector />}
            <div
              className="rounded-2xl border border-stroke-neutral-strong p-4 sm:p-5"
              style={{ animation: "dt-flow-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both" }}
            >
              <p className="font-semibold text-foreground-neutral mt-0 mb-3">{node.question}</p>
              <div className="flex flex-wrap gap-2">
                {node.options.map((opt, oi) => {
                  const chosen = step.choice === opt.label;
                  const dimmed = step.choice !== undefined && !chosen;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => choose(i, opt.label, opt.next)}
                      aria-pressed={chosen}
                      style={
                        isLast
                          ? {
                              animation: `dt-fan-in 300ms ease-out both`,
                              animationDelay: `${120 + oi * 90}ms`,
                            }
                          : undefined
                      }
                      className={[
                        "rounded-2xl border px-4 py-2.5 text-left text-sm transition-all duration-200",
                        chosen
                          ? "border-foreground-ppg bg-background-ppg text-foreground-neutral font-semibold"
                          : dimmed
                            ? "border-stroke-neutral-strong text-foreground-neutral-weak opacity-50 hover:opacity-100 hover:border-foreground-ppg hover:text-foreground-ppg"
                            : "border-stroke-neutral-strong text-foreground-neutral hover:border-foreground-ppg hover:text-foreground-ppg",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <details className="mt-5 border-t border-stroke-neutral-strong pt-3">
        <summary className="cursor-pointer text-xs text-foreground-neutral-weak hover:text-foreground-ppg">
          The same decision tree as text
        </summary>
        <TextTree byId={byId} nodeId={data.startId} />
      </details>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <div
        className="w-px h-5 bg-stroke-neutral-strong"
        style={{ animation: "dt-fan-in 240ms ease-out both" }}
      />
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
