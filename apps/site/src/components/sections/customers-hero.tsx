import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { Texture } from "@/components/brand/texture";
import { BAND_LOGOS } from "@/data/customers";

// /customers hero — the wrapped prismatic panel, centred rather than split:
// this page opens on a claim and a proof band, not on a form or a product
// visual, so there is no second column to balance (contact-hero.tsx splits at
// lg for exactly that reason).
//
// A split layout with the marks drifting in a constellation beside the copy was
// tried and reverted (André, 2026-08-17). Centred, with the band reading as one
// roster across the full width, is the version that stays.
//
// The "Built with Prisma" logo band lives INSIDE the panel, sitting on the
// spectral wash. The approved copy runs that label straight off the CTAs with
// no heading marker, so it reads as the panel's footer rather than as its own
// section. The second, much wider logo moment (all 44 community marks) is the
// marquee further down, which answers "how many" where this answers "who".
//
// Wash values are product-hero's calibration, not the homepage's, for the same
// reason contact-hero gives: this panel is short, and the homepage's stronger
// values bloom up behind the headline and cost the subhead its contrast.
export function CustomersHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash + beam fan dispersing to white above, same
            values as product-hero.tsx and contact-hero.tsx */}
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
          <div className="mx-auto max-w-site pb-16 pt-32 md:pb-20 md:pt-44">
            <div className="flex animate-hero-rise flex-col items-center text-center motion-reduce:animate-none">
              <h1 className="isolate max-w-[min(20ch,100%)] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                How teams <GlassGlide>ship faster</GlassGlide> with Prisma
              </h1>
              <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Real teams, real production stories. See how developers use Prisma to build, deploy,
                and scale without wrestling their backend at every step.
              </p>
              <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <PrismButton href="https://console.prisma.io" size="lg">
                  Get started free
                </PrismButton>
                <PrismButtonOutline href="/contact" size="lg">
                  Talk to us
                </PrismButtonOutline>
              </div>
            </div>

            {/* the proof band, on the wash */}
            <div className="mt-20 animate-hero-rise-late motion-reduce:animate-none">
              <p className="text-center text-sm font-semibold text-foreground/70">
                Built with Prisma
              </p>
              {/* Static rather than a marquee: twelve marks are few enough to
                  show at once, and a fixed roster reads as "these companies"
                  where a marquee reads as "a crowd". The crowd is the marquee
                  below.
                  An explicit grid rather than flex-wrap — twelve items divide
                  evenly at every breakpoint here (6/4/3/2 per row), where
                  wrapping left a lopsided 8-then-4 at desktop width. */}
              <ul className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {BAND_LOGOS.map((logo) => (
                  <li key={logo.name}>
                    <BandLogo logo={logo} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BandLogo({ logo }: { logo: (typeof BAND_LOGOS)[number] }) {
  const mark = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      alt={logo.name}
      className="max-h-7 w-auto max-w-[7rem] object-contain"
      loading="lazy"
      draggable={false}
    />
  );

  const tile =
    "spectrum-border flex h-[4.5rem] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 px-5 backdrop-blur-sm";

  // Insta Group is the one mark prisma.io carries without a link.
  if (!logo.href) {
    return <div className={tile}>{mark}</div>;
  }

  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.name}
      className={`${tile} transition-[transform,border-color] duration-500 ease-out hover:scale-[0.97] hover:border-transparent motion-reduce:hover:scale-100`}
    >
      {mark}
    </a>
  );
}
