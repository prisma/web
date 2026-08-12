"use client";

import { useCallback, useEffect, useRef } from "react";
import { beep } from "./arcade-audio";
import { GameShell, PhaseOverlay, useGameCore, useGameLoop, type GameProps } from "./game-kit";
import styles from "./arcade.module.css";

const COLS = 21;
const ROWS = 21;
const CELL = 24;
const START_TICK_MS = 140;
const MIN_TICK_MS = 70;
const SPEEDUP_MS = 3;
const POINTS_PER_APPLE = 10;

type Vec = { x: number; y: number };

const KEY_DIRS: Record<string, Vec> = {
  arrowup: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

export function SnakeGame({ hiScore, onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { phase, phaseRef, changePhase, score, addScore, startRound, endGame, isNewBest } =
    useGameCore({ hiScore, onGameOver });

  // Game state lives in refs — the rAF loop mutates it every tick without
  // paying for a React render. Only phase/score cross into React state.
  const snakeRef = useRef<Vec[]>([]);
  const dirRef = useRef<Vec>({ x: 1, y: 0 });
  const queueRef = useRef<Vec[]>([]);
  const foodRef = useRef<Vec>({ x: 0, y: 0 });
  const tickRef = useRef(START_TICK_MS);
  const accRef = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  /** Moves the food to a random free cell; false when the snake fills the board. */
  const placeFood = useCallback(() => {
    const snake = snakeRef.current;
    const occupied = new Set(snake.map((cell) => cell.y * COLS + cell.x));
    const free: Vec[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!occupied.has(y * COLS + x)) free.push({ x, y });
      }
    }
    if (free.length === 0) return false;
    foodRef.current = free[Math.floor(Math.random() * free.length)];
    return true;
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#060210";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    ctx.strokeStyle = "rgba(74, 222, 128, 0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, ROWS * CELL);
      ctx.stroke();
    }
    for (let i = 1; i < ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(COLS * CELL, i * CELL + 0.5);
      ctx.stroke();
    }

    const food = foodRef.current;
    ctx.fillStyle = "#f87171";
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.fillStyle = "#fecaca";
    ctx.fillRect(food.x * CELL + 4, food.y * CELL + 4, 5, 5);

    const snake = snakeRef.current;
    snake.forEach((cell, i) => {
      ctx.fillStyle = i === 0 ? "#bbf7d0" : i % 2 === 0 ? "#4ade80" : "#22c55e";
      ctx.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
    });

    // Eyes on the head, facing the direction of travel.
    if (snake.length > 0) {
      const head = snake[0];
      const dir = dirRef.current;
      ctx.fillStyle = "#060210";
      const cx = head.x * CELL + CELL / 2;
      const cy = head.y * CELL + CELL / 2;
      const forward = 5;
      const side = 5;
      const eyeA = {
        x: cx + dir.x * forward + dir.y * side - 2,
        y: cy + dir.y * forward + dir.x * side - 2,
      };
      const eyeB = {
        x: cx + dir.x * forward - dir.y * side - 2,
        y: cy + dir.y * forward - dir.x * side - 2,
      };
      ctx.fillRect(eyeA.x, eyeA.y, 4, 4);
      ctx.fillRect(eyeB.x, eyeB.y, 4, 4);
    }
  }, []);

  const reset = useCallback(() => {
    const cx = Math.floor(COLS / 2);
    const cy = Math.floor(ROWS / 2);
    snakeRef.current = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    dirRef.current = { x: 1, y: 0 };
    queueRef.current = [];
    tickRef.current = START_TICK_MS;
    accRef.current = 0;
    startRound();
    placeFood();
    changePhase("ready");
  }, [placeFood, changePhase, startRound]);

  const queueDirection = useCallback((dir: Vec) => {
    const queue = queueRef.current;
    const last = queue.length > 0 ? queue[queue.length - 1] : dirRef.current;
    const isSame = last.x === dir.x && last.y === dir.y;
    const isReverse = last.x + dir.x === 0 && last.y + dir.y === 0;
    if (!isSame && !isReverse && queue.length < 2) {
      queue.push(dir);
    }
  }, []);

  const step = useCallback(() => {
    const next = queueRef.current.shift();
    if (next) dirRef.current = next;

    const snake = snakeRef.current;
    const dir = dirRef.current;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const food = foodRef.current;
    const eating = head.x === food.x && head.y === food.y;

    // The tail cell vacates this tick unless we're growing into it.
    const body = eating ? snake : snake.slice(0, -1);
    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    const hitSelf = body.some((cell) => cell.x === head.x && cell.y === head.y);

    if (hitWall || hitSelf) {
      beep(220, 55, 0.5, 0.08);
      endGame();
      return;
    }

    snake.unshift(head);
    if (eating) {
      addScore(POINTS_PER_APPLE);
      tickRef.current = Math.max(MIN_TICK_MS, tickRef.current - SPEEDUP_MS);
      beep(660, 990, 0.09);
      if (!placeFood()) {
        // The snake fills the whole board — nothing left to eat.
        endGame();
      }
    } else {
      snake.pop();
    }
  }, [addScore, endGame, placeFood]);

  const start = useCallback(
    (dir?: Vec) => {
      if (dir && !(dir.x === -dirRef.current.x && dir.y === -dirRef.current.y)) {
        dirRef.current = dir;
      }
      beep(440, 880, 0.12);
      changePhase("playing");
    },
    [changePhase],
  );

  useEffect(() => {
    reset();
  }, [reset]);

  useGameLoop(phase === "playing", (dt) => {
    accRef.current += dt;
    while (accRef.current >= tickRef.current && phaseRef.current === "playing") {
      accRef.current -= tickRef.current;
      step();
    }
    draw();
  });

  useEffect(() => {
    if (phase !== "playing") draw();
  }, [phase, draw]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const dir = KEY_DIRS[key];
      const currentPhase = phaseRef.current;

      if (dir) {
        event.preventDefault();
        if (currentPhase === "ready") start(dir);
        else if (currentPhase === "playing") queueDirection(dir);
        return;
      }

      if (key === "p" && (currentPhase === "playing" || currentPhase === "paused")) {
        changePhase(currentPhase === "playing" ? "paused" : "playing");
        return;
      }

      if (key === "enter" || key === " ") {
        event.preventDefault();
        if (currentPhase === "ready") start();
        else if (currentPhase === "over") reset();
        else if (currentPhase === "paused") changePhase("playing");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phaseRef, start, queueDirection, changePhase, reset]);

  const onMouseDown = useCallback(() => {
    const currentPhase = phaseRef.current;
    if (currentPhase === "ready") start();
    else if (currentPhase === "over") reset();
    else if (currentPhase === "paused") changePhase("playing");
  }, [phaseRef, start, reset, changePhase]);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const startPoint = touchStart.current;
      touchStart.current = null;
      const currentPhase = phaseRef.current;

      if (currentPhase === "over") {
        reset();
        return;
      }

      if (!startPoint) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startPoint.x;
      const dy = touch.clientY - startPoint.y;

      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) {
        if (currentPhase === "ready") start();
        else if (currentPhase === "paused") changePhase("playing");
        return;
      }

      const dir: Vec =
        Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
      if (currentPhase === "ready") start(dir);
      else if (currentPhase === "playing") queueDirection(dir);
    },
    [phaseRef, start, queueDirection, changePhase, reset],
  );

  return (
    <GameShell
      score={score}
      hiScore={Math.max(hiScore, score)}
      controls="ARROWS / WASD MOVE — P PAUSE"
    >
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        className={styles.gameCanvas}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
      <PhaseOverlay
        phase={phase}
        score={score}
        isNewBest={isNewBest}
        readyHint="Press an arrow key, swipe, or tap to move"
      />
    </GameShell>
  );
}
