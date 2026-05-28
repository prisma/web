"use client";

import { Component, createRef, useEffect, useRef, useState, type RefObject } from "react";
import { Pre, type HighlightedCode } from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Verdict = "idle" | "present" | "absent" | "false-positive";

type Phase = {
  step: number;
  label: string;
  shortLabel: string;
  caption: string;
  bits: boolean[];
  flipping: number[];
  probe: number[];
  verdict: Verdict;
  subject?: string;
};

const SIZE = 16;
const STEP_HOLD_MS = 5200;

function makeBits(positions: number[]): boolean[] {
  const out: boolean[] = Array.from({ length: SIZE }, () => false);
  for (const p of positions) out[p] = true;
  return out;
}

const ALICE = [2, 7, 11];
const BOB = [4, 7, 13];
const CAROL = [0, 5, 9];
const DAVE = [4, 11, 13];

const PHASES: Phase[] = [
  {
    step: 0,
    label: "Empty filter",
    shortLabel: "Empty",
    caption: "A 16-bit array, all zeros. Nothing has been added yet.",
    bits: makeBits([]),
    flipping: [],
    probe: [],
    verdict: "idle",
  },
  {
    step: 1,
    label: 'add("alice")',
    shortLabel: "Add alice",
    caption: "Three hash functions map alice to positions 2, 7 and 11. Flip those bits to 1.",
    bits: makeBits(ALICE),
    flipping: ALICE,
    probe: [],
    verdict: "idle",
    subject: "alice",
  },
  {
    step: 2,
    label: 'add("bob")',
    shortLabel: "Add bob",
    caption:
      "Bob hashes to 4, 7 and 13. Position 7 was already 1 from alice, so it stays 1. No way to tell who set it.",
    bits: makeBits([...ALICE, ...BOB]),
    flipping: BOB,
    probe: [],
    verdict: "idle",
    subject: "bob",
  },
  {
    step: 3,
    label: 'check("alice")',
    shortLabel: "Check alice",
    caption:
      "Hash alice again, look at the same positions. All three are 1, so alice is probably present.",
    bits: makeBits([...ALICE, ...BOB]),
    flipping: [],
    probe: ALICE,
    verdict: "present",
    subject: "alice",
  },
  {
    step: 4,
    label: 'check("carol")',
    shortLabel: "Check carol",
    caption: "Carol hashes to 0, 5 and 9. Position 0 is still 0, so carol was never added. Hard no.",
    bits: makeBits([...ALICE, ...BOB]),
    flipping: [],
    probe: CAROL,
    verdict: "absent",
    subject: "carol",
  },
  {
    step: 5,
    label: 'check("dave")',
    shortLabel: "Check dave",
    caption:
      "Dave hashes to 4, 11 and 13. All three happen to be 1 from alice and bob, even though dave was never added. That is a false positive: tolerable because the database rechecks against the row.",
    bits: makeBits([...ALICE, ...BOB]),
    flipping: [],
    probe: DAVE,
    verdict: "false-positive",
    subject: "dave",
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

export function BloomFilterDemoClient({ snippets }: Props) {
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
    <div ref={containerRef} className="bloom-demo not-prose" data-verdict={phase.verdict}>
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

      <div className="bloom-demo-steps" role="tablist" aria-label="Bloom filter walkthrough steps">
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
          <SmoothPre code={code} />
        </div>

        <div className="bloom-demo-array-wrap">
          <div className="bloom-demo-array" role="img" aria-label="Bloom filter bit array">
            {phase.bits.map((bit, i) => {
              const isFlipping = phase.flipping.includes(i);
              const isProbe = phase.probe.includes(i);
              return (
                <div
                  key={i}
                  className="bloom-demo-cell"
                  data-bit={bit ? 1 : 0}
                  data-flipping={isFlipping ? "true" : undefined}
                  data-probe={isProbe ? "true" : undefined}
                >
                  <span className="bloom-demo-cell-index" aria-hidden="true">
                    {i}
                  </span>
                  <span className="bloom-demo-cell-value">{bit ? "1" : "0"}</span>
                </div>
              );
            })}
          </div>

          <div className="bloom-demo-caption">{phase.caption}</div>

          <div className="bloom-demo-verdict" data-verdict={phase.verdict}>
            {phase.verdict === "present" && (
              <>
                <span className="bloom-demo-verdict-icon" aria-hidden="true">
                  ?
                </span>
                <span>
                  <strong>{phase.subject}</strong> is probably present. Recheck against the row to
                  confirm.
                </span>
              </>
            )}
            {phase.verdict === "absent" && (
              <>
                <span className="bloom-demo-verdict-icon" aria-hidden="true">
                  ✕
                </span>
                <span>
                  <strong>{phase.subject}</strong> is definitely not present. A 0 bit is a hard no.
                </span>
              </>
            )}
            {phase.verdict === "false-positive" && (
              <>
                <span className="bloom-demo-verdict-icon" aria-hidden="true">
                  !
                </span>
                <span>
                  <strong>{phase.subject}</strong> looks present, but was never added. That is a
                  false positive.
                </span>
              </>
            )}
            {phase.verdict === "idle" && (
              <span className="bloom-demo-verdict-placeholder">
                {phase.subject ? "added" : "ready"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
