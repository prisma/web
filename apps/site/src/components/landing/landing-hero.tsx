import type { ReactNode } from "react";
import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PLATFORM_PRODUCT_ACCENTS } from "@/components/product/icons";
import { ProductTour } from "@/components/product/product-tour";
import { CONSOLE_SIGNUP_URL, CTA_LABEL, type LandingContent } from "./content";
import { HERO_CTA_ID } from "./landing-sticky-cta";

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

// The product hero (product/product-hero.tsx) with the conversion changes the
// ad brief asks for: one CTA instead of two, full width on phones, the offer
// right under it and nothing else competing with it in the column, and the
// visual slot taking either the product tour or a page-specific panel. The wrapped prismatic panel and the ray are the same so the page
// reads as a Prisma page and not as a template.
export function LandingHero({
  content,
  visual,
}: {
  content: LandingContent;
  /** Replaces the product tour in the visual slot. */
  visual?: ReactNode;
}) {
  const { hero, kicker, accent } = content;
  const ctaLabel = content.ctaLabel ?? CTA_LABEL;

  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
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
          <div className="mx-auto grid max-w-site items-center gap-12 pb-16 pt-32 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:pb-24 md:pt-44 lg:gap-16">
            <div className="flex flex-col items-start">
              <RoleKicker color={PLATFORM_PRODUCT_ACCENTS[accent]}>{kicker}</RoleKicker>
              {/* Up to ~22ch: the strategy page asks the headline to name the
                  outcome in the developer's words, which runs longer than the
                  product pages' 16ch, so the clamp steps down a size. */}
              <h1 className="isolate mt-4 max-w-[min(24ch,100%)] text-balance text-[clamp(2.25rem,3.5vw,3.25rem)] leading-[1.08]">
                <Headline headline={hero.headline} emphasis={hero.headlineEmphasis} />
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>
              <div id={HERO_CTA_ID} className="mt-8 w-full sm:w-auto">
                <PrismButton
                  href={CONSOLE_SIGNUP_URL}
                  size="lg"
                  ctaLocation="lp_hero"
                  className="w-full justify-center sm:w-auto [&>a]:w-full [&>a]:justify-center [&>a]:px-10 sm:[&>a]:min-w-[15rem]"
                >
                  {ctaLabel}
                </PrismButton>
              </div>
              {/* the offer: the real free-plan terms, right under the action */}
              <p className="mt-4 flex max-w-[44ch] items-start gap-2 text-[0.9375rem] font-medium leading-snug text-foreground/85">
                <span
                  aria-hidden
                  className="mt-[0.4em] size-2 shrink-0 rounded-full bg-gradient-to-r from-prism-cyan-400 via-prism-yellow-300 to-prism-red-500"
                />
                {hero.microline}
              </p>
            </div>

            <div className="relative max-md:mt-4 md:self-stretch">
              <PrismRay
                className="left-[75%] top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-[64rem]"
                angle={-50}
                intensity="hero"
              />
              <div className="relative md:h-full">
                {visual ? (
                  <div className="md:h-full">{visual}</div>
                ) : hero.tour?.length ? (
                  <ProductTour stops={hero.tour} id={`lp-${content.slug}-tour`} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
