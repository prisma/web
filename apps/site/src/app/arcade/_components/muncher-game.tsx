"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { beep } from "./arcade-audio";
import { GameShell, PhaseOverlay, useGameCore, useGameLoop, type GameProps } from "./game-kit";
import styles from "./arcade.module.css";

const TILE = 24;
const COLS = 19;
const ROWS = 21;
const W = COLS * TILE; // 456
const H = ROWS * TILE; // 504

// Original maze — 19x21, left-right symmetric, one wraparound tunnel row (T),
// a central enemy den (G) with a single top gap, and four corner pellets (o).
// prettier-ignore
const MAZE = [
  "###################",
  "#.................#",
  "#o##.##.#.#.##.##o#",
  "#.................#",
  "#.##.##.#.#.##.##.#",
  "#.................#",
  "#.##.##.#.#.##.##.#",
  "#.................#",
  "#.##.####.####.##.#",
  "#.##.###GGG###.##.#",
  "T......#GGG#......T",
  "#.##.###GGG###.##.#",
  "#.##.#########.##.#",
  "#.................#",
  "#.##.##.#.#.##.##.#",
  "#........P........#",
  "#.##.##.#.#.##.##.#",
  "#.................#",
  "#o##.##.#.#.##.##o#",
  "#.................#",
  "###################",
];

const WALL_FILL = "#3b3fc4";
const WALL_EDGE = "#6d72ff";
const DOT_COLOR = "#facc15";

// Den geometry (interior + the single exit tile above the gap).
const DEN_C = 9;
const DEN_TOP = 9;
const DEN_BOTTOM = 11;
const DEN_CENTER_R = 10;
const GATE_R = 7; // corridor tile the enemies emerge onto

// Speeds in tiles per second.
const PLAYER_SPEED = 7;
const ENEMY_SPEED = 6.5;
const FRIGHT_SPEED = 4.5;
const EYES_SPEED = 13;
const DEN_SPEED = 5;

type DirName = "up" | "down" | "left" | "right";
type EnemyKind = "chaser" | "ambusher" | "wanderer" | "patroller";
type EnemyMode = "chase" | "frightened" | "eyes";
type EnemyState = "den" | "leaving" | "out";

type Vec = { x: number; y: number };
type Actor = { c: number; r: number; prog: number; dir: DirName };
type Player = Actor & { desired: DirName };
type Enemy = Actor & {
  kind: EnemyKind;
  color: string;
  mode: EnemyMode;
  state: EnemyState;
  release: number;
  home: { c: number; r: number };
  spawn: { c: number; r: number };
};
type Fruit = { c: number; r: number; ttl: number; value: number };

const DIRS: Record<DirName, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<DirName, DirName> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};
const DIR_ORDER: DirName[] = ["up", "left", "down", "right"];
const KEY_DIRS: Record<string, DirName> = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const wrapCol = (c: number) => (c + COLS) % COLS;

function tileChar(c: number, r: number) {
  if (r < 0 || r >= ROWS) return "#";
  return MAZE[r][wrapCol(c)];
}

/** Walls block everyone; den tiles block anyone not allowed inside. */
function isBlocked(c: number, r: number, allowDen: boolean) {
  const ch = tileChar(c, r);
  if (ch === "#") return true;
  if (ch === "G" && !allowDen) return true;
  return false;
}

function canStep(c: number, r: number, dir: DirName, allowDen: boolean) {
  const d = DIRS[dir];
  return !isBlocked(wrapCol(c + d.x), r + d.y, allowDen);
}

/**
 * Flip an actor's heading without teleporting it. The actor is partway from its
 * current tile toward the tile ahead; reversing re-roots it on that forward tile
 * and inverts the progress, so the on-screen position is unchanged.
 */
function reverseActor(a: Actor) {
  a.c = wrapCol(a.c + DIRS[a.dir].x);
  a.r += DIRS[a.dir].y;
  a.dir = OPPOSITE[a.dir];
  a.prog = 1 - a.prog;
}

function findSpawn(): { c: number; r: number } {
  for (let r = 0; r < ROWS; r++) {
    const c = MAZE[r].indexOf("P");
    if (c >= 0) return { c, r };
  }
  return { c: 9, r: 15 };
}

const PLAYER_SPAWN = findSpawn();
let TOTAL_DOTS = 0;
for (const row of MAZE) {
  for (const ch of row) if (ch === "." || ch === "o") TOTAL_DOTS++;
}

const ENEMY_DEFS: Omit<Enemy, "prog" | "dir" | "mode" | "state">[] = [
  {
    kind: "chaser",
    color: "#f87171",
    c: 9,
    r: 9,
    release: 0,
    home: { c: 17, r: 1 },
    spawn: { c: 9, r: 9 },
  },
  {
    kind: "ambusher",
    color: "#f472b6",
    c: 8,
    r: 10,
    release: 3000,
    home: { c: 1, r: 1 },
    spawn: { c: 8, r: 10 },
  },
  {
    kind: "wanderer",
    color: "#22d3ee",
    c: 10,
    r: 10,
    release: 6000,
    home: { c: 17, r: 19 },
    spawn: { c: 10, r: 10 },
  },
  {
    kind: "patroller",
    color: "#fb923c",
    c: 9,
    r: 11,
    release: 9000,
    home: { c: 1, r: 19 },
    spawn: { c: 9, r: 11 },
  },
];

function makeEnemy(def: (typeof ENEMY_DEFS)[number]): Enemy {
  return {
    ...def,
    c: def.spawn.c,
    r: def.spawn.r,
    prog: 0,
    dir: "up",
    mode: "chase",
    state: "den",
  };
}

function levelSpeedMult(level: number) {
  return Math.min(1.3, 1 + 0.05 * (level - 1));
}

function frightenedDuration(level: number) {
  return Math.max(2000, 6000 - 500 * (level - 1));
}

export function MuncherGame({ hiScore, onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { phase, phaseRef, changePhase, score, addScore, startRound, endGame, isNewBest } =
    useGameCore({ hiScore, onGameOver });

  const player = useRef<Player>({ ...PLAYER_SPAWN, prog: 0, dir: "left", desired: "left" });
  const enemies = useRef<Enemy[]>(ENEMY_DEFS.map(makeEnemy));
  const dots = useRef<number[][]>([]);
  const dotCount = useRef(0);
  const fruit = useRef<Fruit | null>(null);
  const fruitStage = useRef(0);

  const denClock = useRef(0);
  const patrolTimer = useRef(0);
  const patrolChase = useRef(true);
  const frightTimer = useRef(0);
  const eatValue = useRef(200);
  const freeze = useRef(0);
  const pending = useRef<"death" | null>(null);
  const anim = useRef(0);

  const livesRef = useRef(3);
  const levelRef = useRef(1);

  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimeout = useRef<number | undefined>(undefined);

  const showBanner = useCallback((text: string) => {
    setBanner(text);
    window.clearTimeout(bannerTimeout.current);
    bannerTimeout.current = window.setTimeout(() => setBanner(null), 1400);
  }, []);

  useEffect(() => () => window.clearTimeout(bannerTimeout.current), []);

  const buildDots = useCallback(() => {
    const grid: number[][] = [];
    let count = 0;
    for (let r = 0; r < ROWS; r++) {
      const row: number[] = [];
      for (let c = 0; c < COLS; c++) {
        const ch = MAZE[r][c];
        if (ch === ".") {
          row.push(1);
          count++;
        } else if (ch === "o") {
          row.push(2);
          count++;
        } else {
          row.push(0);
        }
      }
      grid.push(row);
    }
    dots.current = grid;
    dotCount.current = count;
  }, []);

  const placeActors = useCallback(() => {
    player.current = { ...PLAYER_SPAWN, prog: 0, dir: "left", desired: "left" };
    enemies.current = ENEMY_DEFS.map(makeEnemy);
    denClock.current = 0;
    patrolTimer.current = 0;
    patrolChase.current = true;
    frightTimer.current = 0;
    eatValue.current = 200;
  }, []);

  const reset = useCallback(() => {
    livesRef.current = 3;
    levelRef.current = 1;
    setLives(3);
    setLevel(1);
    startRound();
    buildDots();
    fruit.current = null;
    fruitStage.current = 0;
    freeze.current = 0;
    pending.current = null;
    anim.current = 0;
    placeActors();
    changePhase("ready");
  }, [startRound, buildDots, placeActors, changePhase]);

  const gameOver = useCallback(() => {
    beep(300, 40, 0.7, 0.09, "sawtooth");
    endGame();
  }, [endGame]);

  const start = useCallback(() => {
    beep(440, 880, 0.12);
    showBanner("READY!");
    changePhase("playing");
  }, [changePhase, showBanner]);

  // Alternating two-note "waka" as dots are eaten.
  const wakaHigh = useRef(false);

  const eatAt = useCallback(
    (c: number, r: number) => {
      const cell = dots.current[r]?.[c];
      if (!cell) return;
      if (cell === 1) {
        addScore(10);
        wakaHigh.current = !wakaHigh.current;
        beep(wakaHigh.current ? 320 : 240, wakaHigh.current ? 260 : 200, 0.05, 0.04, "square");
      } else {
        addScore(50);
        // Power pellet — frighten every active enemy and reverse it.
        frightTimer.current = frightenedDuration(levelRef.current);
        eatValue.current = 200;
        for (const e of enemies.current) {
          if (e.state === "out" && e.mode !== "eyes") {
            e.mode = "frightened";
            reverseActor(e);
          }
        }
        beep(180, 520, 0.3, 0.07, "square");
      }
      dots.current[r][c] = 0;
      dotCount.current -= 1;

      // Fruit surfaces twice per level, at roughly a third and two thirds eaten.
      const eaten = TOTAL_DOTS - dotCount.current;
      const thresholds = [Math.floor(TOTAL_DOTS * 0.32), Math.floor(TOTAL_DOTS * 0.66)];
      if (fruitStage.current < 2 && eaten >= thresholds[fruitStage.current] && !fruit.current) {
        fruit.current = {
          c: DEN_C,
          r: 13,
          ttl: 9000,
          value: 100 + 100 * levelRef.current,
        };
        fruitStage.current += 1;
      }
    },
    [addScore],
  );

  // --- movement -----------------------------------------------------------

  const advance = useCallback(
    (
      a: Actor,
      speed: number,
      dt: number,
      allowDen: (a: Actor) => boolean,
      onArrive: (a: Actor) => void,
    ) => {
      a.prog += speed * (dt / 1000);
      let guard = 0;
      while (a.prog >= 1 && guard++ < 8) {
        a.prog -= 1;
        a.c = wrapCol(a.c + DIRS[a.dir].x);
        a.r += DIRS[a.dir].y;
        onArrive(a);
        if (!canStep(a.c, a.r, a.dir, allowDen(a))) {
          a.prog = 0;
          break;
        }
      }
    },
    [],
  );

  const updatePlayer = useCallback(
    (dt: number) => {
      const p = player.current;
      // Buffered turning: apply the queued direction whenever it becomes legal.
      if (p.prog === 0 && canStep(p.c, p.r, p.desired, false)) p.dir = p.desired;
      if (p.prog === 0 && !canStep(p.c, p.r, p.dir, false)) return;
      advance(
        p,
        PLAYER_SPEED * levelSpeedMult(levelRef.current),
        dt,
        () => false,
        (a) => {
          const pl = a as Player;
          const f = fruit.current;
          eatAt(pl.c, pl.r);
          if (f && f === fruit.current && f.c === pl.c && f.r === pl.r) {
            addScore(f.value);
            fruit.current = null;
            beep(700, 1200, 0.25, 0.07, "triangle");
          }
          if (canStep(pl.c, pl.r, pl.desired, false)) pl.dir = pl.desired;
        },
      );
    },
    [advance, eatAt, addScore],
  );

  const chooseEnemyDir = useCallback((e: Enemy) => {
    const allowDen = e.mode === "eyes";
    const opp = OPPOSITE[e.dir];
    let options = DIR_ORDER.filter((d) => d !== opp && canStep(e.c, e.r, d, allowDen));
    if (options.length === 0) options = DIR_ORDER.filter((d) => canStep(e.c, e.r, d, allowDen));
    if (options.length === 0) return;

    if (e.mode === "frightened") {
      e.dir = options[Math.floor(Math.random() * options.length)];
      return;
    }
    if (e.kind === "wanderer" && e.mode === "chase") {
      e.dir = options[Math.floor(Math.random() * options.length)];
      return;
    }

    let target: { c: number; r: number };
    const p = player.current;
    if (e.mode === "eyes") {
      target = { c: DEN_C, r: DEN_CENTER_R };
    } else if (e.kind === "chaser") {
      target = { c: p.c, r: p.r };
    } else if (e.kind === "ambusher") {
      target = { c: p.c + 4 * DIRS[p.dir].x, r: p.r + 4 * DIRS[p.dir].y };
    } else {
      // patroller: alternates chasing and retreating to its home corner
      target = patrolChase.current ? { c: p.c, r: p.r } : e.home;
    }

    let best = options[0];
    let bestDist = Infinity;
    // Iterate in the classic priority order so ties resolve deterministically.
    for (const d of DIR_ORDER) {
      if (!options.includes(d)) continue;
      const nc = e.c + DIRS[d].x;
      const nr = e.r + DIRS[d].y;
      const dist = (nc - target.c) ** 2 + (nr - target.r) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    e.dir = best;
  }, []);

  const onEnemyArrive = useCallback(
    (e: Enemy) => {
      if (e.state === "den") {
        // Bounce inside the den until the release timer lets it leave.
        if (e.r <= DEN_TOP) e.dir = "down";
        else if (e.r >= DEN_BOTTOM) e.dir = "up";
        return;
      }
      if (e.state === "leaving") {
        // Slide to the exit column, then climb out through the gate.
        if (e.c !== DEN_C) e.dir = e.c < DEN_C ? "right" : "left";
        else if (e.r > GATE_R) e.dir = "up";
        else {
          e.state = "out";
          e.mode = frightTimer.current > 0 ? "frightened" : "chase";
          e.dir = Math.random() < 0.5 ? "left" : "right";
        }
        return;
      }
      // Eyes that have made it home turn around and re-enter play.
      if (e.mode === "eyes" && e.c === DEN_C && e.r === DEN_CENTER_R) {
        e.mode = "chase";
        e.state = "leaving";
        e.dir = "up";
        return;
      }
      chooseEnemyDir(e);
    },
    [chooseEnemyDir],
  );

  const enemyAllowDen = useCallback((a: Actor) => {
    const e = a as Enemy;
    return e.state === "den" || e.state === "leaving" || e.mode === "eyes";
  }, []);

  const enemySpeed = useCallback((e: Enemy) => {
    if (e.mode === "eyes") return EYES_SPEED;
    if (e.state === "den" || e.state === "leaving") return DEN_SPEED;
    if (e.mode === "frightened") return FRIGHT_SPEED;
    return ENEMY_SPEED * levelSpeedMult(levelRef.current);
  }, []);

  const nextLevel = useCallback(() => {
    levelRef.current += 1;
    setLevel(levelRef.current);
    showBanner(`LEVEL ${levelRef.current.toString().padStart(2, "0")}`);
    beep(523, 1568, 0.45, 0.07, "triangle");
    buildDots();
    fruit.current = null;
    fruitStage.current = 0;
    placeActors();
    freeze.current = 1600;
  }, [showBanner, buildDots, placeActors]);

  const killPlayer = useCallback(() => {
    beep(520, 60, 0.6, 0.08, "sawtooth");
    livesRef.current -= 1;
    setLives(livesRef.current);
    freeze.current = 1200;
    pending.current = "death";
  }, []);

  const actorPixel = useCallback((a: Actor): Vec => {
    let x = (a.c + 0.5) * TILE + DIRS[a.dir].x * a.prog * TILE;
    let y = (a.r + 0.5) * TILE + DIRS[a.dir].y * a.prog * TILE;
    if (x < 0) x += W;
    if (x > W) x -= W;
    return { x, y };
  }, []);

  const checkCollisions = useCallback(() => {
    const p = player.current;
    const pp = actorPixel(p);
    for (const e of enemies.current) {
      if (e.state !== "out" || e.mode === "eyes") continue;
      const ep = actorPixel(e);
      const rawDx = Math.abs(pp.x - ep.x);
      const dx = Math.min(rawDx, W - rawDx);
      if (dx > TILE * 0.55 || Math.abs(pp.y - ep.y) > TILE * 0.55) continue;
      if (e.mode === "frightened") {
        addScore(eatValue.current);
        eatValue.current = Math.min(1600, eatValue.current * 2);
        e.mode = "eyes";
        beep(1000, 1600, 0.18, 0.07, "square");
      } else {
        killPlayer();
        return;
      }
    }
  }, [actorPixel, killPlayer, addScore]);

  const tick = (dt: number) => {
    if (freeze.current > 0) {
      freeze.current -= dt;
      if (freeze.current <= 0 && pending.current === "death") {
        pending.current = null;
        if (livesRef.current <= 0) {
          gameOver();
          return;
        }
        placeActors();
      }
      return;
    }

    anim.current += dt;
    denClock.current += dt;

    patrolTimer.current += dt;
    if (patrolTimer.current >= 8000) {
      patrolTimer.current -= 8000;
      patrolChase.current = !patrolChase.current;
    }

    if (frightTimer.current > 0) {
      frightTimer.current -= dt;
      if (frightTimer.current <= 0) {
        for (const e of enemies.current) {
          if (e.mode === "frightened") e.mode = "chase";
        }
      }
    }

    // Staggered release from the den.
    for (const e of enemies.current) {
      if (e.state === "den" && denClock.current >= e.release) e.state = "leaving";
    }

    updatePlayer(dt);
    for (const e of enemies.current) {
      advance(e, enemySpeed(e), dt, enemyAllowDen, (a) => onEnemyArrive(a as Enemy));
    }

    checkCollisions();
    if (freeze.current > 0) return; // a death was just triggered

    if (fruit.current) {
      fruit.current.ttl -= dt;
      if (fruit.current.ttl <= 0) fruit.current = null;
    }

    if (dotCount.current <= 0) nextLevel();
  };

  // --- drawing ------------------------------------------------------------

  const drawEyes = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, dir: DirName, radius: number) => {
      const off = radius * 0.55;
      const look = DIRS[dir];
      for (const sx of [-1, 1]) {
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.ellipse(x + sx * off, y, radius * 0.42, radius * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(
          x + sx * off + look.x * radius * 0.22,
          y + look.y * radius * 0.28,
          radius * 0.22,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    },
    [],
  );

  const drawEnemy = useCallback(
    (ctx: CanvasRenderingContext2D, e: Enemy) => {
      const { x, y } = actorPixel(e);
      const R = TILE * 0.4;
      if (e.mode === "eyes") {
        drawEyes(ctx, x, y, e.dir, R * 0.9);
        return;
      }

      const flashing =
        e.mode === "frightened" &&
        frightTimer.current > 0 &&
        frightTimer.current < 2000 &&
        Math.floor(frightTimer.current / 220) % 2 === 0;
      const body = e.mode === "frightened" ? (flashing ? "#f8fafc" : "#2036c8") : e.color;

      // Blocky critter body: rounded-square shell with two stubby antennae and
      // a wavy foot fringe — deliberately not a domed ghost silhouette.
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.roundRect(x - R, y - R, R * 2, R * 2, [R * 0.7, R * 0.7, R * 0.28, R * 0.28]);
      ctx.fill();
      // wavy feet
      const wobble = Math.floor(anim.current / 130) % 2 === 0;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const fx = x - R + (R * 2 * (i + 0.5)) / 3;
        ctx.moveTo(fx - R * 0.33, y + R);
        ctx.lineTo(fx, y + R - (wobble === (i % 2 === 0) ? R * 0.5 : R * 0.28));
        ctx.lineTo(fx + R * 0.33, y + R);
      }
      ctx.fillStyle = "#0a0118";
      ctx.fill();
      // antennae
      ctx.strokeStyle = body;
      ctx.lineWidth = 2;
      for (const sx of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(x + sx * R * 0.4, y - R);
        ctx.lineTo(x + sx * R * 0.7, y - R * 1.5);
        ctx.stroke();
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(x + sx * R * 0.7, y - R * 1.55, R * 0.16, 0, Math.PI * 2);
        ctx.fill();
      }

      if (e.mode === "frightened") {
        ctx.fillStyle = flashing ? "#c81f4b" : "#a5f3fc";
        for (const sx of [-1, 1]) {
          ctx.fillRect(x + sx * R * 0.42 - 2, y - 3, 4, 4);
        }
        ctx.strokeStyle = flashing ? "#c81f4b" : "#a5f3fc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 4; i++) {
          const fx = x - R * 0.6 + (R * 1.2 * i) / 4;
          ctx.lineTo(fx, y + R * 0.45 + (i % 2 === 0 ? 0 : 3));
        }
        ctx.stroke();
      } else {
        drawEyes(ctx, x, y - R * 0.1, e.dir, R * 0.85);
      }
    },
    [actorPixel, drawEyes],
  );

  const drawMuncher = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const p = player.current;
      const { x, y } = actorPixel(p);
      const R = TILE * 0.42;
      const moving = p.prog > 0 || canStep(p.c, p.r, p.dir, false);
      const chomp = moving ? (Math.sin(anim.current / 55) + 1) / 2 : 0.15;
      const mouth = (0.06 + chomp * 0.32) * Math.PI;
      const base =
        p.dir === "right"
          ? 0
          : p.dir === "left"
            ? Math.PI
            : p.dir === "up"
              ? -Math.PI / 2
              : Math.PI / 2;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, R, base + mouth, base + Math.PI * 2 - mouth);
      ctx.closePath();
      ctx.fill();
    },
    [actorPixel],
  );

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#060210";
    ctx.fillRect(0, 0, W, H);

    // Walls.
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (MAZE[r][c] !== "#") continue;
        const x = c * TILE;
        const y = r * TILE;
        ctx.fillStyle = WALL_FILL;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, TILE - 4, TILE - 4, 6);
        ctx.fill();
        ctx.strokeStyle = WALL_EDGE;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Den gate — a thin bar across the exit.
    ctx.fillStyle = "#ff6bcb";
    ctx.fillRect(DEN_C * TILE + 4, DEN_TOP * TILE - 1, TILE - 8, 3);

    // Dots and pellets.
    const pulse = 3 + Math.sin(anim.current / 160) * 2;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = dots.current[r]?.[c];
        if (!cell) continue;
        const cx = c * TILE + TILE / 2;
        const cy = r * TILE + TILE / 2;
        ctx.fillStyle = DOT_COLOR;
        if (cell === 1) {
          ctx.fillRect(cx - 2, cy - 2, 4, 4);
        } else {
          const s = 5 + pulse;
          ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
        }
      }
    }

    // Fruit — an original pixel cherry pair.
    if (fruit.current) {
      const f = fruit.current;
      const fx = f.c * TILE + TILE / 2;
      const fy = f.r * TILE + TILE / 2;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(fx - 4, fy + 4, 5, 0, Math.PI * 2);
      ctx.arc(fx + 5, fy + 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fca5a5";
      ctx.fillRect(fx - 6, fy + 1, 2, 2);
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fx - 4, fy + 4);
      ctx.lineTo(fx + 2, fy - 8);
      ctx.lineTo(fx + 5, fy + 5);
      ctx.stroke();
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(fx + 1, fy - 10, 5, 3);
    }

    drawMuncher(ctx);
    for (const e of enemies.current) drawEnemy(ctx, e);
  }, [drawMuncher, drawEnemy]);

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const currentPhase = phaseRef.current;

      if (key in KEY_DIRS) {
        event.preventDefault();
        if (currentPhase === "ready") {
          player.current.desired = KEY_DIRS[key];
          start();
          return;
        }
        if (currentPhase === "playing") player.current.desired = KEY_DIRS[key];
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
  }, [phaseRef, start, changePhase, reset]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const currentPhase = phaseRef.current;
      if (currentPhase === "ready") {
        start();
        return;
      }
      if (currentPhase === "over") {
        reset();
        return;
      }
      if (currentPhase === "paused") {
        changePhase("playing");
        return;
      }
      const t = event.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    },
    [phaseRef, start, reset, changePhase],
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      const s = touchStart.current;
      if (!s || phaseRef.current !== "playing") return;
      const t = event.touches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return;
      player.current.desired =
        Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      touchStart.current = { x: t.clientX, y: t.clientY };
    },
    [phaseRef],
  );

  const onTouchEnd = useCallback(() => {
    touchStart.current = null;
  }, []);

  return (
    <GameShell
      score={score}
      hiScore={Math.max(hiScore, score)}
      hudExtra={
        <>
          <span>
            LV <b>{level.toString().padStart(2, "0")}</b>
          </span>
          <span className={styles.gameLives}>{"▲".repeat(Math.max(0, lives))}</span>
        </>
      }
      controls="◀ ▶ ▲ ▼ MOVE — P PAUSE"
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className={styles.gameCanvas}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
      {banner && phase === "playing" && <div className={styles.waveBanner}>{banner}</div>}
      <PhaseOverlay
        phase={phase}
        score={score}
        isNewBest={isNewBest}
        readyHint="Press any key or tap to munch"
      />
    </GameShell>
  );
}
