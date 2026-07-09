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
 * Decision tree rendered as a schema-diagram canvas that grows downwards:
 * cards on a dotted grid with answers as field-style rows. Clicking an
 * answer expands its branch beneath the card, connected by a dashed line;
 * several branches can be open side by side. Every node also ships
 * server-rendered as plain text (the <details> block), so crawlers and AI
 * engines read the complete tree regardless of client-side state.
 */
export function DecisionTree({ data, label }: { data: DecisionTreeData; label: string }) {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  // Expanded edges, keyed "questionId::optionLabel".
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [lines, setLines] = useState<Line[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function toggle(edgeKey: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(edgeKey)) next.delete(edgeKey);
      else next.add(edgeKey);
      return next;
    });
  }

  function restart() {
    setExpanded(new Set());
  }

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
      for (const edgeKey of expanded) {
        const row = rowRefs.current.get(edgeKey);
        const card = cardRefs.current.get(edgeKey);
        if (!row || !card) continue;
        const from = offsetWithin(row, canvas);
        const to = offsetWithin(card, canvas);
        next.push({
          x1: from.x + row.offsetWidth / 2,
          y1: from.y + row.offsetHeight,
          x2: to.x + card.offsetWidth / 2,
          y2: to.y,
        });
      }
      setLines((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [expanded]);

  return (
    <div className="my-8 rounded-2xl border border-stroke-neutral-strong overflow-hidden">
      <style>{`
        @keyframes dt-card-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
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
        {expanded.size > 0 && (
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1 text-xs text-foreground-neutral-weak hover:text-foreground-ppg"
          >
            <RotateCcw size={12} aria-hidden />
            Collapse all
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div
          ref={canvasRef}
          className="relative p-6 sm:p-8"
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
              const dy = Math.max(16, (l.y2 - l.y1) / 2);
              return (
                <path
                  key={i}
                  d={`M ${l.x1} ${l.y1} C ${l.x1} ${l.y1 + dy}, ${l.x2} ${l.y2 - dy}, ${l.x2} ${l.y2}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeDasharray="4 4"
                  style={{ animation: "dt-line-in 220ms ease-out both", animationDelay: "160ms" }}
                />
              );
            })}
          </svg>

          <div className="relative flex justify-center">
            <TreeBranch
              byId={byId}
              nodeId={data.startId}
              edgeKey="root"
              depth={1}
              expanded={expanded}
              toggle={toggle}
              cardRefs={cardRefs}
              rowRefs={rowRefs}
            />
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

function TreeBranch({
  byId,
  nodeId,
  edgeKey,
  depth,
  expanded,
  toggle,
  cardRefs,
  rowRefs,
}: {
  byId: Map<string, DecisionNode>;
  nodeId: string;
  edgeKey: string;
  depth: number;
  expanded: Set<string>;
  toggle: (edgeKey: string) => void;
  cardRefs: { current: Map<string, HTMLDivElement> };
  rowRefs: { current: Map<string, HTMLButtonElement> };
}) {
  const node = byId.get(nodeId);
  if (!node) return null;

  if (isResult(node)) {
    return (
      <div
        ref={(el) => {
          if (el) cardRefs.current.set(edgeKey, el);
          else cardRefs.current.delete(edgeKey);
        }}
        className="w-72 shrink-0 rounded-lg border border-foreground-ppg bg-background-ppg shadow-sm"
        style={{ animation: "dt-card-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both" }}
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
          <span className="font-semibold text-foreground-neutral text-sm">{node.title}</span>
          <span className="shrink-0 rounded-full border border-foreground-ppg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-ppg">
            Match
          </span>
        </div>
        <div className="px-4 pb-4">
          <p className="text-xs leading-relaxed text-foreground-neutral my-0">{node.why}</p>
          {node.caveat && (
            <p className="text-xs leading-relaxed text-foreground-neutral-weak mt-2 mb-0">
              {node.caveat}
            </p>
          )}
        </div>
      </div>
    );
  }

  const openEdges = node.options.filter((o) => expanded.has(`${node.id}::${o.label}`));

  return (
    <div className="flex flex-col items-center">
      <div
        ref={(el) => {
          if (el) cardRefs.current.set(edgeKey, el);
          else cardRefs.current.delete(edgeKey);
        }}
        className="w-64 shrink-0 rounded-lg border border-stroke-neutral-strong bg-background-neutral shadow-sm"
        style={{ animation: "dt-card-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both" }}
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
          <span className="font-semibold text-foreground-neutral text-sm">{node.question}</span>
          <span className="shrink-0 rounded-full border border-stroke-neutral-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-neutral-weak">
            Q{depth}
          </span>
        </div>
        <div className="border-t border-stroke-neutral-strong">
          {node.options.map((opt) => {
            const key = `${node.id}::${opt.label}`;
            const open = expanded.has(key);
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => toggle(key)}
                aria-expanded={open}
                ref={(el) => {
                  if (el) rowRefs.current.set(key, el);
                  else rowRefs.current.delete(key);
                }}
                className={[
                  "block w-full border-b border-stroke-neutral-strong px-4 py-2 text-left text-xs last:border-b-0 transition-colors duration-150",
                  open
                    ? "bg-background-ppg font-semibold text-foreground-neutral"
                    : "text-foreground-neutral hover:text-foreground-ppg",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {openEdges.length > 0 && (
        <div className="mt-12 flex items-start justify-center gap-8 sm:gap-12">
          {openEdges.map((opt) => (
            <TreeBranch
              key={opt.label}
              byId={byId}
              nodeId={opt.next}
              edgeKey={`${node.id}::${opt.label}`}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              cardRefs={cardRefs}
              rowRefs={rowRefs}
            />
          ))}
        </div>
      )}
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
