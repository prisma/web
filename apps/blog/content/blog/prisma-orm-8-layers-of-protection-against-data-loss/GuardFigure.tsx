"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  InnerLine,
  InnerToken,
  Pre,
  type AnnotationHandler,
  type HighlightedCode,
} from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { TRACK_STATE_TEXT, type TrackState } from "./trackState";
import { Check, ChevronLeft, ChevronRight, Minus, X } from "lucide-react";

export type Verdict = "blocked" | "warned" | "allowed" | "gap" | "info";

export type TermLine = {
  text: string;
  kind?: "cmd" | "err" | "why" | "next" | "ok" | "warn" | "dim" | "note";
};

export type TrackItem = {
  label: string;
  state: TrackState;
};

export type DbColumn = { name: string; state?: "lost" | "new" };

export type DbState = {
  table: string;
  note: string;
  tone?: Verdict;
  columns: DbColumn[];
  rows: string[][];
};

export type GuardStep = {
  title: string;
  verdict: Verdict;
  verdictLabel: string;
  caption: ReactNode;
  filename?: string;
  code?: HighlightedCode;
  terminal?: TermLine[];
  track?: TrackItem[];
  db?: DbState;
};

type Props = {
  label: string;
  steps: GuardStep[];
  /** "steps" numbers the pills as a sequence. "cases" treats them as alternatives. */
  mode?: "steps" | "cases";
};

// Marked lines carry the reason a step exists: the field that changed, the
// policy line a refusal points at. The annotation query names the tone.
const markHandler: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={annotation.query || "focus"} />
  ),
};

// A moved token is animated with `translate`, which has no effect on an
// inline box, so every token is an inline-block.
const tokenHandler: AnnotationHandler = {
  name: "token-transitions",
  Token: (props) => <InnerToken merge={props} style={{ display: "inline-block" }} />,
};

const handlers = [markHandler, tokenHandler];

// Code Hike reports a move as translateX/translateY number pairs. Those are
// not animatable properties, so they become `translate` keyframes in px.
function toKeyframes(keyframes: {
  translateX?: number[];
  translateY?: number[];
  color?: string[];
  opacity?: number[];
}): PropertyIndexedKeyframes {
  const { translateX, translateY, ...rest } = keyframes;
  if (!translateX || !translateY) return rest;
  return {
    ...rest,
    translate: translateX.map((x, i) => `${x}px ${translateY[i] ?? 0}px`),
  };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function TrackIcon({ state }: { state: TrackItem["state"] }) {
  if (state === "done") return <Check size={11} strokeWidth={3} aria-hidden="true" />;
  if (state === "stop" || state === "lost")
    return <X size={11} strokeWidth={3} aria-hidden="true" />;
  if (state === "skip") return <Minus size={11} strokeWidth={3} aria-hidden="true" />;
  return null;
}

export function GuardFigure({ label, steps, mode = "steps" }: Props) {
  const [index, setIndex] = useState(0);
  const preRefs = useRef<(HTMLPreElement | null)[]>([]);
  const snapshotRef = useRef<{ snap: TokenTransitionsSnapshot; lang: string } | null>(null);
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  const hasCode = steps.some((s) => s.code);
  const hasTerminal = steps.some((s) => s.terminal);
  const hasTrack = steps.some((s) => s.track);
  const hasDb = steps.some((s) => s.db);
  const hasSide = hasTrack || hasDb;

  // Every step is rendered into the same grid cell and only the active one is
  // visible, so the figure is always as tall as its tallest step and nothing
  // around it moves. The code morph reads token positions from the outgoing
  // step and animates the incoming one from there.
  function goTo(next: number) {
    const target = ((next % steps.length) + steps.length) % steps.length;
    if (target === index) return;
    const pre = preRefs.current[index];
    const lang = steps[index].code?.lang;
    snapshotRef.current =
      pre && lang && !prefersReducedMotion() ? { snap: getStartingSnapshot(pre), lang } : null;
    setIndex(target);
  }

  useLayoutEffect(() => {
    const pending = snapshotRef.current;
    snapshotRef.current = null;
    const pre = preRefs.current[index];
    const code = steps[index].code;
    // Token diffs across two languages are slow and meaningless, so a
    // language change swaps instantly.
    if (!pending || !pre || !code || code.lang !== pending.lang) return;
    calculateTransitions(pre, pending.snap).forEach(({ element, keyframes, options }) => {
      element.animate(toKeyframes(keyframes), {
        duration: options.duration * 1000,
        delay: options.delay * 1000,
        easing: options.easing,
        fill: options.fill,
      });
    });
  }, [index, steps]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    const count = steps.length;
    let next = i;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    goTo(next);
    const tabs = event.currentTarget.parentElement?.children;
    (tabs?.[next] as HTMLElement | undefined)?.focus();
  }

  const layerProps = (i: number) => ({
    className: "guard-layer",
    "data-active": i === index ? "true" : undefined,
    "aria-hidden": i === index ? undefined : true,
    inert: i !== index,
  });

  return (
    <figure className="guard not-prose" aria-label={label} data-mode={mode}>
      <div className="guard-head">
        <div className="guard-tabs" role="tablist" aria-label={label}>
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={i === index}
              aria-controls={panelId}
              tabIndex={i === index ? 0 : -1}
              data-active={i === index ? "true" : undefined}
              data-verdict={s.verdict}
              className="guard-tab"
              onClick={() => goTo(i)}
              onKeyDown={(event) => onTabKeyDown(event, i)}
            >
              <span className="guard-tab-num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="guard-tab-label">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="guard-nav">
          <button
            type="button"
            className="guard-nav-btn"
            onClick={() => goTo(index - 1)}
            aria-label={mode === "steps" ? "Previous step" : "Previous case"}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <span className="guard-nav-count">
            {index + 1} / {steps.length}
          </span>
          <button
            type="button"
            className="guard-nav-btn"
            onClick={() => goTo(index + 1)}
            aria-label={mode === "steps" ? "Next step" : "Next case"}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="guard-body"
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(index)}
        tabIndex={0}
        data-side={hasSide ? "true" : undefined}
      >
        <div className="guard-main">
          {hasCode && (
            <div className="guard-pane guard-pane-code">
              <div className="guard-stack guard-pane-label">
                {steps.map((s, i) => (
                  <span key={s.title} {...layerProps(i)}>
                    {s.filename ?? " "}
                  </span>
                ))}
              </div>
              <div className="guard-stack guard-code">
                {steps.map((s, i) => (
                  <div key={s.title} {...layerProps(i)}>
                    {s.code && (
                      <Pre
                        ref={(el: HTMLPreElement | null) => {
                          preRefs.current[i] = el;
                        }}
                        code={s.code}
                        handlers={handlers}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasTerminal && (
            <div className="guard-pane guard-pane-terminal">
              <div className="guard-pane-label">terminal</div>
              <div className="guard-stack guard-terminal">
                {steps.map((s, i) => (
                  <div key={s.title} {...layerProps(i)}>
                    {(s.terminal ?? []).map((line, n) => (
                      <div key={n} className="guard-term-line" data-kind={line.kind ?? "out"}>
                        {line.kind === "cmd" && (
                          <span className="guard-term-prompt" aria-hidden="true">
                            ${" "}
                          </span>
                        )}
                        {line.text || " "}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasSide && (
          <div className="guard-side">
            {hasTrack && (
              <div className="guard-stack guard-track-wrap">
                {steps.map((s, i) => (
                  <ol key={s.title} {...layerProps(i)} className="guard-layer guard-track">
                    {(s.track ?? []).map((item) => (
                      <li key={item.label} className="guard-track-item" data-state={item.state}>
                        <span className="guard-track-dot">
                          <TrackIcon state={item.state} />
                        </span>
                        <span className="guard-track-label">
                          {item.label}
                          <span className="guard-sr">, {TRACK_STATE_TEXT[item.state]}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                ))}
              </div>
            )}

            {hasDb && (
              <div className="guard-stack guard-db-wrap">
                {steps.map((s, i) => (
                  <div key={s.title} {...layerProps(i)}>
                    {s.db && (
                      <div className="guard-db" data-tone={s.db.tone ?? "info"}>
                        <div className="guard-db-head">
                          <span className="guard-db-name">{s.db.table}</span>
                          <span className="guard-db-note">{s.db.note}</span>
                        </div>
                        <div className="guard-db-scroll">
                          <table className="guard-db-table">
                            <thead>
                              <tr>
                                {s.db.columns.map((c) => (
                                  <th key={c.name} scope="col" data-state={c.state}>
                                    {c.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {s.db.rows.map((row, r) => (
                                <tr key={r}>
                                  {row.map((cell, c) => (
                                    <td key={c} data-state={s.db?.columns[c]?.state}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="guard-stack guard-foot">
        {steps.map((s, i) => (
          <div key={s.title} {...layerProps(i)}>
            <span className="guard-foot-head">
              <span className="guard-verdict" data-verdict={s.verdict}>
                {s.verdictLabel}
              </span>
              <span className="guard-foot-title" aria-hidden="true">
                {i + 1}. {s.title}
              </span>
            </span>
            <p className="guard-caption">{s.caption}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
