"use client";

/**
 * Shared scaffolding for every arcade game: the phase state machine, score
 * bookkeeping, the requestAnimationFrame loop, and the HUD / overlay chrome.
 * Game files keep only their own simulation, drawing, and input logic.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./arcade.module.css";

/** Props every arcade game component accepts. */
export type GameProps = {
  hiScore: number;
  onGameOver: (score: number) => void;
};

export type Phase = "ready" | "playing" | "paused" | "over";

export function formatScore(score: number) {
  return score.toString().padStart(6, "0");
}

/**
 * Phase + score state, mirrored into refs so the game loop can read them
 * without re-subscribing, plus hi-score tracking and score banking: if the
 * player quits mid-run (unmount before "over"), the running score is still
 * reported. `onGameOver` and `hiScore` are read through refs, so parents may
 * pass fresh identities every render without restarting the game.
 */
export function useGameCore({ hiScore, onGameOver }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const phaseRef = useRef<Phase>("ready");
  const scoreRef = useRef(0);
  const bestAtRoundStart = useRef(0);

  const hiScoreRef = useRef(hiScore);
  hiScoreRef.current = hiScore;
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const setScoreValue = useCallback((value: number) => {
    scoreRef.current = value;
    setScore(value);
  }, []);

  const addScore = useCallback(
    (points: number) => {
      setScoreValue(scoreRef.current + points);
    },
    [setScoreValue],
  );

  /** Call from reset(): zeroes the score and snapshots the hi-score to beat. */
  const startRound = useCallback(() => {
    bestAtRoundStart.current = hiScoreRef.current;
    setScoreValue(0);
  }, [setScoreValue]);

  /** Call when the run ends: flips to "over" and reports the final score. */
  const endGame = useCallback(() => {
    changePhase("over");
    onGameOverRef.current(scoreRef.current);
  }, [changePhase]);

  useEffect(
    () => () => {
      if (phaseRef.current !== "over" && scoreRef.current > 0) {
        onGameOverRef.current(scoreRef.current);
      }
    },
    [],
  );

  const isNewBest = phase === "over" && score > 0 && score > bestAtRoundStart.current;

  return {
    phase,
    phaseRef,
    changePhase,
    score,
    scoreRef,
    setScoreValue,
    addScore,
    startRound,
    endGame,
    isNewBest,
  };
}

/**
 * The rAF loop. `frame` receives a dt clamped to 50ms so a throttled or
 * backgrounded tab can never fast-forward the simulation. Reads `frame`
 * through a ref, so callers may pass a fresh closure every render.
 */
export function useGameLoop(running: boolean, frame: (dt: number) => void) {
  const frameRef = useRef(frame);
  frameRef.current = frame;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      frameRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/**
 * A Set of currently-held keys (lower-cased). Handles keyup and clears on
 * window blur, so alt-tabbing away can never leave a key stuck down. Games add
 * keys in their own keydown handlers and may clear() on reset/game-over.
 */
export function useHeldKeys() {
  const keys = useRef(new Set<string>());

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const onBlur = () => keys.current.clear();
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return keys;
}

/** HUD + screen frame + controls hint + fullscreen toggle shared by every game. */
export function GameShell({
  score,
  hiScore,
  hudExtra,
  controls,
  children,
}: {
  score: number;
  hiScore: number;
  /** Extra HUD readout between score and hi-score, e.g. lives or level. */
  hudExtra?: ReactNode;
  controls: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Resolved after mount so the server render never guesses at support.
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    setFullscreenSupported(document.fullscreenEnabled ?? false);
    const onChange = () => setIsFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {
        // Denied or unsupported — the inline view keeps working.
      });
    }
  }, []);

  return (
    <div ref={wrapRef} className={styles.gameWrap}>
      <div className={styles.gameHud}>
        <span>
          SCORE <b>{formatScore(score)}</b>
        </span>
        {hudExtra}
        <span>
          HI <b>{formatScore(hiScore)}</b>
        </span>
      </div>
      <div className={styles.gameScreen}>
        {children}
        <div className={styles.gameScanlines} aria-hidden />
      </div>
      <div className={styles.shellBar}>
        <p className={styles.gameControls}>{controls}</p>
        {fullscreenSupported && (
          <button type="button" className={styles.fsBtn} onClick={toggleFullscreen}>
            {isFullscreen ? "⤡ EXIT FULL SCREEN" : "⤢ FULL SCREEN"}
          </button>
        )}
      </div>
    </div>
  );
}

/** Ready / paused / game-over message layer, rendered inside the screen. */
export function PhaseOverlay({
  phase,
  score,
  isNewBest,
  readyTitle = "READY?",
  readyHint,
  overExtra,
}: {
  phase: Phase;
  score: number;
  isNewBest: boolean;
  readyTitle?: string;
  readyHint: string;
  /** Extra line on the game-over screen, e.g. the wave reached. */
  overExtra?: ReactNode;
}) {
  if (phase === "playing") return null;

  return (
    <div className={styles.gameMsg}>
      {phase === "ready" && (
        <>
          <span>{readyTitle}</span>
          <span className={styles.gameMsgSub}>{readyHint}</span>
        </>
      )}
      {phase === "paused" && <span className={styles.blink}>PAUSED</span>}
      {phase === "over" && (
        <>
          <span>GAME OVER</span>
          <span>SCORE {formatScore(score)}</span>
          {overExtra}
          {isNewBest && <span className={styles.newBest}>★ NEW HI-SCORE ★</span>}
          <span className={styles.gameMsgSub}>Press Space or tap to play again</span>
        </>
      )}
    </div>
  );
}
