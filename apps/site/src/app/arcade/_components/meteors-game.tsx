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
const H = 480;

// Vector aesthetic — everything is a glowing white outline on near-black.
const COLOR = "#f8fafc";
const DANGER = "#fca5a5";

// Ship physics.
const SHIP_ROT = (230 * Math.PI) / 180; // rad/s
const SHIP_THRUST = 320; // px/s^2 along heading
const SHIP_MAX_SPEED = 360; // px/s
const SHIP_FRICTION = 0.4; // exponential velocity damping per second
const SHIP_RADIUS = 11;
const INVULN_TIME = 2000; // ms of blinking immunity after respawn
const DEATH_FREEZE = 1500; // ms the ship stays shattered before it can respawn
const SAFE_RADIUS = 90; // center must be clear of rocks within this to respawn
const RESPAWN_FORCE_MS = 2500; // stop waiting for a clear center after this long

// The classic bracket ship, pointing along +x at angle 0.
const SHIP_SHAPE: [number, number][] = [
  [14, 0],
  [-10, -9],
  [-6, 0],
  [-10, 9],
];

// Bullets.
const BULLET_SPEED = 480; // px/s, added to the ship's own velocity
const BULLET_LIFE = 1100; // ms
const MAX_BULLETS = 4;
const FIRE_COOLDOWN = 220; // ms between shots when the fire key is held

// Hyperspace.
const HYPERSPACE_COOLDOWN = 1000; // ms
const HYPERSPACE_DEATH_CHANCE = 1 / 6;

const EXTRA_LIFE_EVERY = 10000;

// Saucers.
const SAUCER_MIN_DELAY = 18000;
const SAUCER_MAX_DELAY = 28000;
const SAUCER_SPEED = 110; // px/s horizontal crossing speed
const SAUCER_BULLET_SPEED = 280;
const SAUCER_BULLET_LIFE = 1400;
const BIG_SAUCER = { r: 16, points: 200, fireEvery: 1200 };
const SMALL_SAUCER = { r: 10, points: 1000, fireEvery: 1000 };

type RockSize = "large" | "medium" | "small";

const ROCK_SPECS: Record<
  RockSize,
  { radius: number; points: number; minSpeed: number; maxSpeed: number; mass: number }
> = {
  large: { radius: 42, points: 20, minSpeed: 60, maxSpeed: 90, mass: 4 },
  medium: { radius: 24, points: 50, minSpeed: 90, maxSpeed: 140, mass: 2 },
  small: { radius: 13, points: 100, minSpeed: 140, maxSpeed: 200, mass: 1 },
};
const ROCK_CHILD: Record<RockSize, RockSize | null> = {
  large: "medium",
  medium: "small",
  small: null,
};

type Ship = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  thrusting: boolean;
  alive: boolean;
  invuln: number;
};
type Rock = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: RockSize;
  radius: number;
  angle: number;
  spin: number;
  shape: number[];
};
type Bullet = { x: number; y: number; vx: number; vy: number; ttl: number };
type Saucer = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  big: boolean;
  r: number;
  points: number;
  fireEvery: number;
  fireTimer: number;
  crossed: number; // horizontal distance travelled, used to leave after a full crossing
};
type Debris = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  ttl: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
};

const wrap = (v: number, max: number) => ((v % max) + max) % max;

/** Squared distance on the toroidal (wrapping) playfield. */
function torDist2(ax: number, ay: number, bx: number, by: number) {
  let dx = Math.abs(ax - bx);
  if (dx > W / 2) dx = W - dx;
  let dy = Math.abs(ay - by);
  if (dy > H / 2) dy = H - dy;
  return dx * dx + dy * dy;
}

/** Shortest signed delta from `from` to `to` across a wrapping axis of length `size`. */
function torDelta(from: number, to: number, size: number) {
  let d = to - from;
  if (d > size / 2) d -= size;
  else if (d < -size / 2) d += size;
  return d;
}

/**
 * Closest-approach squared distance between a target center and the motion
 * segment a projectile swept this frame (from its previous position to `bx,by`,
 * displacement `vx*dts, vy*dts`), measured wrap-aware on the torus. Sampling the
 * end point alone lets fast projectiles tunnel through small targets under the
 * dt clamp; sweeping the whole segment closes that gap.
 */
function sweptDist2(
  bx: number,
  by: number,
  vx: number,
  vy: number,
  dts: number,
  cx: number,
  cy: number,
) {
  // Bullet end position relative to the target center (wrap-aware).
  const ex = torDelta(cx, bx, W);
  const ey = torDelta(cy, by, H);
  // This frame's displacement; the segment starts one displacement back.
  const dx = vx * dts;
  const dy = vy * dts;
  const sx = ex - dx;
  const sy = ey - dy;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return sx * sx + sy * sy;
  let t = -(sx * dx + sy * dy) / len2;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const px = sx + t * dx;
  const py = sy + t * dy;
  return px * px + py * py;
}

function makeRock(size: RockSize, x: number, y: number): Rock {
  const spec = ROCK_SPECS[size];
  const verts = 8 + Math.floor(Math.random() * 4); // 8-11 vertices
  const shape = Array.from({ length: verts }, () => 0.72 + Math.random() * 0.55);
  const speed = spec.minSpeed + Math.random() * (spec.maxSpeed - spec.minSpeed);
  const dir = Math.random() * Math.PI * 2;
  return {
    x,
    y,
    vx: Math.cos(dir) * speed,
    vy: Math.sin(dir) * speed,
    size,
    radius: spec.radius,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 1.2,
    shape,
  };
}

export function MeteorsGame({ hiScore, onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    phase,
    phaseRef,
    changePhase,
    score,
    scoreRef,
    addScore: coreAddScore,
    startRound,
    endGame,
    isNewBest,
  } = useGameCore({ hiScore, onGameOver });

  const ship = useRef<Ship>({
    x: W / 2,
    y: H / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    thrusting: false,
    alive: true,
    invuln: 0,
  });
  const rocks = useRef<Rock[]>([]);
  const bullets = useRef<Bullet[]>([]);
  const saucer = useRef<Saucer | null>(null);
  const saucerBullets = useRef<Bullet[]>([]);
  const debris = useRef<Debris[]>([]);

  const keys = useHeldKeys();
  const touch = useRef({ left: false, right: false, thrust: false });
  const tapInfo = useRef<{ t: number; x: number; y: number; moved: boolean } | null>(null);

  const fireCooldown = useRef(0);
  const hyperCooldown = useRef(0);
  const deathTimer = useRef(0);
  const respawnWait = useRef(0);
  const waveDelay = useRef(0);
  const nextExtraLife = useRef(EXTRA_LIFE_EVERY);
  const saucerTimer = useRef(SAUCER_MIN_DELAY);
  const thrustSound = useRef(0);
  const warbleSound = useRef(0);
  const beatTimer = useRef(0);
  const beatHigh = useRef(false);

  const livesRef = useRef(3);
  const waveRef = useRef(1);

  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimeout = useRef<number | undefined>(undefined);

  const showBanner = useCallback((text: string) => {
    setBanner(text);
    window.clearTimeout(bannerTimeout.current);
    bannerTimeout.current = window.setTimeout(() => setBanner(null), 1400);
  }, []);

  useEffect(() => () => window.clearTimeout(bannerTimeout.current), []);

  const spawnWave = useCallback((n: number) => {
    const count = Math.min(4 + n - 1, 10);
    const s = ship.current;
    const next: Rock[] = [];
    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      // Keep large rocks a safe distance from the ship at wave start.
      do {
        x = Math.random() * W;
        y = Math.random() * H;
      } while (torDist2(x, y, s.x, s.y) < 120 * 120);
      next.push(makeRock("large", x, y));
    }
    rocks.current = next;
  }, []);

  const reset = useCallback(() => {
    startRound();
    livesRef.current = 3;
    waveRef.current = 1;
    setLives(3);
    setWave(1);
    keys.current.clear();
    ship.current = {
      x: W / 2,
      y: H / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      thrusting: false,
      alive: true,
      invuln: INVULN_TIME,
    };
    bullets.current = [];
    saucer.current = null;
    saucerBullets.current = [];
    debris.current = [];
    fireCooldown.current = 0;
    hyperCooldown.current = 0;
    deathTimer.current = 0;
    respawnWait.current = 0;
    waveDelay.current = 0;
    nextExtraLife.current = EXTRA_LIFE_EVERY;
    saucerTimer.current = SAUCER_MIN_DELAY + Math.random() * (SAUCER_MAX_DELAY - SAUCER_MIN_DELAY);
    thrustSound.current = 0;
    warbleSound.current = 0;
    beatTimer.current = 0;
    beatHigh.current = false;
    spawnWave(1);
    changePhase("ready");
  }, [spawnWave, changePhase, startRound, keys]);

  const gameOver = useCallback(() => {
    beep(300, 40, 0.7, 0.09, "sawtooth");
    endGame();
  }, [endGame]);

  const addScore = useCallback(
    (points: number) => {
      coreAddScore(points);
      while (scoreRef.current >= nextExtraLife.current) {
        nextExtraLife.current += EXTRA_LIFE_EVERY;
        livesRef.current += 1;
        setLives(livesRef.current);
        showBanner("1UP");
        beep(784, 1568, 0.25, 0.07, "triangle");
      }
    },
    [coreAddScore, scoreRef, showBanner],
  );

  const tryFire = useCallback(() => {
    const s = ship.current;
    if (!s.alive) return;
    if (fireCooldown.current > 0 || bullets.current.length >= MAX_BULLETS) return;
    fireCooldown.current = FIRE_COOLDOWN;
    const cos = Math.cos(s.angle);
    const sin = Math.sin(s.angle);
    bullets.current.push({
      x: s.x + cos * 14,
      y: s.y + sin * 14,
      vx: cos * BULLET_SPEED + s.vx,
      vy: sin * BULLET_SPEED + s.vy,
      ttl: BULLET_LIFE,
    });
    beep(880, 440, 0.08, 0.04, "square");
  }, []);

  const createDebris = useCallback((s: Ship) => {
    const cos = Math.cos(s.angle);
    const sin = Math.sin(s.angle);
    const rot = (px: number, py: number) => ({
      x: s.x + px * cos - py * sin,
      y: s.y + px * sin + py * cos,
    });
    const next: Debris[] = [];
    for (let i = 0; i < SHIP_SHAPE.length; i++) {
      const a = rot(SHIP_SHAPE[i][0], SHIP_SHAPE[i][1]);
      const b = rot(
        SHIP_SHAPE[(i + 1) % SHIP_SHAPE.length][0],
        SHIP_SHAPE[(i + 1) % SHIP_SHAPE.length][1],
      );
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const outAngle = Math.atan2(my - s.y, mx - s.x);
      const sp = 24 + Math.random() * 44;
      next.push({
        x: mx,
        y: my,
        vx: s.vx * 0.5 + Math.cos(outAngle) * sp,
        vy: s.vy * 0.5 + Math.sin(outAngle) * sp,
        angle: 0,
        spin: (Math.random() - 0.5) * 5,
        ttl: 1300,
        ax: a.x - mx,
        ay: a.y - my,
        bx: b.x - mx,
        by: b.y - my,
      });
    }
    debris.current = next;
  }, []);

  const killShip = useCallback(() => {
    const s = ship.current;
    if (!s.alive || s.invuln > 0) return;
    createDebris(s);
    s.alive = false;
    s.thrusting = false;
    touch.current = { left: false, right: false, thrust: false };
    // Drop held keys so e.g. a Space held through the death can't auto-fire
    // the moment the ship respawns.
    keys.current.clear();
    deathTimer.current = DEATH_FREEZE;
    respawnWait.current = 0;
    livesRef.current -= 1;
    setLives(livesRef.current);
    beep(400, 40, 0.6, 0.09, "sawtooth");
  }, [createDebris, keys]);

  const respawn = useCallback((invuln: number) => {
    const s = ship.current;
    s.x = W / 2;
    s.y = H / 2;
    s.vx = 0;
    s.vy = 0;
    s.angle = -Math.PI / 2;
    s.thrusting = false;
    s.alive = true;
    s.invuln = invuln;
    debris.current = [];
  }, []);

  const splitRock = useCallback(
    (rock: Rock, awardPoints: boolean) => {
      const spec = ROCK_SPECS[rock.size];
      if (awardPoints) addScore(spec.points);
      beep(
        rock.size === "large" ? 120 : rock.size === "medium" ? 180 : 240,
        rock.size === "large" ? 30 : rock.size === "medium" ? 40 : 50,
        rock.size === "large" ? 0.35 : rock.size === "medium" ? 0.25 : 0.18,
        rock.size === "large" ? 0.08 : 0.06,
        "sawtooth",
      );
      const child = ROCK_CHILD[rock.size];
      const spawned: Rock[] = [];
      if (child) {
        for (let i = 0; i < 2; i++) spawned.push(makeRock(child, rock.x, rock.y));
      }
      return spawned;
    },
    [addScore],
  );

  const spawnSaucer = useCallback(() => {
    const score = scoreRef.current;
    let big: boolean;
    if (score < 8000) big = true;
    else if (score >= 30000) big = false;
    else big = Math.random() < 0.5;
    const spec = big ? BIG_SAUCER : SMALL_SAUCER;
    const dir = Math.random() < 0.5 ? 1 : -1;
    saucer.current = {
      x: dir === 1 ? -spec.r : W + spec.r,
      y: Math.random() * H,
      vx: dir * SAUCER_SPEED,
      vy: (Math.random() - 0.5) * 40,
      big,
      r: spec.r,
      points: spec.points,
      fireEvery: spec.fireEvery,
      fireTimer: spec.fireEvery * (0.5 + Math.random()),
      crossed: 0,
    };
    beep(500, 900, 0.3, 0.04, "sine");
  }, [scoreRef]);

  const saucerFire = useCallback(() => {
    const u = saucer.current;
    if (!u) return;
    let angle: number;
    if (u.big) {
      angle = Math.random() * Math.PI * 2;
    } else {
      const s = ship.current;
      const dx = torDelta(u.x, s.x, W);
      const dy = torDelta(u.y, s.y, H);
      angle = Math.atan2(dy, dx) + ((Math.random() - 0.5) * 30 * Math.PI) / 180;
    }
    saucerBullets.current.push({
      x: u.x,
      y: u.y,
      vx: Math.cos(angle) * SAUCER_BULLET_SPEED,
      vy: Math.sin(angle) * SAUCER_BULLET_SPEED,
      ttl: SAUCER_BULLET_LIFE,
    });
    beep(300, 600, 0.1, 0.05, "square");
  }, []);

  const nextWave = useCallback(() => {
    waveRef.current += 1;
    setWave(waveRef.current);
    showBanner(`WAVE ${waveRef.current.toString().padStart(2, "0")}`);
    beep(440, 660, 0.3, 0.06, "triangle");
    spawnWave(waveRef.current);
  }, [showBanner, spawnWave]);

  const doHyperspace = useCallback(() => {
    const s = ship.current;
    if (!s.alive || hyperCooldown.current > 0) return;
    hyperCooldown.current = HYPERSPACE_COOLDOWN;
    s.x = Math.random() * W;
    s.y = Math.random() * H;
    s.vx = 0;
    s.vy = 0;
    beep(1200, 200, 0.15, 0.05, "sine");
    // Classic risk: a small chance the jump ends in an explosion.
    if (Math.random() < HYPERSPACE_DEATH_CHANCE) {
      s.invuln = 0;
      killShip();
    }
  }, [killShip]);

  const centerClear = useCallback(() => {
    for (const rock of rocks.current) {
      if (torDist2(rock.x, rock.y, W / 2, H / 2) < (SAFE_RADIUS + rock.radius) ** 2) return false;
    }
    return true;
  }, []);

  const tick = (dt: number) => {
    const dts = dt / 1000;
    const s = ship.current;

    fireCooldown.current = Math.max(0, fireCooldown.current - dt);
    hyperCooldown.current = Math.max(0, hyperCooldown.current - dt);

    // --- ship control / physics ---
    if (s.alive) {
      if (s.invuln > 0) s.invuln = Math.max(0, s.invuln - dt);
      const k = keys.current;
      const left = k.has("arrowleft") || k.has("a") || touch.current.left;
      const right = k.has("arrowright") || k.has("d") || touch.current.right;
      if (left) s.angle -= SHIP_ROT * dts;
      if (right) s.angle += SHIP_ROT * dts;

      s.thrusting = k.has("arrowup") || k.has("w") || touch.current.thrust;
      if (s.thrusting) {
        s.vx += Math.cos(s.angle) * SHIP_THRUST * dts;
        s.vy += Math.sin(s.angle) * SHIP_THRUST * dts;
        thrustSound.current -= dt;
        if (thrustSound.current <= 0) {
          thrustSound.current = 150;
          beep(70, 55, 0.12, 0.04, "sawtooth");
        }
      }
      // Exponential drift damping, then hard speed cap.
      const damp = Math.exp(-SHIP_FRICTION * dts);
      s.vx *= damp;
      s.vy *= damp;
      const sp = Math.hypot(s.vx, s.vy);
      if (sp > SHIP_MAX_SPEED) {
        s.vx = (s.vx / sp) * SHIP_MAX_SPEED;
        s.vy = (s.vy / sp) * SHIP_MAX_SPEED;
      }
      s.x = wrap(s.x + s.vx * dts, W);
      s.y = wrap(s.y + s.vy * dts, H);

      if (k.has(" ")) tryFire();
    } else {
      // Shattered — count down, then wait for a clear center to respawn.
      if (deathTimer.current > 0) {
        deathTimer.current -= dt;
      } else if (livesRef.current <= 0) {
        gameOver();
        return;
      } else {
        // Wait for a clear center, but never forever — a rock orbiting the
        // middle would otherwise stall the respawn indefinitely.
        respawnWait.current += dt;
        if (centerClear() || respawnWait.current >= RESPAWN_FORCE_MS) {
          respawn(INVULN_TIME);
        }
      }
    }

    // --- debris ---
    if (debris.current.length > 0) {
      for (const d of debris.current) {
        d.x = wrap(d.x + d.vx * dts, W);
        d.y = wrap(d.y + d.vy * dts, H);
        d.angle += d.spin * dts;
        d.ttl -= dt;
      }
      debris.current = debris.current.filter((d) => d.ttl > 0);
    }

    // --- bullets ---
    for (const b of bullets.current) {
      b.x = wrap(b.x + b.vx * dts, W);
      b.y = wrap(b.y + b.vy * dts, H);
      b.ttl -= dt;
    }
    bullets.current = bullets.current.filter((b) => b.ttl > 0);

    // --- rocks ---
    for (const rock of rocks.current) {
      rock.x = wrap(rock.x + rock.vx * dts, W);
      rock.y = wrap(rock.y + rock.vy * dts, H);
      rock.angle += rock.spin * dts;
    }

    // --- saucer ---
    if (saucer.current) {
      const u = saucer.current;
      u.x += u.vx * dts;
      u.crossed += Math.abs(u.vx) * dts;
      u.y = wrap(u.y + u.vy * dts, H);
      warbleSound.current -= dt;
      if (warbleSound.current <= 0) {
        warbleSound.current = 550;
        beep(u.big ? 440 : 620, u.big ? 620 : 440, 0.14, 0.035, "sine");
      }
      u.fireTimer -= dt;
      if (u.fireTimer <= 0) {
        u.fireTimer = u.fireEvery * (0.7 + Math.random() * 0.6);
        saucerFire();
      }
      // Leave once it has travelled the full width plus a margin.
      if (u.crossed > W + u.r * 2) {
        saucer.current = null;
        saucerTimer.current =
          SAUCER_MIN_DELAY + Math.random() * (SAUCER_MAX_DELAY - SAUCER_MIN_DELAY);
      }
    } else {
      saucerTimer.current -= dt;
      if (saucerTimer.current <= 0) spawnSaucer();
    }

    // --- saucer bullets ---
    for (const b of saucerBullets.current) {
      b.x = wrap(b.x + b.vx * dts, W);
      b.y = wrap(b.y + b.vy * dts, H);
      b.ttl -= dt;
    }
    saucerBullets.current = saucerBullets.current.filter((b) => b.ttl > 0);

    // --- collisions: player bullets vs rocks / saucer ---
    const survivingRocks: Rock[] = [];
    const spentBullets = new Set<Bullet>();
    for (const rock of rocks.current) {
      let hit = false;
      for (const b of bullets.current) {
        if (spentBullets.has(b)) continue;
        if (sweptDist2(b.x, b.y, b.vx, b.vy, dts, rock.x, rock.y) < rock.radius ** 2) {
          hit = true;
          spentBullets.add(b);
          survivingRocks.push(...splitRock(rock, true));
          break;
        }
      }
      if (!hit) survivingRocks.push(rock);
    }
    rocks.current = survivingRocks;

    if (saucer.current) {
      const u = saucer.current;
      for (const b of bullets.current) {
        if (spentBullets.has(b)) continue;
        if (sweptDist2(b.x, b.y, b.vx, b.vy, dts, u.x, u.y) < u.r ** 2) {
          spentBullets.add(b);
          addScore(u.points);
          beep(900, 120, 0.35, 0.08, "sawtooth");
          saucer.current = null;
          saucerTimer.current =
            SAUCER_MIN_DELAY + Math.random() * (SAUCER_MAX_DELAY - SAUCER_MIN_DELAY);
          break;
        }
      }
    }
    if (spentBullets.size > 0) {
      bullets.current = bullets.current.filter((b) => !spentBullets.has(b));
    }

    // --- collisions: saucer vs rocks (splits, no points) ---
    if (saucer.current) {
      const u = saucer.current;
      const kept: Rock[] = [];
      let smashed = false;
      for (const rock of rocks.current) {
        if (!smashed && torDist2(u.x, u.y, rock.x, rock.y) < (u.r + rock.radius) ** 2) {
          smashed = true;
          kept.push(...splitRock(rock, false));
        } else {
          kept.push(rock);
        }
      }
      rocks.current = kept;
      if (smashed) {
        saucer.current = null;
        saucerTimer.current =
          SAUCER_MIN_DELAY + Math.random() * (SAUCER_MAX_DELAY - SAUCER_MIN_DELAY);
      }
    }

    // --- collisions vs ship ---
    if (s.alive && s.invuln <= 0) {
      for (const rock of rocks.current) {
        if (torDist2(s.x, s.y, rock.x, rock.y) < (rock.radius + SHIP_RADIUS) ** 2) {
          killShip();
          break;
        }
      }
    }
    if (s.alive && s.invuln <= 0) {
      const spentSaucerBullets = new Set<Bullet>();
      for (const b of saucerBullets.current) {
        if (sweptDist2(b.x, b.y, b.vx, b.vy, dts, s.x, s.y) < (SHIP_RADIUS + 3) ** 2) {
          spentSaucerBullets.add(b);
          killShip();
          break;
        }
      }
      if (spentSaucerBullets.size > 0) {
        saucerBullets.current = saucerBullets.current.filter((b) => !spentSaucerBullets.has(b));
      }
    }
    if (s.alive && s.invuln <= 0 && saucer.current) {
      const u = saucer.current;
      if (torDist2(s.x, s.y, u.x, u.y) < (u.r + SHIP_RADIUS) ** 2) {
        saucer.current = null;
        saucerTimer.current =
          SAUCER_MIN_DELAY + Math.random() * (SAUCER_MAX_DELAY - SAUCER_MIN_DELAY);
        killShip();
      }
    }

    // --- wave progression ---
    if (rocks.current.length === 0) {
      if (waveDelay.current <= 0) waveDelay.current = 1600;
      else {
        waveDelay.current -= dt;
        if (waveDelay.current <= 0) {
          waveDelay.current = 0;
          nextWave();
        }
      }
    }

    // --- two-tone heartbeat, faster as the field thins out ---
    const mass = rocks.current.reduce((sum, r) => sum + ROCK_SPECS[r.size].mass, 0);
    beatTimer.current -= dt;
    if (beatTimer.current <= 0 && mass > 0 && phaseRef.current === "playing") {
      beatTimer.current = Math.max(240, 200 + mass * 28);
      beatHigh.current = !beatHigh.current;
      beep(beatHigh.current ? 60 : 44, beatHigh.current ? 60 : 44, 0.12, 0.05, "triangle");
    }
  };

  // --- drawing ------------------------------------------------------------

  const strokePolygon = useCallback(
    (ctx: CanvasRenderingContext2D, pts: [number, number][], ox: number, oy: number) => {
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const px = pts[i][0] + ox;
        const py = pts[i][1] + oy;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    },
    [],
  );

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const s = ship.current;

    ctx.fillStyle = "#04060d";
    ctx.fillRect(0, 0, W, H);

    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowBlur = 8;

    // Wrapping offsets so shapes near an edge appear on the far side too.
    const offsets = (x: number, y: number, r: number) => {
      const list: [number, number][] = [[0, 0]];
      const ox = x < r ? W : x > W - r ? -W : 0;
      const oy = y < r ? H : y > H - r ? -H : 0;
      if (ox) list.push([ox, 0]);
      if (oy) list.push([0, oy]);
      if (ox && oy) list.push([ox, oy]);
      return list;
    };

    // Rocks.
    ctx.strokeStyle = COLOR;
    ctx.shadowColor = COLOR;
    for (const rock of rocks.current) {
      const pts: [number, number][] = rock.shape.map((mult, i) => {
        const a = rock.angle + (i / rock.shape.length) * Math.PI * 2;
        return [
          rock.x + Math.cos(a) * rock.radius * mult,
          rock.y + Math.sin(a) * rock.radius * mult,
        ];
      });
      // Lobes reach 1.27x the nominal radius (0.72 + 0.55 max multiplier), so
      // widen the wrap margin to that extent to avoid seam pop-in.
      for (const [ox, oy] of offsets(rock.x, rock.y, rock.radius * 1.27))
        strokePolygon(ctx, pts, ox, oy);
    }

    // Player bullets.
    ctx.fillStyle = COLOR;
    ctx.shadowColor = COLOR;
    for (const b of bullets.current) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Saucer bullets.
    ctx.fillStyle = DANGER;
    ctx.shadowColor = DANGER;
    for (const b of saucerBullets.current) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Saucer — two stacked polygons.
    if (saucer.current) {
      const u = saucer.current;
      ctx.strokeStyle = DANGER;
      ctx.shadowColor = DANGER;
      const r = u.r;
      const body: [number, number][] = [
        [-r, 0],
        [-r * 0.45, -r * 0.5],
        [r * 0.45, -r * 0.5],
        [r, 0],
        [r * 0.45, r * 0.45],
        [-r * 0.45, r * 0.45],
      ];
      const dome: [number, number][] = [
        [-r * 0.45, -r * 0.5],
        [-r * 0.22, -r],
        [r * 0.22, -r],
        [r * 0.45, -r * 0.5],
      ];
      for (const [ox, oy] of offsets(u.x, u.y, r)) {
        strokePolygon(ctx, body, u.x + ox, u.y + oy);
        ctx.beginPath();
        ctx.moveTo(u.x + ox - r, u.y + oy);
        ctx.lineTo(u.x + ox + r, u.y + oy);
        ctx.stroke();
        strokePolygon(ctx, dome, u.x + ox, u.y + oy);
      }
    }

    // Debris (shattered ship).
    ctx.strokeStyle = COLOR;
    ctx.shadowColor = COLOR;
    for (const d of debris.current) {
      const cos = Math.cos(d.angle);
      const sin = Math.sin(d.angle);
      ctx.beginPath();
      ctx.moveTo(d.x + d.ax * cos - d.ay * sin, d.y + d.ax * sin + d.ay * cos);
      ctx.lineTo(d.x + d.bx * cos - d.by * sin, d.y + d.bx * sin + d.by * cos);
      ctx.stroke();
    }

    // Ship — blinks while invulnerable.
    const blink = s.invuln > 0 && Math.floor(s.invuln / 120) % 2 === 0;
    if (s.alive && !blink) {
      const cos = Math.cos(s.angle);
      const sin = Math.sin(s.angle);
      const pts: [number, number][] = SHIP_SHAPE.map(([px, py]) => [
        s.x + px * cos - py * sin,
        s.y + px * sin + py * cos,
      ]);
      ctx.strokeStyle = COLOR;
      ctx.shadowColor = COLOR;
      for (const [ox, oy] of offsets(s.x, s.y, 16)) strokePolygon(ctx, pts, ox, oy);
      // Thrust flame flickers behind the notch.
      if (s.thrusting && Math.random() < 0.6) {
        const flame: [number, number][] = [
          [-6, -4],
          [-16 - Math.random() * 5, 0],
          [-6, 4],
        ];
        const fpts: [number, number][] = flame.map(([px, py]) => [
          s.x + px * cos - py * sin,
          s.y + px * sin + py * cos,
        ]);
        ctx.beginPath();
        ctx.moveTo(fpts[0][0], fpts[0][1]);
        ctx.lineTo(fpts[1][0], fpts[1][1]);
        ctx.lineTo(fpts[2][0], fpts[2][1]);
        ctx.stroke();
      }
    }

    ctx.shadowBlur = 0;
  }, [strokePolygon]);

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
    showBanner("WAVE 01");
    changePhase("playing");
  }, [changePhase, showBanner]);

  useEffect(() => {
    const GAME_KEYS = [
      "arrowleft",
      "arrowright",
      "arrowup",
      "arrowdown",
      "a",
      "d",
      "w",
      " ",
      "shift",
    ];
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const currentPhase = phaseRef.current;

      if (GAME_KEYS.includes(key)) {
        event.preventDefault();
        keys.current.add(key);
        if (currentPhase === "ready") {
          start();
          return;
        }
        if (currentPhase === "over") {
          if (key === " " && !event.repeat) reset();
          return;
        }
        if (currentPhase === "playing") {
          if (key === " " && !event.repeat) tryFire();
          if ((key === "shift" || key === "arrowdown") && !event.repeat) doHyperspace();
        }
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
  }, [phaseRef, keys, start, changePhase, reset, tryFire, doHyperspace]);

  const canvasX = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return W / 2;
    const rect = canvas.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * W;
  }, []);

  const applyZones = useCallback(
    (touches: React.TouchList) => {
      let left = false;
      let right = false;
      let thrust = false;
      for (let i = 0; i < touches.length; i++) {
        const x = canvasX(touches[i].clientX);
        if (x < W / 3) left = true;
        else if (x > (2 * W) / 3) right = true;
        else thrust = true;
      }
      touch.current = { left, right, thrust };
    },
    [canvasX],
  );

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
      // A deliberate two-finger *tap* triggers hyperspace: the second finger
      // must land shortly after a still first touch. Otherwise the extra finger
      // is part of the hold-to-turn-and-thrust scheme, so fall through to zones.
      if (event.touches.length >= 2) {
        const info = tapInfo.current;
        if (info && !info.moved && performance.now() - info.t < 250) {
          doHyperspace();
          tapInfo.current = null;
          applyZones(event.touches);
          return;
        }
        tapInfo.current = null;
        applyZones(event.touches);
        return;
      }
      const t = event.touches[0];
      tapInfo.current = { t: performance.now(), x: t.clientX, y: t.clientY, moved: false };
      applyZones(event.touches);
    },
    [phaseRef, start, reset, changePhase, doHyperspace, applyZones],
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      const info = tapInfo.current;
      if (info) {
        const t = event.touches[0];
        if (t && (Math.abs(t.clientX - info.x) > 12 || Math.abs(t.clientY - info.y) > 12)) {
          info.moved = true;
        }
      }
      if (phaseRef.current === "playing") applyZones(event.touches);
    },
    [phaseRef, applyZones],
  );

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 0) {
        const info = tapInfo.current;
        // A brief, still touch is a fire tap.
        if (
          info &&
          !info.moved &&
          performance.now() - info.t < 250 &&
          phaseRef.current === "playing"
        ) {
          tryFire();
        }
        tapInfo.current = null;
        touch.current = { left: false, right: false, thrust: false };
      } else if (phaseRef.current === "playing") {
        applyZones(event.touches);
      }
    },
    [phaseRef, tryFire, applyZones],
  );

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
      controls="◀ ▶ TURN — ▲ THRUST — SPACE FIRE — ⇧ JUMP — P PAUSE"
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className={styles.gameCanvas}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      />
      {banner && phase === "playing" && <div className={styles.waveBanner}>{banner}</div>}
      <PhaseOverlay
        phase={phase}
        score={score}
        isNewBest={isNewBest}
        readyHint="Press any key to launch — or tap"
      />
    </GameShell>
  );
}
