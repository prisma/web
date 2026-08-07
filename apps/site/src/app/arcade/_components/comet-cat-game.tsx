"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { beep } from "./arcade-audio";
import styles from "./arcade.module.css";

const W = 420;
const H = 520;
const GROUND_Y = H - 16;

const CAT_X = 110;
const CAT_W = 30;
const CAT_H = 22;

const GRAVITY = 1500;
const FLAP_VY = -420;
const MAX_FALL = 520;

const PILLAR_W = 56;
const PILLAR_SPACING = 230;
const BASE_GAP = 150;
const BASE_SPEED = 145;

// The new brand stripes, top to bottom — the comet tail.
const TAIL_COLORS = ["#7cdae1", "#edcd5f", "#e37780"];
const TAIL_STRIPE_H = 7;

type Phase = "ready" | "playing" | "paused" | "over";
type Pillar = { x: number; gapY: number; passed: boolean };
type TrailPoint = { x: number; y: number };
type Star = { x: number; y: number; speed: number; size: number };

// Original pixel cat, 14x10 — gray tabby, NOT a pastry.
// prettier-ignore
const CAT_SPRITE = [
  "..DD......DD..",
  ".DGGD....DGGD.",
  ".DGGGDDDDGGGD.",
  ".DGGGGGGGGGGD.",
  "DGGGGGGGGGGGGD",
  "DGGKKGGGGKKGGD",
  "DGPGGGDDGGGPGD",
  "DGGGGGGGGGGGGD",
  ".DGGGGGGGGGGD.",
  "..DDDDDDDDDD..",
];

const CAT_PALETTE: Record<string, string> = {
  G: "#9ca3af",
  D: "#4b5563",
  K: "#1f2937",
  P: "#f2a0ac",
};

function formatScore(score: number) {
  return score.toString().padStart(6, "0");
}

export function CometCatGame({
  hiScore,
  onGameOver,
}: {
  hiScore: number;
  onGameOver: (score: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cat = useRef({ y: H / 2, vy: 0 });
  const pillars = useRef<Pillar[]>([]);
  const trail = useRef<TrailPoint[]>([]);
  const stars = useRef<Star[]>([]);
  const worldX = useRef(0);
  // Countdown for the post-collision tumble before the GAME OVER screen.
  const dying = useRef(0);

  const scoreRef = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  const bestAtRoundStart = useRef(0);
  const hiScoreRef = useRef(hiScore);
  hiScoreRef.current = hiScore;
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);

  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const speed = useCallback(() => Math.min(220, BASE_SPEED + scoreRef.current * 1.5), []);
  const gap = useCallback(() => Math.max(120, BASE_GAP - scoreRef.current * 0.5), []);

  const spawnPillar = useCallback((x: number) => {
    const margin = 90;
    pillars.current.push({
      x,
      gapY: margin + Math.random() * (GROUND_Y - margin * 2),
      passed: false,
    });
  }, []);

  const reset = useCallback(() => {
    cat.current = { y: H / 2, vy: 0 };
    pillars.current = [];
    trail.current = [];
    worldX.current = 0;
    dying.current = 0;
    scoreRef.current = 0;
    setScore(0);
    bestAtRoundStart.current = hiScoreRef.current;
    spawnPillar(W + 120);
    stars.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 15 + Math.random() * 35,
      size: Math.random() < 0.25 ? 2 : 1,
    }));
    changePhase("ready");
  }, [spawnPillar, changePhase]);

  const flap = useCallback(() => {
    if (dying.current > 0) return;
    cat.current.vy = FLAP_VY;
    beep(500, 740, 0.06, 0.04);
  }, []);

  const start = useCallback(() => {
    beep(440, 880, 0.12);
    changePhase("playing");
    flap();
  }, [changePhase, flap]);

  const die = useCallback(() => {
    dying.current = 700;
    beep(300, 60, 0.5, 0.08, "sawtooth");
  }, []);

  const tick = useCallback(
    (dt: number) => {
      const dts = dt / 1000;
      const c = cat.current;

      if (dying.current > 0) {
        // Tumble off screen, then call it.
        dying.current -= dt;
        c.vy = Math.min(MAX_FALL, c.vy + GRAVITY * dts);
        c.y += c.vy * dts;
        if (dying.current <= 0 || c.y > H + 60) {
          changePhase("over");
          onGameOverRef.current(scoreRef.current);
        }
        return;
      }

      const v = speed();
      worldX.current += v * dts;

      c.vy = Math.min(MAX_FALL, c.vy + GRAVITY * dts);
      c.y += c.vy * dts;
      if (c.y < 4) {
        c.y = 4;
        c.vy = 0;
      }

      // Trail follows the cat's path and scrolls with the world.
      for (const p of trail.current) p.x -= v * dts;
      trail.current.push({ x: CAT_X - 6, y: c.y + CAT_H / 2 });
      while (trail.current.length > 0 && trail.current[0].x < -30) {
        trail.current.shift();
      }

      for (const star of stars.current) {
        star.x -= star.speed * dts;
        if (star.x < 0) {
          star.x += W;
          star.y = Math.random() * H;
        }
      }

      const g = gap();
      for (const pillar of pillars.current) {
        pillar.x -= v * dts;
        if (!pillar.passed && pillar.x + PILLAR_W < CAT_X) {
          pillar.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
          beep(880, 1320, 0.08, 0.05);
        }
      }
      if (pillars.current[0] && pillars.current[0].x < -PILLAR_W) {
        pillars.current.shift();
      }
      const last = pillars.current[pillars.current.length - 1];
      if (!last || last.x < W - PILLAR_SPACING) {
        spawnPillar(W + PILLAR_W);
      }

      // Collisions: ground, then pillars.
      if (c.y + CAT_H >= GROUND_Y) {
        c.y = GROUND_Y - CAT_H;
        die();
        return;
      }
      const catLeft = CAT_X - CAT_W / 2 + 3;
      const catRight = CAT_X + CAT_W / 2 - 3;
      for (const pillar of pillars.current) {
        if (catRight < pillar.x || catLeft > pillar.x + PILLAR_W) continue;
        const gapTop = pillar.gapY - g / 2;
        const gapBottom = pillar.gapY + g / 2;
        if (c.y + 3 < gapTop || c.y + CAT_H - 3 > gapBottom) {
          die();
          return;
        }
      }
    },
    [speed, gap, spawnPillar, die, changePhase],
  );

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const c = cat.current;

    ctx.fillStyle = "#060210";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#e2e8f0";
    for (const star of stars.current) {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // Comet tail: three brand stripes tracing the flight path, with the
    // classic chunky zigzag — segments alternate a 2px offset in 12px blocks.
    const points = trail.current;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const wob = Math.floor((a.x + worldX.current) / 12) % 2 === 0 ? 2 : -2;
      const width = Math.max(1, b.x - a.x + 1);
      for (let s = 0; s < TAIL_COLORS.length; s++) {
        ctx.fillStyle = TAIL_COLORS[s];
        ctx.fillRect(
          a.x,
          a.y - (TAIL_COLORS.length * TAIL_STRIPE_H) / 2 + s * TAIL_STRIPE_H + wob,
          width,
          TAIL_STRIPE_H,
        );
      }
    }

    // Pillars — neon arcade columns with lipped caps at the gap.
    const g = gap();
    for (const pillar of pillars.current) {
      const gapTop = pillar.gapY - g / 2;
      const gapBottom = pillar.gapY + g / 2;
      ctx.fillStyle = "#150b2e";
      ctx.fillRect(pillar.x, 0, PILLAR_W, gapTop);
      ctx.fillRect(pillar.x, gapBottom, PILLAR_W, GROUND_Y - gapBottom);
      ctx.strokeStyle = "#7cdae1";
      ctx.lineWidth = 3;
      ctx.strokeRect(pillar.x + 1.5, -4, PILLAR_W - 3, gapTop + 2.5);
      ctx.strokeRect(pillar.x + 1.5, gapBottom + 1.5, PILLAR_W - 3, GROUND_Y - gapBottom + 4);
      ctx.fillStyle = "#7cdae1";
      ctx.fillRect(pillar.x - 4, gapTop - 8, PILLAR_W + 8, 8);
      ctx.fillRect(pillar.x - 4, gapBottom, PILLAR_W + 8, 8);
    }

    ctx.fillStyle = "#7cdae1";
    ctx.fillRect(0, GROUND_Y, W, 2);

    // Cat, tilted by vertical velocity like any self-respecting flappy hero.
    const angle = Math.max(-0.4, Math.min(1.25, c.vy / 480));
    ctx.save();
    ctx.translate(CAT_X, c.y + CAT_H / 2);
    ctx.rotate(dying.current > 0 ? Math.min(1.6, angle + 0.6) : angle);
    const px = CAT_W / CAT_SPRITE[0].length;
    const py = CAT_H / CAT_SPRITE.length;
    for (let r = 0; r < CAT_SPRITE.length; r++) {
      for (let col = 0; col < CAT_SPRITE[r].length; col++) {
        const color = CAT_PALETTE[CAT_SPRITE[r][col]];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(-CAT_W / 2 + col * px, -CAT_H / 2 + r * py, px + 0.5, py + 0.5);
      }
    }
    ctx.restore();
  }, [gap]);

  useEffect(() => {
    reset();
  }, [reset]);

  // Bank the running score if the player closes the overlay mid-game —
  // death already reports via the dying countdown, so only cover quit here.
  useEffect(
    () => () => {
      if (phaseRef.current !== "over" && scoreRef.current > 0) {
        onGameOverRef.current(scoreRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (phase !== "playing") {
      draw();
      return;
    }
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      tick(dt);
      draw();
      if (phaseRef.current === "playing") {
        raf = requestAnimationFrame(frame);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, tick, draw]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const currentPhase = phaseRef.current;

      if (key === " " || key === "arrowup" || key === "w") {
        event.preventDefault();
        if (event.repeat) return;
        if (currentPhase === "ready") start();
        else if (currentPhase === "playing") flap();
        else if (currentPhase === "over") reset();
        return;
      }

      if (key === "p" && (currentPhase === "playing" || currentPhase === "paused")) {
        changePhase(currentPhase === "playing" ? "paused" : "playing");
        return;
      }

      if (key === "enter") {
        event.preventDefault();
        if (currentPhase === "ready") start();
        else if (currentPhase === "over") reset();
        else if (currentPhase === "paused") changePhase("playing");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [start, flap, reset, changePhase]);

  const onPointer = useCallback(() => {
    const currentPhase = phaseRef.current;
    if (currentPhase === "ready") start();
    else if (currentPhase === "playing") flap();
    else if (currentPhase === "over") reset();
    else if (currentPhase === "paused") changePhase("playing");
  }, [start, flap, reset, changePhase]);

  const isNewBest = phase === "over" && score > 0 && score > bestAtRoundStart.current;

  return (
    <div className={styles.gameWrap}>
      <div className={styles.gameHud}>
        <span>
          SCORE <b>{formatScore(score)}</b>
        </span>
        <span>
          HI <b>{formatScore(Math.max(hiScore, score))}</b>
        </span>
      </div>
      <div className={styles.gameScreen}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.gameCanvas}
          onMouseDown={onPointer}
          onTouchStart={(event) => {
            event.preventDefault();
            onPointer();
          }}
        />
        {phase !== "playing" && (
          <div className={styles.gameMsg}>
            {phase === "ready" && (
              <>
                <span>READY?</span>
                <span className={styles.gameMsgSub}>Tap, click, or press Space to flap</span>
              </>
            )}
            {phase === "paused" && <span className={styles.blink}>PAUSED</span>}
            {phase === "over" && (
              <>
                <span>GAME OVER</span>
                <span>SCORE {formatScore(score)}</span>
                {isNewBest && <span className={styles.newBest}>★ NEW HI-SCORE ★</span>}
                <span className={styles.gameMsgSub}>Press Space or tap to fly again</span>
              </>
            )}
          </div>
        )}
        <div className={styles.gameScanlines} aria-hidden />
      </div>
      <p className={styles.gameControls}>SPACE / TAP FLAP — P PAUSE</p>
    </div>
  );
}
