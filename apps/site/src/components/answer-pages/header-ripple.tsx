// "Cold start ripple": concentric rings spreading from a small cyan point, with
// faint yellow and red tints on two rings, behind a guide's header. Rebuilt in
// CSS from the design mockup's values (ring radii 14 × 1.42^i, ink rings fading
// outward, three waves), with the waves slowed right down so the background
// stays quiet. Decorative only: aria-hidden, no pointer events, and the waves
// stop under prefers-reduced-motion (see .guide-ripple-wave in globals.css).

const ACCENT = "#01D7E4";
const TINTS: Record<number, [string, number]> = {
  0: [ACCENT, 0.55],
  1: [ACCENT, 0.3],
  4: ["#F3C306", 0.35],
  6: ["#F34A60", 0.22],
};

const RINGS = Array.from({ length: 11 }, (_, i) => {
  const d = 2 * 14 * Math.pow(1.42, i);
  const tint = TINTS[i];
  return {
    d: Math.round(d * 10) / 10,
    color: tint ? tint[0] : "#121212",
    opacity: tint ? tint[1] : Math.round((0.14 * Math.pow(0.86, i) + 0.04) * 1000) / 1000,
  };
});

/** A slow ripple background for the guide header. */
export function HeaderRipple() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-50 [mask-image:linear-gradient(to_right,transparent_15%,black_60%)] sm:opacity-100"
    >
      <div className="absolute top-[9%] left-[94%] sm:top-1/2 sm:left-[76%]">
        <div className="absolute top-0 right-0 h-px w-[76vw] max-w-[60rem] bg-gradient-to-r from-transparent to-black/[0.14]" />
        {RINGS.map((ring) => (
          <div
            key={ring.d}
            className="absolute rounded-full border"
            style={{
              width: ring.d,
              height: ring.d,
              left: -ring.d / 2,
              top: -ring.d / 2,
              borderColor: ring.color,
              opacity: ring.opacity,
            }}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="guide-ripple-wave absolute rounded-full border border-[#121212]"
            style={{
              width: 1152,
              height: 1152,
              left: -576,
              top: -576,
              animationDelay: `${i * 15}s`,
            }}
          />
        ))}
        <div
          className="absolute size-3 rounded-full"
          style={{
            left: -6,
            top: -6,
            background: ACCENT,
            boxShadow: "0 0 0 8px rgba(1,215,228,0.16)",
          }}
        />
      </div>
    </div>
  );
}
