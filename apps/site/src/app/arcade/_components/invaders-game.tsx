"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { beep } from "./arcade-audio";
import {
  GameShell,
  PhaseOverlay,
  useGameCore,
  useGameLoop,
  useHeldKeys,
  type GameProps,
} from "./game-kit";
import styles from "./arcade.module.css";

const W = 480;
const H = 540;
const SCALE = 2;

const COLS = 11;
const ROWS = 5;
const SLOT_W = 36;
const SLOT_H = 32;
const MARCH_DX = 8;
const DESCEND = 16;
const EDGE = 10;
const GRID_START_Y = 80;

const PLAYER_Y = H - 52;
const PLAYER_SPEED = 260;
const PLAYER_HALF_W = 13;
const PLAYER_H = 16;

const BULLET_SPEED = 460;
const ENEMY_BULLET_SPEED = 190;
const MAX_ENEMY_BULLETS = 3;

const UFO_Y = 46;
const UFO_SPEED = 90;

const BUNKER_CELL = 4;
const BUNKER_Y = H - 124;
const MARCH_NOTES = [110, 98, 87, 78];

// Invaders reaching this line means the planet falls.
const INVASION_Y = H - 96;

type Vec = { x: number; y: number };
type Explosion = { x: number; y: number; ttl: number; ttl0: number };
type Ufo = { x: number; dir: number; points: number };
type Bunker = { x: number; y: number; cells: boolean[][] };

type InvaderType = {
  points: number;
  color: string;
  frames: [string[], string[]];
};

// prettier-ignore
const SQUID: InvaderType = {
  points: 30,
  color: "#f472b6",
  frames: [
    [
      "...XX...",
      "..XXXX..",
      ".XXXXXX.",
      "XX.XX.XX",
      "XXXXXXXX",
      "..X..X..",
      ".X.XX.X.",
      "X.X..X.X",
    ],
    [
      "...XX...",
      "..XXXX..",
      ".XXXXXX.",
      "XX.XX.XX",
      "XXXXXXXX",
      ".X.XX.X.",
      "X......X",
      ".X....X.",
    ],
  ],
};

// prettier-ignore
const CRAB: InvaderType = {
  points: 20,
  color: "#facc15",
  frames: [
    [
      "..X.....X..",
      "...X...X...",
      "..XXXXXXX..",
      ".XX.XXX.XX.",
      "XXXXXXXXXXX",
      "X.XXXXXXX.X",
      "X.X.....X.X",
      "...XX.XX...",
    ],
    [
      "..X.....X..",
      "X..X...X..X",
      "X.XXXXXXX.X",
      "XXX.XXX.XXX",
      "XXXXXXXXXXX",
      ".XXXXXXXXX.",
      "..X.....X..",
      ".X.......X.",
    ],
  ],
};

// prettier-ignore
const OCTOPUS: InvaderType = {
  points: 10,
  color: "#22d3ee",
  frames: [
    [
      "....XXXX....",
      ".XXXXXXXXXX.",
      "XXXXXXXXXXXX",
      "XXX..XX..XXX",
      "XXXXXXXXXXXX",
      "...XX..XX...",
      "..XX.XX.XX..",
      "XX........XX",
    ],
    [
      "....XXXX....",
      ".XXXXXXXXXX.",
      "XXXXXXXXXXXX",
      "XXX..XX..XXX",
      "XXXXXXXXXXXX",
      "..XXX..XXX..",
      ".XX..XX..XX.",
      "..XX....XX..",
    ],
  ],
};

const ROW_TYPES: InvaderType[] = [SQUID, CRAB, CRAB, OCTOPUS, OCTOPUS];

// prettier-ignore
const PLAYER_SPRITE = [
  "......X......",
  ".....XXX.....",
  ".....XXX.....",
  ".XXXXXXXXXXX.",
  "XXXXXXXXXXXXX",
  "XXXXXXXXXXXXX",
  "XXXXXXXXXXXXX",
  "XXXXXXXXXXXXX",
];

// prettier-ignore
const UFO_SPRITE = [
  ".....XXXXXX.....",
  "...XXXXXXXXXX...",
  "..XXXXXXXXXXXX..",
  ".XX.XX.XX.XX.XX.",
  "XXXXXXXXXXXXXXXX",
  "..XXX..XX..XXX..",
  "...X........X...",
];

// prettier-ignore
const BUNKER_SHAPE = [
  ".XXXXXXXXX.",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  "XXXX...XXXX",
  "XXX.....XXX",
  "XXX.....XXX",
];

function makeBunkers(): Bunker[] {
  const width = BUNKER_SHAPE[0].length * BUNKER_CELL;
  return [96, 192, 288, 384].map((center) => ({
    x: center - width / 2,
    y: BUNKER_Y,
    cells: BUNKER_SHAPE.map((row) => [...row].map((c) => c === "X")),
  }));
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = color;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c] === "X") {
        ctx.fillRect(x + c * SCALE, y + r * SCALE, SCALE, SCALE);
      }
    }
  }
}

export function InvadersGame({ hiScore, onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { phase, phaseRef, changePhase, score, addScore, startRound, endGame, isNewBest } =
    useGameCore({ hiScore, onGameOver });

  const playerX = useRef(W / 2);
  const keys = useHeldKeys();
  const touchTargetX = useRef<number | null>(null);
  const playerBullet = useRef<Vec | null>(null);
  const enemyBullets = useRef<Vec[]>([]);
  const grid = useRef({ x: 0, y: GRID_START_Y, dir: 1, anim: 0, alive: [] as boolean[][] });
  const bunkers = useRef<Bunker[]>(makeBunkers());
  const ufo = useRef<Ufo | null>(null);
  const explosions = useRef<Explosion[]>([]);

  const marchAcc = useRef(0);
  const noteIndex = useRef(0);
  const fireAcc = useRef(0);
  const nextFireIn = useRef(1000);
  const ufoTimer = useRef(9000);
  const freeze = useRef(0);
  const pendingWave = useRef(false);

  const livesRef = useRef(3);
  const waveRef = useRef(1);

  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [waveBanner, setWaveBanner] = useState<string | null>(null);
  const bannerTimeout = useRef<number | undefined>(undefined);

  const showWaveBanner = useCallback((n: number) => {
    setWaveBanner(`WAVE ${n.toString().padStart(2, "0")}`);
    window.clearTimeout(bannerTimeout.current);
    bannerTimeout.current = window.setTimeout(() => setWaveBanner(null), 1400);
  }, []);

  useEffect(() => () => window.clearTimeout(bannerTimeout.current), []);

  const aliveCount = useCallback(() => grid.current.alive.flat().filter(Boolean).length, []);

  const resetGrid = useCallback((waveNumber: number) => {
    grid.current = {
      x: EDGE,
      y: Math.min(GRID_START_Y + (waveNumber - 1) * DESCEND, GRID_START_Y + DESCEND * 6),
      dir: 1,
      anim: 0,
      alive: Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => true)),
    };
    marchAcc.current = 0;
  }, []);

  const reset = useCallback(() => {
    livesRef.current = 3;
    waveRef.current = 1;
    setLives(3);
    setWave(1);
    startRound();
    keys.current.clear();
    playerX.current = W / 2;
    playerBullet.current = null;
    enemyBullets.current = [];
    explosions.current = [];
    ufo.current = null;
    ufoTimer.current = 9000;
    fireAcc.current = 0;
    nextFireIn.current = 1000;
    freeze.current = 0;
    pendingWave.current = false;
    bunkers.current = makeBunkers();
    resetGrid(1);
    changePhase("ready");
  }, [startRound, keys, resetGrid, changePhase]);

  const gameOver = useCallback(() => {
    beep(300, 40, 0.7, 0.09, "sawtooth");
    endGame();
  }, [endGame]);

  const invaderRect = useCallback((row: number, col: number) => {
    const type = ROW_TYPES[row];
    const width = type.frames[0][0].length * SCALE;
    const x = grid.current.x + col * SLOT_W + (SLOT_W - width) / 2;
    const y = grid.current.y + row * SLOT_H;
    return { x, y, w: width, h: 16 };
  }, []);

  const erodeBunker = useCallback((bunker: Bunker, hitX: number, hitY: number, radius: number) => {
    const cx = Math.floor((hitX - bunker.x) / BUNKER_CELL);
    const cy = Math.floor((hitY - bunker.y) / BUNKER_CELL);
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const dist = dx * dx + dy * dy;
        if (dist > radius * radius) continue;
        // Ragged edges: cells at the blast rim survive randomly.
        if (dist > (radius - 1) * (radius - 1) && Math.random() < 0.4) continue;
        const row = bunker.cells[cy + dy];
        if (row && row[cx + dx] !== undefined) row[cx + dx] = false;
      }
    }
  }, []);

  /** Returns true when the point hits a live bunker cell (and erodes it). */
  const hitBunker = useCallback(
    (x: number, y: number, radius: number) => {
      for (const bunker of bunkers.current) {
        const cx = Math.floor((x - bunker.x) / BUNKER_CELL);
        const cy = Math.floor((y - bunker.y) / BUNKER_CELL);
        if (bunker.cells[cy]?.[cx]) {
          erodeBunker(bunker, x, y, radius);
          return true;
        }
      }
      return false;
    },
    [erodeBunker],
  );

  const playerHit = useCallback(() => {
    explosions.current.push({ x: playerX.current, y: PLAYER_Y + 8, ttl: 400, ttl0: 400 });
    enemyBullets.current = [];
    playerBullet.current = null;
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) {
      gameOver();
      return;
    }
    beep(300, 50, 0.5, 0.09, "sawtooth");
    playerX.current = W / 2;
    freeze.current = 1200;
  }, [gameOver]);

  const marchStep = useCallback(() => {
    const g = grid.current;
    let minCol = COLS;
    let maxCol = -1;
    let maxRow = -1;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!g.alive[r][c]) continue;
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
        if (r > maxRow) maxRow = r;
      }
    }
    if (maxCol < 0) return;

    const nextX = g.x + g.dir * MARCH_DX;
    const left = nextX + minCol * SLOT_W;
    const right = nextX + maxCol * SLOT_W + SLOT_W;
    if (left < EDGE || right > W - EDGE) {
      g.y += DESCEND;
      g.dir *= -1;
      // The marching wall grinds bunkers away as it reaches them.
      for (const bunker of bunkers.current) {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (!g.alive[r][c]) continue;
            const rect = invaderRect(r, c);
            for (let cy = 0; cy < bunker.cells.length; cy++) {
              for (let cx = 0; cx < bunker.cells[cy].length; cx++) {
                if (!bunker.cells[cy][cx]) continue;
                const px = bunker.x + cx * BUNKER_CELL;
                const py = bunker.y + cy * BUNKER_CELL;
                if (
                  px < rect.x + rect.w &&
                  px + BUNKER_CELL > rect.x &&
                  py < rect.y + rect.h &&
                  py + BUNKER_CELL > rect.y
                ) {
                  bunker.cells[cy][cx] = false;
                }
              }
            }
          }
        }
      }
      if (g.y + maxRow * SLOT_H + 16 >= INVASION_Y) {
        gameOver();
        return;
      }
    } else {
      g.x = nextX;
    }
    g.anim ^= 1;
    beep(MARCH_NOTES[noteIndex.current], MARCH_NOTES[noteIndex.current], 0.07, 0.05, "square");
    noteIndex.current = (noteIndex.current + 1) % MARCH_NOTES.length;
  }, [gameOver, invaderRect]);

  const tryFire = useCallback(() => {
    if (playerBullet.current || freeze.current > 0) return;
    playerBullet.current = { x: playerX.current, y: PLAYER_Y - 10 };
    beep(900, 300, 0.07, 0.04);
  }, []);

  const tick = (dt: number) => {
    const g = grid.current;

    if (freeze.current > 0) {
      freeze.current -= dt;
      if (freeze.current <= 0 && pendingWave.current) {
        pendingWave.current = false;
        resetGrid(waveRef.current);
      }
      return;
    }

    // Player movement — keyboard or touch drag.
    const k = keys.current;
    let vx = 0;
    if (k.has("arrowleft") || k.has("a")) vx -= 1;
    if (k.has("arrowright") || k.has("d")) vx += 1;
    if (vx !== 0) {
      touchTargetX.current = null;
      playerX.current += vx * PLAYER_SPEED * (dt / 1000);
    } else if (touchTargetX.current !== null) {
      const delta = touchTargetX.current - playerX.current;
      const step = PLAYER_SPEED * 1.4 * (dt / 1000);
      playerX.current += Math.abs(delta) <= step ? delta : Math.sign(delta) * step;
    }
    playerX.current = Math.min(
      W - EDGE - PLAYER_HALF_W,
      Math.max(EDGE + PLAYER_HALF_W, playerX.current),
    );

    if (k.has(" ") || k.has("arrowup") || k.has("w")) tryFire();

    // March.
    const alive = aliveCount();
    marchAcc.current += dt;
    const interval = Math.max(60, (70 + alive * 13) * Math.pow(0.95, waveRef.current - 1));
    if (marchAcc.current >= interval) {
      marchAcc.current = 0;
      marchStep();
      if (phaseRef.current === "over") return;
    }

    // Enemy fire.
    fireAcc.current += dt;
    if (fireAcc.current >= nextFireIn.current) {
      if (enemyBullets.current.length >= MAX_ENEMY_BULLETS) {
        // Cap reached — restart the timer so a freed slot doesn't fire instantly.
        fireAcc.current = 0;
      } else {
        fireAcc.current = 0;
        nextFireIn.current = (500 + Math.random() * 800) * Math.pow(0.93, waveRef.current - 1);
        const columns: number[] = [];
        for (let c = 0; c < COLS; c++) {
          if (g.alive.some((row) => row[c])) columns.push(c);
        }
        if (columns.length > 0) {
          const col = columns[Math.floor(Math.random() * columns.length)];
          let bottomRow = -1;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (g.alive[r][col]) {
              bottomRow = r;
              break;
            }
          }
          if (bottomRow >= 0) {
            const rect = invaderRect(bottomRow, col);
            enemyBullets.current.push({ x: rect.x + rect.w / 2, y: rect.y + rect.h });
          }
        }
      }
    }

    // UFO.
    if (ufo.current) {
      ufo.current.x += ufo.current.dir * UFO_SPEED * (dt / 1000);
      if (ufo.current.x < -40 || ufo.current.x > W + 40) ufo.current = null;
    } else {
      ufoTimer.current -= dt;
      if (ufoTimer.current <= 0) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        ufo.current = {
          x: dir === 1 ? -32 : W + 32,
          dir,
          points: [50, 100, 150][Math.floor(Math.random() * 3)],
        };
        ufoTimer.current = 14000 + Math.random() * 10000;
        beep(600, 900, 0.25, 0.03, "triangle");
      }
    }

    // Player bullet.
    const pb = playerBullet.current;
    if (pb) {
      pb.y -= BULLET_SPEED * (dt / 1000);
      if (pb.y < 30) {
        playerBullet.current = null;
      } else if (hitBunker(pb.x, pb.y, 2.4)) {
        playerBullet.current = null;
      } else {
        const u = ufo.current;
        if (u && pb.x > u.x - 16 && pb.x < u.x + 16 && pb.y > UFO_Y && pb.y < UFO_Y + 14) {
          addScore(u.points);
          explosions.current.push({ x: u.x, y: UFO_Y + 7, ttl: 300, ttl0: 300 });
          ufo.current = null;
          playerBullet.current = null;
          beep(1200, 200, 0.3, 0.07);
        } else {
          outer: for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              if (!g.alive[r][c]) continue;
              const rect = invaderRect(r, c);
              if (
                pb.x > rect.x &&
                pb.x < rect.x + rect.w &&
                pb.y > rect.y &&
                pb.y < rect.y + rect.h
              ) {
                g.alive[r][c] = false;
                addScore(ROW_TYPES[r].points);
                explosions.current.push({
                  x: rect.x + rect.w / 2,
                  y: rect.y + rect.h / 2,
                  ttl: 250,
                  ttl0: 250,
                });
                playerBullet.current = null;
                beep(200, 40, 0.15, 0.07);
                break outer;
              }
            }
          }
        }
      }
    }

    // Enemy bullets.
    const remaining: Vec[] = [];
    for (const bullet of enemyBullets.current) {
      bullet.y += ENEMY_BULLET_SPEED * (dt / 1000);
      const pBullet = playerBullet.current;
      if (pBullet && Math.abs(bullet.x - pBullet.x) < 5 && Math.abs(bullet.y - pBullet.y) < 10) {
        explosions.current.push({ x: bullet.x, y: bullet.y, ttl: 200, ttl0: 200 });
        playerBullet.current = null;
        continue;
      }
      if (bullet.y > H - 24) continue;
      if (hitBunker(bullet.x, bullet.y + 8, 1.8)) continue;
      if (
        bullet.x > playerX.current - PLAYER_HALF_W &&
        bullet.x < playerX.current + PLAYER_HALF_W &&
        bullet.y + 8 > PLAYER_Y &&
        bullet.y < PLAYER_Y + PLAYER_H
      ) {
        playerHit();
        return;
      }
      remaining.push(bullet);
    }
    enemyBullets.current = remaining;

    // Explosions decay.
    explosions.current = explosions.current.filter((e) => (e.ttl -= dt) > 0);

    // Wave cleared.
    if (aliveCount() === 0 && !pendingWave.current) {
      waveRef.current += 1;
      setWave(waveRef.current);
      showWaveBanner(waveRef.current);
      playerBullet.current = null;
      enemyBullets.current = [];
      pendingWave.current = true;
      freeze.current = 1400;
      beep(440, 1320, 0.4, 0.06);
    }
  };

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const g = grid.current;

    ctx.fillStyle = "#060210";
    ctx.fillRect(0, 0, W, H);

    // Ground.
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(0, H - 16, W, 2);

    // Bunkers.
    ctx.fillStyle = "#4ade80";
    for (const bunker of bunkers.current) {
      for (let cy = 0; cy < bunker.cells.length; cy++) {
        for (let cx = 0; cx < bunker.cells[cy].length; cx++) {
          if (bunker.cells[cy][cx]) {
            ctx.fillRect(
              bunker.x + cx * BUNKER_CELL,
              bunker.y + cy * BUNKER_CELL,
              BUNKER_CELL,
              BUNKER_CELL,
            );
          }
        }
      }
    }

    // UFO.
    if (ufo.current) {
      drawSprite(ctx, UFO_SPRITE, ufo.current.x - 16, UFO_Y, "#f87171");
    }

    // Invaders.
    for (let r = 0; r < ROWS; r++) {
      const type = ROW_TYPES[r];
      for (let c = 0; c < COLS; c++) {
        if (!g.alive[r][c]) continue;
        const rect = invaderRect(r, c);
        drawSprite(ctx, type.frames[g.anim as 0 | 1], rect.x, rect.y, type.color);
      }
    }

    // Player — flickers while respawning.
    const respawning = freeze.current > 0 && !pendingWave.current && phaseRef.current === "playing";
    if (!respawning || Math.floor(freeze.current / 120) % 2 === 0) {
      drawSprite(ctx, PLAYER_SPRITE, playerX.current - PLAYER_HALF_W, PLAYER_Y, "#4ade80");
    }

    // Bullets.
    if (playerBullet.current) {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(playerBullet.current.x - 1, playerBullet.current.y - 8, 2, 8);
    }
    ctx.fillStyle = "#f472b6";
    for (const bullet of enemyBullets.current) {
      ctx.fillRect(bullet.x - 1.5, bullet.y, 3, 8);
    }

    // Explosions — expanding pixel bursts.
    for (const e of explosions.current) {
      const progress = 1 - e.ttl / e.ttl0;
      const radius = 4 + progress * 10;
      ctx.fillStyle = progress < 0.5 ? "#facc15" : "#f87171";
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        ctx.fillRect(
          e.x + Math.cos(angle) * radius - 1.5,
          e.y + Math.sin(angle) * radius - 1.5,
          3,
          3,
        );
      }
    }
  }, [invaderRect, phaseRef]);

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

  const start = useCallback(() => {
    beep(440, 880, 0.12);
    showWaveBanner(waveRef.current);
    changePhase("playing");
  }, [changePhase, showWaveBanner]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const currentPhase = phaseRef.current;

      if (
        ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s", " "].includes(key)
      ) {
        event.preventDefault();
        keys.current.add(key);
        if (currentPhase === "ready") start();
        else if (currentPhase === "over" && key === " ") reset();
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
  }, [phaseRef, keys, start, changePhase, reset]);

  const canvasX = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return W / 2;
    const rect = canvas.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * W;
  }, []);

  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const currentPhase = phaseRef.current;
      if (currentPhase === "ready") start();
      else if (currentPhase === "over") reset();
      else if (currentPhase === "paused") changePhase("playing");
      else if (currentPhase === "playing") tryFire();
      touchTargetX.current = canvasX(event.touches[0].clientX);
    },
    [phaseRef, start, reset, changePhase, tryFire, canvasX],
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      touchTargetX.current = canvasX(event.touches[0].clientX);
    },
    [canvasX],
  );

  const onTouchStop = useCallback(() => {
    touchTargetX.current = null;
  }, []);

  return (
    <GameShell
      score={score}
      hiScore={Math.max(hiScore, score)}
      hudExtra={
        <>
          <span>
            WAVE <b>{wave.toString().padStart(2, "0")}</b>
          </span>
          <span className={styles.gameLives}>{"▲".repeat(Math.max(0, lives))}</span>
        </>
      }
      controls="◀ ▶ MOVE — SPACE FIRE — P PAUSE"
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className={styles.gameCanvas}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchStop}
        onTouchCancel={onTouchStop}
      />
      {waveBanner && phase === "playing" && <div className={styles.waveBanner}>{waveBanner}</div>}
      <PhaseOverlay
        phase={phase}
        score={score}
        isNewBest={isNewBest}
        readyHint="Press any key to defend the planet — or tap"
      />
    </GameShell>
  );
}
