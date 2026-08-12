"use client";

import { useCallback, useEffect, useRef } from "react";
import { beep } from "./arcade-audio";
import { GameShell, PhaseOverlay, useGameCore, useGameLoop, type GameProps } from "./game-kit";
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

// The comet tail stripes, top to bottom.
const TAIL_COLORS = ["#7cdae1", "#edcd5f", "#e37780"];
const TAIL_STRIPE_H = 7;

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

/**
 * The featured game. Unlike the dialog games, it is embedded directly in the
 * page, so keyboard input is scoped to the focusable screen element instead of
 * `window` — the page keeps scrolling normally until the player clicks in.
 */
export function CometCatGame({ hiScore, onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const {
    phase,
    phaseRef,
    changePhase,
    score,
    scoreRef,
    addScore,
    startRound,
    endGame,
    isNewBest,
  } = useGameCore({ hiScore, onGameOver });

  const cat = useRef({ y: H / 2, vy: 0 });
  const pillars = useRef<Pillar[]>([]);
  const trail = useRef<TrailPoint[]>([]);
  const stars = useRef<Star[]>([]);
  const worldX = useRef(0);
  // Countdown for the post-collision tumble before the GAME OVER screen.
  const dying = useRef(0);

  const speed = () => Math.min(220, BASE_SPEED + scoreRef.current * 1.5);
  const gap = () => Math.max(120, BASE_GAP - scoreRef.current * 0.5);

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
    startRound();
    spawnPillar(W + 120);
    stars.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 15 + Math.random() * 35,
      size: Math.random() < 0.25 ? 2 : 1,
    }));
    changePhase("ready");
  }, [spawnPillar, changePhase, startRound]);

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

  const tick = (dt: number) => {
    const dts = dt / 1000;
    const c = cat.current;

    if (dying.current > 0) {
      // Tumble off screen, then call it.
      dying.current -= dt;
      c.vy = Math.min(MAX_FALL, c.vy + GRAVITY * dts);
      c.y += c.vy * dts;
      if (dying.current <= 0 || c.y > H + 60) {
        endGame();
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
        addScore(1);
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
  };

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

    // Comet tail: three stripes tracing the flight path, with the classic
    // chunky zigzag — segments alternate a 2px offset in 12px blocks.
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
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  useGameLoop(phase === "playing", (dt) => {
    tick(dt);
    draw();
  });

  useEffect(() => {
    if (phase !== "playing") draw();
  }, [phase, draw]);

  const advance = useCallback(() => {
    const currentPhase = phaseRef.current;
    if (currentPhase === "ready") start();
    else if (currentPhase === "playing") flap();
    else if (currentPhase === "over") reset();
    else if (currentPhase === "paused") changePhase("playing");
  }, [phaseRef, start, flap, reset, changePhase]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === " " || key === "arrowup" || key === "w" || key === "enter") {
        event.preventDefault();
        if (event.repeat) return;
        advance();
        return;
      }

      if (key === "p") {
        const currentPhase = phaseRef.current;
        if (currentPhase === "playing" || currentPhase === "paused") {
          changePhase(currentPhase === "playing" ? "paused" : "playing");
        }
      }
    },
    [advance, phaseRef, changePhase],
  );

  const onPointer = useCallback(() => {
    screenRef.current?.focus();
    advance();
  }, [advance]);

  return (
    <GameShell
      score={score}
      hiScore={Math.max(hiScore, score)}
      controls="SPACE / TAP FLAP — P PAUSE"
    >
      <div
        ref={screenRef}
        tabIndex={0}
        role="application"
        aria-label="Comet Cat game. Tap, click, or press Space to flap."
        className={styles.focusScreen}
        onKeyDown={onKeyDown}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.gameCanvas}
          onMouseDown={onPointer}
          onTouchStart={onPointer}
        />
        <PhaseOverlay
          phase={phase}
          score={score}
          isNewBest={isNewBest}
          readyHint="Tap, click, or press Space to flap"
        />
      </div>
    </GameShell>
  );
}
