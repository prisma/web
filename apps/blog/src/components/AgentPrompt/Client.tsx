"use client";

import {
  Component,
  createRef,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  InnerLine,
  Pre,
  type AnnotationHandler,
  type HighlightedCode,
} from "codehike/code";
import {
  calculateTransitions,
  getStartingSnapshot,
  type TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { Pause, Play } from "lucide-react";

type Phase =
  | "idle"
  | "typing"
  | "thinking"
  | "morphing"
  | "running"
  | "settled";

const TYPE_CHAR_MS = 45;
const PAUSE_AFTER_TYPING_MS = 900;
const MORPH_VISIBLE_MS = 1800;
const TERMINAL_PROMPT_MS = 420;
const TERMINAL_LINE_MS = 540;
const SETTLED_HOLD_MS = 2800;

const markHandler: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={annotation.query || "add"} />
  ),
};

const handlers = [markHandler];

class SmoothPre extends Component<{
  code: HighlightedCode;
  className?: string;
}> {
  preRef: RefObject<HTMLPreElement | null> = createRef();

  getSnapshotBeforeUpdate() {
    if (!this.preRef.current) return null;
    return getStartingSnapshot(this.preRef.current);
  }

  componentDidUpdate(
    _prevProps: { code: HighlightedCode },
    _prevState: unknown,
    snapshot: TokenTransitionsSnapshot | null,
  ) {
    if (!this.preRef.current || !snapshot) return;
    const transitions = calculateTransitions(this.preRef.current, snapshot);
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
    return (
      <Pre
        ref={this.preRef}
        code={this.props.code}
        handlers={handlers}
        className={this.props.className}
      />
    );
  }
}

type Props = {
  prompt: string;
  before?: HighlightedCode;
  after?: HighlightedCode;
  fileName?: string;
  skill?: string;
  terminalCommand?: string;
  terminalLines?: string[];
  maxCodeLines?: number;
};

export function AgentPromptClient({
  prompt,
  before,
  after,
  fileName,
  skill,
  terminalCommand,
  terminalLines,
  maxCodeLines,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [showAfter, setShowAfter] = useState(false);
  const [terminalVisibleLines, setTerminalVisibleLines] = useState(0);
  const [terminalCmdTyped, setTerminalCmdTyped] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasCode = before != null && after != null;
  const hasTerminal = terminalLines != null && terminalLines.length > 0;
  const hasTerminalCommand = terminalCommand != null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (ms: number, fn: () => void) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
    };

    const run = () => {
      if (cancelled) return;
      setShowAfter(false);
      setTyped("");
      setTerminalVisibleLines(0);
      setTerminalCmdTyped(false);
      setPhase("typing");

      // Phase 1: typewriter (user prompt)
      for (let i = 1; i <= prompt.length; i += 1) {
        const slice = prompt.slice(0, i);
        schedule(i * TYPE_CHAR_MS, () => setTyped(slice));
      }
      let t = prompt.length * TYPE_CHAR_MS + PAUSE_AFTER_TYPING_MS;

      if (hasCode) {
        schedule(t, () => setPhase("thinking"));
        t += 400;
        schedule(t, () => {
          setPhase("morphing");
          setShowAfter(true);
        });
        t += MORPH_VISIBLE_MS;
      }

      if (hasTerminal) {
        schedule(t, () => setPhase("running"));
        if (hasTerminalCommand) {
          schedule(t + TERMINAL_PROMPT_MS, () => setTerminalCmdTyped(true));
          t += TERMINAL_PROMPT_MS + 200;
        }
        const lineCount = terminalLines!.length;
        for (let i = 1; i <= lineCount; i += 1) {
          schedule(t, () => setTerminalVisibleLines(i));
          t += TERMINAL_LINE_MS;
        }
      }

      schedule(t, () => setPhase("settled"));
      t += SETTLED_HOLD_MS;
      schedule(t, run);
    };

    run();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [playing, inView, prompt, hasCode, hasTerminal, terminalLines]);

  const showSkillBadge = !!skill;

  const codeStyle =
    maxCodeLines != null
      ? ({ "--agent-prompt-min-lines": String(maxCodeLines) } as React.CSSProperties)
      : undefined;
  const terminalBodyStyle =
    terminalLines != null
      ? ({
          "--agent-prompt-terminal-lines": String(terminalLines.length + 1),
        } as React.CSSProperties)
      : undefined;

  return (
    <div
      ref={containerRef}
      className="agent-prompt not-prose"
      data-phase={phase}
    >
      <div className="agent-prompt-bubble">
        <span className="agent-prompt-tag">You</span>
        <p className="agent-prompt-text">
          <span className="agent-prompt-text-visible">
            {typed}
            {phase === "typing" ? (
              <span className="agent-prompt-caret" aria-hidden="true" />
            ) : null}
          </span>
          <span className="agent-prompt-text-ghost" aria-hidden="true">
            {prompt}
          </span>
        </p>
      </div>
      {showSkillBadge ? (
        <div className="agent-prompt-skill">
          <span className="agent-prompt-skill-label">Skill</span>
          <span className="agent-prompt-skill-name">{skill}</span>
        </div>
      ) : null}
      {hasCode ? (
        <div className="agent-prompt-frame">
          {fileName ? (
            <div className="agent-prompt-filename">
              <span className="agent-prompt-filename-name">{fileName}</span>
              <button
                type="button"
                className="agent-prompt-toggle"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause animation" : "Play animation"}
              >
                {playing ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>
          ) : null}
          <div className="agent-prompt-codewrap">
            {fileName ? (
              <span className="agent-prompt-overlay">
                Editing {fileName}
                <span className="agent-prompt-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
            ) : null}
            <div className="agent-prompt-code" style={codeStyle}>
              <SmoothPre code={showAfter ? after! : before!} />
            </div>
          </div>
        </div>
      ) : null}
      {hasTerminal ? (
        <div className="agent-prompt-terminal">
          <div className="agent-prompt-terminal-header">
            <span className="agent-prompt-terminal-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="agent-prompt-terminal-title">
              {skill ? `Agent running ${skill}` : "Terminal"}
            </span>
            {!hasCode ? (
              <button
                type="button"
                className="agent-prompt-toggle agent-prompt-toggle-dark"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause animation" : "Play animation"}
              >
                {playing ? <Pause size={12} /> : <Play size={12} />}
              </button>
            ) : null}
          </div>
          <div
            className="agent-prompt-terminal-body"
            style={terminalBodyStyle}
          >
            {hasTerminalCommand ? (
              <div className="agent-prompt-terminal-line agent-prompt-terminal-cmd agent-prompt-terminal-cmd-leading">
                <span className="agent-prompt-terminal-prefix">$</span>
                <span>
                  {terminalCmdTyped ||
                  phase === "settled" ||
                  terminalVisibleLines > 0
                    ? terminalCommand
                    : ""}
                  {phase === "running" && !terminalCmdTyped ? (
                    <span className="agent-prompt-caret" aria-hidden="true" />
                  ) : null}
                </span>
              </div>
            ) : null}
            {terminalLines!.map((line, i) => {
              const isCmd = line.startsWith("$ ");
              const text = isCmd ? line.slice(2) : line;
              return (
                <div
                  key={i}
                  className={
                    isCmd
                      ? "agent-prompt-terminal-line agent-prompt-terminal-cmd"
                      : "agent-prompt-terminal-line"
                  }
                  data-visible={i < terminalVisibleLines}
                >
                  {isCmd ? (
                    <>
                      <span className="agent-prompt-terminal-prefix">$</span>
                      <span>{text}</span>
                    </>
                  ) : (
                    text
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
