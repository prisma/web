"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InnerLine, Pre, type AnnotationHandler, type HighlightedCode } from "codehike/code";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type RunnerStep = {
  title: string;
  caption: string;
  lines: { from: number; to: number };
  output: string[];
};

type Props = {
  baseCode: HighlightedCode;
  steps: RunnerStep[];
};

const STEP_HOLD_MS = 6500;

const markHandler: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={annotation.query || "active"} />
  ),
};

const handlers = [markHandler];

function codeForStep(base: HighlightedCode, step: RunnerStep): HighlightedCode {
  const lineMarks = [];
  for (let n = step.lines.from; n <= step.lines.to; n += 1) {
    lineMarks.push({
      name: "mark",
      query: "active",
      fromLineNumber: n,
      toLineNumber: n,
    });
  }
  return {
    ...base,
    annotations: [
      ...base.annotations.filter((a) => a.name !== "mark"),
      ...lineMarks,
    ],
  };
}

export function BloomDemoRunnerClient({ baseCode, steps }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, STEP_HOLD_MS);
    return () => clearInterval(id);
  }, [playing, inView, steps.length]);

  const step = steps[stepIndex];
  const code = useMemo(() => codeForStep(baseCode, step), [baseCode, step]);

  useEffect(() => {
    const codeEl = codeScrollRef.current;
    if (codeEl) {
      const highlighted = codeEl.querySelector<HTMLElement>('[data-mark]');
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
    const termEl = terminalRef.current;
    if (termEl) {
      termEl.scrollTop = termEl.scrollHeight;
    }
  }, [stepIndex]);

  function goTo(index: number) {
    setPlaying(false);
    setStepIndex(((index % steps.length) + steps.length) % steps.length);
  }

  const cumulativeOutput = steps
    .slice(0, stepIndex + 1)
    .flatMap((s, i) => s.output.map((line) => ({ line, stepIdx: i })));

  return (
    <div ref={containerRef} className="runner not-prose">
      <div className="runner-header">
        <span className="runner-filename">
          <span className="runner-filename-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          index.ts
        </span>
        <span className="runner-step-counter" aria-hidden="true">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <div className="runner-nav">
          <button
            type="button"
            className="runner-toggle"
            onClick={() => goTo(stepIndex - 1)}
            aria-label="Previous step"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="runner-toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            className="runner-toggle"
            onClick={() => goTo(stepIndex + 1)}
            aria-label="Next step"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="runner-steps" role="tablist" aria-label="Demo steps">
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === stepIndex}
            data-active={i === stepIndex ? "true" : undefined}
            className="runner-step-pill"
            onClick={() => goTo(i)}
          >
            <span className="runner-step-pill-num">{i + 1}</span>
            <span className="runner-step-pill-label">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="runner-caption">{step.caption}</div>

      <div className="runner-body">
        <div className="runner-code" ref={codeScrollRef}>
          <Pre code={code} handlers={handlers} />
        </div>
        <div className="runner-terminal">
          <div className="runner-terminal-header">
            <span className="runner-terminal-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="runner-terminal-title">bun run index.ts</span>
          </div>
          <div className="runner-terminal-body" ref={terminalRef}>
            {cumulativeOutput.length === 0 ? (
              <span className="runner-terminal-placeholder">Waiting...</span>
            ) : (
              cumulativeOutput.map((entry, i) => (
                <div
                  key={i}
                  className="runner-terminal-line"
                  data-step-active={entry.stepIdx === stepIndex ? "true" : undefined}
                >
                  {entry.line || " "}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
