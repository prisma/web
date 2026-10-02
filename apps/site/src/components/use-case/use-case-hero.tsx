import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { RobotStage } from "@/components/brand/robot-stage";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CheckBold } from "@/components/icons/forma";
import type { ProductPageContent } from "@/components/product/types";
import { cn } from "@/lib/utils";

// The hero every use-case page shares — AI & agents and the three audience
// segments alike. Previously each page had its own: a copy column beside a
// purpose-built console panel, stretched to whatever height the copy set.
//
// Reworked on client feedback (2026-09-04): the console abstractions are out,
// the agent character is in, and the content is re-laid-out around it. Not one
// word of copy changed — only where each piece sits:
//
//   · kicker
//   headline                              [ the character on its stage ]
//   two paragraphs
//   primary + secondary CTA
//   ────────────────────────────────────────────────────────────────────
//   ✓ benefit          ✓ benefit          ✓ benefit
//
// The three benefits used to run down the bottom of the copy column, which
// made that column tall enough that anything beside it had to stretch to a
// shape it didn't want. On their own rule they read at equal weight, and the
// character gets to sit at the copy's optical centre instead of being inflated
// to match it. The headline picks up the height that frees.
const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"];

type Hero = ProductPageContent["hero"];

function Headline({ headline, emphasis }: { headline: string; emphasis?: string }) {
  const at = emphasis ? headline.indexOf(emphasis) : -1;
  if (!emphasis || at === -1) return <>{headline}</>;
  return (
    <>
      {headline.slice(0, at)}
      <GlassGlide>{emphasis}</GlassGlide>
      {headline.slice(at + emphasis.length)}
    </>
  );
}

export function UseCaseHero({ name, hero }: { name: string; hero: Hero }) {
  const paras = Array.isArray(hero.subheadline) ? hero.subheadline : [hero.subheadline];
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — same values as the site hero */}
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
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto max-w-site pb-16 pt-32 md:pb-20 md:pt-40">
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
              <div className="flex flex-col items-start">
                <RoleKicker color="bg-prism-cyan-400">{name}</RoleKicker>
                <h1 className="isolate mt-5 max-w-[min(18ch,100%)] text-balance text-[clamp(2.375rem,3.4vw,3.125rem)] leading-[1.06]">
                  <Headline headline={hero.headline} emphasis={hero.headlineEmphasis} />
                </h1>
                {paras.map((para, i) => (
                  <p
                    key={i}
                    className={cn(
                      "max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground",
                      i === 0 ? "mt-6" : "mt-4",
                    )}
                  >
                    {para}
                  </p>
                ))}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <PrismButton href={hero.primaryCta.href} size="lg">
                    {hero.primaryCta.label}
                  </PrismButton>
                  <PrismButtonOutline href={hero.secondaryCta.href} size="lg">
                    {hero.secondaryCta.label}
                  </PrismButtonOutline>
                </div>
              </div>

              {/* the character, centred on the copy. No prism ray here — the
                  old heroes hid one behind an opaque console panel; with the
                  panel gone it just slices the character in half. The stage
                  carries its own spectrum instead. */}
              {/* Single-column, the character follows the CTAs rather than
                  leading — the headline is the message, and a full-width
                  portrait above it pushes that message below the fold.
                  No auto margins here: an auto margin on a grid item sizes it
                  to its content, and the stage is absolutely positioned, so
                  the whole thing collapses to nothing. RobotStage centres
                  itself and caps its own width. */}
              <div className="min-w-0">
                <RobotStage />
              </div>
            </div>

            {/* the benefits, on their own rule under the whole hero */}
            <ul className="mt-12 grid gap-x-10 gap-y-5 border-t border-black/[0.07] pt-8 sm:grid-cols-3 md:mt-16">
              {hero.benefits.map((label, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-pretty text-[0.9375rem] font-semibold leading-snug text-foreground"
                >
                  <CheckBold
                    className={cn("mt-[0.15em] size-4 shrink-0", CHECK_COLORS[i % 3])}
                    aria-hidden
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
