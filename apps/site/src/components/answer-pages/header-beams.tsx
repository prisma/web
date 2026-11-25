// "Pooled beams": twenty faint connections ease into one cyan focal point and
// leave as five pooled beams, behind a guide's header. The sibling of
// "Cold start ripple" (header-ripple.tsx) for the connection pooling guide:
// same palette, 1px strokes, focal dot, mask fade, mobile placement and very
// slow motion. Rebuilt from the approved "Pooled beams" design file; geometry
// is computed once here from the same constants. Decorative only: aria-hidden,
// no pointer events, and the glints stop under prefers-reduced-motion.

const INK = "#121212";
const CYAN = "#01D7E4";
const TINT_COLORS = { cyan: CYAN, yellow: "#F3C306", red: "#F34A60" } as const;
type Tint = [keyof typeof TINT_COLORS, number];

// viewBox, stretched to the header; strokes stay 1px via non-scaling-stroke.
const VB_W = 1000;
const VB_H = 360;
const BEAMS_IN = 20;
const SPREAD = 195; // incoming beams start within ±SPREAD of the middle
const SPACING_EASE = 1.18; // >1 packs beams a little closer near the middle
const WOBBLE = [
  0.8, -1.2, 0.5, -0.6, 1.1, -0.9, 0.4, -1, 0.7, -0.3, 0.3, -0.7, 1, -0.4, 0.9, -1.1, 0.6, -0.5,
  1.2, -0.8,
];
const BUNDLE = 0.055; // how tightly beams gather at the lens, × start offset
const CP1 = 0.34;
const CP2 = 0.62;
const LENS_GAP = 10;
const IN_OPACITY_EDGE = 0.12;
const IN_OPACITY_CENTRE = 0.06;
const OUT_COUNT = 5;
const OUT_SPACING = 5;
const OUT_OPACITY = 0.18;
const TINTS_IN: Record<number, Tint> = {
  9: ["cyan", 0.55],
  10: ["cyan", 0.3],
  5: ["yellow", 0.35],
  14: ["red", 0.22],
};
const TINTS_OUT: Record<number, Tint> = { 3: ["cyan", 0.4] };
const FADE_FLOOR = 0.3; // incoming beams thin to this as they enter the lens

// Glints: a soft glow that glides along a beam and reveals a cyan copy of it.
const CYCLE = 90;
const IN_TRAVEL = 0.4;
const OUT_TRAVEL = 0.12;
const GLOW_RX = 46;
const GLINT_OPACITY = 0.7;
const GLINTS: { beam: number; begin: number; continueOn?: number }[] = [
  { beam: 3, begin: -20 },
  { beam: 7, begin: 2.5 },
  { beam: 12, begin: 25, continueOn: 2 },
  { beam: 16, begin: 47.5 },
];

type Variant = { fx: number; fy: number; fadeFrom: number; fadeTo: number };
const DESK: Variant = { fx: 760, fy: 180, fadeFrom: 0.62, fadeTo: 0.75 }; // 76%, 50%
const PHONE: Variant = { fx: 940, fy: 32.4, fadeFrom: 0.82, fadeTo: 0.93 }; // 94%, 9%

const r = (n: number) => Math.round(n * 100) / 100;

function startY(i: number) {
  const u = (i / (BEAMS_IN - 1)) * 2 - 1;
  const eased = Math.sign(u) * Math.pow(Math.abs(u), SPACING_EASE);
  return r(VB_H / 2 + eased * SPREAD + WOBBLE[i]);
}

function inPath(i: number, v: Variant) {
  const y0 = startY(i);
  const ex = v.fx - LENS_GAP;
  const ey = r(v.fy + (y0 - v.fy) * BUNDLE);
  return `M0 ${y0} C${r(ex * CP1)} ${y0} ${r(ex * CP2)} ${ey} ${ex} ${ey}`;
}

function inOpacity(i: number) {
  const t = Math.min(1, Math.abs(startY(i) - VB_H / 2) / SPREAD);
  return r(IN_OPACITY_CENTRE + (IN_OPACITY_EDGE - IN_OPACITY_CENTRE) * t);
}

const outY = (k: number, v: Variant) => r(v.fy + (k - (OUT_COUNT - 1) / 2) * OUT_SPACING);

const BEAM = {
  fill: "none",
  strokeWidth: 1,
  strokeLinecap: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

function Beams({ v, name, className }: { v: Variant; name: string; className: string }) {
  const id = (s: string) => `pooled-beams-${name}-${s}`;
  const legs = GLINTS.flatMap((g, n) => {
    const list = [
      { key: `${n}0`, d: inPath(g.beam, v), begin: g.begin, travel: IN_TRAVEL, out: false },
    ];
    if (g.continueOn !== undefined) {
      // Chrome skips masked elements with a zero-height bounding box, so the
      // glint copy of a horizontal beam dips by 0.01 units across its length.
      const y = outY(g.continueOn, v);
      list.push({
        key: `${n}1`,
        d: `M${v.fx + LENS_GAP} ${y} L${VB_W} ${r(y + 0.01)}`,
        begin: r(g.begin + IN_TRAVEL * CYCLE),
        travel: OUT_TRAVEL,
        out: true,
      });
    }
    return list;
  });
  const glints = (out: boolean) => (
    <g className="motion-reduce:hidden">
      {legs
        .filter((leg) => leg.out === out)
        .map((leg) => (
          <path
            key={leg.key}
            d={leg.d}
            {...BEAM}
            stroke={CYAN}
            strokeOpacity={GLINT_OPACITY}
            mask={`url(#${id(`g${leg.key}`)})`}
          />
        ))}
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      focusable="false"
      className={`absolute inset-0 size-full overflow-visible ${className}`}
    >
      <defs>
        <linearGradient
          id={id("fade")}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={VB_W}
          y2="0"
        >
          <stop offset={v.fadeFrom} stopColor="#fff" />
          <stop offset={v.fadeTo} stopColor="#fff" stopOpacity={FADE_FLOOR} />
        </linearGradient>
        <mask
          id={id("lens")}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-100"
          width={VB_W + 100}
          height={VB_H + 200}
        >
          <rect
            x="-50"
            y="-100"
            width={VB_W + 100}
            height={VB_H + 200}
            fill={`url(#${id("fade")})`}
          />
        </mask>
        <radialGradient id={id("glow")}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        {legs.map((leg) => {
          const t = leg.travel;
          return (
            <mask
              key={leg.key}
              id={id(`g${leg.key}`)}
              maskUnits="userSpaceOnUse"
              x="-100"
              y="-100"
              width={VB_W + 200}
              height={VB_H + 200}
            >
              <ellipse rx={GLOW_RX} ry={GLOW_RX * 0.6} fill={`url(#${id("glow")})`} opacity="0">
                <animateMotion
                  dur={`${CYCLE}s`}
                  begin={`${leg.begin}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  keyPoints="0;1;1"
                  keyTimes={`0;${t};1`}
                  path={leg.d}
                />
                <animate
                  attributeName="opacity"
                  dur={`${CYCLE}s`}
                  begin={`${leg.begin}s`}
                  repeatCount="indefinite"
                  values="0;1;1;0;0"
                  keyTimes={`0;${r(t * 0.12)};${r(t * 0.88)};${t};1`}
                />
              </ellipse>
            </mask>
          );
        })}
      </defs>
      <g mask={`url(#${id("lens")})`}>
        {Array.from({ length: BEAMS_IN }, (_, i) => {
          const tint = TINTS_IN[i];
          return (
            <path
              key={i}
              d={inPath(i, v)}
              {...BEAM}
              stroke={tint ? TINT_COLORS[tint[0]] : INK}
              strokeOpacity={tint ? tint[1] : inOpacity(i)}
            />
          );
        })}
        {glints(false)}
      </g>
      <g>
        {Array.from({ length: OUT_COUNT }, (_, k) => {
          const tint = TINTS_OUT[k];
          return (
            <path
              key={k}
              d={`M${v.fx + LENS_GAP} ${outY(k, v)} H${VB_W}`}
              {...BEAM}
              stroke={tint ? TINT_COLORS[tint[0]] : INK}
              strokeOpacity={tint ? tint[1] : OUT_OPACITY}
            />
          );
        })}
        {glints(true)}
      </g>
    </svg>
  );
}

/** A slow "pooled beams" background for the guide header. */
export function HeaderBeams() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-50 [mask-image:linear-gradient(to_right,transparent_15%,black_60%)] sm:opacity-100"
    >
      <Beams v={PHONE} name="phone" className="sm:hidden" />
      <Beams v={DESK} name="desk" className="hidden sm:block" />
      <span
        className="absolute top-[9%] left-[94%] -mt-1.5 -ml-1.5 size-3 rounded-full sm:top-1/2 sm:left-[76%]"
        style={{ background: CYAN, boxShadow: "0 0 0 8px rgba(1,215,228,0.16)" }}
      />
    </div>
  );
}
