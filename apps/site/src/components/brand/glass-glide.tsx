import { cn } from "@/lib/utils";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

type GlassGlideProps = {
  children: React.ReactNode;
  className?: string;
};

// A feathered pocket of glass light glides through the wrapped phrase behind
// the letters — soft luminance with a faint prism dispersion inside and a
// soft shadow for body; the ink stays crisp on top. Wrap the headline's most
// important phrase. Desktop only; hidden for reduced motion.
// The headline element (h1) MUST have `isolate`: the light lives at -z-10,
// so it needs a stacking context that wraps ALL the headline text — behind
// every letter, above the panel layers painted before the headline. A
// context on this span alone would lift the light over sibling text.
export function GlassGlide({ children, className }: GlassGlideProps) {
  return (
    <span className={cn("relative md:whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-[-0.35em] -z-10 w-[42%] animate-glass-glide max-md:hidden motion-reduce:hidden"
      >
        {/* soft shadow beneath — gives the light physical presence */}
        <span className="absolute inset-x-[6%] inset-y-[18%] rounded-full bg-black/[0.07] blur-2xl" />
        {/* the glass luminance */}
        <span className="absolute inset-0 rounded-full bg-white/80 blur-xl" />
        {/* prism dispersion inside the light */}
        <span
          className="absolute inset-x-[8%] top-1/2 h-[60%] -translate-y-1/2 rounded-full opacity-40 blur-2xl"
          style={{ background: SPECTRUM }}
        />
      </span>
    </span>
  );
}
