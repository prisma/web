import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { Texture } from "@/components/brand/texture";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// Platform index hero: the homepage's wrapped prismatic panel reduced to its
// quietest state — heading and description only, so the product list below is
// what the page actually asks you to act on.
// The section's pb matches the page gutter, so the products panel below sits
// in the same 3/4 rhythm as the panel's other edges.
export function PlatformHero() {
  return (
    <section className="bg-white px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* prismatic backdrop — spectral wash along the bottom edge dispersing
            to white above, the same treatment as the homepage hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          {/* beam fan rising from below */}
          <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
          {/* dispersion back to white above */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        {/* the glass monument rising out of the corner where the spectrum
            concentrates behind it */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute bottom-[-14rem] right-[-10rem] h-[30rem] w-[46rem] rounded-full opacity-30 blur-[90px]"
            style={{ backgroundImage: SPECTRUM }}
          />
          <GlassPrismSpin
            shape="pentagon"
            className="bottom-[-11rem] right-[-8rem] w-[30rem] max-md:bottom-[-6rem] max-md:right-[-5rem] max-md:w-[16rem]"
          />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          {/* pt clears the fixed navbar in its docked state */}
          <div className="mx-auto flex max-w-4xl flex-col items-start pb-24 pt-28 text-left md:items-center md:pb-28 md:pt-36 md:text-center">
            {/* h1 and description carry the homepage hero's exact type
                treatment — same clamp, leading, and measure (see hero-home) */}
            <h1 className="max-w-[20ch] text-balance text-[clamp(2.5rem,4.5vw,3.875rem)] leading-[1.06]">
              Build and ship your whole backend in one place
            </h1>
            <p className="mt-6 max-w-[64ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              A type-safe ORM, managed Postgres, and TypeScript app hosting, built to work together
              natively rather than wired together after the fact. Start with any one of them and add
              the rest when you&apos;re ready to ship.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-start gap-3 md:justify-center">
              <PrismButton href="https://console.prisma.io">Get started free</PrismButton>
              <PrismButtonOutline href="/pricing">See pricing</PrismButtonOutline>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
