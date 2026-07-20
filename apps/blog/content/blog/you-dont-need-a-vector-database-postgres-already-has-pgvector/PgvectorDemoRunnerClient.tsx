"use client";

import { Component, createRef, useEffect, useRef, useState, type RefObject } from "react";
import { Pre, type HighlightedCode } from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { Check, ChevronLeft, ChevronRight, Copy, Pause, Play } from "lucide-react";

export type RunnerStep = {
  title: string;
  filename: string;
  caption: string;
  code: HighlightedCode;
  output: string[];
};

type Props = {
  steps: RunnerStep[];
};

const STEP_HOLD_MS = 6500;

class SmoothPre extends Component<{ code: HighlightedCode }> {
  preRef: RefObject<HTMLPreElement | null> = createRef();

  getSnapshotBeforeUpdate() {
    if (!this.preRef.current) return null;
    return getStartingSnapshot(this.preRef.current);
  }

  componentDidUpdate(
    _prev: { code: HighlightedCode },
    _ps: unknown,
    snap: TokenTransitionsSnapshot | null,
  ) {
    if (!this.preRef.current || !snap) return;
    const transitions = calculateTransitions(this.preRef.current, snap);
    transitions.forEach(({ element, keyframes, options }) => {
      element.animate(keyframes, {
        duration: options.duration * 1000,
        delay: options.delay * 1000,
        easing: options.easing,
        fill: options.fill,
      });
    });
  }

  render() {
    return <Pre ref={this.preRef} code={this.props.code} />;
  }
}

export function PgvectorDemoRunnerClient({ steps }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    const termEl = terminalRef.current;
    if (!termEl) return;
    const active = termEl.querySelector<HTMLElement>('[data-step-state="active"]');
    if (active) {
      const top = active.offsetTop - termEl.offsetTop;
      termEl.scrollTo({ top: Math.max(0, top - 20), behavior: "smooth" });
    }
  }, [stepIndex]);

  function goTo(index: number) {
    setPlaying(false);
    setStepIndex(((index % steps.length) + steps.length) % steps.length);
  }

  const allOutput = steps.flatMap((s, i) => s.output.map((line) => ({ line, stepIdx: i })));

  function copyOutput() {
    const text = allOutput.map((e) => e.line).join("\n");
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1600);
    });
  }

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="runner not-prose">
      <div className="runner-header">
        <span className="runner-filename">
          <span className="runner-filename-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {step.filename}
        </span>
        <span className="runner-step-counter">
          Step {stepIndex + 1} of {steps.length}
          <span className="runner-step-counter-label"> &middot; {step.title}</span>
        </span>
        <div className="runner-nav">
          <button
            type="button"
            className="runner-toggle"
            onClick={() => goTo(stepIndex - 1)}
            aria-label="Previous step"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="runner-toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            className="runner-toggle"
            onClick={() => goTo(stepIndex + 1)}
            aria-label="Next step"
          >
            <ChevronRight size={16} />
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
        <div className="runner-pane runner-pane-code">
          <div className="runner-pane-label">
            <span>{step.filename}</span>
          </div>
          <div className="runner-code">
            <SmoothPre code={step.code} />
          </div>
        </div>
        <div className="runner-pane runner-pane-terminal">
          <div className="runner-pane-label runner-pane-label-terminal">
            <span>terminal output</span>
            <button
              type="button"
              className="runner-copy"
              onClick={copyOutput}
              aria-label={copied ? "Copied terminal output" : "Copy terminal output"}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div className="runner-terminal-body" ref={terminalRef}>
            {allOutput.map((entry, i) => {
              const state =
                entry.stepIdx === stepIndex
                  ? "active"
                  : entry.stepIdx < stepIndex
                    ? "past"
                    : "future";
              return (
                <div key={i} className="runner-terminal-line" data-step-state={state}>
                  {entry.line || " "}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
