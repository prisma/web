import { cn } from "@/lib/utils";

// The canonical triple-band ray: cyan / yellow / red brand anchors.
// Stacked top-to-bottom; pass a direction to run the bands another way.
export function prismBands(direction = "to bottom") {
  return `linear-gradient(${direction}, var(--color-prism-cyan-400) 0% 33%, var(--color-prism-yellow-300) 33% 66%, var(--color-prism-red-500) 66% 100%)`;
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

// The brand motif: light crossing the frame as a triple-band prism ray.
// Size and position via className (h-*, w-*, inset-*, translate-*); rotation
// composes with translate utilities since it uses the CSS `rotate` property.
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
