"use client";

import { Component, createRef, useEffect, useRef, useState, type RefObject } from "react";
import { Pre, type HighlightedCode } from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Phase = {
  step: number;
  label: string;
  shortLabel: string;
  technical: string;
  plain: string;
};

const STEP_HOLD_MS = 6500;

const PHASES: Phase[] = [
  {
    step: 0,
    label: "The request carries a token",
    shortLabel: "Request",
    technical:
      "Every request arrives with the user's Supabase Auth session token, a signed JWT, in the Authorization header.",
    plain: "The token is the caller's ID card. It says who is asking.",
  },
  {
    step: 1,
    label: "db.asUser(jwt)",
    shortLabel: "Verify + bind",
    technical:
      "asUser checks the token's signature against your project's public keys before any connection is used, then attaches the user's role and id to the database session.",
    plain: "Prisma confirms the ID card is genuine before the database ever hears about the request.",
  },
  {
    step: 2,
    label: "Query with no user filter",
    shortLabel: "Query",
    technical:
      "The handler selects notes without a where userId clause. The client cannot run a query at all until a role is bound, so there is no way to skip this step.",
    plain: "The code never says “only my notes”. It doesn't have to.",
  },
  {
    step: 3,
    label: "Postgres applies the policy",
    shortLabel: "Enforce",
    technical:
      "Postgres evaluates the SELECT policy for every row and keeps only those where userId matches the verified token's auth.uid().",
    plain: "The database itself hands back only the rows that belong to the caller.",
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
          <div className="rls-flow-caption">
            <span className="rls-flow-caption-tag">What happens</span>
            <p>{phase.technical}</p>
          </div>
          <div className="rls-flow-caption">
            <span className="rls-flow-caption-tag">In plain terms</span>
            <p>{phase.plain}</p>
          </div>
          <div className="rls-flow-footer">
            No <code>where</code> clause in application code. The policy is the filter.
          </div>
        </div>
      </div>
    </div>
  );
}
