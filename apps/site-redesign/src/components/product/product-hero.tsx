import { CheckBold } from "@/components/icons/forma";
import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { Texture } from "@/components/brand/texture";
import { cn } from "@/lib/utils";
import { PRODUCT_ILLUSTRATIONS } from "./illustrations";
import type { ProductPageContent } from "./types";

const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"];

// Wraps the emphasized phrase in the glass-light glide (homepage hero idiom).
// Falls back to the plain headline when the phrase isn't found.
function Headline({ headline, emphasis }: { headline: string; emphasis?: string }) {
  const at = emphasis ? headline.indexOf(emphasis) : -1;
  if (!emphasis || at === -1) return headline;
  return (
    <>
      {headline.slice(0, at)}
      <GlassGlide>{emphasis}</GlassGlide>
      {headline.slice(at + emphasis.length)}
    </>
  );
}

// Product hero: the homepage hero's wrapped prismatic panel in a split
// layout — copy on the left, the product abstraction on the right with the
// crisp triple-band ray crossing behind it (light passing through the
// product, same idiom as the homepage console).
export function ProductHero({ name, hero }: Pick<ProductPageContent, "name" | "hero">) {
  const Illustration = hero.illustration ? PRODUCT_ILLUSTRATIONS[hero.illustration] : null;

  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash + beam fan dispersing to white above,
            same values as hero-home.tsx */}
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
          <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          {/* top padding = bottom padding + the fixed header's footprint,
              so the gap under the navbar matches the wrapper's bottom */}
          <div className="mx-auto grid max-w-6xl items-center gap-12 pb-20 pt-36 md:grid-cols-2 md:pb-28 md:pt-48 lg:gap-16">
            {/* copy */}
            <div className="flex flex-col items-start">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {name}
              </p>
              <h1 className="isolate mt-4 max-w-[16ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                <Headline headline={hero.headline} emphasis={hero.headlineEmphasis} />
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {hero.benefits.map((label, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[15px] font-semibold text-foreground"
                  >
                    <CheckBold className={cn("size-4 shrink-0", CHECK_COLORS[i % 3])} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <PrismButton href={hero.primaryCta.href}>{hero.primaryCta.label}</PrismButton>
                <PrismButtonOutline href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </PrismButtonOutline>
              </div>
            </div>

            {/* abstraction: the ray crosses the panel behind it — light
                passing through the product */}
            <div className="relative max-md:mt-4 md:self-stretch">
              {/* slimmer on mobile so the tails don't dominate the panel */}
              <PrismRay
                className="left-[75%] top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-[64rem]"
                angle={-50}
                intensity="hero"
              />
              <div className="relative max-md:aspect-[4/3] md:h-full">
                {Illustration ? (
                  <Illustration />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white/70 backdrop-blur-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      [Product abstraction]
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
