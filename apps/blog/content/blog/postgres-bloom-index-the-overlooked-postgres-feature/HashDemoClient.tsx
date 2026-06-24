"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InnerLine, Pre, type AnnotationHandler, type HighlightedCode } from "codehike/code";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type HashPhase = {
  label: string;
  caption: string;
  lines: { from: number; to: number };
  completed: number;
  activeHash: 0 | 1 | 2 | null;
};

type Props = {
  baseCode: HighlightedCode;
  phases: HashPhase[];
};

const STEP_HOLD_MS = 4800;
const SIZE = 16;

const HASHES: { name: string; raw: number; bit: number }[] = [
  { name: "fnv1a", raw: 0x4f5b9aa2, bit: 2 },
  { name: "djb2", raw: 0x0a7c8367, bit: 7 },
  { name: "murmur3", raw: 0x1b2e904b, bit: 11 },
];

const markHandler: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={annotation.query || "active"} />
  ),
};

const handlers = [markHandler];

function codeForPhase(base: HighlightedCode, phase: HashPhase): HighlightedCode {
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

export function HashDemoClient({ baseCode, phases }: Props) {
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

  const litBits = HASHES.slice(0, phase.completed).map((h) => h.bit);

  return (
    <div ref={containerRef} className="hash-demo not-prose">
      <div className="hash-demo-header">
        <span className="hash-demo-step" aria-hidden="true">
          {phaseIndex + 1} / {phases.length}
        </span>
        <span className="hash-demo-label">{phase.label}</span>
        <div className="hash-demo-nav">
          <button
            type="button"
            className="hash-demo-toggle"
            onClick={() => goTo(phaseIndex - 1)}
            aria-label="Previous step"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="hash-demo-toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            className="hash-demo-toggle"
            onClick={() => goTo(phaseIndex + 1)}
            aria-label="Next step"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="hash-demo-body">
        <div className="hash-demo-code">
          <Pre code={code} handlers={handlers} />
        </div>

        <div className="hash-demo-viz">
          <div className="hash-demo-input">
            <span className="hash-demo-input-label">item</span>
            <span className="hash-demo-input-value">"alice"</span>
          </div>

          <div className="hash-demo-pipes">
            {HASHES.map((h, i) => {
              const done = i < phase.completed;
              const active = phase.activeHash === i;
              return (
                <div
                  key={h.name}
                  className="hash-demo-pipe"
                  data-state={active ? "active" : done ? "done" : "pending"}
                >
                  <div className="hash-demo-pipe-name">{h.name}</div>
                  <div className="hash-demo-pipe-arrow" aria-hidden="true">
                    ↓
                  </div>
                  <div className="hash-demo-pipe-raw">
                    {active || done ? `0x${h.raw.toString(16)}` : "..."}
                  </div>
                  <div className="hash-demo-pipe-mod" aria-hidden="true">
                    mod {SIZE}
                  </div>
                  <div className="hash-demo-pipe-bit">{active || done ? h.bit : "?"}</div>
                </div>
              );
            })}
          </div>

          <div className="hash-demo-array" role="img" aria-label="Bit positions chosen by the three hashes">
            {Array.from({ length: SIZE }, (_, i) => {
              const isLit = litBits.includes(i);
              const isProbing = phase.activeHash !== null && HASHES[phase.activeHash].bit === i;
              return (
                <div
                  key={i}
                  className="hash-demo-cell"
                  data-lit={isLit ? "true" : undefined}
                  data-probing={isProbing ? "true" : undefined}
                >
                  <span className="hash-demo-cell-index" aria-hidden="true">
                    {i}
                  </span>
                  <span className="hash-demo-cell-value">{isLit ? "1" : "0"}</span>
                </div>
              );
            })}
          </div>

          <div className="hash-demo-caption">{phase.caption}</div>
        </div>
      </div>
    </div>
  );
}
