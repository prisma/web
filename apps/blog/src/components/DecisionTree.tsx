"use client";

import { useState } from "react";
import { RotateCcw, ArrowRight, CornerDownRight } from "lucide-react";

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
 * Interactive decision tree. Every node is server-rendered into the HTML
 * (the interactive walker plus a full plain-text version in a <details>
 * block), so crawlers and AI engines read the complete tree regardless of
 * client-side state.
 */
export function DecisionTree({ data, label }: { data: DecisionTreeData; label: string }) {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const [path, setPath] = useState<{ nodeId: string; choice?: string }[]>([
    { nodeId: data.startId },
  ]);

  const current = byId.get(path[path.length - 1].nodeId);

  function choose(optionLabel: string, nextId: string) {
    setPath((p) => [
      ...p.slice(0, -1),
      { nodeId: p[p.length - 1].nodeId, choice: optionLabel },
      { nodeId: nextId },
    ]);
  }

  function jumpTo(index: number) {
    setPath((p) => p.slice(0, index + 1).map((s, i) => (i === index ? { nodeId: s.nodeId } : s)));
  }

  function restart() {
    setPath([{ nodeId: data.startId }]);
  }

  return (
    <div className="my-8 rounded-2xl border border-stroke-neutral-strong p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
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

      {path.length > 1 && (
        <ol className="mb-5 space-y-1">
          {path.slice(0, -1).map((step, i) => {
            const node = byId.get(step.nodeId);
            if (!node || isResult(node) || !step.choice) return null;
            return (
              <li key={`${step.nodeId}-${i}`} className="flex items-start gap-2 text-sm">
                <CornerDownRight
                  size={14}
                  className="mt-1 shrink-0 text-foreground-neutral-weak"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="text-left text-foreground-neutral-weak hover:text-foreground-ppg"
                  title="Go back to this question"
                >
                  {node.question} <span className="font-semibold">{step.choice}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {current && !isResult(current) && (
        <div>
          <p className="type-title-lg font-semibold text-foreground-neutral mb-4">
            {current.question}
          </p>
          <div className="flex flex-col gap-2">
            {current.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => choose(opt.label, opt.next)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-stroke-neutral-strong px-4 py-3 text-left text-sm text-foreground-neutral hover:border-foreground-ppg hover:text-foreground-ppg"
              >
                <span>{opt.label}</span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-foreground-neutral-weak group-hover:text-foreground-ppg"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {current && isResult(current) && (
        <div className="rounded-2xl bg-background-ppg p-4 sm:p-5">
          <p className="type-title-lg font-semibold text-foreground-neutral mb-2">
            {current.title}
          </p>
          <p className="text-sm text-foreground-neutral mb-0">{current.why}</p>
          {current.caveat && (
            <p className="text-sm text-foreground-neutral-weak mt-2 mb-0">{current.caveat}</p>
          )}
        </div>
      )}

      <details className="mt-5 border-t border-stroke-neutral-strong pt-3">
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
