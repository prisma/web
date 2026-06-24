"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InnerLine, Pre, type AnnotationHandler, type HighlightedCode } from "codehike/code";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type BTreePhase = {
  label: string;
  caption: string;
  lines: { from: number; to: number };
  activeRoot: boolean;
  activeLeaf: 0 | 1 | 2 | null;
  matchedKey: string | null;
  query: string | null;
  found?: boolean;
};

type Props = {
  baseCode: HighlightedCode;
  phases: BTreePhase[];
};

const STEP_HOLD_MS = 5400;

const ROOT_KEYS = ["t20", "t50"];
const LEAVES: { keys: string[]; rows: number[] }[] = [
  { keys: ["t05", "t12", "t18"], rows: [105, 112, 118] },
  { keys: ["t30", "t40", "t42"], rows: [130, 140, 142] },
  { keys: ["t60", "t75", "t90"], rows: [160, 175, 190] },
];

const markHandler: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={annotation.query || "active"} />
  ),
};

const handlers = [markHandler];

function codeForPhase(base: HighlightedCode, phase: BTreePhase): HighlightedCode {
  const totalLines = (base.code ?? "").split("\n").length;
  const from = Math.max(1, Math.min(phase.lines.from, totalLines));
  const to = Math.max(from, Math.min(phase.lines.to, totalLines));
  const lineMarks = [];
  for (let n = from; n <= to; n += 1) {
    lineMarks.push({ name: "mark", query: "active", fromLineNumber: n, toLineNumber: n });
  }
  return {
    ...base,
    annotations: [...base.annotations.filter((a) => a.name !== "mark"), ...lineMarks],
  };
}

export function BTreeDemoClient({ baseCode, phases }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, STEP_HOLD_MS);
    return () => clearInterval(id);
  }, [playing, inView, phases.length]);

  const phase = phases[phaseIndex];
  const code = useMemo(() => codeForPhase(baseCode, phase), [baseCode, phase]);

  function goTo(index: number) {
    setPlaying(false);
    setPhaseIndex(((index % phases.length) + phases.length) % phases.length);
  }

  return (
    <div ref={containerRef} className="btree-demo not-prose">
      <div className="btree-demo-header">
        <span className="btree-demo-step" aria-hidden="true">
          {phaseIndex + 1} / {phases.length}
        </span>
        <span className="btree-demo-label">{phase.label}</span>
        <div className="btree-demo-nav">
          <button
            type="button"
            className="btree-demo-toggle"
            onClick={() => goTo(phaseIndex - 1)}
            aria-label="Previous step"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="btree-demo-toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            className="btree-demo-toggle"
            onClick={() => goTo(phaseIndex + 1)}
            aria-label="Next step"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="btree-demo-steps" role="tablist" aria-label="B-tree walkthrough">
        {phases.map((p, i) => (
          <button
            key={p.label}
            type="button"
            role="tab"
            aria-selected={i === phaseIndex}
            data-active={i === phaseIndex ? "true" : undefined}
            className="btree-demo-step-pill"
            onClick={() => goTo(i)}
          >
            <span className="btree-demo-step-pill-num">{i + 1}</span>
            <span className="btree-demo-step-pill-label">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="btree-demo-body">
        <div className="btree-demo-code">
          <Pre code={code} handlers={handlers} />
        </div>

        <div className="btree-demo-tree-wrap">
          {phase.query ? (
            <div className="btree-demo-query">
              <span className="btree-demo-query-label">looking for</span>
              <span className="btree-demo-query-value">"{phase.query}"</span>
            </div>
          ) : (
            <div className="btree-demo-query btree-demo-query-placeholder">
              <span>idle</span>
            </div>
          )}

          <div className="btree-demo-tree">
            <div className="btree-demo-row btree-demo-row-root">
              <div className="btree-demo-node" data-active={phase.activeRoot ? "true" : undefined}>
                <span className="btree-demo-node-label">root</span>
                <div className="btree-demo-keys">
                  {ROOT_KEYS.map((k) => (
                    <span key={k} className="btree-demo-key">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="btree-demo-edges" aria-hidden="true">
              {LEAVES.map((_, i) => (
                <div
                  key={i}
                  className="btree-demo-edge"
                  data-active={phase.activeLeaf === i ? "true" : undefined}
                />
              ))}
            </div>

            <div className="btree-demo-row btree-demo-row-leaves">
              {LEAVES.map((leaf, i) => (
                <div
                  key={i}
                  className="btree-demo-node btree-demo-leaf"
                  data-active={phase.activeLeaf === i ? "true" : undefined}
                >
                  <span className="btree-demo-node-label">leaf {i}</span>
                  <div className="btree-demo-leaf-rows">
                    {leaf.keys.map((k, j) => {
                      const matched =
                        phase.matchedKey === k && phase.activeLeaf === i ? "true" : undefined;
                      return (
                        <div
                          key={k}
                          className="btree-demo-leaf-entry"
                          data-matched={matched}
                        >
                          <span className="btree-demo-leaf-key">{k}</span>
                          <span className="btree-demo-leaf-arrow" aria-hidden="true">
                            →
                          </span>
                          <span className="btree-demo-leaf-row">row {leaf.rows[j]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="btree-demo-caption">{phase.caption}</div>

          {phase.found ? (
            <div className="btree-demo-result">
              <span className="btree-demo-result-icon" aria-hidden="true">
                ✓
              </span>
              <span>
                Found <strong>{phase.matchedKey}</strong>, returning the row pointer.
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
