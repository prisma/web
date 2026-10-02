import { GlassGlide } from "@/components/brand/glass-glide";
import { Texture } from "@/components/brand/texture";

// /changelog hero — the wrapped prismatic panel, centred like customers-hero:
// the page opens on a claim, not a form or product visual, so there's no
// second column to balance. Wash values are product-hero's short-panel
// calibration, not the homepage's, so the beam fan doesn't bloom up behind the
// subhead and cost it contrast.
//
// The live changelog opens on a bare "Changelog / What's new in Prisma" stack
// on white. Same words, given the brand's front door: the spectral wash, the
// grain, and one phrase lit by the glass glide.
export function ChangelogHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash + beam fan dispersing to white above */}
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
          {/* top padding = bottom padding + the fixed header's footprint */}
          <div className="mx-auto max-w-site pb-14 pt-32 md:pb-16 md:pt-44">
            <div className="flex animate-hero-rise flex-col items-center text-center motion-reduce:animate-none">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-1 text-sm font-semibold text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.05)] backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-prism-cyan-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-prism-cyan-500" />
                </span>
                What&apos;s new in Prisma
              </span>

              <h1 className="isolate max-w-[min(18ch,100%)] text-balance text-[clamp(2.5rem,4.4vw,3.75rem)] leading-[1.04]">
                The <GlassGlide>Changelog</GlassGlide>
              </h1>
              <p className="mt-6 max-w-[54ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                New features, improvements, and fixes across Prisma ORM, Prisma Postgres, and the
                platform — shipped continuously and gathered here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
