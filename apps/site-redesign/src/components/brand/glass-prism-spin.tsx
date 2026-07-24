"use client"

import { useEffect, useMemo, useRef } from "react"
import { SHAPES } from "@/components/brand/glass-prism"
import { cn } from "@/lib/utils"

type V3 = [number, number, number]

const DEPTH = 80
const CAMERA = 620
const TILT_X = -0.32
const TILT_Z = 0.12

// White glass lives over saturated color (hero corner bloom); ink glass reads
// on light washes where white would vanish. Ink rgb is the brand foreground.
const TINTS = {
  white: { rgb: "255,255,255", stroke: "rgba(255,255,255,0.6)", base: 0.14, range: 0.3 },
  ink: { rgb: "58,59,60", stroke: "rgba(58,59,60,0.055)", base: 0.005, range: 0.015 },
} as const

// The shape outline centered on its centroid and extruded along z into the
// solid's faces: front, back, then one wall per edge.
function makeSolid(shape: keyof typeof SHAPES): V3[][] {
  const outline = SHAPES[shape].face
  const cx = outline.reduce((s, p) => s + p[0], 0) / outline.length
  const cy = outline.reduce((s, p) => s + p[1], 0) / outline.length
  const pts = outline.map(([x, y]) => [x - cx, y - cy] as const)
  const faces: V3[][] = [
    pts.map(([x, y]) => [x, y, -DEPTH / 2]),
    pts.map(([x, y]) => [x, y, DEPTH / 2]),
  ]
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    faces.push([
      [pts[i][0], pts[i][1], -DEPTH / 2],
      [pts[j][0], pts[j][1], -DEPTH / 2],
      [pts[j][0], pts[j][1], DEPTH / 2],
      [pts[i][0], pts[i][1], DEPTH / 2],
    ])
  }
  return faces
}

// Rotate Ry(theta) → Rx → Rz, project with perspective, shade by how much
// the face points at the viewer. Returns one entry per face.
function pose(faces: V3[][], theta: number) {
  const sy = Math.sin(theta)
  const cyr = Math.cos(theta)
  const sx = Math.sin(TILT_X)
  const cx = Math.cos(TILT_X)
  const sz = Math.sin(TILT_Z)
  const cz = Math.cos(TILT_Z)

  return faces.map((verts) => {
    const rot = verts.map(([x, y, z]): V3 => {
      let X = x * cyr + z * sy
      let Z = -x * sy + z * cyr
      let Y = y
      const Y2 = Y * cx - Z * sx
      Z = Y * sx + Z * cx
      Y = Y2
      const X2 = X * cz - Y * sz
      Y = X * sz + Y * cz
      X = X2
      return [X, Y, Z]
    })

    // Newell normal, oriented outward from the solid's center
    let nx = 0
    let ny = 0
    let nz = 0
    let mx = 0
    let my = 0
    let mz = 0
    for (let i = 0; i < rot.length; i++) {
      const [x1, y1, z1] = rot[i]
      const [x2, y2, z2] = rot[(i + 1) % rot.length]
      nx += (y1 - y2) * (z1 + z2)
      ny += (z1 - z2) * (x1 + x2)
      nz += (x1 - x2) * (y1 + y2)
      mx += x1 / rot.length
      my += y1 / rot.length
      mz += z1 / rot.length
    }
    if (nx * mx + ny * my + nz * mz < 0) {
      nx = -nx
      ny = -ny
      nz = -nz
    }
    const facing = Math.max(0, -nz / (Math.hypot(nx, ny, nz) || 1))

    const points = rot
      .map(([X, Y, Z]) => {
        const s = CAMERA / (CAMERA + Z)
        return `${(X * s).toFixed(2)},${(Y * s).toFixed(2)}`
      })
      .join(" ")

    return { points, facing, depth: mz }
  })
}

type GlassPrismSpinProps = {
  shape?: keyof typeof SHAPES
  /** seconds per full revolution */
  period?: number
  /** starting angle in radians — also the static reduced-motion pose */
  initialAngle?: number
  tint?: keyof typeof TINTS
  className?: string
}

// The glass prism as a true 3D solid, slowly turning.
export function GlassPrismSpin({
  shape = "pentagon",
  period = 26,
  initialAngle = 0.9,
  tint = "white",
  className,
}: GlassPrismSpinProps) {
  const { rgb, stroke, base, range } = TINTS[tint]
  const faces = useMemo(() => makeSolid(shape), [shape])
  const first = useMemo(() => pose(faces, initialAngle), [faces, initialAngle])
  const groupRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const group = groupRef.current
    if (!group) return
    const polys: SVGPolygonElement[] = []
    group.querySelectorAll("polygon").forEach((p) => {
      polys[Number(p.dataset.i)] = p
    })

    let raf = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const theta = initialAngle + ((now - start) / 1000 / period) * Math.PI * 2
      const posed = pose(faces, theta)
      posed.forEach(({ points, facing }, i) => {
        polys[i].setAttribute("points", points)
        polys[i].setAttribute("fill", `rgba(${rgb},${(base + range * facing).toFixed(3)})`)
      })
      // painter's order: farthest faces first
      posed
        .map(({ depth }, i) => [depth, i] as const)
        .sort((a, b) => b[0] - a[0])
        .forEach(([, i]) => group.appendChild(polys[i]))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [faces, period, initialAngle, rgb, base, range])

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
              fill={`rgba(${rgb},${(base + range * f.facing).toFixed(3)})`}
              stroke={stroke}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          ))}
      </g>
    </svg>
  )
}
