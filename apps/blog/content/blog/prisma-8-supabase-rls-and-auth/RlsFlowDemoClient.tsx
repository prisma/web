"use client";

import { Component, createRef, Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { Pre, type HighlightedCode } from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Actor = "client" | "prisma" | "postgres";

type Phase = {
  step: number;
  label: string;
  shortLabel: string;
  actor: Actor;
  detail: string;
};

const STEP_HOLD_MS = 6500;

const ACTORS: { id: Actor; label: string }[] = [
  { id: "client", label: "Client" },
  { id: "prisma", label: "Prisma" },
  { id: "postgres", label: "Postgres" },
];

const PHASES: Phase[] = [
  {
    step: 0,
    label: "The request carries a token",
    shortLabel: "Request",
    actor: "client",
    detail:
      "Every request arrives with the user's Supabase Auth session token, a signed JWT, in the Authorization header.",
  },
  {
    step: 1,
    label: "db.asUser(jwt)",
    shortLabel: "Verify + bind",
    actor: "prisma",
    detail:
      "asUser verifies the token's signature against your project's public signing keys, then binds the user's role and id to the database session. A forged or expired token never reaches Postgres.",
  },
  {
    step: 2,
    label: "Query with no user filter",
    shortLabel: "Query",
    actor: "prisma",
    detail:
      "The handler selects notes without a where userId clause. The client has no query methods until a role is bound, so this step cannot be skipped.",
  },
  {
    step: 3,
    label: "Postgres applies the policy",
    shortLabel: "Enforce",
    actor: "postgres",
    detail:
      "Postgres evaluates the select policy for every row and returns only those where userId matches the token's auth.uid().",
  },
];

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

type Props = {
  snippets: HighlightedCode[];
};

export function RlsFlowDemoClient({ snippets }: Props) {
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
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, STEP_HOLD_MS);
    return () => clearInterval(id);
  }, [playing, inView]);

  const phase = PHASES[phaseIndex];
  const code = snippets[phaseIndex];

  function goTo(index: number) {
    setPlaying(false);
    setPhaseIndex(((index % PHASES.length) + PHASES.length) % PHASES.length);
  }

  return (
    <div ref={containerRef} className="bloom-demo rls-flow not-prose">
      <div className="bloom-demo-header">
        <span className="bloom-demo-step" aria-hidden="true">
          {phase.step + 1} / {PHASES.length}
        </span>
        <span className="bloom-demo-label">{phase.label}</span>
        <div className="bloom-demo-nav">
          <button
            type="button"
            className="bloom-demo-toggle"
            onClick={() => goTo(phaseIndex - 1)}
            aria-label="Previous step"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="bloom-demo-toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            className="bloom-demo-toggle"
            onClick={() => goTo(phaseIndex + 1)}
            aria-label="Next step"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="bloom-demo-steps" role="tablist" aria-label="RLS request flow steps">
        {PHASES.map((p, i) => (
          <button
            key={p.step}
            type="button"
            role="tab"
            aria-selected={i === phaseIndex}
            data-active={i === phaseIndex ? "true" : undefined}
            className="bloom-demo-step-pill"
            onClick={() => goTo(i)}
          >
            <span className="bloom-demo-step-pill-num">{i + 1}</span>
            <span className="bloom-demo-step-pill-label">{p.shortLabel}</span>
          </button>
        ))}
      </div>

      <div className="bloom-demo-body">
        <div className="bloom-demo-code">
          {/* Token transitions across languages (ts -> sql) lock up the main
              thread in codehike's calculateTransitions; remounting on language
              change swaps instantly instead of animating. */}
          <SmoothPre key={code.lang} code={code} />
        </div>

        <div className="rls-flow-captions">
          <div className="rls-flow-rail" aria-hidden="true">
            {ACTORS.map((actor, i) => (
              <Fragment key={actor.id}>
                {i > 0 && <span className="rls-flow-rail-arrow" />}
                <span
                  className="rls-flow-rail-node"
                  data-active={actor.id === phase.actor ? "true" : undefined}
                >
                  {actor.label}
                </span>
              </Fragment>
            ))}
          </div>
          <div className="rls-flow-caption">
            <p>{phase.detail}</p>
          </div>
          {phase.step >= 2 && (
            <div className="rls-flow-footer">
              No <code>where</code> clause in application code. The policy is the filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
