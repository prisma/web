"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import { useEffect, useMemo, useRef } from "react";

// Ported from apps/site/src/components/brand/glass-prism-spin.tsx (and the
// two shapes it needs from glass-prism.tsx) for the end-of-post CTA, which reuses
// the site's closing-CTA panel (apps/site/src/components/sections/cta-burst.tsx).
// Keep the geometry and shading in step with the site if either changes.

type V3 = [number, number, number];
type Pt = readonly [number, number];

const SHAPES = {
  hexagon: {
    face: [
      [100, 28],
      [163, 62],
      [166, 138],
      [104, 174],
      [40, 142],
      [36, 64],
    ],
  },
  rect: {
    face: [
      [20, 20],
      [190, 20],
      [190, 130],
      [20, 130],
    ],
  },
} satisfies Record<string, { face: Pt[] }>;

const DEPTH = 80;
const CAMERA = 620;
const TILT_X = -0.32;
const TILT_Z = 0.12;

// White glass over saturated colour, as on the site's hero corner bloom.
const RGB = "255,255,255";
const STROKE = "rgba(255,255,255,0.6)";
const BASE = 0.14;
const RANGE = 0.3;

function makeSolid(shape: keyof typeof SHAPES): V3[][] {
  const outline = SHAPES[shape].face;
  const cx = outline.reduce((s, p) => s + p[0], 0) / outline.length;
  const cy = outline.reduce((s, p) => s + p[1], 0) / outline.length;
  const pts = outline.map(([x, y]) => [x - cx, y - cy] as const);
  const faces: V3[][] = [
    pts.map(([x, y]) => [x, y, -DEPTH / 2]),
    pts.map(([x, y]) => [x, y, DEPTH / 2]),
  ];
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    faces.push([
      [pts[i][0], pts[i][1], -DEPTH / 2],
      [pts[j][0], pts[j][1], -DEPTH / 2],
      [pts[j][0], pts[j][1], DEPTH / 2],
      [pts[i][0], pts[i][1], DEPTH / 2],
    ]);
  }
  return faces;
}

// Rotate Ry(theta) → Rx → Rz, project with perspective, shade by how much the
// face points at the viewer.
function pose(faces: V3[][], theta: number) {
  const sy = Math.sin(theta);
  const cyr = Math.cos(theta);
  const sx = Math.sin(TILT_X);
  const cx = Math.cos(TILT_X);
  const sz = Math.sin(TILT_Z);
  const cz = Math.cos(TILT_Z);

  return faces.map((verts) => {
    const rot = verts.map(([x, y, z]): V3 => {
      let X = x * cyr + z * sy;
      let Z = -x * sy + z * cyr;
      let Y = y;
      const Y2 = Y * cx - Z * sx;
      Z = Y * sx + Z * cx;
      Y = Y2;
      const X2 = X * cz - Y * sz;
      Y = X * sz + Y * cz;
      X = X2;
      return [X, Y, Z];
    });

    let nx = 0;
    let ny = 0;
    let nz = 0;
    let mx = 0;
    let my = 0;
    let mz = 0;
    for (let i = 0; i < rot.length; i++) {
      const [x1, y1, z1] = rot[i];
      const [x2, y2, z2] = rot[(i + 1) % rot.length];
      nx += (y1 - y2) * (z1 + z2);
      ny += (z1 - z2) * (x1 + x2);
      nz += (x1 - x2) * (y1 + y2);
      mx += x1 / rot.length;
      my += y1 / rot.length;
      mz += z1 / rot.length;
    }
    if (nx * mx + ny * my + nz * mz < 0) {
      nx = -nx;
      ny = -ny;
      nz = -nz;
    }
    const facing = Math.max(0, -nz / (Math.hypot(nx, ny, nz) || 1));

    const points = rot
      .map(([X, Y, Z]) => {
        const s = CAMERA / (CAMERA + Z);
        return `${(X * s).toFixed(2)},${(Y * s).toFixed(2)}`;
      })
      .join(" ");

    return { points, facing, depth: mz };
  });
}

// Runs the animation only while the prism is on screen, the tab is visible
// and the reader hasn't asked for reduced motion.
function observeAnimationActivity(element: Element, onChange: (active: boolean) => void) {
  const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let inView = false;
  let active = false;

  const update = () => {
    const next = inView && media.matches && !document.hidden;
    if (next === active) return;
    active = next;
    onChange(active);
  };

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  media.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", update);
    document.removeEventListener("visibilitychange", update);
    if (active) onChange(false);
  };
}

/** A white glass prism as a 3D solid, slowly turning. */
export function GlassPrismSpin({
  shape,
  period = 26,
  initialAngle = 0.9,
  className,
}: {
  shape: keyof typeof SHAPES;
  /** seconds per full revolution */
  period?: number;
  /** starting angle in radians, also the static reduced-motion pose */
  initialAngle?: number;
  className?: string;
}) {
  const faces = useMemo(() => makeSolid(shape), [shape]);
  const first = useMemo(() => pose(faces, initialAngle), [faces, initialAngle]);
  const groupRef = useRef<SVGGElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const group = groupRef.current;
    const svg = group?.ownerSVGElement;
    if (!group || !svg) return;
    const polys: SVGPolygonElement[] = [];
    group.querySelectorAll("polygon").forEach((p) => {
      polys[Number(p.dataset.i)] = p;
    });

    let raf = 0;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) elapsedRef.current += now - previous;
      previous = now;
      const theta = initialAngle + (elapsedRef.current / 1000 / period) * Math.PI * 2;
      const posed = pose(faces, theta);
      posed.forEach(({ points, facing }, i) => {
        polys[i].setAttribute("points", points);
        polys[i].setAttribute("fill", `rgba(${RGB},${(BASE + RANGE * facing).toFixed(3)})`);
      });
      // painter's order: farthest faces first
      const order = posed.map(({ depth }, i) => [depth, i] as const).sort((a, b) => b[0] - a[0]);
      order.forEach(([, i], index) => {
        if (group.children[index] !== polys[i]) {
          group.insertBefore(polys[i], group.children[index] ?? null);
        }
      });
      raf = requestAnimationFrame(tick);
    };
    return observeAnimationActivity(svg, (active) => {
      cancelAnimationFrame(raf);
      previous = null;
      if (active) raf = requestAnimationFrame(tick);
    });
  }, [faces, period, initialAngle]);

  return (
    <svg
      aria-hidden
      viewBox="-90 -90 180 180"
      className={cn("pointer-events-none absolute", className)}
    >
      <g ref={groupRef}>
        {first
          .map((f, i) => [f, i] as const)
          .sort((a, b) => b[0].depth - a[0].depth)
          .map(([f, i]) => (
            <polygon
              key={i}
              data-i={i}
              points={f.points}
              fill={`rgba(${RGB},${(BASE + RANGE * f.facing).toFixed(3)})`}
              stroke={STROKE}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          ))}
      </g>
    </svg>
  );
}
