import { cn } from "@prisma-docs/ui/lib/cn";

type Pt = readonly [number, number];

// "Any shape can be a Prisma" (prisma.io/brand, "Glass Prisms"), ported from
// apps/site/src/components/brand/glass-prism.tsx: a polygon face extruded back
// into space as translucent glass. Glass lives in the background: prisms sit
// behind content, cropped by section edges, never in front of copy.
//
// Docs adaptation: the site's ink and spectral tints draw their hairlines in
// literal near-black, which vanishes on the dark theme. Here every hairline
// and wall is `currentColor` at the site's alpha, so the prism follows the
// text colour of whatever it sits in (light or dark). Only the shapes the docs
// use are ported; the pentagon is the canonical brand shape.
const SHAPES = {
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
} satisfies Record<string, { face: Pt[]; d: Pt }>;

const TINTS = {
  /** hairline glass on the page colour */
  ink: { face: 0.02, wall: 0.04, stroke: 0.16, back: 0.08, spectral: false },
  /** hairlines, with the face catching the spectrum */
  spectral: { face: 0, wall: 0.03, stroke: 0.14, back: 0.07, spectral: true },
} as const;

function extrude(face: readonly Pt[], d: Pt) {
  const back = face.map(([x, y]) => [x + d[0], y + d[1]] as const);
  // Only side walls facing the extrusion direction are visible.
  const walls: Pt[][] = [];
  for (let i = 0; i < face.length; i++) {
    const j = (i + 1) % face.length;
    const ex = face[j][0] - face[i][0];
    const ey = face[j][1] - face[i][1];
    if (ey * d[0] - ex * d[1] > 0) walls.push([face[i], face[j], back[j], back[i]]);
  }
  const xs = [...face, ...back].map((p) => p[0]);
  const ys = [...face, ...back].map((p) => p[1]);
  const pad = 2;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;
  return { back, walls, viewBox: `${minX} ${minY} ${w} ${h}` };
}

const pts = (list: readonly Pt[]) => list.map((p) => p.join(",")).join(" ");

// Size and position via className (w-* only; height follows the shape's
// aspect ratio). `gradientId` must be unique per spectral prism on a page.
export function GlassPrism({
  shape = "pentagon",
  tint = "spectral",
  backFace = true,
  gradientId = "docs-glass-prism-spectrum",
  className,
}: {
  shape?: keyof typeof SHAPES;
  tint?: keyof typeof TINTS;
  backFace?: boolean;
  gradientId?: string;
  className?: string;
}) {
  const t = TINTS[tint];
  const { face, d } = SHAPES[shape];
  const { back, walls, viewBox } = extrude(face, d);
  const line = {
    stroke: "currentColor",
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      className={cn("pointer-events-none absolute text-fd-foreground", className)}
    >
      {t.spectral && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-prism-cyan-400)" stopOpacity={0.14} />
            <stop offset="50%" stopColor="var(--color-prism-yellow-300)" stopOpacity={0.12} />
            <stop offset="100%" stopColor="var(--color-prism-red-500)" stopOpacity={0.14} />
          </linearGradient>
        </defs>
      )}
      {backFace && <polygon points={pts(back)} fill="none" {...line} strokeOpacity={t.back} />}
      {walls.map((w, i) => (
        <polygon
          key={i}
          points={pts(w)}
          fill="currentColor"
          fillOpacity={t.wall}
          {...line}
          strokeOpacity={t.stroke}
        />
      ))}
      <polygon
        points={pts(face)}
        fill={t.spectral ? `url(#${gradientId})` : "currentColor"}
        fillOpacity={t.spectral ? 1 : t.face}
        {...line}
        strokeOpacity={t.stroke}
      />
    </svg>
  );
}
