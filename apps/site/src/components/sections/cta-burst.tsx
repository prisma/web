import { CheckBold } from "@/components/icons/forma";
import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { Texture } from "@/components/brand/texture";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Spectrum bloom behind the glass prisms (same treatment as the hero corner).
const SPECTRUM =
  "conic-gradient(var(--color-prism-yellow-300), var(--color-prism-red-500) 32%, var(--color-prism-cyan-400) 64%, var(--color-prism-yellow-300))";

// The homepage closing CTA — the abstraction idiom scaled to the pitch
// itself: a video card (32px padding, drifting clouds — pre-processed to
// half speed with the tail crossfaded into the head so the loop is seamless
// and always drifts forward) wrapping a glassy white card with the CTA copy
// centered over the hero's spectral bottom treatment. The photography behind
// the video doubles as its loading poster and the reduced-motion fallback.

const CHECKS = [
  { label: "Built for how your agent ships now", color: "text-prism-cyan-500" },
  { label: "Postgres and hosting when you need them", color: "text-prism-yellow-400" },
  { label: "Type-safe ORM, free and always will be", color: "text-prism-red-500" },
] as const;

type Cta = { label: string; href: string };

type CtaBurstProps = {
  headline?: React.ReactNode;
  /** Override the headline measure (default max-w-[20ch]) when custom copy needs longer lines. */
  headlineMaxWidth?: string;
  /** Override the body measure (default max-w-[52ch]). */
  bodyMaxWidth?: string;
  body?: string;
  checks?: readonly { label: string; color: string }[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

export function CtaBurst({
  headline = "Ready to let your agent run the full loop?",
  headlineMaxWidth = "max-w-[20ch]",
  bodyMaxWidth = "max-w-[52ch]",
  body = "The TypeScript stack 500K+ developers trust. Start with the free ORM, and add the rest of the platform when you need it.",
  checks = CHECKS,
  primaryCta = { label: "Get started free", href: "https://console.prisma.io" },
  secondaryCta = { label: "See pricing", href: "/pricing" },
}: CtaBurstProps = {}) {
  return (
    <section className="bg-white px-3 py-24 sm:px-4 sm:py-32">
      <div className="mx-auto max-w-[96rem]">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-[url('/brand/agent-loop.jpg')] bg-cover bg-center p-8">
          <video
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="pointer-events-none absolute inset-0 size-full object-cover motion-reduce:hidden"
          >
            <source src="/brand/cta-clouds-loop.mp4" type="video/mp4" />
          </video>
          {/* translucent over the clouds — the video ghosts through the glass */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-card/70 shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)] backdrop-blur-lg">
            {/* the hero's spectral bottom: wash + beam fan, dispersing to
                white above (same values as hero-home.tsx) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* cyan and red run larger and softer than the hero's so the
                  three hues blend across the whole bottom instead of the
                  yellow holding the middle */}
              <div
                className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
                style={{
                  background: [
                    "radial-gradient(64% 52% at 26% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 72%)",
                    "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 22%, transparent), transparent 66%)",
                    "radial-gradient(60% 48% at 76% 100%, color-mix(in srgb, var(--color-prism-red-400) 30%, transparent), transparent 72%)",
                  ].join(","),
                }}
              />
              <div className="absolute bottom-[-24rem] left-[16%] h-[60rem] w-52 origin-bottom rotate-[-24deg] bg-prism-cyan-300/50 blur-[96px]" />
              <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-40 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/50 blur-[72px]" />
              <div className="absolute bottom-[-28rem] right-[14%] h-[60rem] w-52 origin-bottom rotate-[24deg] bg-prism-red-300/50 blur-[96px]" />
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent via-white/30 to-white/50" />

              {/* the glass prisms breaking opposite corners, light
                  concentrating behind them (hero idiom, square + hexagon) */}
              <div
                className="absolute bottom-[-6rem] right-[-4.5rem] h-[16rem] w-[24rem] rounded-full opacity-25 blur-[70px]"
                style={{ backgroundImage: SPECTRUM }}
              />
              <GlassPrismSpin
                shape="hexagon"
                period={21}
                initialAngle={0.9}
                className="bottom-[-4.5rem] right-[-3.5rem] w-[14rem] max-md:bottom-[-3rem] max-md:right-[-2rem] max-md:w-[8rem]"
              />
              <div
                className="absolute left-[-5rem] top-[-0.75rem] h-[16rem] w-[24rem] rounded-full opacity-20 blur-[60px]"
                style={{ backgroundImage: SPECTRUM }}
              />
              <GlassPrismSpin
                shape="rect"
                period={32}
                initialAngle={2.2}
                className="left-[-4rem] top-[1.25rem] w-[15rem] max-md:left-[-2.5rem] max-md:top-[0.75rem] max-md:w-[9rem]"
              />
            </div>
            <Texture opacity={0.06} blend="multiply" />

            {/* centered on desktop; left-aligned on mobile like the rest of
                the page */}
            <div className="relative flex flex-col items-start px-6 py-16 text-left sm:items-center sm:px-10 sm:py-20 sm:text-center">
              <Reveal>
                <h2
                  className={cn(
                    headlineMaxWidth,
                    "text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]",
                  )}
                >
                  {headline}
                </h2>
              </Reveal>

              <Reveal delay={0.08}>
                <p
                  className={cn(
                    "mt-5 text-pretty leading-relaxed text-muted-foreground",
                    bodyMaxWidth,
                  )}
                >
                  {body}
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <ul className="mt-7 flex flex-wrap items-center justify-start gap-x-7 gap-y-3 sm:justify-center">
                  {checks.map(({ label, color }, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-left text-[15px] font-semibold text-foreground"
                    >
                      <CheckBold className={cn("mt-0.5 size-4 shrink-0", color)} aria-hidden />
                      {label}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal
                delay={0.24}
                className="mt-9 flex flex-wrap items-center justify-start gap-3 sm:justify-center"
              >
                <PrismButton href={primaryCta.href}>{primaryCta.label}</PrismButton>
                <PrismButtonOutline href={secondaryCta.href}>
                  {secondaryCta.label}
                </PrismButtonOutline>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
