import { cn } from "@prisma-docs/ui/lib/cn";

// Ported from apps/site-redesign/src/components/brand/prism-ray.tsx — the
// canonical triple-band ray: cyan / yellow / red brand anchors, stacked
// top-to-bottom, crossing the frame at the brand angle (-16°, rising to the
// right). Kept API-identical so values stay comparable with the reference.
export function prismBands(direction = "to bottom") {
  const transform = direction === "to right" ? " transform='rotate(-90 1.5 1.5)'" : "";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='3' height='3' viewBox='0 0 3 3' preserveAspectRatio='none'><g${transform}><path fill='#01d7e4' d='M0 0h3v1H0z'/><path fill='#f3c306' d='M0 1h3v1H0z'/><path fill='#f34a60' d='M0 2h3v1H0z'/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / 100% 100%`;
}

const BANDS = prismBands();

const INTENSITY = {
  whisper: { opacity: 0.3, blur: 3 },
  structural: { opacity: 0.6, blur: 1 },
  hero: { opacity: 0.9, blur: 0.5 },
} as const;

const MASKS = {
  both: "linear-gradient(to right, transparent 2%, black 18%, black 82%, transparent 98%)",
  start: "linear-gradient(to right, transparent 2%, black 22%)",
  end: "linear-gradient(to right, black 78%, transparent 98%)",
  none: undefined,
} as const;

type PrismRayProps = {
  className?: string;
  /** degrees; brand angle is -16 (rising to the right) */
  angle?: number;
  intensity?: keyof typeof INTENSITY;
  /** which ends fade out */
  mask?: keyof typeof MASKS;
};

export function PrismRay({
  className,
  angle = -16,
  intensity = "structural",
  mask = "both",
}: PrismRayProps) {
  const { opacity, blur } = INTENSITY[intensity];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
      style={{
        rotate: `${angle}deg`,
        opacity,
        filter: `blur(${blur}px)`,
        background: BANDS,
        maskImage: MASKS[mask],
      }}
    />
  );
}
