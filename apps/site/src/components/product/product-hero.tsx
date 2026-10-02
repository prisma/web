import { CheckBold } from "@/components/icons/forma";
import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { cn } from "@/lib/utils";
import { PLATFORM_PRODUCT_ACCENTS, type ProductAccentName } from "./icons";
import { PRODUCT_ILLUSTRATIONS } from "./illustrations";
import { ProductTour } from "./product-tour";
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
// layout — copy on the left, the product demo on the right with the crisp
// triple-band ray crossing behind it (light passing through the product, same
// idiom as the homepage console).
//
// Two things the 2026-08-06 client review changed here:
//  - The CTA used to come last, under the subheadline AND three benefit lines,
//    which put it at 675–757px. On /orm that is below the fold at 1440x800,
//    and at any size it read as a repeat of the identical black pill in the
//    navbar. It now follows the subheadline directly, at lg size, with the
//    benefits demoted underneath it.
//  - The visual takes the larger half of the split and runs the product tour,
//    so the first screen demonstrates the product instead of describing it.
export function ProductHero({
  name,
  accent,
  hero,
  visual,
  placeholderLabel = "[Product abstraction]",
  benefitsPlacement = "below-cta",
}: Pick<ProductPageContent, "name" | "hero"> & {
  /**
   * A Platform product's canonical accent, or a raw `bg-*` class for pages
   * that aren't a product — use-case pages carry the same hero but must not
   * claim a product identity in the kicker dot.
   */
  accent: ProductAccentName | `bg-${string}`;
  /**
   * A ready-made visual for the right column, rendered ahead of the tour /
   * illustration / placeholder fallbacks. Use-case pages carry no product
   * tour, so they pass an existing site abstraction here (e.g. the Console
   * illustration) rather than reserving a labelled slot.
   */
  visual?: React.ReactNode;
  /** What the reserved illustration slot is waiting for, when there isn't one yet. */
  placeholderLabel?: string;
  /**
   * Where the three benefits sit relative to the CTA. Product pages keep
   * `below-cta` — the 2026-08-06 review moved them there because they were
   * pushing the CTA below the fold on /orm. Use-case pages ask for
   * `above-cta`, which is the order their approved copy is written in
   * (André, 2026-08-13); their copy is short enough to carry it.
   */
  benefitsPlacement?: "above-cta" | "below-cta";
}) {
  const Illustration = hero.illustration ? PRODUCT_ILLUSTRATIONS[hero.illustration] : null;
  const dotColor = accent.startsWith("bg-")
    ? accent
    : PLATFORM_PRODUCT_ACCENTS[accent as ProductAccentName];
  const benefitsAbove = benefitsPlacement === "above-cta";

  // Above the CTA the list is part of the pitch, so it runs straight on from
  // the subheadline. Below it, it's supporting detail after the ask, and the
  // rule separates the two.
  const benefits = (
    <ul
      className={cn(
        "flex flex-col gap-2.5",
        benefitsAbove ? "mt-7" : "mt-8 border-t border-black/[0.07] pt-7",
      )}
    >
      {hero.benefits.map((label, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-[0.9375rem] font-semibold text-foreground"
        >
          <CheckBold className={cn("mt-0.5 size-4 shrink-0", CHECK_COLORS[i % 3])} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );

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
          {/* the demo takes the larger half — the copy column is short enough
              now that an even split left it stranded beside a tall panel */}
          <div className="mx-auto grid max-w-site items-center gap-12 pb-20 pt-36 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:pb-28 md:pt-48 lg:gap-16">
            {/* copy */}
            <div className="flex flex-col items-start">
              {/* the site's standard tagline: sentence case, ink at 70%, colour
                  carried by the dot — never uppercase, letter-spaced or grey
                  (documented on /brand) */}
              <RoleKicker color={dotColor}>{name}</RoleKicker>
              {/* 16ch is the intended measure, but at the top of the clamp it
                  resolves wider than this column, so the column has to be the
                  hard limit — otherwise a headline with a long nowrap emphasis
                  runs into the illustration beside it. */}
              <h1 className="isolate mt-4 max-w-[min(16ch,100%)] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                <Headline headline={hero.headline} emphasis={hero.headlineEmphasis} />
              </h1>
              {/* One paragraph on product pages; use-case copy leads with two,
                  so an array renders a stacked pair at the same measure. */}
              {(Array.isArray(hero.subheadline) ? hero.subheadline : [hero.subheadline]).map(
                (para, i) => (
                  <p
                    key={i}
                    className={cn(
                      "max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground",
                      i === 0 ? "mt-6" : "mt-4",
                    )}
                  >
                    {para}
                  </p>
                ),
              )}
              {/* Benefits support the CTA rather than delaying it — on product
                  pages they sit below it, so they carry their original weight
                  without competing. It was the position that pushed the CTA
                  down, not the type. */}
              {benefitsAbove ? benefits : null}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrismButton href={hero.primaryCta.href} size="lg">
                  {hero.primaryCta.label}
                </PrismButton>
                <PrismButtonOutline href={hero.secondaryCta.href} size="lg">
                  {hero.secondaryCta.label}
                </PrismButtonOutline>
              </div>
              {hero.microline ? (
                <p className="mt-3.5 text-sm text-muted-foreground">{hero.microline}</p>
              ) : null}
              {benefitsAbove ? null : benefits}
            </div>

            {/* the demo: the ray crosses the panel behind it — light passing
                through the product */}
            <div className="relative max-md:mt-4 md:self-stretch">
              {/* slimmer on mobile so the tails don't dominate the panel */}
              <PrismRay
                className="left-[75%] top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-[64rem]"
                angle={-50}
                intensity="hero"
              />
              <div className="relative md:h-full">
                {/* length, not truthiness: `tour: []` is a plausible
                    intermediate state while editing content, and it is truthy —
                    it would render a tour whose `% stops.length` is NaN, giving
                    an empty card with no tabs instead of falling through here */}
                {visual ? (
                  <div className="max-md:aspect-[4/3] md:flex md:h-full md:items-center">
                    {visual}
                  </div>
                ) : hero.tour?.length ? (
                  <ProductTour stops={hero.tour} />
                ) : Illustration ? (
                  <div className="max-md:aspect-[4/3] md:h-full">
                    <Illustration />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white/70 backdrop-blur-sm max-md:aspect-[4/3]">
                    <p className="max-w-[24ch] text-center text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {placeholderLabel}
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
