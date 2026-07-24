import { cn } from "@/lib/utils"

type Pt = readonly [number, number]

// "Any shape can be a Prisma": a polygon face extruded back into space as
// translucent glass. Faces are hand-tuned irregular outlines (clockwise in
// screen coords); `d` is the extrusion vector.
export const SHAPES = {
  // Traced from the approved brand asset (Figma "any shape" pentagon).
  pentagon: {
    face: [
      [70, 32],
      [139, 44],
      [149.5, 112],
      [87, 143],
      [38, 94],
    ],
    d: [78, 110],
  },
  hexagon: {
    face: [
      [100, 28],
      [163, 62],
      [166, 138],
      [104, 174],
      [40, 142],
      [36, 64],
    ],
    d: [54, 38],
  },
  rect: {
    face: [
      [20, 20],
      [190, 20],
      [190, 130],
      [20, 130],
    ],
    d: [46, 60],
  },
  triangle: {
    face: [
      [100, 22],
      [170, 148],
      [30, 148],
    ],
    d: [50, 36],
  },
} satisfies Record<string, { face: Pt[]; d: Pt }>

const TINTS = {
  /** over color washes — glass the way the brand asset draws it */
  white: {
    face: "rgba(255,255,255,0.42)",
    wall: "rgba(255,255,255,0.24)",
    stroke: "rgba(255,255,255,0.65)",
    back: "rgba(255,255,255,0.28)",
  },
  /** hairline glass for white backgrounds */
  ink: {
    face: "rgba(21,21,21,0.02)",
    wall: "rgba(21,21,21,0.04)",
    stroke: "rgba(21,21,21,0.16)",
    back: "rgba(21,21,21,0.08)",
  },
  /** ink hairlines, face catching the spectrum */
  spectral: {
    face: "gradient",
    wall: "rgba(21,21,21,0.03)",
    stroke: "rgba(21,21,21,0.14)",
    back: "rgba(21,21,21,0.07)",
  },
} as const

function extrude(face: readonly Pt[], d: Pt) {
  const back = face.map(([x, y]) => [x + d[0], y + d[1]] as const)
  // Only side walls facing the extrusion direction are visible.
  const walls: Pt[][] = []
  for (let i = 0; i < face.length; i++) {
    const j = (i + 1) % face.length
    const ex = face[j][0] - face[i][0]
    const ey = face[j][1] - face[i][1]
    if (ey * d[0] - ex * d[1] > 0) walls.push([face[i], face[j], back[j], back[i]])
  }
  const xs = [...face, ...back].map((p) => p[0])
  const ys = [...face, ...back].map((p) => p[1])
  const pad = 2
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const w = Math.max(...xs) - minX + pad
  const h = Math.max(...ys) - minY + pad
  return { back, walls, viewBox: `${minX} ${minY} ${w} ${h}` }
}

const pts = (list: readonly Pt[]) => list.map((p) => p.join(",")).join(" ")

type GlassPrismProps = {
  shape?: keyof typeof SHAPES
  tint?: keyof typeof TINTS
  /** faint outline of the back face, for see-through depth */
  backFace?: boolean
  /** unique per instance when several spectral prisms share a page (SVG ids are document-global) */
  gradientId?: string
  className?: string
}

// Size and position via className (w-* only — height follows the shape's
// aspect ratio); rotation composes since Tailwind v4 rotate-* uses `rotate`.
export function GlassPrism({
  shape = "hexagon",
  tint = "white",
  backFace = true,
  gradientId = "glass-prism-spectrum",
  className,
}: GlassPrismProps) {
  const t = TINTS[tint]
  const { face, d } = SHAPES[shape]
  const { back, walls, viewBox } = extrude(face, d)
  const faceFill = t.face === "gradient" ? `url(#${gradientId})` : t.face

  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      className={cn("pointer-events-none absolute", className)}
    >
      {t.face === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-prism-cyan-400)" stopOpacity={0.14} />
            <stop offset="50%" stopColor="var(--color-prism-yellow-300)" stopOpacity={0.12} />
            <stop offset="100%" stopColor="var(--color-prism-red-500)" stopOpacity={0.14} />
          </linearGradient>
        </defs>
      )}
      {backFace && (
        <polygon
          points={pts(back)}
          fill="none"
          stroke={t.back}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {walls.map((w, i) => (
        <polygon
          key={i}
          points={pts(w)}
          fill={t.wall}
          stroke={t.stroke}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <polygon
        points={pts(face)}
        fill={faceFill}
        stroke={t.stroke}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
